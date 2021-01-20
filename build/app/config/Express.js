"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressConfig = exports.server = void 0;
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const useragent = require("express-useragent");
const fs = require("fs");
const path = require("path");
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const config = require("config");
const event_dispatch_1 = require("event-dispatch");
const logging_1 = require("../common/logging");
const AuthorizationMiddleware_1 = require("../middleware/AuthorizationMiddleware");
const RequestDecoratorMiddleware_1 = require("../middleware/RequestDecoratorMiddleware");
const NotificationManager_1 = require("./NotificationManager");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require(process.cwd() + '/spec.json');
const SwaggerExpressMiddleware = require("swagger-express-middleware");
class ExpressConfig {
    constructor() {
        this.eventDispatcher = new event_dispatch_1.EventDispatcher();
        this.app = express();
        routing_controllers_1.useContainer(typedi_1.Container);
        const self = this;
        // Only allow swagger api endpoing if using development branch
        // const versionService = Container.get(VersionService);
        // if (versionService.getVersion().version == 'development') {
        this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        // }
        // Serve static contents
        this.app.use(express.static(path.join(__dirname, '../../frontend/views/')));
        this.app.use(express.static(path.join(__dirname, '../../frontend/js/')));
        this.app.use(express.static(path.join(__dirname, '../../assets/css')));
        this.app.use(express.static(path.join(__dirname, '../../assets/images')));
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        // Hide system specs from outside viewing
        this.app.use('/ping', (req, res, next) => {
            res.sendStatus(200);
        });
        SwaggerExpressMiddleware('./spec.json', this.app, (err, middleware) => {
            this.app.use(middleware.metadata(), middleware.parseRequest(), middleware.validateRequest(), RequestDecoratorMiddleware_1.RequestorDecoratorMiddleware.decorateRequest, AuthorizationMiddleware_1.AuthorizationMiddleware.authorizeRequest, useragent.express());
            self.setupControllers();
        });
    }
    setupControllers() {
        const controllersPath = path.resolve('**', 'app', 'domains', '**', 'controllers', '*.js');
        const middlewaresPath = path.resolve('**', 'app', 'middleware', '*.js');
        routing_controllers_1.useExpressServer(this.app, {
            enableValidation: false,
            defaultErrorHandler: false,
            controllerDirs: [controllersPath],
            middlewareDirs: [middlewaresPath]
        });
        const listen = this.getListener();
        // Start Webserver
        exports.server = this.app.listen(listen, () => {
            if (/\.sock$/.exec(listen)) {
                logging_1.logger.info(`
                    ------------
                    Server Started!

                    Socket: ${listen}
                    Health: /ping

                    API Spec: /api-docs.json
                    ------------
                `);
                setTimeout(function () {
                    // Make the socket writable by Nginx
                    fs.chmodSync(listen, 766);
                    logging_1.logger.info(`Socket is now ready: ${listen}`);
                }, 1000);
            }
            else {
                logging_1.logger.info(`
                    ------------
                    Server Started!

                    Http: http://localhost:${listen}
                    Health: http://localhost:${listen}/ping

                    API Spec: http://localhost:${listen}/api-docs.json
                    ------------
              `);
            }
            this.eventDispatcher.dispatch('server:started');
        });
        // Start Notification Manager
        typedi_1.Container.get(NotificationManager_1.NotificationManager);
    }
    getListener() {
        return config.get('ports.http');
    }
}
exports.ExpressConfig = ExpressConfig;
//# sourceMappingURL=Express.js.map