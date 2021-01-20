import React from 'react';
import * as _ from 'lodash';

/**
 * Add or update object in collection
 *
 * @param arr
 * @param obj
 * @returns {*}
 */
export function addUpdateCollection(arr, obj) {
	const index = _.findIndex(arr, (idx) => {
		return idx.key === obj.key
	});

	if (index === -1) {
		arr.push(obj);
	} else {
		arr[index] = obj;
	}

	return arr;
}

/**
 * Remove object from collection
 *
 * @param arr
 * @param obj
 * @returns {*}
 */
export function removeFromCollection(arr, obj) {
	const index = _.findIndex(arr, (idx) => {
		return idx.key === obj.key
	});

	return _.pullAt(arr, index);
}

/**
 * Chunk collection
 *
 * @param list
 * @returns {*}
 */
export function chunkCollection(list) {
	const perChunk = list.length / 2;

	return list.reduce((resultArray, item, index) => {
		const chunkIndex = Math.floor(index/perChunk)

		if (!resultArray[chunkIndex]) {
			resultArray[chunkIndex] = [] // start a new chunk
		}

		resultArray[chunkIndex].push(item)

		return resultArray
	}, []);
}
