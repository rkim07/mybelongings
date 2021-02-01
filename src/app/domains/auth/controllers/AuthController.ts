import path from 'path';
import { Body, Get, HttpCode, JsonController, Param, Post, Req, Res } from 'routing-controllers';
import { Container, Inject } from 'typedi';
import { AuthorisedRequest } from '../../shared/interfaces/AuthorisedRequest';
import { HandleUpstreamError, ResponseError } from '../../shared/models/models';
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
     *   /auth-svc/account/login:
     *     post:
     *       description: Login user
     *       tags:
     *         - Auth
     *       parameters:
     *         - in: body
     *           name: login
     *           description: The username and password
     *           required: true
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *               password:
     *                 type: string
     *       responses:
     *         201:
     *           description: User was successfully logged in
     *         401:
     *           description: Unauthorized request
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         403:
     *           description: Forbidden request
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the auth service
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @HttpCode(201)
    @Post('/account/login')
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
     *   /auth-svc/account/logout:
     *     get:
     *       description: Logout user
     *       tags:
     *         - Auth
     *       security:
     *         - OauthSecurity:
     *           - ROLE_USER
     *       parameters:
     *         - name: Authorization
     *           in: header
     *           description: The refresh JWT token with claims about user
     *           type: string
     *           required: true
     *       responses:
     *         200:
     *           description: User was successfully logged out
     *         500:
     *           description: An unexpected error occurred in the auth service
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/account/logout')
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
     *   /auth-svc/account/refresh:
     *     get:
     *       description: Refresh access token with provided refresh token
     *       tags:
     *         - Auth
     *       security:
     *         - OauthSecurity:
     *           - ROLE_USER
     *       parameters:
     *         - name: Authorization
     *           in: header
     *           description: The refresh JWT token with claims about user
     *           type: string
     *           required: true
     *       responses:
     *         200:
     *           description: Token successfully refreshed
     *         401:
     *           description: Unauthorized request
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         403:
     *           description: Forbidden request
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the auth service
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/account/refresh')
    public async refreshToken(@Req() { requestor: { userKey, jwt }}: AuthorisedRequest): Promise<any> {
        try {
            const refresh = await this.authService.refreshToken(userKey, jwt);

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
     *   /auth-svc/account/signup:
     *     post:
     *       description: Sign up user
     *       tags:
     *         - Auth
     *       parameters:
     *         - in: body
     *           name: request
     *           description: The user info
     *           required: true
     *           schema:
     *             type: object
     *             properties:
     *               firstName:
     *                 type: string
     *               lastName:
     *                 type: string
     *               email:
     *                 type: string
     *               username:
     *                 type: string
     *               password:
     *                 type: string
     *       responses:
     *         201:
     *           description: User was successfully signed up
     *           schema:
     *             $ref: '#/definitions/User'
     *         500:
     *           description: An unexpected error occurred in the auth service
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @HttpCode(201)
    @Post('/account/signup')
    public async signup(@Body() body: any): Promise<any> {
        try {
            const signup = await this.authService.signup(body);

            return {
                user: signup.user,
                statusCode: 201,
                message: 'User successfully signed up.'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case AUTH_SERVICE_ERRORS.USER_ALREADY_SIGNED_UP:
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
     *   /auth-svc/account/activate/{email}/{signupCode}:
     *     get:
     *       description: Activate signup
     *       tags:
     *          - Auth
     *       parameters:
     *         - in: path
     *           name: email
     *           description: User email
     *           required: true
     *           type: string
     *         - in: path
     *           name: signupCode
     *           description: The sign up code to check against
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: Activation successfull
     *         401:
     *           description: Unauthorized signup
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the auth service
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/account/activate/:email/:signupCode')
    public async activateSignup(
        @Param('email') email: string,
        @Param('signupCode') signupCode: string,
        @Res() response: any): Promise<any> {
        try {
            const user = await this.authService.activateSignup(email, signupCode);

            // Redirect back to frontend
            response.redirect(`/account/activated/${user.firstName}`);
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch (err.key) {
                    case AUTH_SERVICE_ERRORS.USER_KEY_EMPTY:
                        logger.error('User not found during signup activation.');
                        return new ResponseError(401, err.key, 'Failed to activate the account.');
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
     *   /auth-svc/account/password/reset/activate:
     *     post:
     *       description: Send user an email to reset password
     *       tags:
     *          - Auth
     *       parameters:
     *         - in: body
     *           name: email
     *           description: The user email
     *           required: true
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *       responses:
     *         201:
     *           description: Email was sent successfully
     *         401:
     *           description: Unauthorized reset
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the auth service
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Post('/account/password/reset/activate')
    public async activatePasswordReset(
        @Body() body: any,
        @Res() response: any): Promise<any> {
        try {
            await this.authService.activatePasswordReset(body.email);

            response.send({
                statusCode: 201,
                message: 'Successful password reset activation.'
            });
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch (err.key) {
                    case AUTH_SERVICE_ERRORS.USER_NOT_FOUND:
                        logger.error('User not found during password reset activation.');
                        return new ResponseError(401, err.key, 'Failed to reset the password.');
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
     *   /auth-svc/account/password/reset:
     *     post:
     *       description: Reset password
     *       tags:
     *          - Auth
     *       parameters:
     *         - in: body
     *           name: request
     *           description: The user new password
     *           required: true
     *           schema:
     *             type: object
     *             properties:
     *               resetCode:
     *                 type: string
     *               password:
     *                 type: string
     *       responses:
     *         201:
     *           description: Password reset successful
     *         401:
     *           description: Unauthorized reset
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the auth service
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Post('/account/password/reset')
    public async resetPassword(
        @Body() body: any,
        @Res() response: any): Promise<any> {
        try {
            await this.authService.resetPassword(body);

            response.send({
                statusCode: 201,
                message: 'Password reset successful.'
            });
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch (err.key) {
                    case AUTH_SERVICE_ERRORS.INVALID_RESET_CODE:
                        logger.error('Invalid reset code.');
                        return new ResponseError(500, err.key, 'Failed to reset the password.');
                    default:
                        return new ResponseError(500, err.key, DEFAULT_AUTH_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, err.key, DEFAULT_AUTH_ERROR_MESSAGE);
            }
        }
    }
}
