import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AppContext from '../../../appcontext';
import VehiclesDashboard from './vehicles/dashboard';
import Modify from './vehicles/modify';
import VehiclesList from './vehicles/list';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {AddBox, Ballot, ExpandLess, ExpandMore, RecentActors} from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import HouseIcon from '@material-ui/icons/House';
import DirectionsCar from '@material-ui/icons/DirectionsCar';
import ListSubheader from '@material-ui/core/ListSubheader';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	toolbarIcon: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar,
	},
	drawerPaper: {
		position: 'relative',
		whiteSpace: 'nowrap',
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerPaperClose: {
		overflowX: 'hidden',
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		width: theme.spacing(7),
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9),
		},
	},
	appBarSpacer: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		height: '100vh',
		overflow: 'auto',
	},
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
	paper: {
		padding: theme.spacing(2),
		display: 'flex',
		overflow: 'auto',
		flexDirection: 'column',
	},
	fixedHeight: {
		height: 240,
	},
	nested: {
		paddingLeft: theme.spacing(4),
	},
}));

const initialValues = {
	openDrawer: true,
	openVehiclesSubMenu: false,
	openPropertiesSubMenu: false,
	showAdmin: false
};

/**
 * Main component for admin section
 *
 * Contains:
 * Nested routes
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Main(props) {
	const apis = useContext(AppContext);
	const classes = useStyles();
	const [values, setValues] = useState(initialValues);

	// Determine if user is an admin
	useEffect(() => {
		apis.isAdmin().then(response => {
			if (response.statusCode < 400) {
				setValues(prevState => ({
					...prevState,
					showAdmin: response.payload
				}));
			}
		});
	}, []);

	// Handle when admin vehicle section opens
	const handleVehiclesDrawerOpen = () => {
		setValues({
			...values,
			openVehiclesSubMenu: true
		});
	};

	// Handle when admin vehicle section closes
	const handleVehiclesDrawerClose = () => {
		setValues({
			...values,
			openVehiclesSubMenu: false
		});
	};

	// Handle when admin vehicle sub section opens and closes
	const handleVehiclesSubMenuClick = () => {
		setValues({
			...values,
			openVehiclesSubMenu: !values.openVehiclesSubMenu
		});
	};

	// Handle when admin property section opens
	const handlePropertiesDrawerOpen = () => {
		setValues({
			...values,
			openPropertiesSubMenu: true
		});
	};

	// Handle when admin property section closes
	const handlePropertiesDrawerClose = () => {
		setValues({
			...values,
			openPropertiesSubMenu: false
		});
	};

	// Handle when admin property sub section opens and closes
	const handlePropertiesSubMenuClick = () => {
		setValues({
			...values,
			openPropertiesSubMenu: !values.openPropertiesSubMenu
		});
	};

	const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

	return (
		<div className={classes.root}>
			{ values.showAdmin && (
				<React.Fragment>
					<Drawer
						variant='permanent'
						classes={{
							paper: clsx(classes.drawerPaper, !values.openDrawer && classes.drawerPaperClose),
						}}
						open={ values.openDrawer }
					>
						<List>
							<ListItem button>
								<ListItemIcon>
									<DashboardIcon />
								</ListItemIcon>
								<ListItemText primary='Main' />
							</ListItem>
							<ListItem button onClick={ handleVehiclesSubMenuClick }>
								<ListItemIcon>
									<DirectionsCar />
								</ListItemIcon>
								<ListItemText primary='Vehicles' />
								{ values.openVehiclesSubMenu ? <ExpandLess /> : <ExpandMore /> }
							</ListItem>
							<Collapse in={ values.openVehiclesSubMenu } timeout='auto' unmountOnExit>
								<List component='div' disablePadding>
									<ListItem
										button
										className={classes.nested}
										component={ Link }
										to='vehicles/add'
									>
										<ListItemIcon>
											<AddBox />
										</ListItemIcon>
										<ListItemText primary='Add' />
									</ListItem>
									<ListItem
										button
										className={classes.nested}
										component={ Link }
										to='vehicles/list'
									>
										<ListItemIcon>
											<Ballot />
										</ListItemIcon>
										<ListItemText primary='List' />
									</ListItem>
								</List>
							</Collapse>
							<ListItem button onClick={ handlePropertiesSubMenuClick }>
								<ListItemIcon>
									<HouseIcon />
								</ListItemIcon>
								<ListItemText primary='Properties' />
								{ values.openPropertiesSubMenu ? <ExpandLess /> : <ExpandMore /> }
							</ListItem>
							<Collapse in={ values.openPropertiesSubMenu } timeout='auto' unmountOnExit>
								<List component='div' disablePadding>
									<ListItem
										button
										className={classes.nested}
										component={ Link }
										to='properties/add'
									>
										<ListItemIcon>
											<AddBox />
										</ListItemIcon>
										<ListItemText primary='Add' />
									</ListItem>
									<ListItem
										button
										className={classes.nested}
										component={ Link }
										to='properties/list'
									>
										<ListItemIcon>
											<Ballot />
										</ListItemIcon>
										<ListItemText primary='List' />
									</ListItem>
								</List>
							</Collapse>
						</List>

						<Divider />

						<List>
							<ListSubheader inset>Saved reports</ListSubheader>
							<ListItem button>
								<ListItemIcon>
									<AssignmentIcon />
								</ListItemIcon>
								<ListItemText primary='Current month' />
							</ListItem>
							<ListItem button>
								<ListItemIcon>
									<AssignmentIcon />
								</ListItemIcon>
								<ListItemText primary='Last quarter' />
							</ListItem>
							<ListItem button>
								<ListItemIcon>
									<AssignmentIcon />
								</ListItemIcon>
								<ListItemText primary='Year-end sale' />
							</ListItem>
						</List>
					</Drawer>
					<div className={classes.appBarSpacer} />
					<Routes>
						<Route path='vehicles/dashboard' element={<VehiclesDashboard />} />
						<Route path='vehicles/add' element={<Modify />} />
						<Route path='vehicles/list' element={<VehiclesList />} />
					</Routes>
				</React.Fragment>
			)}
		</div>
	)
}
