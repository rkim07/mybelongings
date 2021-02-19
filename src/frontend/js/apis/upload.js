import axios from 'axios';

/**
 * Upload file
 *
 * @param file
 * @returns {Promise<T>}
 */
export function uploadFile(file) {
	let fd = new FormData();
	fd.append('file', file);

	return axios
		.post('/file-upload-svc/upload', fd)
		.then(response => {
			return response.data;
		})
		.catch((err) => {
			return err;
		});
}

/**
 * Download file
 *
 * @param type
 * @param fileName
 * @returns {Promise<T>}
 */
export function downloadFile(file) {
	return axios
		.post(`/file-upload-svc/download/${file}`)
		.then(response => {
			return response.data;
		})
		.catch((err) => {
			return err;
		});
}
