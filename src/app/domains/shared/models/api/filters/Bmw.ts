import * as _ from  'lodash';
import { CommonFilter } from "./CommonFilter";
import { Text } from '../../utilities/Text';

export class Bmw extends CommonFilter {

    /**
     * Constructor
     */
    constructor() {
        super();
    }

    /**
     * Override parent method
     *
     * @param name
     */
    public formatFrontEndMfrName(name) {
        return name.toUpperCase();
    }

    /**
     * Convert manufacturer's model name for front end
     *
     * @param name
     */
    public formatFrontEndModelName(name) {
        const parent = super.formatFrontEndModelName(name);

        if (/^[f|r|c|k|r|s]\s\d+\s.*/i.test(parent)){
            return parent.toUpperCase();
        } else if (/^\d+\w+\s\/.*/i.test(parent)) {
            return Text.capitalizeWords(parent);
        } else {
            return _.capitalize(parent);
        }
    }
}
