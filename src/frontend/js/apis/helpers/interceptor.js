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
