import * as _ from  'lodash';
import { workerData } from 'worker_threads';
import { CommonFilter } from "./CommonFilter";
import { Text } from '../../utilities/Text';

export class MercedesBenz extends CommonFilter {

    /**
     * Constructor
     */
    constructor() {
        super();
    }

    /**
     * Convert manufacturer's model name for front end
     *
     * @param name
     */
    public formatFrontEndModelName(name) {
        const urlDecoded = /%20|%22/g.test(name) ? name.replace(/%20|%22/g, ' ').trim() : name;

        if (/-/g.test(urlDecoded)) {
            return _.split(urlDecoded, '-').map((word) => {
                if (word.length <= 3) {
                    return word.toUpperCase();
                } else {
                    return _.startCase(word);
                }

            }).join('-');
        } else if (/\s/g.test(urlDecoded)) {
            return _.split(urlDecoded, ' ').map((word) => {
                if (word.length <= 3) {
                    return word.toUpperCase();
                } else {
                    return _.startCase(word);
                }

            }).join(' ');
        } else {
            return _.startCase(urlDecoded);
        }
    }
}
