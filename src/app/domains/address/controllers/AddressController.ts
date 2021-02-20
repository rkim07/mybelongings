import { Body, Delete, Get, HttpCode, JsonController, Param, Post, Put, Req, Res } from 'routing-controllers';
import { Container, Inject } from 'typedi';
import { AuthorisedRequest } from '../../shared/interfaces/AuthorisedRequest';
import { Address, HandleUpstreamError, ResponseError } from '../../shared/models/models';
import { ADDRESS_SERVICE_MESSAGES, AddressService } from '../services/AddressService';

const DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE = 'An unexpected error occurred in the address service.';

@JsonController('/address-svc')
export class AddressController {

    @Inject()
    private addressService: AddressService = Container.get(AddressService);

    /**
     * @swagger
     * paths:
     *   /address-svc/addresses/{address_key}:
     *     get:
     *       description: Fetch address by key.
     *       tags:
     *         - Address
     *       security:
     *         - OauthSecurity:
     *           - ROLE_USER
     *       parameters:
     *         - name: Authorization
     *           in: header
     *           description: The JWT token with claims about user.
     *           type: string
     *           required: true
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
    @Get('/addressses/:address_key')
    public async getAddress(@Param('address_key') addressKey: string): Promise<any> {
        try {
            const address = await this.addressService.getAddress(addressKey);

            return {
                payload: address || {},
                statusCode: 200
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case ADDRESS_SERVICE_MESSAGES.ADDRESS_NOT_FOUND:
                        return new ResponseError(404, err.key, '');
                    case ADDRESS_SERVICE_MESSAGES.EMPTY_ADDRESS_KEY:
                        return new ResponseError(500, 'ADDRESS_SERVICE_MESSAGES.DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE', DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, 'ADDRESS_SERVICE_MESSAGES.DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE', DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'ADDRESS_SERVICE_MESSAGES.DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE', DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /address-svc/addresses:
     *     get:
     *       description: Fetch all addresses.
     *       tags:
     *         - Address
     *       security:
     *         - OauthSecurity:
     *           - ROLE_USER
     *       parameters:
     *         - name: Authorization
     *           in: header
     *           description: The JWT token with claims about user.
     *           type: string
     *           required: true
     *       responses:
     *         200:
     *           description: Data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the address service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/addresses')
    public async getAddresses(@Req() { requestor: { userKey }}): Promise<any> {
        try {
            const addresses = await this.addressService.getAddresses();

            return {
                payload: addresses || [],
                statusCode: 200,
                successCode: addresses.length === 0 ? 'ADDRESS_SERVICE_MESSAGES.EMPTY_LIST' : ''
            };
        } catch (err) {
            return new ResponseError(500, 'ADDRESS_SERVICE_MESSAGES.DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE', DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE);
        }
    }

    /**
     * @swagger
     * paths:
     *   /address-svc/address:
     *     post:
     *       description: Add address
     *       tags:
     *          - Address
     *       security:
     *         - OauthSecurity:
     *           - ROLE_USER
     *       parameters:
     *         - name: Authorization
     *           in: header
     *           description: The JWT token with claims about user.
     *           type: string
     *           required: true
     *         - in: body
     *           name: request
     *           description: New address information.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/Address'
     *       responses:
     *         201:
     *           description: Data has been posted successfully.
     *           schema:
     *              $ref: '#/definitions/Address'
     *         422:
     *           description: Restrictions for adding address.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the address service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @HttpCode(201)
    @Post('/address')
    public async postAddress(
        @Req() { requestor: { userKey }}: AuthorisedRequest,
        @Body() body: any
    ): Promise<any> {
        try {
            const address = await this.addressService.addAddress(body);

            return {
                payload: address,
                statusCode: 201,
                successCode: 'ADDRESS_SERVICE_MESSAGES.NEW'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case ADDRESS_SERVICE_MESSAGES.EMPTY_NEW_ADDRESS_INFO:
                        return new ResponseError(422, 'ADDRESS_SERVICE_MESSAGES.DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE', '');
                    case ADDRESS_SERVICE_MESSAGES.ADDRESS_NOT_ADDED:
                        return new ResponseError(500, 'ADDRESS_SERVICE_MESSAGES.DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE', DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, 'ADDRESS_SERVICE_MESSAGES.DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE', DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'ADDRESS_SERVICE_MESSAGES.DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE', DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /address-svc/addresses/{address_key}:
     *     put:
     *       description: Update address.
     *       tags:
     *          - Business
     *       security:
     *         - OauthSecurity:
     *           - ROLE_USER
     *       parameters:
     *         - name: Authorization
     *           in: header
     *           description: The JWT token with claims about user.
     *           type: string
     *           required: true
     *         - name: address_key
     *           in: path
     *           description: The key associated to the address.
     *           type: string
     *           required: true
     *         - in: body
     *           name: request
     *           description: Request with address to be added.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/Business'
     *       responses:
     *         200:
     *           description: The address was updated successfully.
     *           schema:
     *             $ref: '#/definitions/Business'
     *         500:
     *           description: An unexpected error occurred in the seat service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Put('/addresses/:address_key')
    public async putAddress(
        @Req() { requestor: { userKey }}: AuthorisedRequest,
        @Param('address_key') addressKey: string,
        @Body() body: any
    ): Promise<any> {
        try {
            const address = await this.addressService.updateAddress(addressKey, body);

            return {
                payload: address,
                statusCode: 200,
                successCode: 'ADDRESS_SERVICE_MESSAGES.UPDATED'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case ADDRESS_SERVICE_MESSAGES.EMPTY_ADDRESS_KEY:
                        return new ResponseError(500, 'ADDRESS_SERVICE_MESSAGES.DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE', DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE);
                    case ADDRESS_SERVICE_MESSAGES.ADDRESS_NOT_UPDATED:
                        return new ResponseError(500, 'ADDRESS_SERVICE_MESSAGES.DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE', DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, 'ADDRESS_SERVICE_MESSAGES.DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE', DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'ADDRESS_SERVICE_MESSAGES.DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE', DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /address-svc/addresss/{address_key}:
     *     delete:
     *       description: Delete address.
     *       tags:
     *         - Vehicle
     *       security:
     *         - OauthSecurity:
     *           - ROLE_USER
     *       parameters:
     *         - name: Authorization
     *           in: header
     *           description: The JWT token with claims about user.
     *           type: string
     *           required: true
     *         - in: path
     *           name: address_key
     *           description: The key for the current address.
     *           required: true
     *           type: string
     *       responses:
     *         204:
     *           description: The address was removed successfully.
     *         404:
     *           description: No address was found for the address key provided.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the address service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @HttpCode(204)
    @Delete('/addressses/:address_key')
    public async deleteAddress(
        @Req() { requestor: { userKey }}: AuthorisedRequest,
        @Param('address_key') addressKey: string,
        @Res() response: any
    ): Promise<any> {
        try {
            const address = await this.addressService.deleteAddress(addressKey);

            if (address) {
                response.status(200).json({
                    payload: address,
                    statusCode: 204,
                    successCode: 'ADDRESS_SERVICE_MESSAGES.DELETED'
                });
            }
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case ADDRESS_SERVICE_MESSAGES.ADDRESS_NOT_FOUND:
                        return new ResponseError(404, 'ADDRESS_SERVICE_MESSAGES.DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE', DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE);
                    case ADDRESS_SERVICE_MESSAGES.EMPTY_ADDRESS_KEY:
                        return new ResponseError(500, 'ADDRESS_SERVICE_MESSAGES.DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE', DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, 'ADDRESS_SERVICE_MESSAGES.DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE', DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'ADDRESS_SERVICE_MESSAGES.DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE', DEFAULT_ADDRESS_SERVICE_ERROR_MESSAGE);
            }
        }
    }
}
