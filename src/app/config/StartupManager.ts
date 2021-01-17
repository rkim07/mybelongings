import { logger } from '../common/logging';

/*
    The StartupManager is run only once at the start of the application
    It is responsible for collecting all the configs and data, and starting the services
    necessary for the application to operate throughout multiple flights
*/
export default class StartupManager {

    constructor(onSuccessCallback: Function) {
        this.init();
        this.onSuccess = onSuccessCallback;
    }

    onSuccess: Function;

    private async init() {
        logger.info('The application is starting up, reaching step 9 indicates success!');
        try {
            await this.initializeStartupSequence();
        } catch (error) {
            logger.error('The application could not start up');
            logger.error(error);
        }
        logger.info('The application started successfully!');

        this.onSuccess();
    }

    private async initializeStartupSequence() {
        logger.debug('Application Startup Success');
    }
}
