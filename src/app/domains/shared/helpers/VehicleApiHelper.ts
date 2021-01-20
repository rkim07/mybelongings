import * as _ from  'lodash';
import { FilterFactory } from '../models/api/FilterFactory';
import { CommonFilter } from '../models/api/filters/CommonFilter';
import { TextHelper } from './TextHelper';

export class VehicleApiHelperImpl {

    /**
     * Get specific filter class. If none, return common filter
     *
     * @param name
     */
    public getFilterClass(name = null) {
        if (!name) {
            return new CommonFilter();
        }

        try {
            const camelCaseWords = _.camelCase(name);
            const capitalizedWord = TextHelper.capitalizeWords(camelCaseWords);
            const filter: any = new FilterFactory(capitalizedWord, '');

            return filter;
        } catch (err) {
            return new CommonFilter();
        }
    }
}

const VehicleApiHelper = new VehicleApiHelperImpl();

export {
    VehicleApiHelper
};
