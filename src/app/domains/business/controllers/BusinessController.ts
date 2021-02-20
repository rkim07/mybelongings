import { Body, Delete, Get, HttpCode, JsonController, Param, Post, Put, Req, Res } from 'routing-controllers';
import { Container, Inject } from 'typedi';
import { AuthorisedRequest } from '../../shared/interfaces/AuthorisedRequest';
import { HandleUpstreamError, Key, ResponseError, Business } from '../../shared/models/models';
import { BUSINESS_SERVICE_MESSAGES, BusinessService } from '../services/BusinessService';

const DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE = 'An unexpected error occurred in the business service.';

@JsonController('/business-svc')
export class BusinessController {

    @Inject()
    private businessService: BusinessService = Container.get(BusinessService);

    /**
     * @swagger
     * paths:
     *   /business-svc/businesses/{business_key}:
     *     get:
     *       description: Fetch a specific business.
     *       tags:
     *         - Business
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
     *           name: business_key
     *           description: The business key being queried.
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: Data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the business service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/businesses/:business_key')
    public async getBusiness(
        @Req() { requestor: { userKey, host }}: AuthorisedRequest,
        @Param('business_key') businessKey: Key
    ): Promise<any> {
        try {
            const business = await this.businessService.getBusiness(businessKey, host);

            return {
                payload: business,
                statusCode: 200
            }
        } catch (err) {
            throw new ResponseError(500, 'BUSINESS_SERVICE_MESSAGES.DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE', DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE);
        }
    }

    /**
     * @swagger
     * paths:
     *   /business-svc/businesses:
     *     get:
     *       description: Fetch all businesses
     *       tags:
     *         - Business
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
     *           description: An unexpected error occurred in the business service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/businesses')
    public async getBusinesses(@Req() { requestor: { userKey, host }}: AuthorisedRequest): Promise<any> {
        try {
            const businesses = await this.businessService.getBusinesses(host);

            return {
                payload: businesses || [],
                statusCode: 200,
                successCode: businesses.length === 0 ? 'BUSINESS_SERVICE_MESSAGES.EMPTY_LIST' : ''
            };
        } catch (err) {
            throw new ResponseError(500, 'BUSINESS_SERVICE_MESSAGES.DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE', DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE);
        }
    }

    /**
     * @swagger
     * paths:
     *   /business-svc/businesses/by/type/{type}:
     *     get:
     *       description: Fetch all businesses by a specific type
     *       tags:
     *         - Business
     *       security:
     *         - OauthSecurity:
     *           - ROLE_USER
     *       parameters:
     *         - name: Authorization
     *           in: header
     *           description: The JWT token with claims about user.
     *           type: string
     *           required: true
     *         - name: type
     *           in: path
     *           description: The type associated to the business.
     *           type: string
     *           required: true
     *       responses:
     *         200:
     *           description: Data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the business service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/businesses/by/type/:type')
    public async getBusinessesByType(
        @Req() { requestor: { userKey, host }}: AuthorisedRequest,
        @Param('type') type: string
    ): Promise<any> {
        try {
            const businesses = await this.businessService.getBusinessesByType(type, host);

            return {
                payload: businesses || [],
                statusCode: 200,
                successCode: businesses.length === 0 ? 'BUSINESS_SERVICE_MESSAGES.BUSINESSES_BY_TYPE_EMPTY_LIST' : ''
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case BUSINESS_SERVICE_MESSAGES.BUSINESSES_BY_TYPE_EMPTY_LIST:
                        return new ResponseError(500, 'BUSINESS_SERVICE_MESSAGES.DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE', DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, 'BUSINESS_SERVICE_MESSAGES.DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE', DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'BUSINESS_SERVICE_MESSAGES.DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE', DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /business-svc/business:
     *     post:
     *       description: Add business
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
     *         - in: body
     *           name: request
     *           description: New business information.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/Business'
     *       responses:
     *         201:
     *           description: Data has been added successfully.
     *           schema:
     *             $ref: '#/definitions/Business'
     *         422:
     *           description: Restrictions for adding business.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the business service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @HttpCode(201)
    @Post('/business')
    public async postBusiness(
        @Req() { requestor: { userKey, host }}: AuthorisedRequest,
        @Body() body: any
    ): Promise<any> {
        try {
            const business = await this.businessService.addBusiness(body, host);

            return {
                payload: business,
                statusCode: 201,
                successCode: 'BUSINESS_SERVICE_MESSAGES.NEW'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case BUSINESS_SERVICE_MESSAGES.EMPTY_NEW_BUSINESS_INFO:
                        return new ResponseError(422, 'BUSINESS_SERVICE_MESSAGES.DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE', '');
                    case BUSINESS_SERVICE_MESSAGES.BUSINESS_NOT_ADDED:
                        return new ResponseError(500, 'BUSINESS_SERVICE_MESSAGES.DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE', DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, 'BUSINESS_SERVICE_MESSAGES.DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE', DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'BUSINESS_SERVICE_MESSAGES.DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE', DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /business-svc/businesses/{business_key}:
     *     put:
     *       description: Update business.
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
     *         - name: business_key
     *           in: path
     *           description: The key associated to the business.
     *           type: string
     *           required: true
     *         - in: body
     *           name: request
     *           description: Request with business to be added.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/Business'
     *       responses:
     *         200:
     *           description: The business was updated successfully.
     *           schema:
     *             $ref: '#/definitions/Business'
     *         500:
     *           description: An unexpected error occurred in the seat service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Put('/businesses/:business_key')
    public async putBusiness(
        @Req() { requestor: { userKey, host }}: AuthorisedRequest,
        @Param('business_key') businessKey: string,
        @Body() body: any
    ): Promise<any> {
        try {
            const business = await this.businessService.updateBusiness(businessKey, body, host);

            return {
                payload: business,
                statusCode: 200,
                successCode: 'BUSINESS_SERVICE_MESSAGES.UPDATED'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case BUSINESS_SERVICE_MESSAGES.EMPTY_BUSINESS_KEY:
                        return new ResponseError(500, 'BUSINESS_SERVICE_MESSAGES.DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE', DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE);
                    case BUSINESS_SERVICE_MESSAGES.BUSINESS_NOT_UPDATED:
                        return new ResponseError(500, 'BUSINESS_SERVICE_MESSAGES.DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE', DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, 'BUSINESS_SERVICE_MESSAGES.DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE', DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'BUSINESS_SERVICE_MESSAGES.DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE', DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE);
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /business-svc/businesses/{business_key}:
     *     delete:
     *       description: Delete business.
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
     *           name: business_key
     *           description: The key for the current business.
     *           required: true
     *           type: string
     *       responses:
     *         204:
     *           description: The business was removed successfully.
     *         404:
     *           description: No business was found for the business key provided.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the business service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @HttpCode(204)
    @Delete('/businesses/:business_key')
    public async deleteBusiness(
        @Req() { requestor: { userKey }}: AuthorisedRequest,
        @Param('business_key') businessKey: string,
        @Res() response: any
    ): Promise<any> {
        try {
            const business = await this.businessService.deleteBusiness(businessKey);

            if (business) {
                response.status(200).json({
                    payload: business,
                    statusCode: 204,
                    successCode: 'BUSINESS_SERVICE_MESSAGES.DELETED'
                });
            }
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case BUSINESS_SERVICE_MESSAGES.BUSINESS_NOT_FOUND:
                        return new ResponseError(404, 'BUSINESS_SERVICE_MESSAGES.DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE', DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE);
                    case BUSINESS_SERVICE_MESSAGES.EMPTY_BUSINESS_KEY:
                        return new ResponseError(500, 'BUSINESS_SERVICE_MESSAGES.DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE', DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE);
                    default:
                        return new ResponseError(500, 'BUSINESS_SERVICE_MESSAGES.DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE', DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, 'BUSINESS_SERVICE_MESSAGES.DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE', DEFAULT_BUSINESS_SERVICE_ERROR_MESSAGE);
            }
        }
    }
}
