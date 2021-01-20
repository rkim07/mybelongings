"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicle = exports.updateVehicle = exports.addVehicle = exports.getVehiclesByUserKey = exports.getVehicles = exports.getVehicleById = void 0;
const axios_1 = require("axios");
const vehiclesAxios = axios_1.default.create();
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
function getVehicleById(key) {
    return vehiclesAxios
        .get(`/vehicle-svc/vehicles/${key}`)
        .then(response => {
        if (response) {
            return response;
        }
    })
        .catch((err) => {
        return err;
    });
}
exports.getVehicleById = getVehicleById;
/**
 * Get all vehicles
 *
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
function getVehicles() {
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
exports.getVehicles = getVehicles;
/**
 * Get vehicles by user key
 *
 * @param userKey
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">|any}
 */
function getVehiclesByUserKey(userKey) {
    return vehiclesAxios
        .get(`/vehicle-svc/vehicles/user/${userKey}`)
        .then(response => {
        if (response) {
            return response;
        }
    })
        .catch((err) => {
        return err;
    });
}
exports.getVehiclesByUserKey = getVehiclesByUserKey;
/**
 * Add vehicle
 *
 * @param vehicle
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
function addVehicle(vehicle) {
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
exports.addVehicle = addVehicle;
/**
 * Update vehicle
 *
 * @param key
 * @param vehicle
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
function updateVehicle(key, vehicle) {
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
exports.updateVehicle = updateVehicle;
/**
 * Delete vehicle
 *
 * @param key
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
function deleteVehicle(key) {
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
exports.deleteVehicle = deleteVehicle;
//# sourceMappingURL=vehicles.js.map