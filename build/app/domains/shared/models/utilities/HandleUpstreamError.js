"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleUpstreamError = void 0;
const logging_1 = require("../../../../common/logging");
class HandleUpstreamError extends Error {
    constructor(key) {
        super();
        this.key = key;
        Error.captureStackTrace(this, this.constructor);
        // Always log an upstream error when created
        logging_1.logger.error(this);
    }
}
exports.HandleUpstreamError = HandleUpstreamError;
//# sourceMappingURL=HandleUpstreamError.js.map