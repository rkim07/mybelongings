import { Body, Delete, Get, HttpCode, JsonController, Param, Post, Put, Req, Res } from 'routing-controllers';
import { Container, Inject } from 'typedi';
import { HandleUpstreamError, Key, ResponseError } from '../../shared/models/models';
import { VEHICLE_ERRORS, VehicleService } from '../services/VehicleService';

@JsonController('/vehicle-svc')
export class VehicleController {

    @Inject()
    private vehicleService: VehicleService = Container.get(VehicleService);

    /**
     * @swagger
     * paths:
     *   /vehicle-svc/vehicles/{vehicle_key}:
     *     get:
     *       summary: Retrieve a specific vehicle.
     *       description: Retrieve a specific vehicle.
     *       parameters:
     *         - in: path
     *           name: vehicle_key
     *           description: The vehicle key being queried.
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: DB data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the vehicle service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/vehicles/:vehicle_key')
    public async getVehicle(
        @Req() req: any,
        @Param('vehicle_key') vehicleKey: string): Promise<any> {
        try {
            const vehicle = await this.vehicleService.getVehicle(vehicleKey, req.requestor.referrer);

            return {
                vehicle: vehicle,
                statusCode: 200,
                message: 'Successfully retrieved specific vehicle.'
            }
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_ERRORS.VEHICLE_KEY_EMPTY:
                        return new ResponseError(500, err.key, 'Empty vehicle key provided.');
                    case VEHICLE_ERRORS.VEHICLE_NOT_FOUND:
                        return new ResponseError(404, err.key, 'No vehicles were found for the user key provided.');
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
     *   /vehicle-svc/vehicles:
     *     get:
     *       summary: Get all vehicles
     *       description: Retrieve vehicles data from manufacturer implemented API.
     *       responses:
     *         200:
     *           description: DB data has been retrieved successfully.
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
     *   /vehicle-svc/vehicles/user/{user_key}:
     *     get:
     *       summary: Fetch the vehicle of a user by key.
     *       description: Return the vehicle of a user, excluding items.
     *       parameters:
     *         - in: path
     *           name: user_key
     *           description: The key for the current user.
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: DB data has been retrieved successfully.
     *           schema:
     *             $ref: '#/definitions/Vehicle'
     *         500:
     *           description: An unexpected error occurred in the vehicle service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/vehicles/user/:user_key')
    public async getVehiclesByUserKey(
        @Req() req: any,
        @Param('user_key') userKey: string): Promise<any> {
        try {
            const vehicles = await this.vehicleService.getVehiclesByUserKey(userKey, req.requestor.referrer);

            return {
                vehicles: vehicles,
                statusCode: 200,
                message: 'Successfully retrieved all vehicles for this user.'
            }
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case VEHICLE_ERRORS.USER_KEY_EMPTY:
                        return new ResponseError(500, err.key, 'Empty user key provided.');
                    case VEHICLE_ERRORS.VEHICLES_NOT_FOUND:
                        return new ResponseError(404, err.key, 'No vehicles were found for the user key provided.');
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
     *           description: DB data has been added successfully.
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
                    case VEHICLE_ERRORS.NEW_VEHICLE_EMPTY:
                        return new ResponseError(500, err.key, 'New vehicle information is empty.');
                    case VEHICLE_ERRORS.VIN_ALREADY_EXISTS:
                        return new ResponseError(500, err.key, 'Same VIN already found on another vehicle.');
                    case VEHICLE_ERRORS.VEHICLE_NOT_ADDED:
                        return new ResponseError(500, err.key, 'Vehicle cannot be added at this time.');
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
                        return new ResponseError(500, err.key, 'Empty vehicle key provided.');
                    case VEHICLE_ERRORS.VIN_ALREADY_EXISTS:
                        return new ResponseError(500, err.key, 'Same VIN already found on another vehicle.');
                    case VEHICLE_ERRORS.VEHICLE_NOT_UPDATED:
                        return new ResponseError(500, err.key, 'Vehicle cannot be updated at this time.');
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
     *   /vehicle-svc/vehicles/{vehicle_key}:
     *     delete:
     *       summary: Delete the vehicle.
     *       description:
     *           Remove the vehicle.
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
                        return new ResponseError(500, err.key, 'Empty vehicle key provide.');
                    case VEHICLE_ERRORS.VEHICLE_NOT_FOUND:
                        return new ResponseError(500, err.key, 'Vehicle not found for delete.');
                    default:
                        return new ResponseError(500, err.key, 'An unexpected error occurred in the vehicle service.');
                }
            } else {
                return new ResponseError(500, err.key, 'An unexpected error occurred in the vehicle service.');
            }
        }
    }
}
