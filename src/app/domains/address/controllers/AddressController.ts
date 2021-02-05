import { Body, Get, HttpCode, JsonController, Param, Post, Req } from 'routing-controllers';
import { Container, Inject } from 'typedi';
import { Address, ResponseError } from '../../shared/models/models';
import { AddressService } from '../services/AddressService';

@JsonController('/address-svc')
export class AddressController {

    @Inject()
    private addressService: AddressService = Container.get(AddressService);

    /**
     * @swagger
     * paths:
     *   /address-svc/addresses/{address_key}:
     *     get:
     *       summary: Retrieve a specific address.
     *       description: Retrieve a specific address.
     *       parameters:
     *         - in: path
     *           name: address_key
     *           description: The address key being queried.
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: Data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the address service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/addresss/:address_key')
    public async getAddress(
        @Param('address_key') addressKey: string,
        @Req() req: any): Promise<Address> {
        try {
            return await this.addressService.getAddress(addressKey, req.requestor.referrer);
        } catch (err) {
            throw new ResponseError(500, err.key, 'An unexpected error occurred in the address service.');
        }
    }

    /**
     * @swagger
     * paths:
     *   /address-svc/addresses:
     *     get:
     *       deprecated: true
     *       summary: Get all addresses
     *       description: Get all addresses
     *       responses:
     *         200:
     *           description: Data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the address service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/addresses')
    public async getAddresses(): Promise<Address[]> {
        try {
            return await this.addressService.getAddresses();
        } catch (err) {
            throw new ResponseError(500, err.key, 'An unexpected error occurred in the auth service.');
        }
    }

    /**
     * @swagger
     * paths:
     *   /address-svc/address:
     *     post:
     *       summary: Add address
     *       description: Add address
     *       tags:
     *          - Address
     *       parameters:
     *         - in: body
     *           name: request
     *           description: Address data has been retrieved successfully.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/Address'
     *       responses:
     *         201:
     *           description: Data has been posted successfully.
     *           schema:
     *              $ref: '#/definitions/Address'
     *         500:
     *           description: An unexpected error occurred in the address service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @HttpCode(201)
    @Post('/address')
    public async postAddress(@Body() body: any): Promise<Address> {
        try {
            return await this.addressService.updateAddress(body);
        } catch (err) {
            throw new ResponseError(500, err.key, 'An unexpected error occurred in the auth service.');
        }
    }
}
