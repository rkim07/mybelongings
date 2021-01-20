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
exports.PropertyAreaService = void 0;
const typedi_1 = require("typedi");
const PaintService_1 = require("../../paint/services/PaintService");
const PropertyAreaCollectionService_1 = require("./PropertyAreaCollectionService");
const ImageHelper_1 = require("../../shared/helpers/ImageHelper");
let PropertyAreaService = class PropertyAreaService {
    constructor() {
        this.propertyAreaCollectionService = typedi_1.Container.get(PropertyAreaCollectionService_1.PropertyAreaCollectionService);
        this.paintService = typedi_1.Container.get(PaintService_1.PaintService);
    }
    /**
     * Get all property areas
     *
     * @param url
     */
    getAreas(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const areas = yield this.propertyAreaCollectionService.getAll();
            return yield Promise.all(areas.map((area) => __awaiter(this, void 0, void 0, function* () {
                return yield this.addDependencies(url, area);
            })));
        });
    }
    /**
     * Get areas by property key
     *
     * @param propertyKey
     * @param url
     */
    getAreasByPropertyKey(propertyKey, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const areas = yield this.propertyAreaCollectionService.find({ propertyKey: { $eq: propertyKey } });
            return yield Promise.all(areas.map((area) => __awaiter(this, void 0, void 0, function* () {
                return yield this.addDependencies(url, area);
            })));
        });
    }
    /**
     * Add or update property area
     *
     * @param url
     * @param body
     */
    updatePropertyArea(url, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const area = yield this.propertyAreaCollectionService.updateArea(body);
            return yield this.addDependencies(url, area);
        });
    }
    /**
     * Add dependencies when returning object
     *
     * @param url
     * @param area
     */
    addDependencies(url, area) {
        return __awaiter(this, void 0, void 0, function* () {
            area['image_path'] = ImageHelper_1.ImageHelper.getImagePath(url, area.image);
            area['paint'] = yield this.paintService.getPaintByKey(area.paintKey, url);
            return area;
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", PropertyAreaCollectionService_1.PropertyAreaCollectionService)
], PropertyAreaService.prototype, "propertyAreaCollectionService", void 0);
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", PaintService_1.PaintService)
], PropertyAreaService.prototype, "paintService", void 0);
PropertyAreaService = __decorate([
    typedi_1.Service()
], PropertyAreaService);
exports.PropertyAreaService = PropertyAreaService;
//# sourceMappingURL=propertyAreaService.js.map