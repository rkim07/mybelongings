import * as fs from 'fs';
import { Service } from 'typedi';
import { HandleUpstreamError } from '../models/utilities/HandleUpstreamError';
import { File } from '../interfaces/File';

export enum FILE_UPLOAD_SERVICE_ERRORS {
    FILE_NOT_FOUND = 'FILE_UPLOAD_SERVICE_ERRORS.FILE_NOT_FOUND',
    EMPTY_FILE_NAME = 'FILE_UPLOAD_SERVICE_ERRORS.EMPTY_FILE_NAME'
}

const SOURCE_PATH = 'src/assets/images';
const BUILD_PATH = 'build/assets/images';

@Service()
export class FileUploadService {

    /**
     * Upload file
     *
     * @param file
     */
    public async uploadFile(file: File): Promise<string> {
        if (!file) {
            throw new HandleUpstreamError(FILE_UPLOAD_SERVICE_ERRORS.FILE_NOT_FOUND);
        }

        const fileName = file.originalname;
        const tmpPath = file.path;

        fs.copyFileSync(tmpPath, `${SOURCE_PATH}/${fileName}`);
        fs.copyFileSync(tmpPath, `${BUILD_PATH}/${fileName}`);

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

        fs.unlinkSync(`${SOURCE_PATH}/${fileName}`);
        fs.unlinkSync(`${BUILD_PATH}/${fileName}`);

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
}
