import { Service } from 'typedi';
import { Datetime, Key, User, Vehicle } from '../../shared/models/models';
import { Hash } from '../../shared/models/utilities/Hash';
import { DatabaseCollectionService } from '../../shared/services/DatabaseCollectionService';

@Service()
export class UserCollectionService extends DatabaseCollectionService {
    constructor() {
        super('User');
    }

    /**
     * Get all users
     */
    public async getAll(): Promise<any> {
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
    public async add(user: any): Promise<any> {
        return await this.addOne(new User({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            username: user.username,
            password: user.password,
            active: user.active,
            signupCode: user.signupCode,
            resetCode: user.resetCode,
            refreshToken: user.refreshToken,
            authorities: user.authorities
        }));
    }

    /**
     * Update user
     *
     * @param user
     */
    public async update(user: User): Promise<any> {
        await this.loadCollection();

        return await this.updateManyFields({
            uniqueField: 'key',
            uniqueFieldValue: user.key,
            updateFields: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                username: user.username,
                password: user.password,
                active: user.active,
                signupCode: user.signupCode,
                resetCode: user.resetCode,
                refreshToken: user.refreshToken,
                authorities: user.authorities,
                modified: Datetime.getNow()
            }
        });
    }
}
