"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestorDecoratorMiddleware = void 0;
const forwarded = require("forwarded");
const logging_1 = require("../common/logging");
/**
 * Run before requests are processed, decorating the request with extra properties
 */
var RequestorDecoratorMiddleware;
(function (RequestorDecoratorMiddleware) {
    function decorateRequest(req, res, next) {
        let ipAddress = forwarded(req);
        req.requestor = {
            // On the pac rack, the remoteAddress fields are empty.  We must get ip address from x-forwarded-for
            ipAddress: ipAddress[0] || ipAddress[1],
            language: req.header('accept-language'),
            referrer: req.header('referer')
        };
        logging_1.logger.info('REQUEST: ' + req.method + ' ' + req.url);
        next();
    }
    RequestorDecoratorMiddleware.decorateRequest = decorateRequest;
})(RequestorDecoratorMiddleware = exports.RequestorDecoratorMiddleware || (exports.RequestorDecoratorMiddleware = {}));
//# sourceMappingURL=RequestDecoratorMiddleware.js.map