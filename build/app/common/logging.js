"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const config = require("config");
const pino = require("pino");
exports.logger = pino({
    prettyPrint: {
        translateTime: true
    },
    level: config.get('logging.loglevel').toString()
});
//# sourceMappingURL=logging.js.map