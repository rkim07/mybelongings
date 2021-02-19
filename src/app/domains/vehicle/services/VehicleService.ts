import * as _ from 'lodash';
import { Container, Inject } from 'typedi';
import { Service } from 'typedi';
import { Code, HandleUpstreamError, Key, Vehicle } from '../../shared/models/models';
import { FileUploadService } from '../../shared/services/FileUploadService';
import { VehicleApiService } from './VehicleApiService';
import { VehiclePurchaseService } from './VehiclePurchaseService';
import { VehicleCollectionService } from './collections/VehicleCollectionService';

export enum VEHICLE_SERVICE_MESSAGES {
    VEHICLE_NOT_FOUND = 'VEHICLE_SERVICE_MESSAGES.VEHICLE_NOT_FOUND',
    VEHICLES_NOT_FOUND = 'VEHICLE_SERVICE_MESSAGES.VEHICLES_NOT_FOUND',
    VEHICLE_NOT_ADDED = 'VEHICLE_SERVICE_MESSAGES.VEHICLE_NOT_ADDED',
    VEHICLE_NOT_UPDATED = 'VEHICLE_SERVICE_MESSAGES.VEHICLE_NOT_UPDATED',
    EXISTING_VIN = 'VEHICLE_SERVICE_MESSAGES.EXISTING_VIN',
    EMPTY_VEHICLE_KEY = 'VEHICLE_SERVICE_MESSAGES.EMPTY_VEHICLE_KEY',
    EMPTY_NEW_VEHICLE_INFO = 'VEHICLE_SERVICE_MESSAGES.EMPTY_NEW_VEHICLE_INFO',
    EMPTY_USER_KEY = 'VEHICLE_SERVICE_MESSAGES.EMPTY_USER_KEY'
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
    private vehicleApiService: VehicleApiService = Container.get(VehicleApiService);

    @Inject()
    private vehiclePurchaseService: VehiclePurchaseService = Container.get(VehiclePurchaseService);

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
    public async getVehiclesByUser(userKey: Key, host?: string): Promise<any> {
        if (!userKey) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_MESSAGES.EMPTY_USER_KEY);
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
        const vinExists = await this.vehicleCollectionService.findOne({ vin: { $eq: vehicle.vin }});

        if (vinExists) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_MESSAGES.EXISTING_VIN);
        }

        const addedVehicle = await this.vehicleCollectionService.add(userKey, vehicle);

        if (!addedVehicle) {
            throw new HandleUpstreamError(VEHICLE_SERVICE_MESSAGES.VEHICLE_NOT_ADDED);
        }

        await this.vehiclePurchaseService.addPurchase(addedVehicle.key, vehicle.purchase, host);
        //await this.vehicleFinancialService.addFinancial(addedVehicle.key, vehicle.financial);
        //await this.vehicleInsuranceService.addInsurance(addedVehicle.key, vehicle.insurance);

        return {
            ...vehicle,
            imagePath: this.fileUploadService.setFilePath(vehicle.image, host)
        };
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

        await this.vehiclePurchaseService.addPurchase(updatedVehicle.key, vehicle.purchase, host);
        //await this.vehicleFinancialService.addFinancial(addedVehicle.key, vehicle.financial);
        //await this.vehicleInsuranceService.addInsurance(addedVehicle.key, vehicle.insurance);

        return {
            ...vehicle,
            imagePath: this.fileUploadService.setFilePath(vehicle.image, host)
        };
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
     * Dependencies when returning object
     *
     * @param host
     * @param vehicle
     * @private
     */
    private async addDependencies(vehicle: any, host?: string): Promise<any> {
        const mfr = await this.vehicleApiService.getApiMfr(vehicle.mfrKey);
        const model = await this.vehicleApiService.getApiModel(vehicle.modelKey);
        const purchase = await this.vehiclePurchaseService.getPurchaseByVehicle(vehicle.key, host);
        //const finance = await this.financeService.getFinanceByVehicle(vehicle.key);
        //const insurance = await this.insuranceService.getInsuranceByVehicle(vehicle.key);

        return {
            ...vehicle,
            mfrName: mfr.mfrName,
            model: model.model,
            purchase: purchase,
            // finance: finance,
            // insurance: insurance,
            imagePath: this.fileUploadService.setFilePath(vehicle.image, host)
        };
    }
}
