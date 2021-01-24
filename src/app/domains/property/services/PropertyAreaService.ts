import { Container, Inject, Service } from 'typedi';
import { PaintService} from "../../paint/services/PaintService";
import { FileUploadService } from '../../shared/services/FileUploadService';
import { PropertyAreaCollectionService } from "./PropertyAreaCollectionService";
import { Key, Property, PropertyArea } from '../../shared/models/models';

@Service()
export class PropertyAreaService {

    @Inject()
    private propertyAreaCollectionService: PropertyAreaCollectionService = Container.get(PropertyAreaCollectionService);

    @Inject()
    private paintService: PaintService = Container.get(PaintService);

    @Inject()
    private fileUploadService: FileUploadService = Container.get(FileUploadService);

    /**
     * Get all property areas
     *
     * @param origin
     */
    public async getAreas(origin: string): Promise<Property[]> {
        const areas = await this.propertyAreaCollectionService.getAll();

        return await Promise.all(areas.map(async (area) => {
            return await this.addDependencies(origin, area);
        }));
    }

    /**
     * Get areas by property key
     *
     * @param propertyKey
     * @param origin
     */
    public async getAreasByPropertyKey(propertyKey: Key, origin: string): Promise<PropertyArea[]> {
        const areas = await this.propertyAreaCollectionService.find({ propertyKey: { $eq: propertyKey }});

        return await Promise.all(areas.map(async (area) => {
            return await this.addDependencies(origin, area);
        }));
    }

    /**
     * Add or update property area
     *
     * @param origin
     * @param body
     */
    public async updatePropertyArea(origin: string, body: any): Promise<PropertyArea> {
        const area = await this.propertyAreaCollectionService.updateArea(body);
        return await this.addDependencies(origin, area);
    }

    /**
     * Add dependencies when returning object
     *
     * @param origin
     * @param area
     */
    private async addDependencies(origin, area) {
        area['image_path'] = this.fileUploadService.setImagePath(origin, area.image, 'area');
        area['paint'] = await this.paintService.getPaintByKey(area.paintKey, origin);
        return area;
    }
}
