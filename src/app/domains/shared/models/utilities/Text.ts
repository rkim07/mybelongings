/**
 * Text manipulation class
 */
export class Text {

	/**
	 * Format phone number
	 */
	static formatPhoneNumber(phoneNumberString) {
		let phone = phoneNumberString.replace(/[^\d]/g, '');

		if (phone.length == 10) {
			return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
		}

		return null;
	}

	/**
	 * Convert to decimals
	 *
	 * @param number
	 */
	static numberWithCommas(number) {
		return number.toLocaleString('en');
	}

	/**
	 * Remove commas
	 *
	 * @param number
	 */
	static numberWithoutCommas(number) {
		return number.replace(',', '');
	}

	/**
	 * Remove anything that's non numberic
	 *
	 * @param number
	 */
	static getNumericOnly(number) {
		return number.replace(/\D/g, '');
	}

	/**
	 * Capitalize first letters in a sentecte
	 */
	static capitalizeWords(sentence) {
		return sentence.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
	}

	/**
	 * Upper case
	 *
	 * @param text
	 */
	static toUpperCase(text) {
		return text.toUpperCase();
	}

	/**
	 * Lower case
	 *
	 * @param text
	 */
	static toLowerCase(text) {
		return text.toLowerCase();
	}

	/**
	 * Parse text as number
	 *
	 * @param text
	 */
	static toInteger(text) {
		return parseInt(text);
	}

	/**
	 * Mask text
	 */
	static textMaskCustom(props) {
		/*const { inputRef, ...other } = props;

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
		);*/
	}
}
