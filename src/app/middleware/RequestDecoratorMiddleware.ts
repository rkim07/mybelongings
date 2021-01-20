import { NextFunction, Response } from 'express';
import * as forwarded from 'forwarded';
import { logger } from '../common/logging';
import { Request } from '../domains/shared/interfaces/interfaces';

/**
 * Run before requests are processed, decorating the request with extra properties
 */
export namespace RequestorDecoratorMiddleware {

    export function decorateRequest(req: Request, res: Response, next: NextFunction): void {
        let ipAddress: Array<string> = forwarded(req);

        req.requestor = {
          // On the pac rack, the remoteAddress fields are empty.  We must get ip address from x-forwarded-for
          ipAddress: ipAddress[0] || ipAddress[1],
          language: req.header('accept-language'),
          referrer: req.header('referer')
        };
        logger.info('REQUEST: ' + req.method + ' ' + req.url);
        next();
    }

}
