import React, { useEffect, useReducer, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withContext } from '../../../appcontext';
import { Routes, Route } from 'react-router-dom';
import List from './list';
import Manage from './manage';
import Details from './details';
import Dialogger from '../../shared/dialogger';
import Notifier from '../../shared/notifier';
import { currentYear } from '../../helpers/date';
import Container from '@material-ui/core/Container';

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
	switch(action.type) {
		case 'add':
			return state.concat(action.payload);
		case 'update':
			return this.state.map((vehicle) => {
				if (item.key === action.payload.key) {
					const updatedVehicle = {
						...vehicle,
						mfrKey: 'test'
					};

					return updatedVehicle;
				}
				return vehicle;
			});
		case 'delete':
			const update = [...state];
			update.splice(update.indexOf(action.payload), 1);
			return update;
		default:
			return state;
	}
}

function Dashboard(props) {
	const {
		classes,
		getUserVehicles,
		deleteVehicle
	} = props;

	const [openNotifier, setOpenNotifier] = useState(false);
	const [notifierType, setNotifierType] = useState('');
	const [notifierMsg, setNotifierMsg] = useState('');
	const [openDialog, setOpenDialog] = useState(false);
	const [dialogType, setDialogType] = useState();
	const [loading, setLoading] = useState(true);

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
			}
		});
	}, []);

	const handleSubmit = (type, payload) => {
		dispatchVehicles({
			type: 'type',
			payload: payload
		})
	}

	/**
	 * Delete vehicle
	 * @param e
	 * @param key
	 * @returns {Promise<void>}
	 */
	/*const onHanleDelete = async(e, key) => {
		e.preventDefault();
		const response = await deleteVehicle(key);

		if (response.status) {
			vehicles = removeFromCollection(key, vehicles);

			setOpenNotifier(true);
			setOpenDialog(false);
			setNotifierType(response.statusType);
			setNotifierMsg(response.message);
			setVehicles(vehicles);
		}
	}*/

	const handleOpenDialog = (type) => {
		setDialogType(type);
		setOpenDialog(true);
	}

	const handleCloseDialog = () => {
		setOpenDialog(false);
	}

	const handleOpenNotifier = (type, msg) => {
		setOpenNotifier(true);
		setNotifierType(type);
		setNotifierMsg(msg);
	}

	const handleCloseNotifier = () => {
		setOpenNotifier(!openNotifier);
		setNotifierMsg('');
	}

	return (
		<Container className={classes.cardGrid} maxWidth="md">
			{ openNotifier && (
				<Notifier
					open={ openNotifier }
					notifierType={ notifierType }
					notifierMsg={ notifierMsg }
					onHandleCloseNotifier={ handleCloseNotifier }
				/>
			)}
			{ openDialog && (
				<Dialogger
					open={ openDialog }
					dialogType={ dialogType }
					vehicle={ vehicle }
					onDelete={ handleSubmit }
					onHandleCloseDialog={ handleCloseDialog }
				/>
			)}
			<Routes>
				<Route path="/" element={
					<List
						loading={ loading }
						vehicles={ vehicles }
						onHandleOpenDialog={ handleOpenDialog }
					/>
				} />
				<Route path="/create" element={
					<Manage
						onHandleSubmit={ handleSubmit }
					/> } />
				<Route path="/edit/:key" element={
					<Manage
						onHandleSubmit={ handleSubmit }
						onHandleOpenNotifier={ handleOpenNotifier }
					/>
				} />
			</Routes>
		</Container>
	)
}

export default withContext(withStyles(styles)(Dashboard));
