import React from 'react';
import axios from 'axios';

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

					this.setState({
						accessToken: accessToken,
						refreshToken: refreshToken
					});

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
 * Logout
 *
 * @returns {*}
 */
export function logout() {
	return axios
		.get('/auth-svc/logout');
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
				'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
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
