import { User } from '../models/models';
import { DecodedJWT, Requestor } from './interfaces';

export interface AuthorisedRequestor extends Requestor {
    user: User;
    jwt?: string;
    jwtDecoded: DecodedJWT;
    sessionId: string;
}
