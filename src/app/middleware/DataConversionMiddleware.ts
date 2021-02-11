import { NextFunction, Response } from 'express';
import { Request } from '../domains/shared/interfaces/interfaces';
import { Container } from 'typedi';
import { DataConversionService } from '../domains/shared/services/DataConversionService';
import { VehicleApiConversionService } from '../domains/shared/services/VehicleApiConversionService';
import { SystemMessageService } from '../domains/shared/services/SystemMessageService';
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
        const dataConversionService = new DataConversionService('request');

        try {
            if (dataConversionService.isReqRoute(req.url)) {
                req.body = dataConversionService.process(req.body);
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
        const dataConversionService = new DataConversionService('response');
        const vehicleApiConversionService = new VehicleApiConversionService('response');
        const systemMessageService: SystemMessageService = Container.get(SystemMessageService);

        try {
            // Original response
            const originalSend = res.send;

            // Check if route is listed for data conversion
            res.send = function(): any {
                let parsedData = JSON.parse(arguments[0]);

                // Convert payload for most of REST
                if (dataConversionService.isResRoute(req.url)) {
                    if (parsedData.payload) {
                        const parsedPayload = dataConversionService.process(parsedData.payload);
                        parsedData.payload = parsedPayload;
                    }
                }

                // Convert payload for API services
                if (vehicleApiConversionService.isResApiRoute(req.url)) {
                    if (parsedData.payload) {
                        const apiParsedPayload = vehicleApiConversionService.process(parsedData.payload);
                        parsedData.payload = apiParsedPayload;
                    }
                }

                const [statusType, message] = systemMessageService.process(parsedData.statusCode, parsedData.errorCode || parsedData.successCode);
                parsedData.statusType = statusType;
                parsedData.message = message;
                arguments[0] = JSON.stringify(parsedData);
                originalSend.apply(res, arguments);
            }

            next();
        } catch (err) {
            logger.error(err);
        }
    }
}
