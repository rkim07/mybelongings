import * as fs from 'fs';
import { Service } from 'typedi';
import { HandleUpstreamError } from "../models/utilities/HandleUpstreamError";
import { File } from "../interfaces/File";

export enum FILE_ERRORS {
    FILE_NOT_FOUND = 'FILE_ERRORS.FILE_NOT_FOUND',
    EMPTY_FILE_NAME = 'FILE_ERRORS.EMPTY_FILE_NAME'
}

const SOURCE_PATH = 'src/assets/images';
const BUILD_PATH = 'build/assets/images';

@Service()
export class FileService {

    /**
     * Upload file
     *
     * @param file
     */
    public async uploadFile(file: File): Promise<any> {
        if (!file) {
            throw new HandleUpstreamError(FILE_ERRORS.FILE_NOT_FOUND);
        }

        const fileName = file.originalname;
        const tmpPath = file.path;

        fs.copyFileSync(tmpPath, `${SOURCE_PATH}/${fileName}`);
        fs.copyFileSync(tmpPath, `${BUILD_PATH}/${fileName}`);

        return {
            fileName: fileName
        };
    }

    /**
     * Remove file from source and build directories
     *
     * @param fileName
     */
    public async removeFile(fileName): Promise<any> {
        if (fileName) {
            fs.unlinkSync(`${SOURCE_PATH}/${fileName}`);
            fs.unlinkSync(`${BUILD_PATH}/${fileName}`);
        }

        return true;
    }
}
