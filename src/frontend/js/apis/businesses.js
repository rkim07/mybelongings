import axios from 'axios';

/**
 * Get business by key
 *
 * @param key
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
export function getBusiness(key) {
	return axios
		.get(`/business-svc/businesses/${key}`)
		.then(response => {
			if (response.status < 400) {
				return response.data;
			}

			return response;
		})
		.catch((err) => {
			return err
		});
}

/**
 * Get all businesses
 *
 * @returns {Promise<T>}
 */
export function getBusinesses() {
	return axios
		.get('/business-svc/businesses')
		.then((response) => {
			if (response.status < 400) {
				return response.data;
			}

			return response;
		})
		.catch((err) => {
			return err;
		});
}

/**
 * Get all businesses by specific type
 *
 * @returns {Promise<T>}
 */
export function getBusinessesByType(type) {
	return axios
		.get(`/business-svc/businesses/by/type/${type}`)
		.then((response) => {
			if (response.status < 400) {
				return response.data;
			}

			return response;
		})
		.catch((err) => {
			return err;
		});
}

/**
 * Add business
 *
 * @param business
 * @returns {Promise<T>}
 */
export function addBusiness(business) {
	return axios
		.post('/business-svc/business', business)
		.then((response) => {
			if (response.status < 400) {
				return response.data;
			}

			return response;
		})
		.catch((err) => {
			return err;
		});
}

/**
 * Update business
 *
 * @param business
 * @returns {Promise<T>}
 */
export function updateBusiness(business) {
	return axios
		.put(`/business-svc/businesses/${business.key}`, business)
		.then((response) => {
			if (response.status < 400) {
				return response.data;
			}

			return response;
		})
		.catch((err) => {
			return err;
		});
}

/**
 * Delete business
 *
 * @param key
 * @returns {Promise<T>}
 */
export function deleteBusiness(key) {
	return axios
		.delete(`/business-svc/businesses/${key}`)
		.then((response) => {
			if (response.status < 400) {
				return response.data;
			}

			return response;
		})
		.catch((err) => {
			return err;
		});
}
