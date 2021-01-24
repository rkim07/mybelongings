import { Body, Get, HttpCode, JsonController, Param, Post, Req } from 'routing-controllers';
import { Container, Inject } from 'typedi';
import { HandleUpstreamError, Property, PropertyArea, ResponseError } from '../../shared/models/models';
import { PROPERTY_SERVICE_ERRORS, PropertyService } from '../services/PropertyService';
import { PropertyAreaService } from '../services/PropertyAreaService';

@JsonController('/property-svc')
export class PropertyController {

    @Inject()
    private propertyService: PropertyService = Container.get(PropertyService);

    @Inject()
    private propertyAreaService: PropertyAreaService = Container.get(PropertyAreaService);

    /**
     * @swagger
     * paths:
     *   property-svc/properties/{property_key}:
     *     get:
     *       summary: Retrieve a specific property.
     *       description: Retrieve a specific property.
     *       parameters:
     *         - in: path
     *           name: property_key
     *           description: The property key being queried.
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: Data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the property service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/properties/:property_key')
    public async getProperty(
        @Req() req: any,
        @Param('property_key') propertyKey: string): Promise<any> {
        try {
            return await this.propertyService.getProperty(propertyKey, req.requestor.referrer);
        } catch (err) {
            throw new ResponseError(500, err.key, 'An unexpected error occurred in the property service.');
        }
    }

    /**
     * @swagger
     * paths:
     *   /property-svc/properties:
     *     get:
     *       summary: Get all properties
     *       description: Get all properties
     *       responses:
     *         200:
     *           description: Data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the property service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */

    @Get('/properties')
    public async getProperties(@Req() req: any): Promise<any> {
        try {

            return await this.propertyService.getProperties(req.requestor.referrer);
        } catch (err) {
            throw new ResponseError(500, err.key, 'An unexpected error occurred in the property service.');
        }
    }

    /**
     * @swagger
     * paths:
     *   /property-svc/properties/user/{user_key}:
     *     get:
     *       summary: Fetch the property of a user by key.
     *       description: Return the property of a user, excluding items.
     *       parameters:
     *         - in: path
     *           name: user_key
     *           description: The key for the current user.
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: Data has been retrieved successfully.
     *           schema:
     *             $ref: '#/definitions/Property'
     *         x-404_NO_PROPERTY_FOUND:
     *           description: No property was found for the user key provided.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the property service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/properties/user/:user_key')
    public async getUserProperties(
        @Req() req: any,
        @Param('user_key') userKey: string): Promise<any> {
        try {
            return await this.propertyService.getUserProperties(userKey, req.requestor.referrer);
        } catch (error) {
            if (error instanceof HandleUpstreamError) {
                switch(error.key) {
                    case PROPERTY_SERVICE_ERRORS.USER_KEY_EMPTY:
                        throw new ResponseError(500, error.key, 'Empty user key provided in order to get property.');
                    case PROPERTY_SERVICE_ERRORS.PROPERTY_NOT_FOUND:
                        throw new ResponseError(404, error.key, 'No property was found for the user key provided.');
                    default:
                        throw new ResponseError(500, error.key, 'An unexpected error occurred in the property service.');
                }
            } else {
                throw new ResponseError(500, error.key, 'An unexpected error occurred in the property service.');
            }
        }
    }

    /**
     * @swagger
     * paths:
     *   /property-svc/property:
     *     post:
     *       summary: Add property
     *       description: Add property
     *       tags:
     *          - Property
     *       parameters:
     *         - in: body
     *           name: request
     *           description: The property information.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/Property'
     *       responses:
     *         201:
     *           description: Data has been posted successfully.
     *           schema:
     *              $ref: '#/definitions/Property'
     *         500:
     *           description: An unexpected error occurred in the property service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @HttpCode(201)
    @Post('/property')
    public async postProperty(
        @Req() req: any,
        @Body() body: any): Promise<any> {
        try {
            return await this.propertyService.updateProperty(req.requestor.referrer, body);
        } catch (err) {
            throw new ResponseError(500, err.key, 'An unexpected error occurred in the property service.');
        }
    }

    /**
     * @swagger
     * paths:
     *   /property-svc/property/area:
     *     post:
     *       summary: Add property area
     *       description: Add property area
     *       tags:
     *          - PropertyArea
     *       parameters:
     *         - in: body
     *           name: request
     *           description: Data has been retrieved successfully.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/PropertyArea'
     *       responses:
     *         201:
     *           description: Property area was successfully added.
     *           schema:
     *              $ref: '#/definitions/PropertyArea'
     *         500:
     *           description: An unexpected error occurred in the property area service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @HttpCode(201)
    @Post('/property/area')
    public async postPropertyArea(
        @Req() req: any,
        @Body() body: any): Promise<any> {
        try {
            return await this.propertyAreaService.updatePropertyArea(req.requestor.referrer, body);
        } catch (err) {
            throw new ResponseError(500, err.key, 'An unexpected error occurred in the property service.');
        }
    }
}
