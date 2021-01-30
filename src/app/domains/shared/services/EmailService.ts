import * as config from 'config';
import * as fs from 'fs';
import * as path from 'path';
import { Service } from 'typedi';
import { logger } from '../../../common/logging';
import { HandleUpstreamError } from '../models/utilities/HandleUpstreamError';

const nodemailer = require('nodemailer');
const ejs = require('ejs');

export enum EMAIL_SERVICE_ERRORS {
    EMPTY_DATA = 'EMAIL_SERVICE_ERRORS.EMPTY_DATA',
    EMPTY_FILE_NAME = 'EMAIL_SERVICE_ERRORS.EMPTY_FILE_NAME',
    FAILED_TO_SEND = 'EMAIL_SERVICE_ERRORS.FAILED_TO_SEND',
    FAILED_TO_RENDER_TEMPLATE = 'EMAIL_SERVICE_ERRORS.FAILED_TO_RENDER_TEMPLATE',
    EMAIL_TEMPLATE_NAME_NOT_DEFINED = 'EMAIL_SERVICE_ERRORS.EMAIL_TEMPLATE_NAME_NOT_DEFINED',
    EMAIL_TEMPLATE_TYPE_NOT_DEFINED = 'EMAIL_SERVICE_ERRORS.EMAIL_TEMPLATE_TYPE_NOT_DEFINED'
}

const ADMIN_EMAIL = config.get('nodemailer.adminEmail').toString();
const HOST = config.get('nodemailer.host').toString();
const PORT = config.get('nodemailer.port');
const SECURE = config.get('nodemailer.secure');
const ADMIN_USERNAME = config.get('nodemailer.user').toString();
const ADMIN_PASSWORD = config.get('nodemailer.pass').toString();
const EMAIL_TEMPLATE_PATH = config.get('email.templatePath').toString();

@Service()
export class EmailService {

    /**
     * Send email
     *
     * @param data
     */
    public async send(data: any): Promise<any> {
        if (!data) {
            throw new HandleUpstreamError(EMAIL_SERVICE_ERRORS.EMPTY_DATA);
        }

        // Setup delivery
        const delivery = {
            from: ADMIN_EMAIL,
            to: data.email,
            subject: data.subject,
            text: data.text,
            html: data.html,
        }

        // Setup transporter for nodemailer
        const transporter = nodemailer.createTransport({
            port: PORT,
            host: HOST,
            auth: {
                user: ADMIN_USERNAME,
                pass: ADMIN_PASSWORD
            }
        });

        return new Promise (resolve => {
            transporter.sendMail(delivery, (err, info) => {
                if (err) {
                    throw new HandleUpstreamError(EMAIL_SERVICE_ERRORS.FAILED_TO_SEND)
                }

                resolve(info.messageId);
            });
        });
    }

    /**
     * Render text or html template for
     * specific type of email
     *
     * @param data
     * @private
     */
    public renderTemplate(data: any): Promise<any> {
        if (!data.templateName) {
            throw new HandleUpstreamError(EMAIL_SERVICE_ERRORS.EMAIL_TEMPLATE_NAME_NOT_DEFINED);
        }

        if (!data.type) {
            throw new HandleUpstreamError(EMAIL_SERVICE_ERRORS.EMAIL_TEMPLATE_TYPE_NOT_DEFINED);
        }

        const templatePath = path.join(__dirname, EMAIL_TEMPLATE_PATH);
        const template = `${templatePath}/${data.type}/${data.templateName}.ejs`;

        return new Promise (resolve => {
            ejs.renderFile(template, { body: data.body }, (err, result) => {
                if (err) {
                    console.log(err);
                    throw new HandleUpstreamError(EMAIL_SERVICE_ERRORS.FAILED_TO_RENDER_TEMPLATE);
                }

                resolve(result);
            });
        });
    }
}
