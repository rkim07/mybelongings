import { Container, Inject, Service } from 'typedi';
import { UserCollectionService } from './UserCollectionService';
import {HandleUpstreamError, Key, User, Vehicle} from '../../shared/models/models';
import { ImageHelper } from "../../shared/helpers/ImageHelper";

export enum USER_ERRORS {
    USER_NOT_FOUND = 'USER_NOT_FOUND'
}

/**
 * @author Ryan Kim
 */
@Service()
export class UserService {

    @Inject()
    private userCollectionService: UserCollectionService = Container.get(UserCollectionService);

    /**
     * Get user by key
     *
     * @param origin
     * @param key
     */
    public async getUser(origin:string, key: Key): Promise<any> {
        const user = await this.userCollectionService.findOne({ key: { $eq: key }});

        if (!user) {
            throw new HandleUpstreamError(USER_ERRORS.USER_NOT_FOUND);
        }

        return await this.addDependencies(origin, user);
    }

    /**
     * Get all users
     *
     * @param origin
     */
    public async getUsers(origin: string): Promise<any> {
        const users = await this.userCollectionService.getUsers();

        return await Promise.all(users.map(async (user) => {
            return await this.addDependencies(origin, user);
        }));
    }

    /**
     * Add dependencies when returning object
     *
     * @param origin
     * @param user
     */
    private async addDependencies(origin, user) {
        user['image_path'] = ImageHelper.getImagePath(origin, user.image);
        return user;
    }
}
