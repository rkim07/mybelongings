import { Service } from 'typedi';
import { Datetime, Key, User, Vehicle } from '../../shared/models/models';
import { DatabaseCollectionService } from '../../shared/services/DatabaseCollectionService';

@Service()
export class UserCollectionService extends DatabaseCollectionService {
    constructor() {
        super('User');
    }

    /**
     * Get all users
     */
    public async getUsers(): Promise<any> {
        await this.loadCollection();

        return this.collection.chain()
            .find()
            .simplesort('firstName', false)
            .data();
    }

    /**
     * Add user
     *
     * @param user
     */
    public async adddUser(user: any): Promise<any> {
        return await this.addOne(new User({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            password: user.password,
            active: user.active,
            code: user.code,
            refreshToken: user.refreshToken,
            authorities: user.authorities
        }));
    }

    /**
     * Update user
     *
     * @param user
     */
    public async updateUser(user: User): Promise<any> {
        await this.loadCollection();

        return await this.updateManyFields({
            uniqueField: 'key',
            uniqueFieldValue: user.key,
            updateFields: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                password: user.password,
                active: user.active,
                code: user.code,
                refreshToken: user.refreshToken,
                authorities: user.authorities,
                modified: Datetime.getNow()
            }
        });
    }
}
