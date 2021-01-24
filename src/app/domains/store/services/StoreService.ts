import { Container, Inject, Service } from 'typedi';
import { AddressService } from '../../address/services/AddressService';
import { StoreCollectionService } from './StoreCollectionService';
import {HandleUpstreamError, Key, Store, Vehicle} from '../../shared/models/models';
import {VEHICLE_SERVICE_ERRORS} from "../../vehicle/services/VehicleService";

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
            throw new HandleUpstreamError(VEHICLE_SERVICE_ERRORS.VEHICLE_NOT_FOUND);
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
     * Add or update store
     *
     * @param origin
     * @param body
     */
    public async updateStore(origin: string, body: any): Promise<any> {
        const store = await this.storeCollectionService.updateStore(body);
        return await this.addDependencies(origin, store);
    }

    /**
     * Add dependencies when returning object
     *
     * @param origin
     * @param store
     */
    private async addDependencies(origin, store) {
        store['address'] = await this.addressService.getAddress(store.addressKey);
        return store;
    }
}
