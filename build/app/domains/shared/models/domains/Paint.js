"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paint = void 0;
const Datetime_1 = require("../utilities/Datetime");
const Key_1 = require("../utilities/Key");
/**
 * Store
 */
class Paint {
    /**
     * Constructor
     *
     * @param data
     */
    constructor(data) {
        this.key = Key_1.Key.generate();
        this.storeKey = data.storeKey;
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
        this.modified = this.created = Datetime_1.Datetime.getNow();
    }
}
exports.Paint = Paint;
//# sourceMappingURL=Paint.js.map