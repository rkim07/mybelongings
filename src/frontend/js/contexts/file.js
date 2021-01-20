import React from 'react';
import axios from 'axios';
// import { setNotifierExceptionMsg, setNotifierMsg } from '../utils/messages';

const filesAxios = axios.create();

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
export function uploadFile(file) {
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
