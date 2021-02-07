import { Container, Inject, Service } from 'typedi';
import { PaintService } from "../../paint/services/PaintService";
import { FileUploadService } from '../../shared/services/FileUploadService';
import { PropertyAreaCollectionService } from "./collections/PropertyAreaCollectionService";
import { Key, Property, PropertyArea } from '../../shared/models/models';

/**
 * Key values that will be converted
 * both on request and response
 */
export const propertyAreaMappingKeys = {
    date: [
        'created',
        'modified',
        'painted'
    ],
    decimals: [
        'sqFt'
    ],
    capitalizedText: [
        'name',
        'location'
    ]
};

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
     * @param host
     */
    public async getAreas(host: string): Promise<Property[]> {
        const areas = await this.propertyAreaCollectionService.getAll();

        return await Promise.all(areas.map(async (area) => {
            return await this.addDependencies(host, area);
        }));
    }

    /**
     * Get areas by property key
     *
     * @param propertyKey
     * @param host
     */
    public async getAreasByPropertyKey(propertyKey: Key, host: string): Promise<PropertyArea[]> {
        const areas = await this.propertyAreaCollectionService.find({ propertyKey: { $eq: propertyKey }});

        return await Promise.all(areas.map(async (area) => {
            return await this.addDependencies(host, area);
        }));
    }

    /**
     * Add or update property area
     *
     * @param host
     * @param body
     */
    public async updatePropertyArea(host: string, body: any): Promise<PropertyArea> {
        const area = await this.propertyAreaCollectionService.updateArea(body);
        return await this.addDependencies(host, area);
    }

    /**
     * Add dependencies when returning object
     *
     * @param host
     * @param area
     */
    private async addDependencies(host, area) {
        area = { ...area, imagePath: this.fileUploadService.setImagePath(host, area.image) };
        area = { ...area, paint: await this.paintService.getPaintByKey(area.paintKey, host) };

        return area;
    }
}
