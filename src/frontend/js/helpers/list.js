/**
 * Get payment types
 *
 * @returns {({label: string, value: string}|{label: string, value: string}|{label: string, value: string})[]}
 */
export function getPaymentTypes() {
	return [
		{
			value: 'cash',
			label: 'Cash'
		},
		{
			value: 'credit card',
			label: 'Credit card'
		},
		{
			value: 'check',
			label: 'Check'
		}
	];
}

/**
 * Get business types
 *
 * @returns {({label: string, value: string}|{label: string, value: string}|{label: string, value: string})[]}
 */
export function getBusinessTypes() {
	return [
		{
			value: 'bank',
			label: 'Bank'
		},
		{
			value: 'dealership',
			label: 'Dealership'
		},
		{
			value: 'retail',
			label: 'Retail'
		}
	];
}

/**
 * Get address types
 *
 * @returns {({label: string, value: string}|{label: string, value: string})[]}
 */
export function getAddressTypes() {
	return [
		{
			value: 'commercial',
			label: 'Commercial'
		},
		{
			value: 'residential',
			label: 'Residential'
		}
	];
}

/**
 * Get countries
 *
 * @returns {({label: string, value: string}|{label: string, value: string})[]}
 */
export function getCountries() {
	return [
		{
			value: 'kor',
			label: 'Korea'
		},
		{
			value: 'us',
			label: 'United States'
		}
	]
}

/**
 * Get states
 *
 * @returns {({label: string, value: string}|{label: string, value: string}|{label: string, value: string}|{label: string, value: string}|{label: string, value: string})[]}
 */
export function getStates() {
	return [
		{
			value: 'al',
			label: 'Alabama'
		},
		{
			value: 'ak',
			label: 'Alaska'
		},
		{
			value: 'az',
			label: 'Arizona'
		},
		{
			value: 'ar',
			label: 'Arkansas'
		},
		{
			value: 'ca',
			label: 'California'
		},
		{
			value: 'co',
			label: 'Colorado'
		},
		{
			value: 'ct',
			label: 'Connecticut'
		},
		{
			value: 'de',
			label: 'Delaware'
		},
		{
			value: 'dc',
			label: 'District Of Columbia'
		},
		{
			value: 'fl',
			label: 'Florida'
		},
		{
			value: 'ga',
			label: 'Georgia'
		},
		{
			value: 'hi',
			label: 'Hawaii'
		},
		{
			value: 'id',
			label: 'Idaho'
		},
		{
			value: 'il',
			label: 'Illinois'
		},
		{
			value: 'in',
			label: 'Indiana'
		},
		{
			value: 'ia',
			label: 'Iowa'
		},
		{
			value: 'ks',
			label: 'Kansas'
		},
		{
			value: 'KY',
			label: 'Kentucky'
		},
		{
			value: 'la',
			label: 'Louisiana'
		},
		{
			value: 'me',
			label: 'Maine'
		},
		{
			value: 'md',
			label: 'Maryland'
		},
		{
			value: 'ma',
			label: 'Massachusetts'
		},
		{
			value: 'mi',
			label: 'Michigan'
		},
		{
			value: 'mn',
			label: 'Minnesota'
		},
		{
			value: 'ms',
			label: 'Mississippi'
		},
		{
			value: 'mo',
			label: 'Missouri'
		},
		{
			value: 'mt',
			label: 'Montana'
		},
		{
			value: 'ne',
			label: 'Nebraska'
		},
		{
			value: 'nv',
			label: 'Nevada'
		},
		{
			value: 'nh',
			label: 'New Hampshire'
		},
		{
			value: 'nj',
			label: 'New Jersey'
		},
		{
			value: 'nm',
			label: 'New Mexico'
		},
		{
			value: 'ny',
			label: 'New York'
		},
		{
			value: 'nc',
			label: 'North Carolina'
		},
		{
			value: 'nd',
			label: 'North Dakota'
		},
		{
			value: 'oh',
			label: 'Ohio'
		},
		{
			value: 'ok',
			label: 'Oklahoma'
		},
		{
			value: 'or',
			label: 'Oregon'
		},
		{
			value: 'pa',
			label: 'Pennsylvania'
		},
		{
			value: 'ri',
			label: 'Rhode Island'
		},
		{
			value: 'sc',
			label: 'South Carolina'
		},
		{
			value: 'sd',
			label: 'South Dakota'
		},
		{
			value: 'tn',
			label: 'Tennessee'
		},
		{
			value: 'tx',
			label: 'Texas'
		},
		{
			value: 'ut',
			label: 'Utah'
		},
		{
			value: 'vt',
			label: 'Vermont'
		},
		{
			value: 'va',
			label: 'Virginia'
		},
		{
			value: 'wa',
			label: 'Washington'
		},
		{
			value: 'wv',
			label: 'West Virginia'
		},
		{
			value: 'wi',
			label: 'Wisconsin'
		},
		{
			value: 'wy',
			label: 'Wyoming'
		}
	];
}
