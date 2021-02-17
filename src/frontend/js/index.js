import React from 'react';
import axios from "axios";
import ReactDOM from 'react-dom';
import { getHeaderAuthorization, routeNeedsAuth } from "./apis/helpers/interceptor";
import { refreshAccessToken } from "./apis/auth";
import App from './app';

// Request interceptor
axios.interceptors.request.use(request => {
	if (routeNeedsAuth(request.url)) {
		request.headers.Authorization = getHeaderAuthorization(request);
	}

	return request;
}, (error) => {
	Promise.reject(error)
});

const refreshAxios = axios.create();

// Response interceptor
axios.interceptors.response.use(response => {
	return response;
}, err => {
	const { config, response } = err;

	if (response.status === 401) {
		if (config.url === '/auth-svc/account/refresh') {
			// At this poin, refresh token expired as well.  Force user to
			// sign in again to get both new access and refresh tokens
			localStorage.removeItem('accessToken');
			window.location = '/account/signin';
			return;
		}

		if (config.url === '/auth-svc/account/is/admin') {
			window.location = '/admin/unauthorized';
		}

		console.info('Access token has expired.  Attempting to refresh the token...');

		return refreshAccessToken().then(res => {
			console.info('Access token has been refreshed.');
			config.headers.Authorization = getHeaderAuthorization();

			return axios(config);
		}).catch(res => {
			// System crashed somehow.  Force use to sign in again.
			localStorage.removeItem('accessToken');
			window.location = '/account/signin';
			return;
		});
	}

	return err;
}, (error) => {
	return Promise.reject(error);
});

const root = document.getElementById('root');

ReactDOM.render(
    <App />,
    root
);
