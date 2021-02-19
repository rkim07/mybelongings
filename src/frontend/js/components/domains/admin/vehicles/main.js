import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../../../appcontext';
import { modifyState, removeFromState } from '../../../../apis/helpers/collection';
import Dialogger from './dialogger';
import Notifier from '../../../shared/feedback/notifier';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import DirectionsCar from '@material-ui/icons/DirectionsCar';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import StoreIcon from '@material-ui/icons/Store';
import DeleteIcon from '@material-ui/icons/Delete';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const CustomTableCell = withStyles(theme => ({
	head: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	body: {
		fontSize: 14,
	},
}))(TableCell);

const useStyles = makeStyles((theme) => ({
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
	paper: {
		marginTop: theme.spacing(4),
		flexGrow: 1,
		alignItems: 'center'
	},
	table: {
		minWidth: 700,
	},
	row: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.background.default,
		},
	},
}));

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
 * Main component
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function Main() {
	const notifierRef = useRef();
	const dialoggerRef = useRef();
	const apis = useContext(AppContext);
	const classes = useStyles();

	const [loading, setLoading] = useState(true);
	const [vehicles, dispatchVehicles] = useReducer(vehiclesReducer, []);

	// Get all vehicles
	useEffect(() => {
		apis.getVehicles().then(response => {
			if ((response.statusCode < 400) && (response.payload.length > 0)) {
				handleAdd(response);

				setLoading(false);
			} else if (response.payload.length === 0) {
				setLoading(false);
			}
		});
	}, []);

	// Handle submit
	const handleSubmit = async(values) => {
		const vehicle = values.vehicle;

		const isNewVehicle = vehicle.key ? false : true;

		// Make REST call to upload file
		if (values.image.length) {
			const upload = await apis.uploadFile(values.image[0]);

			if (upload) {
				vehicle.image = upload.payload;
			}
		}

		if (values.file.length) {
			const upload = await apis.uploadFile(values.file[0]);

			if (upload) {
				vehicle.purchase.agreement = upload.payload;
			}
		}

		// Make REST call to add or update and modify state
		const response = isNewVehicle ?
			await apis.addVehicle(vehicle)
			:
			await apis.updateVehicle(vehicle);

		if (response.statusCode < 400) {
			// Rerender component since a new vehicle
			// was added to the list
			if (isNewVehicle) {
				handleAdd(response);
			} else {
				handleUpdate(response);
			}
		} else {
			handleNotifier(response.statusType, response.message);
		}
	}

	// Handle add vehicle to collection
	const handleAdd = (response) => {
		dispatchVehicles({
			type: 'add',
			payload: response.payload
		});

		handleNotifier(response.statusType, response.message);
	}

	// Handle update vehicle from collection
	const handleUpdate = (response) => {
		dispatchVehicles({
			type: 'update',
			payload: response.payload
		});

		handleNotifier(response.statusType, response.message);
	}

	// Handle delete vehicle from collection
	const handleDelete = async(key) => {
		const response = await apis.deleteVehicle(key);

		if (response.statusCode < 400) {
			dispatchVehicles({
				type: 'delete',
				payload: response.payload.key
			});
		}

		handleNotifier(response.statusType, response.message);
	}

	// Notifier
	const handleNotifier = (statusType, message) => {
		notifierRef.current.openNotifier(statusType, message);
	}

	return (
		<Container maxWidth='lg' className={classes.container}>
			<div className={classes.paper}>
				<Notifier ref={ notifierRef } />
				<Dialogger ref={ dialoggerRef } />
				<Grid container justify='flex-end'>
					<Grid item>
						<Button
							size='small'
							type='button'
							variant='contained'
							color='default'
							className={classes.button}
							startIcon={<DirectionsCarTwoToneIcon />}
							onClick={ () => dialoggerRef.current.openDialogger('add', {
								activeStep: 0,
								onHandleSubmit: handleSubmit
							})}
						>
							Add new vehicle
						</Button>
					</Grid>
				</Grid>
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<CustomTableCell>Year</CustomTableCell>
							<CustomTableCell align='left'>Manufacturer</CustomTableCell>
							<CustomTableCell align='left'>Model</CustomTableCell>
							<CustomTableCell align='left'>VIN</CustomTableCell>
							<CustomTableCell align='left'>Created</CustomTableCell>
							<CustomTableCell align='left'></CustomTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{ ( loading ? Array.from(new Array(5)) : vehicles).map((vehicle, index) => (
							vehicle ? (
								<TableRow className={classes.row} key={vehicle.key}>
									<CustomTableCell component='th' scope='row'>{vehicle.year}</CustomTableCell>
									<CustomTableCell align='left'>{ vehicle.mfrName}</CustomTableCell>
									<CustomTableCell align='left'>{ vehicle.model}</CustomTableCell>
									<CustomTableCell align='left'>{ vehicle.vin}</CustomTableCell>
									<CustomTableCell align='left'>{ vehicle.created}</CustomTableCell>
									<CustomTableCell align='left'>
										<IconButton
											aria-label='edit-details'
											color='default'
											onClick={ () => dialoggerRef.current.openDialogger('update', {
												vehicleKey: vehicle.key,
												activeStep: 0,
												onHandleSubmit: handleSubmit
											})}
										>
											<DirectionsCarIcon />
										</IconButton>
										<IconButton
											aria-label='edit-purchase'
											color='default'
											onClick={ () => dialoggerRef.current.openDialogger('update', {
												vehicleKey: vehicle.key,
												activeStep: 1,
												onHandleSubmit: handleSubmit
											})}
										>
											<StoreIcon />
										</IconButton>
										<IconButton
											aria-label='view'
											color='default'
											onClick={ () => dialoggerRef.current.openDialogger('delete', {
												vehicleKey: vehicle.key,
												onHandleDelete: handleDelete
											})}
										>
											<DeleteIcon />
										</IconButton>
									</CustomTableCell>
								</TableRow>
							) : (
								<TableRow className={classes.row} key={index}>
									<CustomTableCell component='th' scope='row'>
										<Skeleton width={210} />
									</CustomTableCell>
									<CustomTableCell align='left'>
										<Skeleton width={210} />
									</CustomTableCell>
									<CustomTableCell align='left'>
										<Skeleton width={210} />
									</CustomTableCell>
									<CustomTableCell align='left'>
										<Skeleton width={210} />
									</CustomTableCell>
									<CustomTableCell align='left'>
										<Skeleton width={210} />
									</CustomTableCell>
									<CustomTableCell align='left'>
										<Skeleton width={210} />
									</CustomTableCell>
								</TableRow>
							)
						))}
					</TableBody>
				</Table>
			</div>
		</Container>
	);
}
