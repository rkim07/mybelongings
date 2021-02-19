import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HouseIcon from '@material-ui/icons/House';
import { AddBox, Ballot, ExpandLess, ExpandMore } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	nested: {
		paddingLeft: theme.spacing(4)
	}
}));

const initialValues = {
	openPropertiesSubMenu: false
};

/**
 * Child component for admin menu
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function PropertiesMenu() {
	const classes = useStyles();
	const [values, setValues] = useState(initialValues);

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

	return (
		<React.Fragment>
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
		</React.Fragment>
	)
}
