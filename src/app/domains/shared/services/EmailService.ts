import * as config from 'config';
import * as fs from 'fs';
import { Service } from 'typedi';
import { logger } from '../../../common/logging';
import { HandleUpstreamError } from '../models/utilities/HandleUpstreamError';

const nodemailer = require('nodemailer');

export enum EMAIL_SERVICE_ERRORS {
    EMPTY_BODY = 'EMAIL_SERVICE_ERRORS.EMPTY_BODY',
    EMPTY_FILE_NAME = 'EMAIL_SERVICE_ERRORS.EMPTY_FILE_NAME',
    FAILED_TO_SEND = 'EMAIL_SERVICE_ERRORS.FAILED_TO_SEND'
}

const ADMIN_EMAIL = config.get('email.config.adminEmail').toString();
const HOST = config.get('email.config.host').toString();
const PORT = config.get('email.config.port');
const SECURE = config.get('email.config.secure');
const ADMIN_USERNAME = config.get('email.config.username').toString();
const ADMIN_PASSWORD = config.get('email.config.password');

@Service()
export class EmailService {

    /**
     * Send email
     *
     * @param data
     */
    public async send(data: any): Promise<any> {
        if (!data) {
            throw new HandleUpstreamError(EMAIL_SERVICE_ERRORS.EMPTY_BODY);
        }

        const transporter = this.getTransporter();

        const mailData = {
            from: ADMIN_EMAIL,
            to: data.to,
            subject: data.subject,
            text: data.text,
            html: data.html
        }

        await transporter.sendMail(mailData, (err, info) => {
            if (err) {
                throw new HandleUpstreamError(EMAIL_SERVICE_ERRORS.FAILED_TO_SEND)
            }

            return info.messageId;
        });
    }

    /**
     * Set nodemailer transporter
     *
     * @private
     */
    private getTransporter() {
        return nodemailer.createTransport({
            port: PORT,
            host: HOST,
            secure: SECURE,
            auth: {
                user: ADMIN_USERNAME,
                pass: ADMIN_PASSWORD
            }
        });
    }
}
