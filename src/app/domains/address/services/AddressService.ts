import { Container, Inject, Service } from 'typedi';
import { AddressCollectionService } from './AddressCollectionService';
import { Address, HandleUpstreamError, Key } from '../../shared/models/models';

export enum ADDRESS_ERRORS {
    ADDRESS_NOT_FOUND = 'ADDRESS_ERRORS.ADDRESS_NOT_FOUND'
}

@Service()
export class AddressService {

    @Inject()
    private addressCollectionService: AddressCollectionService = Container.get(AddressCollectionService);

    /**
     * Get address by key
     *
     * @param key
     * @param url
     */
    public async getAddress(key: Key, url: string = null): Promise<Address> {
        const address = await this.addressCollectionService.findOne({ key: { $eq: key }});

        if (!address) {
            throw new HandleUpstreamError(ADDRESS_ERRORS.ADDRESS_NOT_FOUND);
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
     * Add or update address
     *
     * @param body
     */
    public async updateAddress(body: any): Promise<Address> {
        return await this.addressCollectionService.updateAddress(body);
    }
}
