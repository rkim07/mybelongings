"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const Datetime_1 = require("../utilities/Datetime");
const Key_1 = require("../utilities/Key");
class Address {
    /**
     * Constructor
     *
     * @param data
     */
    constructor(data) {
        this.key = Key_1.Key.generate();
        this.street = data.street;
        this.city = data.city;
        this.state = data.state;
        this.zip = data.zip;
        this.county = data.county;
        this.country = data.country;
        this.type = data.type;
        this.modified = this.created = Datetime_1.Datetime.getNow();
    }
}
exports.Address = Address;
//# sourceMappingURL=Address.js.map