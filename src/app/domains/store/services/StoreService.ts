import { Container, Inject, Service } from 'typedi';
import { AddressService } from '../../address/services/AddressService';
import { StoreCollectionService } from './collections/StoreCollectionService';
import { HandleUpstreamError, Key, Store } from '../../shared/models/models';

export enum STORE_SERVICE_MESSAGES {
    STORE_NOT_FOUND = 'STORE_SERVICE_MESSAGES.STORE_NOT_FOUND',
    STORE_NOT_ADDED = 'STORE_SERVICE_MESSAGES.STORE_NOT_ADDED',
    STORE_NOT_UPDATED = 'STORE_SERVICE_MESSAGES.STORE_NOT_UPDATED',
    EMPTY_STORE_KEY = 'STORE_SERVICE_MESSAGES.EMPTY_STORE_KEY',
    EMPTY_NEW_STORE_INFO = 'STORE_SERVICE_MESSAGES.EMPTY_NEW_STORE_INFO',
    EMPTY_STORE_TYPE = 'STORE_SERVICE_MESSAGES.EMPTY_STORE_TYPE'
}

/**
 * Key values that will be converted
 * both on request and response
 */
export const storeMappingKeys = {
    capitalizedText: [
        'name',
        'salesPerson',
        'type',
        'customName'
    ],
    phone: [
        'landline',
        'mobile'
    ],
    date: [
        'created',
        'modified'
    ]
};

@Service()
export class StoreService {

    @Inject()
    private storeCollectionService: StoreCollectionService = Container.get(StoreCollectionService);

    @Inject()
    private addressService: AddressService = Container.get(AddressService);

    /**
     * Get store by key
     *
     * @param storeKey
     * @param host
     */
    public async getStore(storeKey: Key, host?: string): Promise<any> {
        const store = await this.storeCollectionService.findOne({ key: { $eq: storeKey }});

        if (!store) {
            return {};
        }

        return await this.addDependencies(host, store);
    }

    /**
     * Get all stores
     *
     * @param host
     */
    public async getStores(host?: string): Promise<any> {
        const stores = await this.storeCollectionService.getAll();

        if (stores.length === 0) {
            return [];
        }

        return await Promise.all(stores.map(async (store) => {
            return await this.addDependencies(store, host);
        }));
    }

    /**
     * Get all stores by type
     *
     * @param type
     * @param host
     */
    public async getStoresByType(type: string, host?: string): Promise<any> {
        if (!type) {
            throw new HandleUpstreamError(STORE_SERVICE_MESSAGES.EMPTY_STORE_TYPE);
        }

        const stores = await this.storeCollectionService.find({ type: { $eq: type }});

        if (stores.length === 0) {
            return [];
        }

        return await Promise.all(stores.map(async (store) => {
            return await this.addDependencies(store, type, host);
        }));
    }

    /**
     * Add store
     *
     * @param store
     * @param host
     */
    public async addStore(store: any, host?: string): Promise<any> {
        if (!store) {
            throw new HandleUpstreamError(STORE_SERVICE_MESSAGES.EMPTY_NEW_STORE_INFO);
        }

        const addedStore = await this.storeCollectionService.add(store);

        if (!addedStore) {
            throw new HandleUpstreamError(STORE_SERVICE_MESSAGES.STORE_NOT_ADDED);
        }

        return await this.addDependencies(addedStore, host);
    }

    /**
     * Update store
     *
     * @param storeKey
     * @param store
     * @param host
     */
    public async updateStore(storeKey: Key, store: any, host?: string): Promise<any> {
        if (!storeKey) {
            throw new HandleUpstreamError(STORE_SERVICE_MESSAGES.EMPTY_STORE_KEY);
        }

        const updatedStore = await this.storeCollectionService.update(storeKey, store);

        if (!updatedStore) {
            throw new HandleUpstreamError(STORE_SERVICE_MESSAGES.STORE_NOT_UPDATED);
        }

        return await this.addDependencies(updatedStore, host);
    }

    /**
     * Dependencies when returning object
     *
     * @param store
     * @param type
     * @param host
     * @private
     */
    private async addDependencies(store: any, type: string, host?: string): Promise<any> {
        const address = await this.addressService.getAddress(store.addressKey);

        // Name that will be shown in dropdown selection.  Depending of store type, name will be shown differently
        let customName = `${store.name}, ${address.street}, ${address.city}, ${address.state}, ${address.zip}`;

        if (type === 'dealership') {
            customName = `${store.name} - ${address.city}`
        }
        return {
            ...store,
            customName: customName,
            address: address };
    }
}
