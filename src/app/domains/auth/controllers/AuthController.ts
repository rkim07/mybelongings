import { Body, Get, HttpCode, JsonController, Param, Post, Req, Res } from 'routing-controllers';
import { Container, Inject } from 'typedi';
import { AuthorisedRequest } from '../../shared/interfaces/AuthorisedRequest';
import { HandleUpstreamError, ResponseError } from '../../shared/models/models';
import { VEHICLE_SERVICE_ERRORS } from '../../vehicle/services/VehicleService';
import { AUTH_SERVICE_ERRORS, AuthService } from '../services/AuthService';

import { logger } from '../../../common/logging';

const DEFAULT_AUTH_ERROR_MESSAGE = 'An unexpected error occurred in the auth service.';

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
     *         - Auth
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
     *           description: Data has been posted successfully.
     *         401:
     *           description: Unauthorized request
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         403:
     *           description: Forbidden request
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the auth service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @HttpCode(201)
    @Post('/login')
    public async login(@Body() body: any): Promise<any> {
        try {
            const login = await this.authService.login(body);

            return {
                accessToken: login.accessToken,
                refreshToken: login.refreshToken,
                statusCode: 201,
                message: 'User logged in.'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case AUTH_SERVICE_ERRORS.UNREGISTERED_USER:
                        return new ResponseError(404, err.key, 'Unregistered user.');
                    case AUTH_SERVICE_ERRORS.INVALID_CREDENTIALS:
                        return new ResponseError(401, err.key, 'Invalid credentials.');
                    case AUTH_SERVICE_ERRORS.UNACTIVATED_ACCOUNT:
                        return new ResponseError(401, err.key, 'Account has not been activated.');
                    case AUTH_SERVICE_ERRORS.TOKENS_NOT_CREATED:
                        logger.error('An unexpected error occurred while creating the tokens.');
                        return new ResponseError(500, err.key, DEFAULT_AUTH_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, err.key, DEFAULT_AUTH_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, err.key, DEFAULT_AUTH_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /auth-svc/logout:
     *     get:
     *       summary: Logout user.
     *       description: Logout user.
     *       tags:
     *         - Auth
     *       security:
     *         - OauthSecurity:
     *           - ROLE_USER
     *       parameters:
     *         - name: Authorization
     *           in: header
     *           description: The refresh JWT token with claims about user.
     *           type: string
     *           required: true
     *       responses:
     *         200:
     *           description: Data has been posted successfully.
     *         500:
     *           description: An unexpected error occurred in the auth service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/logout')
    public async logout(@Req() { requestor: { userKey }}: AuthorisedRequest): Promise<any> {
        try {
            await this.authService.logout(userKey);

            return {
                statusCode: 200,
                message: 'Logout success.'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case AUTH_SERVICE_ERRORS.USER_KEY_EMPTY:
                        logger.error('User key not found.');
                        return new ResponseError(500, err.key, DEFAULT_AUTH_ERROR_MESSAGE);
                    case AUTH_SERVICE_ERRORS.USER_NOT_FOUND:
                        logger.error('User not found.');
                        return new ResponseError(500, err.key, DEFAULT_AUTH_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, err.key, DEFAULT_AUTH_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, err.key, DEFAULT_AUTH_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /auth-svc/refresh:
     *     get:
     *       summary: Refresh access token.
     *       description: Refresh access token with provided refresh token.
     *       tags:
     *         - Auth
     *       security:
     *         - OauthSecurity:
     *           - ROLE_USER
     *       parameters:
     *         - name: Authorization
     *           in: header
     *           description: The refresh JWT token with claims about user.
     *           type: string
     *           required: true
     *       responses:
     *         200:
     *           description: Data has been posted successfully.
     *         401:
     *           description: Unauthorized request
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         403:
     *           description: Forbidden request
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the auth service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/refresh')
    public async refreshToken(@Req() { requestor: { userKey, jwt }}: AuthorisedRequest): Promise<any> {
        try {
            const refresh = await this.authService.refresh(userKey, jwt);

            return {
                accessToken: refresh.accessToken,
                statusCode: 200,
                message: 'Token refreshed.'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case AUTH_SERVICE_ERRORS.USER_KEY_EMPTY:
                        logger.error('User key not found.');
                        return new ResponseError(500, err.key, DEFAULT_AUTH_ERROR_MESSAGE);
                    case AUTH_SERVICE_ERRORS.USER_NOT_FOUND:
                        logger.error('User not found.');
                        return new ResponseError(500, err.key, DEFAULT_AUTH_ERROR_MESSAGE);
                    case AUTH_SERVICE_ERRORS.TOKEN_NOT_CREATED:
                        logger.error('An unexpected error occurred while creating the token.');
                        return new ResponseError(500, err.key, DEFAULT_AUTH_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, err.key, DEFAULT_AUTH_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, err.key, DEFAULT_AUTH_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /auth-svc/register:
     *     post:
     *       summary: Register user.
     *       description: Register user.
     *       tags:
     *         - Auth
     *       parameters:
     *         - in: body
     *           name: request
     *           description: The user info.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/User'
     *       responses:
     *         201:
     *           description: Data has been posted successfully.
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
            const registration = await this.authService.register(body);

            return {
                user: registration.user,
                statusCode: 201,
                message: 'User successfully registered.'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case AUTH_SERVICE_ERRORS.USER_ALREADY_REGISTERED:
                        return new ResponseError(409, err.key, 'User already registered.');
                    default:
                        return new ResponseError(500, err.key, DEFAULT_AUTH_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, err.key, DEFAULT_AUTH_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /auth-svc/register/verify/{email}/{code}:
     *     get:
     *       summary: Verify new registration.
     *       description: Verify new registration.
     *       tags:
     *          - Auth
     *       parameters:
     *         - in: path
     *           name: email
     *           description: User email
     *           required: true
     *           type: string
     *         - in: path
     *           name: code
     *           description: The hash code to check against.
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: Registration was checked successfully.
     *         401:
     *           description: Unauthorized registration.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the auth service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/register/verify/:email/:code')
    public async verify(
        @Param('email') email: string,
        @Param('code') code: string,
        @Res() response: any): Promise<any> {
        try {
            const verification = await this.authService.verify(email, code);
            const verificationCode = verification.code;

            if (!verificationCode) {
                logger.error(`Failed to verify new registration for: ${verification.email}`);
            }

            response.send({
                statusCode: verificationCode ? 200 : 401,
                message: verificationCode ? 'Successful registration.' : 'Failed to verify registration.'
            });
        } catch (err) {
            return new ResponseError(500, err.key, DEFAULT_AUTH_ERROR_MESSAGE);
        }
    }
}
