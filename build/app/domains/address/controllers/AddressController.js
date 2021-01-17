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
exports.AddressController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const models_1 = require("../../shared/models/models");
const AddressService_1 = require("../services/AddressService");
let AddressController = class AddressController {
    constructor() {
        this.addressService = typedi_1.Container.get(AddressService_1.AddressService);
    }
    /**
     * @swagger
     * paths:
     *   address-svc/addresses/{address_key}:
     *     get:
     *       summary: Retrieve a specific address.
     *       description: Retrieve a specific address.
     *       parameters:
     *         - in: path
     *           name: address_key
     *           description: The address key being queried.
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: DB data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the address service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    getAddress(addressKey, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.addressService.getAddress(addressKey, req.requestor.referrer);
            }
            catch (err) {
                throw new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the address service.');
            }
        });
    }
    /**
     * @swagger
     * paths:
     *   /address-svc/addresses:
     *     get:
     *       deprecated: true
     *       summary: Get all addresses
     *       description: Get all addresses
     *       responses:
     *         200:
     *           description: DB data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the address service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    getAddresses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.addressService.getAddresses();
            }
            catch (err) {
                throw new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the auth service.');
            }
        });
    }
    /**
     * @swagger
     * paths:
     *   /address-svc/address:
     *     post:
     *       summary: Add address
     *       description: Add address
     *       tags:
     *          - Address
     *       parameters:
     *         - in: body
     *           name: request
     *           description: Address data has been retrieved successfully.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/Address'
     *       responses:
     *         201:
     *           description: DB data has been posted successfully.
     *           schema:
     *              $ref: '#/definitions/Address'
     *         500:
     *           description: An unexpected error occurred in the address service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    postAddress(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.addressService.updateAddress(body);
            }
            catch (err) {
                throw new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the auth service.');
            }
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", AddressService_1.AddressService)
], AddressController.prototype, "addressService", void 0);
__decorate([
    routing_controllers_1.Get('/addresss/:address_key'),
    __param(0, routing_controllers_1.Param('address_key')),
    __param(1, routing_controllers_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AddressController.prototype, "getAddress", null);
__decorate([
    routing_controllers_1.Get('/addresses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AddressController.prototype, "getAddresses", null);
__decorate([
    routing_controllers_1.HttpCode(201),
    routing_controllers_1.Post('/address'),
    __param(0, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AddressController.prototype, "postAddress", null);
AddressController = __decorate([
    routing_controllers_1.JsonController('/address-svc')
], AddressController);
exports.AddressController = AddressController;
//# sourceMappingURL=AddressController.js.map