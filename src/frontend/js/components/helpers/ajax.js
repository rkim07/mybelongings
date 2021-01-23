import React from 'react';

// Prepare data to be sent by ajax
export function prepareProfileData(type, state) {
	let data = {
		id: state.user.id,
	}

	switch(type) {
		case 'name':
			data['first_name'] = state.user.first_name;
			data['last_name']  = state.user.last_name;
		break;

		case 'address':
			data['address'] = state.user.address;
			data['city']    = state.user.city;
			data['state']   = state.user.state;
			data['zip']     = state.user.zip;
		break;

		case 'phone':
			data['phone'] = state.user.phone;
		break;

		case 'email':
			data['email'] = state.newEmail;
		break;
	}

	return data;
}

export function prepareLoginData(state) {
	let data = {};

	if (state.id) {
		data['id'] = state.id;
	}

	data['username'] = state.username;
	data['password'] = state.password;

	return data;
}
