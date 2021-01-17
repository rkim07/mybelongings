"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Key = void 0;
/**
 * Unique GUID indentifier
 * @author Swagger/James Gibbs
 */
class Key {
    /**
     * Returns a 32-character guid
     * @return {string}
     */
    static generate() {
        return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
exports.Key = Key;
//# sourceMappingURL=Key.js.map