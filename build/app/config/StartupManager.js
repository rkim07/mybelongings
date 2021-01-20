"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = require("../common/logging");
/*
    The StartupManager is run only once at the start of the application
    It is responsible for collecting all the configs and data, and starting the services
    necessary for the application to operate throughout multiple flights
*/
class StartupManager {
    constructor(onSuccessCallback) {
        this.init();
        this.onSuccess = onSuccessCallback;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            logging_1.logger.info('The application is starting up, reaching step 9 indicates success!');
            try {
                yield this.initializeStartupSequence();
            }
            catch (error) {
                logging_1.logger.error('The application could not start up');
                logging_1.logger.error(error);
            }
            logging_1.logger.info('The application started successfully!');
            this.onSuccess();
        });
    }
    initializeStartupSequence() {
        return __awaiter(this, void 0, void 0, function* () {
            logging_1.logger.debug('Application Startup Success');
        });
    }
}
exports.default = StartupManager;
//# sourceMappingURL=StartupManager.js.map