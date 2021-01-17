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
exports.VehicleApiService = exports.VEHICLE_API_ERRORS = void 0;
const _ = require("lodash");
const fs_1 = require("fs");
const typedi_1 = require("typedi");
const config = require("config");
const requestPromise = require("request-promise");
const models_1 = require("../../shared/models/models");
const NhtsaApiVehicleMfrCollectionService_1 = require("./NhtsaApiVehicleMfrCollectionService");
const NhtsaApiVehicleModelCollectionService_1 = require("./NhtsaApiVehicleModelCollectionService");
const path = require("path");
const NHTSA_LIST_SOURCE = config.get('api.vehicles.nhtsa.listSource');
const NHTSA_MFR_URL = config.get('api.vehicles.nhtsa.mfrUrl');
const NHTSA_MFR_MODELS_URL = config.get('api.vehicles.nhtsa.mfrModelsUrl');
const LIST_FORMAT = config.get('api.vehicles.nhtsa.listFormat');
var VEHICLE_API_ERRORS;
(function (VEHICLE_API_ERRORS) {
    VEHICLE_API_ERRORS["VEHICLE_API_MFR_NOT_FOUND"] = "VEHICLE_API_ERRORS.VEHICLE_API_MFR_NOT_FOUND";
    VEHICLE_API_ERRORS["VEHICLE_API_MODEL_NOT_FOUND"] = "VEHICLE_API_ERRORS.VEHICLE_API_MODEL_NOT_FOUND";
})(VEHICLE_API_ERRORS = exports.VEHICLE_API_ERRORS || (exports.VEHICLE_API_ERRORS = {}));
let VehicleApiService = class VehicleApiService {
    constructor() {
        this.nhtsaApiVehicleMfrCollectionService = typedi_1.Container.get(NhtsaApiVehicleMfrCollectionService_1.NhtsaApiVehicleMfrCollectionService);
        this.nhtsaApiVehicleModelCollectionService = typedi_1.Container.get(NhtsaApiVehicleModelCollectionService_1.NhtsaApiVehicleModelCollectionService);
    }
    /**
     * Get API manufacturer by key
     *
     * @param mfrKey
     */
    getApiMfr(mfrKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const mfr = yield this.nhtsaApiVehicleMfrCollectionService.findOne({ key: { $eq: mfrKey } });
            if (!mfr) {
                throw new models_1.HandleUpstreamError(VEHICLE_API_ERRORS.VEHICLE_API_MFR_NOT_FOUND);
            }
            return mfr;
        });
    }
    /**
     * Get all API manufacturers
     */
    getApiMfrs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.nhtsaApiVehicleMfrCollectionService.getApiMfrs();
        });
    }
    /**
     * Get API manufacturer by key
     *
     * @param modelKey
     */
    getApiModel(modelKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = yield this.nhtsaApiVehicleModelCollectionService.findOne({ key: { $eq: modelKey } });
            if (!model) {
                throw new models_1.HandleUpstreamError(VEHICLE_API_ERRORS.VEHICLE_API_MODEL_NOT_FOUND);
            }
            return model;
        });
    }
    /**
     * Get all API manufacturer models
     */
    getApiModels() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.nhtsaApiVehicleModelCollectionService.getApiModels();
        });
    }
    /**
     * Get all vehicle models by manufacturer ID from DB
     *
     * @param mfrKey
     */
    getApiModelsByMfrKey(mfrKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.nhtsaApiVehicleModelCollectionService.getApiModelsByMfrKey(mfrKey);
        });
    }
    /**
     * Sync with NHTSA Vehicle API
     */
    syncNhtsaApi() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch API and get all vehicles manufactures
                const list = yield this.getNhtsaMfrs(NHTSA_LIST_SOURCE);
                // Save to API manufacturers DB
                const savedMfrs = yield Promise.all(list.map((mfr) => __awaiter(this, void 0, void 0, function* () {
                    return yield this.updateApiMfrs(mfr);
                })));
                // Add or update all manufacturers models
                for (const mfr of savedMfrs) {
                    const apiModels = yield this.getNhtsaModelsByMfrId(mfr.mfrId);
                    if (apiModels) {
                        yield Promise.all(apiModels.map((model) => __awaiter(this, void 0, void 0, function* () {
                            yield this.updateApiModelsByMfrKey(mfr.key, model);
                        })));
                    }
                }
                return true;
            }
            catch (err) {
                throw new Error('Failed to sync with NHTSA API.');
            }
        });
    }
    /**
     * Save NHTSA manufacturers list to DB
     *
     * @param mfr
     */
    updateApiMfrs(mfr) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.nhtsaApiVehicleMfrCollectionService.updateMfrs({
                mfrId: mfr.Make_ID,
                mfrName: mfr.Make_Name,
            });
        });
    }
    /**
     * Save NHTSA manufacturers models list to DB
     *
     * @param mfrKey
     * @param model
     */
    updateApiModelsByMfrKey(mfrKey, model) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.nhtsaApiVehicleModelCollectionService.updateModel({
                mfrKey: mfrKey,
                modelId: model.Model_ID,
                model: escape(model.Model_Name)
            });
        });
    }
    /**
     * Get API vehicle manufacturers either locally or remotely
     */
    getNhtsaMfrs(listSource) {
        return __awaiter(this, void 0, void 0, function* () {
            if (listSource === 'local') {
                return JSON.parse(fs_1.readFileSync(path.resolve(__dirname, '../../shared/fixtures/whitelistedCarMfrs.json'), 'utf8'));
            }
            const apiList = yield requestPromise({
                method: 'GET',
                uri: `${NHTSA_MFR_URL}?format=${LIST_FORMAT}`,
                json: true
            }).then((response) => {
                return response.Results;
            }).catch(err => {
                throw new Error(`Failed to connect to NHTSA API vehicle manufacturers list`);
            });
            const blacklistedCarMfrs = JSON.parse(fs_1.readFileSync(path.resolve(__dirname, '../../shared/fixtures/blacklistedCarMfrs.json'), 'utf8'));
            return _.difference(apiList, blacklistedCarMfrs);
        });
    }
    /**
     * Get API vehicle models by manufacturer ID remotely
     *
     * @param mfrId
     */
    getNhtsaModelsByMfrId(mfrId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mfrId) {
                return [];
            }
            return yield requestPromise({
                method: 'GET',
                uri: `${NHTSA_MFR_MODELS_URL}/${mfrId}?format=${LIST_FORMAT}`,
                json: true
            }).then((response) => {
                return response.Results;
            }).catch(err => {
                throw new Error(`Failed to connect to NHTSA API vehicle models list`);
            });
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", NhtsaApiVehicleMfrCollectionService_1.NhtsaApiVehicleMfrCollectionService)
], VehicleApiService.prototype, "nhtsaApiVehicleMfrCollectionService", void 0);
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", NhtsaApiVehicleModelCollectionService_1.NhtsaApiVehicleModelCollectionService)
], VehicleApiService.prototype, "nhtsaApiVehicleModelCollectionService", void 0);
VehicleApiService = __decorate([
    typedi_1.Service()
], VehicleApiService);
exports.VehicleApiService = VehicleApiService;
//# sourceMappingURL=VehicleApiService.js.map