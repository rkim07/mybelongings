import { Key } from '../models/models';

export interface Vehicle {
    userKey: Key;
    mfrKey: Key;
    modelKey: Key;
    image: string;
    year: number;
    color: string;
    vin: string;
    plate: string;
    condition: string;
}

export interface NhtsaApiVehicleMfrInterface {
    Make_ID: number;
    Make_Name: string;
}

export interface NhtsaApiVehicleModelInterface {
    Make_ID: number;
    Make_Name: string;
    Model_ID: number;
    Model_Name: string;
}
