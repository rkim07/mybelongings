import React from 'react';
import * as _ from 'lodash';
import axios from 'axios';

const vehiclesAxios = axios.create();

vehiclesAxios.interceptors.request.use((config) => {
	config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;

	return config;
});

/**
 * Get vehicle by ID
 *
 * @param id
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
export function getVehicleById(key) {
	return vehiclesAxios
		.get(`/vehicle-svc/vehicles/${key}`)
		.then(response => {
			if (response) {
				return response;
			}
		})
		.catch((err) => {
			return err
		});
}

/**
 * Get all vehicles
 *
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
export function getVehicles() {
	return vehiclesAxios
		.get('/vehicle-svc/vehicles')
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
 * Get vehicles by user key
 *
 * @param userKey
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">|any}
 */
export function getVehiclesByUserKey() {
	return vehiclesAxios
		.get(`/vehicle-svc/vehicles/user`)
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
 * Add vehicle
 *
 * @param vehicle
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
export function addVehicle(vehicle) {
	return vehiclesAxios
		.post('/vehicle-svc/vehicle', vehicle)
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
 * Update vehicle
 *
 * @param key
 * @param vehicle
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
export function updateVehicle(key, vehicle) {
	// Remove during update
	delete (vehicle.mfrName);
	delete (vehicle.model);
	delete (vehicle.image_path);
	delete (vehicle.created);
	delete (vehicle.modified);

	return vehiclesAxios
		.put(`/vehicle-svc/vehicles/${key}`, vehicle)
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
 * Delete vehicle
 *
 * @param key
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
export function deleteVehicle(key) {
	return vehiclesAxios
		.delete(`/vehicle-svc/vehicles/${key}`)
		.then(response => {
			if (response) {
				return response;
			}
		})
		.catch((err) => {
			return err;
		});
}
