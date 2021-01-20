import { Request as ExpressRequest } from 'express';
import { Requestor } from './interfaces';

export interface Request extends ExpressRequest {
    readonly swagger: any; // swagger-express-middleware doesn't expose the right type for this object :(
    requestor: Requestor;
}
