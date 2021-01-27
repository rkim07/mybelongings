import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { withStyles }  from '@material-ui/core/styles';
import { withContext } from '../../../appcontext';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import { RecentActors } from '@material-ui/icons';

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	title: {
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'block',
		},
	},
	grow: {
		flexGrow: 1,
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex',
		},
	},
	sectionMobile: {
		display: 'flex',
		[theme.breakpoints.up('md')]: {
			display: 'none',
		},
	},
});

function Header(props) {
	const navigate = useNavigate();
	const { classes, isLoggedIn, logout } = props;

	const [anchor, setAnchor] = useState(null);
	const [mobileAnchor, setMobileAnchor] = useState(null);

	const isMenuOpen = Boolean(anchor);
	const isMobileMenuOpen = Boolean(mobileAnchor);

	const desktopSection =
		<div className={classes.sectionDesktop}>
			{ !isLoggedIn() ? (
				<Button
					color='primary'
					variant='outlined'
					component={Link} to='/login'
				>
					Login
				</Button>
			) : (
				<React.Fragment>
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
				</React.Fragment>
			)}
		</div>;

	const mobileSection =
		<div className={classes.sectionMobile}>
			{ !isLoggedIn() ? (
				<Button
					color='primary'
					variant='outlined'
					component={Link}
					to='/login'
				>
					Login
				</Button>
			) : (
				<IconButton
					aria-haspopup='true'
					color='inherit'
					onClick={ e => setMobileAnchor(e.currentTarget) }
				>
					<MoreIcon/>
				</IconButton>
			)}
		</div>;

	const renderDesktopMenu =
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
			<MenuItem onClick={ onHandleLogout }>
				Logout
			</MenuItem>
		</Menu>;

	const renderMobileMenu =
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
			<MenuItem onClick={ onHandleLogout }>
				Logout
			</MenuItem>
		</Menu>;

	function onHandleLogout() {
		setAnchor('');
		setMobileAnchor('');
		logout().then(response => {
			navigate('/');
		});
	}

	return (
		<React.Fragment>
			<AppBar position='static' color='default'>
				<Toolbar>
					<Typography className={classes.title} variant='h6' color='inherit' noWrap/>
					<div className={classes.grow} />
					{ desktopSection }
					{ mobileSection }
				</Toolbar>
			</AppBar>

			{ renderDesktopMenu }
			{ renderMobileMenu }
		</React.Fragment>
	)
}

export default withContext(withStyles(styles)(Header));
