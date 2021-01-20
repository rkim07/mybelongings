import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import { HttpError } from 'routing-controllers';
import { logger } from '../common/logging';
import { JWTHelper } from '../domains/shared/helpers/JWTHelper';
import { AuthorisedRequest } from '../domains/shared/interfaces/interfaces';
import { User } from '../domains/shared/models/models';

export namespace AuthorizationMiddleware {

    /**
     * Retrieve and verify the JWT from a request (if necessary), authorise the user and decorate the request with a new User
     *
     * @param req
     * @param res
     * @param next
     */
    export async function authorizeRequest(req: AuthorisedRequest, res: Response, next: NextFunction) {
        const token: string = req.headers.authorization;
        let jwtUser: any;
        // All requests are unauthorized until (some) conditions below are met
        let authorizedRequest: boolean = false;

        // If the endpoint doesn't contain any security restrictions
        if (!req.swagger.operation.security) {

            // If there is a token, verify it and decode it, attaching the User to the request
            if (token) {
                await verifyToken()
                    .then(() => authorizeUser())
                    .catch((err) => {
                        logger.warn('Unsecured endpoint, unverifiable auth token:', req.path);
                    });
            }

            authorizedRequest = true;

        } else {
            if (token) {
                // Promise stack to verify, then authorize the user agains required roles
                await verifyToken()
                    .then(authorizeUserRoles)
                    .then(authorizeUser)
                    .catch(handleUnauthorizedUser);
            }
        }

        // If the request is now Authorized, continue
        if (authorizedRequest) {
            next();
        } else {
            // Respond with a 401 if unauthorized
            handleUnauthorizedUser();
        }

        /**
         * Verifies a JWT token and stores the payload
         * @return {Promise<any>}
         */
        async function verifyToken(): Promise<any> {
            return JWTHelper.verifyToken(token)
                .then((payload) => {
                    jwtUser = payload;
                });
        }

        /**
         * Authorizes the user in the JWT against the required authority for this request
         * @return {Promise<any>}
         */
        async function authorizeUserRoles(): Promise<any> {

            // Iterates through the request's security restrictions
            const authorizedUser: boolean = req.swagger.operation.security.some(function(requirement) {
                // Find the associated OAuth security requirement
                const oAuthRoles = requirement['OauthSecurity'];
                // Ensure that the OAuth security requirement exists
                if (oAuthRoles && oAuthRoles.length) {
                    // Finds which required authorities the user has
                    const validUserRoles = _.intersection(oAuthRoles, jwtUser.authorities);
                    // Returns if the user has at least one
                    return validUserRoles.length > 0;
                } else {
                    return true;
                }
            });

            // If the User does not have the required authority, throw an error (caught up Promise stack)
            if (!authorizedUser) {
                throw new Error();
            }

            return authorizedUser;
        }

        /**
         * Called at the end of the Promise stack, decorates the request with a new User and authorizes the request
         */
        function authorizeUser() {
            req.requestor.user = new User(jwtUser);
            req.requestor.jwt = token;
            authorizedRequest = true;
        }

        /**
         * If the user is unathorized, catch and store the error message
         * @param {[type]}
         */
        function handleUnauthorizedUser() {
            next(new HttpError(401, 'Unauthorized.'));
        }
    }
}
