import { Body, Get, HttpCode, JsonController, Param, Post, Put, Req } from 'routing-controllers';
import { Container, Inject } from 'typedi';
import { AuthorisedRequest } from '../../shared/interfaces/AuthorisedRequest';
import { HandleUpstreamError, Key, ResponseError, Store } from '../../shared/models/models';
import { STORE_SERVICE_MESSAGES, StoreService } from '../services/StoreService';

const DEFAULT_STORE_SERVICE_ERROR_MESSAGE = 'An unexpected error occurred in the store service.';

@JsonController('/store-svc')
export class StoreController {

    @Inject()
    private storeService: StoreService = Container.get(StoreService);

    /**
     * @swagger
     * paths:
     *   /store-svc/stores/{store_key}:
     *     get:
     *       description: Fetch a specific store.
     *       tags:
     *         - Store
     *       security:
     *         - OauthSecurity:
     *           - ROLE_USER
     *       parameters:
     *         - name: Authorization
     *           in: header
     *           description: The JWT token with claims about user.
     *           type: string
     *           required: true
     *         - in: path
     *           name: store_key
     *           description: The store key being queried.
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: Data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the store service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/stores/:store_key')
    public async getStore(
        @Req() { requestor: { userKey, host }}: AuthorisedRequest,
        @Param('store_key') storeKey: Key
    ): Promise<any> {
        try {
            const store = await this.storeService.getStore(storeKey, host);

            return {
                payload: store,
                statusCode: 200
            }
        } catch (err) {
            throw new ResponseError(500, 'STORE_SERVICE_MESSAGES.DEFAULT_STORE_SERVICE_ERROR_MESSAGE', DEFAULT_STORE_SERVICE_ERROR_MESSAGE);
        }
    }

    /**
     * @swagger
     * paths:
     *   /store-svc/stores:
     *     get:
     *       description: Fetch all stores
     *       tags:
     *         - Store
     *       security:
     *         - OauthSecurity:
     *           - ROLE_USER
     *       parameters:
     *         - name: Authorization
     *           in: header
     *           description: The JWT token with claims about user.
     *           type: string
     *           required: true
     *       responses:
     *         200:
     *           description: Data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the store service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/stores')
    public async getStores(@Req() { requestor: { userKey, host }}: AuthorisedRequest): Promise<any> {
        try {
            const stores = await this.storeService.getStores(host);

            return {
                payload: stores || [],
                statusCode: 200,
                successCode: stores.length === 0 ? 'STORE_SERVICE_MESSAGES.EMPTY_LIST' : ''
            };
        } catch (err) {
            throw new ResponseError(500, 'STORE_SERVICE_MESSAGES.DEFAULT_STORE_SERVICE_ERROR_MESSAGE', DEFAULT_STORE_SERVICE_ERROR_MESSAGE);
        }
    }

    /**
     * @swagger
     * paths:
     *   /store-svc/stores/by/type/{type}:
     *     get:
     *       description: Fetch all stores by a specific type
     *       tags:
     *         - Store
     *       security:
     *         - OauthSecurity:
     *           - ROLE_USER
     *       parameters:
     *         - name: Authorization
     *           in: header
     *           description: The JWT token with claims about user.
     *           type: string
     *           required: true
     *         - name: type
     *           in: path
     *           description: The type associated to the store.
     *           type: string
     *           required: true
     *       responses:
     *         200:
     *           description: Data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the store service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/stores/by/type/:type')
    public async getStoresByType(
        @Req() { requestor: { userKey, host }}: AuthorisedRequest,
        @Param('type') type: string
    ): Promise<any> {
        try {
            const stores = await this.storeService.getStoresByType(type, host);

            return {
                payload: stores || [],
                statusCode: 200,
                successCode: stores.length === 0 ? 'STORE_SERVICE_MESSAGES.STORES_BY_TYPE_EMPTY_LIST' : ''
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case STORE_SERVICE_MESSAGES.EMPTY_STORE_TYPE:
                        return new ResponseError(500, 'STORE_SERVICE_MESSAGES.DEFAULT_STORE_SERVICE_ERROR_MESSAGE', DEFAULT_STORE_SERVICE_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, 'STORE_SERVICE_MESSAGES.DEFAULT_STORE_SERVICE_ERROR_MESSAGE', DEFAULT_STORE_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'STORE_SERVICE_MESSAGES.DEFAULT_STORE_SERVICE_ERROR_MESSAGE', DEFAULT_STORE_SERVICE_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /store-svc/store:
     *     post:
     *       description: Add store
     *       tags:
     *          - Store
     *       security:
     *         - OauthSecurity:
     *           - ROLE_USER
     *       parameters:
     *         - name: Authorization
     *           in: header
     *           description: The JWT token with claims about user.
     *           type: string
     *           required: true
     *         - in: body
     *           name: request
     *           description: New store information.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/Store'
     *       responses:
     *         201:
     *           description: Data has been added successfully.
     *           schema:
     *             $ref: '#/definitions/Store'
     *         422:
     *           description: Restrictions for adding store.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the store service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @HttpCode(201)
    @Post('/store')
    public async postStore(
        @Req() { requestor: { userKey, host }}: AuthorisedRequest,
        @Body() body: any
    ): Promise<any> {
        try {
            const store = await this.storeService.addStore(body, host);

            return {
                payload: store,
                statusCode: 201,
                successCode: 'STORE_SERVICE_MESSAGES.NEW'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case STORE_SERVICE_MESSAGES.EMPTY_NEW_STORE_INFO:
                        return new ResponseError(422, 'STORE_SERVICE_MESSAGES.DEFAULT_STORE_SERVICE_ERROR_MESSAGE', '');
                    case STORE_SERVICE_MESSAGES.STORE_NOT_ADDED:
                        return new ResponseError(500, 'STORE_SERVICE_MESSAGES.DEFAULT_STORE_SERVICE_ERROR_MESSAGE', DEFAULT_STORE_SERVICE_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, 'STORE_SERVICE_MESSAGES.DEFAULT_STORE_SERVICE_ERROR_MESSAGE', DEFAULT_STORE_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'STORE_SERVICE_MESSAGES.DEFAULT_STORE_SERVICE_ERROR_MESSAGE', DEFAULT_STORE_SERVICE_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /store-svc/stores/{store_key}:
     *     put:
     *       description: Update store.
     *       tags:
     *          - Store
     *       security:
     *         - OauthSecurity:
     *           - ROLE_USER
     *       parameters:
     *         - name: Authorization
     *           in: header
     *           description: The JWT token with claims about user.
     *           type: string
     *           required: true
     *         - name: store_key
     *           in: path
     *           description: The key associated to the store.
     *           type: string
     *           required: true
     *         - in: body
     *           name: request
     *           description: Request with store to be added.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/Store'
     *       responses:
     *         200:
     *           description: The shipping address was updated successfully.
     *           schema:
     *             $ref: '#/definitions/Store'
     *         500:
     *           description: An unexpected error occurred in the seat service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Put('/stores/:store_key')
    public async putStore(
        @Req() { requestor: { userKey, host }}: AuthorisedRequest,
        @Param('store_key') storeKey: string,
        @Body() body: any
    ): Promise<any> {
        try {
            const store = await this.storeService.updateStore(storeKey, body, host);

            return {
                payload: store,
                statusCode: 200,
                successCode: 'STORE_SERVICE_MESSAGES.UPDATED'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case STORE_SERVICE_MESSAGES.EMPTY_STORE_KEY:
                        return new ResponseError(500, 'STORE_SERVICE_MESSAGES.DEFAULT_STORE_SERVICE_ERROR_MESSAGE', DEFAULT_STORE_SERVICE_ERROR_MESSAGE);
                    case STORE_SERVICE_MESSAGES.STORE_NOT_UPDATED:
                        return new ResponseError(500, 'STORE_SERVICE_MESSAGES.DEFAULT_STORE_SERVICE_ERROR_MESSAGE', DEFAULT_STORE_SERVICE_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, 'STORE_SERVICE_MESSAGES.DEFAULT_STORE_SERVICE_ERROR_MESSAGE', DEFAULT_STORE_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'STORE_SERVICE_MESSAGES.DEFAULT_STORE_SERVICE_ERROR_MESSAGE', DEFAULT_STORE_SERVICE_ERROR_MESSAGE);
            }
        }
    }
}
