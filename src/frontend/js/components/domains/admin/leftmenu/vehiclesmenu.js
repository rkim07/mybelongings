import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DirectionsCar from '@material-ui/icons/DirectionsCar';
import { AddBox, Ballot, ExpandLess, ExpandMore } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	nested: {
		paddingLeft: theme.spacing(4)
	}
}));

/**
 * Child component for admin menu
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function VehiclesMenu() {
	const classes = useStyles();

	const initialValues = {
		openVehiclesSubMenu: false
	};

	const [values, setValues] = useState(initialValues);

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

	return (
		<React.Fragment>
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
						to='vehicles/dashboard'
					>
						<ListItemIcon>
							<AddBox />
						</ListItemIcon>
						<ListItemText primary='Dashboard' />
					</ListItem>
					<ListItem
						button
						className={classes.nested}
						component={ Link }
						to='vehicles/main'
					>
						<ListItemIcon>
							<Ballot />
						</ListItemIcon>
						<ListItemText primary='List' />
					</ListItem>
				</List>
			</Collapse>
		</React.Fragment>
	)
}
