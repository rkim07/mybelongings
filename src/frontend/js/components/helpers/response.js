import React from 'react';

/**
 * Parse response object to return correct status, type, and message
 *
 * @param response
 * @returns {{statusType: *, responseStatus: string | "rejected" | number | "fulfilled", message, statusCode: *}}
 */
export function parseResponse(response) {
	const statusCodeTypes = {
		200: 'success',
		201: 'success',
		204: 'success',
		400: 'error',
		404: 'warning',
		500: 'error'
	};

	return {
		responseStatus: response.status,
		statusCode: response.data.statusCode,
		statusType: statusCodeTypes[response.data.statusCode],
		message: response.data.message
	}
}
