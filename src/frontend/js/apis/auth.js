import axios from 'axios';
import { getHeaderAuthorization } from './helpers/exchange';

/**
 * Login
 *
 * @param credentials
 * @returns {Promise<T>}
 */
export function login(credentials) {
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
		.post('/auth-svc/login', credentials)
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
export function logout() {
	return axios
		.get('/auth-svc/logout',{
			headers: {
				Authorization: getHeaderAuthorization()
			}
		})
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
		.get('/auth-svc/refresh', {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
			}
		})
		.then((response) => {
			const { data } = response;
			if (data.statusCode < 400) {
				localStorage.setItem('accessToken', data.accessToken);
				data['expiredRefreshToken'] = false;

				return response;
			}
		})
		.catch((err) => {
			data['expiredRefreshToken'] = true;
			data['err'] = err;

			return data;
		});
}

/**
 * Register new user
 *
 * @param credentials
 * @returns {Promise<T>}
 */
export function register(credentials) {
	return axios
		.post('/auth-svc/register', credentials)
		.then((response) => {
			return response.data;
		})
		.catch((err) => {
			return err;
		});
}

/**
 * Check if token has been set after login
 *
 * @returns {boolean}
 */
export function isLoggedIn() {
	const token = localStorage.getItem('accessToken');
	return token ? true : false;
}