import path from 'path';
import { Body, Delete, Get, HttpCode, JsonController, Param, Post, Put, Req, Res } from 'routing-controllers';
import { Container, Inject } from 'typedi';
import { AuthorisedRequest } from '../../shared/interfaces/AuthorisedRequest';
import { HandleUpstreamError, Key, ResponseError } from '../../shared/models/models';
import { VEHICLE_SERVICE_ERRORS, VehicleService } from '../services/VehicleService';

import { logger } from '../../../common/logging';

const DEFAULT_VEHICLE_ERROR_MESSAGE = 'An unexpected error occurred in the vehicle service.';

@JsonController('/vehicle-svc')
export class VehicleController {

    @Inject()
    private vehicleService: VehicleService = Container.get(VehicleService);

    /**
     * @swagger
     * paths:
     *   /vehicle-svc/vehicles/{vehicle_key}:
     *     get:
     *       summary: Fetch a specific vehicle.
     *       description: Fetch a specific vehicle.
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
     *         - name: vehicle_key
     *           in: path
     *           description: The key associated to the desired vehicle.
     *           type: string
     *           required: true
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
    @Get('/vehicles/:vehicle_key')
    public async getVehicle(
        @Req() { requestor: { origin }}: AuthorisedRequest,
        @Param('vehicle_key') vehicleKey: string): Promise<any> {
        try {
            const vehicle = await this.vehicleService.getVehicle(vehicleKey, origin);

            return {
                payload: vehicle || {},
                statusCode: 200,
                message: 'Fetched specific vehicle.'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_SERVICE_ERRORS.VEHICLE_KEY_EMPTY:
                        logger.error('Cannot identify vehicle at this current moment.');
                        return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
                    case VEHICLE_SERVICE_ERRORS.VEHICLE_NOT_FOUND:
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
     *   /vehicle-svc/vehicles/all:
     *     get:
     *       summary: Fetch all vehicles.
     *       description: Fetch all vehicles.
     *       tags:
     *          - Vehicle
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
     *         404:
     *           description: No vehicles found for user key provided.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the vehicle service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/vehicles/all')
    public async getAllVehicles(@Req() { requestor: { userKey, origin }}: AuthorisedRequest): Promise<any> {
        try {
            const vehicles = await this.vehicleService.getVehicles(origin);

            return {
                payload: vehicles || [],
                statusCode: 200,
                message: vehicles.length > 0 ? 'Fetched all the vehicles.' : 'Therea are no vehicles at this time.'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_SERVICE_ERRORS.VEHICLES_NOT_FOUND:
                        return new ResponseError(404, err.key, 'No vehicles were found.');
                    default:
                        return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
                }
            } else {

            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /vehicle-svc/vehicles/by/user:
     *     get:
     *       summary: Fetch all the vehicles of a user.
     *       description: Fetch all the vehicles of a user.
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
     *         404:
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
                payload: vehicles || [],
                statusCode: 200,
                message: vehicles.length > 0 ? 'Fetched all vehicles for the user.' : 'No vehicles were found for the user.'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_SERVICE_ERRORS.USER_KEY_EMPTY:
                        logger.error('User has not been provided.');
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
     *       security:
     *         - OauthSecurity:
     *           - ROLE_USER
     *       parameters:
     *         - name: Authorization
     *           in: header
     *           description: The JWT token with claims about user.
     *           type: string
     *           required: true
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
     *         422:
     *           description: Restrictions for adding vehicle.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the vehicle service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @HttpCode(201)
    @Post('/vehicle')
    public async addVehicle(
        @Req() { requestor: { userKey, origin }}: AuthorisedRequest,
        @Body() body: any): Promise<any> {
        try {
            const vehicle = await this.vehicleService.addVehicle(userKey, origin, body);

            return {
                payload: vehicle,
                statusCode: 201,
                message: 'Vehicle successfully added.'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_SERVICE_ERRORS.EMPTY_NEW_VEHICLE_INFO:
                        logger.error('Failed to provide all the information to add new vehicle.');
                        return new ResponseError(422, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
                    case VEHICLE_SERVICE_ERRORS.VIN_ALREADY_EXISTS:
                        return new ResponseError(422, err.key, 'Same VIN already found on another vehicle.');
                    case VEHICLE_SERVICE_ERRORS.VEHICLE_NOT_ADDED:
                        logger.error('DB problems while trying to add vehicle');
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
     *   /vehicle-svc/vehicles/{vehicle_key}:
     *     put:
     *       summary: Update vehicle.
     *       description: Update vehicle.
     *       tags:
     *          - Vehicle
     *       security:
     *         - OauthSecurity:
     *           - ROLE_USER
     *       parameters:
     *         - name: Authorization
     *           in: header
     *           description: The JWT token with claims about user.
     *           type: string
     *           required: true
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
     *         404:
     *           description: Vehicle not found for update.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the seat service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Put('/vehicles/:vehicle_key')
    public async putVehicle(
        @Req() { requestor: { userKey, origin }}: AuthorisedRequest,
        @Param('vehicle_key') vehicleKey: string,
        @Body() body: any
    ): Promise<any> {
        try {
            const vehicle = await this.vehicleService.updateVehicle(userKey, vehicleKey, origin, body);

            return {
                payload: vehicle,
                statusCode: 200,
                message: 'Vehicle successfully updated.'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_SERVICE_ERRORS.VEHICLE_KEY_EMPTY:
                        logger.error(500, err.key, 'Empty vehicle key provided.');
                        return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);

                    case VEHICLE_SERVICE_ERRORS.VEHICLE_NOT_UPDATED:
                        logger.error('DB problems while trying to update vehicle');
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
     *   /vehicle-svc/vehicles/{vehicle_key}:
     *     delete:
     *       summary: Delete vehicle.
     *       description: Delete vehicle.
     *       tags:
     *          - Vehicle
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
     *           description: The key for the current vehicle.
     *           required: true
     *           type: string
     *       responses:
     *         204:
     *           description: The vehicle was removed successfully.
     *         404:
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
    public async deleteVehicle(
        @Req() { requestor: { userKey }}: AuthorisedRequest,
        @Param('vehicle_key') vehicleKey: string,
        @Res() response: any): Promise<any> {
        try {
            const vehicle = await this.vehicleService.deleteVehicle(userKey, vehicleKey);

            if (vehicle) {
                response.send({
                    payload: vehicle,
                    statusCode: 204,
                    message: 'Vehicle successfully deleted.'
                });
            }
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_SERVICE_ERRORS.VEHICLE_KEY_EMPTY:
                        logger.error('Empty vehicle key provide.');
                        return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
                    case VEHICLE_SERVICE_ERRORS.VEHICLE_NOT_FOUND:
                        logger.error('Vehicle not found for removal.');
                        return new ResponseError(404, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
            }
        }
    }
}
