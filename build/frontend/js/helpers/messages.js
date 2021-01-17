"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNotifierMsg = exports.setNotifierExceptionMsg = exports.ClubMsg = exports.TournamentMsg = exports.getMembershipTypesMsg = exports.ImagesMsg = exports.TransactionMsg = exports.RegistrationMsg = exports.UsersMsg = void 0;
const notifier_1 = require("./notifier");
exports.UsersMsg = {
    added: 'Member was successfully added.',
    updated: 'Member was successfully updated',
    removed: 'Member was successfully removed.'
};
exports.RegistrationMsg = {
    added: 'Member was successfully added.',
    updated: 'Member was successfully updated',
    removed: 'Member was successfully removed.'
};
exports.TransactionMsg = {
    added: 'Transaction was successfully added.',
    updated: 'Transaction was successfully updated',
    removed: 'Transaction was successfully removed.'
};
exports.ImagesMsg = {
    loading_failed: 'Failed to load images'
};
function getMembershipTypesMsg(action, type) {
    let msg = {
        added: `Membership type ${type} was successfully added.`,
        updated: `Membership type ${type} was successfully updated`,
        removed: `Membership type ${type} was successfully removed.`
    };
    return msg[action];
}
exports.getMembershipTypesMsg = getMembershipTypesMsg;
;
exports.TournamentMsg = {
    added: 'Tournament was successfully added.',
    updated: 'Tournament was successfully updated',
    removed: 'Tournament was successfully removed.'
};
exports.ClubMsg = {
    added: 'Club was successfully added.',
    updated: 'Club was successfully updated',
    removed: 'Club was successfully removed.'
};
function setNotifierExceptionMsg(error) {
    let msg = '';
    if (error.response.data.error) {
        msg = error.response.data.error;
    }
    else if (error.response) {
        msg = error.response.data;
    }
    else if (error.request) {
        msg = error.request;
    }
    else if (error.message) {
        msg = error.message;
    }
    else {
        msg = error;
    }
    return notifier_1.setNotifier(true, 'error', msg);
}
exports.setNotifierExceptionMsg = setNotifierExceptionMsg;
function setNotifierMsg(type, msg) {
    if (type === 'success') {
        return notifier_1.setNotifier(true, 'success', msg);
    }
    else {
        if (msg.error) {
            return notifier_1.setNotifier(true, 'error', msg.error);
        }
        else {
            return notifier_1.setNotifier(true, 'error', msg);
        }
    }
}
exports.setNotifierMsg = setNotifierMsg;
//# sourceMappingURL=messages.js.map