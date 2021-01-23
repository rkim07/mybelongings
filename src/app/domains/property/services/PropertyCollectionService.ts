import { Service } from 'typedi';
import { Property } from '../../shared/models/models';
import { DatabaseCollectionService } from '../../shared/services/DatabaseCollectionService';
import { Datetime } from '../../shared/models/utilities/Datetime';

@Service()
export class PropertyCollectionService extends DatabaseCollectionService {

    /**
     * Constructor
     */
    constructor() {
        super('Property');
    }

    /**
     * Get all properties
     *
     * @param key
     */
    public async getProperties(): Promise<Property[]> {
        await this.loadCollection();

        return this.collection.chain()
            .find()
            .simplesort('year', false)
            .data();
    }

    /**
     * Add or update property
     *
     * @param property
     */
    public async updateProperty(property: any) {
        await this.loadCollection();

        const existingProperty = await this.findOne({ key: { $eq: property.key }});

        if (existingProperty) {
            return await this.updateManyFields({
                uniqueField: 'key',
                uniqueFieldValue: existingProperty.key,
                updateFields: {
                    userKey: property.userKey,
                    addressKey: property.addressKey,
                    image: property.image,
                    year: property.year,
                    type: property.type,
                    style: property.style,
                    bedrooms: property.bedrooms,
                    bathrooms: property.bathrooms,
                    stories: property.stories,
                    garage: property.garage,
                    parkingSpaces: property.parkingSpaces,
                    basement: property.basement,
                    features: property.features,
                    sqFt: property.sqFt,
                    lotSize: property.lotSize,
                    apn: property.apn,
                    subdivision: property.subdivision,
                    modified: Datetime.getNow()
                }
            });
        } else {
            return await this.addOne(new Property({
                userKey: property.userKey,
                addressKey: property.addressKey,
                image: property.image,
                year: property.year,
                type: property.type,
                style: property.style,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                stories: property.stories,
                garage: property.garage,
                parkingSpaces: property.parkingSpaces,
                basement: property.basement,
                features: property.features,
                sqFt: property.sqFt,
                lotSize: property.lotSize,
                apn: property.apn,
                subdivision: property.subdivision
            }));
        }
    }
}
