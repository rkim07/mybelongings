import { Datetime } from '../utilities/Datetime';
import { Hash } from '../utilities/Hash';
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
        authorities: Array<string>,
        firstName: string,
        lastName: string,
        email: string,
        username: string,
        password: string,
        refreshToken: string
    }) {
        this.key = Key.generate();
        this.authorities = data.authorities ? data.authorities : ['ROLE_USER'];
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.username = data.username;
        this.password = Hash.bcryptHash(data.password);
        this.refreshToken = data.refreshToken;
        this.modified = this.created = Datetime.getNow();
    }
}

export namespace User {
    export enum TypeEnum {
        User = 'User' as any
    }
}
