import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../../../appcontext';
import Dialogger from '../../../shared/feedback/dialogger';
import Notifier from '../../../shared/feedback/notifier';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import DirectionsCar from '@material-ui/icons/DirectionsCar';
import Edit from '@material-ui/icons/Edit';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import StoreIcon from '@material-ui/icons/Store';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
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
		default:
			return state;
	}
}

/**
 * Child component of dashboard
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function List(props) {
	const notifierRef = useRef();
	const dialoggerRef = useRef();
	const apis = useContext(AppContext);
	const classes = useStyles();

	const [loading, setLoading] = useState(true);

	// Get all vehicles
	const [vehicles, dispatchVehicles] = useReducer(vehiclesReducer, []);

	useEffect(() => {
		apis.getVehicles().then(response => {
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

	// Notifier
	const handleNotifier = (statusType, message) => {
		notifierRef.current.openNotifier(statusType, message);
	}

	return (
		<Container maxWidth='lg' className={classes.container}>
			<div className={classes.paper}>
				<Notifier ref={ notifierRef }/>
				<Dialogger
					ref={ dialoggerRef }
					{ ...props }
				/>
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<CustomTableCell>Year</CustomTableCell>
							<CustomTableCell align='right'>Manufacturer</CustomTableCell>
							<CustomTableCell align='right'>Model</CustomTableCell>
							<CustomTableCell align='right'>VIN</CustomTableCell>
							<CustomTableCell align='right'>Created</CustomTableCell>
							<CustomTableCell align='right'></CustomTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{ ( loading ? Array.from(new Array(1)) : vehicles).map((vehicle, index) => (
							vehicle ? (
								<TableRow className={classes.row} key={vehicle.key}>
									<CustomTableCell component='th' scope='row'>{vehicle.year}</CustomTableCell>
									<CustomTableCell align='right'>{ vehicle.mfrName}</CustomTableCell>
									<CustomTableCell align='right'>{ vehicle.model}</CustomTableCell>
									<CustomTableCell align='right'>{ vehicle.vin}</CustomTableCell>
									<CustomTableCell align='right'>{ vehicle.created}</CustomTableCell>
									<CustomTableCell align='right'>
										<IconButton
											aria-label='edit-details'
											color='default'
											onClick={ () => dialoggerRef.current.openDialogger('update', {
												vehicleKey: vehicle.key,
												updateType: 'vehicle',
												activeStep: 0
											})}
										>
											<DirectionsCarIcon />
										</IconButton>
										<IconButton
											aria-label='edit-purchase'
											color='default'
											onClick={ () => dialoggerRef.current.openDialogger('update', {
												vehicleKey: vehicle.key,
												updateType: 'purchase',
												activeStep: 1
											})}
										>
											<StoreIcon />
										</IconButton>
										<IconButton
											aria-label='view'
											color='default'
											onClick={ () => dialoggerRef.current.openDialogger('delete', {
												vehicleKey: vehicle.key,
												onHandleDelete: hanleDelete
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
									<CustomTableCell align='right'>
										<Skeleton width={210} />
									</CustomTableCell>
									<CustomTableCell align='right'>
										<Skeleton width={210} />
									</CustomTableCell>
									<CustomTableCell align='right'>
										<Skeleton width={210} />
									</CustomTableCell>
									<CustomTableCell align='right'>
										<Skeleton width={210} />
									</CustomTableCell>
									<CustomTableCell align='right'>
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
