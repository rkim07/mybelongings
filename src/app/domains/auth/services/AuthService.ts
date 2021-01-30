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

export enum AUTH_SERVICE_ERRORS {
    USER_NOT_FOUND = 'AUTH_SERVICE_ERRORS.USER_NOT_FOUND',
    UNREGISTERED_USER = 'AUTH_SERVICE_ERRORS.UNREGISTERED_USER',
    USER_ALREADY_SIGNED_UP = 'AUTH_SERVICE_ERRORS.USER_ALREADY_SIGNED_UP',
    INVALID_CREDENTIALS = 'AUTH_SERVICE_ERRORS.INVALID_CREDENTIALS',
    TOKEN_NOT_CREATED = 'AUTH_SERVICE_ERRORS.TOKEN_NOT_CREATED',
    TOKENS_NOT_CREATED = 'AUTH_SERVICE_ERRORS.TOKENS_NOT_CREATED',
    USER_KEY_EMPTY = 'AUTH_SERVICE_ERRORS.USER_KEY_EMPTY',
    UNACTIVATED_ACCOUNT = 'AUTH_SERVICE_ERRORS.UNACTIVATED_ACCOUNT',
    INVALID_RESET_CODE = 'AUTH_SERVICE_ERRORS.INVALID_RESET_CODE',
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

        // User not signed up
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
    public async refreshToken(userKey, jwt): Promise<any> {
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
     * Signup new user
     *
     * @param data
     */
    public async signup(data: User): Promise<any> {
        const existingUser = await this.userCollectionService.find({ email: { $eq: data.email }});

        if (existingUser.length) {
            throw new HandleUpstreamError(AUTH_SERVICE_ERRORS.USER_ALREADY_SIGNED_UP);
        }

        // Add new user
        const newUser = await this.userCollectionService.adddUser(data);

        // Send sign up confirmation email
        if (!_.isEmpty(newUser.email) && !_.isEmpty(newUser.signupCode)) {
            await this.emailService.sendSignupConfirmation(newUser);
        }

        return {
            user: {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                signupCode: newUser.signupCode
            },
        };
    }

    /**
     * Verify new sign up link code and activate
     *
     * @param email
     * @param code
     */
    public async activateSignup(email: string, code: Code): Promise<any> {
        const query = {
            $and: [
                { email: { $eq: email } },
                { signupCode: { $eq: code } }
            ]
        };

        let newUser = await this.userCollectionService.findOne(query);

        if (!newUser) {
            throw new HandleUpstreamError(AUTH_SERVICE_ERRORS.USER_NOT_FOUND);
        }

        // Activate
        newUser.active = 1;
        newUser.signupCode = '';
        return await this.userCollectionService.updateUser(newUser);
    }

    /**
     * Prepare password reset
     *
     * @param email
     */
    public async activatePasswordReset(email: string): Promise<any> {
        let user = await this.userCollectionService.findOne({ email: { $eq: email} });

        if (!user) {
            return false;
        }

        // Generate new password reset code and save
        user.resetCode = Code.generate();
        await this.userCollectionService.updateUser(user);

        // Send password reset email
        if (!_.isEmpty(user.email) && !_.isEmpty(user.resetCode)) {
            await this.emailService.sendPasswordReset(user);
        }

        return true;
    }

    /**
     * Reset password
     *
     * @param email
     * @param newPassword
     */
    public async resetPassword(body: any): Promise<any> {
        const query = {
            $and: [
                { email: { $eq: body.email } },
                { resetCode: { $eq: body.resetCode } }
            ]
        };

        let user = await this.userCollectionService.findOne(query);

        if (!user) {
            throw new HandleUpstreamError(AUTH_SERVICE_ERRORS.USER_NOT_FOUND);
        }

        user.password = body.password;
        user.resetCode = '';
        await this.userCollectionService.updateUser(user);

        return true;
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
