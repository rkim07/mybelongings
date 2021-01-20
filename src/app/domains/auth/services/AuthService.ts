import { Container, Inject, Service } from 'typedi';
import { JWTHelper } from '../../shared/helpers/JWTHelper';
import { UserCollectionService } from '../../user/services/UserCollectionService';

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
        const user = await this.userCollectionService.find({ username: { $eq: body.username }});

        if (!user) {
            return {
                msg: 'Incorrect username or password'
            };
        }

        const userData = {
            'userKey': user[0].key,
            'firstName': user[0].firstName,
            'lastName': user[0].lastName,
            'email': user[0].email
        };

        // Decrypt encrypted password and compare with plain text password
        const match = bcrypt.compareSync(body.password, user[0].password);

        if (match) {
            return {
                token: AuthService.signJwtToken(user[0]),
                user: userData
            };
        } else {
            return {
                msg: 'Incorrect username or password'
            };
        }
    }

    /**
     * Register new user
     *
     * @param body
     */
    public async register(body: any): Promise<any> {
        const user = await this.userCollectionService.find({ email: { $eq: body.email }});

        if (user) {
            return {
                msg: 'User already registered'
            };
        }

        // Add new user
        const newUser = await this.userCollectionService.updateUser(body);

        return {
            token: AuthService.signJwtToken(newUser)
        };
    }

    /**
     * Refresh token
     *
     * @param body
     */
    public async refreshToken(body: any): Promise<any> {
    }

    /**
     * Sign JWT token
     *
     * @param user
     */
    private static signJwtToken(user): any {
        // Hide properties from JWT token
        delete user.intr_type;
        delete user.username;
        delete user.password;

        return JWTHelper.signToken(user);
    }
}
