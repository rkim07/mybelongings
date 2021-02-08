import { Container, Inject, Service } from 'typedi';
import { FileUploadService } from '../../shared/services/FileUploadService';
import { StoreService } from '../../store/services/StoreService';
import { PaintCollectionService } from './PaintCollectionService';
import { HandleUpstreamError, Key, Paint } from '../../shared/models/models';

export enum PAINT_SERVICE_MESSAGES {
    PAINT_NOT_FOUND = 'PAINT_SERVICE_MESSAGES.PAINT_NOT_FOUND'
}

/**
 * Key values that will be converted
 * both on request and response
 */
export const paintMappingKeys = {
    date: [
        'created',
        'modified'
    ],
    capitalizedText: [
        'name',
        'finish',
        'color',
        'country',
        'usage'
    ],
    upperText: [
        'number',
        'hex',
        'rbg',
        'lrv'
    ],
};

@Service()
export class PaintService {

    @Inject()
    private paintCollectionService: PaintCollectionService = Container.get(PaintCollectionService);

    @Inject()
    private storeService: StoreService = Container.get(StoreService);

    @Inject()
    private fileUploadService: FileUploadService = Container.get(FileUploadService);

    /**
     * Get paint by key
     *
     * @param key
     * @param host
     */
    public async getPaint(key: Key, host?: string): Promise<any> {
        const paint = await this.paintCollectionService.findOne({ key: { $eq: key }});

        if (!paint) {
            throw new HandleUpstreamError(PAINT_SERVICE_MESSAGES.PAINT_NOT_FOUND);
        }

        return await this.addDependencies(host, paint);
    }

    /**
     * Get all paints
     *
     * @param host
     */
    public async getPaints(host: string): Promise<any> {
        const paints = await this.paintCollectionService.getPaints();

        return await Promise.all(paints.map(async (paint) => {
            return await this.addDependencies(host, paint);
        }));
    }

    /**
     * Get paint by key
     *
     * @param key
     * @param host
     */
    public async getPaintByKey(key: Key, host: string): Promise<any> {
        const paint = await this.paintCollectionService.findOne({ key: { $eq: key }});
        return await this.addDependencies(host, paint);
    }

    /**
     * Add or update paint
     *
     * @param host
     * @param body
     */
    public async updatePaint(host: string, body: any): Promise<any> {
        const paint = await this.paintCollectionService.updatePaint(body);
        return await this.addDependencies(host, paint);
    }

    /**
     * Add dependencies when returning object
     *
     * @param host
     * @param paint
     */
    private async addDependencies(host, paint) {
        paint = { ...paint, imagePath: this.fileUploadService.setImagePath(host, paint.image) };
        paint = { ...paint, store: paint.storeKey ? await this.storeService.getStoreByKey(paint.storeKey, host) : {} };

        return paint;
    }
}
