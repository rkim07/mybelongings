import React from 'react';
import axios from 'axios';
import { getHeaderAuthorization } from './helpers/exchange';

/**
 * Login
 *
 * @param credentials
 * @returns {Promise<T>}
 */
export function login(credentials) {
	return axios
		.post('/auth-svc/login', credentials)
		.then((response) => {
			const { data, status, error } = response;

			if (status === 201) {
				if (data) {
					const { accessToken, refreshToken } = data;
					localStorage.setItem('accessToken', accessToken);
					localStorage.setItem('refreshToken', refreshToken);

					response.redirect = true;

					return response;
				} else if (error) {
					return status;
				}
			}
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
			const { data, status, error } = response;

			if (status === 200) {
				localStorage.removeItem('accessToken');
				localStorage.removeItem('refreshToken');
			}
		})
		.catch((err) => {
			return err;
		});
}

/**
 * Request to refresh access token once is expired
 *
 * @returns {*}
 */
export function refreshAccessToken() {
	console.log('Current access token: ', localStorage.getItem('accessToken'));
	console.log('Current refresh token: ', localStorage.getItem('refreshToken'));

	return axios
		.get('/auth-svc/refresh', {
			headers: {
				Authorization: getHeaderAuthorization()
			}
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
			const { data, status, error } = response;

			if (status === 201) {
				if (data) {
					return response;
				} else if (error) {
					return status;
				}
			}
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
