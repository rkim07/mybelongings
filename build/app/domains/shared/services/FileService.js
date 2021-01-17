"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.FileService = exports.FILE_ERRORS = void 0;
const fs = require("fs");
const typedi_1 = require("typedi");
const HandleUpstreamError_1 = require("../models/utilities/HandleUpstreamError");
var FILE_ERRORS;
(function (FILE_ERRORS) {
    FILE_ERRORS["FILE_NOT_FOUND"] = "FILE_ERRORS.FILE_NOT_FOUND";
    FILE_ERRORS["EMPTY_FILE_NAME"] = "FILE_ERRORS.EMPTY_FILE_NAME";
})(FILE_ERRORS = exports.FILE_ERRORS || (exports.FILE_ERRORS = {}));
const SOURCE_PATH = 'src/assets/images';
const BUILD_PATH = 'build/assets/images';
let FileService = class FileService {
    /**
     * Upload file
     *
     * @param file
     */
    uploadFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file) {
                throw new HandleUpstreamError_1.HandleUpstreamError(FILE_ERRORS.FILE_NOT_FOUND);
            }
            const fileName = file.originalname;
            const tmpPath = file.path;
            fs.copyFileSync(tmpPath, `${SOURCE_PATH}/${fileName}`);
            fs.copyFileSync(tmpPath, `${BUILD_PATH}/${fileName}`);
            return {
                fileName: fileName
            };
        });
    }
    /**
     * Remove file from source and build directories
     *
     * @param fileName
     */
    removeFile(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fileName) {
                throw new HandleUpstreamError_1.HandleUpstreamError(FILE_ERRORS.EMPTY_FILE_NAME);
            }
            fs.unlinkSync(`${SOURCE_PATH}/${fileName}`);
            fs.unlinkSync(`${BUILD_PATH}/${fileName}`);
            return true;
        });
    }
};
FileService = __decorate([
    typedi_1.Service()
], FileService);
exports.FileService = FileService;
//# sourceMappingURL=FileService.js.map