import path from 'path';
import { Body, Get, HttpCode, JsonController, Param, Post, Req, Res } from 'routing-controllers';
import { Container, Inject } from 'typedi';
import { AuthorisedRequest } from '../../shared/interfaces/AuthorisedRequest';
import { HandleUpstreamError, ResponseError } from '../../shared/models/models';
import { AUTH_SERVICE_MESSAGES, AuthService } from '../services/AuthService';

import { logger } from '../../../common/logging';

const DEFAULT_AUTH_SERVICE_ERROR_MESSAGE = 'An unexpected error occurred in the auth service.';

@JsonController('/auth-svc')
export class AuthController {

    @Inject()
    private authService: AuthService = Container.get(AuthService);

    /**
     * @swagger
     * paths:
     *   /auth-svc/account/signin:
     *     post:
     *       description: Login user
     *       tags:
     *         - Auth
     *       parameters:
     *         - in: body
     *           name: signin
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
    @Post('/account/signin')
    public async signIn(@Body() body: any): Promise<any> {
        try {
            const signIn = await this.authService.signIn(body);

            return {
                accessToken: signIn.accessToken,
                refreshToken: signIn.refreshToken,
                statusCode: 201,
                successCode: 'AUTH_SERVICE_ERROR_MESSAGE.LOGIN'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case AUTH_SERVICE_MESSAGES.USERNAME_NOT_FOUND:
                        return new ResponseError(404, err.key, '');
                    case AUTH_SERVICE_MESSAGES.INVALID_CREDENTIALS:
                        return new ResponseError(401, err.key, '');
                    case AUTH_SERVICE_MESSAGES.UNACTIVATED_ACCOUNT:
                        return new ResponseError(401, err.key, '');
                    case AUTH_SERVICE_MESSAGES.TOKENS_NOT_CREATED:
                        return new ResponseError(500, 'AUTH_SERVICE_MESSAGES.DEFAULT_AUTH_SERVICE_ERROR_MESSAGE', DEFAULT_AUTH_SERVICE_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, 'AUTH_SERVICE_MESSAGES.DEFAULT_AUTH_SERVICE_ERROR_MESSAGE', DEFAULT_AUTH_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'AUTH_SERVICE_MESSAGES.DEFAULT_AUTH_SERVICE_ERROR_MESSAGE', DEFAULT_AUTH_SERVICE_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /auth-svc/account/signout:
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
    @Get('/account/signout')
    public async signOut(@Req() { requestor: { userKey }}: AuthorisedRequest): Promise<any> {
        try {
            await this.authService.signOut(userKey);

            return {
                statusCode: 200,
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case AUTH_SERVICE_MESSAGES.EMPTY_USER_KEY:
                        return new ResponseError(500, 'AUTH_SERVICE_MESSAGES.DEFAULT_AUTH_SERVICE_ERROR_MESSAGE', DEFAULT_AUTH_SERVICE_ERROR_MESSAGE);
                    case AUTH_SERVICE_MESSAGES.USER_NOT_FOUND:
                        return new ResponseError(500, 'AUTH_SERVICE_MESSAGES.DEFAULT_AUTH_SERVICE_ERROR_MESSAGE', DEFAULT_AUTH_SERVICE_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, 'AUTH_SERVICE_MESSAGES.DEFAULT_AUTH_SERVICE_ERROR_MESSAGE', DEFAULT_AUTH_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'AUTH_SERVICE_MESSAGES.DEFAULT_AUTH_SERVICE_ERROR_MESSAGE', DEFAULT_AUTH_SERVICE_ERROR_MESSAGE);
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
                statusCode: 200
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case AUTH_SERVICE_MESSAGES.EMPTY_USER_KEY:
                        return new ResponseError(500, 'AUTH_SERVICE_MESSAGES.DEFAULT_AUTH_SERVICE_ERROR_MESSAGE', DEFAULT_AUTH_SERVICE_ERROR_MESSAGE);
                    case AUTH_SERVICE_MESSAGES.USER_NOT_FOUND:
                        return new ResponseError(500, 'AUTH_SERVICE_MESSAGES.DEFAULT_AUTH_SERVICE_ERROR_MESSAGE', DEFAULT_AUTH_SERVICE_ERROR_MESSAGE);
                    case AUTH_SERVICE_MESSAGES.TOKEN_NOT_CREATED:
                        return new ResponseError(500, 'AUTH_SERVICE_MESSAGES.DEFAULT_AUTH_SERVICE_ERROR_MESSAGE', DEFAULT_AUTH_SERVICE_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, 'AUTH_SERVICE_MESSAGES.DEFAULT_AUTH_SERVICE_ERROR_MESSAGE', DEFAULT_AUTH_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'AUTH_SERVICE_MESSAGES.DEFAULT_AUTH_SERVICE_ERROR_MESSAGE', DEFAULT_AUTH_SERVICE_ERROR_MESSAGE);
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
                statusCode: 201
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case AUTH_SERVICE_MESSAGES.USER_ALREADY_SIGNED_UP:
                        return new ResponseError(409, err.key, '');
                    default:
                        return new ResponseError(500, 'AUTH_SERVICE_MESSAGES.DEFAULT_AUTH_SERVICE_ERROR_MESSAGE', DEFAULT_AUTH_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'AUTH_SERVICE_MESSAGES.DEFAULT_AUTH_SERVICE_ERROR_MESSAGE', DEFAULT_AUTH_SERVICE_ERROR_MESSAGE);
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
        @Req() req: any,
        @Param('email') email: string,
        @Param('signupCode') signupCode: string,
        @Res() res: any): Promise<any> {
        try {
            await this.authService.activateSignup(email, signupCode);

            // Redirect back to frontend
            res.redirect(`/account/activated/success`);
        } catch (err) {
            // Redirect back to frontend, user already
            // activated on previous attempt
            res.redirect(`/account/activated/signin`);
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
                statusCode: 201
            });
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch (err.key) {
                    case AUTH_SERVICE_MESSAGES.FAILED_RESET_PASSWORD:
                        return new ResponseError(401, err.key, '');
                    default:
                        return new ResponseError(500, 'AUTH_SERVICE_MESSAGES.DEFAULT_AUTH_SERVICE_ERROR_MESSAGE', DEFAULT_AUTH_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'AUTH_SERVICE_MESSAGES.DEFAULT_AUTH_SERVICE_ERROR_MESSAGE', DEFAULT_AUTH_SERVICE_ERROR_MESSAGE);
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
                successCode: 'AUTH_SERVICE_MESSAGES.RESET'
            });
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch (err.key) {
                    case AUTH_SERVICE_MESSAGES.INVALID_RESET_CODE:
                        return new ResponseError(500, err.key, '');
                    default:
                        return new ResponseError(500, 'AUTH_SERVICE_MESSAGES.DEFAULT_AUTH_SERVICE_ERROR_MESSAGE', DEFAULT_AUTH_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'AUTH_SERVICE_MESSAGES.DEFAULT_AUTH_SERVICE_ERROR_MESSAGE', DEFAULT_AUTH_SERVICE_ERROR_MESSAGE);
            }
        }
    }
}
