import React from 'react';
import { setNotifier } from './notifier';

export const UsersMsg = {
	added:   'Member was successfully added.',
	updated: 'Member was successfully updated',
	removed: 'Member was successfully removed.'
};

export const RegistrationMsg = {
	added:   'Member was successfully added.',
	updated: 'Member was successfully updated',
	removed: 'Member was successfully removed.'
};

export const TransactionMsg = {
	added:   'Transaction was successfully added.',
	updated: 'Transaction was successfully updated',
	removed: 'Transaction was successfully removed.'
};

export const ImagesMsg = {
	loading_failed: 'Failed to load images'
};

export function getMembershipTypesMsg(action, type) {

	let msg = {
		added:   `Membership type ${type} was successfully added.`,
		updated: `Membership type ${type} was successfully updated`,
		removed: `Membership type ${type} was successfully removed.`
	}

	return msg[action];
};

export const TournamentMsg = {
	added:   'Tournament was successfully added.',
	updated: 'Tournament was successfully updated',
	removed: 'Tournament was successfully removed.'
};

export const ClubMsg = {
	added:   'Club was successfully added.',
	updated: 'Club was successfully updated',
	removed: 'Club was successfully removed.'
};

export function setNotifierExceptionMsg(error) {
	let msg = '';

	if (error.response.data.error) {
		msg = error.response.data.error;
	} else if (error.response) {
		msg = error.response.data;
	} else if (error.request) {
		msg = error.request;
	} else if (error.message) {
		msg = error.message;
	} else {
		msg = error;
	}

	return setNotifier(true,  'error', msg);
}

export function setNotifierMsg(type, msg) {
	if (type === 'success') {
		return setNotifier(true, 'success', msg);
	} else {
		if (msg.error) {
			return setNotifier(true, 'error', msg.error);
		} else {
			return setNotifier(true, 'error', msg);
		}
	}
}
