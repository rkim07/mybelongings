import * as _ from 'lodash';
import { Service } from 'typedi';
import { Datetime } from '../models/utilities/Datetime';
import { Text } from '../models/utilities/Text';
import { addressMappingKeys } from '../../address/services/AddressService';
import { paintMappingKeys} from '../../paint/services/PaintService';
import { propertyMappingKeys} from '../../property/services/PropertyService';
import { propertyAreaMappingKeys} from '../../property/services/PropertyAreaService';
import { storeMappingKeys} from '../../store/services/StoreService';
import { userMappingKeys} from '../../user/services/UserService';
import { vehicleMappingKeys } from '../../vehicle/services/VehicleService';
import { vehiclePurchaseMappingKeys } from '../../vehicle/services/VehiclePurchaseService';
import { vehicleApiMappingKeys } from '../../vehicle/services/VehicleApiService';

@Service()
export class DataConversionService {

    method: string;
    keyMappers: Array<object>;

    /**
     * Constructor
     *
     * @param method
     */
    constructor(method) {
        this.method = method;
        this.keyMappers = [
            addressMappingKeys,
            paintMappingKeys,
            propertyMappingKeys,
            propertyAreaMappingKeys,
            storeMappingKeys,
            userMappingKeys,
            vehicleMappingKeys,
            vehiclePurchaseMappingKeys,
            vehicleApiMappingKeys
        ];
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
            if (typeof value === 'object') {
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
        const mappingKeys = this.getKeyMappers();
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
                case 'upperText':
                case 'capitalizedText':
                    return Text.toLowerCase(convertingValue);
                case 'date':
                    return Datetime.getUTCFormat(convertingValue);
                case 'stringToNumber':
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
                case 'upperText':
                    return Text.toUpperCase(convertingValue);
                case 'capitalizedText':
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
     * Check if it's request route for conversion
     * @param path
     */
    public isRequestRouteForConversion(path) {
        const regex = /^\/(vehicle-svc\/vehicle(s?|s?\/[0-9a-zA-Z-]{1,})|property-svc\/propert(y?|ies?|ies?\/[0-9a-zA-Z-]{1,}))$/;
        return regex.test(path);
    }

    /**
     * Check if it's response route for conversion
     *
     * @param path
     */
    public isResponseRouteForConversion(path) {
        const regex = /^\/(=?vehicle-svc|property-svc)/;
        return regex.test(path);
    }

    /**
     * Get all combined mappers
     *
     * Needed to create own merging instead of using 3rd party libraries.
     * Most of the librarires out there, merges arrays by key as a result
     * excluding or overriding other array keys in objects.  This functionality
     * will preserve and add any new element of the next array uniquely.
     *
     * @private
     */
    private getKeyMappers() {
        let mainArr = {};
        let tempArr;
        let distinctArr;

        _.forEach(this.keyMappers, (mapper, index) => {
            _.forIn(mapper, (mapperValue, key) => {
                if (!mainArr[key]) {
                    mainArr[key] = mapperValue;
                } else {
                    tempArr = [...mainArr[key], ...mapperValue];
                    distinctArr = new Set(tempArr);
                    mainArr[key] = [...distinctArr];
                }
            });
        });

        return mainArr;
    }
}
