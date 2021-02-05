import { Service } from 'typedi';
import { Key, Vehicle } from '../../../shared/models/models';
import { Datetime } from '../../../shared/models/utilities/Datetime';
import { DatabaseCollectionService } from '../../../shared/services/DatabaseCollectionService';

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
                style: vehicle.style,
                mileage: vehicle.mileage,
                vin: vehicle.vin,
                plate: vehicle.plate,
                condition: vehicle.condition
            })
        );
    }

    /**
     * Update vehicle
     *
     * @param vehicle
     * @param vehicleKey
     */
    public async update(vehicleKey: Key, vehicle: any): Promise<any> {
        await this.loadCollection();

        const existingVehicle = await this.findOne({ key: { $eq: vehicleKey } });

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
                    style: vehicle.style,
                    mileage: vehicle.mileage,
                    condition: vehicle.condition,
                    modified: Datetime.getNow()
                }
            });
        }
    }
}
