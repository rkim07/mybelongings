"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalizeWords = exports.textMaskCustom = exports.chunkList = exports.formatPhoneNumber = void 0;
const react_1 = require("react");
const react_text_mask_1 = require("react-text-mask");
/**
 * Format phone number
 *
 * @param phoneNumberString
 * @returns {null|*}
 */
function formatPhoneNumber(phoneNumberString) {
    let phone = phoneNumberString.replace(/[^\d]/g, '');
    if (phone.length == 10) {
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    return null;
}
exports.formatPhoneNumber = formatPhoneNumber;
/**
 * Chunk list
 *
 * @param list
 * @returns {*}
 */
function chunkList(list) {
    const perChunk = list.length / 2;
    return list.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / perChunk);
        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []; // start a new chunk
        }
        resultArray[chunkIndex].push(item);
        return resultArray;
    }, []);
}
exports.chunkList = chunkList;
/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function textMaskCustom(props) {
    const { inputRef } = props, other = __rest(props, ["inputRef"]);
    return (react_1.default.createElement(react_text_mask_1.default, Object.assign({}, other, { ref: ref => {
            inputRef(ref ? ref.inputElement : null);
        }, mask: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/], placeholderChar: '\u2000', showMask: true })));
}
exports.textMaskCustom = textMaskCustom;
/**
 * Capitalize each word in sentence
 *
 * @param sentence
 * @returns {*}
 */
function capitalizeWords(sentence) {
    return sentence.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}
exports.capitalizeWords = capitalizeWords;
//# sourceMappingURL=utils.js.map