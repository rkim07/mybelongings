import * as _ from 'lodash';
import { Container, Inject, Service } from 'typedi';
import { AddressService } from '../../address/services/AddressService';
import { PropertyCollectionService } from './PropertyCollectionService';
import { PropertyAreaService } from "./propertyAreaService";
import { HandleUpstreamError, Key, Property } from '../../shared/models/models';
import { ImageHelper } from "../../shared/helpers/ImageHelper";

export enum PROPERTY_ERRORS {
    PROPERTY_NOT_FOUND = 'PROPERTY_ERRORS.PROPERTY_NOT_FOUND',
    USER_KEY_EMPTY = 'PROPERTY_ERRORS.USER_KEY_EMPTY'
}

@Service()
export class PropertyService {

    @Inject()
    private addressService: AddressService = Container.get(AddressService);

    @Inject()
    private propertyCollectionService: PropertyCollectionService = Container.get(PropertyCollectionService);

    @Inject()
    private propertyAreaService: PropertyAreaService = Container.get(PropertyAreaService);

    /**
     * Get property by key
     */
    public async getProperty(key: Key, origin: string): Promise<any> {
        const property = await this.propertyCollectionService.findOne({ key: { $eq: key }});

        if (!property) {
            throw new HandleUpstreamError(PROPERTY_ERRORS.PROPERTY_NOT_FOUND);
        }

        return await this.addDependencies(origin, property);
    }

    /**
     * Get all properties
     *
     * @param origin
     */
    public async getProperties(origin: string): Promise<any> {
        const properties = await this.propertyCollectionService.getProperties();

        return await Promise.all(properties.map(async (property) => {
            return await this.addDependencies(origin, property);
        }));
    }

    /**
     * Get all properties by user key
     *
     * @param userKey
     * @param origin
     */
    public async getUserProperties(userKey: Key, origin: string): Promise<any> {
        if (!userKey) {
            throw new HandleUpstreamError(PROPERTY_ERRORS.USER_KEY_EMPTY);
        }

        const results = await this.propertyCollectionService.find({ userKey: { $eq: userKey }});

        if (!results) {
            throw new HandleUpstreamError(PROPERTY_ERRORS.PROPERTY_NOT_FOUND);
        }

        const properties = await Promise.all(results.map(async (property) => {
            return await this.addDependencies(origin, property);
        }));

        return _.sortBy(properties, o => o.address.street);
    }

    /**
     * Add or update property
     *
     * @param origin
     * @param body
     */
    public async updateProperty(origin: string, body: any): Promise<any> {
        const property = await this.propertyCollectionService.updateProperty(body);
        return await this.addDependencies(origin, property);
    }

    /**
     * Add dependencies when returning object
     *
     * @param origin
     * @param property
     */
    private async addDependencies(origin, property) {
        property['image_path'] = ImageHelper.getImagePath(origin, property.image);
        property['address'] = await this.addressService.getAddress(property.addressKey);
        property['areas'] = await this.propertyAreaService.getAreasByPropertyKey(property.key, origin);

        return property;
    }
}
