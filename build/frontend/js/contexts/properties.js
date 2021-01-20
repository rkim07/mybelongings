"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertiesByUserKey = exports.getProperties = exports.getPropertyById = void 0;
const axios_1 = require("axios");
// import { setNotifierExceptionMsg, setNotifierMsg } from '../utils/messages';
const propertiesAxios = axios_1.default.create();
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
function getPropertyById(id) {
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
exports.getPropertyById = getPropertyById;
/**
 * Get all properties
 *
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
function getProperties() {
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
exports.getProperties = getProperties;
/**
 * Get properties by user key
 *
 * @param userKey
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">|any}
 */
function getPropertiesByUserKey(userKey) {
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
exports.getPropertiesByUserKey = getPropertiesByUserKey;
//# sourceMappingURL=properties.js.map