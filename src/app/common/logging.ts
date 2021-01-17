import * as config from 'config';
import * as pino from 'pino';

export const logger = pino({
    prettyPrint: {
        translateTime: true
    },
    level: config.get('logging.loglevel').toString()
});
