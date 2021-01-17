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
exports.VehicleService = exports.VEHICLE_ERRORS = void 0;
const _ = require("lodash");
const typedi_1 = require("typedi");
const typedi_2 = require("typedi");
const VehicleApiService_1 = require("./VehicleApiService");
const VehicleCollectionService_1 = require("./VehicleCollectionService");
const models_1 = require("../../shared/models/models");
const UtilsHelper_1 = require("../../shared/helpers/UtilsHelper");
const FileService_1 = require("../../shared/services/FileService");
var VEHICLE_ERRORS;
(function (VEHICLE_ERRORS) {
    VEHICLE_ERRORS["VEHICLE_NOT_FOUND"] = "VEHICLE_ERRORS.VEHICLE_NOT_FOUND";
    VEHICLE_ERRORS["VIN_ALREADY_EXISTS"] = "VEHICLE_ERRORS.VIN_ALREADY_EXISTS";
    VEHICLE_ERRORS["USER_KEY_EMPTY"] = "VEHICLE_ERRORS.USER_KEY_EMPTY";
})(VEHICLE_ERRORS = exports.VEHICLE_ERRORS || (exports.VEHICLE_ERRORS = {}));
let VehicleService = class VehicleService {
    constructor() {
        this.vehicleCollectionService = typedi_1.Container.get(VehicleCollectionService_1.VehicleCollectionService);
        this.vehicleApiService = typedi_1.Container.get(VehicleApiService_1.VehicleApiService);
        this.fileService = typedi_1.Container.get(FileService_1.FileService);
    }
    /**
     * Get vehicle by key
     *
     * @param key
     * @param url
     */
    getVehicle(key, url = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicle = yield this.vehicleCollectionService.findOne({ key: { $eq: key } });
            if (!vehicle) {
                throw new models_1.HandleUpstreamError(VEHICLE_ERRORS.VEHICLE_NOT_FOUND);
            }
            return yield this.addDependencies(url, vehicle);
        });
    }
    /**
     * Get all vehicles
     *
     * @param url
     */
    getVehicles(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicles = yield this.vehicleCollectionService.getVehicles();
            return yield Promise.all(vehicles.map((vehicle) => __awaiter(this, void 0, void 0, function* () {
                return yield this.addDependencies(url, vehicle);
            })));
        });
    }
    /**
     * Get all vehicles by user key
     *
     * @param userKey
     * @param url
     */
    getVehiclesByUserKey(userKey, url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userKey) {
                throw new models_1.HandleUpstreamError(VEHICLE_ERRORS.USER_KEY_EMPTY);
            }
            const results = yield this.vehicleCollectionService.find({ userKey: { $eq: userKey } });
            if (!results) {
                throw new models_1.HandleUpstreamError(VEHICLE_ERRORS.VEHICLE_NOT_FOUND);
            }
            const vehicles = yield Promise.all(results.map((vehicle) => __awaiter(this, void 0, void 0, function* () {
                return yield this.addDependencies(url, vehicle);
            })));
            return _.sortBy(vehicles, o => o.model);
        });
    }
    /**
     * Add or update vehicle
     *
     * @param url
     * @param body
     * @param key
     */
    updateVehicle(url, body, key = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicle = yield this.vehicleCollectionService.updateVehicle(key, body);
            if (!vehicle) {
                throw new models_1.HandleUpstreamError(VEHICLE_ERRORS.VIN_ALREADY_EXISTS);
            }
            return yield this.addDependencies(url, vehicle);
        });
    }
    /**
     * Deletes a vehicle given an associated vehicle key
     *
     * @param key
     */
    deleteVehicle(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicle = yield this.vehicleCollectionService.findOne({ key: { $eq: key } });
            yield this.vehicleCollectionService.removeByFieldValue('key', vehicle.key);
            yield this.fileService.removeFile(vehicle.image);
            return true;
        });
    }
    /**
     * Add dependencies when returning object
     *
     * @param url
     * @param vehicle
     */
    addDependencies(url, vehicle) {
        return __awaiter(this, void 0, void 0, function* () {
            const mfr = yield this.vehicleApiService.getApiMfr(vehicle.mfrKey);
            const model = yield this.vehicleApiService.getApiModel(vehicle.modelKey);
            vehicle['mfrName'] = mfr.mfrName;
            vehicle['model'] = model.model;
            vehicle['image_path'] = UtilsHelper_1.UtilsHelper.getImagePath(url, vehicle.image);
            return vehicle;
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", VehicleCollectionService_1.VehicleCollectionService)
], VehicleService.prototype, "vehicleCollectionService", void 0);
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", VehicleApiService_1.VehicleApiService)
], VehicleService.prototype, "vehicleApiService", void 0);
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", FileService_1.FileService)
], VehicleService.prototype, "fileService", void 0);
VehicleService = __decorate([
    typedi_2.Service()
], VehicleService);
exports.VehicleService = VehicleService;
//# sourceMappingURL=VehicleService.js.map