import { Get, JsonController, Param } from 'routing-controllers';
import { Container, Inject } from 'typedi';
import { HandleUpstreamError, ResponseError } from '../../shared/models/models';
import { API_SERVICE_MESSAGES, ApiService } from '../services/ApiService';

const DEFAULT_NHTSA_API_SERVICE_ERROR_MESSAGE = 'An unexpected error occurred in the vehicle service.';

@JsonController('/api-svc')
export class ApiController {

    @Inject()
    private apiService: ApiService = Container.get(ApiService);

    /**
     * @swagger
     * paths:
     *   /api-svc/nhtsa/sync:
     *     get:
     *       description: Sync with NHTSA API
     *       tags:
     *         - Vehicle API
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
    @Get('/nhtsa/sync')
    public async syncNhtsaApi(): Promise<any> {
        try {
            const mfrs = await this.apiService.syncNhtsaApi();

            return {
                payload: mfrs,
                statusCode: 200,
                successCode: 'API_SERVICE_MESSAGES.NHTSA_SYNC'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case API_SERVICE_MESSAGES.NHTSA_MFR_KEY_EMPTY:
                        return new ResponseError(500, err.key, '');
                    case API_SERVICE_MESSAGES.NHTSA_MFRS_NOT_FOUND:
                        return new ResponseError(500, err.key, '');
                    default:
                        return new ResponseError(500, 'API_SERVICE_MESSAGES', DEFAULT_NHTSA_API_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'API_SERVICE_MESSAGES', DEFAULT_NHTSA_API_SERVICE_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /api-svc/nhtsa/manufacturers:
     *     get:
     *       description: Retrieve manufacturers
     *       tags:
     *         - Vehicle API
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
    @Get('/nhtsa/manufacturers')
    public async getManufacturers(): Promise<any> {
        try {
            const mfrs = await this.apiService.getNhtsaMfrs();

            return {
                payload: mfrs,
                statusCode: 200,
                successCode: 'API_SERVICE_MESSAGES.FETCHED_NHTSA_MFRS'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case API_SERVICE_MESSAGES.NHTSA_MFRS_NOT_FOUND:
                        return new ResponseError(500, err.key, '');
                    default:
                        return new ResponseError(500, 'API_SERVICE_MESSAGES', DEFAULT_NHTSA_API_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'API_SERVICE_MESSAGES', DEFAULT_NHTSA_API_SERVICE_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /api-svc/nhtsa/manufacturers/{mfr_key}/models:
     *     get:
     *       description: Fetch all models by manufacturer
     *       tags:
     *         - Vehicle API
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
    @Get('/nhtsa/manufacturers/:mfr_key/models')
    public async getManufacturerModels(@Param('mfr_key') mfrKey: string): Promise<any> {
        try {
            const models = await this.apiService.getNhtsaModelsByMfrKey(mfrKey);

            return {
                payload: models,
                statusCode: 200,
                successCode: 'API_SERVICE_MESSAGES.FETCHED_NHTSA_MODELS'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case API_SERVICE_MESSAGES.NHTSA_MFR_KEY_EMPTY:
                        return new ResponseError(500, err.key, '');
                    case API_SERVICE_MESSAGES.NHTSA_MODELS_NOT_FOUND:
                        return new ResponseError(404, err.key, '');
                    default:
                        return new ResponseError(500, 'API_SERVICE_MESSAGES', DEFAULT_NHTSA_API_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'API_SERVICE_MESSAGES', DEFAULT_NHTSA_API_SERVICE_ERROR_MESSAGE);
            }
        }
    }
}
