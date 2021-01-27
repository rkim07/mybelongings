import axios from 'axios';
import { parseResponse, refreshToken, getHeaderAuthorization } from './helpers/exchange';

const filesAxios = axios.create();

// Request interceptor
filesAxios.interceptors.request.use(config => {
	config.headers.Authorization = getHeaderAuthorization(config);
	return config;
}, (error) => {
	Promise.reject(error)
});

// Response interceptor
// Is the marker being refreshed?
let isRefreshing = false
// Retry queue, each item will be a function to be executed
let requests = []

filesAxios.interceptors.response.use(response => {
	return parseResponse(response);
}, err => {
	return refreshToken(filesAxios, err, requests, isRefreshing);
}, (error) => {
	return Promise.reject(error)
});

/**
 * Upload file
 *
 * @param file
 * @returns {Promise<T>}
 */
export function uploadFile(file) {
	let fd = new FormData();
	fd.append('file', file);

	return filesAxios
		.post('/file-upload-svc/upload', fd)
		.then(response => {
			return response.data;
		})
		.catch((err) => {
			return err;
		});
}
