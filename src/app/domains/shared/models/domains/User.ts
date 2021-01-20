import { Datetime } from '../utilities/Datetime';
import { Key } from '../utilities/Key';

const bcrypt = require('bcrypt');

export class User {
    key: Key;
    intr_type: User.TypeEnum;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: any;
    created: string;
    modified: string;

    /**
     * Constructor
     *
     * @param data
     */
    constructor(data: {
        firstName: string,
        lastName: string,
        email: string,
        username: string,
        password: string
    }) {
        this.intr_type = User.TypeEnum.User;
        this.key = Key.generate();
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.username = data.username;
        this.password = this.encryptPassword(data.password);
        this.modified = this.created = Datetime.getNow();
    }

    /**
     * Password encryption
     *
     * @param password
     */
    private encryptPassword(password) {
        const saltRounds = 10;
        return bcrypt.hashSync(password, saltRounds);
    }
}

export namespace User {
    export enum TypeEnum {
        User = 'User' as any
    }
}
