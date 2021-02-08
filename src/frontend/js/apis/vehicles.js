import axios from 'axios';

/**
 * Get vehicle by ID
 *
 * @param key
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
export function getVehicle(key) {
	return axios
		.get(`/vehicle-svc/vehicles/${key}`)
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
 * Get all vehicles
 *
 * @returns {Promise<T>}
 */
export function getVehicles() {
	return axios
		.get('/vehicle-svc/vehicles')
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
 * Get vehicles by user key
 *
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">|any}
 */
export function getVehiclesByUser() {
	return axios
		.get(`/vehicle-svc/vehicles/by/user`)
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
 * Add vehicle
 *
 * @param vehicle
 * @returns {Promise<T>}
 */
export function addVehicle(vehicle) {
	vehicle = prepareSubmitData(vehicle);

	return axios
		.post('/vehicle-svc/vehicle', vehicle)
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
 * Update vehicle
 *
 * @param key
 * @param vehicle
 * @returns {Promise<T>}
 */
export function updateVehicle(vehicle) {
	// Prepare data for backend
	vehicle = prepareSubmitData(vehicle, vehicle.key);

	return axios
		.put(`/vehicle-svc/vehicles/${vehicle.key}`, vehicle)
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
 * Delete vehicle
 *
 * @param key
 * @returns {Promise<T>}
 */
export function deleteVehicle(key) {
	return axios
		.delete(`/vehicle-svc/vehicles/${key}`)
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
 * Prepare data for submit
 *
 * @param vehicle
 * @param key
 * @returns {*}
 */
function prepareSubmitData(vehicle, key = null) {
	if (key) {
		delete (vehicle.mfrName);
		delete (vehicle.model);
		delete (vehicle.imagePath);
		delete (vehicle.created);
		delete (vehicle.modified);
	}

	return vehicle;
}
