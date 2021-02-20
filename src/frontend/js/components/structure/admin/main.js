import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Routes, Route } from 'react-router-dom';
import AppContext from '../../../appcontext';
import VehiclesDashboard from '../../domains/admin/vehicle/dashboard';
import VehiclesList from '../../domains/admin/vehicle/list'
import VehiclesModify from '../../domains/admin/vehicle/modify';
import PropertiesDashboard from '../../domains/admin/property/dashboard';
import BusinessesDashboard from '../../domains/admin/business/dashboard';
import BusinessesList from '../../domains/admin/business/list';
import VehiclesMenu from './leftmenu/vehiclesmenu';
import PropertiesMenu from './leftmenu/propertiesmenu';
import BusinessesMenu from './leftmenu/businessesmenu';
import ApiMenu from './leftmenu/apimenu';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
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
	}
}));

/**
 * Main component for admin menu
 *
 * Contains:
 * Nested routes
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function Main() {
	const apis = useContext(AppContext);
	const classes = useStyles();

	const initialValues = {
		openDrawer: true,
		showAdmin: false
	};

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
									<DeveloperBoardIcon />
								</ListItemIcon>
								<ListItemText primary='Admin' />
							</ListItem>
							<Divider />
								<VehiclesMenu />
							<Divider />
								<PropertiesMenu />
							<Divider />
								<BusinessesMenu />
							<Divider />
							<List>
								<ApiMenu />
							</List>								
						</List>
					</Drawer>
					<div className={classes.appBarSpacer} />
					<Routes>
						<Route path='vehicles/dashboard' element={ <VehiclesDashboard /> } />
						<Route path='vehicles/list' element={ <VehiclesList /> } />
						<Route path='properties/dashboard' element={ <PropertiesDashboard /> } />
						<Route path='businesses/dashboard' element={ <BusinessesDashboard /> } />
						<Route path='businesses/list' element={ <BusinessesList /> } />
					</Routes>
				</React.Fragment>
			)}
		</div>
	)
}
