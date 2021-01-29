import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppContext from '../../../appcontext';
import Notifier from '../../shared/feedback/notifier';
import { currentYear } from '../../shared/helpers/date';
import { modifyState, removeFromState } from '../../../apis/helpers/collection';
import Container from '@material-ui/core/Container';
import List from './list';
import Modify from './modify';
import { Info } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";
import Details from "./details";

const styles = theme => ({
	root: {
		flexGrow: 1
	},
	cardGrid: {
		paddingTop: theme.spacing(8),
		paddingBottom: theme.spacing(8),
	}
});

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
function Dashboard(props) {
	const navigate = useNavigate();
	const apis = useContext(AppContext);
	const notifierRef = useRef();

	const { classes } = props;
	const [loading, setLoading] = useState(true);

	/**
	 * Get all user's vehicles
	 */
	const [vehicles, dispatchVehicles] = useReducer(vehiclesReducer, []);

	useEffect(() => {
		apis.getUserVehicles().then(response => {
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

	const handleSubmit = async(e, file, vehicle) => {
		e.preventDefault();

		const isNewVehicle = vehicle.key ? false : true;

		// Make REST call to upload file
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

			notifierRef.current.openNotifier(response.statusType, response.message);

			// Rerender component since a new vehicle
			// was added to the list
			if (isNewVehicle) {
				navigate('/vehicles');
			}
		}
	}

	/**
	 * Delete vehicle
	 * @param e
	 * @param key
	 * @returns {Promise<void>}
	 */
	const hanleDelete = async(key) => {
		const response = await apis.deleteVehicle(key);

		if (response.statusCode < 400) {
			dispatchVehicles({
				type: 'delete',
				payload: response.payload.key
			});
		}

		notifierRef.current.openNotifier(response.statusType, response.message);
	}

	return (
		<Container className={classes.cardGrid} maxWidth="md">
			<Notifier ref={ notifierRef }/>
			<Routes>
				<Route path="/" element={
					<List
						loading={ loading }
						vehicles={ vehicles }
						onHandleDelete={ hanleDelete }
					/>
				} />
				<Route path="create" element={
					<Modify
						onHandleSubmit={ handleSubmit }
					/> } />
				<Route path="edit/:key" element={
					<Modify
						onHandleSubmit={ handleSubmit }
					/>
				} />
				<Route path="details/:key/*" element={
					<Details />
				} />
			</Routes>
		</Container>
	)
}

export default withStyles(styles)(Dashboard);
