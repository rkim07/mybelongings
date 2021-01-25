import React from 'react';
import axios from 'axios';
import { addUpdateCollection, removeFromCollection } from './helpers/collection';
import { parseResponse, refreshToken, getHeaderAuthorization } from './helpers/exchange';

const vehiclesAxios = axios.create();

// Request interceptor
vehiclesAxios.interceptors.request.use(config => {
	config.headers.Authorization = getHeaderAuthorization(config);
	return config;
}, (error) => {
	Promise.reject(error)
});


// Response interceptor
// Is the marker being refreshed?
let isRefreshing = false
// Retry queue, each item will be a function to be executed
let requests = []

vehiclesAxios.interceptors.response.use(response => {
	return parseResponse(response);
}, err => {
	return refreshToken(vehiclesAxios, err, requests, isRefreshing);
}, (error) => {
	return Promise.reject(error)
});

/**
 * Get vehicle by ID
 *
 * @param key
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
export function getVehicle(key) {
	return vehiclesAxios
		.get(`/vehicle-svc/vehicles/${key}`)
		.then(response => {
			const { data, status, error} = response;

			if (data) {
				data.vehicle = data.vehicle ? data.vehicle : [];
				return data;
			} else if (error) {
				return status;
			}
		})
		.catch((err) => {
			return err
		});
}

/**
 * Get all vehicles
 *
 * @returns {Promise<T>}
 */
export function getVehicles() {
	return vehiclesAxios
		.get('/vehicle-svc/vehicles')
		.then((response) => {
			const { data, status, error} = response;

			if (data) {
				data.vehicles = data.vehicles ? data.vehicles : [];
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
 * Get vehicles by user key
 *
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">|any}
 */
export function getUserVehicles() {
	return vehiclesAxios
		.get(`/vehicle-svc/vehicles/by/user`)
		.then((response) => {
			const { data, status, error} = response;

			if (data) {
				data.vehicles = data.vehicles ? data.vehicles : [];
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
 * Add vehicle
 *
 * @param vehicle
 * @param vehicles
 * @returns {Promise<T>}
 */
export function addVehicle(vehicle, vehicles) {
	vehicle = prepareSubmitData(vehicle);

	return vehiclesAxios
		.post('/vehicle-svc/vehicle', vehicle)
		.then((response) => {
			const { data, status, error} = response;

			if (data.statusCode < 400) {
				data['vehicles'] = addUpdateCollection(data.vehicle, vehicles);
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
 * Update vehicle
 *
 * @param key
 * @param vehicle
 * @param vehicles
 * @returns {Promise<T>}
 */
export function updateVehicle(key, vehicle, vehicles) {
	// Prepare data for backend
	vehicle = prepareSubmitData(vehicle, key);

	return vehiclesAxios
		.put(`/vehicle-svc/vehicles/${key}`, vehicle)
		.then((response) => {
			const { data, status, error} = response;

			if (data.statusCode < 400) {
				data['vehicles'] = addUpdateCollection(data.vehicle, vehicles);
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
 * Delete vehicle
 *
 * @param key
 * @param vehicles
 * @returns {Promise<T>}
 */
export function deleteVehicle(key, vehicles) {
	return vehiclesAxios
		.delete(`/vehicle-svc/vehicles/${key}`)
		.then((response) => {
			const { data, status,  error } = response;

			if (data.statusCode < 400) {
				data['vehicles'] = removeFromCollection(data.vehicle, vehicles);
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
 * Prepare data for submit
 *
 * @param vehicle
 * @param key
 * @returns {*}
 */
function prepareSubmitData(vehicle, key = null) {
	vehicle.year = parseInt(vehicle.year);

	if (key) {
		vehicle.year = parseInt(vehicle.year);
		delete (vehicle.mfrName);
		delete (vehicle.model);
		delete (vehicle.image_path);
		delete (vehicle.created);
		delete (vehicle.modified);
	}

	return vehicle;
}
