import { Container, Inject, Service } from 'typedi';
import { PaintService} from "../../paint/services/PaintService";
import { PropertyAreaCollectionService } from "./PropertyAreaCollectionService";
import { Key, Property, PropertyArea } from '../../shared/models/models';
import { ImageHelper } from "../../shared/helpers/ImageHelper";

@Service()
export class PropertyAreaService {

    @Inject()
    private propertyAreaCollectionService: PropertyAreaCollectionService = Container.get(PropertyAreaCollectionService);

    @Inject()
    private paintService: PaintService = Container.get(PaintService);

    /**
     * Get all property areas
     *
     * @param url
     */
    public async getAreas(url: string): Promise<Property[]> {
        const areas = await this.propertyAreaCollectionService.getAll();

        return await Promise.all(areas.map(async (area) => {
            return await this.addDependencies(url, area);
        }));
    }

    /**
     * Get areas by property key
     *
     * @param propertyKey
     * @param url
     */
    public async getAreasByPropertyKey(propertyKey: Key, url: string): Promise<PropertyArea[]> {
        const areas = await this.propertyAreaCollectionService.find({ propertyKey: { $eq: propertyKey }});

        return await Promise.all(areas.map(async (area) => {
            return await this.addDependencies(url, area);
        }));
    }

    /**
     * Add or update property area
     *
     * @param url
     * @param body
     */
    public async updatePropertyArea(url: string, body: any): Promise<PropertyArea> {
        const area = await this.propertyAreaCollectionService.updateArea(body);
        return await this.addDependencies(url, area);
    }

    /**
     * Add dependencies when returning object
     *
     * @param url
     * @param area
     */
    private async addDependencies(url, area) {
        area['image_path'] = ImageHelper.getImagePath(url, area.image);
        area['paint'] = await this.paintService.getPaintByKey(area.paintKey, url);
        return area;
    }
}
