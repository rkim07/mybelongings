import React, {useContext, useEffect, useState} from 'react';
import * as _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import AppContext from '../../../appcontext';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	appBar: {
		backgroundColor: '#404040',
		borderBottom: `1px solid ${theme.palette.divider}`,
		color: '#FFFFFF'
	},
	toolbar: {
		flexWrap: 'wrap'
	},
	toolbarTitle: {
		flexGrow: 1
	},
	desktopSection: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex'
		},
		color: '#FFFFFF'
	},
	mobileSection: {
		display: 'flex',
		[theme.breakpoints.up('md')]: {
			display: 'none'
		}
	}
}));

const desktopMenuItems = [
	'properties', 'vehicles',
]

export default function Header() {
	const navigate = useNavigate();
	const apis = useContext(AppContext);
	const classes = useStyles();

	const initialValues = {
		anchor: null,
		mobileAnchor: null,
	}

	const [values, setValues] = useState(initialValues);

	// Handle anchor
	const handleAnchor = (value) => {
		setValues({
			...values,
			anchor: value
		})
	}

	// Handle mobile anchor
	const handleMobileAnchor = (value) => {
		setValues({
			...values,
			mobileAnchor: value
		})
	}

	// Reset anchors
	const resetAnchors = () => {
		setValues({
			...values,
			anchor: '',
			mobileAnchor: ''
		})
	}

	// Handle signout
	const handleSignOut = () => {
		resetAnchors();
		apis.signout().then(response => {
			navigate('/');
		});
	};

	return (
		<React.Fragment>
			<AppBar position='static' color='default' elevation={0} className={classes.appBar}>
				<Toolbar className={classes.toolbar}>
					<Typography variant='h6' color='inherit' className={classes.toolbarTitle}  noWrap>
						MyBelongings
					</Typography>
					{ !apis.isSignedIn() ? (
						<Button
							color='primary'
							variant='outlined'
							component={Link} to='/account/signin'
						>
							Login
						</Button>
					) : (
						<React.Fragment>
							{/* Desktop nav */}
							<nav className={classes.desktopSection}>
								<Button
									component={Link}
									to='/properties'
								>
									Properties
								</Button>
								<Button
									component={Link}
									to='/vehicles'
								>
									Vehicles
								</Button>
								<IconButton
									aria-owns={ Boolean(values.anchor) && 'material-appbar' }
									aria-haspopup='true'
									onClick={ e => handleAnchor(e.currentTarget) }
									color='inherit'>
									<AccountCircle />
								</IconButton>
							</nav>

							{/* Mobile nav */}

							<nav className={classes.mobileSection}>
								<IconButton
								aria-haspopup='true'
								color='inherit'
								onClick={ e => handleMobileAnchor(e.currentTarget) }
								>
								<MoreIcon/>
								</IconButton>
							</nav>

							{/* Desktop & mobile menu */}

							<Menu
								anchorEl={ values.mobileAnchor }
								anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
								transformOrigin={{ vertical: 'top', horizontal: 'right' }}
								open={ Boolean(values.mobileAnchor) }
								onClose={ e => handleMobileAnchor('') }>
								<MenuItem
									component={Link}
									to='/properties'
									onClick={ e => handleMobileAnchor('') }
								>
									Properties
								</MenuItem>
								<MenuItem
									component={Link}
									to='/vehicles'
									onClick={ e => handleMobileAnchor('') }
								>
									Vehicles
								</MenuItem>
								<MenuItem
									component={Link}
									to='/profile'
									onClick={ e => handleMobileAnchor('') }
								>
									My Account
								</MenuItem>
								<MenuItem
									onClick={ handleSignOut }
								>
									Logout
								</MenuItem>
							</Menu>

							{/* Mobile menu */}

							<Menu
								anchorEl={ values.anchor }
								anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
								transformOrigin={{ vertical: 'top', horizontal: 'right' }}
								open={ Boolean(values.anchor) }
								onClose={ resetAnchors }
							>
								<MenuItem
									component={Link}
									to='/profile'
									onClick={ resetAnchors }
								>
									My Account
								</MenuItem>
								<MenuItem
									onClick={ handleSignOut }
								>
									Logout
								</MenuItem>
							</Menu>
						</React.Fragment>
					)}
				</Toolbar>
			</AppBar>
		</React.Fragment>
	)
}
