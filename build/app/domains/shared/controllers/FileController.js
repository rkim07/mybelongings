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
exports.FileController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const models_1 = require("../models/models");
const FileService_1 = require("../services/FileService");
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + 'src/assets/images');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});
let FileController = class FileController {
    constructor() {
        this.fileService = typedi_1.Container.get(FileService_1.FileService);
    }
    /**
     * @swagger
     * paths:
     *   /file-svc/upload:
     *     post:
     *       summary: Upload file
     *       description: Upload file
     *       consumes:
     *         - multipart/form-data
     *       produces:
     *         - application/json
     *       parameters:
     *         - in: formData
     *           name: file
     *           type: file
     *           description: The file to upload.
     *       responses:
     *         201:
     *           description: File has been uploaded successfully.
     *         500:
     *           description: An unexpected error occurred in the file service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    postFile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.fileService.uploadFile(req.files.file);
            }
            catch (err) {
                throw new models_1.ResponseError(500, err.key, 'An unexpected error occurred in the auth service.');
            }
        });
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", FileService_1.FileService)
], FileController.prototype, "fileService", void 0);
__decorate([
    routing_controllers_1.HttpCode(201),
    routing_controllers_1.Post('/upload'),
    routing_controllers_1.UseBefore(multer({
        storage: storage,
        onFileUploadStart: function (file) {
            console.log(file.originalname + ' is starting ...');
        }
    }).single('file')),
    __param(0, routing_controllers_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "postFile", null);
FileController = __decorate([
    routing_controllers_1.JsonController('/file-svc')
], FileController);
exports.FileController = FileController;
//# sourceMappingURL=FileController.js.map