import * as config from 'config';
import * as fs from 'fs';
import * as path from 'path';
import { Service } from 'typedi';
import { logger } from '../../../common/logging';
import { User } from '../models/domains/User';
import { HandleUpstreamError } from '../models/utilities/HandleUpstreamError';
import { Code } from '../models/utilities/Key';

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
const EMAIL_HOST = config.get('email.host').toString();
const EMAIL_TEMPLATE_PATH = config.get('email.templatePath').toString();
const SYSTEM_AUTH_PASSWORD_RESET_PATH = config.get('system.auth.password.reset.path').toString();
const SYSTEM_AUTH_SIGNUP_VERIFICATION_PATH = config.get('system.auth.signup.verification.path').toString();

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
     * Send signup confirmation email
     *
     * @param user
     */
    public async sendSignupConfirmation(user: User): Promise<any> {
        const htmlData = {
            type: 'html',
            templateName: 'signup',
            body: {
                firstName: user.firstName,
                code: user.signupCode,
                link: this.generateEmailLink(user.email, user.signupCode,'signup')
            }
        };

        const textData = {
            type: 'text',
            templateName: 'signup',
            body: {
                firstName: user.firstName
            }
        };

        const data = {
            email: user.email,
            subject: 'About your MyBelongings sign up',
            html: await this.renderTemplate(htmlData),
            text: await this.renderTemplate(textData)
        }

        await this.send(data);
    }

    /**
     * Send password reset email
     *
     * @param user
     */
    public async sendPasswordReset(user: User): Promise<any> {
        const htmlData = {
            type: 'html',
            templateName: 'password_reset',
            body: {
                firstName: user.firstName,
                code: user.signupCode,
                link: this.generateEmailLink(user.email, user.resetCode, 'password-reset')
            }
        };

        const textData = {
            type: 'text',
            templateName: 'password_reset',
            body: {
                firstName: user.firstName
            }
        };

        const data = {
            email: user.email,
            subject: 'MyBelongings password reset',
            html: await this.renderTemplate(htmlData),
            text: await this.renderTemplate(textData)
        }

        await this.send(data);
    }

    /**
     * Generate email links
     *
     * @param email
     * @param code
     * @param type
     * @private
     */
    private generateEmailLink(email: string, code: Code, type: string): string {
        let path;

        switch(type) {
            case 'signup':
                path = SYSTEM_AUTH_SIGNUP_VERIFICATION_PATH
                break;
            case 'password-reset':
                path = SYSTEM_AUTH_PASSWORD_RESET_PATH
                break;
        }

        return `${EMAIL_HOST}/${path}/${email}/${code}`;
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
