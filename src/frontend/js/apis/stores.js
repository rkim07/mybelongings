import axios from 'axios';

/**
 * Get all stores by specific type
 *
 * @returns {Promise<T>}
 */
export function getStoresByType(type) {
	return axios
		.get(`/store-svc/stores/by/type/${type}`)
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
