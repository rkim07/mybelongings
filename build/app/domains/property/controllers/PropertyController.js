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
exports.PropertyController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const models_1 = require("../../shared/models/models");
const PropertyService_1 = require("../services/PropertyService");
const PropertyAreaService_1 = require("../services/PropertyAreaService");
let PropertyController = class PropertyController {
    constructor() {
        this.propertyService = typedi_1.Container.get(PropertyService_1.PropertyService);
        this.propertyAreaService = typedi_1.Container.get(PropertyAreaService_1.PropertyAreaService);
    }
    /**
     * @swagger
     * paths:
     *   property-svc/properties/{property_key}:
     *     get:
     *       summary: Retrieve a specific property.
     *       description: Retrieve a specific property.
     *       parameters:
     *         - in: path
     *           name: property_key
     *           description: The property key being queried.
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: DB data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the property service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    getProperty(req, propertyKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.propertyService.getProperty(propertyKey, req.requestor.referrer);
            }
            catch (err) {
                throw new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the property service.');
            }
        });
    }
    /**
     * @swagger
     * paths:
     *   /property-svc/properties:
     *     get:
     *       summary: Get all properties
     *       description: Get all properties
     *       responses:
     *         200:
     *           description: DB data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the property service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    getProperties(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.propertyService.getProperties(req.requestor.referrer);
            }
            catch (err) {
                throw new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the property service.');
            }
        });
    }
    /**
     * @swagger
     * paths:
     *   /property-svc/properties/user/{user_key}:
     *     get:
     *       summary: Fetch the property of a user by key.
     *       description: Return the property of a user, excluding items.
     *       parameters:
     *         - in: path
     *           name: user_key
     *           description: The key for the current user.
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: DB data has been retrieved successfully.
     *           schema:
     *             $ref: '#/definitions/Property'
     *         x-404_NO_PROPERTY_FOUND:
     *           description: No property was found for the user key provided.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the property service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    getPropertiesByUserKey(req, userKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.propertyService.getPropertiesByUserKey(userKey, req.requestor.referrer);
            }
            catch (error) {
                if (error instanceof models_1.HandleUpstreamError) {
                    switch (error.key) {
                        case PropertyService_1.PROPERTY_ERRORS.USER_KEY_EMPTY:
                            throw new models_1.ResponseError(500, error.key, 'Empty user key provided in order to get property.');
                        case PropertyService_1.PROPERTY_ERRORS.PROPERTY_NOT_FOUND:
                            throw new models_1.ResponseError(404, error.key, 'No property was found for the user key provided.');
                        default:
                            throw new models_1.ResponseError(500, error.key, 'An unexpected error occurred in the property service.');
                    }
                }
                else {
                    throw new models_1.ResponseError(500, error.key, 'An unexpected error occurred in the property service.');
                }
            }
        });
    }
    /**
     * @swagger
     * paths:
     *   /property-svc/property:
     *     post:
     *       summary: Add property
     *       description: Add property
     *       tags:
     *          - Property
     *       parameters:
     *         - in: body
     *           name: request
     *           description: The property information.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/Property'
     *       responses:
     *         201:
     *           description: DB data has been posted successfully.
     *           schema:
     *              $ref: '#/definitions/Property'
     *         500:
     *           description: An unexpected error occurred in the property service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    postProperty(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.propertyService.updateProperty(req.requestor.referrer, body);
            }
            catch (err) {
                throw new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the property service.');
            }
        });
    }
    /**
     * @swagger
     * paths:
     *   /property-svc/property/area:
     *     post:
     *       summary: Add property area
     *       description: Add property area
     *       tags:
     *          - PropertyArea
     *       parameters:
     *         - in: body
     *           name: request
     *           description: DB data has been retrieved successfully.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/PropertyArea'
     *       responses:
     *         201:
     *           description: Property area was successfully added.
     *           schema:
     *              $ref: '#/definitions/PropertyArea'
     *         500:
     *           description: An unexpected error occurred in the property area service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    postPropertyArea(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.propertyAreaService.updatePropertyArea(req.requestor.referrer, body);
            }
            catch (err) {
                throw new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the property service.');
            }
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", PropertyService_1.PropertyService)
], PropertyController.prototype, "propertyService", void 0);
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", PropertyAreaService_1.PropertyAreaService)
], PropertyController.prototype, "propertyAreaService", void 0);
__decorate([
    routing_controllers_1.Get('/properties/:property_key'),
    __param(0, routing_controllers_1.Req()),
    __param(1, routing_controllers_1.Param('property_key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getProperty", null);
__decorate([
    routing_controllers_1.Get('/properties'),
    __param(0, routing_controllers_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getProperties", null);
__decorate([
    routing_controllers_1.Get('/properties/user/:user_key'),
    __param(0, routing_controllers_1.Req()),
    __param(1, routing_controllers_1.Param('user_key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getPropertiesByUserKey", null);
__decorate([
    routing_controllers_1.HttpCode(201),
    routing_controllers_1.Post('/property'),
    __param(0, routing_controllers_1.Req()),
    __param(1, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "postProperty", null);
__decorate([
    routing_controllers_1.HttpCode(201),
    routing_controllers_1.Post('/property/area'),
    __param(0, routing_controllers_1.Req()),
    __param(1, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "postPropertyArea", null);
PropertyController = __decorate([
    routing_controllers_1.JsonController('/property-svc')
], PropertyController);
exports.PropertyController = PropertyController;
//# sourceMappingURL=PropertyController.js.map