/**
 * Return value formatted in decimals
 *
 * @param value
 * @returns {string}
 */
export function decimalFormatter(value) {
	return parseInt(value.replace(/,/g, '')).toLocaleString('en');
}
