import { CommonFilter } from './CommonFilter';
import { Text } from '../../utilities/Text';

export class Audi extends CommonFilter {
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

        if (/^\w{2}\s\w{2}$/i.test(parent)) {
            return parent.toUpperCase();
        } else if (/e-tron/gi.test(parent)) {
            const lowerCased = parent.toLowerCase();

            const splitted = lowerCased.split(' ');
            splitted.map((word, index) => {
               if (word != 'e-tron') {
                   splitted[index] = Text.capitalizeWords(word);
               }
            });

            return splitted.join(' ');
        }

        return parent;
    }
}
