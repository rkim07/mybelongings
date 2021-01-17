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
exports.PropertyService = exports.PROPERTY_ERRORS = void 0;
const _ = require("lodash");
const typedi_1 = require("typedi");
const AddressService_1 = require("../../address/services/AddressService");
const PropertyCollectionService_1 = require("./PropertyCollectionService");
const propertyAreaService_1 = require("./propertyAreaService");
const models_1 = require("../../shared/models/models");
const UtilsHelper_1 = require("../../shared/helpers/UtilsHelper");
var PROPERTY_ERRORS;
(function (PROPERTY_ERRORS) {
    PROPERTY_ERRORS["PROPERTY_NOT_FOUND"] = "PROPERTY_ERRORS.PROPERTY_NOT_FOUND";
    PROPERTY_ERRORS["USER_KEY_EMPTY"] = "PROPERTY_ERRORS.USER_KEY_EMPTY";
})(PROPERTY_ERRORS = exports.PROPERTY_ERRORS || (exports.PROPERTY_ERRORS = {}));
let PropertyService = class PropertyService {
    constructor() {
        this.addressService = typedi_1.Container.get(AddressService_1.AddressService);
        this.propertyCollectionService = typedi_1.Container.get(PropertyCollectionService_1.PropertyCollectionService);
        this.propertyAreaService = typedi_1.Container.get(propertyAreaService_1.PropertyAreaService);
    }
    /**
     * Get property by key
     */
    getProperty(key, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const property = yield this.propertyCollectionService.findOne({ key: { $eq: key } });
            if (!property) {
                throw new models_1.HandleUpstreamError(PROPERTY_ERRORS.PROPERTY_NOT_FOUND);
            }
            return yield this.addDependencies(url, property);
        });
    }
    /**
     * Get all properties
     *
     * @param url
     */
    getProperties(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const properties = yield this.propertyCollectionService.getProperties();
            return yield Promise.all(properties.map((property) => __awaiter(this, void 0, void 0, function* () {
                return yield this.addDependencies(url, property);
            })));
        });
    }
    /**
     * Get all properties by user key
     *
     * @param userKey
     * @param url
     */
    getPropertiesByUserKey(userKey, url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userKey) {
                throw new models_1.HandleUpstreamError(PROPERTY_ERRORS.USER_KEY_EMPTY);
            }
            const results = yield this.propertyCollectionService.find({ userKey: { $eq: userKey } });
            if (!results) {
                throw new models_1.HandleUpstreamError(PROPERTY_ERRORS.PROPERTY_NOT_FOUND);
            }
            const properties = yield Promise.all(results.map((property) => __awaiter(this, void 0, void 0, function* () {
                return yield this.addDependencies(url, property);
            })));
            return _.sortBy(properties, o => o.address.street);
        });
    }
    /**
     * Add or update property
     *
     * @param url
     * @param body
     */
    updateProperty(url, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const property = yield this.propertyCollectionService.updateProperty(body);
            return yield this.addDependencies(url, property);
        });
    }
    /**
     * Add dependencies when returning object
     *
     * @param url
     * @param property
     */
    addDependencies(url, property) {
        return __awaiter(this, void 0, void 0, function* () {
            property['image_path'] = UtilsHelper_1.UtilsHelper.getImagePath(url, property.image);
            property['address'] = yield this.addressService.getAddress(property.addressKey);
            property['areas'] = yield this.propertyAreaService.getAreasByPropertyKey(property.key, url);
            return property;
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", AddressService_1.AddressService)
], PropertyService.prototype, "addressService", void 0);
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", PropertyCollectionService_1.PropertyCollectionService)
], PropertyService.prototype, "propertyCollectionService", void 0);
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", propertyAreaService_1.PropertyAreaService)
], PropertyService.prototype, "propertyAreaService", void 0);
PropertyService = __decorate([
    typedi_1.Service()
], PropertyService);
exports.PropertyService = PropertyService;
//# sourceMappingURL=PropertyService.js.map