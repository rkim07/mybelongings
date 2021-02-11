import { Get, JsonController, Param } from 'routing-controllers';
import { Container, Inject } from 'typedi';
import { HandleUpstreamError, ResponseError } from '../../shared/models/models';
import { VEHICLE_API_SERVICE_MESSAGES, VehicleApiService } from '../services/VehicleApiService';

const DEFAULT_VEHICLE_API_SERVICE_ERROR_MESSAGE = 'An unexpected error occurred in the vehicle service.';

@JsonController('/vehicle-api-svc')
export class VehicleApiController {

    @Inject()
    private apiVehicleService: VehicleApiService = Container.get(VehicleApiService);

    /**
     * @swagger
     * paths:
     *   /vehicle-api-svc/sync/nhtsa:
     *     get:
     *       description: Sync with NHTSA API
     *       security:
     *         - OauthSecurity:
     *           - ROLE_USER
     *       parameters:
     *         - name: Authorization
     *           in: header
     *           description: The JWT token with claims about user.
     *           type: string
     *           required: true
     *       responses:
     *         200:
     *           description: Data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the vehicle API service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/sync/nhtsa')
    public async syncNhtsaApi(): Promise<any> {
        try {
            const mfrs = await this.apiVehicleService.syncNhtsaApi();

            return {
                payload: mfrs,
                statusCode: 200,
                successCode: 'VEHICLE_API_SERVICE_MESSAGES.SYNC'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_API_SERVICE_MESSAGES.MFR_KEY_EMPTY:
                        return new ResponseError(500, err.key, '');
                    case VEHICLE_API_SERVICE_MESSAGES.VEHICLE_MFRS_NOT_FOUND:
                        return new ResponseError(500, err.key, '');
                    default:
                        return new ResponseError(500, 'VEHICLE_API_SERVICE_MESSAGES', DEFAULT_VEHICLE_API_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'VEHICLE_API_SERVICE_MESSAGES', DEFAULT_VEHICLE_API_SERVICE_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /vehicle-api-svc/manufacturers:
     *     get:
     *       description: Retrieve manufacturers
     *       security:
     *         - OauthSecurity:
     *           - ROLE_USER
     *       parameters:
     *         - name: Authorization
     *           in: header
     *           description: The JWT token with claims about user.
     *           type: string
     *           required: true
     *       responses:
     *         200:
     *           description: Data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the vehicle API service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/manufacturers')
    public async getManufacturers(): Promise<any> {
        try {
            const mfrs = await this.apiVehicleService.getApiMfrs();

            return {
                payload: mfrs,
                statusCode: 200,
                successCode: 'VEHICLE_API_SERVICE_MESSAGES.FETCHED_MFRS'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_API_SERVICE_MESSAGES.VEHICLE_MFRS_NOT_FOUND:
                        return new ResponseError(500, err.key, '');
                    default:
                        return new ResponseError(500, 'VEHICLE_API_SERVICE_MESSAGES', DEFAULT_VEHICLE_API_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'VEHICLE_API_SERVICE_MESSAGES', DEFAULT_VEHICLE_API_SERVICE_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /vehicle-api-svc/manufacturers/{mfr_key}/models:
     *     get:
     *       description: Fetch all models by manufacturer
     *       security:
     *         - OauthSecurity:
     *           - ROLE_USER
     *       parameters:
     *         - name: Authorization
     *           in: header
     *           description: The JWT token with claims about user.
     *           type: string
     *           required: true
     *         - in: path
     *           name: mfr_key
     *           description: The manufacturer ID being queried.
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: Data has been retrieved successfully.
     *         404:
     *           description: No vehicles found for user key provided.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the vehicle service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/manufacturers/:mfr_key/models')
    public async getManufacturerModels(@Param('mfr_key') mfrKey: string): Promise<any> {
        try {
            const models = await this.apiVehicleService.getApiModelsByMfrKey(mfrKey);

            return {
                payload: models,
                statusCode: 200,
                successCode: 'VEHICLE_API_SERVICE_MESSAGES.FETCHED_MODELS'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_API_SERVICE_MESSAGES.MFR_KEY_EMPTY:
                        return new ResponseError(500, err.key, '');
                    case VEHICLE_API_SERVICE_MESSAGES.VEHICLE_MODELS_NOT_FOUND:
                        return new ResponseError(404, err.key, '');
                    default:
                        return new ResponseError(500, 'VEHICLE_API_SERVICE_MESSAGES', DEFAULT_VEHICLE_API_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'VEHICLE_API_SERVICE_MESSAGES', DEFAULT_VEHICLE_API_SERVICE_ERROR_MESSAGE);
            }
        }
    }
}
