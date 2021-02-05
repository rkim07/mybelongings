import { Body, Get, HttpCode, JsonController, Param, Post, Req } from 'routing-controllers';
import { Container, Inject } from 'typedi';
import { Key, ResponseError, Paint } from '../../shared/models/models';
import { PaintService } from '../services/PaintService';

@JsonController('/paint-svc')
export class PaintController {

    @Inject()
    private paintService: PaintService = Container.get(PaintService);

    /**
     * @swagger
     * paths:
     *   /paint-svc/paints/{paint_key}:
     *     get:
     *       summary: Retrieve a specific paint.
     *       description: Retrieve a specific paint.
     *       parameters:
     *         - in: path
     *           name: paint_key
     *           description: The paint key being queried.
     *           required: true
     *           type: string
     *       responses:
     *         200:
     *           description: Data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the paint service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/paints/:paint_key')
    public async getPaint(
        @Req() req: any,
        @Param('paint_key') paintKey: string): Promise<any> {
        try {
            return await this.paintService.getPaint(paintKey, req.requestor.referrer);
        } catch (err) {
            throw new ResponseError(500, err.key, 'An unexpected error occurred in the paint service.');
        }
    }

    /**
     * @swagger
     * paths:
     *   /paint-svc/paints:
     *     get:
     *       summary: Get all paints
     *       description: Get all paints
     *       responses:
     *         200:
     *           description: Data has been retrieved successfully.
     *         500:
     *           description: An unexpected error occurred in the paint service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @Get('/paints')
    public async getPaints(@Req() req: any): Promise<any> {
        try {
            return await this.paintService.getPaints(req.requestor.referrer);
        } catch (err) {
            throw new ResponseError(500, err.key, 'An unexpected error occurred in the paint service.');
        }
    }

    /**
     * @swagger
     * paths:
     *   /paint-svc/paint:
     *     post:
     *       summary: Add paint
     *       description: Add paint
     *       tags:
     *          - Paint
     *       parameters:
     *         - in: body
     *           name: request
     *           description: The paint to be associated to the property areas.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/Paint'
     *       responses:
     *         201:
     *           description: Data has been posted successfully.
     *           schema:
     *              $ref: '#/definitions/Paint'
     *         500:
     *           description: An unexpected error occurred in the paint service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @HttpCode(201)
    @Post('/paint')
    public async postPaint(
        @Req() req: any,
        @Body() body: any): Promise<any> {
        try {
            return await this.paintService.updatePaint(req.requestor.referrer, body);
        } catch (err) {
            throw new ResponseError(500, err.key, 'An unexpected error occurred in the paint service.');
        }
    }
}
