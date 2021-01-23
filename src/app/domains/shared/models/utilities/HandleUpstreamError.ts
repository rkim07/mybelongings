import { logger } from '../../../../common/logging';

export class HandleUpstreamError extends Error {
    key: string;
    constructor(key: string) {
        super();
        this.key = key;
        Error.captureStackTrace(this, this.constructor);
        
        // Always log an upstream error when created
        logger.error(this);
    }
}
