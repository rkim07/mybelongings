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
exports.UserService = exports.USER_ERRORS = void 0;
const typedi_1 = require("typedi");
const UserCollectionService_1 = require("./UserCollectionService");
const models_1 = require("../../shared/models/models");
const UtilsHelper_1 = require("../../shared/helpers/UtilsHelper");
var USER_ERRORS;
(function (USER_ERRORS) {
    USER_ERRORS["USER_NOT_FOUND"] = "USER_NOT_FOUND";
})(USER_ERRORS = exports.USER_ERRORS || (exports.USER_ERRORS = {}));
/**
 * @author Ryan Kim
 */
let UserService = class UserService {
    constructor() {
        this.userCollectionService = typedi_1.Container.get(UserCollectionService_1.UserCollectionService);
    }
    /**
     * Get user by key
     *
     * @param url
     * @param key
     */
    getUser(url, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userCollectionService.findOne({ key: { $eq: key } });
            if (!user) {
                throw new models_1.HandleUpstreamError(USER_ERRORS.USER_NOT_FOUND);
            }
            return yield this.addDependencies(url, user);
        });
    }
    /**
     * Get all users
     *
     * @param url
     */
    getUsers(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userCollectionService.getUsers();
            return yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                return yield this.addDependencies(url, user);
            })));
        });
    }
    /**
     * Add dependencies when returning object
     *
     * @param url
     * @param user
     */
    addDependencies(url, user) {
        return __awaiter(this, void 0, void 0, function* () {
            user['image_path'] = UtilsHelper_1.UtilsHelper.getImagePath(url, user.image);
            return user;
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", UserCollectionService_1.UserCollectionService)
], UserService.prototype, "userCollectionService", void 0);
UserService = __decorate([
    typedi_1.Service()
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map