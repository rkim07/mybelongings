import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AppContext from '../../../appcontext';
import Notifier from '../../shared/feedback/notifier';
import { currentYear } from '../../../../../helpers/date';
import { modifyState, removeFromState } from '../../../apis/helpers/collection';
import List from './list';
import Modify from './modify';
import Information from './information';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import { Info } from '@material-ui/icons';

const vehiclesReducer = (state, action) => {
	const { payload } = action;

	switch(action.type) {
		case 'add':
			return state.concat(payload);
		case 'update':
			return modifyState(payload, state);
		case 'delete':
			return removeFromState(payload, state);
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
	const navigate = useNavigate();
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

	// Delete vehicle
	const hanleDelete = async(key) => {
		const response = await apis.deleteVehicle(key);

		if (response.statusCode < 400) {
			dispatchVehicles({
				type: 'delete',
				payload: response.payload.key
			});
		}

		handleNotifier(response.statusType, response.message);
	}

	// Add or update vehicle
	const handleSubmit = async(e, file, vehicle) => {
		e.preventDefault();

		const isNewVehicle = vehicle.key ? false : true;

		// Make REST call to upload file
		vehicle = { ...vehicle, image: ""};
		if (file.length) {
			const upload = await apis.uploadFile(file[0]);

			if (upload) {
				vehicle.image = upload.payload;
			}
		}

		// Make REST call to add or update and modify state
		const response = isNewVehicle ?
			await apis.addVehicle(vehicle)
			:
			await apis.updateVehicle(vehicle);

		if (response.statusCode < 400) {
			dispatchVehicles({
				type: isNewVehicle ? 'add' : 'update',
				payload: response.payload
			});

			handleNotifier(
				response.statusType,
				response.message
			);

			// Rerender component since a new vehicle
			// was added to the list
			if (isNewVehicle) {
				navigate('/vehicles');
			}
		} else {
			handleNotifier(
				response.statusType,
				response.message
			);
		}
	}

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
						onHandleDelete={ hanleDelete }
					/>
				} />
				<Route path='create' element={
					<Modify
						onHandleSubmit={ handleSubmit }
						onHandleNotifier={ handleNotifier }
					/> } />
				<Route path='edit/:key' element={
					<Modify
						onHandleSubmit={ handleSubmit }
						onHandleNotifier={ handleNotifier }
					/>
				} />
				<Route path='information/:key/*' element={
					<Information />
				} />
			</Routes>
		</React.Fragment>
	)
}
