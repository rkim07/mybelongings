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

const initialValues = {
	openStoresSubMenu: false
};

/**
 * Child component for admin menu
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function StoresMenu() {
	const classes = useStyles();
	const [values, setValues] = useState(initialValues);

	// Handle when admin vehicle section opens
	const handleStoresDrawerOpen = () => {
		setValues({
			...values,
			openStoresSubMenu: true
		});
	};

	// Handle when admin vehicle section closes
	const handleStoresDrawerClose = () => {
		setValues({
			...values,
			openStoresSubMenu: false
		});
	};

	// Handle when admin vehicle sub section opens and closes
	const handleStoresSubMenuClick = () => {
		setValues({
			...values,
			openStoresSubMenu: !values.openStoresSubMenu
		});
	};

	return (
		<React.Fragment>
			<ListItem button onClick={ handleStoresSubMenuClick }>
				<ListItemIcon>
					<DirectionsCar />
				</ListItemIcon>
				<ListItemText primary='Stores' />
				{ values.openStoresSubMenu ? <ExpandLess /> : <ExpandMore /> }
			</ListItem>
			<Collapse in={ values.openStoresSubMenu } timeout='auto' unmountOnExit>
				<List component='div' disablePadding>
					<ListItem
						button
						className={classes.nested}
						component={ Link }
						to='stores/add'
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
						to='stores/list'
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
