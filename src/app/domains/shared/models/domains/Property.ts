import { Datetime } from '../utilities/Datetime';
import { Key } from '../utilities/Key';

/**
 * Property
 */
export class Property {
    key: Key;
    userKey: Key;
    addressKey: Key;
    year: number;
    type: string;
    style: string;
    bedrooms: number;
    bathrooms: number;
    stories: number;
    garage: string;
    parkingSpaces: number;
    basement: string;
    features: string;
    sqFt: string;
    lotSize: string;
    apn: string;
    subdivision: string;
    image: string;
    created: string;
    modified: string;

    /**
     * Constructor
     *
     * @param data
     */
    constructor(data: {
        userKey: string,
        addressKey: string,
        year: number,
        type: string,
        style: string,
        bedrooms: number,
        bathrooms: number,
        stories: number,
        garage: string,
        parkingSpaces: number,
        basement: string,
        features: string,
        sqFt: string,
        lotSize: string,
        apn: string,
        subdivision: string,
        image: string
    }) {
        this.key = Key.generate();
        this.userKey = data.userKey;
        this.addressKey = data.addressKey;
        this.year = data.year;
        this.type = data.type;
        this.style = data.style;
        this.bedrooms = data.bedrooms;
        this.bathrooms = data.bathrooms;
        this.stories = data.stories;
        this.garage = data.garage;
        this.parkingSpaces = data.parkingSpaces;
        this.basement = data.basement;
        this.features = data.features;
        this.sqFt = data.sqFt;
        this.lotSize = data.lotSize;
        this.apn = data.apn;
        this.subdivision = data.subdivision;
        this.image = data.image;
        this.modified = this.created = Datetime.getNow();
    }
}

/**
 * Property room
 */
export class PropertyArea {
    key: Key;
    propertyKey: Key;
    paintKey: Key;
    image: string;
    name: string;
    sqFt: string;
    location: string;
    painted: string
    notes: string;
    created: string;
    modified: string;

    /**
     * Constructor
     *
     * @param data
     */
    constructor(data: {
        propertyKey: string,
        paintKey: string,
        image: string;
        name: string,
        sqFt: string,
        location: string,
        painted: string,
        notes: string
    }) {
        this.key = Key.generate();
        this.propertyKey = data.propertyKey;
        this.paintKey = data.paintKey;
        this.image = data.image;
        this.name = data.name;
        this.sqFt = data.sqFt;
        this.location = data.location;
        this.painted = data.painted;
        this.notes = data.notes;
        this.modified = this.created = Datetime.getNow();
    }
}
