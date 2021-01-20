import { Body, Get, HttpCode, JsonController, Post, Req, UseBefore } from 'routing-controllers';
import { Container, Inject } from 'typedi';
import { ResponseError } from "../models/models";
import { FileService } from "../services/FileService";

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + 'src/assets/images');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

@JsonController('/file-svc')
export class FileController {

    @Inject()
    private fileService: FileService = Container.get(FileService);

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
    @HttpCode(201)
    @Post('/upload')
    @UseBefore(
        multer({
            storage: storage,
            onFileUploadStart: function (file) {
                console.log(file.originalname + ' is starting ...')
            }
        }).single('file')
    )
    public async postFile(@Req() req: any): Promise<any> {
        try {
            return await this.fileService.uploadFile(req.files.file);
        } catch (err) {
            throw new ResponseError(500, err.key, 'An unexpected error occurred in the auth service.');
        }
    }
}
