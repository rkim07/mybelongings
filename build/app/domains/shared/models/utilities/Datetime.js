"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Datetime = void 0;
/**
 * Datetime as ISO 8601 including Date, Time and Timezone offset. Format: 'yyyy-mm-ddThh:mm:ss(+/-)hh:mm'. E.g: '2017-05-30T23:59:59+00:00' where '+00:00' is for UTC
 * @author Swagger/James Gibbs
 */
class Datetime {
    /**
     * Creates and formats a Date object
     * @return {string}
     */
    static getNow() {
        const now = new Date();
        return this.formatDate(now);
    }
    static formatDate(date) {
        const tzo = -date.getTimezoneOffset();
        const dif = tzo >= 0 ? '+' : '-';
        function pad(num) {
            const norm = Math.abs(Math.floor(num));
            return (norm < 10 ? '0' : '') + norm;
        }
        return date.getUTCFullYear()
            + '-' + pad(date.getUTCMonth() + 1)
            + '-' + pad(date.getUTCDate())
            + 'T' + pad(date.getUTCHours())
            + ':' + pad(date.getUTCMinutes())
            + ':' + pad(date.getUTCSeconds())
            + '.' + pad(date.getUTCMilliseconds())
            + '+' + pad(0)
            + ':' + pad(0);
    }
    static getFormatString() {
        return 'YYYY-MM-DDTHH:mm:ss:SSZ';
    }
}
exports.Datetime = Datetime;
//# sourceMappingURL=Datetime.js.map