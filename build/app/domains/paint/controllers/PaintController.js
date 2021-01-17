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
exports.PaintController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const models_1 = require("../../shared/models/models");
const PaintService_1 = require("../services/PaintService");
let PaintController = class PaintController {
    constructor() {
        this.paintService = typedi_1.Container.get(PaintService_1.PaintService);
    }
    /**
     * @swagger
     * paths:
     *   paint-svc/paints/{paint_key}:
     *     get:
     *       summary: Retrieve a specific paint.
     *       description: Retrieve a specific paint.
     *       parameters:
     *         - in: path
     *           name: paint_key
     *           description: The paint key being queried.
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: DB data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the paint service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    getPaint(req, paintKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.paintService.getPaint(paintKey, req.requestor.referrer);
            }
            catch (err) {
                throw new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the paint service.');
            }
        });
    }
    /**
     * @swagger
     * paths:
     *   /paint-svc/paints:
     *     get:
     *       summary: Get all paints
     *       description: Get all paints
     *       responses:
     *         200:
     *           description: DB data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the paint service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    getPaints(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.paintService.getPaints(req.requestor.referrer);
            }
            catch (err) {
                throw new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the paint service.');
            }
        });
    }
    /**
     * @swagger
     * paths:
     *   /paint-svc/paint:
     *     post:
     *       summary: Add paint
     *       description: Add paint
     *       tags:
     *          - Paint
     *       parameters:
     *         - in: body
     *           name: request
     *           description: The paint to be associated to the property areas.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/Paint'
     *       responses:
     *         201:
     *           description: DB data has been posted successfully.
     *           schema:
     *              $ref: '#/definitions/Paint'
     *         500:
     *           description: An unexpected error occurred in the paint service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    postPaint(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.paintService.updatePaint(req.requestor.referrer, body);
            }
            catch (err) {
                throw new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the paint service.');
            }
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", PaintService_1.PaintService)
], PaintController.prototype, "paintService", void 0);
__decorate([
    routing_controllers_1.Get('/paints/:paint_key'),
    __param(0, routing_controllers_1.Req()),
    __param(1, routing_controllers_1.Param('paint_key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaintController.prototype, "getPaint", null);
__decorate([
    routing_controllers_1.Get('/paints'),
    __param(0, routing_controllers_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaintController.prototype, "getPaints", null);
__decorate([
    routing_controllers_1.HttpCode(201),
    routing_controllers_1.Post('/paint'),
    __param(0, routing_controllers_1.Req()),
    __param(1, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaintController.prototype, "postPaint", null);
PaintController = __decorate([
    routing_controllers_1.JsonController('/paint-svc')
], PaintController);
exports.PaintController = PaintController;
//# sourceMappingURL=PaintController.js.map