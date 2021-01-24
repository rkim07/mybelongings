import { Get, JsonController, Param } from 'routing-controllers';
import { Container, Inject } from 'typedi';
import { HandleUpstreamError, ResponseError } from '../../shared/models/models';
import { VEHICLE_API_ERRORS, VehicleApiService } from '../services/VehicleApiService';

@JsonController('/vehicle-api-svc')
export class VehicleApiController {

    @Inject()
    private apiVehicleService: VehicleApiService = Container.get(VehicleApiService);

    /**
     * @swagger
     * paths:
     *   /vehicle-api-svc/sync/nhtsa:
     *     get:
     *       summary: Retrieve API manufacturers list maintained by NHTSA API
     *       description: Retrieve API manufacturers list maintained by NHTSA API
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
                mfrs: mfrs,
                statusCode: 200,
                message: 'Successfully synced all vehicles from NHTSA API.'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_API_ERRORS.MFR_KEY_EMPTY:
                        return new ResponseError(500, err.key, 'Empty manufacturer key provided.');
                    case VEHICLE_API_ERRORS.VEHICLE_MFRS_NOT_FOUND:
                        return new ResponseError(500, err.key, 'No manufacturers were found for sync.');
                    default:
                        return new ResponseError(500, err.key, 'An unexpected error occurred in the vehicle service.');
                }
            } else {
                return new ResponseError(500, err.key, 'An unexpected error occurred in the vehicle service.');
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /vehicle-api-svc/manufacturers:
     *     get:
     *       summary: Retrieve API manufacturer's models list maintained by NHTSA API
     *       description: Retrieve vehicle list from DB
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
                mfrs: mfrs,
                statusCode: 200,
                message: 'Successfully retrieved all manufactures.'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_API_ERRORS.VEHICLE_MFRS_NOT_FOUND:
                        return new ResponseError(500, err.key, 'No manufacturers were found for sync.');
                    default:
                        return new ResponseError(500, err.key, 'An unexpected error occurred in the vehicle service.');
                }
            } else {
                return new ResponseError(500, err.key, 'An unexpected error occurred in the vehicle service.');
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /vehicle-api-svc/manufacturers/{mfr_key}/models:
     *     get:
     *       summary: Get a list of all vehicles
     *       description: Retrieve vehicle list from DB
     *       parameters:
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
                models: models,
                statusCode: 200,
                message: 'Successfully retrieved all models for a particular manufacturer.'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_API_ERRORS.MFR_KEY_EMPTY:
                        return new ResponseError(500, err.key, 'Empty manufacturer key provided.');
                    case VEHICLE_API_ERRORS.VEHICLE_MODELS_NOT_FOUND:
                        return new ResponseError(404, err.key, 'No models for this particular manufacturer were found.');
                    default:
                        return new ResponseError(500, err.key, 'An unexpected error occurred in the vehicle service.');
                }
            } else {
                return new ResponseError(500, err.key, 'An unexpected error occurred in the vehicle service.');
            }
        }
    }
}
