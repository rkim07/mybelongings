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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const typedi_1 = require("typedi");
const JWTHelper_1 = require("../../shared/helpers/JWTHelper");
const UserCollectionService_1 = require("../../user/services/UserCollectionService");
const bcrypt = require('bcrypt');
let AuthService = AuthService_1 = class AuthService {
    constructor() {
        this.userCollectionService = typedi_1.Container.get(UserCollectionService_1.UserCollectionService);
    }
    /**
     * Login user
     *
     * @param body
     */
    login(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userCollectionService.find({ username: { $eq: body.username } });
            if (!user) {
                return {
                    msg: 'Incorrect username or password'
                };
            }
            const userData = {
                'userKey': user[0].key,
                'firstName': user[0].firstName,
                'lastName': user[0].lastName,
                'email': user[0].email
            };
            // Decrypt encrypted password and compare with plain text password
            const match = bcrypt.compareSync(body.password, user[0].password);
            if (match) {
                return {
                    token: AuthService_1.signJwtToken(user[0]),
                    user: userData
                };
            }
            else {
                return {
                    msg: 'Incorrect username or password'
                };
            }
        });
    }
    /**
     * Register new user
     *
     * @param body
     */
    register(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userCollectionService.find({ email: { $eq: body.email } });
            if (user) {
                return {
                    msg: 'User already registered'
                };
            }
            // Add new user
            const newUser = yield this.userCollectionService.updateUser(body);
            return {
                token: AuthService_1.signJwtToken(newUser)
            };
        });
    }
    /**
     * Refresh token
     *
     * @param body
     */
    refreshToken(body) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /**
     * Sign JWT token
     *
     * @param user
     */
    static signJwtToken(user) {
        // Hide properties from JWT token
        delete user.intr_type;
        delete user.username;
        delete user.password;
        return JWTHelper_1.JWTHelper.signToken(user);
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", UserCollectionService_1.UserCollectionService)
], AuthService.prototype, "userCollectionService", void 0);
AuthService = AuthService_1 = __decorate([
    typedi_1.Service()
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map