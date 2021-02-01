import axios from 'axios';

/**
 * Get API manufacturers
 *
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
export function getApiMfrs() {
	return axios
		.get(`/vehicle-api-svc/manufacturers`)
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
 * Get API models by manufacturer
 *
 * @param mfrKey
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
export function getApiModelsByMfrKey(mfrKey) {
	return axios
		.get(`/vehicle-api-svc/manufacturers/${mfrKey}/models`)
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
