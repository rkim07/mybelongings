import axios from 'axios';
import { parseResponse, refreshToken, getHeaderAuthorization } from './helpers/exchange';

const propertiesAxios = axios.create();

// Request interceptor
propertiesAxios.interceptors.request.use((config) => {
	config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;

	return config;
});

// Response interceptor
// Is the marker being refreshed?
let isRefreshing = false
// Retry queue, each item will be a function to be executed
let requests = []

/*propertiesAxios.interceptors.response.use(response => {
	return parseResponse(response);
}, err => {
	return refreshToken(propertiesAxios, err, requests, isRefreshing);
}, (error) => {
	return Promise.reject(error)
});*/

/**
 * Get property by ID
 *
 * @param id
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
export function getPropertyById(id) {
	return propertiesAxios
		.get(`/property-svc/properties/${id}`)
		.then(response => {
			if (response) {
				return response;
			}
		})
		.catch((err) => {
			return err;
		});
}

/**
 * Get all properties
 *
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
export function getProperties() {
	return propertiesAxios
		.get(`/property-svc/properties/user/${userKey}`)
		.then(response => {
			if (response) {
				return response;
			}
		})
		.catch((err) => {
			return err;
		});
}

/**
 * Get properties by user key
 *
 * @param userKey
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">|any}
 */
export function getUserProperties(userKey) {
	return propertiesAxios
		.get(`/property-svc/properties/user/${userKey}`)
		.then(response => {
			if (response) {
				return response;
			}
		})
		.catch((err) => {
			return err;
		});
}


