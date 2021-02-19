import * as fs from 'fs';
import * as path from 'path';
import * as config from 'config';
import * as _ from 'lodash';
import { Service } from 'typedi';
import { HandleUpstreamError } from '../models/utilities/HandleUpstreamError';
import { File } from '../interfaces/File';

export enum FILE_UPLOAD_SERVICE_MESSAGES {
    FILE_NOT_FOUND = 'FILE_UPLOAD_SERVICE_MESSAGES.FILE_NOT_FOUND',
    EMPTY_FILE_NAME = 'FILE_UPLOAD_SERVICE_MESSAGES.EMPTY_FILE_NAME'
}

const IMAGES_SOURCE_PATH = config.get('assets.path.source.images').toString();
const IMAGES_BUILD_PATH = config.get('assets.path.build.images').toString();
const FILES_SOURCE_PATH = config.get('assets.path.source.files').toString();
const FILES_BUILD_PATH = config.get('assets.path.source.files').toString();

@Service()
export class FileUploadService {

    /**
     * Upload file
     *
     * @param file
     */
    public async uploadFile(file: File): Promise<string> {
        const fileName = file.originalname;
        const tmpPath = file.path;

        const [sourcePath, buildPath] = this.getPaths(fileName);

        fs.copyFileSync(tmpPath, `${sourcePath}/${fileName}`);
        fs.copyFileSync(tmpPath, `${buildPath}/${fileName}`);

        return fileName;
    }

    /**
     * Remove file from source and build directories
     *
     * @param fileName
     */
    public async removeFile(fileName): Promise<boolean> {
        if (fileName === '') {
            return true;
        }

        const [sourcePath, buildPath] = this.getPaths(fileName);

        fs.unlinkSync(`${sourcePath}/${fileName}`);
        fs.unlinkSync(`${buildPath}/${fileName}`);

        return true;
    }

    /**
     * Set image path, if file is missing, just return host
     *
     * @param image
     * @param host
     * @param type
     */
    public setImagePath(image: string, host?: string): string {
        if (host === '') {
            return '';
        }

        return image !== '' ? `${host}/${image}` : `${host}`;
    }

    /**
     * Set file path other than images
     *
     * @param file
     * @param host
     */
    public setFilePath(file: string, host?: string) {
        if (host === '') {
            return '';
        }

        const dir = this.getFileType(file);
        const filePath = file !== '' ? `${host}/${dir}/${file}` : `${host}`;
        const extension = path.extname(file);

        return [ filePath, extension ];
    }

    /**
     * Get source and build paths
     *
     * @param file
     * @private
     */
    private getPaths(fileName) {
        const fileType = _.upperCase(this.getFileType(fileName));
        const sourcePath = eval(`${fileType}_SOURCE_PATH`);
        const buildPath = eval(`${fileType}_BUILD_PATH`);

        return [sourcePath, buildPath]
    }

    /**
     * Get file type, 'files' or 'images'
     *
     * @param file
     * @private
     */
    private getFileType(file) {
        const fileExtension = path.extname(file);

        const extensions = {
            images: ['.jpg', '.jpeg', '.png', '.ico'],
            files: ['.pdf']
        };

        let type = '';
        _.forIn(extensions, (values, key) => {
           if (_.includes(values, fileExtension)) {
               type = key;
           }
        });

        return type;
    }
}
