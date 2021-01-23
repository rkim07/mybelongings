import React from 'react';
import * as _ from "lodash";

/**
 * Prepare all the images from assets images folder
 * to be available in application
 *
 * @returns {any}
 */
export function prepareAppImages() {

	const importAll = require =>
		require.keys().reduce((acc, next) => {
			acc[next.replace("./", "")] = require(next);
			return acc;
		}, {});

	return importAll(
		require.context('../../../assets/images', false, /\.(png|jpe?g|svg|bmp|gif|ico)$/)
	);
}

/**
 * Set the image path for collection
 *
 * @param collection
 * @param loadedImages
 * @returns {*}
 */
export function setImagePath(collection, loadedImages) {
	if (loadedImages) {
		/*collection.map((obj) => {
			let imageName = obj.image === undefined ? 'no_pic.png' : obj.image;
			obj.image_path = loadedImages[imageName]["default"];

			return obj
		});*/
		const recursiveImageSet = (obj) => {
			Object.keys(obj).forEach(key => {
				const value = obj[key];

				if (key === 'image' && typeof value !== 'object'){
					let imageName = !value ? 'no_pic.png' : obj.image;
					obj['image_path'] = loadedImages[imageName]["default"];
				} else if (typeof value === 'object') {
					recursiveImageSet(value);
				}
			});
		};

		return recursiveImageSet(collection);
	}
}
