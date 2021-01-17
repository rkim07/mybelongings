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
exports.StoreService = void 0;
const typedi_1 = require("typedi");
const AddressService_1 = require("../../address/services/AddressService");
const StoreCollectionService_1 = require("./StoreCollectionService");
const models_1 = require("../../shared/models/models");
const VehicleService_1 = require("../../vehicle/services/VehicleService");
let StoreService = class StoreService {
    constructor() {
        this.storeCollectionService = typedi_1.Container.get(StoreCollectionService_1.StoreCollectionService);
        this.addressService = typedi_1.Container.get(AddressService_1.AddressService);
    }
    /**
     * Get store by key
     *
     * @param key
     * @param url
     */
    getStore(key, url = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = yield this.storeCollectionService.findOne({ key: { $eq: key } });
            if (!store) {
                throw new models_1.HandleUpstreamError(VehicleService_1.VEHICLE_ERRORS.VEHICLE_NOT_FOUND);
            }
            return yield this.addDependencies(url, store);
        });
    }
    /**
     * Get all stores
     */
    getStores(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const stores = yield this.storeCollectionService.getStores();
            return yield Promise.all(stores.map((store) => __awaiter(this, void 0, void 0, function* () {
                return yield this.addDependencies(url, store);
            })));
        });
    }
    /**
     * Get store by key
     *
     * @param key
     * @param url
     */
    getStoreByKey(key, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = yield this.storeCollectionService.findOne({ key: { $eq: key } });
            return yield this.addDependencies(url, store);
        });
    }
    /**
     * Add or update store
     *
     * @param url
     * @param body
     */
    updateStore(url, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = yield this.storeCollectionService.updateStore(body);
            return yield this.addDependencies(url, store);
        });
    }
    /**
     * Add dependencies when returning object
     *
     * @param url
     * @param store
     */
    addDependencies(url, store) {
        return __awaiter(this, void 0, void 0, function* () {
            store['address'] = yield this.addressService.getAddress(store.addressKey);
            return store;
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", StoreCollectionService_1.StoreCollectionService)
], StoreService.prototype, "storeCollectionService", void 0);
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", AddressService_1.AddressService)
], StoreService.prototype, "addressService", void 0);
StoreService = __decorate([
    typedi_1.Service()
], StoreService);
exports.StoreService = StoreService;
//# sourceMappingURL=StoreService.js.map