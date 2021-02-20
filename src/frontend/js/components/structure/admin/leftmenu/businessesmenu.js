import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import BusinessIcon from '@material-ui/icons/Business';
import ListIcon from '@material-ui/icons/List';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	nested: {
		paddingLeft: theme.spacing(4)
	}
}));

const initialValues = {
	openBusinessesSubMenu: false
};

/**
 * Child component for admin menu
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function BusinessesMenu() {
	const classes = useStyles();
	const [values, setValues] = useState(initialValues);

	// Handle when admin vehicle section opens
	const handleBusinessesDrawerOpen = () => {
		setValues({
			...values,
			openBusinessesSubMenu: true
		});
	};

	// Handle when admin vehicle section closes
	const handleBusinessesDrawerClose = () => {
		setValues({
			...values,
			openBusinessesSubMenu: false
		});
	};

	// Handle when admin vehicle sub section opens and closes
	const handleBusinessesSubMenuClick = () => {
		setValues({
			...values,
			openBusinessesSubMenu: !values.openBusinessesSubMenu
		});
	};

	return (
		<React.Fragment>
			<ListItem button onClick={ handleBusinessesSubMenuClick }>
				<ListItemIcon>
					<BusinessIcon />
				</ListItemIcon>
				<ListItemText primary='Businesses' />
				{ values.openBusinessesSubMenu ? <ExpandLess /> : <ExpandMore /> }
			</ListItem>
			<Collapse in={ values.openBusinessesSubMenu } timeout='auto' unmountOnExit>
				<List component='div' disablePadding>
					<ListItem
						button
						className={classes.nested}
						component={ Link }
						to='businesses/dashboard'
					>
						<ListItemIcon>
							<DashboardIcon />
						</ListItemIcon>
						<ListItemText primary='Dashboard' />
					</ListItem>
					<ListItem
						button
						className={classes.nested}
						component={ Link }
						to='businesses/list'
					>
						<ListItemIcon>
							<ListIcon />
						</ListItemIcon>
						<ListItemText primary='List' />
					</ListItem>
				</List>
			</Collapse>
		</React.Fragment>
	)
}
