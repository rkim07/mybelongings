import * as _ from 'lodash';
import lost from "../../domains/auth/lost";

/**
 * Display custom error message in frontend
 *
 * @param statusType
 * @param serverMsg
 * @param msgName
 * @returns {*|string}
 */
export function messageHandler(statusType, serverMsg, msgName) {
	let errorCodeParts = [];

	if (msgName) {
		// Split message name, ex: AUTH_SERVICE_MESSAGES.USER_NOT_FOUND
		msgNameParts = msgName.split('.');

		// Split again and get service name
		serviceNameParts = msgNameParts[0].split('_');
	} else {
		return _.isEmpty(serverMsg) ? serverMsg : 'We apologize but we cannot process your request at this moment.';
	}

	const messages = {
		auth: {
			success: {
				LOGIN: 'User loggen in.',
				SIGNUP: 'You have successfully submitted all your information. Please check your email in order to finish setting up your account.',
				ACTIVATED: `Welcome, your account is ready to use.  Please click the login button below to proceed.`,
				ALREADY_ACTIVATED: 'You already activated your account.   Please click the login button below to proceed.',
				RESET: 'Your password has been reset successfully.  Please click the login button below to proceed.',
				LOST: 'Please check your email for further instructions on resetting your password.',
			},
			error: {
				INVALID_RESET_CODE: 'Your password has already been reset.  If you think this is a mistake on our part, plese contact our administrator to request again.',
				USERNAME_NOT_FOUND: 'Please enter your credentials again.',
				INVALID_CREDENTIALS: 'Invalid credentials.',
				UNACTIVATED_ACCOUNT: 'Account has not been activated.',
				USER_ALREADY_SIGNED_UP: 'User already registered.',
				FAILED_ACCOUNT_ACTIVATION: 'Failed to activate the account.',
				FAILED_RESET_PASSWORD: 'Failed to reset the password.',
				DEFAULT_ERROR_MESSAGE: serverMsg
			},
			warning: {

			}
		},
		vehicle: {
			success: {
				NEW: 'Vehicle successfully added.',
				UPDATE: 'Vehicle successfully updated.'
			},
			error: {
				VEHICLE_NOT_FOUND: 'User does not have any vehicle at this time.',
				VEHICLES_NOT_FOUND: 'User does not have any vehicles at this time.',
				EMPTY_NEW_VEHICLE_INFO: 'You need to provide all the information to add a new vehicle.',
				EXISTING_VIN: 'VIN already used on another vehicle. Please check your entry',
				DEFAULT_ERROR_MESSAGE: serverMsg
			},
			warning: {

			}
		}
	};

	return messages[serviceNameParts[0]][statusType][msgNameParts[1]];
}

/**
 * Return message throughout application
 * Ability to swap message handler
 *
 * @param statusType
 * @param serverMsg
 * @param msgName
 * @returns {*|string}
 */
export function getMessage(statusType, serverMsg, msgName) {
	return messageHandler(statusType, serverMsg, msgName);
}
