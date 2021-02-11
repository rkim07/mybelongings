import { Service } from 'typedi';
import { NhtsaApiVehicleMfr } from '../../../shared/models/models';
import { Datetime } from '../../../shared/models/utilities/Datetime';
import { DatabaseCollectionService } from '../../../shared/services/DatabaseCollectionService';

@Service()
export class NhtsaApiVehicleMfrCollectionService extends DatabaseCollectionService {

    /**
     * Constructor
     */
    constructor() {
        super('NhtsaApiVehicleMfr');
    }

    /**
     * Get all API manufacturers
     */
    public async getApiMfrs(): Promise<any> {
        await this.loadCollection();

        return this.collection.chain()
            .find()
            .simplesort('mfrName', false)
            .data();
    }

    /**
     * Add or update API manufacturer
     *
     * @param mfr
     */
    public async updateMfrs(mfr: any): Promise<any> {
        await this.loadCollection();

        const existingMfr = await this.findOne({ mfrId: { $eq: mfr.mfrId }});

        if (existingMfr && existingMfr.mfrId) {
            return await this.updateManyFields({
                uniqueField: 'key',
                uniqueFieldValue: existingMfr.key,
                updateFields: {
                    mfrId: mfr.mfrId,
                    mfrName: mfr.mfrName,
                    modified: Datetime.getNow()
                }
            });
        } else {
            return await this.addOne(new NhtsaApiVehicleMfr({
                mfrId: mfr.mfrId,
                mfrName: mfr.mfrName
            }));
        }
    }
}
