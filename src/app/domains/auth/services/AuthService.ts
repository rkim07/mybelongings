import * as config from 'config';
import * as _ from 'lodash';
import { Container, Inject, Service } from 'typedi';
import { JWTHelper } from '../../shared/helpers/JWTHelper';
import { User } from '../../shared/models/domains/User';
import { HandleUpstreamError } from '../../shared/models/utilities/HandleUpstreamError';
import { Hash } from '../../shared/models/utilities/Hash';
import { Code, Key } from '../../shared/models/utilities/Key';
import { EmailService } from '../../shared/services/EmailService';
import { UserCollectionService } from '../../user/services/UserCollectionService';

const EMAIL_HOST = config.get('email.host').toString();
const SYSTEM_AUTH_VERIFICATION_PATH = config.get('system.auth.verificationPath').toString();

export enum AUTH_SERVICE_ERRORS {
    USER_NOT_FOUND = 'AUTH_SERVICE_ERRORS.USER_NOT_FOUND',
    UNREGISTERED_USER = 'AUTH_SERVICE_ERRORS.UNREGISTERED_USER',
    USER_ALREADY_REGISTERED = 'AUTH_SERVICE_ERRORS.USER_ALREADY_REGISTERED',
    INVALID_CREDENTIALS = 'AUTH_SERVICE_ERRORS.INVALID_CREDENTIALS',
    TOKEN_NOT_CREATED = 'AUTH_SERVICE_ERRORS.TOKEN_NOT_CREATED',
    TOKENS_NOT_CREATED = 'AUTH_SERVICE_ERRORS.TOKENS_NOT_CREATED',
    USER_KEY_EMPTY = 'AUTH_SERVICE_ERRORS.USER_KEY_EMPTY',
    UNACTIVATED_ACCOUNT = 'AUTH_SERVICE_ERRORS.UNACTIVATED_ACCOUNT'
}

@Service()
export class AuthService {

    @Inject()
    private userCollectionService: UserCollectionService = Container.get(UserCollectionService);

    @Inject()
    private emailService: EmailService = Container.get(EmailService);

    /**
     * Login user
     *
     * @param body
     */
    public async login(body: any): Promise<any> {
        let user = await this.userCollectionService.findOne({ username: { $eq: body.username }});

        // User not registered
        if (!user) {
            throw new HandleUpstreamError(AUTH_SERVICE_ERRORS.UNREGISTERED_USER);
        }

        // Check if plain text password matches with hashed password
        if (!Hash.bcryptCompare(body.password, user.password)) {
            throw new HandleUpstreamError(AUTH_SERVICE_ERRORS.INVALID_CREDENTIALS);
        }

        // User has not verified account activation
        if (!user.active) {
            throw new HandleUpstreamError(AUTH_SERVICE_ERRORS.UNACTIVATED_ACCOUNT);
        }

        // Generate tokens
        const accessToken  = await AuthService.generateToken(user.key, user.authorities, 'access');
        const refreshToken = await AuthService.generateToken(user.key, user.authorities, 'refresh');

        if (!accessToken || !refreshToken) {
            throw new HandleUpstreamError(AUTH_SERVICE_ERRORS.TOKENS_NOT_CREATED);
        }

        // Save refresh token for later use
        user.refreshToken = refreshToken;
        await this.userCollectionService.updateUser(user);

        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        };
    }

    /**
     * Logout user
     *
     * @param userKey
     */
    public async logout(userKey): Promise<any> {
        if (!userKey) {
            throw new HandleUpstreamError(AUTH_SERVICE_ERRORS.USER_KEY_EMPTY);
        }

        const user = await this.userCollectionService.findOne({ key: { $eq: userKey }});

        if (!user) {
            throw new HandleUpstreamError(AUTH_SERVICE_ERRORS.USER_NOT_FOUND);
        }

        user.accessToken = '';
        user.refreshToken = '';
        return await this.userCollectionService.updateUser(user);
    }

    /**
     * Send new access token
     *
     * @param userKey
     * @param jwt
     */
    public async refresh(userKey, jwt): Promise<any> {
        if (!userKey) {
            throw new HandleUpstreamError(AUTH_SERVICE_ERRORS.USER_KEY_EMPTY);
        }

        const user = await this.userCollectionService.findOne({ key: { $eq: userKey }});

        if (!user) {
            throw new HandleUpstreamError(AUTH_SERVICE_ERRORS.USER_NOT_FOUND);
        }

        // Generate tokens
        const accessToken = await AuthService.generateToken(user.key, user.authorities, 'access');

        if (!accessToken) {
            throw new HandleUpstreamError(AUTH_SERVICE_ERRORS.TOKEN_NOT_CREATED);
        }

        return {
            accessToken: accessToken
        };
    }

    /**
     * Register new user
     *
     * @param data
     */
    public async register(data: User): Promise<any> {
        const existingUser = await this.userCollectionService.find({ email: { $eq: data.email }});

        if (existingUser.length) {
            throw new HandleUpstreamError(AUTH_SERVICE_ERRORS.USER_ALREADY_REGISTERED);
        }

        // Add new user
        const newUser = await this.userCollectionService.adddUser(data);

        // Setup and send verification email
        if (!_.isEmpty(newUser.email) && !_.isEmpty(newUser.code)) {
            const htmlData = {
                type: 'html',
                templateName: 'registration',
                body: {
                    firstName: newUser.firstName,
                    code: newUser.code,
                    link: `${EMAIL_HOST}/${SYSTEM_AUTH_VERIFICATION_PATH}/${newUser.email}/${newUser.code}`
                }
            };

            const textData = {
                type: 'text',
                templateName: 'registration',
                body: {
                    firstName: newUser.firstName
                }
            };

            const data = {
                email: newUser.email,
                subject: 'About your MyBelongings registration',
                html: await this.emailService.renderTemplate(htmlData),
                text: await this.emailService.renderTemplate(textData)
            }

            await this.emailService.send(data);
        }

        return {
            user: {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                code: newUser.code
            },
        };
    }

    /**
     * Verify new registration link code and activate
     *
     * @param email
     * @param code
     */
    public async verify(email: string, code: Code): Promise<any> {
        const query = {
            $and: [
                { email: { $eq: email } },
                { code: { $eq: code } }
            ]
        };

        let newUser = await this.userCollectionService.findOne(query);

        if (!newUser) {
            return false;
        }

        // Activate
        newUser.active = 1;
        return await this.userCollectionService.updateUser(newUser);
    }

    /**
     * Generate token
     *
     * @param userKey
     * @param userRoles
     * @param tokenType
     * @private
     */
    private static generateToken(userKey: Key, userRoles: string, tokenType: string): string {
        // Prepare token's payload
        const jwtPayload = {
            key: Key.generate(),
            userKey: userKey,
            authorities: userRoles
        };

        // Generate token
        return JWTHelper.signToken(jwtPayload, tokenType);
    }
}
