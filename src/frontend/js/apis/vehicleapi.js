import axios from 'axios';
import {parseResponse, refreshToken, getHeaderAuthorization } from './helpers/exchange';

const apiVehiclesAxios = axios.create();

// Request interceptor
apiVehiclesAxios.interceptors.request.use((config) => {
	config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;

	return config;
});

// Response interceptor
// Is the marker being refreshed?
let isRefreshing = false
// Retry queue, each item will be a function to be executed
let requests = []

/*apiVehiclesAxios.interceptors.response.use(response => {
	return parseResponse(response);
}, err => {
	return refreshToken(apiVehiclesAxios, err, requests, isRefreshing);
}, (error) => {
	return Promise.reject(error)
});*/

/**
 * Get API manufacturers
 *
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
export function getApiMfrs() {
	return apiVehiclesAxios
		.get(`/vehicle-api-svc/manufacturers`)
		.then(response => {
			const { data, status, error} = response;

			if (data) {
				data.payload = data.payload || '';
				return data;
			} else if (error) {
				return status;
			}
		})
		.catch((err) => {
			return err;
		});
}

/**
 * Get API models by manufacturer
 *
 * @param mfrKey
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
export function getApiModelsByMfrKey(mfrKey) {
	return apiVehiclesAxios
		.get(`/vehicle-api-svc/manufacturers/${mfrKey}/models`)
		.then(response => {
			const { data, status, error} = response;

			if (data) {
				data.payload = data.payload || '';
				return data;
			} else if (error) {
				return status;
			}
		})
		.catch((err) => {
			return err;
		});
}
