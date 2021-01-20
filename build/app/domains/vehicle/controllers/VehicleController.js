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
exports.VehicleController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const models_1 = require("../../shared/models/models");
const VehicleService_1 = require("../services/VehicleService");
let VehicleController = class VehicleController {
    constructor() {
        this.vehicleService = typedi_1.Container.get(VehicleService_1.VehicleService);
    }
    /**
     * @swagger
     * paths:
     *   /vehicle-svc/vehicles/{vehicle_key}:
     *     get:
     *       summary: Retrieve a specific vehicle.
     *       description: Retrieve a specific vehicle.
     *       parameters:
     *         - in: path
     *           name: vehicle_key
     *           description: The vehicle key being queried.
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
    getVehicle(req, vehicleKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vehicle = yield this.vehicleService.getVehicle(vehicleKey, req.requestor.referrer);
                return {
                    vehicle: vehicle,
                    statusCode: 200,
                    message: 'Successfully retrieved specific vehicle.'
                };
            }
            catch (err) {
                if (err instanceof models_1.HandleUpstreamError) {
                    switch (err.key) {
                        case VehicleService_1.VEHICLE_ERRORS.VEHICLE_KEY_EMPTY:
                            return new models_1.ResponseError(500, err.key, 'Empty vehicle key provided.');
                        case VehicleService_1.VEHICLE_ERRORS.VEHICLE_NOT_FOUND:
                            return new models_1.ResponseError(404, err.key, 'No vehicles were found for the user key provided.');
                        default:
                            return new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the vehicle service.');
                    }
                }
                else {
                    return new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the vehicle service.');
                }
            }
        });
    }
    /**
     * @swagger
     * paths:
     *   /vehicle-svc/vehicles:
     *     get:
     *       summary: Get all vehicles
     *       description: Retrieve vehicles data from manufacturer implemented API.
     *       responses:
     *         200:
     *           description: DB data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the vehicle service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    getVehicles(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vehicles = yield this.vehicleService.getVehicles(req.requestor.referrer);
                return {
                    vehicles: vehicles,
                    statusCode: 200,
                    message: 'Successfully retrieved all vehicles.'
                };
            }
            catch (err) {
                if (err instanceof models_1.HandleUpstreamError) {
                    switch (err.key) {
                        case VehicleService_1.VEHICLE_ERRORS.VEHICLES_NOT_FOUND:
                            return new models_1.ResponseError(404, err.key, 'No vehicles were found.');
                        default:
                            return new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the vehicle service.');
                    }
                }
                else {
                    return new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the vehicle service.');
                }
            }
        });
    }
    /**
     * @swagger
     * paths:
     *   /vehicle-svc/vehicles/user/{user_key}:
     *     get:
     *       summary: Fetch the vehicle of a user by key.
     *       description: Return the vehicle of a user, excluding items.
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
     *             $ref: '#/definitions/Vehicle'
     *         500:
     *           description: An unexpected error occurred in the vehicle service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    getVehiclesByUserKey(req, userKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vehicles = yield this.vehicleService.getVehiclesByUserKey(userKey, req.requestor.referrer);
                return {
                    vehicles: vehicles,
                    statusCode: 200,
                    message: 'Successfully retrieved all vehicles for this user.'
                };
            }
            catch (err) {
                if (err instanceof models_1.HandleUpstreamError) {
                    switch (err.key) {
                        case VehicleService_1.VEHICLE_ERRORS.USER_KEY_EMPTY:
                            return new models_1.ResponseError(500, err.key, 'Empty user key provided.');
                        case VehicleService_1.VEHICLE_ERRORS.VEHICLES_NOT_FOUND:
                            return new models_1.ResponseError(404, err.key, 'No vehicles were found for the user key provided.');
                        default:
                            return new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the vehicle service.');
                    }
                }
                else {
                    return new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the vehicle service.');
                }
            }
        });
    }
    /**
     * @swagger
     * paths:
     *   /vehicle-svc/vehicle:
     *     post:
     *       summary: Add vehicle
     *       description: Add vehicle
     *       tags:
     *          - Vehicle
     *       parameters:
     *         - in: body
     *           name: request
     *           description: New vehicle information.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/Vehicle'
     *       responses:
     *         201:
     *           description: DB data has been added successfully.
     *           schema:
     *             $ref: '#/definitions/Vehicle'
     *         500:
     *           description: An unexpected error occurred in the vehicle service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    addVehicle(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vehicle = yield this.vehicleService.addVehicle(req.requestor.referrer, body);
                return {
                    vehicle: vehicle,
                    statusCode: 201,
                    message: 'Successfully added vehicle'
                };
            }
            catch (err) {
                if (err instanceof models_1.HandleUpstreamError) {
                    switch (err.key) {
                        case VehicleService_1.VEHICLE_ERRORS.NEW_VEHICLE_EMPTY:
                            return new models_1.ResponseError(500, err.key, 'New vehicle information is empty.');
                        case VehicleService_1.VEHICLE_ERRORS.VIN_ALREADY_EXISTS:
                            return new models_1.ResponseError(500, err.key, 'Same VIN already found on another vehicle.');
                        case VehicleService_1.VEHICLE_ERRORS.VEHICLE_NOT_ADDED:
                            return new models_1.ResponseError(500, err.key, 'Vehicle cannot be added at this time.');
                        default:
                            return new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the vehicle service.');
                    }
                }
                else {
                    return new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the vehicle service.');
                }
            }
        });
    }
    /**
     * @swagger
     * paths:
     *   /vehicle-svc/vehicles/{vehicle_key}:
     *     put:
     *       summary: Update vehicle.
     *       description: Update vehicle.
     *       tags:
     *         - Vehicle
     *       parameters:
     *         - name: vehicle_key
     *           in: path
     *           description: The key associated to the desired vehicle.
     *           type: string
     *           required: true
     *         - in: body
     *           name: request
     *           description: Request with vehicle to be added.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/Vehicle'
     *       responses:
     *         200:
     *           description: The shipping address was updated successfully.
     *           schema:
     *             $ref: '#/definitions/Vehicle'
     *         x-404_NOT_FOUND:
     *           description: Please input another vehicle because the vehicle does not exist.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the seat service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    putVehicle(req, vehicleKey, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vehicle = yield this.vehicleService.updateVehicle(req.requestor.referrer, body, vehicleKey);
                return {
                    vehicle: vehicle,
                    statusCode: 200,
                    message: 'Successfully updated vehicle.'
                };
            }
            catch (err) {
                if (err instanceof models_1.HandleUpstreamError) {
                    switch (err.key) {
                        case VehicleService_1.VEHICLE_ERRORS.VEHICLE_KEY_EMPTY:
                            return new models_1.ResponseError(500, err.key, 'Empty vehicle key provided.');
                        case VehicleService_1.VEHICLE_ERRORS.VIN_ALREADY_EXISTS:
                            return new models_1.ResponseError(500, err.key, 'Same VIN already found on another vehicle.');
                        case VehicleService_1.VEHICLE_ERRORS.VEHICLE_NOT_UPDATED:
                            return new models_1.ResponseError(500, err.key, 'Vehicle cannot be updated at this time.');
                        default:
                            return new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the vehicle service.');
                    }
                }
                else {
                    return new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the vehicle service.');
                }
            }
        });
    }
    /**
     * @swagger
     * paths:
     *   /vehicle-svc/vehicles/{vehicle_key}:
     *     delete:
     *       summary: Delete the vehicle.
     *       description:
     *           Remove the vehicle.
     *       parameters:
     *         - in: path
     *           name: vehicle_key
     *           description: The key for the current vehicle.
     *           required: true
     *           type: string
     *       responses:
     *         204:
     *           description: The vehicle was removed successfully.
     *         x-404_VEHICLE_NOT_FOUND:
     *           description: No vehicle was found for the vehicle key provided.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the vehicle service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    deleteVehicle(vehicleKey, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vehicle = yield this.vehicleService.deleteVehicle(vehicleKey);
                if (vehicle) {
                    response.send({
                        vehicle: vehicle,
                        statusCode: 204,
                        message: 'Successfully deleted vehicle.'
                    });
                }
            }
            catch (err) {
                if (err instanceof models_1.HandleUpstreamError) {
                    switch (err.key) {
                        case VehicleService_1.VEHICLE_ERRORS.VEHICLE_KEY_EMPTY:
                            return new models_1.ResponseError(500, err.key, 'Empty vehicle key provide.');
                        case VehicleService_1.VEHICLE_ERRORS.VEHICLE_NOT_FOUND:
                            return new models_1.ResponseError(500, err.key, 'Vehicle not found for delete.');
                        default:
                            return new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the vehicle service.');
                    }
                }
                else {
                    return new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the vehicle service.');
                }
            }
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", VehicleService_1.VehicleService)
], VehicleController.prototype, "vehicleService", void 0);
__decorate([
    routing_controllers_1.Get('/vehicles/:vehicle_key'),
    __param(0, routing_controllers_1.Req()),
    __param(1, routing_controllers_1.Param('vehicle_key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "getVehicle", null);
__decorate([
    routing_controllers_1.Get('/vehicles'),
    __param(0, routing_controllers_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "getVehicles", null);
__decorate([
    routing_controllers_1.Get('/vehicles/user/:user_key'),
    __param(0, routing_controllers_1.Req()),
    __param(1, routing_controllers_1.Param('user_key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "getVehiclesByUserKey", null);
__decorate([
    routing_controllers_1.HttpCode(201),
    routing_controllers_1.Post('/vehicle'),
    __param(0, routing_controllers_1.Req()),
    __param(1, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "addVehicle", null);
__decorate([
    routing_controllers_1.Put('/vehicles/:vehicle_key'),
    __param(0, routing_controllers_1.Req()),
    __param(1, routing_controllers_1.Param('vehicle_key')),
    __param(2, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "putVehicle", null);
__decorate([
    routing_controllers_1.HttpCode(204),
    routing_controllers_1.Delete('/vehicles/:vehicle_key'),
    __param(0, routing_controllers_1.Param('vehicle_key')), __param(1, routing_controllers_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "deleteVehicle", null);
VehicleController = __decorate([
    routing_controllers_1.JsonController('/vehicle-svc')
], VehicleController);
exports.VehicleController = VehicleController;
//# sourceMappingURL=VehicleController.js.map