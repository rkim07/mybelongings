import { Body, HttpCode, JsonController, Post } from 'routing-controllers';
import { Container, Inject } from 'typedi';
import { ResponseError } from '../../shared/models/models';
import { AuthService } from '../services/AuthService';

@JsonController('/auth-svc')
export class AuthController {

    @Inject()
    private authService: AuthService = Container.get(AuthService);

    /**
     * @swagger
     * paths:
     *   /auth-svc/login:
     *     post:
     *       summary: Login user.
     *       description: Login user
     *       tags:
     *          - Auth
     *       parameters:
     *         - in: body
     *           name: login
     *           description: The username and password.
     *           required: false
     *           schema:
     *             type: object
     *             properties:
     *              username:
     *                type: string
     *              password:
     *                type: string
     *       responses:
     *         201:
     *           description: DB data has been posted successfully.
     *           schema:
     *             $ref: '#/definitions/User'
     *         500:
     *           description: An unexpected error occurred in the auth service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @HttpCode(201)
    @Post('/login')
    public async loginUser(@Body() body: any): Promise<any> {
        try {
            return await this.authService.login(body);
        } catch (error) {
            throw new ResponseError(500, error.key, 'An unexpected error occurred in the auth service.');
        }
    }

    /**
     * @swagger
     * paths:
     *   /auth-svc/register:
     *     post:
     *       summary: Register user.
     *       description: Register user
     *       tags:
     *          - Auth
     *       parameters:
     *         - in: body
     *           name: request
     *           description: The user info.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/User'
     *       responses:
     *         201:
     *           description: DB data has been posted successfully.
     *           schema:
     *             $ref: '#/definitions/User'
     *         500:
     *           description: An unexpected error occurred in the auth service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @HttpCode(201)
    @Post('/register')
    public async register(@Body() body: any): Promise<any> {
        try {
            return await this.authService.register(body);
        } catch (error) {
            throw new ResponseError(500, error.key, 'An unexpected error occurred in the auth service.');
        }
    }

    @HttpCode(201)
    @Post('/refresh')
    public async refreshToken(@Body() body: any): Promise<any> {
        try {
            return await this.authService.refreshToken(body);
        } catch (error) {
            throw new ResponseError(500, error.key, 'An unexpected error occurred in the auth service.');
        }
    }
}
