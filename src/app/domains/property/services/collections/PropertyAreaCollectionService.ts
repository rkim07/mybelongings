import { Service } from 'typedi';
import { PropertyArea } from '../../../shared/models/models';
import { DatabaseCollectionService } from '../../../shared/services/DatabaseCollectionService';
import { Datetime } from '../../../shared/models/utilities/Datetime';

@Service()
export class PropertyAreaCollectionService extends DatabaseCollectionService {

    /**
     * Constructor
     */
    constructor() {
        super('PropertyArea');
    }

    /**
     * Add or update property area
     *
     * @param area
     */
    public async updateArea(area: any) {
        await this.loadCollection();

        const existingArea = await this.findOne({ key: { $eq: area.key }});

        if (existingArea) {
            return await this.updateManyFields({
                uniqueField: 'key',
                uniqueFieldValue: existingArea.key,
                updateFields: {
                    propertyKey: area.propertyKey,
                    paintKey: area.paintKey,
                    image: area.image,
                    name: area.name,
                    sqFt: area.sqFt,
                    location: area.location,
                    notes: area.notes,
                    painted: area.painted,
                    modified: Datetime.getNow()
                }
            });
        } else {
            return await this.addOne(new PropertyArea({
                propertyKey: area.propertyKey,
                paintKey: area.paintKey,
                image: area.image,
                name: area.name,
                sqFt: area.sqFt,
                location: area.location,
                painted: area.painted,
                notes: area.notes
            }));
        }
    }
}
