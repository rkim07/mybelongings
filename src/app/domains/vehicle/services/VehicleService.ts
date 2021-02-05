import * as _ from 'lodash';
import { Container, Inject } from 'typedi';
import { Service } from 'typedi';
import { Code, HandleUpstreamError, Key, Vehicle } from '../../shared/models/models';
import { FileUploadService } from '../../shared/services/FileUploadService';
import { VehicleApiService } from './VehicleApiService';
import { VehicleDealershipService } from './VehicleDealershipService';
import { VehicleCollectionService } from './collections/VehicleCollectionService';

export enum VEHICLE_SERVICE_MESSAGES {
    VEHICLE_NOT_FOUND = 'VEHICLE_SERVICE_MESSAGES.VEHICLE_NOT_FOUND',
    VEHICLES_NOT_FOUND = 'VEHICLE_SERVICE_MESSAGES.VEHICLES_NOT_FOUND',
    VEHICLE_NOT_ADDED = 'VEHICLE_SERVICE_MESSAGES.VEHICLE_NOT_ADDED',
    VEHICLE_NOT_UPDATED = 'VEHICLE_SERVICE_MESSAGES.VEHICLE_NOT_UPDATED',
    EXISTING_VIN = 'VEHICLE_SERVICE_MESSAGES.EXISTING_VIN',
    VEHICLE_KEY_EMPTY = 'VEHICLE_SERVICE_MESSAGES.VEHICLE_KEY_EMPTY',
    EMPTY_NEW_VEHICLE_INFO = 'VEHICLE_SERVICE_MESSAGES.EMPTY_NEW_VEHICLE_INFO',
    USER_KEY_EMPTY = 'VEHICLE_SERVICE_MESSAGES.USER_KEY_EMPTY'
}

@Service()
export class VehicleService {

    @Inject()
    private vehicleCollectionService: VehicleCollectionService = Container.get(VehicleCollectionService);

    @Inject()
    private vehicleApiService: VehicleApiService = Container.get(VehicleApiService);

    @Inject()
    private vehicleDealershipService: VehicleDealershipService = Container.get(VehicleDealershipService);

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
            throw new HandleUpstreamError(VEHICLE_SERVICE_MESSAGES.VEHICLE_KEY_EMPTY);
        }

        const vehicle = await this.vehicleCollectionService.findOne({ key: { $eq: vehicleKey }});

        if (!vehicle) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_MESSAGES.VEHICLE_NOT_FOUND);
        }

        return await this.addDependencies(vehicle, host);
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
            return await this.addDependencies(vehicle, host);
        }));
    }

    /**
     * Get all vehicles by user key
     *
     * @param userKey
     * @param host
     */
    public async getUserVehicles(userKey: Key, host?: string): Promise<any> {
        if (!userKey) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_MESSAGES.USER_KEY_EMPTY);
        }

        const vehicles = await this.vehicleCollectionService.find({ userKey: { $eq: userKey }});

        if (vehicles.length === 0) {
            return [];
        }

        const results = await Promise.all(vehicles.map(async (vehicle) => {
            return await this.addDependencies(vehicle, host);
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
        const vinExists = await this.vehicleCollectionService.findOne({ vin: {$eq: vehicle.vin} });

        if (vinExists) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_MESSAGES.EXISTING_VIN);
        }

        const results = await this.vehicleCollectionService.add(userKey, vehicle);

        if (!results) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_MESSAGES.VEHICLE_NOT_ADDED);
        }

        return await this.addDependencies(results, host);
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
            throw new HandleUpstreamError(VEHICLE_SERVICE_MESSAGES.VEHICLE_KEY_EMPTY);
        }

        const results = await this.vehicleCollectionService.update(vehicleKey, vehicle);

        if (!results) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_MESSAGES.VEHICLE_NOT_UPDATED);
        }

        return await this.addDependencies(results, host);
    }

    /**
     * Deletes a vehicle by key
     *
     * @param vehicleKey
     */
    public async deleteVehicle(vehicleKey: Key): Promise<any> {
        if (!vehicleKey) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_MESSAGES.VEHICLE_KEY_EMPTY);
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
     * Add dependencies when returning object
     *
     * @param host
     * @param vehicle
     * @private
     */
    private async addDependencies(vehicle: any, host?: string): Promise<any> {
        const mfr = await this.vehicleApiService.getApiMfr(vehicle.mfrKey);
        const model = await this.vehicleApiService.getApiModel(vehicle.modelKey);
        const dealer = await this.vehicleDealershipService.getDealerByVehicle(vehicle.key);
        //const finance = await this.financeService.getFinanceByVehicle(vehicle.key);
        //const insurance = await this.insuranceService.getInsuranceByVehicle(vehicle.key);

        vehicle = { ...vehicle, mfrName: mfr.mfrName };
        vehicle = { ...vehicle, model: model.model };
        vehicle = { ...vehicle, dealer: dealer };
        //vehicle = { ...vehicle, finance: finance };
        //vehicle = { ...vehicle, insurance: insurance };
        vehicle = { ...vehicle, imagePath: this.fileUploadService.setImagePath(vehicle.image, host) };

        return vehicle;
    }
}
