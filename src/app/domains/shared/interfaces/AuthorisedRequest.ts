import { AuthorisedRequestor, Request } from './interfaces';

export interface AuthorisedRequest extends Request {
    requestor: AuthorisedRequestor;
}
