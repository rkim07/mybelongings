"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicle = exports.updateVehicle = exports.addVehicle = exports.getVehicles = exports.getVehiclesByUserKey = exports.getVehicleById = void 0;
const _ = require("lodash");
const axios_1 = require("axios");
// import { setNotifierExceptionMsg, setNotifierMsg } from '../helpers/messages';
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
        if (response.status === 200) {
            if (response.data) {
                this.setState({
                    vehicle: response.data
                });
                return response.status;
            }
            else if (response.error) {
                // setNotifierMsg('error', response);
                return response.status;
            }
        }
    })
        .catch(error => {
        // setNotifierExceptionMsg(error);
        return error.response.status;
    });
}
exports.getVehicleById = getVehicleById;
/**
 * Get vehicles by user key
 *
 * @param userKey
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">|any}
 */
function getVehiclesByUserKey(userKey) {
    if (this.state.vehicles) {
        return this.state.vehicles;
    }
    else {
        return vehiclesAxios
            .get(`/vehicle-svc/vehicles/user/${userKey}`)
            .then(response => {
            if (response.status === 200) {
                if (response.data.length > 0) {
                    this.setState({
                        vehicles: response.data
                    });
                    return response.status;
                }
                else if (response.error) {
                    // setNotifierMsg('error', response);
                    return response.status;
                }
            }
        })
            .catch(error => {
            // setNotifierExceptionMsg(error);
            return error.response.status;
        });
    }
}
exports.getVehiclesByUserKey = getVehiclesByUserKey;
/**
 * Get all vehicles
 *
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
function getVehicles() {
    if (this.state.vehicles) {
        return this.state.vehicles;
    }
    else {
        return vehiclesAxios
            .get('/vehicle-svc/vehicles')
            .then(response => {
            if (response.status === 200) {
                if (response.data) {
                    this.setState({
                        vehicles: response.data
                    });
                    return response.status;
                }
                else if (response.error) {
                    // setNotifierMsg('error', response);
                    return response.status;
                }
            }
        })
            .catch(error => {
            // setNotifierExceptionMsg(error);
            return error.response.status;
        });
    }
}
exports.getVehicles = getVehicles;
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
        if (response.status === 201) {
            if (response.data) {
                let existingVehicles = this.state.vehicles || [];
                existingVehicles.push(response.data);
                // setNotifierMsg("success", UsersMsg.added);
                this.setState({
                    vehicles: existingVehicles
                });
                return response.status;
            }
            else if (response.error) {
                // setNotifierMsg("error", response);
                return response.status;
            }
        }
    })
        .catch(error => {
        // setNotifierExceptionMsg(error);
        return error.response.status;
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
        if (response.status === 200) {
            if (response.data) {
                let existingVehicles = this.state.vehicles;
                let vehicle = _.find(existingVehicles, function (o) { return o.key === response.data.key; });
                _.merge(vehicle, response.data);
                // setNotifierMsg("success", UsersMsg.added);
                this.setState({
                    vehicles: existingVehicles
                });
                return response.status;
            }
            else if (response.error) {
                // setNotifierMsg("error", response);
                return response.status;
            }
        }
    })
        .catch(error => {
        // setNotifierExceptionMsg(error);
        return error.response.status;
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
        if (response.status === 204) {
            if (_.empty(response.data)) {
                let existingVehicles = this.state.vehicles;
                _.remove(existingVehicles, (vehicle) => {
                    return vehicle.key === existingVehicles.key;
                });
                //setNotifierMsg("success", TransactionMsg.removed);
                this.setState({
                    vehicles: existingVehicles
                });
                return response.status;
            }
            else if (response.error) {
                // setNotifierMsg("error", response);
                return response.status;
            }
        }
    })
        .catch(error => {
        //setNotifierExceptionMsg(error);
        return error.response.status;
    });
}
exports.deleteVehicle = deleteVehicle;
//# sourceMappingURL=vehicles.js.map