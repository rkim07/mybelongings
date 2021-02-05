import path from 'path';
import { Body, Delete, Get, HttpCode, JsonController, Param, Post, Put, Req, Res } from 'routing-controllers';
import { Container, Inject } from 'typedi';
import { AuthorisedRequest } from '../../shared/interfaces/AuthorisedRequest';
import { HandleUpstreamError, Key, ResponseError } from '../../shared/models/models';
import { VEHICLE_SERVICE_MESSAGES, VehicleService } from '../services/VehicleService';

import { logger } from '../../../common/logging';

const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred in the vehicle service.';

@JsonController('/vehicle-svc')
export class VehicleController {

    @Inject()
    private vehicleService: VehicleService = Container.get(VehicleService);

    /**
     * @swagger
     * paths:
     *   /vehicle-svc/vehicles/{vehicle_key}:
     *     get:
     *       description: Fetch vehicle by key.
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
     *           description: The key associated to the vehicle.
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
        @Req() { requestor: { host }}: AuthorisedRequest,
        @Param('vehicle_key') vehicleKey: string): Promise<any> {
        try {
            const vehicle = await this.vehicleService.getVehicle(vehicleKey, host);

            return {
                payload: vehicle || {},
                statusCode: 200,
                message: 'Fetched specific vehicle.'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_SERVICE_MESSAGES.VEHICLE_KEY_EMPTY:
                        return new ResponseError(500, 'VEHICLE_SERVICE_MESSAGES.DEFAULT_ERROR_MESSAGE', DEFAULT_ERROR_MESSAGE);
                    case VEHICLE_SERVICE_MESSAGES.VEHICLE_NOT_FOUND:
                        return new ResponseError(404, err.key, '');
                    default:
                        return new ResponseError(500, 'VEHICLE_SERVICE_MESSAGES.DEFAULT_ERROR_MESSAGE', DEFAULT_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'VEHICLE_SERVICE_MESSAGES.DEFAULT_ERROR_MESSAGE', DEFAULT_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /vehicle-svc/vehicles:
     *     get:
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
    @Get('/vehicles')
    public async getAllVehicles(@Req() { requestor: { userKey, host }}: AuthorisedRequest): Promise<any> {
        try {
            const vehicles = await this.vehicleService.getVehicles(host);

            return {
                payload: vehicles || [],
                statusCode: 200,
                message: vehicles.length > 0 ? 'Fetched all the vehicles.' : 'There are no vehicles at this time.'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_SERVICE_MESSAGES.VEHICLES_NOT_FOUND:
                        return new ResponseError(404, err.key, '');
                    default:
                        return new ResponseError(500, 'VEHICLE_SERVICE_MESSAGES.DEFAULT_ERROR_MESSAGE', DEFAULT_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'VEHICLE_SERVICE_MESSAGES.DEFAULT_ERROR_MESSAGE', DEFAULT_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /vehicle-svc/vehicles/by/user:
     *     get:
     *       description: Fetch all the vehicles for a user by user key
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
    public async getUserVehicles(@Req() { requestor: { userKey, host }}: AuthorisedRequest): Promise<any> {
        try {
            const vehicles = await this.vehicleService.getUserVehicles(userKey, host);

            return {
                payload: vehicles || [],
                statusCode: 200,
                message: vehicles.length > 0 ? 'Fetched all vehicles for the user.' : 'No vehicles were found for the user.'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_SERVICE_MESSAGES.USER_KEY_EMPTY:
                        return new ResponseError(500, 'VEHICLE_SERVICE_MESSAGES.DEFAULT_ERROR_MESSAGE', DEFAULT_ERROR_MESSAGE);
                    case VEHICLE_SERVICE_MESSAGES.VEHICLES_NOT_FOUND:
                        return new ResponseError(404, err.key, '');
                    default:
                        return new ResponseError(500, 'VEHICLE_SERVICE_MESSAGES.DEFAULT_ERROR_MESSAGE', DEFAULT_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'VEHICLE_SERVICE_MESSAGES.DEFAULT_ERROR_MESSAGE', DEFAULT_ERROR_MESSAGE);
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
        @Req() { requestor: { userKey, host }}: AuthorisedRequest,
        @Body() body: any): Promise<any> {
        try {
            const vehicle = await this.vehicleService.addVehicle(userKey, body, host);

            return {
                payload: vehicle,
                statusCode: 201,
                message: 'Vehicle successfully added.'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_SERVICE_MESSAGES.EMPTY_NEW_VEHICLE_INFO:
                        return new ResponseError(422, 'VEHICLE_SERVICE_MESSAGES.DEFAULT_ERROR_MESSAGE', '');
                    case VEHICLE_SERVICE_MESSAGES.EXISTING_VIN:
                        return new ResponseError(422, err.key, '');
                    case VEHICLE_SERVICE_MESSAGES.VEHICLE_NOT_ADDED:
                        return new ResponseError(500, 'VEHICLE_SERVICE_MESSAGES.DEFAULT_ERROR_MESSAGE', DEFAULT_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, 'VEHICLE_SERVICE_MESSAGES.DEFAULT_ERROR_MESSAGE', DEFAULT_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'VEHICLE_SERVICE_MESSAGES.DEFAULT_ERROR_MESSAGE', DEFAULT_ERROR_MESSAGE);
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
     *           description: The key associated to the vehicle.
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
        @Req() { requestor: { userKey, host }}: AuthorisedRequest,
        @Param('vehicle_key') vehicleKey: string,
        @Body() body: any
    ): Promise<any> {
        try {
            const vehicle = await this.vehicleService.updateVehicle(vehicleKey, body, host);

            return {
                payload: vehicle,
                statusCode: 200,
                message: 'Vehicle successfully updated.'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_SERVICE_MESSAGES.VEHICLE_KEY_EMPTY:
                        return new ResponseError(500, 'VEHICLE_SERVICE_MESSAGES.DEFAULT_ERROR_MESSAGE', DEFAULT_ERROR_MESSAGE);

                    case VEHICLE_SERVICE_MESSAGES.VEHICLE_NOT_UPDATED:
                        return new ResponseError(500, 'VEHICLE_SERVICE_MESSAGES.DEFAULT_ERROR_MESSAGE', DEFAULT_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, 'VEHICLE_SERVICE_MESSAGES.DEFAULT_ERROR_MESSAGE', DEFAULT_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'VEHICLE_SERVICE_MESSAGES.DEFAULT_ERROR_MESSAGE', DEFAULT_ERROR_MESSAGE);
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
            const vehicle = await this.vehicleService.deleteVehicle(vehicleKey);

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
                    case VEHICLE_SERVICE_MESSAGES.VEHICLE_KEY_EMPTY:
                        return new ResponseError(500, 'VEHICLE_SERVICE_MESSAGES.DEFAULT_ERROR_MESSAGE', DEFAULT_ERROR_MESSAGE);
                    case VEHICLE_SERVICE_MESSAGES.VEHICLE_NOT_FOUND:
                        return new ResponseError(404, 'VEHICLE_SERVICE_MESSAGES.DEFAULT_ERROR_MESSAGE', DEFAULT_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, 'VEHICLE_SERVICE_MESSAGES.DEFAULT_ERROR_MESSAGE', DEFAULT_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'VEHICLE_SERVICE_MESSAGES.DEFAULT_ERROR_MESSAGE', DEFAULT_ERROR_MESSAGE);
            }
        }
    }
}
