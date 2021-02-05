import { Body, HttpCode, JsonController, Post, Req, UseBefore } from 'routing-controllers';
import { Container, Inject } from 'typedi';
import { logger } from '../../../common/logging';
import { HandleUpstreamError } from '../models/utilities/HandleUpstreamError';
import { ResponseError } from '../models/utilities/ResponseError';
import { EMAIL_SERVICE_ERRORS, EmailService } from '../services/EmailService';

const DEFAULT_EMAIL_SERVICE_ERROR_MESSAGE = 'An unexpected error occurred in the email service.';

@JsonController('/email-svc')
export class EmailController {

    @Inject()
    private emailService: EmailService = Container.get(EmailService);

    /**
     * @swagger
     * paths:
     *   /email-svc/send:
     *     post:
     *       summary: Send email.
     *       description: Send email.
     *       parameters:
     *         - in: body
     *           name: data
     *           description: Email information.
     *           required: true
     *           schema:
     *             $ref: '#/definitions/Email'
     *       responses:
     *         201:
     *           description: Email has been uploaded successfully.
     *         404:
     *           description: Email body not found
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     *         500:
     *           description: An unexpected error occurred in the email service.
     *           schema:
     *             $ref: '#/definitions/ResponseError'
     */
    @HttpCode(201)
    @Post('/send')
    public async sendEmail(@Body() data: any): Promise<any> {
        try {
            const messageId = await this.emailService.send(data);

            return {
                statusCode: 201,
                messageId: messageId,
                message: 'Email successfully sent.'
            };
        } catch (err) {
            if (err instanceof HandleUpstreamError) {
                switch(err.key) {
                    case EMAIL_SERVICE_ERRORS.EMPTY_DATA:
                        return new ResponseError(404, err.key, 'Email data returned empty.');
                    case EMAIL_SERVICE_ERRORS.FAILED_TO_RENDER_TEMPLATE:
                        logger.error('Failed to render template');
                        return new ResponseError(500, err.key, DEFAULT_EMAIL_SERVICE_ERROR_MESSAGE);
                    case EMAIL_SERVICE_ERRORS.EMAIL_TEMPLATE_NAME_NOT_DEFINED:
                        logger.error('Missing email template namne.');
                        return new ResponseError(500, err.key, DEFAULT_EMAIL_SERVICE_ERROR_MESSAGE);
                    case EMAIL_SERVICE_ERRORS.EMAIL_TEMPLATE_TYPE_NOT_DEFINED:
                        logger.error('Missing email template type.');
                        return new ResponseError(500, err.key, DEFAULT_EMAIL_SERVICE_ERROR_MESSAGE);
                    case EMAIL_SERVICE_ERRORS.FAILED_TO_SEND:
                        logger.error(err);
                        return new ResponseError(500, err.key, 'Failed to send.');
                    default:
                        return new ResponseError(500, err.key, DEFAULT_EMAIL_SERVICE_ERROR_MESSAGE);
                }
            } else {
                return new ResponseError(500, err.key, DEFAULT_EMAIL_SERVICE_ERROR_MESSAGE);
            }
        }
    }
}
