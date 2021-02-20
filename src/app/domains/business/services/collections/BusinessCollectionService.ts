import { Service } from 'typedi';
import { Key, Business } from '../../../shared/models/models';
import { Datetime } from '../../../shared/models/utilities/Datetime';
import { DatabaseCollectionService } from '../../../shared/services/DatabaseCollectionService';

@Service()
export class BusinessCollectionService extends DatabaseCollectionService {

    /**
     * Constructor
     */
    constructor() {
        super('Business');
    }

    /**
     * Get all businesses
     */
    public async getAll(): Promise<any> {
        await this.loadCollection();

        return this.collection.chain()
            .find()
            .simplesort('name', false)
            .data();
    }

    /**
     * Add business
     *
     * @param business
     */
    public async add(business: any): Promise<any> {
        await this.loadCollection();

        return await this.addOne(
            new Business({
                addressKey: business.addressKey,
                name: business.name,
                landline: business.landline,
                mobile: business.mobile,
                email: business.email,
                website: business.website,
                salesPerson: business.salesPerson,
                type: business.type,
                notes: business.notes
            })
        );
    }

    /**
     * Update business
     *
     * @param businessKey
     * @param business
     */
    public async update(businessKey: Key, business: any): Promise<any> {
        await this.loadCollection();

        const existingBusiness = await this.findOne({ key: { $eq: businessKey }});

        if (existingBusiness) {
            return await this.updateManyFields({
                uniqueField: 'key',
                uniqueFieldValue: existingBusiness.key,
                updateFields: {
                    addressKey: business.addressKey,
                    name: business.name,
                    landline: business.landline,
                    mobile: business.mobile,
                    email: business.email,
                    website: business.website,
                    salesPerson: business.salesPerson,
                    type: business.type,
                    notes: business.notes,
                    modified: Datetime.getNow()
                }
            });
        }
    }
}
