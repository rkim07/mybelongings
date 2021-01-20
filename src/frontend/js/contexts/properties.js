import React from 'react';
import axios from 'axios';
// import { setNotifierExceptionMsg, setNotifierMsg } from '../helpers/messages';

const propertiesAxios = axios.create();

propertiesAxios.interceptors.request.use((config) => {
	config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;

	return config;
});

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
export function getPropertiesByUserKey(userKey) {
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


