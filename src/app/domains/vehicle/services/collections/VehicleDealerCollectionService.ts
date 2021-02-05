import { Service } from 'typedi';
import { Key, Vehicle, VehicleDealer } from '../../../shared/models/models';
import { Datetime } from '../../../shared/models/utilities/Datetime';
import { DatabaseCollectionService } from '../../../shared/services/DatabaseCollectionService';

@Service()
export class VehicleDealerCollectionService extends DatabaseCollectionService {

    /**
     * Constructor
     */
    constructor() {
        super('VehicleDealer');
    }

    /**
     * Get all dealers
     */
    public async getAll(): Promise<any> {
        await this.loadCollection();

        return this.collection.chain()
            .find()
            .simplesort('created', false)
            .data();
    }

    /**
     * Add dealer
     *
     * @param userKey
     * @param vehicleKey
     * @param dealer
     */
    public async add(userKey: Key, vehicleKey: Key, dealer: any): Promise<any> {
        return await this.addOne(
            new VehicleDealer({
                userKey: dealer.userKey,
                vehicleKey: dealer.vehicleKey,
                storeKey: dealer.storeKey,
                odometer: dealer.odometer,
                deposit: dealer.deposit,
                vehiclePrice: dealer.vehiclePrice,
                purchasePrice: dealer.purchasePrice,
                agreement: dealer.agreement,
                purchaseDate: dealer.purchaseDate
            })
        );
    }

    /**
     * Update vehicle
     *
     * @param dealerKey
     * @param dealer
     */
    public async update(dealerKey: Key, dealer: any): Promise<any> {
        await this.loadCollection();

        const existingDealer = await this.findOne({ key: { $eq: dealerKey } });

        // For existing vehicle, user, manufacturer, model, and vin
        // are restricted from being updated
        if (existingDealer) {
            return await this.updateManyFields({
                uniqueField: 'key',
                uniqueFieldValue: existingDealer.key,
                updateFields: {
                    userKey: dealer.userKey,
                    vehicleKey: dealer.vehicleKey,
                    storeKey: dealer.storeKey,
                    odometer: dealer.odometer,
                    deposit: dealer.deposit,
                    vehiclePrice: dealer.vehiclePrice,
                    purchasePrice: dealer.purchasePrice,
                    agreement: dealer.agreement,
                    purchaseDate: dealer.purchaseDate,
                    modified: Datetime.getNow()
                }
            });
        }
    }
}
