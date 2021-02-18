import { Service } from 'typedi';
import { Key, Store } from '../../../shared/models/models';
import { Datetime } from '../../../shared/models/utilities/Datetime';
import { DatabaseCollectionService } from '../../../shared/services/DatabaseCollectionService';

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
    public async getAll(): Promise<any> {
        await this.loadCollection();

        return this.collection.chain()
            .find()
            .simplesort('name', false)
            .data();
    }

    /**
     * Add store
     *
     * @param store
     */
    public async add(store: any): Promise<any> {
        await this.loadCollection();

        return await this.addOne(
            new Store({
                addressKey: store.addressKey,
                name: store.name,
                landline: store.landline,
                mobile: store.mobile,
                email: store.email,
                website: store.website,
                salesPerson: store.salesPerson,
                type: store.type,
                notes: store.notes
            })
        );
    }

    /**
     * Update store
     *
     * @param storeKey
     * @param store
     */
    public async update(storeKey: Key, store: any): Promise<any> {
        await this.loadCollection();

        const existingStore = await this.findOne({ key: { $eq: storeKey }});

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
        }
    }
}
