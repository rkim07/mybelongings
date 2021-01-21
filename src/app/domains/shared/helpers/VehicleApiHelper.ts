import * as _ from  'lodash';
import { FilterFactory } from '../models/api/FilterFactory';
import { CommonFilter } from '../models/api/filters/CommonFilter';
import { Text } from '../models/utilities/Text';

export class VehicleApiHelper {

    /**
     * Get specific filter class. If none, return common filter
     *
     * @param name
     */
    static getFilterClass(name?: string) {
        if (!name) {
            return new CommonFilter();
        }

        try {
            const camelCaseWords = _.camelCase(name);
            const capitalizedWord = Text.capitalizeWords(camelCaseWords);
            const filter: any = new FilterFactory(capitalizedWord, '');

            return filter;
        } catch (err) {
            return new CommonFilter();
        }
    }
}
