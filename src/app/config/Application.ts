require('module-alias/register');

import { logger } from '../common/logging';
import { ExpressConfig } from './Express';
import StartupManager from './StartupManager';

export class Application {

    express: ExpressConfig;
    startupManager: StartupManager;
    onReadyCallback: Function;
    logger;

    constructor() {
        this.startupManager = new StartupManager(() => {
            this.express = new ExpressConfig();
            this.express.eventDispatcher.on('server:started', () => {
                (this.onReadyCallback) ? this.onReadyCallback() : logger.info('Application Ready!');
            });
        });
    }

    public onReady(cb: Function) {
        this.onReadyCallback = cb;
    }
}
