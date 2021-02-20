/**
 * Text manipulation class
 */
export class Text {

	/**
	 * Format phone number
	 */
	static formatPhoneNumber(phoneNumber) {
		if (phoneNumber.length == 10) {
			return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
		}

		return  phoneNumber;
	}

	/**
	 * Database phone number format
	 */
	static formatDBPhoneNumber(phoneNumberString) {
		if (phoneNumberString.length == 14) {
			return parseInt(phoneNumberString.replace(/[^\d]/g, ''));
		}

		return phoneNumberString;
	}

	/**
	 * Convert to decimals
	 *
	 * @param number
	 */
	static numberWithCommas(number) {
		return number !== 0 ? number.toLocaleString('en') : parseInt(number);
	}

	/**
	 * Remove commas
	 *
	 * @param number
	 */
	static numberWithoutCommas(number) {
		return number !== 0 ? parseInt(number.replace(',', '')) : parseInt(number);
	}

	/**
	 * Remove anything that's non numberic
	 *
	 * @param number
	 */
	static getNumericOnly(number) {
		return parseInt(number.replace(/\D/g, ' '));
	}

	/**
	 * Capitalize first letters in a sentecte
	 */
	static capitalizeWords(sentence) {
		return sentence !== '' ? sentence.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) : sentence;
	}

	/**
	 * Upper case
	 *
	 * @param text
	 */
	static toUpperCase(text) {
		return text !== '' ? text.toUpperCase() : text;
	}

	/**
	 * Lower case
	 *
	 * @param text
	 */
	static toLowerCase(text) {
		return text !== '' ? text.toLowerCase(): text;
	}

	/**
	 * Parse text as number
	 *
	 * @param text
	 */
	static toInteger(text) {
		return parseInt(text);
	}
}
