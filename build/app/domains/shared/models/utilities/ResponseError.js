"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseError = void 0;
class ResponseError extends Error {
    constructor(statusCode, errorCode, message) {
        super();
        Object.setPrototypeOf(this, ResponseError.prototype);
        if (statusCode)
            this.statusCode = statusCode;
        if (errorCode)
            this.errorCode = errorCode;
        if (message)
            this.message = message;
        this.stack = new Error().stack;
    }
}
exports.ResponseError = ResponseError;
//# sourceMappingURL=ResponseError.js.map