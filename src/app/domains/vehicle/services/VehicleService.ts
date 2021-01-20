import * as _ from 'lodash';
import { Container, Inject } from 'typedi';
import { Service } from 'typedi';
import { VehicleApiService } from './VehicleApiService';
import { VehicleCollectionService } from './VehicleCollectionService';
import { HandleUpstreamError, Key, Vehicle } from '../../shared/models/models';
import { ImageHelper } from "../../shared/helpers/ImageHelper";
import { FileService } from "../../shared/services/FileService";

export enum VEHICLE_ERRORS {
    VEHICLE_NOT_FOUND = 'VEHICLE_ERRORS.VEHICLE_NOT_FOUND',
    VEHICLES_NOT_FOUND = 'VEHICLE_ERRORS.VEHICLES_NOT_FOUND',
    VEHICLE_NOT_ADDED = 'VEHICLE_ERRORS.VEHICLE_NOT_ADDED',
    VEHICLE_NOT_UPDATED = 'VEHICLE_ERRORS.VEHICLE_NOT_UPDATED',
    VIN_ALREADY_EXISTS = 'VEHICLE_ERRORS.VIN_ALREADY_EXISTS',
    VEHICLE_KEY_EMPTY = 'VEHICLE_ERRORS.VEHICLE_KEY_EMPTY',
    NEW_VEHICLE_EMPTY = 'VEHICLE_ERRORS.NEW_VEHICLE_EMPTY',
    USER_KEY_EMPTY = 'VEHICLE_ERRORS.USER_KEY_EMPTY'
}

@Service()
export class VehicleService {

    @Inject()
    private vehicleCollectionService: VehicleCollectionService = Container.get(VehicleCollectionService);

    @Inject()
    private vehicleApiService: VehicleApiService = Container.get(VehicleApiService);

    @Inject()
    private fileService: FileService = Container.get(FileService);

    /**
     * Get vehicle by key
     *
     * @param key
     * @param url
     */
    public async getVehicle(key: Key, url?: string): Promise<any> {
        if (!key) {
            throw new HandleUpstreamError(VEHICLE_ERRORS.VEHICLE_KEY_EMPTY);
        }

        const vehicle = await this.vehicleCollectionService.findOne({ key: { $eq: key }});

        if (!vehicle) {
            throw new HandleUpstreamError(VEHICLE_ERRORS.VEHICLE_NOT_FOUND);
        }

        return await this.addDependencies(url, vehicle);
    }

    /**
     * Get all vehicles
     *
     * @param url
     */
    public async getVehicles(url: string): Promise<any> {
        const vehicles = await this.vehicleCollectionService.getVehicles();

        if (vehicles.length === 0) {
            throw new HandleUpstreamError(VEHICLE_ERRORS.VEHICLES_NOT_FOUND);
        }

        return await Promise.all(vehicles.map(async (vehicle) => {
            return await this.addDependencies(url, vehicle);
        }));
    }

    /**
     * Get all vehicles by user key
     *
     * @param userKey
     * @param url
     */
    public async getVehiclesByUserKey(userKey: Key, url: string): Promise<any> {
        if (!userKey) {
            throw new HandleUpstreamError(VEHICLE_ERRORS.USER_KEY_EMPTY);
        }

        const vehicles = await this.vehicleCollectionService.find({ userKey: { $eq: userKey }});

        if (vehicles.length === 0) {
            throw new HandleUpstreamError(VEHICLE_ERRORS.VEHICLES_NOT_FOUND);
        }

        const results = await Promise.all(vehicles.map(async (vehicle) => {
            return await this.addDependencies(url, vehicle);
        }));

        return _.sortBy(results, o => o.model);
    }

    /**
     * Add vehicle
     *
     * @param url
     * @param vehicle
     */
    public async addVehicle(url: string, vehicle: any): Promise<any> {
        if (!vehicle) {
            throw new HandleUpstreamError(VEHICLE_ERRORS.NEW_VEHICLE_EMPTY);
        }

        const existingVehicleWithVin = await this.vehicleCollectionService.findByField('vin', vehicle.vin, 1);

        // Make sure VIN numbers are unique
        if (existingVehicleWithVin) {
            throw new HandleUpstreamError(VEHICLE_ERRORS.VIN_ALREADY_EXISTS);
        }

        const results = await this.vehicleCollectionService.updateVehicle(vehicle);

        if (!results) {
            throw new HandleUpstreamError(VEHICLE_ERRORS.VEHICLE_NOT_ADDED);
        }

        return await this.addDependencies(url, results);
    }

    /**
     * Update vehicle
     *
     * @param url
     * @param vehicle
     * @param key
     */
    public async updateVehicle(url: string, vehicle: any, key: Key): Promise<any> {
        if (!key) {
            throw new HandleUpstreamError(VEHICLE_ERRORS.VEHICLE_KEY_EMPTY);
        }

        const existingVehicleWithVin = await this.vehicleCollectionService.findByField('vin', vehicle.vin, 1);

        // Make sure VIN numbers are unique
        if (existingVehicleWithVin.key !== vehicle.key) {
            throw new HandleUpstreamError(VEHICLE_ERRORS.VIN_ALREADY_EXISTS);
        }

        const results = await this.vehicleCollectionService.updateVehicle(vehicle, key);

        if (!results) {
            throw new HandleUpstreamError(VEHICLE_ERRORS.VEHICLE_NOT_UPDATED);
        }

        return await this.addDependencies(url, results);
    }

    /**
     * Deletes a vehicle given an associated vehicle key
     *
     * @param key
     */
    public async deleteVehicle(key: Key): Promise<any> {
        if (!key) {
            throw new HandleUpstreamError(VEHICLE_ERRORS.VEHICLE_KEY_EMPTY);
        }
        const vehicle: Vehicle = await this.vehicleCollectionService.findOne({ key: { $eq: key }});

        if (!vehicle) {
            throw new HandleUpstreamError(VEHICLE_ERRORS.VEHICLES_NOT_FOUND);
        }

        await this.vehicleCollectionService.removeByFieldValue('key', vehicle.key);
        await this.fileService.removeFile(vehicle.image);

        return vehicle;
    }

    /**
     * Add dependencies when returning object
     *
     * @param url
     * @param vehicle
     */
    private async addDependencies(url, vehicle) {
        const mfr = await this.vehicleApiService.getApiMfr(vehicle.mfrKey);
        const model = await this.vehicleApiService.getApiModel(vehicle.modelKey);

        vehicle['mfrName'] = mfr.mfrName;
        vehicle['model'] = model.model;
        vehicle['image_path'] = ImageHelper.getImagePath(url, vehicle.image);

        return vehicle;
    }
}
