import axios from 'axios';

/**
 * Sync NHTSA API
 *
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
export function syncNhtsa() {
	return axios.get(`/api-svc/nhtsa/sync`);
}

/**
 * Get NHTSA manufacturers
 *
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
export function getNhtsaMfrs() {
	return axios
		.get(`/api-svc/nhtsa/manufacturers`)
		.then(response => {
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
 * Get NHTSA models by manufacturer
 *
 * @param mfrKey
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
export function getNhtsaModelsByMfrKey(mfrKey) {
	return axios
		.get(`/api-svc/nhtsa/manufacturers/${mfrKey}/models`)
		.then(response => {
			if (response.status < 400) {
				return response.data;
			}

			return response;
		})
		.catch((err) => {
			return err;
		});
}
