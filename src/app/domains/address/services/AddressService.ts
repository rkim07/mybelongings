import { Container, Inject, Service } from 'typedi';
import { VEHICLE_SERVICE_MESSAGES } from '../../vehicle/services/VehicleService';
import { AddressCollectionService } from './AddressCollectionService';
import { Address, HandleUpstreamError, Key } from '../../shared/models/models';

export enum ADDRESS_SERVICE_MESSAGES {
    EMPTY_ADDRESS_KEY = 'ADDRESS_SERVICE_MESSAGES.EMPTY_ADDRESS_KEY',
    ADDRESS_NOT_FOUND = 'ADDRESS_SERVICE_MESSAGES.ADDRESS_NOT_FOUND',
    EMPTY_NEW_ADDRESS_INFO = 'ADDRESS_SERVICE_MESSAGES.EMPTY_NEW_ADDRESS_INFO',
    ADDRESS_NOT_ADDED = 'ADDRESS_SERVICE_MESSAGES.ADDRESS_NOT_ADDED',
    ADDRESS_NOT_UPDATED = 'ADDRESS_SERVICE_MESSAGES.ADDRESS_NOT_UPDATED'
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
     * @param addressKey
     */
    public async getAddress(addressKey: Key): Promise<any> {
        if (!addressKey) {
            return {};
        }

        const address = await this.addressCollectionService.findOne({ key: { $eq: addressKey }});

        return address
    }

    /**
     * Get all addresses
     */
    public async getAddresses(): Promise<any> {
        const addresses =  await this.addressCollectionService.getAll();

        if (addresses.length === 0) {
            return [];
        }

        return addresses;
    }

    /**
     * Add address
     * 
     * @param address
     */
    public async addAddress(address: any): Promise<any> {
        if (!address) {
            throw new HandleUpstreamError(ADDRESS_SERVICE_MESSAGES.EMPTY_NEW_ADDRESS_INFO);
        }

        const addedAddress = await this.addressCollectionService.add(address);

        if (!addedAddress) {
            throw new HandleUpstreamError(ADDRESS_SERVICE_MESSAGES.ADDRESS_NOT_ADDED);
        }
        
        return addedAddress;
    }

    /**
     * Update address
     *
     * @param addressKey
     * @param address
     */
    public async updateAddress(addressKey: Key, address: any): Promise<any> {
        if (!addressKey) {
            throw new HandleUpstreamError(ADDRESS_SERVICE_MESSAGES.EMPTY_ADDRESS_KEY);
        }

        const updatedaddress = await this.addressCollectionService.update(addressKey, address);

        if (!updatedaddress) {
            throw new HandleUpstreamError(ADDRESS_SERVICE_MESSAGES.ADDRESS_NOT_UPDATED);
        }

        return updatedaddress;
    }

    /**
     * Delete address
     *
     * @param addressKey
     */
    public async deleteAddress(addressKey: Key): Promise<any> {
        if (!addressKey) {
            throw new HandleUpstreamError(ADDRESS_SERVICE_MESSAGES.EMPTY_ADDRESS_KEY);
        }

        const address: Address = await this.addressCollectionService.findOne({ key: { $eq: addressKey } });

        if (!address) {
            throw new HandleUpstreamError(ADDRESS_SERVICE_MESSAGES.ADDRESS_NOT_FOUND);
        }

        await this.addressCollectionService.removeByFieldValue('key', addressKey);

        return address;
    }
}
