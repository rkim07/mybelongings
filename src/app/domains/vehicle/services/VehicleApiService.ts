import * as _ from 'lodash';
import { readFileSync } from 'fs';
import { Container, Inject, Service } from 'typedi';
import * as config from 'config';
import * as requestPromise from 'request-promise';
import { NhtsaApiVehicleMfr, NhtsaApiVehicleModel, Key, HandleUpstreamError } from '../../shared/models/models';
import { NhtsaApiVehicleMfrInterface, NhtsaApiVehicleModelInterface } from '../../shared/interfaces/vehicle'
import { NhtsaApiVehicleMfrCollectionService } from './NhtsaApiVehicleMfrCollectionService';
import { NhtsaApiVehicleModelCollectionService } from './NhtsaApiVehicleModelCollectionService';
import {VehicleApiHelper} from "../../shared/helpers/VehicleApiHelper";
import {VEHICLE_ERRORS} from "./VehicleService";

const path = require("path");

const NHTSA_LIST_SOURCE: string = config.get('api.vehicles.nhtsa.listSource');
const NHTSA_MFR_URL: string = config.get('api.vehicles.nhtsa.mfrUrl');
const NHTSA_MFR_MODELS_URL: string = config.get('api.vehicles.nhtsa.mfrModelsUrl');
const LIST_FORMAT: string = config.get('api.vehicles.nhtsa.listFormat');

export enum VEHICLE_API_ERRORS {
    VEHICLE_MFR_NOT_FOUND = 'VEHICLE_API_ERRORS.VEHICLE_MFR_NOT_FOUND',
    VEHICLE_MFRS_NOT_FOUND = 'VEHICLE_API_ERRORS.VEHICLE_MFRS_NOT_FOUND',
    VEHICLE_MODEL_NOT_FOUND = 'VEHICLE_API_ERRORS.VEHICLE_MODEL_NOT_FOUND',
    VEHICLE_MODELS_NOT_FOUND = 'VEHICLE_API_ERRORS.VEHICLE_MODELS_NOT_FOUND',
    MFR_KEY_EMPTY = 'VEHICLE_API_ERRORS.MFR_KEY_EMPTY',
    MODEL_KEY_EMPTY = 'VEHICLE_API_ERRORS.MODEL_KEY_EMPTY'
}

@Service()
export class VehicleApiService {

    @Inject()
    private nhtsaApiVehicleMfrCollectionService: NhtsaApiVehicleMfrCollectionService = Container.get(NhtsaApiVehicleMfrCollectionService);

    @Inject()
    private nhtsaApiVehicleModelCollectionService: NhtsaApiVehicleModelCollectionService = Container.get(NhtsaApiVehicleModelCollectionService);

    /**
     * Get API manufacturer by key
     *
     * @param mfrKey
     */
    public async getApiMfr(mfrKey: Key): Promise<NhtsaApiVehicleMfr> {
        const mfr = await this.nhtsaApiVehicleMfrCollectionService.findOne({ key: { $eq: mfrKey }});

        if (!mfr) {
            throw new HandleUpstreamError(VEHICLE_API_ERRORS.VEHICLE_MFR_NOT_FOUND);
        }

        mfr['mfrName'] = VehicleApiService.formatName(mfr.mfrName);
        return mfr;
    }

    /**
     * Get all API manufacturers
     */
    public async getApiMfrs(): Promise<NhtsaApiVehicleMfr[]> {
        const mfrs = await this.nhtsaApiVehicleMfrCollectionService.getApiMfrs();

        if (mfrs.length === 0) {
            throw new HandleUpstreamError(VEHICLE_API_ERRORS.VEHICLE_MFRS_NOT_FOUND);
        }

        return await Promise.all(mfrs.map((mfr) => {
            mfr['mfrName'] = VehicleApiService.formatName(mfr.mfrName);
            return mfr;
        }));
    }

    /**
     * Get API manufacturer by key
     *
     * @param modelKey
     * @param mfrName
     */
    public async getApiModel(modelKey: Key, mfrName: string = null): Promise<NhtsaApiVehicleModel> {
        if (!modelKey) {
            throw new HandleUpstreamError(VEHICLE_API_ERRORS.MODEL_KEY_EMPTY);
        }
        const model = await this.nhtsaApiVehicleModelCollectionService.findOne({ key: { $eq: modelKey }});

        if (!model) {
            throw new HandleUpstreamError(VEHICLE_API_ERRORS.VEHICLE_MODEL_NOT_FOUND);
        }

        model['model'] = VehicleApiService.formatName(mfrName, model.model);
        return model;
    }

    /**
     * Get all API manufacturer models
     */
    public async getApiModels(): Promise<NhtsaApiVehicleModel[]> {
        const models = await this.nhtsaApiVehicleModelCollectionService.getApiModels();

        //@TODO name filtering solution since manufacturer name is unknown but required by custom filter
        return await Promise.all(models.map((model) => {
            model['model'] = VehicleApiService.formatName(null, model.model);
            return model;
        }));
    }

    /**
     * Get all vehicle models by manufacturer ID from DB
     *
     * @param mfrKey
     */
    public async getApiModelsByMfrKey(mfrKey: Key): Promise<NhtsaApiVehicleModel[]> {
        if (!mfrKey) {
            throw new HandleUpstreamError(VEHICLE_API_ERRORS.MFR_KEY_EMPTY);
        }
        const models = await this.nhtsaApiVehicleModelCollectionService.getApiModelsByMfrKey(mfrKey);

        if (models.length === 0) {
            throw new HandleUpstreamError(VEHICLE_API_ERRORS.VEHICLE_MODELS_NOT_FOUND);
        }

        const mfr = await this.getApiMfr(mfrKey);

        return await Promise.all(models.map((model) => {
            model['model'] = VehicleApiService.formatName(mfr.mfrName, model.model);
            return model;
        }));
    }

    /**
     * Save NHTSA manufacturers list to DB
     *
     * @param mfr
     */
    public async updateApiMfrs(mfr: any): Promise<any> {
        return await this.nhtsaApiVehicleMfrCollectionService.updateMfrs({
            mfrId: mfr.Make_ID,
            mfrName: mfr.Make_Name,
        });
    }

    /**
     * Save NHTSA manufacturers models list to DB
     *
     * @param mfrKey
     * @param model
     */
    private async updateApiModelsByMfrKey(mfrKey: Key, model: any): Promise<any> {
        return await this.nhtsaApiVehicleModelCollectionService.updateModel({
            mfrKey: mfrKey,
            modelId: model.Model_ID,
            model: escape(model.Model_Name)
        });
    }

    /**
     * Sync with NHTSA Vehicle API
     */
    public async syncNhtsaApi(): Promise<boolean> {
        try {
            // Fetch API and get all vehicles manufactures
            const list = await this.getNhtsaMfrs(NHTSA_LIST_SOURCE);
            const filterClass = VehicleApiHelper.getFilterClass();

            // Save to API manufacturers DB
            const savedMfrs: any = await Promise.all(list.map(async (mfr) => {
                // Remove all hyphens and save as lower case
                mfr['Make_Name'] = filterClass.formatDbMfrName(mfr.Make_Name);
                return await this.updateApiMfrs(mfr);
            }));

            if (savedMfrs.length === 0) {
                throw new HandleUpstreamError(VEHICLE_API_ERRORS.VEHICLE_MFRS_NOT_FOUND);
            }

            // Add or update all manufacturers models
            for (const mfr of savedMfrs) {
                const apiModels = await this.getNhtsaModelsByMfrId(mfr.mfrId);

                if (apiModels) {
                    await Promise.all(apiModels.map(async (model) => {
                        // Remove all space special character and save as lower case
                        model['Make_Name'] = filterClass.formatDbMfrName(model.Make_Name);
                        model['Model_Name'] = filterClass.formatDbModelName(model.Model_Name);
                        await this.updateApiModelsByMfrKey(mfr.key, model);
                    }));
                }
            }

            return true;
        } catch (err) {
            throw new Error('Failed to sync with NHTSA API.')
        }
    }

    /**
     * Get API vehicle manufacturers either locally or remotely
     */
    private async getNhtsaMfrs(listSource): Promise<any> {
        if (listSource === 'local') {
            return JSON.parse(readFileSync(path.resolve(__dirname, '../../shared/fixtures/whitelistedCarMfrs.json'), 'utf8'));
        }

        const apiList = await requestPromise({
            method: 'GET',
            uri: `${NHTSA_MFR_URL}?format=${LIST_FORMAT}`,
            json: true
        }).then((response) => {
            return response.Results;
        }).catch(err => {
            throw new Error(`Failed to connect to NHTSA API vehicle manufacturers list`);
        });

        const blacklistedCarMfrs = JSON.parse(readFileSync(path.resolve(__dirname, '../../shared/fixtures/blacklistedCarMfrs.json'), 'utf8'));

        return _.difference(apiList, blacklistedCarMfrs);
    }

    /**
     * Get API vehicle models by manufacturer ID remotely
     *
     * @param mfrId
     */
    private async getNhtsaModelsByMfrId(mfrId: number): Promise<any> {
        if (!mfrId) {
            return [];
        }

        return await requestPromise({
            method: 'GET',
            uri: `${NHTSA_MFR_MODELS_URL}/${mfrId}?format=${LIST_FORMAT}`,
            json: true
        }).then((response) => {
            return response.Results;
        }).catch(err => {
            throw new Error(`Failed to connect to NHTSA API vehicle models list`);
        });
    }

    /**
     * Get specific class instance by manufacturer name and return its
     * formatted name
     *
     * @param mfrName
     * @param modelName
     * @private
     */
    private static formatName(mfrName, modelName = null) {
        const filterClass = VehicleApiHelper.getFilterClass(mfrName);

        return mfrName && !modelName ?
            filterClass.formatFrontEndMfrName(mfrName)
            :
            filterClass.formatFrontEndModelName(modelName);
    }
}
