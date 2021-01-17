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
exports.NhtsaApiVehicleMfrCollectionService = void 0;
const typedi_1 = require("typedi");
const models_1 = require("../../shared/models/models");
const DatabaseCollectionService_1 = require("../../shared/services/DatabaseCollectionService");
const Datetime_1 = require("../../shared/models/utilities/Datetime");
let NhtsaApiVehicleMfrCollectionService = class NhtsaApiVehicleMfrCollectionService extends DatabaseCollectionService_1.DatabaseCollectionService {
    /**
     * Constructor
     */
    constructor() {
        super('NhtsaApiVehicleMfr');
    }
    /**
     * Get all API manufacturers
     */
    getApiMfrs() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection.chain()
                .find()
                .simplesort('mfrName', false)
                .data();
        });
    }
    /**
     * Add or update API manufacturer
     *
     * @param mfr
     */
    updateMfrs(mfr) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadCollection();
            const existingMfr = yield this.findOne({ key: { $eq: mfr.key } });
            if (existingMfr && existingMfr.mfrId) {
                return yield this.updateManyFields({
                    uniqueField: 'key',
                    uniqueFieldValue: existingMfr.key,
                    updateFields: {
                        mfrId: mfr.mfrId,
                        mfrName: mfr.mfrName.replace(/-/g, ' ').toLowerCase(),
                        modified: Datetime_1.Datetime.getNow()
                    }
                });
            }
            else {
                return yield this.addOne(new models_1.NhtsaApiVehicleMfr({
                    mfrId: mfr.mfrId,
                    mfrName: mfr.mfrName.replace(/-/g, ' ').toLowerCase()
                }));
            }
        });
    }
};
NhtsaApiVehicleMfrCollectionService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], NhtsaApiVehicleMfrCollectionService);
exports.NhtsaApiVehicleMfrCollectionService = NhtsaApiVehicleMfrCollectionService;
//# sourceMappingURL=NhtsaApiVehicleMfrCollectionService.js.map