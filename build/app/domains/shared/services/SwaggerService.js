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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerService = void 0;
const fs = require("fs");
const path = require("path");
const typedi_1 = require("typedi");
let SwaggerService = class SwaggerService {
    constructor() {
        const spath = path.resolve('./spec.json');
        const file = fs.readFileSync(spath, 'utf8');
        this.spec = JSON.parse(file);
    }
    getSwaggerSpec() {
        return this.spec;
    }
};
SwaggerService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], SwaggerService);
exports.SwaggerService = SwaggerService;
//# sourceMappingURL=SwaggerService.js.map