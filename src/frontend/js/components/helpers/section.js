export function sectionToggler(response, curSection) {
	let section = '';

	switch (curSection) {
		case 'update':
			if (response.statusType === 'success' ||
				response.statusType === 'error' ||
				response.statusType === 'warning') {
				section = 'update';
			}
			break;
		case 'add':
			section = response.statusType === 'error' ? 'add' : 'list';
			break;
		default:
			section = 'list';
	}

	return section;
}
