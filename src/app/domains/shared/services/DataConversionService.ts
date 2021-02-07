import * as _ from 'lodash';
import { Service } from 'typedi';
import { Datetime } from '../models/utilities/Datetime';
import { Text } from '../models/utilities/Text';
import { addressMappingValues } from '../../address/services/AddressService';
import { paintMappingValues} from '../../paint/services/PaintService';
import { propertyMappingValues} from '../../property/services/PropertyService';
import { propertyAreaMappingValues} from '../../property/services/PropertyAreaService';
import { storeMappingValues} from '../../store/services/StoreService';
import { userMappingValues} from '../../user/services/UserService';
import { vehicleMappingValues } from '../../vehicle/services/VehicleService';
import { vehiclePurchaseMappingValues } from '../../vehicle/services/VehiclePurchaseService';
import { vehicleApiMappingValues } from '../../vehicle/services/VehicleApiService';

@Service()
export class DataConversionService {

    method: string;

    constructor(method) {
        this.method = method;
    }
    /**
     * Process mapping and conversion
     *
     * @param payload
     */
    public process(payload) {
        if (!_.isArray(payload)) {
            return this.findAndConvert(payload);
        } else {
            return payload.map((obj) => {
                return this.findAndConvert(obj);
            });
        }
    }

    /**
     * Recursive method to go through
     * all nested objects
     *
     * @param target
     */
    public findAndConvert(target) {
        const clonedObj = { ...target };
        const entries = Object.entries(clonedObj);

        entries.forEach(([key, value]) => {
            if (typeof value === "object") {
                clonedObj[key] = this.findAndConvert(value);
            } else {
                clonedObj[key] = this.convert(key, value);
            }
        });

        return clonedObj;
    }

    /**
     * Return converted data
     *
     * Will take key as reference and find out which group
     * of converter it belongs. After getting group name,
     * apply appropriate converting method to value
     *
     * @param convertingKey
     * @param convertingValue
     */
    public convert(convertingKey, convertingValue) {
        let mappingType = '';
        const mappingKeys = this.getMappingKeys()
        _.forEach(mappingKeys, (keys, type) => {
            if (_.includes(keys, convertingKey)) {
                mappingType = type;
            }
        });

        // Map request data
        if (this.method === 'request') {
            switch(mappingType) {
                case 'decimals':
                case 'price':
                case 'phone':
                    return Text.numberWithoutCommas(convertingValue);
                case 'upper-text':
                case 'capitalized-text':
                    return Text.toLowerCase(convertingValue);
                case 'date':
                    return Datetime.getUTCFormat(convertingValue);
                case 'string-to-number':
                    return Text.toInteger(convertingValue);
                default:
                    return convertingValue;
            }
        } else {
        // Map response data
            switch(mappingType) {
                case 'decimals':
                    return Text.numberWithCommas(convertingValue);
                case 'date':
                    return Datetime.getMonthDateYearFormat(convertingValue);
                case 'upper-text':
                    return Text.toUpperCase(convertingValue);
                case 'capitalized-text':
                    return Text.capitalizeWords(convertingValue);
                case 'price':
                    return `${Text.numberWithCommas(convertingValue)}`;
                case 'phone':
                    return Text.formatPhoneNumber(convertingValue);
                default:
                    return convertingValue;
            }
        }
    }

    /**
     * Check if path is in the list for data modification
     * @param path
     */
    public isRequestConvertingRoute(path) {
        const regex = /^\/(vehicle-svc\/vehicle(s?|s?\/[0-9a-zA-Z-]{1,})|property-svc\/propert(y?|ies?|ies?\/[0-9a-zA-Z-]{1,}))$/;
        return regex.test(path);
    }

    public isResponseConvertingRoute(path) {
        const regex = /^\//;
        return regex.test(path);
    }

    /**
     * Get all combined mappers
     *
     * @private
     */
    private getMappingKeys() {
        return _.merge(
            {},
            addressMappingValues,
            paintMappingValues,
            propertyMappingValues,
            propertyAreaMappingValues,
            storeMappingValues,
            userMappingValues,
            vehicleMappingValues,
            vehiclePurchaseMappingValues,
            vehicleApiMappingValues
        );
    }
}
