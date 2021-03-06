import * as _ from 'lodash';
import { Container, Inject, Service } from 'typedi';
import { AddressService } from '../../address/services/AddressService';
import { FileUploadService } from '../../shared/services/FileUploadService';
import { PropertyCollectionService } from './collections/PropertyCollectionService';
import { PropertyAreaService } from "./propertyAreaService";
import { HandleUpstreamError, Key, Property } from '../../shared/models/models';

export enum PROPERTY_SERVICE_MESSAGES {
    PROPERTY_NOT_FOUND = 'PROPERTY_SERVICE_MESSAGES.PROPERTY_NOT_FOUND',
    EMPTY_USER_KEY = 'PROPERTY_SERVICE_MESSAGES.EMPTY_USER_KEY'
}

/**
 * Key values that will be converted
 * both on request and response
 */
export const propertyMappingKeys = {
    date: [
        'created',
        'modified',
    ],
    decimals: [
        'lotSize'
    ],
    stringToNumber: [
        'year'
    ],
    'capitalizedText': [
        'type',
        'style',
        'features',
        'subdivision'
    ]
};

@Service()
export class PropertyService {

    @Inject()
    private addressService: AddressService = Container.get(AddressService);

    @Inject()
    private propertyCollectionService: PropertyCollectionService = Container.get(PropertyCollectionService);

    @Inject()
    private propertyAreaService: PropertyAreaService = Container.get(PropertyAreaService);

    @Inject()
    private fileUploadService: FileUploadService = Container.get(FileUploadService);

    /**
     * Get property by key
     */
    public async getProperty(key: Key, host: string): Promise<any> {
        const property = await this.propertyCollectionService.findOne({ key: { $eq: key }});

        if (!property) {
            throw new HandleUpstreamError(PROPERTY_SERVICE_MESSAGES.PROPERTY_NOT_FOUND);
        }

        return await this.addDependencies(host, property);
    }

    /**
     * Get all properties
     *
     * @param host
     */
    public async getProperties(host: string): Promise<any> {
        const properties = await this.propertyCollectionService.getProperties();

        return await Promise.all(properties.map(async (property) => {
            return await this.addDependencies(host, property);
        }));
    }

    /**
     * Get all properties by user key
     *
     * @param userKey
     * @param host
     */
    public async getUserProperties(userKey: Key, host: string): Promise<any> {
        if (!userKey) {
            throw new HandleUpstreamError(PROPERTY_SERVICE_MESSAGES.EMPTY_USER_KEY);
        }

        const results = await this.propertyCollectionService.find({ userKey: { $eq: userKey }});

        if (!results) {
            throw new HandleUpstreamError(PROPERTY_SERVICE_MESSAGES.PROPERTY_NOT_FOUND);
        }

        const properties = await Promise.all(results.map(async (property) => {
            return await this.addDependencies(host, property);
        }));

        return _.sortBy(properties, o => o.address.street);
    }

    /**
     * Stepper or update property
     *
     * @param host
     * @param body
     */
    public async updateProperty(host: string, body: any): Promise<any> {
        const property = await this.propertyCollectionService.updateProperty(body);
        return await this.addDependencies(host, property);
    }

    /**
     * Stepper dependencies when returning object
     *
     * @param host
     * @param property
     */
    private async addDependencies(host, property) {
        return {
            ...property,
            address: await this.addressService.getAddress(property.addressKey),
            areas: await this.propertyAreaService.getAreasByPropertyKey(property.key, host),
            imagePath: this.fileUploadService.setFilePath(host, property.image)
        };
    }
}
