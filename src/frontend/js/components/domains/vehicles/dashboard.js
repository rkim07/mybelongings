import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withContext } from '../../../appcontext';
import { currentYear } from '../../shared/helpers/date';
import { modifyState, removeFromState } from '../../../apis/helpers/collection';
import List from './list';
import Manage from './manage';
import Details from './details';
import Dialogger from '../../shared/dialogger';
import Notifier from '../../shared/notifier';
import Container from '@material-ui/core/Container';
import NotFound from '../../structure/notfound';

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


function Dashboard(props) {
	const {
		classes,
		getUserVehicles, // api call
		uploadFile, // api call
		addVehicle, // api call
		updateVehicle, // api call
		deleteVehicle // api call
	} = props;

	const navigate = useNavigate();

	const [openNotifier, setOpenNotifier] = useState(false);
	const [notifierType, setNotifierType] = useState('success');
	const [notifierMsg, setNotifierMsg] = useState('');
	const [openDialog, setOpenDialog] = useState(false);
	const [dialogType, setDialogType] = useState();
	const [dialogParams, setDialogParams] = useState();
	const [loading, setLoading] = useState(true);

	const [, forceUpdate] = useReducer(x => x + 1, 0);

	/**
	 * Get all user's vehicles
	 */
	const[vehicles, dispatchVehicles] = useReducer(vehiclesReducer, []);

	useEffect(() => {
		getUserVehicles().then(response => {
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
			const upload = await uploadFile(file[0]);

			if (upload) {
				vehicle.image = upload.payload;
			}
		}

		// Make REST call to add or update and modify state
		const response = isNewVehicle ?
			await addVehicle(vehicle)
			:
			await updateVehicle(vehicle);

		if (response.statusCode < 400) {
			dispatchVehicles({
				type: isNewVehicle ? 'add' : 'update',
				payload: response.payload
			});

			handleNotifier(response.statusType, response.message);

			// Rerender component
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
		const response = await deleteVehicle(key);

		if (response.statusCode < 400) {
			dispatchVehicles({
				type: 'delete',
				payload: response.payload.key
			});

			handleDialog();
		}

		handleNotifier(response.statusType, response.message);
	}

	const handleDialog = (type = null, key = null) => {
		setDialogType(type);
		setDialogParams(key);
		setOpenDialog(!openDialog);
	}

	const handleNotifier = (type = null, msg = null) => {
		setOpenNotifier(!openNotifier);
		setNotifierType(type);
		setNotifierMsg(msg);
	}

	return (
		<Container className={classes.cardGrid} maxWidth="md">
			{ openNotifier && (
				<Notifier
					open={ openNotifier }
					type={ notifierType }
					message={ notifierMsg }
					onHandleNotifier={ handleNotifier }
				/>
			)}
			{ openDialog && (
				<Dialogger
					open={ openDialog }
					type={ dialogType }
					params={ dialogParams }
					onHandleDelete={ hanleDelete }
					onHandleDialog={ handleDialog }
				/>
			)}
			<Routes>
				<Route path="/" element={
					<List
						loading={ loading }
						vehicles={ vehicles }
						onHandleDialog={ handleDialog }
					/>
				} />
				<Route path="/create" element={
					<Manage
						onHandleSubmit={ handleSubmit }
					/> } />
				<Route path="/edit/:key" element={
					<Manage
						onHandleSubmit={ handleSubmit }
					/>
				} />
				<Route path='/*' element={<NotFound/> } />
			</Routes>
		</Container>
	)
}

export default withContext(withStyles(styles)(Dashboard));
