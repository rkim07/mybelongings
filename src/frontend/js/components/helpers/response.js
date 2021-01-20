import React from 'react';

/**
 * Parse response object to return correct status, type, and message
 *
 * @param response
 * @returns {{statusType: *, message, statusCode: (*|string|"rejected"|number|"fulfilled")}}
 */
export function parseResponse(response) {
	const statusCodes = {
		200: 'success',
		201: 'success',
		204: 'success',
		400: 'error',
		404: 'warning',
		500: 'error'
	};

	// Response data status code will override any
	// other statuses code
	const statusCode = response.data.statusCode ?
		response.data.statusCode :
		response.status

	return {
		statusCode: statusCode,
		statusType: statusCodes[statusCode],
		message: response.data.message
	}
}
