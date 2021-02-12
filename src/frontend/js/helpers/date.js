import * as moment from 'moment';

export function currentMonth() {
	return moment().format('MMMM, YYYY');
}

export function currentYear() {
	return moment().format('YYYY');
}

export function getYearsRange(start, end) {
	let results = [];

	for (let i = start; i <= end; i++) {
		results.push({
			value: i,
			label: i
		});
	}

	return results;
}

export const MONTHS = [
	{
		value: '1',
		label: 'January',
		short_label: 'Jan'
	},
	{
		value: '2',
		label: 'February',
		short_label: 'Feb'
	},
	{
		value: '3',
		label: 'March',
		short_label: 'Mar'
	},
	{
		value: '4',
		label: 'April',
		short_label: 'Apr'
	},
	{
		value: '5',
		label: 'May',
		short_label: 'May'
	},
	{
		value: '6',
		label: 'June',
		short_label: 'Jun'
	},
	{
		value: '7',
		label: 'July',
		short_label: 'Jul'
	},
	{
		value: '8',
		label: 'August',
		short_label: 'Aug'
	},
	{
		value: '9',
		label: 'September',
		short_label: 'Sept'
	},
	{
		value: '10',
		label: 'October',
		short_label: 'Oct'
	},
	{
		value: '11',
		label: 'November',
		short_label: 'Nov'
	},
	{
		value: '12',
		label: 'December',
		short_label: 'Dec'
	}
];
