import { NextFunction, Response } from 'express';
import { Request } from '../domains/shared/interfaces/interfaces';
import { Container } from 'typedi';
import { DataConversionService } from '../domains/shared/services/DataConversionService';
import * as _ from 'lodash';
import { logger } from '../common/logging';

export namespace DataConversionMiddleware {

    /**
     * Convert request body to DB
     *
     * @param req
     * @param res
     * @param next
     */
    export function requestInterceptor(req: Request, res: Response, next: NextFunction) {
        const service = new DataConversionService('response');

        try {
            if (service.isRequestConvertingRoute(req.url)) {
                const service = new DataConversionService('request');
                req.body = service.process(req.body);
            }

            next();
        } catch (err) {
            logger.error(err);
        }
    }

    /**
     * Convert response data to frontend
     *
     * @param req
     * @param res
     * @param next
     */
    export function responseInterceptor(req: Request, res: Response, next: NextFunction) {
        const service = new DataConversionService('response');

        try {
            // Original response
            const originalSend = res.send;

            // Check if route is listed for data conversion
            if (service.isResponseConvertingRoute(res.req.url)) {
                res.send = function(): any {
                    let parsedData = JSON.parse(arguments[0]);
                    let convertedPayload = service.process(parsedData.payload);
                    arguments[0] = JSON.stringify({ ...parsedData, payload: convertedPayload });
                    originalSend.apply(res, arguments);
                }
            }

            next();
        } catch (err) {
            logger.error(err);
        }
    }
}