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
