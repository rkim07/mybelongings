import { Datetime } from '../utilities/Datetime';
import { Hash } from '../utilities/Hash';
import { Code, Key } from '../utilities/Key';

export class User {
    key: Key;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    active: number;
    signupCode: Code;
    resetCode: Code;
    refreshToken: Key;
    authorities: Array<string>;
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
        active: number,
        signupCode: Code,
        resetCode: Code,
        refreshToken: Key,
        authorities: Array<string>
    }) {
        this.key = Key.generate();
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.username = data.username;
        this.password = Hash.bcryptHash(data.password);
        this.active = data.active;
        this.signupCode = Code.generate();
        this.resetCode = data.resetCode;
        this.refreshToken = data.refreshToken;
        this.authorities = data.authorities ? data.authorities : ['ROLE_USER'];
        this.modified = this.created = Datetime.getNow();
    }
}

export namespace User {
    export enum TypeEnum {
        User = 'User' as any
    }
}
