import * as _ from 'lodash';
import { Container, Inject } from 'typedi';
import { Service } from 'typedi';
import { Code, HandleUpstreamError, Key, Vehicle } from '../../shared/models/models';
import { FileUploadService } from '../../shared/services/FileUploadService';
import { ApiService } from '../../api/services/ApiService';
import { VehiclePurchaseService } from './VehiclePurchaseService';
import { VehicleFinanceService } from './VehicleFinanceService';
import { VehicleCollectionService } from './collections/VehicleCollectionService';

export enum VEHICLE_SERVICE_MESSAGES {
    EMPTY_VEHICLE_KEY = 'VEHICLE_SERVICE_MESSAGES.EMPTY_VEHICLE_KEY',
    EMPTY_NEW_VEHICLE_INFO = 'VEHICLE_SERVICE_MESSAGES.EMPTY_NEW_VEHICLE_INFO',
    EMPTY_USER_KEY = 'VEHICLE_SERVICE_MESSAGES.EMPTY_USER_KEY',
    VEHICLE_NOT_FOUND = 'VEHICLE_SERVICE_MESSAGES.VEHICLE_NOT_FOUND',
    VEHICLES_NOT_FOUND = 'VEHICLE_SERVICE_MESSAGES.VEHICLES_NOT_FOUND',
    VEHICLE_NOT_ADDED = 'VEHICLE_SERVICE_MESSAGES.VEHICLE_NOT_ADDED',
    VEHICLE_NOT_UPDATED = 'VEHICLE_SERVICE_MESSAGES.VEHICLE_NOT_UPDATED',
    EXISTING_VIN = 'VEHICLE_SERVICE_MESSAGES.EXISTING_VIN'
}

/**
 * Key values that will be converted
 * both on request and response
 */
export const vehicleMappingKeys = {
    date: [
        'created',
        'modified',
        'purchased'
    ],
    decimals: [
        'mileage'
    ],
    stringToNumber: [
        'year'
    ],
    capitalizedText: [
        'color',
        'style',
        'condition',
        'model'
    ],
    upperText: [
        'vin',
        'plate'
    ]
};

@Service()
export class VehicleService {

    @Inject()
    private vehicleCollectionService: VehicleCollectionService = Container.get(VehicleCollectionService);

    @Inject()
    private apiService: ApiService = Container.get(ApiService);

    @Inject()
    private vehiclePurchaseService: VehiclePurchaseService = Container.get(VehiclePurchaseService);

    @Inject()
    private vehicleFinanceService: VehicleFinanceService = Container.get(VehicleFinanceService);

    @Inject()
    private fileUploadService: FileUploadService = Container.get(FileUploadService);

    /**
     * Get vehicle by key
     *
     * @param vehicleKey
     * @param host
     */
    public async getVehicle(vehicleKey: Key, host?: string): Promise<any> {
        if (!vehicleKey) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_MESSAGES.EMPTY_VEHICLE_KEY);
        }

        const vehicle = await this.vehicleCollectionService.findOne({ key: { $eq: vehicleKey }});

        if (!vehicle) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_MESSAGES.VEHICLE_NOT_FOUND);
        }

        return await this.addFetchDependencies(vehicle, host);
    }

    /**
     * Get all vehicles
     *
     * @param host
     */
    public async getVehicles(host?: string): Promise<any> {
        const vehicles = await this.vehicleCollectionService.getAll();

        if (vehicles.length === 0) {
            return [];
        }

        return await Promise.all(vehicles.map(async (vehicle) => {
            return await this.addFetchDependencies(vehicle, host);
        }));
    }

    /**
     * Get all vehicles by user key
     *
     * @param userKey
     * @param host
     */
    public async getVehiclesByUser(userKey: Key, host?: string): Promise<any> {
        if (!userKey) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_MESSAGES.EMPTY_USER_KEY);
        }

        const vehicles = await this.vehicleCollectionService.find({ userKey: { $eq: userKey }});

        if (vehicles.length === 0) {
            return [];
        }

        const results = await Promise.all(vehicles.map(async (vehicle) => {
            return await this.addFetchDependencies(vehicle, host);
        }));

        return _.sortBy(results, o => o.model);
    }

    /**
     * Add vehicle
     *
     * @param userKey
     * @param host
     * @param vehicle
     */
    public async addVehicle(userKey: Key, vehicle: any, host?: string): Promise<any> {
        if (!vehicle) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_MESSAGES.EMPTY_NEW_VEHICLE_INFO);
        }

        // Make sure VIN numbers are unique
        const vinExists = await this.vehicleCollectionService.findOne({ vin: { $eq: vehicle.vin }});

        if (vinExists) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_MESSAGES.EXISTING_VIN);
        }

        const addedVehicle = await this.vehicleCollectionService.add(userKey, vehicle);

        if (!addedVehicle) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_MESSAGES.VEHICLE_NOT_ADDED);
        }

        let purchase = {}
        if (!_.isEmpty(vehicle.purchase)) {
            purchase = await this.vehiclePurchaseService.addPurchase(vehicle.key, vehicle.purchase, host);
        }

        let finance = {};
        if (!_.isEmpty(vehicle.finance)) {
            finance = await this.vehicleFinanceService.addFinance(vehicle.key, vehicle.finance, host);
        }

        let insurance = {};
        /*
        if (!_.isEmpty(vehicle.insurance)) {
            await this.vehicleInsuranceService.addInsurance(addedVehicle.key, vehicle.insurance, host);
        }*/

        return await this.addCrudDependecies(addedVehicle, purchase, finance, insurance, host);
    }

    /**
     * Update vehicle
     *
     * @param vehicleKey
     * @param vehicle
     * @param host
     */
    public async updateVehicle(vehicleKey: Key, vehicle: any, host?: string): Promise<any> {
        if (!vehicleKey) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_MESSAGES.EMPTY_VEHICLE_KEY);
        }

        const updatedVehicle = await this.vehicleCollectionService.update(vehicleKey, vehicle);

        if (!updatedVehicle) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_MESSAGES.VEHICLE_NOT_UPDATED);
        }

        let purchase = {}
        if (!_.isEmpty(vehicle.purchase)) {
            purchase = await this.vehiclePurchaseService.updatePurchase(vehicle.purchase.key, vehicle.purchase, host);
        }

        let finance = {};
        if (!_.isEmpty(vehicle.finance)) {
            finance = await this.vehicleFinanceService.updateFinance(vehicle.finance.key, vehicle.finance, host);
        }

        let insurance = {};
        /*
        if (!_.isEmpty(vehicle.insurance)) {
            await this.vehicleInsuranceService.updateInsurance(vehicle.insurance.key, vehicle.insurance, host);
        }*/

        return await this.addCrudDependecies(updatedVehicle, purchase, finance, insurance, host);
    }

    /**
     * Delete vehicle
     *
     * @param vehicleKey
     */
    public async deleteVehicle(vehicleKey: Key): Promise<any> {
        if (!vehicleKey) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_MESSAGES.EMPTY_VEHICLE_KEY);
        }

        const vehicle: Vehicle = await this.vehicleCollectionService.findOne({ key: { $eq: vehicleKey } });

        if (!vehicle) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_MESSAGES.VEHICLE_NOT_FOUND);
        }

        await this.vehicleCollectionService.removeByFieldValue('key', vehicleKey);
        await this.fileUploadService.removeFile(vehicle.image);

        return vehicle;
    }

    /**
     * Fetch dependencies when returning object.
     * Minimize DB fetches
     *
     * @param host
     * @param vehicle
     * @private
     */
    private async addFetchDependencies(vehicle: any, host?: string): Promise<any> {
        const mfr = await this.apiService.getNhtsaMfr(vehicle.mfrKey);
        const model = await this.apiService.getNhtsaModel(vehicle.modelKey);
        const purchase = await this.vehiclePurchaseService.getPurchaseByVehicle(vehicle.key, host);
        const finance = await this.vehicleFinanceService.getFinanceByVehicle(vehicle.key, host);
        //const insurance = await this.insuranceService.getInsuranceByVehicle(vehicle.key);

        return {
            ...vehicle,
            mfrName: mfr.mfrName,
            model: model.model,
            purchase: purchase,
            finance: finance,
            // insurance: insurance,
            imagePath: this.fileUploadService.setFilePath(vehicle.image, host)
        };
    }

    /**
     * CRUD dependencies when returning object.
     * Minimize DB fetches
     *
     * @param vehicle
     * @param purchase
     * @param finance
     * @param insurance
     * @param host
     * @private
     */
    private async addCrudDependecies(vehicle: any, purchase: any, finance: any, insurance: any, host?: string): Promise<any> {
        const mfr = await this.apiService.getNhtsaMfr(vehicle.mfrKey);
        const model = await this.apiService.getNhtsaModel(vehicle.modelKey);

        return {
            ...vehicle,
            mfrName: mfr.mfrName,
            model: model.model,
            purchase: purchase,
            finance: finance,
            // insurance: insurance,
            imagePath: this.fileUploadService.setFilePath(vehicle.image, host)
        };
    }
}
