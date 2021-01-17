"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProperties = exports.getPropertiesByUserKey = exports.getPropertyById = void 0;
const axios_1 = require("axios");
// import { setNotifierExceptionMsg, setNotifierMsg } from '../helpers/messages';
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
        if (response.status === 200) {
            if (response.data) {
                this.setState({
                    properties: response.data
                });
                return response;
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
exports.getPropertyById = getPropertyById;
/**
 * Get properties by user key
 *
 * @param userKey
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">|any}
 */
function getPropertiesByUserKey(userKey) {
    if (this.state.properties) {
        return this.state.properties;
    }
    else {
        return propertiesAxios
            .get(`/property-svc/properties/user/${userKey}`)
            .then(response => {
            if (response.status === 200) {
                if (response.data.length > 0) {
                    this.setState({
                        properties: response.data
                    });
                    return response;
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
exports.getPropertiesByUserKey = getPropertiesByUserKey;
/**
 * Get all properties
 *
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
function getProperties() {
    if (this.state.properties) {
        return this.state.properties;
    }
    else {
        return propertiesAxios
            .get('/property-svc/properties')
            .then(response => {
            if (response.status === 200) {
                if (response.data) {
                    this.setState({
                        properties: response.data
                    });
                    return response;
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
exports.getProperties = getProperties;
//# sourceMappingURL=properties.js.map