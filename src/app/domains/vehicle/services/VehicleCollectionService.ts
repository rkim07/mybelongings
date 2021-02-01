import { Service } from 'typedi';
import { Key, Vehicle } from '../../shared/models/models';
import { Datetime } from '../../shared/models/utilities/Datetime';
import { DatabaseCollectionService } from '../../shared/services/DatabaseCollectionService';

@Service()
export class VehicleCollectionService extends DatabaseCollectionService {

    /**
     * Constructor
     */
    constructor() {
        super('Vehicle');
    }

    /**
     * Get all vehicles
     */
    public async getAll(): Promise<any> {
        await this.loadCollection();

        return this.collection.chain()
            .find()
            .simplesort('year', false)
            .data();
    }

    /**
     * Add vehicle
     *
     * @param userKey
     * @param vehicle
     */
    public async add(userKey: Key, vehicle: any): Promise<any> {
        return await this.addOne(
            new Vehicle({
                userKey: userKey,
                mfrKey: vehicle.mfrKey,
                modelKey: vehicle.modelKey,
                image: vehicle.image,
                year: vehicle.year,
                color: vehicle.color,
                vin: vehicle.vin,
                plate: vehicle.plate,
                condition: vehicle.condition
            })
        );
    }

    /**
     * Update vehicle
     *
     * @param userKey
     * @param vehicle
     * @param vehicleKey
     */
    public async update(userKey: Key, vehicleKey: Key, vehicle: any): Promise<any> {
        await this.loadCollection();

        const query = {
            $and: [
                { key: { $eq: vehicleKey } },
                { userKey: { $eq: userKey } }
            ]
        };

        const existingVehicle = await this.findOne(query);

        // For existing vehicle, user, manufacturer, model, and vin
        // are restricted from being updated
        if (existingVehicle) {
            return await this.updateManyFields({
                uniqueField: 'key',
                uniqueFieldValue: existingVehicle.key,
                updateFields: {
                    image: vehicle.image,
                    year: vehicle.year,
                    color: vehicle.color,
                    plate: vehicle.plate,
                    condition: vehicle.condition,
                    modified: Datetime.getNow()
                }
            });
        }
    }
}
