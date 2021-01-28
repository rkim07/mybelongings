import { refreshAccessToken } from '../auth';

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
 * Refresh token when access token is expired
 * Functionality will only be used on response interceptors
 *
 * @param interceptor - Axios interceptor name
 * @param err - object from Axios response interceptor
 * @param requests - empty array, set before response interceptor call
 * @param isRefreshing - false boolean, set before response interceptor call
 * @returns {Promise<unknown>|Promise<void>|*}
 */
export function refreshToken(interceptor, err, requests, isRefreshing) {
	const { config, response } = err;

	if (response.status === 401) {
		console.info('Access token has expired.  Attempting to refresh the token...');
		return refreshAccessToken().then(res => {
			// Refresh token is expired as well at this point.  Force user to
			// login again to get new access and refresh tokens
			if (res.data.expiredRefreshToken) {
				console.error('Both access and refresh tokens have expired.');
				console.info('Redirecting user to login again.');
				localStorage.removeItem('accessToken');
				window.location.href = '/login'
			} else {
				// Replace original token with refreshed token
				console.info('Access token has been refreshed.');
				config.headers.Authorization = getHeaderAuthorization();

				// Token has been refreshed to retry requests from all queues
				requests.forEach(cb => cb(token))
				{
					requests = []
					return interceptor(config);
				}
			}
		}).catch(res => {
			// System crashed somehow.  Force use to login again.
			console.error('An unexpected error occurred while trying to refresh the token.');
			localStorage.removeItem('accessToken');
			window.location.href = '/login'
		}).finally(() => {
			isRefreshing = false
		});
	}

	return response
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
		404: 'warning',
		422: 'warning',
		500: 'error'
	};

	response.data['status'] = response.status;
	response.data['statusType'] = statusCodeTypes[response.data.statusCode];
	return response;
}
