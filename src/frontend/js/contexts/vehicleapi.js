import React from 'react';
import axios from 'axios';

const apiVehiclesAxios = axios.create();

apiVehiclesAxios.interceptors.request.use((config) => {
	config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;

	return config;
});

/**
 * Get API manufacturers
 *
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
export function getApiMfrs() {
	return apiVehiclesAxios
		.get(`/vehicle-api-svc/manufacturers`)
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
 * Get API models by manufacturer
 *
 * @param mfrKey
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
export function getApiModelsByMfrKey(mfrKey) {
	return apiVehiclesAxios
		.get(`/vehicle-api-svc/manufacturers/${mfrKey}/models`)
		.then(response => {
			if (response) {
				return response;
			}
		})
		.catch((err) => {
			return err;
		});
}
