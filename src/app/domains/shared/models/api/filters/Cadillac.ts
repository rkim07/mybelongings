import * as _ from  'lodash';
import { CommonFilter } from "./CommonFilter";
import { Text } from '../../utilities/Text';

export class Cadillac extends CommonFilter {

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
        const parent = super.formatFrontEndModelName(name);

        if(/^Escalade\s\.*/i.test(parent)){
            return parent.toUpperCase();
        } else if (/^\d+\w+\s\/.*/i.test(parent)) {
            return Text.capitalizeWords(parent);
        } else {
            return _.capitalize(parent);
        }
    }
}
