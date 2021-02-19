import { Body, Get, HttpCode, JsonController, Param, Post, Req, Res, UseBefore } from 'routing-controllers';
import { Container, Inject } from 'typedi';
import { logger } from '../../../common/logging';
import { AuthorisedRequest } from '../interfaces/AuthorisedRequest';
import { HandleUpstreamError, ResponseError } from '../models/models';
import { FILE_UPLOAD_SERVICE_MESSAGES, FileUploadService } from '../services/FileUploadService';

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

const DEFAULT_FILE_UPLOAD_SERVICE_ERROR_MESSAGE = 'An unexpected error occurred in the file upload service.';

@JsonController('/file-upload-svc')
export class FileUploadController {

    @Inject()
    private fileUploadService: FileUploadService = Container.get(FileUploadService);

    /**
     * @swagger
     * paths:
     *   /file-upload-svc/upload:
     *     post:
     *       description: Upload file.
     *       consumes:
     *         - multipart/form-data
     *       produces:
     *         - application/json
     *       security:
     *         - OauthSecurity:
     *           - ROLE_USER
     *       parameters:
     *         - name: Authorization
     *           in: header
     *           description: The JWT token with claims about user.
     *           type: string
     *           required: true
     *         - in: formData
     *           name: file
     *           type: file
     *           description: The file to upload.
     *       responses:
     *         201:
     *           description: File has been uploaded successfully.
     *         404:
     *           description: No vehicles found for user key provided.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
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
    public async uploadFile(@Req() req: any): Promise<any> {
        try {
            const fileName = await this.fileUploadService.uploadFile(req.files.file);

            return {
                payload: fileName,
                statusCode: 201,
                message: 'File successfully uploaded.'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case FILE_UPLOAD_SERVICE_MESSAGES.FILE_NOT_FOUND:
                        return new ResponseError(404, err.key, 'The file you are trying to upload cannot be found.');
                    case FILE_UPLOAD_SERVICE_MESSAGES.EMPTY_FILE_NAME:
                        return new ResponseError(404, err.key, 'Cannot find file name to delete.');
                    default:
                        return new ResponseError(500, err.key, DEFAULT_FILE_UPLOAD_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, err.key, DEFAULT_FILE_UPLOAD_SERVICE_ERROR_MESSAGE);
            }
        }
    }
}
