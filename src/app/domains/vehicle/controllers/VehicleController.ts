import { Body, Delete, Get, HttpCode, JsonController, Param, Post, Put, Req, Res } from 'routing-controllers';
import { Container, Inject } from 'typedi';
import { AuthorisedRequest } from '../../shared/interfaces/AuthorisedRequest';
import {HandleUpstreamError, Key, ResponseError} from '../../shared/models/models';
import { VEHICLE_ERRORS, VehicleService } from '../services/VehicleService';

const DEFAULT_VEHICLE_ERROR_MESSAGE = 'An unexpected error occurred in the vehicle service.';

@JsonController('/vehicle-svc')
export class VehicleController {

    @Inject()
    /**
     * @swagger
     * paths:
     *   /vehicle-svc/vehicles/{vehicle_key}:
     *     get:
     *       summary: Fetch a specific vehicle.
     *       description: Retrieve a specific vehicle.
     *       tags:
     *         - Vehicle
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
     *           name: vehicle_key
     *           description: The vehicle key being queried.
     *           type: string
     *           minimum: 5
     *           required: true
     *       responses:
     *         200:
     *           description: Data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the vehicle service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    private vehicleService: VehicleService = Container.get(VehicleService);

    @Get('/vehicles/:vehicle_key')
    public async getVehicle(
        @Req() { requestor: { origin }}: AuthorisedRequest,
        @Param('vehicle_key') vehicleKey: Key): Promise<any> {
        try {
            const vehicle = await this.vehicleService.getVehicle(vehicleKey, origin);

            return {
                vehicle: vehicle,
                statusCode: 200,
                message: 'Successfully retrieved specific vehicle.'
            }
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_ERRORS.VEHICLE_KEY_EMPTY:
                        console.error('Empty vehicle key provided.');
                        return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
                    case VEHICLE_ERRORS.VEHICLE_NOT_FOUND:
                        return new ResponseError(404, err.key, 'No vehicles were found for the user.');
                    default:
                        return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /vehicle-svc/vehicles:
     *     get:
     *       summary: Fetch all vehicles
     *       description: Fetch all users vehicles.
     *       responses:
     *         200:
     *           description: Data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the vehicle service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/vehicles')
    public async getVehicles(@Req() req: any): Promise<any> {
        try {
            const vehicles = await this.vehicleService.getVehicles(req.requestor.referrer);

            return {
                vehicles: vehicles,
                statusCode: 200,
                message: 'Successfully retrieved all vehicles.'
            }
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_ERRORS.VEHICLES_NOT_FOUND:
                        return new ResponseError(404, err.key, 'No vehicles were found.');
                    default:
                        return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /vehicle-svc/vehicles/by/user:
     *     get:
     *       summary: Fetch the vehicle of a user by key.
     *       description: Return the vehicle of a user
     *       tags:
     *         - Vehicle
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
     *           schema:
     *             $ref: '#/definitions/Vehicle'
     *         x-404_NO_VEHICLES_FOUND:
     *           description: No vehicles found for user key provided.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the vehicle service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/vehicles/by/user')
    public async getUserVehicles(@Req() { requestor: { userKey, origin }}: AuthorisedRequest): Promise<any> {
        try {
            const vehicles = await this.vehicleService.getUserVehicles(userKey, origin);

            return {
                vehicles: vehicles,
                statusCode: 200,
                message: 'Successfully retrieved all vehicles for this user.'
            }
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_ERRORS.VEHICLES_NOT_FOUND:
                        console.info('User does not have any vehicles.');
                        return new ResponseError(404, err.key, 'No vehicles were found for the user.');
                    case VEHICLE_ERRORS.USER_KEY_EMPTY:
                        console.error('Empty user key provided.');
                        return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /vehicle-svc/vehicle:
     *     post:
     *       summary: Add vehicle
     *       description: Add vehicle
     *       tags:
     *          - Vehicle
     *       parameters:
     *         - in: body
     *           name: request
     *           description: New vehicle information.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/Vehicle'
     *       responses:
     *         201:
     *           description: Data has been added successfully.
     *           schema:
     *             $ref: '#/definitions/Vehicle'
     *         500:
     *           description: An unexpected error occurred in the vehicle service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @HttpCode(201)
    @Post('/vehicle')
    public async addVehicle(
        @Req() req: any,
        @Body() body: any): Promise<any> {
        try {
            const vehicle = await this.vehicleService.addVehicle(req.requestor.referrer, body);

            return {
                vehicle: vehicle,
                statusCode: 201,
                message: 'Successfully added vehicle'
            }
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_ERRORS.EMPTY_NEW_VEHICLE_INFO:
                        console.error('Failed to provide all the information to add new vehicle.');
                        return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
                    case VEHICLE_ERRORS.VIN_ALREADY_EXISTS:
                        return new ResponseError(500, err.key, 'Same VIN already found on another vehicle.');
                    default:
                        return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /vehicle-svc/vehicles/{vehicle_key}:
     *     put:
     *       summary: Update vehicle.
     *       description: Update vehicle.
     *       tags:
     *         - Vehicle
     *       parameters:
     *         - name: vehicle_key
     *           in: path
     *           description: The key associated to the desired vehicle.
     *           type: string
     *           required: true
     *         - in: body
     *           name: request
     *           description: Request with vehicle to be added.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/Vehicle'
     *       responses:
     *         200:
     *           description: The shipping address was updated successfully.
     *           schema:
     *             $ref: '#/definitions/Vehicle'
     *         x-404_NOT_FOUND:
     *           description: Please input another vehicle because the vehicle does not exist.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the seat service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Put('/vehicles/:vehicle_key')
    public async putVehicle(
        @Req() req: any,
        @Param('vehicle_key') vehicleKey: string,
        @Body() body: any
    ): Promise<any> {
        try {
            const vehicle = await this.vehicleService.updateVehicle(req.requestor.referrer, body, vehicleKey);

            return {
                vehicle: vehicle,
                statusCode: 200,
                message: 'Successfully updated vehicle.'
            }
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_ERRORS.VEHICLE_KEY_EMPTY:
                        console.error(500, err.key, 'Empty vehicle key provided.');
                        return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
                    case VEHICLE_ERRORS.VIN_ALREADY_EXISTS:
                        return new ResponseError(500, err.key, 'Same VIN already found on another vehicle.');
                    default:
                        return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /vehicle-svc/vehicles/{vehicle_key}:
     *     delete:
     *       summary: Delete  vehicle.
     *       description: Remove  vehicle.
     *       tags:
     *         - Vehicle
     *       parameters:
     *         - in: path
     *           name: vehicle_key
     *           description: The key for the current vehicle.
     *           required: true
     *           type: string
     *       responses:
     *         204:
     *           description: The vehicle was removed successfully.
     *         x-404_VEHICLE_NOT_FOUND:
     *           description: No vehicle was found for the vehicle key provided.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the vehicle service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @HttpCode(204)
    @Delete('/vehicles/:vehicle_key')
    public async deleteVehicle(@Param('vehicle_key') vehicleKey: string, @Res() response: any): Promise<any> {
        try {
            const vehicle = await this.vehicleService.deleteVehicle(vehicleKey);

            if (vehicle) {
                response.send({
                    vehicle: vehicle,
                    statusCode: 204,
                    message: 'Successfully deleted vehicle.'
                });
            }
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_ERRORS.VEHICLE_KEY_EMPTY:
                        console.error('Empty vehicle key provide.');
                        return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
                    case VEHICLE_ERRORS.VEHICLE_NOT_FOUND:
                        console.error('Vehicle cannot be deleted at this time.');
                        return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
            }
        }
    }
}
