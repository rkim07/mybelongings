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
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import BusinessIcon from '@material-ui/icons/Business';
import EditLocationIcon from '@material-ui/icons/EditLocation';
import AddIcon from '@material-ui/icons/Add';
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
		paddingBottom: theme.spacing(4)
	},
	paper: {
		marginTop: theme.spacing(4),
		flexGrow: 1,
		alignItems: 'center'
	},
	table: {
		minWidth: 700
	},
	row: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.background.default
		},
	},
	button: {
		background: '#404040',
		color: 'white',
		height: 36,
		margin: theme.spacing(3, 0, 2)
	}
}));

const businessesReducer = (state, action) => {
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
	const [businesses, dispatchBusinesses] = useReducer(businessesReducer, []);

	// Get all businesses
	useEffect(() => {
		apis.getBusinesses().then(response => {
			if ((response.statusCode < 400) && (response.payload.length > 0)) {
				handleDispatchAdd(response);

				setLoading(false);
			} else if (response.payload.length === 0) {
				setLoading(false);
			}
		});
	}, []);

	// Handle backend delete
	const handleDelete = async(key) => {
		const response = await apis.deleteBusiness(key);

		if (response.statusCode < 400) {
			handleDispatchDelete(response);
		}

		notifierRef.current.openNotifier(response.statusType, response.message);
		dialoggerRef.current.closeDialogger();
	}

	// Handle backend submit
	const handleSubmit = async(business) => {
		const isNewBusiness = business.key ? false : true;

		// Make REST call to add or update and modify state
		const response = isNewBusiness ?
			await apis.addBusiness(business)
			:
			await apis.updateBusiness(business);

		if (response.statusCode < 400) {
			// Rerender component since a new business
			// was added to the list
			if (isNewBusiness) {
				handleDispatchAdd(response);
				dialoggerRef.current.closeDialogger();
			} else {
				handleDispatchUpdate(response);
			}

			notifierRef.current.openNotifier(response.statusType, response.message);
		} else {
			notifierRef.current.openNotifier(response.statusType, response.message);
		}
	}

	// Handle frontend add
	const handleDispatchAdd = (response) => {
		dispatchBusinesses({
			type: 'add',
			payload: response.payload
		});
	}

	// Handle frontend update
	const handleDispatchUpdate = (response) => {
		dispatchBusinesses({
			type: 'update',
			payload: response.payload
		});
	}

	// Handle delete business from collection
	const handleDispatchDelete = (response) => {
		dispatchBusinesses({
			type: 'delete',
			payload: response.payload.key
		});
	}

	return (
		<Container maxWidth='lg' className={classes.container}>
			<div className={classes.paper}>
				<Notifier ref={ notifierRef } />
				<Dialogger
					ref={ dialoggerRef }
					{ ...props }
				/>
				<Grid container justify='flex-end'>
					<Grid item>
						<Button
							size='small'
							type='button'
							variant='contained'
							color='default'
							className={classes.button}
							startIcon={<AddIcon />}
							onClick={ () => dialoggerRef.current.openDialogger('add', {
								activeStep: 0,
								onHandleSubmit: handleSubmit
							})}
						>
							Add new business
						</Button>
					</Grid>
				</Grid>
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<CustomTableCell>Name</CustomTableCell>
							<CustomTableCell align='left'>Address</CustomTableCell>
							<CustomTableCell align='left'>Landline</CustomTableCell>
							<CustomTableCell align='left'>Website</CustomTableCell>
							<CustomTableCell align='left'>Type</CustomTableCell>
							<CustomTableCell align='left'>Created</CustomTableCell>
							<CustomTableCell align='left'/>
						</TableRow>
					</TableHead>
					<TableBody>
						{ ( loading ? Array.from(new Array(5)) : businesses).map((business, index) => (
							business ? (
								<TableRow className={classes.row} key={ business.key }>
									<CustomTableCell component='th' scope='row'>{ business.name }</CustomTableCell>
									<CustomTableCell align='left'>{ business.address.street }</CustomTableCell>
									<CustomTableCell align='left'>{ business.landline }</CustomTableCell>
									<CustomTableCell align='left'>{ business.website }</CustomTableCell>
									<CustomTableCell align='left'>{ business.type }</CustomTableCell>
									<CustomTableCell align='left'>{ business.created }</CustomTableCell>
									<CustomTableCell align='left'>
										<IconButton
											aria-label='edit-details'
											color='default'
											onClick={ () => dialoggerRef.current.openDialogger('update', {
												businessKey: business.key,
												activeStep: 0,
												onHandleSubmit: handleSubmit
											})}
										>
											<BusinessIcon />
										</IconButton>
										<IconButton
											aria-label='edit-address'
											color='default'
											onClick={ () => dialoggerRef.current.openDialogger('update', {
												businessKey: business.key,
												activeStep: 1,
												onHandleSubmit: handleSubmit
											})}
										>
											<EditLocationIcon />
										</IconButton>
										<IconButton
											aria-label='view'
											color='default'
											onClick={ () => dialoggerRef.current.openDialogger('delete', {
												businessKey: business.key,
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
										<Skeleton width={100} />
									</CustomTableCell>
									<CustomTableCell align='left'>
										<Skeleton width={100} />
									</CustomTableCell>
									<CustomTableCell align='left'>
										<Skeleton width={100} />
									</CustomTableCell>
									<CustomTableCell align='left'>
										<Skeleton width={100} />
									</CustomTableCell>
									<CustomTableCell align='left'>
										<Skeleton width={100} />
									</CustomTableCell>
									<CustomTableCell align='left'>
										<Skeleton width={100} />
									</CustomTableCell>
									<CustomTableCell align='left'>
										<Skeleton width={150} />
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
