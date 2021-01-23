import * as config from 'config';
import * as path from 'path';
import * as fs from 'fs';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as useragent from 'express-useragent';
import * as stoppable from 'stoppable';
import { useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import { EventDispatcher } from 'event-dispatch';
import { AuthorizationMiddleware } from '../middleware/AuthorizationMiddleware';
import { RequestorDecoratorMiddleware } from '../middleware/RequestDecoratorMiddleware';
import { logger } from '../common/logging';

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require(process.cwd() + '/spec.json');
import * as SwaggerExpressMiddleware from 'swagger-express-middleware';

export let server;

export class ExpressConfig {

    public app: express.Express;
    public eventDispatcher: EventDispatcher = new EventDispatcher();

    constructor() {
        this.app = express();

        useContainer(Container);
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

        this.app.get('/*', (req, res) => {
            res.sendFile(path.join(__dirname, '../../frontend/views/index.html'), (err) => {
                if (err) {
                    res.status(500).send(err);
                }
            });
        });
    }

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
                    MyBelongings Server Started!

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
                    MyBelongings Server Started!

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

    private getListener(): string {
        return config.get('ports.http');
    }
}
