import { Service } from 'typedi';
import { Paint } from '../../shared/models/models';
import { DatabaseCollectionService } from '../../shared/services/DatabaseCollectionService';
import { Datetime } from '../../shared/models/utilities/Datetime';

@Service()
export class PaintCollectionService extends DatabaseCollectionService {

    /**
     * Constructor
     */
    constructor() {
        super('Paint');
    }

    /**
     * Get all paints
     */
    public async getPaints(): Promise<any> {
        await this.loadCollection();

        return this.collection.chain()
            .find()
            .simplesort('name', false)
            .data();
    }

    /**
     * Add or update property paint
     *
     * @param paint
     */
    public async updatePaint(paint: any) {
        await this.loadCollection();

        const existingPaint = await this.findOne({ key: { $eq: paint.key }});

        if (existingPaint) {
            return await this.updateManyFields({
                uniqueField: 'key',
                uniqueFieldValue: existingPaint.key,
                updateFields: {
                    storeKey: paint.storeKey,
                    image: paint.image,
                    name: paint.name,
                    number: paint.number,
                    color: paint.color,
                    hex: paint.hex,
                    rgb: paint.rgb,
                    lrv: paint.rgb,
                    barcode: paint.barcode,
                    usage: paint.usage,
                    notes: paint.notes,
                    modified: Datetime.getNow()
                }
            });
        } else {
            return await this.addOne(new Paint({
                storeKey: paint.storeKey,
                image: paint.image,
                name: paint.name,
                number: paint.number,
                color: paint.color,
                hex: paint.hex,
                rgb: paint.rgb,
                lrv: paint.rgb,
                barcode: paint.barcode,
                usage: paint.usage,
                notes: paint.notes
            }));
        }
    }
}
