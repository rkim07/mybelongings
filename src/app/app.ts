import 'reflect-metadata';
import 'source-map-support/register';
import 'ts-helpers';

import { Application } from './config/Application';
export default new Application();

/**
 * @swagger
 *   securityDefinitions:
 *     OauthSecurity:
 *       type: oauth2
 *       flow: accessCode
 *       authorizationUrl: 'https://oauth.simple.api/authorization'
 *       tokenUrl: 'https://oauth.simple.api/token'
 *       scopes:
 *         ROLE_USER: Ordinary user
 *         ROLE_ADMIN: System Administrator
 */
