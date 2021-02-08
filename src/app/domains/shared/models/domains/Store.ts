import { Datetime } from '../utilities/Datetime';
import { Key } from '../utilities/Key';

/**
 * Store
 */
export class Store {
    key: Key;
    addressKey: Key;
    name: string;
    landline: number;
    mobile: number;
    email: string;
    website: string;
    salesPerson: string;
    notes: string;
    created: string;
    modified: string;

    /**
     * Constructor
     *
     * @param data
     */
    constructor(data: {
        addressKey: Key;
        name: string;
        landline: number;
        mobile: number;
        email: string;
        website: string;
        salesPerson: string;
        notes: string;
    }) {
        this.key = Key.generate();
        this.addressKey = data.addressKey;
        this.name = data.name;
        this.landline = data.landline;
        this.mobile = data.mobile;
        this.email = data.email;
        this.website = data.website;
        this.salesPerson = data.salesPerson;
        this.notes = data.notes;
        this.modified = this.created = Datetime.getNow();
    }
}
