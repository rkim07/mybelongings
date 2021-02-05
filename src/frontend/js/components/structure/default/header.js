import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import AppContext from '../../../appcontext';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';

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

	const [anchor, setAnchor] = useState(null);
	const [mobileAnchor, setMobileAnchor] = useState(null);

	const isMenuOpen = Boolean(anchor);
	const isMobileMenuOpen = Boolean(mobileAnchor);

	function onHandleSignOut() {
		setAnchor('');
		setMobileAnchor('');
		apis.signout().then(response => {
			navigate('/');
		});
	}

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
									aria-owns={ isMenuOpen && 'material-appbar' }
									aria-haspopup='true'
									onClick={ e => setAnchor(e.currentTarget) }
									color='inherit'>
									<AccountCircle />
								</IconButton>
							</nav>

							{/* Mobile nav */}

							<nav className={classes.mobileSection}>
								<IconButton
								aria-haspopup='true'
								color='inherit'
								onClick={ e => setMobileAnchor(e.currentTarget) }
								>
								<MoreIcon/>
								</IconButton>
							</nav>

							{/* Desktop & mobile menu */}

							<Menu
								anchorEl={ mobileAnchor }
								anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
								transformOrigin={{ vertical: 'top', horizontal: 'right' }}
								open={ isMobileMenuOpen }
								onClose={ e => setMobileAnchor('') }>
								<MenuItem
									component={Link}
									to='/properties'
									onClick={ e => setMobileAnchor('') }
								>
									Properties
								</MenuItem>
								<MenuItem
									component={Link}
									to='/vehicles'
									onClick={ e => setMobileAnchor('') }
								>
									Vehicles
								</MenuItem>
								<MenuItem
									component={Link}
									to='/profile'
									onClick={ e => setMobileAnchor('') }
								>
									Profile
								</MenuItem>
								<MenuItem onClick={ onHandleSignOut }>
									Logout
								</MenuItem>
							</Menu>

							{/* Mobile menu */}

							<Menu
								anchorEl={ anchor }
								anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
								transformOrigin={{ vertical: 'top', horizontal: 'right' }}
								open={ isMenuOpen }
								onClose={ () => {
									setAnchor('');
									setMobileAnchor('')
								}}>
								<MenuItem
									component={Link}
									to='/profile'
									onClick={ () => {
										setAnchor('');
										setMobileAnchor('');
									}}>
									My Account
								</MenuItem>
								<MenuItem onClick={ onHandleSignOut }>
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
