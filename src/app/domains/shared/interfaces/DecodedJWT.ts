import { Key } from '../models/utilities/Key';
import { User } from "../models/domains/User";
import { Requestor } from "./Requestor";

export interface JwtDecoded {
    userKey: string;
    key: string;
    authorities: Array<string>;
    iat: number;
    iss: string;
    exp: number;
    jti: string;
}

export interface AuthorisedRequestor extends Requestor {
    origin: string;
    jwt: string;
    userKey: string;
    jwtDecoded: JwtDecoded;
    user?: User;
    sessionId?: string;
}
