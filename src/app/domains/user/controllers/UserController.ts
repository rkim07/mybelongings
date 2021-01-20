import { Body, Get, HeaderParam, HttpCode, JsonController, Param, Post, QueryParam, Req } from 'routing-controllers';
import { Container, Inject } from 'typedi';
import { UserService } from '../services/UserService';
import { ResponseError, User } from '../../shared/models/models';

@JsonController('/user-svc')
export class UserController {

    @Inject()
    private userService: UserService = Container.get(UserService);

    /**
     * @swagger
     * paths:
     *   /user-svc/users:
     *     get:
     *       summary: Get all users.
     *       description: Retrieve users data from manufacturer implemented API.
     *       responses:
     *         200:
     *           description: User data has been retrieved successfully.
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
                return await this.userService.getUsers(req.requestor.referrer);
            } catch (err) {
                throw new ResponseError(500, err.key, 'An unexpected error occurred in the auth service.');
            }
        }
}
