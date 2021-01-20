"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiModelsByMfrKey = exports.getApiMfrs = void 0;
const axios_1 = require("axios");
const apiVehiclesAxios = axios_1.default.create();
apiVehiclesAxios.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
});
/**
 * Get API manufacturers
 *
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
function getApiMfrs() {
    return apiVehiclesAxios
        .get(`/vehicle-api-svc/manufacturers`)
        .then(response => {
        if (response) {
            return response;
        }
    })
        .catch((err) => {
        return err;
    });
}
exports.getApiMfrs = getApiMfrs;
/**
 * Get API models by manufacturer
 *
 * @param mfrKey
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
function getApiModelsByMfrKey(mfrKey) {
    return apiVehiclesAxios
        .get(`/vehicle-api-svc/models/manufacturer/${mfrKey}`)
        .then(response => {
        if (response) {
            return response;
        }
    })
        .catch((err) => {
        return err;
    });
}
exports.getApiModelsByMfrKey = getApiModelsByMfrKey;
//# sourceMappingURL=vehicleapi.js.map