import * as bodyParser from 'body-parser';
import * as config from 'config';
import * as cors from 'cors';
import { EventDispatcher } from 'event-dispatch';
import * as express from 'express';
import * as useragent from 'express-useragent';
import * as fs from 'fs';
import * as path from 'path';
import { useContainer, useExpressServer } from 'routing-controllers';
import * as stoppable from 'stoppable';
import { Container } from 'typedi';
import { AuthorizationMiddleware } from '../middleware/AuthorizationMiddleware';
import { RequestorDecoratorMiddleware } from '../middleware/RequestDecoratorMiddleware';
import { DataNormalizationMiddleware } from '../middleware/DataNormalizationMiddleware';

import { logger } from '../common/logging';

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require(process.cwd() + '/spec.json');
import * as SwaggerExpressMiddleware from 'swagger-express-middleware';

export let server;
const SITE_FRONT_NAME = config.get('site.frontName').toString();

export class ExpressConfig {

    public app: express.Express;
    public eventDispatcher: EventDispatcher = new EventDispatcher();

    constructor() {
        this.app = express();

        useContainer(Container);
        const self = this;

        // Only allow swagger api endpoint if using development branch
        // const versionService = Container.get(VersionService);
        // if (versionService.getVersion().version == 'development') {
        this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        // }

        // Serve static contents
        this.app.use(express.static(path.join(__dirname, '../../frontend/views/')));
        this.app.use(express.static(path.join(__dirname, '../../frontend/js/')));
        this.app.use(express.static(path.join(__dirname, '../../assets/css')));
        this.app.use(express.static(path.join(__dirname, '../../assets/images')));
        this.app.use(express.static(path.join(__dirname, '../../assets/files')));

        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));

        // Hide system specs from outside viewing
        this.app.use('/ping', (req, res) => {
            res.sendStatus(200);
        });

        this.app.use(
            DataNormalizationMiddleware.requestInterceptor,
            DataNormalizationMiddleware.responseInterceptor
        );

        SwaggerExpressMiddleware('./spec.json', this.app, (err, middleware: SwaggerExpressMiddleware.SwaggerMiddleware) => {
            this.app.use(
                middleware.metadata(),
                middleware.parseRequest(),
                middleware.validateRequest(),
                RequestorDecoratorMiddleware.decorateRequest,
                AuthorizationMiddleware.authorizeRequest,
                useragent.express()
            );
            self.setupControllers();
        });

        self.resolveReactRouters();
    }

    /**
     * Set up controllers for routing-controllers module
     *
     * @private
     */
    private setupControllers() {
        const controllersPath = path.resolve('**', 'app', 'domains', '**', 'controllers', '*.js');
        const middlewaresPath = path.resolve('**', 'app', 'middleware', '*.js');

        useExpressServer(this.app, {
            enableValidation: false,
            defaultErrorHandler: false,
            controllerDirs: [controllersPath],
            middlewareDirs: [middlewaresPath]
        });

        const listen = this.getListener();

        // Start Webserver
        server = this.app.listen(listen, () => {
            if (/\.sock$/.exec(listen)) {
                logger.info(`
                    ------------
                    ${SITE_FRONT_NAME} Server Started!

                    Socket: ${listen}
                    Health: /ping

                    API Spec: /api-docs.json
                    ------------
                `);

                setTimeout(function() {
                    // Make the socket writable by Nginx
                    fs.chmodSync(listen, 766);
                    logger.info(`Socket is now ready: ${listen}`);
                }, 1000);
            } else {
                logger.info(`
                    ------------
                    ${SITE_FRONT_NAME} Server Started!

                    Http: http://localhost:${listen}
                    Health: http://localhost:${listen}/ping

                    API Spec: http://localhost:${listen}/api-docs.json
                    ------------
              `);
            }
            this.eventDispatcher.dispatch('server:started');
        });

        // NPM library that will gracefully shutdown the server
        stoppable(server, 2000);
    }

    /**
     * Get listener
     */
    private getListener(): string {
        return config.get('ports.http');
    }

    /**
     * Trap all the react routing due to browser reloads or direct path entering
     *
     * @private
     */
    private resolveReactRouters() {
        // ADMIN
        this.app.get('/admin/unauthorized', (req, res) => {
            res.sendFile(path.join(__dirname, '../../frontend/views/index.html'));
        });

        this.app.get('/admin/vehicles/list', (req, res) => {
            res.sendFile(path.join(__dirname, '../../frontend/views/index.html'));
        });

        // AUTH SERVICES
        this.app.get('/account/signin', (req, res) => {
            res.sendFile(path.join(__dirname, '../../frontend/views/index.html'));
        });

        this.app.get('/account/signup', (req, res) => {
            res.sendFile(path.join(__dirname, '../../frontend/views/index.html'));
        });

        // Redirect from "/account/activate/:email/:signupCode" controller
        this.app.get(/^\/account\/activated\/[a-zA-Z]/, (req, res) => {
            if (req.params[0] !== 'index.js') {
                res.sendFile(path.join(__dirname, '../../frontend/views/index.html'));
            }
        });

        this.app.get(/^\/account\/password\/reset\/\S+@\S+\.\S+\/[0-9a-zA-Z-]{1,}$/, (req, res) => {
            if (req.params[0] !== 'index.js') {
                res.sendFile(path.join(__dirname, '../../frontend/views/index.html'));
            }
        });

        // VEHICLES SERVICE
        this.app.get(/^\/(?!vehicle-svc)([a-z0-9]+)$/, (req, res) => {
            if (req.params[0] !== 'index.js') {
                res.sendFile(path.join(__dirname, '../../frontend/views/index.html'));
            }
        });

        this.app.get('/vehicles', (req, res) => {
            res.sendFile(path.join(__dirname, '../../frontend/views/index.html'));
        });

        this.app.get(/^\/vehicles\/create$/, (req, res) => {
            if (req.params[0] !== 'index.js') {
                res.sendFile(path.join(__dirname, '../../frontend/views/index.html'));
            }
        });

        this.app.get(/^\/vehicles\/edit\/[0-9a-zA-Z]{1,}$/, (req, res) => {
            if (req.params[0] !== 'index.js') {
                res.sendFile(path.join(__dirname, '../../frontend/views/index.html'));
            }
        });
    }
}
