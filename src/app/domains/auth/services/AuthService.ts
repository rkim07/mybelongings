import * as config from 'config';
import * as _ from 'lodash';
import { Container, Inject, Service } from 'typedi';
import { JWTHelper } from '../../shared/helpers/JWTHelper';
import { User } from '../../shared/models/domains/User';
import { HandleUpstreamError } from '../../shared/models/utilities/HandleUpstreamError';
import { Hash } from '../../shared/models/utilities/Hash';
import { Code, Key } from '../../shared/models/utilities/Key';
import { EmailService } from '../../shared/services/EmailService';
import { UserService } from '../../user/services/UserService';

export enum AUTH_SERVICE_MESSAGES {
    USER_NOT_FOUND = 'AUTH_SERVICE_MESSAGES.USER_NOT_FOUND',
    USERNAME_NOT_FOUND = 'AUTH_SERVICE_MESSAGES.USERNAME_NOT_FOUND',
    USER_ALREADY_SIGNED_UP = 'AUTH_SERVICE_MESSAGES.USER_ALREADY_SIGNED_UP',
    INVALID_CREDENTIALS = 'AUTH_SERVICE_MESSAGES.INVALID_CREDENTIALS',
    TOKEN_NOT_CREATED = 'AUTH_SERVICE_MESSAGES.TOKEN_NOT_CREATED',
    TOKENS_NOT_CREATED = 'AUTH_SERVICE_MESSAGES.TOKENS_NOT_CREATED',
    USER_KEY_EMPTY = 'AUTH_SERVICE_MESSAGES.USER_KEY_EMPTY',
    UNACTIVATED_ACCOUNT = 'AUTH_SERVICE_MESSAGES.UNACTIVATED_ACCOUNT',
    INVALID_RESET_CODE = 'AUTH_SERVICE_MESSAGES.INVALID_RESET_CODE',
    FAILED_ACCOUNT_ACTIVATION = 'AUTH_SERVICE_MESSAGES.FAILED_ACCOUNT_ACTIVATION',
    FAILED_RESET_PASSWORD = 'AUTH_SERVICE_MESSAGES.FAILED_RESET_PASSWORD'
}

@Service()
export class AuthService {

    @Inject()
    private userService: UserService = Container.get(UserService);

    @Inject()
    private emailService: EmailService = Container.get(EmailService);

    /**
     * Login user
     *
     * @param body
     */
    public async login(body: any): Promise<any> {
        let user = await this.userService.getUserByField('username', body.username);

        if (!user) {
            throw new HandleUpstreamError(AUTH_SERVICE_MESSAGES.USERNAME_NOT_FOUND);
        }

        // Check if plain text password matches with hashed password
        if (!Hash.bcryptCompare(body.password, user.password)) {
            throw new HandleUpstreamError(AUTH_SERVICE_MESSAGES.INVALID_CREDENTIALS);
        }

        // User has not verified account activation
        if (!user.active) {
            throw new HandleUpstreamError(AUTH_SERVICE_MESSAGES.UNACTIVATED_ACCOUNT);
        }

        // Generate tokens
        const accessToken  = await AuthService.generateToken(user.key, user.authorities, 'access');
        const refreshToken = await AuthService.generateToken(user.key, user.authorities, 'refresh');

        if (!accessToken || !refreshToken) {
            throw new HandleUpstreamError(AUTH_SERVICE_MESSAGES.TOKENS_NOT_CREATED);
        }

        // Save refresh token for later use
        user.refreshToken = refreshToken;
        await this.userService.updateUser(user);

        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        };
    }

    /**
     * Deactivate user
     *
     * @param userKey
     */
    public async deactivate(userKey: Key): Promise<any> {
        if (!userKey) {
            throw new HandleUpstreamError(AUTH_SERVICE_MESSAGES.USER_KEY_EMPTY);
        }

        let user = await this.userService.getUser(userKey);

        if (!user) {
            throw new HandleUpstreamError(AUTH_SERVICE_MESSAGES.USER_NOT_FOUND);
        }

        // Deactivate user
        if (user.active) {
            user = { ...user, active: 0 } ;
            user = { ...user, refreshToken: '' };
        }

        await this.userService.updateUser(user);

        return true;
    }

    /**
     * Remove user
     *
     * @param userKey
     */
    public async remove(userKey: Key): Promise<any> {
        if (!userKey) {
            throw new HandleUpstreamError(AUTH_SERVICE_MESSAGES.USER_KEY_EMPTY);
        }

        let user = await this.userService.getUser(userKey);

        if (!user) {
            throw new HandleUpstreamError(AUTH_SERVICE_MESSAGES.USER_NOT_FOUND);
        }

        // Deactivate user
        if (user.active) {
            user = { ...user, active: 0 } ;
            user = { ...user, refreshToken: '' };
        }

        await this.userService.deleteUser(userKey);

        return true;
    }

    /**
     * Logout user
     *
     * @param userKey
     */
    public async logout(userKey: Key): Promise<any> {
        if (!userKey) {
            throw new HandleUpstreamError(AUTH_SERVICE_MESSAGES.USER_KEY_EMPTY);
        }

        let user = await this.userService.getUser(userKey);

        if (!user) {
            throw new HandleUpstreamError(AUTH_SERVICE_MESSAGES.USER_NOT_FOUND);
        }

        user = { ...user, refreshToken: '' };

        return await this.userService.updateUser(user);
    }

    /**
     * Send new access token
     *
     * @param userKey
     * @param jwt
     */
    public async refreshToken(userKey: Key, jwt: string): Promise<any> {
        if (!userKey) {
            throw new HandleUpstreamError(AUTH_SERVICE_MESSAGES.USER_KEY_EMPTY);
        }

        const user = await this.userService.getUser(userKey);

        if (!user) {
            throw new HandleUpstreamError(AUTH_SERVICE_MESSAGES.USER_NOT_FOUND);
        }

        // Generate tokens
        const accessToken = await AuthService.generateToken(user.key, user.authorities, 'access');

        if (!accessToken) {
            throw new HandleUpstreamError(AUTH_SERVICE_MESSAGES.TOKEN_NOT_CREATED);
        }

        return {
            accessToken: accessToken
        };
    }

    /**
     * Signup new user
     *
     * @param info
     */
    public async signup(info: User): Promise<any> {
        const existingUser = await this.userService.getUserByField('email', info.email);

        if (existingUser) {
            throw new HandleUpstreamError(AUTH_SERVICE_MESSAGES.USER_ALREADY_SIGNED_UP);
        }

        // Add new user
        const newUser = await this.userService.addUser(info);

        if (!newUser) {
            throw new HandleUpstreamError(AUTH_SERVICE_MESSAGES.USER_NOT_FOUND);
        }

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
     * Activate new signup by first verifying email
     * and signup code provided in email
     *
     * @param email
     * @param signupCode
     */
    public async activateSignup(email: string, signupCode: Code): Promise<any> {
        let newUser = await this.userService.getUserByEmailAnCode(email, signupCode, 'signupCode');

        if (!newUser) {
            throw new HandleUpstreamError(AUTH_SERVICE_MESSAGES.FAILED_ACCOUNT_ACTIVATION);
        }

        // Activate
        newUser = { ...newUser, active: 1 } ;
        newUser = { ...newUser, signupCode: '' };

        return await this.userService.updateUser(newUser);
    }

    /**
     * Prepare password reset
     *
     * @param email
     */
    public async activatePasswordReset(email: string): Promise<any> {
        let user = await this.userService.getUserByField('email', email);

        if (!user) {
            throw new HandleUpstreamError(AUTH_SERVICE_MESSAGES.FAILED_RESET_PASSWORD);
        }

        // Generate new password reset code and save
        user.resetCode = Code.generate();
        await this.userService.updateUser(user);

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
        let user = await this.userService.getUserByEmailAnCode(body.email, body.resetCode, 'resetCode');

        if (!user) {
            throw new HandleUpstreamError(AUTH_SERVICE_MESSAGES.INVALID_RESET_CODE);
        }

        user = { ...user, password: Hash.bcryptHash(body.password) } ;
        user = { ...user, resetCode: '' };
        await this.userService.updateUser(user);

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
