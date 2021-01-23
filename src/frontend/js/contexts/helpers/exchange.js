import React from 'react';
import { logout, refreshAccessToken } from "../auth";

/**
 * Set authentication
 * - Bearer
 * - Basic
 *
 * @param config - object from Axios request interceptor
 * @returns {string}
 */
export function setAuthenticationHeader(config) {
	config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
	return config;
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
		const originalRequest = config;

		if (!isRefreshing) {
			isRefreshing = true

			return refreshAccessToken().then(res => {
				const { data } = res;
				const { accessToken } = data;

				// Add to local storage
				localStorage.setItem('accessToken', accessToken);

				// Replace original token with refreshed token
				originalRequest.headers.Authorization = `Bearer ${accessToken}`;

				// Token has been refreshed to retry requests from all queues
				requests.forEach(cb => cb(accessToken))
				{
					requests = []
					return interceptor(config)
				}
			}).catch(res => {
				console.error('Refresh token error =>', res)
				window.location.href = '/login'
			}).finally(() => {
				isRefreshing = false
			})
		} else {
			// Token is being refreshed and a promise that resolve has not been executed is returned
			return new Promise((resolve) => {
				// Put resolve in the queue, save it in a function form, and execute it directly after token refreshes
				requests.push((accessToken) => {
					config.baseURL = ''
					originalRequest.headers.Authorization = `Bearer ${accessToken}`;
					resolve(interceptor(config))
				})
			})
		}
	}

	return response
}

/**
 * Add status type to response data object
 *
 * @param response
 * @returns {*}
 */
export function addStatusType(response) {
	const statusCodeTypes = {
		200: 'success',
		201: 'success',
		204: 'success',
		400: 'error',
		404: 'warning',
		500: 'error'
	};

	response.data['statusType'] = statusCodeTypes[response.data.statusCode];
	return response;
}
