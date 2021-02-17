import axios from 'axios';
import { getHeaderAuthorization } from './helpers/interceptor';

/**
 * Signup new user
 *
 * @param formData
 * @returns {Promise<T>}
 */
export function signup(formData) {
	return axios
		.post('/auth-svc/account/signup', formData)
		.then((response) => {
			if (response.status < 400) {
				return response.data;
			}

			return response;
		})
		.catch((err) => {
			return err;
		});
}

/**
 * Login
 *
 * @param formData
 * @returns {Promise<T>}
 */
export function signin(formData) {
	// Remove existing tokens.  Do not need to remove from server
	// since it will be updated automatically with new ones
	if (localStorage.getItem('accessToken') !== '') {
		localStorage.removeItem('accessToken');
	}

	if (localStorage.getItem('refreshToken') !== '') {
		localStorage.removeItem('refreshToken');
	}

	const refreshToken = localStorage.getItem('refreshToken');
	return axios
		.post('/auth-svc/account/signin', formData)
		.then((response) => {
			const { data } = response;
			data.redirect = false;

			if (data.statusCode < 400) {
				localStorage.setItem('accessToken', data.accessToken);
				localStorage.setItem('refreshToken', data.refreshToken);

				data.redirect = true;
			}

			return data;
		})
		.catch((err) => {
			return err;
		});
}

/**
 * Logout user.  Remove refresh token saved in DB.
 * Remove both access and refresh token from local
 * storage
 *
 * @returns {*}
 */
export function signout() {
	return axios
		.get('/auth-svc/account/signout')
		.then((response) => {
			if (response.data.statusCode < 400) {
				localStorage.removeItem('accessToken');
				localStorage.removeItem('refreshToken');
			}

			return response;
		})
		.catch((err) => {
			return err;
		});
}

/**
 * Refresh access token once is expired.  Sends refresh token due
 * to longer longevity than access token.  Fetch new access token
 *
 * @returns {*}
 */
export function refreshAccessToken() {
	return axios
		.get('/auth-svc/account/refresh', {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
			}
		})
		.then((response) => {
			const { data } = response;
			if (data.statusCode < 400) {
				localStorage.setItem('accessToken', data.accessToken);

				return response;
			}
		})
		.catch((err) => {
			data['err'] = err;

			return data;
		});
}

/**
 * Reset password
 *
 * @param formData
 * @returns {Promise<T>}
 */
export function resetPassword(formData) {
	return axios
		.post('/auth-svc/account/password/reset', formData)
		.then((response) => {
			if (response.status < 400) {
				return response.data;
			}

			return response;
		})
		.catch((err) => {
			return err;
		});
}

/**
 * Activate password reset
 *
 * @param formData
 * @returns {Promise<T>}
 */
export function activatePasswordReset(formData) {
	return axios
		.post('/auth-svc/account/password/reset/activate', formData)
		.then((response) => {
			if (response.status < 400) {
				return response.data;
			}

			return response;
		})
		.catch((err) => {
			return err;
		});
}

/**
 * Determine if signed in user is an admin
 *
 * @returns {Promise<AxiosResponse<any>>}
 */
export function isAdmin() {
	return axios
		.get('/auth-svc/account/is/admin')
		.then((response) => {
			if (response.status < 400) {
				return response.data;
			}

			return response;
		})
		.catch((err) => {
			return err;
		});
}

/**
 * Check if token has been set after sign in
 *
 * @returns {boolean}
 */
export function isSignedIn() {
	const token = localStorage.getItem('accessToken');
	return token ? true : false;
}
