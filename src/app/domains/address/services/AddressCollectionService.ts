import { Service } from 'typedi';
import { Address, Key  } from '../../shared/models/models';
import { DatabaseCollectionService } from '../../shared/services/DatabaseCollectionService';
import { Datetime } from '../../shared/models/utilities/Datetime';

@Service()
export class AddressCollectionService extends DatabaseCollectionService {

    /**
     * Constructor
     */
    constructor() {
        super('Address');
    }

    /**
     * Get all addresses
     */
    public async getAll(): Promise<any> {
        await this.loadCollection();

        return this.collection.chain()
            .find()
            .simplesort('street', false)
            .data();
    }

    /**
     * Add address
     *
     * @param address
     */
    public async add(address: any): Promise<any> {
        await this.loadCollection();

        return await this.addOne(new Address({
            street: address.street,
            city: address.city,
            state: address.state,
            zip: address.zip,
            county: address.county,
            country: address.country,
            type: address.type
        }));
    }

    /**
     * Update address
     *
     * @param addressKey
     * @param address
     */
    public async update(addressKey: Key, address: any): Promise<any> {
        await this.loadCollection();

        const existingAddress = await this.findOne({ key: { $eq: addressKey } });

        if (existingAddress) {
            return await this.updateManyFields({
                uniqueField: 'key',
                uniqueFieldValue: existingAddress.key,
                updateFields: {
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    zip: address.zip,
                    county: address.county,
                    country: address.country,
                    type: address.type,
                    modified: Datetime.getNow()
                }
            });
        }
    }
}
