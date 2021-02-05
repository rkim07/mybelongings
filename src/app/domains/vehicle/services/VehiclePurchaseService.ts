import * as _ from 'lodash';
import { Container, Inject } from 'typedi';
import { Service } from 'typedi';
import { Code, HandleUpstreamError, Key, VehiclePurchase } from '../../shared/models/models';
import { StoreService } from '../../store/services/StoreService';
import { VehiclePurchaseCollectionService } from './collections/VehiclePurchaseCollectionService';

export enum VEHICLE_PURCHASE_SERVICE_MESSAGES {
    EMPTY_VEHICLE_KEY = 'VEHICLE_PURCHASE_SERVICE_MESSAGES.EMPTY_VEHICLE_KEY',
    PURCHASE_NOT_FOUND = 'VEHICLE_PURCHASE_SERVICE_MESSAGES.PURCHASE_NOT_FOUND',
    PURCHASE_NOT_ADDED = 'VEHICLE_PURCHASE_SERVICE_MESSAGES.PURCHASE_NOT_ADDED',
    PURCHASE_NOT_UPDATED = 'VEHICLE_PURCHASE_SERVICE_MESSAGES.PURCHASE_NOT_UPDATED',
    EMPTY_PURCHASE_KEY = 'VEHICLE_PURCHASE_SERVICE_MESSAGES.EMPTY_PURCHASE_KEY',
    EMPTY_NEW_PURCHASE_INFO = 'VEHICLE_PURCHASE_SERVICE_MESSAGES.EMPTY_NEW_PURCHASE_INFO'
}

@Service()
export class VehiclePurchaseService {

    @Inject()
    private storeService: StoreService = Container.get(StoreService);

    @Inject()
    private vehiclePurchaseCollectionService: VehiclePurchaseCollectionService = Container.get(VehiclePurchaseCollectionService);

    /**
     * Get vehicle purchase by key
     *
     * @param purchaseKey
     */
    public async getVehiclePurchase(purchaseKey: Key): Promise<any> {
        if (!purchaseKey) {
            throw new HandleUpstreamError(VEHICLE_PURCHASE_SERVICE_MESSAGES.EMPTY_PURCHASE_KEY);
        }

        const purchase = await this.vehiclePurchaseCollectionService.findOne({ key: { $eq: purchaseKey }});

        if (!purchase) {
            throw new HandleUpstreamError(VEHICLE_PURCHASE_SERVICE_MESSAGES.PURCHASE_NOT_FOUND);
        }

        return await this.addDependencies(purchase);
    }

    /**
     * Get all vehicle purchases
     */
    public async getVehiclePurchases(): Promise<any> {
        const purchases = await this.vehiclePurchaseCollectionService.getAll();

        if (purchases.length === 0) {
            return [];
        }

        return await Promise.all(purchases.map(async (purchase) => {
            return await this.addDependencies(purchase);
        }));
    }

    /**
     * Get purchase by vehicle
     *
     * @param userKey
     */
    public async getPurchaseByVehicle(vehicleKey: Key): Promise<any> {
        if (!vehicleKey) {
            throw new HandleUpstreamError(VEHICLE_PURCHASE_SERVICE_MESSAGES.EMPTY_VEHICLE_KEY);
        }

        const purchases = await this.vehiclePurchaseCollectionService.find({ vehicleKey: { $eq: vehicleKey }});

        if (purchases.length === 0) {
            return [];
        }

        const results = await Promise.all(purchases.map(async (purchase) => {
            return await this.addDependencies(purchase);
        }));

        return _.sortBy(results, o => o.model);
    }

    /**
     * Add vehicle purchase
     *
     * @param vehicleKey
     * @param purchase
     */
    public async addPurchase(vehicleKey: Key, purchase: any): Promise<any> {
        if (!purchase) {
            throw new HandleUpstreamError(VEHICLE_PURCHASE_SERVICE_MESSAGES.EMPTY_NEW_PURCHASE_INFO);
        }

        const results = await this.vehiclePurchaseCollectionService.add(vehicleKey, purchase);

        if (!results) {
            throw new HandleUpstreamError(VEHICLE_PURCHASE_SERVICE_MESSAGES.PURCHASE_NOT_ADDED);
        }

        return await this.addDependencies(results);
    }

    /**
     * Update vehicle purchase
     *
     * @param purchaseKey
     * @param purchase
     */
    public async updatePurchase(purchaseKey: Key, purchase: any): Promise<any> {
        if (!purchaseKey) {
            throw new HandleUpstreamError(VEHICLE_PURCHASE_SERVICE_MESSAGES.EMPTY_PURCHASE_KEY);
        }

        const results = await this.vehiclePurchaseCollectionService.update(purchaseKey, purchase);

        if (!results) {
            throw new HandleUpstreamError(VEHICLE_PURCHASE_SERVICE_MESSAGES.PURCHASE_NOT_UPDATED);
        }

        return await this.addDependencies(results);
    }

    /**
     * Deletes by purchase key
     *
     * @param purchaseKey
     */
    public async deletePurchase(purchaseKey: Key): Promise<any> {
        if (!purchaseKey) {
            throw new HandleUpstreamError(VEHICLE_PURCHASE_SERVICE_MESSAGES.EMPTY_PURCHASE_KEY);
        }

        const purchase = await this.vehiclePurchaseCollectionService.findOne({ key: { $eq: purchaseKey } });

        if (!purchase) {
            throw new HandleUpstreamError(VEHICLE_PURCHASE_SERVICE_MESSAGES.PURCHASE_NOT_FOUND);
        }

        await this.vehiclePurchaseCollectionService.removeByFieldValue('key', purchaseKey);

        return purchase;
    }

    /**
     * Add dependencies when returning object
     *
     * @param purchase
     * @private
     */
    private async addDependencies(purchase: any): Promise<any> {
        const store = await this.storeService.getStore(purchase.storeKey);
        return { ...purchase, store: store };
    }
}
