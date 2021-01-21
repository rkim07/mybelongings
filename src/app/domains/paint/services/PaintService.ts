import { Container, Inject, Service } from 'typedi';
import { StoreService } from '../../store/services/StoreService';
import { PaintCollectionService } from './PaintCollectionService';
import {HandleUpstreamError, Key, Paint} from '../../shared/models/models';
import { ImageHelper } from "../../shared/helpers/ImageHelper";

export enum PAINT_ERRORS {
    PAINT_NOT_FOUND = 'PAINT_ERRORS.PAINT_NOT_FOUND'
}

@Service()
export class PaintService {

    @Inject()
    private paintCollectionService: PaintCollectionService = Container.get(PaintCollectionService);

    @Inject()
    private storeService: StoreService = Container.get(StoreService);

    /**
     * Get paint by key
     *
     * @param key
     * @param origin
     */
    public async getPaint(key: Key, origin?: string): Promise<any> {
        const paint = await this.paintCollectionService.findOne({ key: { $eq: key }});

        if (!paint) {
            throw new HandleUpstreamError(PAINT_ERRORS.PAINT_NOT_FOUND);
        }

        return await this.addDependencies(origin, paint);
    }

    /**
     * Get all paints
     *
     * @param origin
     */
    public async getPaints(origin: string): Promise<any> {
        const paints = await this.paintCollectionService.getPaints();

        return await Promise.all(paints.map(async (paint) => {
            return await this.addDependencies(origin, paint);
        }));
    }

    /**
     * Get paint by key
     *
     * @param key
     * @param origin
     */
    public async getPaintByKey(key: Key, origin: string): Promise<any> {
        const paint = await this.paintCollectionService.findOne({ key: { $eq: key }});
        return await this.addDependencies(origin, paint);
    }

    /**
     * Add or update paint
     *
     * @param origin
     * @param body
     */
    public async updatePaint(origin: string, body: any): Promise<any> {
        const paint = await this.paintCollectionService.updatePaint(body);
        return await this.addDependencies(origin, paint);
    }

    /**
     * Add dependencies when returning object
     *
     * @param origin
     * @param paint
     */
    private async addDependencies(origin, paint) {
        paint['image_path'] = ImageHelper.getImagePath(origin, paint.image);
        paint['store'] = paint.storeKey ? await this.storeService.getStoreByKey(paint.storeKey, origin) : {};
        return paint;
    }
}
