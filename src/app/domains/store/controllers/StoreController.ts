import { Body, Get, HttpCode, JsonController, Param, Post, Req } from 'routing-controllers';
import { Container, Inject } from 'typedi';
import {Key, ResponseError, Store, Vehicle} from '../../shared/models/models';
import { StoreService } from '../services/StoreService';

@JsonController('/store-svc')
export class StoreController {

    @Inject()
    private storeService: StoreService = Container.get(StoreService);

    /**
     * @swagger
     * paths:
     *   store-svc/stores/{store_key}:
     *     get:
     *       summary: Retrieve a specific store.
     *       description: Retrieve a specific store.
     *       parameters:
     *         - in: path
     *           name: store_key
     *           description: The store key being queried.
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: DB data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the store service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/stores/:store_key')
    public async getStore(
        @Param('store_key') storeKey: Key,
        @Req() req: any): Promise<any> {
        try {
            return await this.storeService.getStore(storeKey, req.requestor.referrer);
        } catch (err) {
            throw new ResponseError(500, err.key, 'An unexpected error occurred in the store service.');
        }
    }

    /**
     * @swagger
     * paths:
     *   /store-svc/stores:
     *     get:
     *       summary: Get all stores
     *       description: Get all stores
     *       responses:
     *         200:
     *           description: DB data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the store service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/stores')
    public async getStores(@Req() req: any): Promise<any> {
        try {
            return await this.storeService.getStores(req.requestor.referrer);
        } catch (err) {
            throw new ResponseError(500, err.key, 'An unexpected error occurred in the store service.');
        }
    }

    /**
     * @swagger
     * paths:
     *   /store-svc/store:
     *     post:
     *       summary: Add store
     *       description: Add store
     *       tags:
     *          - Store
     *       parameters:
     *         - in: body
     *           name: request
     *           description: The store information.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/Store'
     *       responses:
     *         201:
     *           description: DB data has been posted successfully.
     *           schema:
     *              $ref: '#/definitions/Store'
     *         500:
     *           description: An unexpected error occurred in the store service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @HttpCode(201)
    @Post('/store')
    public async postStore(
        @Req() req: any,
        @Body() body: any): Promise<any> {
        try {
            return await this.storeService.updateStore(req.requestor.referrer, body);
        } catch (err) {
            throw new ResponseError(500, err.key, 'An unexpected error occurred in the store service.');
        }
    }
}
