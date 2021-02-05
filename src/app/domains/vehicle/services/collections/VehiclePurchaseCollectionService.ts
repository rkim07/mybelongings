import { Service } from 'typedi';
import { Key, Vehicle, VehiclePurchase } from '../../../shared/models/models';
import { Datetime } from '../../../shared/models/utilities/Datetime';
import { DatabaseCollectionService } from '../../../shared/services/DatabaseCollectionService';

@Service()
export class VehiclePurchaseCollectionService extends DatabaseCollectionService {

    /**
     * Constructor
     */
    constructor() {
        super('VehiclePurchase');
    }

    /**
     * Get all vehicle purchases
     */
    public async getAll(): Promise<any> {
        await this.loadCollection();

        return this.collection.chain()
            .find()
            .simplesort('created', false)
            .data();
    }

    /**
     * Add vehicle purchase
     *
     * @param vehicleKey
     * @param purchase
     */
    public async add(vehicleKey: Key, purchase: any): Promise<any> {
        return await this.addOne(
            new VehiclePurchase({
                vehicleKey: purchase.vehicleKey,
                storeKey: purchase.storeKey,
                odometer: purchase.odometer,
                deposit: purchase.deposit,
                downPayment: purchase.downPayment,
                msrpPrice: purchase.msrpPrice,
                stickerPrice: purchase.stickerPrice,
                purchasePrice: purchase.purchasePrice,
                agreement: purchase.agreement,
                purchaseType: purchase.purchaseType,
                purchaseDate: purchase.purchaseDate
            })
        );
    }

    /**
     * Update vehicle
     *
     * @param purchaseKey
     * @param purchase
     */
    public async update(purchaseKey: Key, purchase: any): Promise<any> {
        await this.loadCollection();

        const existingPurchase = await this.findOne({ key: { $eq: purchaseKey } });

        if (existingPurchase) {
            return await this.updateManyFields({
                uniqueField: 'key',
                uniqueFieldValue: existingPurchase.key,
                updateFields: {
                    vehicleKey: purchase.vehicleKey,
                    storeKey: purchase.storeKey,
                    odometer: purchase.odometer,
                    deposit: purchase.deposit,
                    downPayment: purchase.donwPayment,
                    msrpPrice: purchase.msrpPrice,
                    stickerPrice: purchase.stickerPrice,
                    purchasePrice: purchase.purchasePrice,
                    agreement: purchase.agreement,
                    purchaseType: purchase.purchaseType,
                    purchaseDate: purchase.purchaseDate,
                    modified: Datetime.getNow()
                }
            });
        }
    }
}
