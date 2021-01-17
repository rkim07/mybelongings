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
exports.AddressService = exports.ADDRESS_ERRORS = void 0;
const typedi_1 = require("typedi");
const AddressCollectionService_1 = require("./AddressCollectionService");
const models_1 = require("../../shared/models/models");
var ADDRESS_ERRORS;
(function (ADDRESS_ERRORS) {
    ADDRESS_ERRORS["ADDRESS_NOT_FOUND"] = "ADDRESS_ERRORS.ADDRESS_NOT_FOUND";
})(ADDRESS_ERRORS = exports.ADDRESS_ERRORS || (exports.ADDRESS_ERRORS = {}));
let AddressService = class AddressService {
    constructor() {
        this.addressCollectionService = typedi_1.Container.get(AddressCollectionService_1.AddressCollectionService);
    }
    /**
     * Get address by key
     *
     * @param key
     * @param url
     */
    getAddress(key, url = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield this.addressCollectionService.findOne({ key: { $eq: key } });
            if (!address) {
                throw new models_1.HandleUpstreamError(ADDRESS_ERRORS.ADDRESS_NOT_FOUND);
            }
            return address;
        });
    }
    /**
     * Get all addresses
     */
    getAddresses() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.addressCollectionService.getAll();
        });
    }
    /**
     * Add or update address
     *
     * @param body
     */
    updateAddress(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.addressCollectionService.updateAddress(body);
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", AddressCollectionService_1.AddressCollectionService)
], AddressService.prototype, "addressCollectionService", void 0);
AddressService = __decorate([
    typedi_1.Service()
], AddressService);
exports.AddressService = AddressService;
//# sourceMappingURL=AddressService.js.map