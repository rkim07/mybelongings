import { Container, Inject, Service } from 'typedi';
import { JWTHelper } from '../../shared/helpers/JWTHelper';
import { User } from '../../shared/models/domains/User';
import { HandleUpstreamError } from '../../shared/models/utilities/HandleUpstreamError';
import { Hash } from '../../shared/models/utilities/Hash';
import { Key } from '../../shared/models/utilities/Key';
import { UserCollectionService } from '../../user/services/UserCollectionService';

export enum AUTH_SERVICE_ERRORS {
    USER_NOT_FOUND = 'AUTH_SERVICE_ERRORS.USER_NOT_FOUND',
    UNREGISTERED_USER = 'AUTH_SERVICE_ERRORS.UNREGISTERED_USER',
    USER_ALREADY_REGISTERED = 'AUTH_SERVICE_ERRORS.USER_ALREADY_REGISTERED',
    INVALID_CREDENTIALS = 'AUTH_SERVICE_ERRORS.INVALID_CREDENTIALS',
    TOKEN_NOT_CREATED = 'AUTH_SERVICE_ERRORS.TOKEN_NOT_CREATED',
    TOKENS_NOT_CREATED = 'AUTH_SERVICE_ERRORS.TOKENS_NOT_CREATED',
    USER_KEY_EMPTY = 'AUTH_SERVICE_ERRORS.USER_KEY_EMPTY'
}

@Service()
export class AuthService {

    @Inject()
    private userCollectionService: UserCollectionService = Container.get(UserCollectionService);

    /**
     * Login user
     *
     * @param body
     */
    public async login(body: any): Promise<any> {
        let user = await this.userCollectionService.findOne({ username: { $eq: body.username }});

        if (!user) {
            throw new HandleUpstreamError(AUTH_SERVICE_ERRORS.UNREGISTERED_USER);
        }

        // Check if plain text password matches with hashed password
        if (!Hash.bcryptCompare(body.password, user.password)) {
            throw new HandleUpstreamError(AUTH_SERVICE_ERRORS.INVALID_CREDENTIALS);
        }

        // Generate tokens
        const accessToken  = await AuthService.generateToken(user.key, user.authorities, 'access');
        const refreshToken = await AuthService.generateToken(user.key, user.authorities, 'refresh');

        if (!accessToken || !refreshToken) {
            throw new HandleUpstreamError(AUTH_SERVICE_ERRORS.TOKENS_NOT_CREATED);
        }

        // Save refresh token for later use
        user['refreshToken'] = refreshToken;
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
        const newUser = await this.userCollectionService.updateUser(data);

        return {
            user: {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
            },
        };
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
