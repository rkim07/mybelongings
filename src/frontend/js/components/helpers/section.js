
/**
 * Functionality to toggle the sections
 *
 * @param statusType
 * @param curSection
 * @returns {string}
 */
export function sectionToggler(statusType, curSection) {
	let section = '';

	switch (curSection) {
		case 'update':
			if (statusType === 'success' ||
				statusType === 'error' ||
				statusType === 'warning') {
				section = 'update';
			}
			break;
		case 'add':
			section = statusType === 'error' ? 'add' : 'list';
			break;
		default:
			section = 'list';
	}

	return section;
}
