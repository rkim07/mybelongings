import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import LandingPage from '../../../components/structure/default/landing';
import CreateLogin from '../../domains/auth/registration';
import Login from '../../../components/domains/auth/login';
import Footer from '../../../components/structure/default/footer';
import Profile  from '../../domains/users/profile';
import PropertiesDashboard  from '../../domains/properties/dashboard';
import VehiclesDashboard  from '../../domains/vehicles/dashboard';
import ProtectedRoute from '../../../components/structure/protectedroute';
import NotFound from '../../../components/structure/notfound';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Link } from 'react-router-dom'
import { withStyles }  from '@material-ui/core/styles';
import { withContext } from '../../../contexts/appcontext';

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

class Section extends React.Component
{
	// Constructor
	constructor(props) {
		super(props);

		this.state = {
			anchorEl: null,
			mobileMoreAnchorEl: null
		}
	}

	handleProfileMenuOpen = event => {
		this.setState({
			anchorEl: event.currentTarget
		});
	};

	handleMenuClose = () => {
		this.setState({
			anchorEl: null,
			mobileMoreAnchorEl: null
		});
	};

	handleMobileMenuOpen = event => {
		this.setState({ mobileMoreAnchorEl: event.currentTarget });
	};

	handleMobileMenuClose = () => {
		this.setState({ mobileMoreAnchorEl: null });
	};


	render() {
		const { anchorEl, mobileMoreAnchorEl } = this.state;
		const { classes, ...other } = this.props;
		const isMenuOpen = Boolean(anchorEl);
		const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

		const desktopSection =
			<div className={classes.sectionDesktop}>
				{!this.props.token || !this.props.user ?
					<Button color='primary' variant='outlined' component={Link} to='/login'>Login</Button>
					:
					<div>
						<Button component={Link} to='/properties/dashboard'>Properties</Button>
						<Button component={Link} to='/vehicles/dashboard'>Vehicles</Button>
						<IconButton
							aria-owns={isMenuOpen ? 'material-appbar' : undefined}
							aria-haspopup='true'
							onClick={this.handleProfileMenuOpen}
							color='inherit'>
							<AccountCircle />
						</IconButton>
					</div>
				}
			</div>;

		const mobileSection =
			<div className={classes.sectionMobile}>
				{!this.props.token ?
					<Button color='primary' variant='outlined' component={Link} to='/login'>Login</Button>
					:
					<IconButton aria-haspopup='true' onClick={this.handleMobileMenuOpen} color='inherit'>
						<MoreIcon/>
					</IconButton>
				}
			</div>;

		const renderMenu =
			<Menu
				anchorEl={anchorEl}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={isMenuOpen}
				onClose={this.handleMenuClose}>
				<MenuItem onClick={this.handleMenuClose} component={Link} to='/profile'>
					My Account
				</MenuItem>
				<MenuItem onClick={() => {
					this.handleMenuClose();
					this.props.logout('user');
				}
				}>Logout
				</MenuItem>
			</Menu>;

		const renderMobileMenu =
			<Menu
				anchorEl={mobileMoreAnchorEl}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={isMobileMenuOpen}
				onClose={this.handleMenuClose}>
				<MenuItem onClick={this.handleMobileMenuClose}>
					<Button component={Link} to='/properties/dashboard'>Properties</Button>
				</MenuItem>
				<MenuItem onClick={this.handleMobileMenuClose}>
					<Button component={Link} to='/vehicles/dashboard'>Vehicles</Button>
				</MenuItem>
				<MenuItem onClick={this.handleMobileMenuOpen}>
					<IconButton
						aria-owns={isMenuOpen ? 'material-appbar' : undefined}
						aria-haspopup='true'
						onClick={this.handleProfileMenuOpen}
						color='inherit'>
						<AccountCircle />
					</IconButton>
				</MenuItem>
			</Menu>;

		return (
			<div className={classes.root}>
				<AppBar position='static' color='default'>
					<Toolbar>
						<Typography className={classes.title} variant='h6' color='inherit' noWrap/>
						<div className={classes.grow} />
						{ desktopSection }
						{ mobileSection }
					</Toolbar>
				</AppBar>
				{ renderMenu }
				{ renderMobileMenu }
				<Switch>
					<Route
						exact path='/'
						render={(routeProps) =>
							<LandingPage {...routeProps} />
						}
					/>
					<Route
						path='/login'
						render={(routeProps) =>
							<Login {...routeProps} section='user' redirectUrl='/properties/dashboard' />
						}
					/>
					<Route
						exact path='/registration/email/:token/:email'
						render={(routeProps) =>
							<CreateLogin {...routeProps} {...other} />
						}
					/>
					<ProtectedRoute path='/profile' component={ Profile } />
					<ProtectedRoute path='/properties' component={ PropertiesDashboard } />
					<ProtectedRoute path='/vehicles' component={ VehiclesDashboard } />
					<Route path='*' component={NotFound} />
				</Switch>
				<Footer />
			</div>
		)
	}
}

Section.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withContext(withStyles(styles)(Section));
