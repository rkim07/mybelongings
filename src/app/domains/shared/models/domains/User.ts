import { Hash } from "../utilities/Hash";
import { Datetime } from '../utilities/Datetime';
import { Key } from '../utilities/Key';

export class User {
    key: Key;
    authorities: Array<string>;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    refreshToken: string;
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
        password: string,
        refreshToken: string
    }) {
        const userKey = Key.generate()

        this.key = userKey;
        this.authorities = ['ROLE_USER'];
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.username = data.username;
        this.password = Hash.hash(userKey + data.password);
        this.refreshToken = data.refreshToken;
        this.modified = this.created = Datetime.getNow();
    }
}

export namespace User {
    export enum TypeEnum {
        User = 'User' as any
    }
}
