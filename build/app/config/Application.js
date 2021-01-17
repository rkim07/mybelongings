"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
require('module-alias/register');
var logging_1 = require("../common/logging");
var Express_1 = require("./Express");
var StartupManager_1 = require("./StartupManager");
var Application = /** @class */ (function () {
    function Application() {
        var _this = this;
        this.startupManager = new StartupManager_1.default(function () {
            _this.express = new Express_1.ExpressConfig();
            _this.express.eventDispatcher.on('server:started', function () {
                (_this.onReadyCallback) ? _this.onReadyCallback() : logging_1.logger.info('Application Ready!');
            });
        });
    }
    Application.prototype.onReady = function (cb) {
        this.onReadyCallback = cb;
    };
    return Application;
}());
exports.Application = Application;
//# sourceMappingURL=Application.js.map