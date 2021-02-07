import * as _ from 'lodash';
import { Container, Inject } from 'typedi';
import { Service } from 'typedi';
import { Code, HandleUpstreamError, Key, VehiclePurchase } from '../../shared/models/models';
import { StoreService } from '../../store/services/StoreService';
import { VehiclePurchaseCollectionService } from './collections/VehiclePurchaseCollectionService';
import { VEHICLE_SERVICE_MESSAGES } from './VehicleService';

export enum VEHICLE_PURCHASE_SERVICE_MESSAGES {
    EMPTY_VEHICLE_KEY = 'VEHICLE_PURCHASE_SERVICE_MESSAGES.EMPTY_VEHICLE_KEY',
    PURCHASE_NOT_FOUND = 'VEHICLE_PURCHASE_SERVICE_MESSAGES.PURCHASE_NOT_FOUND',
    PURCHASE_NOT_ADDED = 'VEHICLE_PURCHASE_SERVICE_MESSAGES.PURCHASE_NOT_ADDED',
    PURCHASE_NOT_UPDATED = 'VEHICLE_PURCHASE_SERVICE_MESSAGES.PURCHASE_NOT_UPDATED',
    EXISTING_PURCHASE = 'VEHICLE_PURCHASE_SERVICE_MESSAGES.EXISTING_PURCHASE',
    EMPTY_PURCHASE_KEY = 'VEHICLE_PURCHASE_SERVICE_MESSAGES.EMPTY_PURCHASE_KEY',
    EMPTY_NEW_PURCHASE_INFO = 'VEHICLE_PURCHASE_SERVICE_MESSAGES.EMPTY_NEW_PURCHASE_INFO'
}

/**
 * Key values that will be converted
 * both on request and response
 */
export const vehiclePurchaseMappingValues = {
    date: [
        'created',
        'modified',
        'purchaseDate'
    ],
    decimals: [
        'odometer'
    ],
    price: [
        'deposit',
        'downPayment',
        'msrpPrice',
        'stickerPrice',
        'purchasePrice'
    ],
};

@Service()
export class VehiclePurchaseService {

    @Inject()
    private storeService: StoreService = Container.get(StoreService);

    @Inject()
    private vehiclePurchaseCollectionService: VehiclePurchaseCollectionService = Container.get(VehiclePurchaseCollectionService);

    /**
     * Get purchase by key
     *
     * @param purchaseKey
     */
    public async getPurchase(purchaseKey: Key): Promise<any> {
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
     * Get all purchases
     */
    public async getPurchases(): Promise<any> {
        const purchases = await this.vehiclePurchaseCollectionService.getAll();

        if (purchases.length === 0) {
            return [];
        }

        return await Promise.all(purchases.map(async (purchase) => {
            return await this.addDependencies(purchase);
        }));
    }

    /**
     * Get purchase by vehicle key
     *
     * @param vehicleKey
     */
    public async getPurchaseByVehicle(vehicleKey: Key): Promise<any> {
        if (!vehicleKey) {
            throw new HandleUpstreamError(VEHICLE_PURCHASE_SERVICE_MESSAGES.EMPTY_VEHICLE_KEY);
        }

        const purchase = await this.vehiclePurchaseCollectionService.findOne({ vehicleKey: { $eq: vehicleKey }});

        if (!purchase) {
            return {};
        }

        return await this.addDependencies(purchase);
    }

    /**
     * Add purchase
     *
     * @param vehicleKey
     * @param purchase
     */
    public async addPurchase(vehicleKey: Key, purchase: any): Promise<any> {
        if (!purchase) {
            throw new HandleUpstreamError(VEHICLE_PURCHASE_SERVICE_MESSAGES.EMPTY_NEW_PURCHASE_INFO);
        }

        const purchaseExists = await this.vehiclePurchaseCollectionService.findOne({ vehicleKey: { $eq: vehicleKey }});

        if (purchaseExists) {
            throw new HandleUpstreamError(VEHICLE_PURCHASE_SERVICE_MESSAGES.EXISTING_PURCHASE);
        }

        const results = await this.vehiclePurchaseCollectionService.add(vehicleKey, purchase);

        if (!results) {
            throw new HandleUpstreamError(VEHICLE_PURCHASE_SERVICE_MESSAGES.PURCHASE_NOT_ADDED);
        }

        return await this.addDependencies(results);
    }

    /**
     * Update purchase
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
     * Delete purchase
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
