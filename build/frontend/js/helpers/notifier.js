"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearNotifier = exports.setNotifier = exports.getNotifier = void 0;
// Get notifier
function getNotifier() {
    /*return {
        openNotifier: localStorage.getItem('openNotifier') === 'true' ? true : false,
        notifierType: localStorage.getItem('notifierType'),
        notifierMsg:  localStorage.getItem('notifierMsg')
    }*/
}
exports.getNotifier = getNotifier;
// Set notifier
function setNotifier(open, type, msg) {
    /*localStorage.setItem('openNotifier', open);
    localStorage.setItem('notifierType', type);
    localStorage.setItem('notifierMsg', msg);*/
}
exports.setNotifier = setNotifier;
// Clear notifier
function clearNotifier() {
    /*localStorage.setItem('openNotifier', false);
    localStorage.setItem('notifierType', '');
    localStorage.setItem('notifierMsg', '');*/
}
exports.clearNotifier = clearNotifier;
//# sourceMappingURL=notifier.js.map