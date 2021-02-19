import React, { useContext, useEffect, useRef, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import * as _ from "lodash";
import AppContext from '../../../appcontext';
import Notifier from '../../shared/feedback/notifier';
import List from './list';
import Information from './information';

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

	const initialValues = {
		vehicles: [],
		loading: true
	};

	const [values, setValues] = useState(initialValues);

	// Get all vehicles by user
	useEffect(() => {
		apis.getVehiclesByUser().then(response => {
			if ((response.statusCode < 400) && (response.payload.length > 0)) {
				setValues(prevState => ({
					...prevState,
					vehicles: response.payload,
					loading: false
				}));
			} else if (response.payload.length === 0) {
				setValues(prevState => ({
					...prevState,
					loading: false
				}));
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
						loading={ values.loading }
						vehicles={ values.vehicles }
					/>
				} />
				<Route path='information/:key/*' element={
					<Information />
				} />
			</Routes>
		</React.Fragment>
	)
}
