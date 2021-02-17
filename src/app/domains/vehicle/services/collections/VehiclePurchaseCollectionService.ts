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
     * Get all purchases sorted
     */
    public async getAll(): Promise<any> {
        await this.loadCollection();

        return this.collection.chain()
            .find()
            .simplesort('created', false)
            .data();
    }

    /**
     * Stepper purchase
     *
     * @param vehicleKey
     * @param purchase
     */
    public async add(vehicleKey: Key, purchase: any): Promise<any> {
        await this.loadCollection();

        return await this.addOne(
            new VehiclePurchase({
                vehicleKey: vehicleKey,
                storeKey: purchase.storeKey,
                odometer: purchase.odometer,
                deposit: purchase.deposit,
                downPayment: purchase.downPayment,
                msrpPrice: purchase.msrpPrice,
                stickerPrice: purchase.stickerPrice,
                purchasePrice: purchase.purchasePrice,
                agreement: purchase.agreement,
                purchaseType: purchase.purchaseType,
                purchased: purchase.purchased
            })
        );
    }

    /**
     * Update purchase
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
                    purchased: purchase.purchased,
                    modified: Datetime.getNow()
                }
            });
        }
    }
}
