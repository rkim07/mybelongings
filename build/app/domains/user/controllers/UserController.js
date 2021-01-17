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
exports.UserController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const UserService_1 = require("../services/UserService");
const models_1 = require("../../shared/models/models");
let UserController = class UserController {
    constructor() {
        this.userService = typedi_1.Container.get(UserService_1.UserService);
    }
    /**
     * @swagger
     * paths:
     *   /user-svc/users:
     *     get:
     *       summary: Get all users.
     *       description: Retrieve users data from manufacturer implemented API.
     *       responses:
     *         200:
     *           description: User data has been retrieved successfully.
     *           schema:
     *             $ref: '#/definitions/User'
     *
     *         500:
     *           description: An unexpected error occurred in the user service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    getUsers(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userService.getUsers(req.requestor.referrer);
            }
            catch (err) {
                throw new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the auth service.');
            }
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", UserService_1.UserService)
], UserController.prototype, "userService", void 0);
__decorate([
    routing_controllers_1.Get('/users'),
    __param(0, routing_controllers_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
UserController = __decorate([
    routing_controllers_1.JsonController('/user-svc')
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map