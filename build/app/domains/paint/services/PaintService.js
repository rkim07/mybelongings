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
exports.PaintService = exports.PAINT_ERRORS = void 0;
const typedi_1 = require("typedi");
const StoreService_1 = require("../../store/services/StoreService");
const PaintCollectionService_1 = require("./PaintCollectionService");
const models_1 = require("../../shared/models/models");
const ImageHelper_1 = require("../../shared/helpers/ImageHelper");
var PAINT_ERRORS;
(function (PAINT_ERRORS) {
    PAINT_ERRORS["PAINT_NOT_FOUND"] = "PAINT_ERRORS.PAINT_NOT_FOUND";
})(PAINT_ERRORS = exports.PAINT_ERRORS || (exports.PAINT_ERRORS = {}));
let PaintService = class PaintService {
    constructor() {
        this.paintCollectionService = typedi_1.Container.get(PaintCollectionService_1.PaintCollectionService);
        this.storeService = typedi_1.Container.get(StoreService_1.StoreService);
    }
    /**
     * Get paint by key
     *
     * @param key
     * @param url
     */
    getPaint(key, url = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const paint = yield this.paintCollectionService.findOne({ key: { $eq: key } });
            if (!paint) {
                throw new models_1.HandleUpstreamError(PAINT_ERRORS.PAINT_NOT_FOUND);
            }
            return yield this.addDependencies(url, paint);
        });
    }
    /**
     * Get all paints
     *
     * @param url
     */
    getPaints(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const paints = yield this.paintCollectionService.getPaints();
            return yield Promise.all(paints.map((paint) => __awaiter(this, void 0, void 0, function* () {
                return yield this.addDependencies(url, paint);
            })));
        });
    }
    /**
     * Get paint by key
     *
     * @param key
     * @param url
     */
    getPaintByKey(key, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const paint = yield this.paintCollectionService.findOne({ key: { $eq: key } });
            return yield this.addDependencies(url, paint);
        });
    }
    /**
     * Add or update paint
     *
     * @param url
     * @param body
     */
    updatePaint(url, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const paint = yield this.paintCollectionService.updatePaint(body);
            return yield this.addDependencies(url, paint);
        });
    }
    /**
     * Add dependencies when returning object
     *
     * @param url
     * @param paint
     */
    addDependencies(url, paint) {
        return __awaiter(this, void 0, void 0, function* () {
            paint['image_path'] = ImageHelper_1.ImageHelper.getImagePath(url, paint.image);
            paint['store'] = paint.storeKey ? yield this.storeService.getStoreByKey(paint.storeKey, url) : {};
            return paint;
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", PaintCollectionService_1.PaintCollectionService)
], PaintService.prototype, "paintCollectionService", void 0);
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", StoreService_1.StoreService)
], PaintService.prototype, "storeService", void 0);
PaintService = __decorate([
    typedi_1.Service()
], PaintService);
exports.PaintService = PaintService;
//# sourceMappingURL=PaintService.js.map