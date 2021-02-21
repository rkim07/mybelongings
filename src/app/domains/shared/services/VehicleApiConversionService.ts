import * as _ from 'lodash';
import { XML } from 'sxml';
import { Container, Inject, Service } from 'typedi';
import { ApiService } from '../../api/services/ApiService';
import { NhtsaApiVehicleMfr } from '../models/domains/Vehicle';
import { Datetime } from '../models/utilities/Datetime';
import { Text } from '../models/utilities/Text';
import decode_value = XML.decode_value;

@Service()
export class VehicleApiConversionService {

    @Inject()
    private apiService: ApiService = Container.get(ApiService);

    method: string;

    /**
     * Constructor
     *
     * @param method
     */
    constructor(method) {
        this.method = method;
    }

    /**
     * Process mapping and conversion
     *
     * @param payload
     */
    public process(payload): any {
        if (!_.isArray(payload)) {
            return this.convert(payload);
        } else {
            return payload.map((obj) => {
                return this.convert(obj);
            });
        }
    }

    /**
     * Convert key with appropriate converter methods
     *
     * @param target
     */
    /**
     * Get specific class instance by manufacturer name and return its
     * formatted name
     *
     * @param mfrName
     * @param modelName
     * @private
     */
    public convert(obj: any): any {
        const clonedObj = { ...obj };

        _.forIn(obj, (value, key) => {
            const filterClass = this.apiService.getFilterClass(obj.mfrName);

            switch (key) {
                case 'key':
                    clonedObj[key] = value;
                    break;
                case 'mfrName':
                    clonedObj[key] = filterClass.formatFrontEndMfrName(value);
                    break;
                case 'model':
                    clonedObj[key] = filterClass.formatFrontEndModelName(value);
                    break;
                default:
                    delete (clonedObj[key]);
            }
        });

        return clonedObj;
    }

    /**
     * Check if it's response route for conversion
     *
     * @param path
     */
    public isResApiRoute(path): boolean {
        const regex = /^\/(=?api-svc)/;
        return regex.test(path);
    }
}
