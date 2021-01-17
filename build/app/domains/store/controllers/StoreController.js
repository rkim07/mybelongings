"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const models_1 = require("../../shared/models/models");
const StoreService_1 = require("../services/StoreService");
let StoreController = class StoreController {
    constructor() {
        this.storeService = typedi_1.Container.get(StoreService_1.StoreService);
    }
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
    getStore(storeKey, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.storeService.getStore(storeKey, req.requestor.referrer);
            }
            catch (err) {
                throw new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the store service.');
            }
        });
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
    getStores(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.storeService.getStores(req.requestor.referrer);
            }
            catch (err) {
                throw new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the store service.');
            }
        });
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
    postStore(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.storeService.updateStore(req.requestor.referrer, body);
            }
            catch (err) {
                throw new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the store service.');
            }
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", StoreService_1.StoreService)
], StoreController.prototype, "storeService", void 0);
__decorate([
    routing_controllers_1.Get('/stores/:store_key'),
    __param(0, routing_controllers_1.Param('store_key')),
    __param(1, routing_controllers_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.Key, Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getStore", null);
__decorate([
    routing_controllers_1.Get('/stores'),
    __param(0, routing_controllers_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getStores", null);
__decorate([
    routing_controllers_1.HttpCode(201),
    routing_controllers_1.Post('/store'),
    __param(0, routing_controllers_1.Req()),
    __param(1, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "postStore", null);
StoreController = __decorate([
    routing_controllers_1.JsonController('/store-svc')
], StoreController);
exports.StoreController = StoreController;
//# sourceMappingURL=StoreController.js.map