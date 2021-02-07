import * as moment from 'moment';

export class Datetime {
    /**
     * Creates and formats a Date object
     * @return {string}
     */
    static getNow(): string {
        const now = new Date();
        return this.getUTCFormat(now);
    }

    /**
     * Get date formatted as YYYY-MM-DDTHH:mm:ss:SSZ (UTC)
     *
     * @param date
     */
    static getUTCFormat(date: Date): string {
        const tzo = -date.getTimezoneOffset();
        const dif = tzo >= 0 ? '+' : '-';

        const pad = (num) => {
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

    /**
     * Get date formatted as MM/DD/YYYY
     *
     * @param date
     */
    static getMonthDateYearFormat(date: Date): string {
        return moment(date).format('MM/DD/YYYY');
    }

    /**
     * Get date formatted as YYYY-MM-DD
     *
     * @param date
     */
    static getIsoDateFormat(date) {
        return moment(date).format('YYYY-MM-DD');
    }
}
