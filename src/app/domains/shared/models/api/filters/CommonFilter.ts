import * as _ from  'lodash';
import { Text } from '../../utilities/Text';

/**
 * Common filter
 */
export class CommonFilter {

    /**
     * Format manufacturer name that will be shown in front end
     *
     * @param name
     */
    public formatFrontEndMfrName(name) {
        return _.startCase(name);
    }

    /**
     * Format manufacturer name that will be saved in DB
     *
     * @param name
     */
    public formatDbMfrName(name) {
        return name.replace(/-/g, ' ').toLowerCase();
    }

    /**
     * Format model name that will be shown in front end
     *
     * @param name
     */
    public formatFrontEndModelName(name) {
        let formatted;
        const urlDecoded = /%20/g.test(name) ? name.replace(/%20/g, ' ').trim() : name;

        if (/^\w+\d/i.test(urlDecoded)) {
            formatted = urlDecoded.toUpperCase();
        } else if (/^\d\w+$/i.test(urlDecoded)) {
            formatted = urlDecoded.toUpperCase();
        } else {
            formatted = Text.capitalizeWords(urlDecoded);
        }

        return formatted;
    }

    /**
     * Format model name that will be saved in DB
     *
     * @param name
     */
    public formatDbModelName(name) {
        const urlDecoded = name.replace(/%20/g, ' ');
        return urlDecoded.toLowerCase().trim();
    }
}
