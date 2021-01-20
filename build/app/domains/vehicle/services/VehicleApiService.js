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
var VehicleApiService_1;
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
const VehicleApiHelper_1 = require("../../shared/helpers/VehicleApiHelper");
const path = require("path");
const NHTSA_LIST_SOURCE = config.get('api.vehicles.nhtsa.listSource');
const NHTSA_MFR_URL = config.get('api.vehicles.nhtsa.mfrUrl');
const NHTSA_MFR_MODELS_URL = config.get('api.vehicles.nhtsa.mfrModelsUrl');
const LIST_FORMAT = config.get('api.vehicles.nhtsa.listFormat');
var VEHICLE_API_ERRORS;
(function (VEHICLE_API_ERRORS) {
    VEHICLE_API_ERRORS["VEHICLE_MFR_NOT_FOUND"] = "VEHICLE_API_ERRORS.VEHICLE_MFR_NOT_FOUND";
    VEHICLE_API_ERRORS["VEHICLE_MFRS_NOT_FOUND"] = "VEHICLE_API_ERRORS.VEHICLE_MFRS_NOT_FOUND";
    VEHICLE_API_ERRORS["VEHICLE_MODEL_NOT_FOUND"] = "VEHICLE_API_ERRORS.VEHICLE_MODEL_NOT_FOUND";
    VEHICLE_API_ERRORS["VEHICLE_MODELS_NOT_FOUND"] = "VEHICLE_API_ERRORS.VEHICLE_MODELS_NOT_FOUND";
    VEHICLE_API_ERRORS["MFR_KEY_EMPTY"] = "VEHICLE_API_ERRORS.MFR_KEY_EMPTY";
    VEHICLE_API_ERRORS["MODEL_KEY_EMPTY"] = "VEHICLE_API_ERRORS.MODEL_KEY_EMPTY";
})(VEHICLE_API_ERRORS = exports.VEHICLE_API_ERRORS || (exports.VEHICLE_API_ERRORS = {}));
let VehicleApiService = VehicleApiService_1 = class VehicleApiService {
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
                throw new models_1.HandleUpstreamError(VEHICLE_API_ERRORS.VEHICLE_MFR_NOT_FOUND);
            }
            mfr['mfrName'] = VehicleApiService_1.formatName(mfr.mfrName);
            return mfr;
        });
    }
    /**
     * Get all API manufacturers
     */
    getApiMfrs() {
        return __awaiter(this, void 0, void 0, function* () {
            const mfrs = yield this.nhtsaApiVehicleMfrCollectionService.getApiMfrs();
            if (mfrs.length === 0) {
                throw new models_1.HandleUpstreamError(VEHICLE_API_ERRORS.VEHICLE_MFRS_NOT_FOUND);
            }
            return yield Promise.all(mfrs.map((mfr) => {
                mfr['mfrName'] = VehicleApiService_1.formatName(mfr.mfrName);
                return mfr;
            }));
        });
    }
    /**
     * Get API manufacturer by key
     *
     * @param modelKey
     * @param mfrName
     */
    getApiModel(modelKey, mfrName = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!modelKey) {
                throw new models_1.HandleUpstreamError(VEHICLE_API_ERRORS.MODEL_KEY_EMPTY);
            }
            const model = yield this.nhtsaApiVehicleModelCollectionService.findOne({ key: { $eq: modelKey } });
            if (!model) {
                throw new models_1.HandleUpstreamError(VEHICLE_API_ERRORS.VEHICLE_MODEL_NOT_FOUND);
            }
            model['model'] = VehicleApiService_1.formatName(mfrName, model.model);
            return model;
        });
    }
    /**
     * Get all API manufacturer models
     */
    getApiModels() {
        return __awaiter(this, void 0, void 0, function* () {
            const models = yield this.nhtsaApiVehicleModelCollectionService.getApiModels();
            //@TODO name filtering solution since manufacturer name is unknown but required by custom filter
            return yield Promise.all(models.map((model) => {
                model['model'] = VehicleApiService_1.formatName(null, model.model);
                return model;
            }));
        });
    }
    /**
     * Get all vehicle models by manufacturer ID from DB
     *
     * @param mfrKey
     */
    getApiModelsByMfrKey(mfrKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mfrKey) {
                throw new models_1.HandleUpstreamError(VEHICLE_API_ERRORS.MFR_KEY_EMPTY);
            }
            const models = yield this.nhtsaApiVehicleModelCollectionService.getApiModelsByMfrKey(mfrKey);
            if (models.length === 0) {
                throw new models_1.HandleUpstreamError(VEHICLE_API_ERRORS.VEHICLE_MODELS_NOT_FOUND);
            }
            const mfr = yield this.getApiMfr(mfrKey);
            return yield Promise.all(models.map((model) => {
                model['model'] = VehicleApiService_1.formatName(mfr.mfrName, model.model);
                return model;
            }));
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
     * Sync with NHTSA Vehicle API
     */
    syncNhtsaApi() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch API and get all vehicles manufactures
                const list = yield this.getNhtsaMfrs(NHTSA_LIST_SOURCE);
                const filterClass = VehicleApiHelper_1.VehicleApiHelper.getFilterClass();
                // Save to API manufacturers DB
                const savedMfrs = yield Promise.all(list.map((mfr) => __awaiter(this, void 0, void 0, function* () {
                    // Remove all hyphens and save as lower case
                    mfr['Make_Name'] = filterClass.formatDbMfrName(mfr.Make_Name);
                    return yield this.updateApiMfrs(mfr);
                })));
                if (savedMfrs.length === 0) {
                    throw new models_1.HandleUpstreamError(VEHICLE_API_ERRORS.VEHICLE_MFRS_NOT_FOUND);
                }
                // Add or update all manufacturers models
                for (const mfr of savedMfrs) {
                    const apiModels = yield this.getNhtsaModelsByMfrId(mfr.mfrId);
                    if (apiModels) {
                        yield Promise.all(apiModels.map((model) => __awaiter(this, void 0, void 0, function* () {
                            // Remove all space special character and save as lower case
                            model['Make_Name'] = filterClass.formatDbMfrName(model.Make_Name);
                            model['Model_Name'] = filterClass.formatDbModelName(model.Model_Name);
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
    /**
     * Get specific class instance by manufacturer name and return its
     * formatted name
     *
     * @param mfrName
     * @param modelName
     * @private
     */
    static formatName(mfrName, modelName = null) {
        const filterClass = VehicleApiHelper_1.VehicleApiHelper.getFilterClass(mfrName);
        return mfrName && !modelName ?
            filterClass.formatFrontEndMfrName(mfrName)
            :
                filterClass.formatFrontEndModelName(modelName);
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
VehicleApiService = VehicleApiService_1 = __decorate([
    typedi_1.Service()
], VehicleApiService);
exports.VehicleApiService = VehicleApiService;
//# sourceMappingURL=VehicleApiService.js.map