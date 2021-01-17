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
exports.VehicleApiController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const models_1 = require("../../shared/models/models");
const VehicleApiService_1 = require("../services/VehicleApiService");
let VehicleApiController = class VehicleApiController {
    constructor() {
        this.apiVehicleService = typedi_1.Container.get(VehicleApiService_1.VehicleApiService);
    }
    /**
     * @swagger
     * paths:
     *   /vehicle-api-svc/sync/nhtsa:
     *     get:
     *       summary: Retrieve API manufacturers list maintained by NHTSA API
     *       description: Retrieve API manufacturers list maintained by NHTSA API
     *       responses:
     *         200:
     *           description: DB data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the vehicle API service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    syncNhtsaApi() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.apiVehicleService.syncNhtsaApi();
            }
            catch (err) {
                throw new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the auth service.');
            }
        });
    }
    /**
     * @swagger
     * paths:
     *   /vehicle-api-svc/manufacturers:
     *     get:
     *       summary: Retrieve API manufacturer's models list maintained by NHTSA API
     *       description: Retrieve vehicle list from DB
     *       responses:
     *         200:
     *           description: DB data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the vehicle API service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    getManufacturers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.apiVehicleService.getApiMfrs();
            }
            catch (err) {
                throw new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the auth service.');
            }
        });
    }
    /**
     * @swagger
     * paths:
     *   /vehicle-api-svc/models/manufacturer/{mfr_key}:
     *     get:
     *       summary: Get a list of all vehicles
     *       description: Retrieve vehicle list from DB
     *       parameters:
     *         - in: path
     *           name: mfr_key
     *           description: The manufacturer ID being queried.
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: DB data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the vehicle service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    getManufacturerModels(mfrKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.apiVehicleService.getApiModelsByMfrKey(mfrKey);
            }
            catch (err) {
                throw new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the auth service.');
            }
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", VehicleApiService_1.VehicleApiService)
], VehicleApiController.prototype, "apiVehicleService", void 0);
__decorate([
    routing_controllers_1.Get('/sync/nhtsa'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VehicleApiController.prototype, "syncNhtsaApi", null);
__decorate([
    routing_controllers_1.Get('/manufacturers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VehicleApiController.prototype, "getManufacturers", null);
__decorate([
    routing_controllers_1.Get('/models/manufacturer/:mfr_key'),
    __param(0, routing_controllers_1.Param('mfr_key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VehicleApiController.prototype, "getManufacturerModels", null);
VehicleApiController = __decorate([
    routing_controllers_1.JsonController('/vehicle-api-svc')
], VehicleApiController);
exports.VehicleApiController = VehicleApiController;
//# sourceMappingURL=VehicleApiController.js.map