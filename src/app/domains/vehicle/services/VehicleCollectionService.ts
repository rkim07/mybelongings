import { Service } from 'typedi';
import { Key, Vehicle } from '../../shared/models/models';
import { DatabaseCollectionService } from '../../shared/services/DatabaseCollectionService';
import { Datetime } from '../../shared/models/utilities/Datetime';

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
    public async getVehicles(): Promise<Vehicle[]> {
        await this.loadCollection();

        return this.collection.chain()
            .find()
            .simplesort('year', false)
            .data();
    }

    /**
     * Add or update vehicle
     *
     * @param vehicle
     * @param key
     */
    public async updateVehicle(vehicle: any, key?: Key) {
        await this.loadCollection();

        const existingVehicle = await this.findOne({ key: { $eq: key }});

        if (existingVehicle && existingVehicle.mfrKey) {
            return await this.updateManyFields({
            userKey: vehicle.userKey,
                uniqueField: 'key',
                uniqueFieldValue: existingVehicle.key,
                updateFields: {
            mfrKey: vehicle.mfrKey,
            modelKey: vehicle.modelKey,
            image: vehicle.image,
            year: vehicle.year,
            color: vehicle.color,
            vin: vehicle.vin,
            plate: vehicle.plate,
                    condition: vehicle.condition,
                    modified: Datetime.getNow()
    }
            });
        } else {
            return await this.addOne(new Vehicle({
                userKey: vehicle.userKey,
                mfrKey: vehicle.mfrKey,
                modelKey: vehicle.modelKey,
                image: vehicle.image,
                year: vehicle.year,
                color: vehicle.color,
                vin: vehicle.vin,
                plate: vehicle.plate,
                condition: vehicle.condition
            }));
        }
    }
}
