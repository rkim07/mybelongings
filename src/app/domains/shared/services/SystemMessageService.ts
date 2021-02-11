import * as _ from 'lodash';
import { Service } from 'typedi';
import { VEHICLE_PURCHASE_SERVICE_MESSAGES } from '../../vehicle/services/VehiclePurchaseService';

@Service()
export class SystemMessageService {

    method: string;
    keyMappers: Array<object>;

    /**
     * Handle status code and appropriate error or success messages
     *
     * @param statusCode
     * @param label
     */
    public process(statusCode, label) {
        const statusCodeTypes = {
            200: 'success',
            201: 'success',
            204: 'success',
            400: 'error',
            401: 'error',
            403: 'error',
            404: 'warning',
            409: 'error',
            422: 'warning',
            500: 'error'
        };

        const statusType = statusCodeTypes[statusCode];
        const message = this.messageHandler(statusType, label)

        return [statusType, message];
    }

    /**
     * Handle the right message to the frontend
     *
     * @param statusType
     * @param label
     * @private
     */
    private messageHandler(statusType, label) {
        let msgLabelParts = [];
        let serviceName = '';

        if (label) {
            // Split message name, ex: AUTH_SERVICE_MESSAGES.USER_NOT_FOUND
            msgLabelParts = label.split('.');

            // Split again and get service name
            serviceName = _.camelCase(_(msgLabelParts[0]).split('_').filter(word =>
                word !== 'SERVICE' && word !== 'MESSAGES'
            ).join(' '));
        } else {
            return '';
        }

        const messages = {
            auth: {
                success: {
                    LOGIN: 'User loggen in.',
                    SIGNUP: 'You have successfully submitted all your information. Please check your email in order to finish setting up your account.',
                    ACTIVATED: 'Welcome, your account is ready to use.  Please click the sign in button below to proceed.',
                    ALREADY_ACTIVATED: 'You already activated your account.   Please click the sign in button below to proceed.',
                    RESET: 'Your password has been reset successfully.  Please click the sign in button below to proceed.',
                    LOST: 'Please check your email for further instructions on resetting your password.',
                },
                error: {
                    INVALID_RESET_CODE: 'Your password has already been reset.  If you think this is a mistake on our part, plese contact our administrator to request again.',
                    USERNAME_NOT_FOUND: 'Please enter your credentials again.',
                    INVALID_CREDENTIALS: 'Invalid credentials.',
                    UNACTIVATED_ACCOUNT: 'Account has not been activated.',
                    USER_ALREADY_SIGNED_UP: 'User already registered.',
                    FAILED_ACCOUNT_ACTIVATION: 'Failed to activate the account.',
                    FAILED_RESET_PASSWORD: 'Failed to reset the password.'
                },
                warning: {

                }
            },
            vehicle: {
                success: {
                    NEW: 'Vehicle successfully added.',
                    UPDATED: 'Vehicle successfully updated.',
                    DELETED: 'Vehicle successfully deleted.',
                    EMPTY_LIST: 'There are no vehicles at this time.',
                    USER_VEHICLES_EMPTY_LIST: 'No vehicles were found for the user.'
                },
                error: {
                    VEHICLE_NOT_FOUND: 'User does not have any vehicle at this time.',
                    VEHICLES_NOT_FOUND: 'User does not have any vehicles at this time.',
                    EMPTY_NEW_VEHICLE_INFO: 'You need to provide all the information to add a new vehicle.',
                    EXISTING_VIN: 'VIN already used on another vehicle. Please check your entry'
                },
                warning: {

                }
            },
            vehiclePurchase: {
                success: {
                    ADDED: 'Vehicle purchase information successfully added.'
                },
                error: {
                }
            },
            vehicleApi: {
                success: {
                    SYNC: 'Finished sync successfully.',
                    FETCHED_MFRS: 'Successfully retrieved all manufactures.',
                    FETCHED_MODELS: 'Successfully retrieved all models for a particular manufacturer.'
                },
                error: {
                    VEHICLE_MFRS_NOT_FOUND: 'No manufacturers were found for sync.',
                    VEHICLE_MODELS_NOT_FOUND: 'No models for this particular manufacturer were found.'
                }
            }
        };

        return messages[serviceName][statusType][msgLabelParts[1]];
    }
}
