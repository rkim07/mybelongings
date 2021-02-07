/**
 * Determine if it's a route that is protected
 *
 * @param url
 * @returns {boolean}
 */
export function routeNeedsAuth(url) {
	// Routes that are protected and already includes
	// authorization header
	const routesToSkip = [
		'/auth-svc/account/refresh'
	];

	// Routes that don't need authorization
	const nonProtectedRoutes = [
		'/auth-svc/account/signin',
		'/auth-svc/account/password/reset/activate',
		'/auth-svc/account/password/reset',
		'/auth-svc/account/activate',
		'/auth-svc/account/signup'
	];

	if (routesToSkip.includes(url)) {
		return false;
	}

	return !nonProtectedRoutes.includes(url);
}

/**
 * Set authentication
 * - Bearer
 * - Basic
 *
 * @param config - object from Axios request interceptor
 * @returns {string}
 */
export function getHeaderAuthorization() {
	return `Bearer ${localStorage.getItem('accessToken')}`;
}

/**
 * Add status type to response data object
 *
 * @param response
 * @returns {*}
 */
export function parseResponse(response) {
	if (!response.data || !response.data.statusCode) {
		response.data = {
			statusType: 'error',
			statusCode: 500,
			status: 500,
			message: 'An unexpected error occurred in the application.'
		}

		return response;
	}

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

	response.data.status = response.status;
	response.data.statusType = statusCodeTypes[response.data.statusCode];

	return response;
}
