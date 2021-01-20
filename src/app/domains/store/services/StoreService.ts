import { Container, Inject, Service } from 'typedi';
import { AddressService } from '../../address/services/AddressService';
import { StoreCollectionService } from './StoreCollectionService';
import {HandleUpstreamError, Key, Store, Vehicle} from '../../shared/models/models';
import {VEHICLE_ERRORS} from "../../vehicle/services/VehicleService";

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
     * @param url
     */
    public async getStore(key: Key, url?: string): Promise<any> {
        const store = await this.storeCollectionService.findOne({ key: { $eq: key }});

        if (!store) {
            throw new HandleUpstreamError(VEHICLE_ERRORS.VEHICLE_NOT_FOUND);
        }

        return await this.addDependencies(url, store);
    }

    /**
     * Get all stores
     */
    public async getStores(url: string): Promise<any> {
        const stores = await this.storeCollectionService.getStores();

        return await Promise.all(stores.map(async (store) => {
            return await this.addDependencies(url, store);
        }));
    }

    /**
     * Get store by key
     *
     * @param key
     * @param url
     */
    public async getStoreByKey(key: Key, url: string): Promise<any> {
        const store = await this.storeCollectionService.findOne({ key: { $eq: key }});
        return await this.addDependencies(url, store);
    }

    /**
     * Add or update store
     *
     * @param url
     * @param body
     */
    public async updateStore(url: string, body: any): Promise<any> {
        const store = await this.storeCollectionService.updateStore(body);
        return await this.addDependencies(url, store);
    }

    /**
     * Add dependencies when returning object
     *
     * @param url
     * @param store
     */
    private async addDependencies(url, store) {
        store['address'] = await this.addressService.getAddress(store.addressKey);
        return store;
    }
}
