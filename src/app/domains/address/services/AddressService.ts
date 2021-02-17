import { Container, Inject, Service } from 'typedi';
import { AddressCollectionService } from './AddressCollectionService';
import { Address, HandleUpstreamError, Key } from '../../shared/models/models';

export enum ADDRESS_SERVICE_MESSAGES {
    ADDRESS_NOT_FOUND = 'ADDRESS_SERVICE_MESSAGES.ADDRESS_NOT_FOUND'
}

/**
 * Key values that will be converted
 * both on request and response
 */
export const addressMappingKeys = {
    date: [
        'created',
        'modified'
    ],
    capitalizedText: [
        'street',
        'city',
        'county',
        'country'
    ],
    upperText: [
      'state'
    ],
    phone: [
        'landline',
        'mobile'
    ]
};

@Service()
export class AddressService {

    @Inject()
    private addressCollectionService: AddressCollectionService = Container.get(AddressCollectionService);

    /**
     * Get address by key
     *
     * @param key
     * @param origin
     */
    public async getAddress(key: Key, origin?: string): Promise<Address> {
        const address = await this.addressCollectionService.findOne({ key: { $eq: key }});

        if (!address) {
            throw new HandleUpstreamError(ADDRESS_SERVICE_MESSAGES.ADDRESS_NOT_FOUND);
        }

        return address
    }

    /**
     * Get all addresses
     */
    public async getAddresses(): Promise<Address[]> {
        return await this.addressCollectionService.getAll();
    }

    /**
     * Stepper or update address
     *
     * @param body
     */
    public async updateAddress(body: any): Promise<Address> {
        return await this.addressCollectionService.updateAddress(body);
    }
}
