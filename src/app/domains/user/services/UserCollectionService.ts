import { Service } from 'typedi';
import { Datetime, User } from '../../shared/models/models';
import { DatabaseCollectionService } from '../../shared/services/DatabaseCollectionService';

@Service()
export class UserCollectionService extends DatabaseCollectionService {
    constructor() {
        super('User');
    }

    /**
     * Get all users
     */
    public async getUsers(): Promise<User[]> {
        await this.loadCollection();

        return this.collection.chain()
            .find()
            .simplesort('firstName', false)
            .data();
    }

    /**
     * Add or update user
     *
     * @param user
     */
    public async updateUser(user: any) {
        await this.loadCollection();

        const existingUser = await this.findOne({ key: { $eq: user.key }});

        if (existingUser) {
            return await this.updateManyFields({
                uniqueField: 'key',
                uniqueFieldValue: existingUser.key,
                updateFields: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    username: user.username,
                    password: user.password,
                    modified: Datetime.getNow()
                }
            });
        } else {
            return await this.addOne(new User({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                password: user.password
            }));
        }
    }
}