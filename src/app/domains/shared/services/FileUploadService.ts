import * as fs from 'fs';
import { Service } from 'typedi';
import { HandleUpstreamError } from '../models/utilities/HandleUpstreamError';
import { File } from '../interfaces/File';

export enum FILE_SERVICE_UPLOAD_ERRORS {
    FILE_NOT_FOUND = 'FILE_SERVICE_UPLOAD_ERRORS.FILE_NOT_FOUND',
    EMPTY_FILE_NAME = 'FILE_SERVICE_UPLOAD_ERRORS.EMPTY_FILE_NAME'
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
            throw new HandleUpstreamError(FILE_SERVICE_UPLOAD_ERRORS.FILE_NOT_FOUND);
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
     * Set image path, if file is missing, it will set a default one
     *
     * @param origin
     * @param image
     * @param type
     */
    public setImagePath(origin: string, image: string, type: string): string {
        if (origin === '' || type === '') {
            return '';
        }

        const noPicImages = {
            vehicle: 'no_pic_vehicle.jpg',
            property: 'no_pic_property.png',
            user: '',
            paint: '',
            area: ''
        }

        return image !== ''? `${origin}/${image}` : `${origin}/${noPicImages[type]}`;
    }
}
