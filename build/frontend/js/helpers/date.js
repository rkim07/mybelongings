"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONTHS = exports.getYearsRange = exports.currentYear = exports.currentMonth = exports.formatShortDate = exports.formatIsoDate = void 0;
const moment_1 = require("moment");
function formatIsoDate(date) {
    return moment_1.default(date).format('YYYY-MM-DD');
}
exports.formatIsoDate = formatIsoDate;
function formatShortDate(date) {
    return moment_1.default(date).format('MM/DD/YYYY');
}
exports.formatShortDate = formatShortDate;
function currentMonth() {
    return moment_1.default().format('MMMM, YYYY');
}
exports.currentMonth = currentMonth;
function currentYear() {
    return moment_1.default().format('YYYY');
}
exports.currentYear = currentYear;
function getYearsRange(start) {
    let results = [];
    for (let i = start; i <= currentYear(); i++) {
        results.push({
            value: i,
            label: i
        });
    }
    return results;
}
exports.getYearsRange = getYearsRange;
exports.MONTHS = [
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
//# sourceMappingURL=date.js.map