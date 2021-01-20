import React from 'react';
import MaskedInput from 'react-text-mask';

/**
 * Format phone number
 *
 * @param phoneNumberString
 * @returns {null|*}
 */
export function formatPhoneNumber(phoneNumberString) {
	let phone = phoneNumberString.replace(/[^\d]/g, '');

	if (phone.length == 10) {
		return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
	}

	return null;
}

/**
 * Chunk list
 *
 * @param list
 * @returns {*}
 */
export function chunkList(list) {
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

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function textMaskCustom(props) {
	const { inputRef, ...other } = props;

	return (
		<MaskedInput
			{...other}
			ref={ref => {
				inputRef(ref ? ref.inputElement : null);
			}}
			mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
			placeholderChar={'\u2000'}
			showMask
		/>
	);
}
