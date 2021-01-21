import { Container, Inject, Service } from 'typedi';
import { JWTHelper } from '../../shared/helpers/JWTHelper';
import { Hash } from '../../shared/models/utilities/Hash';
import { Key } from '../../shared/models/utilities/Key';
import { UserCollectionService } from '../../user/services/UserCollectionService';
import { User } from '../../shared/models/domains/User';

const bcrypt = require('bcrypt');

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
            return {
                message: 'Unregistered user.'
            };
        }

        // Check if plain text password matches with hashed password
        const match = Hash.compare(body.password, user.password);

        if (!match) {
            return {
                message: 'Incorrect credentials.'
            };
        }

        // Generate tokens
        const [accessToken, refreshToken] = await AuthService.generateTokens(user);

        // Save refresh token for later use
        user['refreshToken'] = refreshToken
        await this.userCollectionService.updateUser(user);

        return {
            token: accessToken,
            message: 'User successfully logged in.'
        }
    }

    /**
     * Register new user
     *
     * @param data
     */
    public async register(data: User): Promise<any> {
        const existingUser = await this.userCollectionService.find({ email: { $eq: data.email }});

        if (existingUser.length) {
            return {
                message: 'User already registered'
            };
        }

        // Add new user
        const newUser = await this.userCollectionService.updateUser(data);

        return {
            user: {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
            },
            message: 'User successfully registered'
        };
    }

    /**
     * Generate tokens
     *
     * @param user
     * @private
     */
    private static async generateTokens(user): Promise<any> {
        // Prepare token's payload
        const jwtPayload = {
            key: Key.generate(),
            userKey: user.key,
            authorities: user.authorities
        };

        // Generate tokens
        const accessToken = await JWTHelper.signToken(jwtPayload, 'access');
        const refreshToken = await JWTHelper.signToken(jwtPayload, 'refresh');

        return [accessToken, refreshToken];
    }


    /**
     * Refresh token
     *
     * @param body
     */
    public async refreshToken(body: any): Promise<any> {
    }
}
