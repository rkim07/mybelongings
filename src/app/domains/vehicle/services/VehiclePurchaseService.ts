import * as _ from 'lodash';
import { Container, Inject } from 'typedi';
import { Service } from 'typedi';
import { Code, HandleUpstreamError, Key, VehiclePurchase } from '../../shared/models/models';
import { FileUploadService } from '../../shared/services/FileUploadService';
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
export const vehiclePurchaseMappingKeys = {
    date: [
        'created',
        'modified',
        'purchased'
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
    capitalizedText: [
        'purchaseType'
    ],
};

@Service()
export class VehiclePurchaseService {

    @Inject()
    private storeService: StoreService = Container.get(StoreService);

    @Inject()
    private vehiclePurchaseCollectionService: VehiclePurchaseCollectionService = Container.get(VehiclePurchaseCollectionService);

    @Inject()
    private fileUploadService: FileUploadService = Container.get(FileUploadService);

    /**
     * Get purchase by key
     *
     * @param purchaseKey
     * @param host
     */
    public async getPurchase(purchaseKey: Key, host?: string): Promise<any> {
        if (!purchaseKey) {
            throw new HandleUpstreamError(VEHICLE_PURCHASE_SERVICE_MESSAGES.EMPTY_PURCHASE_KEY);
        }

        const purchase = await this.vehiclePurchaseCollectionService.findOne({ key: { $eq: purchaseKey }});

        if (!purchase) {
            throw new HandleUpstreamError(VEHICLE_PURCHASE_SERVICE_MESSAGES.PURCHASE_NOT_FOUND);
        }

        return await this.addDependencies(purchase, host);
    }

    /**
     * Get all purchases
     *
     * @param host
     */
    public async getPurchases(host?: string): Promise<any> {
        const purchases = await this.vehiclePurchaseCollectionService.getAll();

        if (purchases.length === 0) {
            return [];
        }

        return await Promise.all(purchases.map(async (purchase) => {
            return await this.addDependencies(purchase, host);
        }));
    }

    /**
     * Get purchase by vehicle key
     *
     * @param vehicleKey
     * @param host
     */
    public async getPurchaseByVehicle(vehicleKey: Key, host?: string): Promise<any> {
        if (!vehicleKey) {
            throw new HandleUpstreamError(VEHICLE_PURCHASE_SERVICE_MESSAGES.EMPTY_VEHICLE_KEY);
        }

        const purchase = await this.vehiclePurchaseCollectionService.findOne({ vehicleKey: { $eq: vehicleKey }});

        if (!purchase) {
            return {};
        }

        return await this.addDependencies(purchase, host);
    }

    /**
     * Add purchase
     *
     * @param vehicleKey
     * @param purchase
     * @param host
     */
    public async addPurchase(vehicleKey: Key, purchase: any, host?: string): Promise<any> {
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

        return await this.addDependencies(results, host);
    }

    /**
     * Update purchase
     *
     * @param purchaseKey
     * @param purchase
     * @param host
     */
    public async updatePurchase(purchaseKey: Key, purchase: any, host?: string): Promise<any> {
        if (!purchaseKey) {
            throw new HandleUpstreamError(VEHICLE_PURCHASE_SERVICE_MESSAGES.EMPTY_PURCHASE_KEY);
        }

        const results = await this.vehiclePurchaseCollectionService.update(purchaseKey, purchase);

        if (!results) {
            throw new HandleUpstreamError(VEHICLE_PURCHASE_SERVICE_MESSAGES.PURCHASE_NOT_UPDATED);
        }

        return await this.addDependencies(results, host);
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
     * Dependencies when returning object
     *
     * @param purchase
     * @param host
     * @private
     */
    private async addDependencies(purchase: any, host?: string): Promise<any> {
        return {
            ...purchase,
            store: await this.storeService.getStore(purchase.storeKey),
            filePath: this.fileUploadService.setFilePath(purchase.agreement, host)
        };
    }
}
