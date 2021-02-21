import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ComputerIcon from '@material-ui/icons/Computer';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SyncIcon from '@material-ui/icons/Sync';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	nested: {
		paddingLeft: theme.spacing(4)
	}
}));

const initialValues = {
	openApiSubMenu: false
};

/**
 * Child component for admin menu
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function ApiMenu() {
	const classes = useStyles();
	const [values, setValues] = useState(initialValues);

	// Handle when admin vehicle section opens
	const handleApiDrawerOpen = () => {
		setValues({
			...values,
			openApiSubMenu: true
		});
	};

	// Handle when admin vehicle section closes
	const handleApiDrawerClose = () => {
		setValues({
			...values,
			openApiSubMenu: false
		});
	};

	// Handle when admin vehicle sub section opens and closes
	const handleApiSubMenuClick = () => {
		setValues({
			...values,
			openApiSubMenu: !values.openApiSubMenu
		});
	};

	return (
		<React.Fragment>
			<ListItem button onClick={ handleApiSubMenuClick }>
				<ListItemIcon>
					<ComputerIcon />
				</ListItemIcon>
				<ListItemText primary='API' />
				{ values.openApiSubMenu ? <ExpandLess /> : <ExpandMore /> }
			</ListItem>
			<Collapse in={ values.openApiSubMenu } timeout='auto' unmountOnExit>
				<List component='div' disablePadding>
					<ListItem
						button
						className={classes.nested}
						component={ Link }
						to='apis/dashboard'
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
						to='apis/nhtsa/sync'
					>
						<ListItemIcon>
							<SyncIcon />
						</ListItemIcon>
						<ListItemText primary='NHTSA Sync' />
					</ListItem>
				</List>
			</Collapse>
		</React.Fragment>
	)
}
