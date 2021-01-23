import { Datetime } from '../utilities/Datetime';
import { Key } from '../utilities/Key';

export class Vehicle {
    key: Key;
    userKey: Key;
    mfrKey: Key;
    modelKey: Key;
    image: string;
    year: number;
    color: string;
    vin: string;
    plate: string;
    condition: string;
    created: string;
    modified: string;

    /**
     * Constructor
     *
     * @param data
     */
    constructor(data: {
        userKey: Key;
        mfrKey: Key,
        modelKey: Key,
        image: string,
        year: number,
        color: string,
        vin: string,
        plate: string,
        condition: string
    }) {
        this.key = Key.generate();
        this.userKey = data.userKey;
        this.mfrKey = data.mfrKey;
        this.modelKey = data.modelKey;
        this.image = data.image;
        this.year = data.year;
        this.color = data.color;
        this.vin = data.vin;
        this.plate = data.plate;
        this.condition = data.condition;
        this.modified = this.created = Datetime.getNow();
    }
}

export class NhtsaApiVehicleMfr {
    key: Key;
    mfrId: number;
    mfrName: string;
    created: string;
    modified: string;

    /**
     * Constructor
     *
     * @param data
     */
    constructor(data: {
        mfrId: number,
        mfrName: string
    }) {
        this.key = Key.generate();
        this.mfrId = data.mfrId;
        this.mfrName = data.mfrName;
        this.modified = this.created = Datetime.getNow();
    }
}

export class NhtsaApiVehicleModel {
    key: Key;
    mfrKey: Key;
    modelId: number;
    model: string;
    created: string;
    modified: string;

    /**
     * Constructor
     *
     * @param data
     */
    constructor(data: {
        mfrKey: Key,
        modelId: number,
        model: string
    }) {
        this.key = Key.generate();
        this.mfrKey = data.mfrKey;
        this.modelId = data.modelId;
        this.model = data.model;
        this.modified = this.created = Datetime.getNow();
    }
}
