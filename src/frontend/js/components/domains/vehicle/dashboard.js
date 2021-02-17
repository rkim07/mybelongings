import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppContext from '../../../appcontext';
import Notifier from '../../shared/feedback/notifier';
import List from './list';
import Information from './information';

const vehiclesReducer = (state, action) => {
	const { payload } = action;

	switch(action.type) {
		case 'add':
			return state.concat(payload);
		default:
			return state;
	}
}

/**
 * Main component for vehicles
 *
 * Contains:
 * Nested routes
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Dashboard(props) {
	const notifierRef = useRef();
	const apis = useContext(AppContext);

	const [loading, setLoading] = useState(true);

	// Get all user's vehicles
	const [vehicles, dispatchVehicles] = useReducer(vehiclesReducer, []);

	useEffect(() => {
		apis.getVehiclesByUser().then(response => {
			if ((response.statusCode < 400) && (response.payload.length > 0)) {
				dispatchVehicles({
					type: 'add',
					payload: response.payload
				});

				setLoading(false);
			} else if (response.payload.length === 0) {
				setLoading(false);
			}
		});
	}, []);

	// Notifier
	const handleNotifier = (statusType, message) => {
		notifierRef.current.openNotifier(statusType, message);
	}

	return (
		<React.Fragment>
			<Notifier ref={ notifierRef }/>
			<Routes>
				<Route path='/' element={
					<List
						loading={ loading }
						vehicles={ vehicles }
					/>
				} />
				<Route path='information/:key/*' element={
					<Information />
				} />
			</Routes>
		</React.Fragment>
	)
}
