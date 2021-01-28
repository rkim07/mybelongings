import * as _ from 'lodash';

/**
 * Add or update object in c
 *
 * @param obj
 * @param collection
 * @returns {*}
 */
export function modifyState(obj, collection) {
	const index = _.findIndex(collection, (idx) => {
		return idx.key === obj.key
	});

	if (index === -1) {
		collection.push(obj);
	} else {
		collection[index] = obj;
	}

	return collection;
}

/**
 * Remove object from collection
 *
 * @param key
 * @param collection
 * @returns {unknown[]}
 */
export function removeFromState(key, collection) {
	return _.filter(collection, (idx) => {
		return idx.key !== key;
	});
}

/**
 * Chunk collection
 *
 * @param list
 * @returns {*}
 */
export function chunk(list) {
	const perChunk = list.length / 2;

	return list.reduce((results, item, index) => {
		const chunkIndex = Math.floor(index/perChunk)

		if (!results[chunkIndex]) {
			results[chunkIndex] = [] // start a new chunk
		}

		results[chunkIndex].push(item)

		return results
	}, []);
}
