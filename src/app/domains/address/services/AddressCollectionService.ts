import { Service } from 'typedi';
import { Address } from '../../shared/models/models';
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
     * Add or update address
     *
     * @param address
     */
    public async updateAddress(address: any) {
        await this.loadCollection();

        const existingAddress = await this.findOne({key: {$eq: address.key}});

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
        } else {
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
    }
}
