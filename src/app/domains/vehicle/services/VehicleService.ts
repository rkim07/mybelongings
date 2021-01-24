import * as _ from 'lodash';
import { Container, Inject } from 'typedi';
import { Service } from 'typedi';
import { HandleUpstreamError, Key, Vehicle } from '../../shared/models/models';
import { FileUploadService } from '../../shared/services/FileUploadService';
import { VehicleApiService } from './VehicleApiService';
import { VehicleCollectionService } from './VehicleCollectionService';

export enum VEHICLE_SERVICE_ERRORS {
    VEHICLE_NOT_FOUND = 'VEHICLE_SERVICE_ERRORS.VEHICLE_NOT_FOUND',
    VEHICLES_NOT_FOUND = 'VEHICLE_SERVICE_ERRORS.VEHICLES_NOT_FOUND',
    VEHICLE_NOT_ADDED = 'VEHICLE_SERVICE_ERRORS.VEHICLE_NOT_ADDED',
    VEHICLE_NOT_UPDATED = 'VEHICLE_SERVICE_ERRORS.VEHICLE_NOT_UPDATED',
    VIN_ALREADY_EXISTS = 'VEHICLE_SERVICE_ERRORS.VIN_ALREADY_EXISTS',
    VEHICLE_KEY_EMPTY = 'VEHICLE_SERVICE_ERRORS.VEHICLE_KEY_EMPTY',
    EMPTY_NEW_VEHICLE_INFO = 'VEHICLE_SERVICE_ERRORS.EMPTY_NEW_VEHICLE_INFO',
    USER_KEY_EMPTY = 'VEHICLE_SERVICE_ERRORS.USER_KEY_EMPTY'
}

@Service()
export class VehicleService {

    @Inject()
    private vehicleCollectionService: VehicleCollectionService = Container.get(VehicleCollectionService);

    @Inject()
    private vehicleApiService: VehicleApiService = Container.get(VehicleApiService);

    @Inject()
    private fileUploadService: FileUploadService = Container.get(FileUploadService);

    /**
     * Get vehicle by key
     *
     * @param vehicleKey
     * @param origin
     */
    public async getVehicle(vehicleKey: Key, origin?: string): Promise<any> {
        if (!vehicleKey) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_ERRORS.VEHICLE_KEY_EMPTY);
        }

        const vehicle = await this.vehicleCollectionService.findOne({ key: { $eq: vehicleKey }});

        if (!vehicle) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_ERRORS.VEHICLE_NOT_FOUND);
        }

        return await this.addDependencies(origin, vehicle);
    }

    /**
     * Get all vehicles
     *
     * @param origin
     */
    public async getVehicles(origin: string): Promise<any> {
        const vehicles = await this.vehicleCollectionService.getVehicles();

        if (vehicles.length === 0) {
            return [];
        }

        return await Promise.all(vehicles.map(async (vehicle) => {
            return await this.addDependencies(origin, vehicle);
        }));
    }

    /**
     * Get all vehicles by user key
     *
     * @param userKey
     * @param origin
     */
    public async getUserVehicles(userKey: Key, origin: string): Promise<any> {
        if (!userKey) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_ERRORS.USER_KEY_EMPTY);
        }

        const vehicles = await this.vehicleCollectionService.find({ userKey: { $eq: userKey }});

        if (vehicles.length === 0) {
            return [];
        }

        const results = await Promise.all(vehicles.map(async (vehicle) => {
            return await this.addDependencies(origin, vehicle);
        }));

        return _.sortBy(results, o => o.model);
    }

    /**
     * Add vehicle
     *
     * @param userKey
     * @param origin
     * @param vehicle
     */
    public async addVehicle(userKey: Key, origin: string, vehicle: any): Promise<any> {
        if (!vehicle) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_ERRORS.EMPTY_NEW_VEHICLE_INFO);
        }

        // Make sure VIN numbers are unique
        const vinExists = await this.vehicleCollectionService.findOne({ vin: {$eq: vehicle.vin} });

        if (vinExists) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_ERRORS.VIN_ALREADY_EXISTS);
        }

        const results = await this.vehicleCollectionService.addVehicle(userKey, vehicle);

        if (!results) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_ERRORS.VEHICLE_NOT_ADDED);
        }

        return await this.addDependencies(origin, results);
    }

    /**
     * Update vehicle
     *
     * @param userKey
     * @param vehicleKey
     * @param origin
     * @param vehicle
     */
    public async updateVehicle(userKey: Key, vehicleKey: Key, origin: string, vehicle: any): Promise<any> {
        if (!vehicleKey) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_ERRORS.VEHICLE_KEY_EMPTY);
        }

        const results = await this.vehicleCollectionService.updateVehicle(userKey, vehicleKey, vehicle);

        if (!results) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_ERRORS.VEHICLE_NOT_UPDATED);
        }

        return await this.addDependencies(origin, results);
    }

    /**
     * Deletes a vehicle given an associated vehicle key
     *
     * @param userKey
     * @param vehicleKey
     */
    public async deleteVehicle(userKey: Key, vehicleKey: Key): Promise<any> {
        if (!vehicleKey) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_ERRORS.VEHICLE_KEY_EMPTY);
        }

        const query = {
            $and: [
                { key: { $eq: vehicleKey } },
                { userKey: { $eq: userKey } }
            ]
        };

        const vehicle: Vehicle = await this.vehicleCollectionService.findOne(query);

        if (!vehicle) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_ERRORS.VEHICLES_NOT_FOUND);
        }

        await this.vehicleCollectionService.removeByFieldValue('key', vehicleKey);
        await this.fileUploadService.removeFile(vehicle.image);

        return vehicle;
    }

    /**
     * Add dependencies when returning object
     *
     * @param origin
     * @param vehicle
     * @private
     */
    private async addDependencies(origin, vehicle): Promise<any> {
        const mfr = await this.vehicleApiService.getApiMfr(vehicle.mfrKey);
        const model = await this.vehicleApiService.getApiModel(vehicle.modelKey);

        vehicle['mfrName'] = mfr.mfrName;
        vehicle['model'] = model.model;
        vehicle['image_path'] = this.fileUploadService.setImagePath(origin, vehicle.image, 'vehicle');

        return vehicle;
    }
}
