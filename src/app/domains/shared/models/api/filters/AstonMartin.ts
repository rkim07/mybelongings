import * as _ from  'lodash';
import { CommonFilter } from "./CommonFilter";
import { Text } from '../../utilities/Text';

export class AstonMartin extends CommonFilter {

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

        if (/^\w+\d+\s.*/i.test(parent)) {
            const lowerCased = parent.toLowerCase();
            return Text.capitalizeWords(lowerCased);
        }

        return parent;
    }
}
