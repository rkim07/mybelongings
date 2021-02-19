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
    public formatFrontEndMfrName(name: string): string {
        return Text.capitalizeWords(name);
    }

    /**
     * Format manufacturer name that will be saved in DB
     *
     * @param name
     */
    public formatDbMfrName(name: string): string {
        return name.replace(/-/g, ' ').toLowerCase();
    }

    /**
     * Format model name that will be shown in front end
     *
     * @param name
     */
    public formatFrontEndModelName(name: string): string {
        const urlDecoded = /%20|%22|%26|%27|%28|%29|%3A/g.test(name) ? name.replace(/%20|%22|%26|%27|%28|%29|%3A/g, ' ').trim() : name;
        const reservedUpperCaseWords = ['car', 'new', 'van', 'low', 'cab', 'del', 'sol', 'max'];

        return _.split(urlDecoded, ' ').map((word) => {
            if (word === 'and') {
                return word;
            } else if (_.includes(reservedUpperCaseWords, word)) {
                return _.startCase(word);
            } else if (/^(\d+[a-zA-Z]|[a-zA-Z]+\d)/.test(word) || word.length <= 3) {
                return word.toUpperCase();
            } else if (/^[a-zA-Z]+$/.test(word) || /^[a-zA-Z]+-[a-zA-Z]+$/.test(word) || /^[a-zA-Z]+\/[a-zA-Z]+$/.test(word)) {
                return _.startCase(word);
            } else {
                return word.toUpperCase()
            }
        }).join(' ');
    }

    /**
     * Format model name that will be saved in DB
     *
     * @param name
     */
    public formatDbModelName(name: string): string {
        const urlDecoded = name.replace(/%20/g, ' ');
        return urlDecoded.toLowerCase().trim();
    }
}
