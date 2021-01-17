"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationMiddleware = void 0;
const _ = require("lodash");
const routing_controllers_1 = require("routing-controllers");
const logging_1 = require("../common/logging");
const JWTHelper_1 = require("../domains/shared/helpers/JWTHelper");
const models_1 = require("../domains/shared/models/models");
var AuthorizationMiddleware;
(function (AuthorizationMiddleware) {
    /**
     * Retrieve and verify the JWT from a request (if necessary), authorise the user and decorate the request with a new User
     *
     * @param req
     * @param res
     * @param next
     */
    function authorizeRequest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.headers.authorization;
            let jwtUser;
            // All requests are unauthorized until (some) conditions below are met
            let authorizedRequest = false;
            // If the endpoint doesn't contain any security restrictions
            if (!req.swagger.operation.security) {
                // If there is a token, verify it and decode it, attaching the User to the request
                if (token) {
                    yield verifyToken()
                        .then(() => authorizeUser())
                        .catch((err) => {
                        logging_1.logger.warn('Unsecured endpoint, unverifiable auth token:', req.path);
                    });
                }
                authorizedRequest = true;
            }
            else {
                if (token) {
                    // Promise stack to verify, then authorize the user agains required roles
                    yield verifyToken()
                        .then(authorizeUserRoles)
                        .then(authorizeUser)
                        .catch(handleUnauthorizedUser);
                }
            }
            // If the request is now Authorized, continue
            if (authorizedRequest) {
                next();
            }
            else {
                // Respond with a 401 if unauthorized
                handleUnauthorizedUser();
            }
            /**
             * Verifies a JWT token and stores the payload
             * @return {Promise<any>}
             */
            function verifyToken() {
                return __awaiter(this, void 0, void 0, function* () {
                    return JWTHelper_1.JWTHelper.verifyToken(token)
                        .then((payload) => {
                        jwtUser = payload;
                    });
                });
            }
            /**
             * Authorizes the user in the JWT against the required authority for this request
             * @return {Promise<any>}
             */
            function authorizeUserRoles() {
                return __awaiter(this, void 0, void 0, function* () {
                    // Iterates through the request's security restrictions
                    const authorizedUser = req.swagger.operation.security.some(function (requirement) {
                        // Find the associated OAuth security requirement
                        const oAuthRoles = requirement['OauthSecurity'];
                        // Ensure that the OAuth security requirement exists
                        if (oAuthRoles && oAuthRoles.length) {
                            // Finds which required authorities the user has
                            const validUserRoles = _.intersection(oAuthRoles, jwtUser.authorities);
                            // Returns if the user has at least one
                            return validUserRoles.length > 0;
                        }
                        else {
                            return true;
                        }
                    });
                    // If the User does not have the required authority, throw an error (caught up Promise stack)
                    if (!authorizedUser) {
                        throw new Error();
                    }
                    return authorizedUser;
                });
            }
            /**
             * Called at the end of the Promise stack, decorates the request with a new User and authorizes the request
             */
            function authorizeUser() {
                req.requestor.user = new models_1.User(jwtUser);
                req.requestor.jwt = token;
                authorizedRequest = true;
            }
            /**
             * If the user is unathorized, catch and store the error message
             * @param {[type]}
             */
            function handleUnauthorizedUser() {
                next(new routing_controllers_1.HttpError(401, 'Unauthorized.'));
            }
        });
    }
    AuthorizationMiddleware.authorizeRequest = authorizeRequest;
})(AuthorizationMiddleware = exports.AuthorizationMiddleware || (exports.AuthorizationMiddleware = {}));
//# sourceMappingURL=AuthorizationMiddleware.js.map