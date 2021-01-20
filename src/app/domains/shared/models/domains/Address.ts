import { Datetime } from "../utilities/Datetime";
import { Key } from "../utilities/Key";

export class Address {
    key: Key;
    street: string;
    city: string;
    state: string;
    zip: string;
    county: string;
    country: string;
    type: string;
    created: string;
    modified: string;

    /**
     * Constructor
     *
     * @param data
     */
    constructor(data: {
        street: string,
        city: string,
        state: string,
        zip: string,
        county: string,
        country: string,
        type: string
    }) {
        this.key = Key.generate();
        this.street = data.street;
        this.city = data.city;
        this.state = data.state;
        this.zip = data.zip;
        this.county = data.county;
        this.country = data.country;
        this.type = data.type;
        this.modified = this.created = Datetime.getNow();
    }
}
