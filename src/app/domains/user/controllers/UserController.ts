import {
    Body,
    Delete,
    Get,
    HeaderParam,
    HttpCode,
    JsonController,
    Param,
    Post,
    QueryParam,
    Req, Res
} from 'routing-controllers';
import { Container, Inject } from 'typedi';
import { logger } from '../../../common/logging';
import { AuthorisedRequest } from '../../shared/interfaces/AuthorisedRequest';
import { USER_SERVICE_MESSAGES, UserService } from '../services/UserService';
import { HandleUpstreamError, ResponseError, User } from '../../shared/models/models';

const DEFAULT_USER_ERROR_MESSAGE = 'An unexpected error occurred in the user service.';

@JsonController('/user-svc')
export class UserController {

    @Inject()
    private userService: UserService = Container.get(UserService);

    /**
     * @swagger
     * paths:
     *   /user-svc/users:
     *     get:
     *       description: Retrieve all signed up users
     *       tags:
     *         - User
     *       responses:
     *         200:
     *           description: Fetched all users successfully
     *           schema:
     *             $ref: '#/definitions/User'
     *
     *         500:
     *           description: An unexpected error occurred in the user service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/users')
    public async getUsers(@Req() req: any): Promise<any> {
        try {
            const users = await this.userService.getUsers();

            return {
                payload: users || [],
                statusCode: 200,
                message: users.length > 0 ? 'Fetched all the users.' : 'There are no users at this time.'
            };
        } catch (err) {
            return new ResponseError(500, err.key, DEFAULT_USER_ERROR_MESSAGE);
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
    /*@HttpCode(204)
    @Delete('/users/:user_key')
    public async deleteVehicle(
        @Req() { requestor: { userKey }}: AuthorisedRequest,
        @Param('user_key') userKey: string,
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
                    case VEHICLE_SERVICE_MESSAGES.EMPTY_VEHICLE_KEY:
                        logger.error('Empty vehicle key provide.');
                        return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
                    case VEHICLE_SERVICE_MESSAGES.VEHICLE_NOT_FOUND:
                        logger.error('Vehicle not found for removal.');
                        return new ResponseError(404, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, err.key, DEFAULT_VEHICLE_ERROR_MESSAGE);
            }
        }
    }*/
}
