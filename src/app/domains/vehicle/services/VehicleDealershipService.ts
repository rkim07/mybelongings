import * as _ from 'lodash';
import { Container, Inject } from 'typedi';
import { Service } from 'typedi';
import { Code, HandleUpstreamError, Key, VehicleDealer } from '../../shared/models/models';
import { StoreService } from '../../store/services/StoreService';
import { VehicleDealerCollectionService } from './collections/VehicleDealerCollectionService';

export enum DEALERSHIP_SERVICE_MESSAGES {
    DEALER_NOT_FOUND = 'DEALERSHIP_SERVICE_MESSAGES.DEALER_NOT_FOUND',
    DEALER_NOT_ADDED = 'DEALERSHIP_SERVICE_MESSAGES.DEALER_NOT_ADDED',
    DEALER_NOT_UPDATED = 'DEALERSHIP_SERVICE_MESSAGES.DEALER_NOT_UPDATED',
    DEALER_KEY_EMPTY = 'DEALERSHIP_SERVICE_MESSAGES.DEALER_KEY_EMPTY',
    USER_KEY_EMPTY = 'DEALERSHIP_SERVICE_MESSAGES.USER_KEY_EMPTY',
    EMPTY_NEW_DEALER_INFO = 'DEALERSHIP_SERVICE_MESSAGES.EMPTY_NEW_DEALER_INFO',
    VEHICLE_KEY_EMPTY = 'DEALERSHIP_SERVICE_MESSAGES.VEHICLE_KEY_EMPTY'
}

@Service()
export class VehicleDealershipService {

    @Inject()
    private storeService: StoreService = Container.get(StoreService);

    @Inject()
    private vehicleDealerCollectionService: VehicleDealerCollectionService = Container.get(VehicleDealerCollectionService);

    /**
     * Get dealer by key
     *
     * @param dealerKey
     */
    public async getVehicleDealership(dealerKey: Key): Promise<any> {
        if (!dealerKey) {
            throw new HandleUpstreamError(DEALERSHIP_SERVICE_MESSAGES.DEALER_KEY_EMPTY);
        }

        const dealer = await this.vehicleDealerCollectionService.findOne({ key: { $eq: dealerKey }});

        if (!dealer) {
            throw new HandleUpstreamError(DEALERSHIP_SERVICE_MESSAGES.DEALER_NOT_FOUND);
        }

        return await this.addDependencies(dealer);
    }

    /**
     * Get all dealers
     */
    public async getVehicleDealerships(): Promise<any> {
        const dealers = await this.vehicleDealerCollectionService.getAll();

        if (dealers.length === 0) {
            return [];
        }

        return await Promise.all(dealers.map(async (dealer) => {
            return await this.addDependencies(dealer);
        }));
    }

    /**
     * Get dealers by user
     *
     * @param userKey
     */
    public async getDealershipByUser(userKey: Key): Promise<any> {
        if (!userKey) {
            throw new HandleUpstreamError(DEALERSHIP_SERVICE_MESSAGES.USER_KEY_EMPTY);
        }

        const dealers = await this.vehicleDealerCollectionService.find({ userKey: { $eq: userKey }});

        if (dealers.length === 0) {
            return [];
        }

        const results = await Promise.all(dealers.map(async (dealer) => {
            return await this.addDependencies(dealer);
        }));

        return _.sortBy(results, o => o.model);
    }

    /**
     * Get dealer by vehicle
     *
     * @param userKey
     */
    public async getDealershipByVehicle(vehicleKey: Key): Promise<any> {
        if (!vehicleKey) {
            throw new HandleUpstreamError(DEALERSHIP_SERVICE_MESSAGES.VEHICLE_KEY_EMPTY);
        }

        const dealers = await this.vehicleDealerCollectionService.find({ vehicleKey: { $eq: vehicleKey }});

        if (dealers.length === 0) {
            return [];
        }

        const results = await Promise.all(dealers.map(async (dealer) => {
            return await this.addDependencies(dealer);
        }));

        return _.sortBy(results, o => o.model);
    }

    /**
     * Add dealer
     *
     * @param vehicleKey
     * @param dealer
     */
    public async addDealership(userKey: Key,  vehicleKey: Key, dealer: any): Promise<any> {
        if (!dealer) {
            throw new HandleUpstreamError(DEALERSHIP_SERVICE_MESSAGES.EMPTY_NEW_DEALER_INFO);
        }

        const results = await this.vehicleDealerCollectionService.add(userKey, vehicleKey, dealer);

        if (!results) {
            throw new HandleUpstreamError(DEALERSHIP_SERVICE_MESSAGES.DEALER_NOT_ADDED);
        }

        return await this.addDependencies(results);
    }

    /**
     * Update dealer
     *
     * @param dealerKey
     * @param dealer
     */
    public async updateDealership(dealerKey: Key, dealer: any): Promise<any> {
        if (!dealerKey) {
            throw new HandleUpstreamError(DEALERSHIP_SERVICE_MESSAGES.DEALER_KEY_EMPTY);
        }

        const results = await this.vehicleDealerCollectionService.update(dealerKey, dealer);

        if (!results) {
            throw new HandleUpstreamError(DEALERSHIP_SERVICE_MESSAGES.DEALER_NOT_UPDATED);
        }

        return await this.addDependencies(results);
    }

    /**
     * Deletes by dealer key
     *
     * @param dealerKey
     */
    public async deleteDealership(dealerKey: Key): Promise<any> {
        if (!dealerKey) {
            throw new HandleUpstreamError(DEALERSHIP_SERVICE_MESSAGES.DEALER_KEY_EMPTY);
        }

        const dealer = await this.vehicleDealerCollectionService.findOne({ key: { $eq: dealerKey } });

        if (!dealer) {
            throw new HandleUpstreamError(DEALERSHIP_SERVICE_MESSAGES.DEALER_NOT_FOUND);
        }

        await this.vehicleDealerCollectionService.removeByFieldValue('key', dealerKey);

        return dealer;
    }

    /**
     * Add dependencies when returning object
     *
     * @param dealer
     * @private
     */
    private async addDependencies(dealer: any): Promise<any> {
        const store = await this.storeService.getStore(dealer.storeKey);
        return { ...dealer, store: store };
    }
}
