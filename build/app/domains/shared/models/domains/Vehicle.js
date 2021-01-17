"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NhtsaApiVehicleModel = exports.NhtsaApiVehicleMfr = exports.Vehicle = void 0;
const Datetime_1 = require("../utilities/Datetime");
const Key_1 = require("../utilities/Key");
class Vehicle {
    /**
     * Constructor
     *
     * @param data
     */
    constructor(data) {
        this.key = Key_1.Key.generate();
        this.userKey = data.userKey;
        this.mfrKey = data.mfrKey;
        this.modelKey = data.modelKey;
        this.image = data.image;
        this.year = data.year;
        this.color = data.color;
        this.vin = data.vin;
        this.plate = data.plate;
        this.condition = data.condition;
        this.modified = this.created = Datetime_1.Datetime.getNow();
    }
}
exports.Vehicle = Vehicle;
class NhtsaApiVehicleMfr {
    /**
     * Constructor
     *
     * @param data
     */
    constructor(data) {
        this.key = Key_1.Key.generate();
        this.mfrId = data.mfrId;
        this.mfrName = data.mfrName;
        this.modified = this.created = Datetime_1.Datetime.getNow();
    }
}
exports.NhtsaApiVehicleMfr = NhtsaApiVehicleMfr;
class NhtsaApiVehicleModel {
    /**
     * Constructor
     *
     * @param data
     */
    constructor(data) {
        this.key = Key_1.Key.generate();
        this.mfrKey = data.mfrKey;
        this.modelId = data.modelId;
        this.model = data.model;
        this.modified = this.created = Datetime_1.Datetime.getNow();
    }
}
exports.NhtsaApiVehicleModel = NhtsaApiVehicleModel;
//# sourceMappingURL=Vehicle.js.map