import axios from 'axios';

/**
 * Get property by ID
 *
 * @param id
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
export function getPropertyById(id) {
	return axios
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
	return axios
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
	return axios
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


