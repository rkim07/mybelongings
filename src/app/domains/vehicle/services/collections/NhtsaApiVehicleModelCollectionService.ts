import { Service } from 'typedi';
import { Key, NhtsaApiVehicleModel } from '../../../shared/models/models';
import { Datetime } from '../../../shared/models/utilities/Datetime';
import { DatabaseCollectionService } from '../../../shared/services/DatabaseCollectionService';

@Service()
export class NhtsaApiVehicleModelCollectionService extends DatabaseCollectionService {

    /**
     * Constructor
     */
    constructor() {
        super('NhtsaApiVehicleModel');
    }

    /**
     * Get all API models
     */
    public async getApiModels(): Promise<any> {
        await this.loadCollection();

        return this.collection.chain()
            .find()
            .simplesort('model', false)
            .data();
    }

    /**
     * Get models by manufacturer
     *
     * @param mfrKey
     */
    public async getApiModelsByMfrKey(mfrKey: Key): Promise<any> {
        await this.loadCollection();

        return this.collection.chain()
            .find({ mfrKey: { $eq: mfrKey }})
            .simplesort('model', false)
            .data();
    }

    /**
     * Add or update vehicle model(s) by manufacturer ID
     *
     * @param mfrModel
     */
    public async updateModel(mfrModel: any): Promise<any> {
        await this.loadCollection();

        const existingModel = await this.findOne({ key: { $eq: mfrModel.key }});

        if (existingModel && existingModel.modelId) {
            return await this.updateManyFields({
                uniqueField: 'key',
                uniqueFieldValue: existingModel.key,
                updateFields: {
                    mfrKey: mfrModel.mfrKey,
                    modelId: mfrModel.modelId,
                    model:  mfrModel.model,
                    modified: Datetime.getNow()
                }
            });
        } else {
            return await this.addOne(new NhtsaApiVehicleModel({
                mfrKey: mfrModel.mfrKey,
                modelId: mfrModel.modelId,
                model:  mfrModel.model
            }));
        }
    }
}
