import { Container, Inject, Service } from 'typedi';
import { UserCollectionService } from './UserCollectionService';
import { Code, HandleUpstreamError, Key, User } from '../../shared/models/models';

export enum USER_SERVICE_MESSAGES {
    USER_NOT_FOUND = 'USER_SERVICE_MESSAGES.USER_NOT_FOUND',
    MISSING_PARAMETERS = 'USER_SERVICE_MESSAGES.MISSING_PARAMETERS'
}

/**
 * @author Ryan Kim
 */
@Service()
export class UserService {

    @Inject()
    private userCollectionService: UserCollectionService = Container.get(UserCollectionService);

    /**
     * Get user
     *
     * @param key
     */
    public async getUser(key: Key): Promise<any> {
        if (!key) {
            throw new HandleUpstreamError(USER_SERVICE_MESSAGES.USER_NOT_FOUND);
        }

        return await this.userCollectionService.findOne({ key: { $eq: key }});
    }

    /**
     * Get user by a specific column name
     *
     * @param fieldName
     * @param value
     */
    public async getUserByField(fieldName: string, value: string) {
        if (!fieldName || !value) {
            throw new HandleUpstreamError(USER_SERVICE_MESSAGES.MISSING_PARAMETERS);
        }

        return await this.userCollectionService.findByField(fieldName, value,  1);
    }

    /**
     * Get user by email and code
     *
     * @param email
     * @param code
     * @param codeType
     */
    public async getUserByEmailAnCode(email: string, code: Code, codeType: 'resetCode' | 'signupCode') {
        if (!email || !code || !codeType) {
            throw new HandleUpstreamError(USER_SERVICE_MESSAGES.MISSING_PARAMETERS);
        }

        const query = {
            $and: [
                { email: { $eq: email } },
                { [codeType]: { $eq: code } }
            ]
        };

        return await this.userCollectionService.findOne(query);
    }

    /**
     * Get all users
     */
    public async getUsers(): Promise<any> {
        return await this.userCollectionService.getAll();
    }

    /**
     * Add user
     *
     * @param user
     */
    public async addUser(user: User) {
        if (!user) {
            throw new HandleUpstreamError(USER_SERVICE_MESSAGES.USER_NOT_FOUND);
        }

        return await this.userCollectionService.add(user);
    }

    /**
     * Update user
     *
     * @param user
     */
    public async updateUser(user: User) {
        if (!user.key) {
            throw new HandleUpstreamError(USER_SERVICE_MESSAGES.USER_NOT_FOUND);
        }

        return await this.userCollectionService.update(user);
    }

    /**
     * Delete user
     *
     * @param user
     */
    public async deleteUser(userKey: Key) {
        if (!userKey) {
            throw new HandleUpstreamError(USER_SERVICE_MESSAGES.USER_NOT_FOUND);
        }

        return await this.userCollectionService.removeByFieldValue('key', userKey);
    }
}
