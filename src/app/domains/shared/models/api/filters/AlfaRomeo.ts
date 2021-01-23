import * as _ from  'lodash';
import { CommonFilter } from "./CommonFilter";
import { Text } from '../../utilities/Text';

export class AlfaRomeo extends CommonFilter {

    /**
     * Constructor
     */
    constructor() {
        super();
    }

    /**
     * Extra validate by calling parent method
     *
     * @param name
     */
    public formatFrontEndModelName(name) {
        const urlDecoded = name.replace(/%20/g, ' ');

        if (/^giulia/i.test(urlDecoded)){
            return 'Giulia';
        } else if (/^\d+\w\s\.*/i.test(urlDecoded)) {
            return Text.capitalizeWords(urlDecoded);
        } else {
            return _.capitalize(urlDecoded);
        }
    }
}
