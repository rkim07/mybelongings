import React from 'react';
import axios from 'axios';
// import { setNotifierExceptionMsg, setNotifierMsg } from '../utils/messages';
import _isUndefined from 'lodash/isUndefined';

// Login user
export function login(credentials) {
	return axios
		.post('/auth-svc/login', credentials)
		.then(response => {
			if (response.status === 201) {
				if (response.data) {
					const { user, token } = response.data;
					localStorage.setItem("user", JSON.stringify(user));
					localStorage.setItem("token", token);

					response.redirect = true;

					this.setState({
						token: token,
						user: user
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

// Register user
export function register(credentials) {
	return axios
		.post('/auth-svc/register', credentials)
		.then(response => {
			if (response.status === 201) {
				if (response.data) {
					const { user, token } = response.data;
					localStorage.setItem("user", JSON.stringify(user));
					localStorage.setItem("token", token);

					this.setState({
						user: user
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
