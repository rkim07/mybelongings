"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
var config = require("config");
var pino = require("pino");
exports.logger = pino({
    prettyPrint: {
        translateTime: true
    },
    level: config.get('logging.loglevel').toString()
});
//# sourceMappingURL=logging.js.map