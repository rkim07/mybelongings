"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyArea = exports.Property = void 0;
const Datetime_1 = require("../utilities/Datetime");
const Key_1 = require("../utilities/Key");
/**
 * Property
 */
class Property {
    /**
     * Constructor
     *
     * @param data
     */
    constructor(data) {
        this.key = Key_1.Key.generate();
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
        this.modified = this.created = Datetime_1.Datetime.getNow();
    }
}
exports.Property = Property;
/**
 * Property room
 */
class PropertyArea {
    /**
     * Constructor
     *
     * @param data
     */
    constructor(data) {
        this.key = Key_1.Key.generate();
        this.propertyKey = data.propertyKey;
        this.paintKey = data.paintKey;
        this.image = data.image;
        this.name = data.name;
        this.sqFt = data.sqFt;
        this.location = data.location;
        this.painted = data.painted;
        this.notes = data.notes;
        this.modified = this.created = Datetime_1.Datetime.getNow();
    }
}
exports.PropertyArea = PropertyArea;
//# sourceMappingURL=Property.js.map