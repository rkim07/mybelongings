import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import { HttpError } from 'routing-controllers';
import { logger } from '../common/logging';
import { JWTHelper } from '../domains/shared/helpers/JWTHelper';
import { AuthorisedRequest, JwtDecoded } from '../domains/shared/interfaces/interfaces';
import { User } from '../domains/shared/models/models';

export namespace AuthorizationMiddleware {

    /**
     * Retrieve and verify the JWT from a request (if necessary), authorise the user and decorate the request with a new User
     * 403 - Forbidden
     * 401 - Failure
     *
     * @param req
     * @param res
     * @param next
     */
    export async function authorizeRequest(req: AuthorisedRequest, res: Response, next: NextFunction) {
        // All requests are unauthorized until (some) conditions below are met
        const token: string = req.headers.authorization;
        let jwtUser: any;
        let authorizedRequest: boolean = false;

        // If the endpoint doesn't contain any security restrictions
        if (!req.swagger.operation.security) {
            // If there is a token, verify it and decode it, attaching the User to the request
            if (token) {
                try {
                    await verifyToken();
                    await  authorizeUser();
                } catch (err) {
                    logger.warn('Unsecured endpoint, unverifiable auth token:', req.path);
                }
            }

            authorizedRequest = true;
        } else {
            if (token) {
                // Promise stack to verify, then authorize the user against required roles
                try {
                    await verifyToken();
                    await authorizeUserRoles();
                    await authorizeUser();
                } catch (err) {
                    handleUnauthorizedUser();
                }
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
         */
        async function verifyToken(): Promise<any> {
            const payload = await JWTHelper.verifyToken(token);
            return jwtUser = payload;
        }

        /**
         * Authorizes the user in the JWT against the required authority for this request
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
         * Called at the end of the Promise stack, decorates the request with a
         * new User and authorizes the request.  This information will be used
         * when Req object is used on each controller
         */
        function authorizeUser() {
            const decodedJwt = jwt.decode(token) as JwtDecoded;

            req.requestor.jwt = token;
            req.requestor.jwtDecoded = decodedJwt;
            req.requestor.userKey = decodedJwt.userKey;
            req.requestor.origin = `${req.protocol}://${req.get('host')}`
            authorizedRequest = true;
        }

        /**
         * If the user is unathorized, catch and store the error message
         */
        function handleUnauthorizedUser() {
            next(new HttpError(401, 'Unauthorized.'));
        }
    }
}
