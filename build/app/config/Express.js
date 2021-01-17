"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressConfig = void 0;
var bodyParser = require("body-parser");
var cors = require("cors");
var express = require("express");
var fs = require("fs");
var path = require("path");
var routing_controllers_1 = require("routing-controllers");
var typedi_1 = require("typedi");
var config = require("config");
var event_dispatch_1 = require("event-dispatch");
var logging_1 = require("../common/logging");
// import { VersionService } from '../domains/shared/services/VersionService';
// import { AuthorizationMiddleware } from '../middleware/AuthorizationMiddleware';
var NotificationManager_1 = require("./NotificationManager");
/*const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require(process.cwd() + '/spec.json');
import * as SwaggerExpressMiddleware from 'swagger-express-middleware';*/
var ExpressConfig = /** @class */ (function () {
    function ExpressConfig() {
        this.eventDispatcher = new event_dispatch_1.EventDispatcher();
        this.app = express();
        routing_controllers_1.useContainer(typedi_1.Container);
        var self = this;
        // Only allow swagger api endpoing if using development branch
        /*const versionService = Container.get(VersionService);
        if (versionService.getVersion().version == 'development') {
            this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        }*/
        this.app.use(express.static(path.join(__dirname, '../../frontend/views/')));
        this.app.use(express.static(path.join(__dirname, '../../frontend/js/')));
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        // Hide system specs from outside viewing
        this.app.use('/ping', function (req, res, next) {
            res.sendStatus(200);
        });
        /*SwaggerExpressMiddleware('./spec.json', this.app, (err, middleware: SwaggerExpressMiddleware.SwaggerMiddleware) => {
            this.app.use(
                middleware.metadata(),
                middleware.parseRequest(),
                middleware.validateRequest(),
                AuthorizationMiddleware.authorizeRequest,
                useragent.express()
            );
            self.setupControllers();
        });*/
        self.setupControllers();
    }
    ExpressConfig.prototype.stopServer = function (cb) {
        this.server.close(cb);
    };
    ExpressConfig.prototype.setupControllers = function () {
        var _this = this;
        var controllersPath = path.resolve('**', 'app', 'domains', '**', 'controllers', '*.js');
        var middlewaresPath = path.resolve('**', 'app', 'middleware', '*.js');
        routing_controllers_1.useExpressServer(this.app, {
            enableValidation: false,
            defaultErrorHandler: false,
            controllerDirs: [controllersPath],
            middlewareDirs: [middlewaresPath]
        });
        var listen = this.getListener();
        // Start Webserver
        this.server = this.app.listen(listen, function () {
            if (/\.sock$/.exec(listen)) {
                logging_1.logger.info("\n                    ------------\n                    Server Started!\n\n                    Socket: " + listen + "\n                    Health: /ping\n\n                    API Spec: /api-docs.json\n                    ------------\n                ");
                setTimeout(function () {
                    // Make the socket writable by Nginx
                    fs.chmodSync(listen, 766);
                    logging_1.logger.info("Socket is now ready: " + listen);
                }, 1000);
            }
            else {
                logging_1.logger.info("\n                    ------------\n                    Server Started!\n\n                    Http: http://localhost:" + listen + "\n                    Health: http://localhost:" + listen + "/ping\n\n                    API Spec: http://localhost:" + listen + "/api-docs.json\n                    ------------\n              ");
            }
            _this.eventDispatcher.dispatch('server:started');
        });
        // Start Notification Manager
        typedi_1.Container.get(NotificationManager_1.NotificationManager);
    };
    ExpressConfig.prototype.getListener = function () {
        return config.get('ports.http');
    };
    return ExpressConfig;
}());
exports.ExpressConfig = ExpressConfig;
//# sourceMappingURL=Express.js.map