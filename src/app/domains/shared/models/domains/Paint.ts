import { Datetime } from '../utilities/Datetime';
import { Key } from '../utilities/Key';

/**
 * Business
 */
export class Paint {
    key: Key;
    businessKey: string;
    image: string;
    name: string;
    number: string;
    color: string;
    hex: string;
    rgb: string;
    lrv: string;
    barcode: string;
    usage: string;
    notes: string;
    created: string;
    modified: string;

    /**
     * Constructor
     *
     * @param data
     */
    constructor(data: {
        businessKey: string,
        image: string,
        name: string,
        number: string,
        color: string,
        hex: string,
        rgb: string,
        lrv: string,
        barcode: string,
        usage: string,
        notes: string,
    }) {
        this.key = Key.generate();
        this.businessKey = data.businessKey;
        this.image = data.image;
        this.name = data.name;
        this.number = data.number;
        this.color = data.color;
        this.hex = data.hex;
        this.rgb = data.rgb;
        this.lrv = data.lrv;
        this.barcode = data.barcode;
        this.usage = data.usage;
        this.notes = data.notes;
        this.modified = this.created = Datetime.getNow();
    }
}
