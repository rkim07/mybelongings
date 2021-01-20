"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const axios_1 = require("axios");
// import { setNotifierExceptionMsg, setNotifierMsg } from '../utils/messages';
const filesAxios = axios_1.default.create();
filesAxios.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
});
/**
 * Upload file
 *
 * @param file
 * @returns {Promise<T | string | "rejected" | number | "fulfilled">}
 */
function uploadFile(file) {
    let fd = new FormData();
    fd.append('file', file);
    return filesAxios
        .post("/file-svc/upload", fd)
        .then(response => {
        if (response) {
            return response;
        }
    })
        .catch((err) => {
        return err;
    });
}
exports.uploadFile = uploadFile;
//# sourceMappingURL=file.js.map