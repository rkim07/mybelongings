
/**
 * Set the image source
 *
 * @param name
 * @param path
 * @param domain
 * @returns {string|*}
 */
export function getImageSource(name, path, domain) {
	if (name !== '') {
		return path;
	}

	const noPicImages = {
		vehicle: 'no_pic_vehicle.jpg',
		property: 'no_pic_property.png',
		user: ''
	}

	return `${path}/${noPicImages[domain]}`;
}
