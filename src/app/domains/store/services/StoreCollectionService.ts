import { Service } from 'typedi';
import { Store } from '../../shared/models/models';
import { DatabaseCollectionService } from '../../shared/services/DatabaseCollectionService';
import { Datetime } from '../../shared/models/utilities/Datetime';

@Service()
export class StoreCollectionService extends DatabaseCollectionService {

    /**
     * Constructor
     */
    constructor() {
        super('Store');
    }

    /**
     * Get all stores
     */
    public async getStores(): Promise<Store[]> {
        await this.loadCollection();

        return this.collection.chain()
            .find()
            .simplesort('name', false)
            .data();
    }

    /**
     * Stepper or update store
     *
     * @param store
     */
    public async updateStore(store: any) {
        await this.loadCollection();

        const existingStore = await this.findOne({ key: { $eq: store.key }});

        if (existingStore) {
            return await this.updateManyFields({
                uniqueField: 'key',
                uniqueFieldValue: existingStore.key,
                updateFields: {
                    addressKey: store.addressKey,
                    name: store.name,
                    landline: store.landline,
                    mobile: store.mobile,
                    email: store.email,
                    website: store.website,
                    salesPerson: store.salesPerson,
                    type: store.type,
                    notes: store.notes,
                    modified: Datetime.getNow()
                }
            });
        } else {
            return await this.addOne(new Store({
                addressKey: store.addressKey,
                name: store.name,
                landline: store.landline,
                mobile: store.mobile,
                email: store.email,
                website: store.website,
                salesPerson: store.salesPerson,
                type: store.type,
                notes: store.notes
            }));
        }
    }
}
