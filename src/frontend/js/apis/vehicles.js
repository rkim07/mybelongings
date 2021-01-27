import axios from 'axios';
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
			if (response.status === 200) {
				return response.data;
			}

			return response;
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
			if (response.status === 200) {
				return response.data;
			}

			return response;
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
			if (response.status === 200) {
				return response.data;
			}

			return response;
		})
		.catch((err) => {
			return err;
		});
}

/**
 * Add vehicle
 *
 * @param vehicle
 * @returns {Promise<T>}
 */
export function addVehicle(vehicle) {
	vehicle = prepareSubmitData(vehicle);

	return vehiclesAxios
		.post('/vehicle-svc/vehicle', vehicle)
		.then((response) => {
			if (response.status === 201) {
				return response.data;
			}

			return response;
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
 * @returns {Promise<T>}
 */
export function updateVehicle(vehicle) {
	// Prepare data for backend
	vehicle = prepareSubmitData(vehicle, vehicle.key);

	return vehiclesAxios
		.put(`/vehicle-svc/vehicles/${vehicle.key}`, vehicle)
		.then((response) => {
			if (response.status === 200) {
				return response.data;
			}

			return response;
		})
		.catch((err) => {
			return err;
		});
}

/**
 * Delete vehicle
 *
 * @param key
 * @returns {Promise<T>}
 */
export function deleteVehicle(key) {
	return vehiclesAxios
		.delete(`/vehicle-svc/vehicles/${key}`)
		.then((response) => {
			if (response.status === 200) {
				return response.data;
			}

			return response;
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
