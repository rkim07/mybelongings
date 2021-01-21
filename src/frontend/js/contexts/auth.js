import React from 'react';
import axios from 'axios';

/**
 * Login user
 *
 * @param credentials
 * @returns {Promise<T>}
 */
export function login(credentials) {
	return axios
		.post('/auth-svc/login', credentials)
		.then(response => {
			if (response.status === 201) {
				if (response.data) {
					const { token } = response.data;
					localStorage.setItem("token", token);

					response.redirect = true;

					this.setState({
						token: token
					});

					return response;
				} else if (response.error) {
					// setNotifierMsg("error", response);
					return response.status;
				}
			}
		})
		.catch((err) => {
			return err;
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
		.then(response => {
			if (response.status === 201) {
				if (response.data) {

					return response;
				} else if (response.error) {
					// setNotifierMsg("error", response);
					return response.status;
				}
			}
		})
		.catch((err) => {
			return err;
		});
}
