"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const Datetime_1 = require("../utilities/Datetime");
const Key_1 = require("../utilities/Key");
/**
 * Store
 */
class Store {
    /**
     * Constructor
     *
     * @param data
     */
    constructor(data) {
        this.key = Key_1.Key.generate();
        this.addressKey = data.addressKey;
        this.name = data.name;
        this.phone = data.phone;
        this.email = data.email;
        this.website = data.website;
        this.salesPerson = data.salesPerson;
        this.notes = data.notes;
        this.modified = this.created = Datetime_1.Datetime.getNow();
    }
}
exports.Store = Store;
//# sourceMappingURL=Store.js.map