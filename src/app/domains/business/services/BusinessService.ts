import * as _ from 'lodash';
import { Container, Inject, Service } from 'typedi';
import { AddressService } from '../../address/services/AddressService';
import { VEHICLE_SERVICE_MESSAGES } from '../../vehicle/services/VehicleService';
import { BusinessCollectionService } from './collections/BusinessCollectionService';
import { HandleUpstreamError, Key, Business, Address } from '../../shared/models/models';

export enum BUSINESS_SERVICE_MESSAGES {
    BUSINESS_NOT_FOUND = 'BUSINESS_SERVICE_MESSAGES.BUSINESS_NOT_FOUND',
    BUSINESS_NOT_ADDED = 'BUSINESS_SERVICE_MESSAGES.BUSINESS_NOT_ADDED',
    BUSINESS_NOT_UPDATED = 'BUSINESS_SERVICE_MESSAGES.BUSINESS_NOT_UPDATED',
    EMPTY_BUSINESS_KEY = 'BUSINESS_SERVICE_MESSAGES.EMPTY_BUSINESS_KEY',
    EMPTY_NEW_BUSINESS_INFO = 'BUSINESS_SERVICE_MESSAGES.EMPTY_NEW_BUSINESS_INFO',
    BUSINESSES_BY_TYPE_EMPTY_LIST = 'BUSINESS_SERVICE_MESSAGES.BUSINESSES_BY_TYPE_EMPTY_LIST'
}

/**
 * Key values that will be converted
 * both on request and response
 */
export const businessMappingKeys = {
    capitalizedText: [
        'name',
        'salesPerson',
        'type',
        'customName'
    ],
    phone: [
        'landline',
        'mobile'
    ],
    date: [
        'created',
        'modified'
    ]
};

@Service()
export class BusinessService {

    @Inject()
    private businessCollectionService: BusinessCollectionService = Container.get(BusinessCollectionService);

    @Inject()
    private addressService: AddressService = Container.get(AddressService);

    /**
     * Get business by key
     *
     * @param businessKey
     * @param host
     */
    public async getBusiness(businessKey: Key, host?: string): Promise<any> {
        if (!businessKey) {
            throw new HandleUpstreamError(BUSINESS_SERVICE_MESSAGES.EMPTY_BUSINESS_KEY);
        }

        const business = await this.businessCollectionService.findOne({ key: { $eq: businessKey }});

        if (!business) {
            return {};
        }

        return await this.addFetchDependencies(business, host);
    }

    /**
     * Get all business
     *
     * @param host
     */
    public async getBusinesses(host?: string): Promise<any> {
        const businesses = await this.businessCollectionService.getAll();

        if (businesses.length === 0) {
            return [];
        }

        return await Promise.all(businesses.map(async (business) => {
            return await this.addFetchDependencies(business, host);
        }));
    }

    /**
     * Get all business by type
     *
     * @param type
     * @param host
     */
    public async getBusinessesByType(type: string, host?: string): Promise<any> {
        if (!type) {
            throw new HandleUpstreamError(BUSINESS_SERVICE_MESSAGES.BUSINESSES_BY_TYPE_EMPTY_LIST);
        }

        const business = await this.businessCollectionService.find({ type: { $eq: type }});

        if (business.length === 0) {
            return [];
        }

        return await Promise.all(business.map(async (business) => {
            return await this.addFetchDependencies(business, host);
        }));
    }

    /**
     * Add business
     *
     * @param business
     * @param host
     */
    public async addBusiness(business: any, host?: string): Promise<any> {
        if (!business) {
            throw new HandleUpstreamError(BUSINESS_SERVICE_MESSAGES.EMPTY_NEW_BUSINESS_INFO);
        }

        let addedAddress = {};
        if (!_.isEmpty(business.address)) {
            addedAddress = await this.addressService.addAddress(business.address);
            business.addressKey = addedAddress['key'] || '';
        }

        const addedBusiness = await this.businessCollectionService.add(business);

        if (!addedBusiness) {
            throw new HandleUpstreamError(BUSINESS_SERVICE_MESSAGES.BUSINESS_NOT_ADDED);
        }

        return await this.addCrudDependecies(addedBusiness, addedAddress);
    }

    /**
     * Update business
     *
     * @param businessKey
     * @param business
     * @param host
     */
    public async updateBusiness(businessKey: Key, business: any, host?: string): Promise<any> {
        if (!businessKey) {
            throw new HandleUpstreamError(BUSINESS_SERVICE_MESSAGES.EMPTY_BUSINESS_KEY);
        }

        let updatedAddress = {};
        if (!_.isEmpty(business.address)) {
            updatedAddress = await this.addressService.updateAddress(business.address.key, business.address);
        }

        const updatedBusiness = await this.businessCollectionService.update(businessKey, business);

        if (!updatedBusiness) {
            throw new HandleUpstreamError(BUSINESS_SERVICE_MESSAGES.BUSINESS_NOT_UPDATED);
        }

        return await this.addCrudDependecies(updatedBusiness, updatedAddress);
    }

    /**
     * Delete business
     *
     * @param businessKey
     */
    public async deleteBusiness(businessKey: Key): Promise<any> {
        if (!businessKey) {
            throw new HandleUpstreamError(BUSINESS_SERVICE_MESSAGES.EMPTY_BUSINESS_KEY);
        }

        const business: Address = await this.businessCollectionService.findOne({ key: { $eq: businessKey } });

        if (!business) {
            throw new HandleUpstreamError(BUSINESS_SERVICE_MESSAGES.BUSINESS_NOT_FOUND);
        }

        await this.businessCollectionService.removeByFieldValue('key', businessKey);

        return business;
    }

    /**
     * Fetch dependencies when returning object.
     * Minimize DB fetches
     *
     * @param host
     * @param vehicle
     * @private
     */
    private async addFetchDependencies(business: any, host?: string): Promise<any> {
        const address = await this.addressService.getAddress(business.addressKey);

        return {
            ...business,
            customName: this.getBusinessCustomName(business, address),
            address: address };
    }

    /**
     * CRUD dependencies when returning object.
     * Minimize DB fetches
     *
     * @param vehicle
     * @param purchase
     * @param finance
     * @param insurance
     * @param host
     * @private
     */
    private async addCrudDependecies(business: any, address: any, host?: string): Promise<any> {
        return {
            ...business,
            customName: this.getBusinessCustomName(business, address),
            address: address };
    }

    /**
     * Name that will be shown in dropdown selection.
     * Depending of business type, name will be shown differently
     *
     * @param business
     * @param address
     * @private
     */
    private getBusinessCustomName(business: any, address?: any): string {
        let customName = `${business.name}, ${address.street}, ${address.city}, ${address.state}, ${address.zip}`;

        if (business.type === 'dealership') {
            customName = `${business.name} - ${address.city}`
        }

        return customName;
    }
}
