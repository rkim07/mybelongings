"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
require('module-alias/register');
const logging_1 = require("../common/logging");
const Express_1 = require("./Express");
const StartupManager_1 = require("./StartupManager");
class Application {
    constructor() {
        this.startupManager = new StartupManager_1.default(() => {
            this.express = new Express_1.ExpressConfig();
            this.express.eventDispatcher.on('server:started', () => {
                (this.onReadyCallback) ? this.onReadyCallback() : logging_1.logger.info('Application Ready!');
            });
        });
    }
    onReady(cb) {
        this.onReadyCallback = cb;
    }
}
exports.Application = Application;
//# sourceMappingURL=Application.js.map