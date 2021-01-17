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
exports.AuthController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const models_1 = require("../../shared/models/models");
const AuthService_1 = require("../services/AuthService");
let AuthController = class AuthController {
    constructor() {
        this.authService = typedi_1.Container.get(AuthService_1.AuthService);
    }
    /**
     * @swagger
     * paths:
     *   /auth-svc/login:
     *     post:
     *       summary: Login user.
     *       description: Login user
     *       tags:
     *          - Auth
     *       parameters:
     *         - in: body
     *           name: login
     *           description: The username and password.
     *           required: false
     *           schema:
     *             type: object
     *             properties:
     *              username:
     *                type: string
     *              password:
     *                type: string
     *       responses:
     *         201:
     *           description: DB data has been posted successfully.
     *           schema:
     *             $ref: '#/definitions/User'
     *         500:
     *           description: An unexpected error occurred in the auth service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    loginUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.authService.login(body);
            }
            catch (error) {
                throw new models_1.ResponseError(500, error.key, 'An unexpected error occurred in the auth service.');
            }
        });
    }
    /**
     * @swagger
     * paths:
     *   /auth-svc/register:
     *     post:
     *       summary: Register user.
     *       description: Register user
     *       tags:
     *          - Auth
     *       parameters:
     *         - in: body
     *           name: request
     *           description: The user info.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/User'
     *       responses:
     *         201:
     *           description: DB data has been posted successfully.
     *           schema:
     *             $ref: '#/definitions/User'
     *         500:
     *           description: An unexpected error occurred in the auth service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    register(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.authService.register(body);
            }
            catch (error) {
                throw new models_1.ResponseError(500, error.key, 'An unexpected error occurred in the auth service.');
            }
        });
    }
    refreshToken(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.authService.refreshToken(body);
            }
            catch (error) {
                throw new models_1.ResponseError(500, error.key, 'An unexpected error occurred in the auth service.');
            }
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", AuthService_1.AuthService)
], AuthController.prototype, "authService", void 0);
__decorate([
    routing_controllers_1.HttpCode(201),
    routing_controllers_1.Post('/login'),
    __param(0, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginUser", null);
__decorate([
    routing_controllers_1.HttpCode(201),
    routing_controllers_1.Post('/register'),
    __param(0, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    routing_controllers_1.HttpCode(201),
    routing_controllers_1.Post('/refresh'),
    __param(0, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
AuthController = __decorate([
    routing_controllers_1.JsonController('/auth-svc')
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map