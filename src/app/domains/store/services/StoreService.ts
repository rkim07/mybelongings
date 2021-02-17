import { Container, Inject, Service } from 'typedi';
import { AddressService } from '../../address/services/AddressService';
import { StoreCollectionService } from './StoreCollectionService';
import { HandleUpstreamError, Key, Store } from '../../shared/models/models';

export enum STORE_SERVICE_MESSAGES {
    STORE_NOT_FOUND = 'STORE_SERVICE_MESSAGES.STORE_NOT_FOUND'
}

/**
 * Key values that will be converted
 * both on request and response
 */
export const storeMappingKeys = {
    capitalizedText: [
        'name',
        'salesPerson',
        'type'
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
     * @param key
     * @param origin
     */
    public async getStore(key: Key, origin?: string): Promise<any> {
        const store = await this.storeCollectionService.findOne({ key: { $eq: key }});

        if (!store) {
            return {};
        }

        return await this.addDependencies(origin, store);
    }

    /**
     * Get all stores
     */
    public async getStores(origin: string): Promise<any> {
        const stores = await this.storeCollectionService.getStores();

        return await Promise.all(stores.map(async (store) => {
            return await this.addDependencies(origin, store);
        }));
    }

    /**
     * Get store by key
     *
     * @param key
     * @param origin
     */
    public async getStoreByKey(key: Key, origin: string): Promise<any> {
        const store = await this.storeCollectionService.findOne({ key: { $eq: key }});
        return await this.addDependencies(origin, store);
    }

    /**
     * Stepper or update store
     *
     * @param origin
     * @param body
     */
    public async updateStore(origin: string, body: any): Promise<any> {
        const store = await this.storeCollectionService.updateStore(body);
        return await this.addDependencies(origin, store);
    }

    /**
     * Stepper dependencies when returning object
     *
     * @param origin
     * @param store
     */
    private async addDependencies(origin, store) {
        return { ...store, address: await this.addressService.getAddress(store.addressKey) };
    }
}
