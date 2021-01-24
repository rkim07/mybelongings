import React from 'react';
import { Link } from 'react-router-dom'
import { withStyles }  from '@material-ui/core/styles';
import { withContext } from '../../../contexts/appcontext';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import {RecentActors} from "@material-ui/icons";

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

class Header extends React.Component
{
	// Constructor
	constructor(props) {
		super(props);

		this.state = {
			anchor: null,
			mobileAnchor: null
		}

		this.onHandleProfileMenuOpen = this.onHandleProfileMenuOpen.bind(this);
		this.onHandleMenuClose = this.onHandleMenuClose.bind(this);
		this.onHandleMobileMenuOpen = this.onHandleMobileMenuOpen.bind(this);
		this.onHandleMobileMenuClose = this.onHandleMobileMenuClose.bind(this);
	}

	onHandleProfileMenuOpen = event => {
		this.setState({
			anchor: event.currentTarget
		});
	};

	onHandleMenuClose = () => {
		this.setState({
			anchor: null,
			mobileAnchor: null
		});
	};

	onHandleMobileMenuOpen = event => {
		this.setState({ mobileAnchor: event.currentTarget });
	};

	onHandleMobileMenuClose = () => {
		this.setState({ mobileAnchor: null });
	};

	render() {
		const { anchor, mobileAnchor } = this.state;
		const { classes, ...other } = this.props;
		const isMenuOpen = Boolean(anchor);
		const isMobileMenuOpen = Boolean(mobileAnchor);

		const desktopSection =
			<div className={classes.sectionDesktop}>
				{ !this.props.accessToken ? (
					<Button color='primary' variant='outlined' component={Link} to='/login'>Login</Button>
				) : (
					<React.Fragment>
						<Button component={Link} to='/properties'>Properties</Button>
						<Button component={Link} to='/vehicles'>Vehicles</Button>
						<IconButton
							aria-owns={isMenuOpen ? 'material-appbar' : undefined}
							aria-haspopup='true'
							onClick={this.onHandleProfileMenuOpen}
							color='inherit'>
							<AccountCircle />
						</IconButton>
					</React.Fragment>
				)}
			</div>;

		const mobileSection =
			<div className={classes.sectionMobile}>
				{ !this.props.accessToken ? (
					<Button color='primary' variant='outlined' component={Link} to='/login'>Login</Button>
				) : (
					<IconButton aria-haspopup='true' onClick={this.onHandleMobileMenuOpen} color='inherit'>
						<MoreIcon/>
					</IconButton>
				)}
			</div>;

		const renderDesktopMenu =
			<Menu
				anchorEl={anchor}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={isMenuOpen}
				onClose={this.onHandleMenuClose}>
				<MenuItem onClick={this.onHandleMenuClose} component={Link} to='/profile'>
					My Account
				</MenuItem>
				<MenuItem onClick={() => {
					this.onHandleMenuClose();
					this.props.logout();
				}
				}>Logout
				</MenuItem>
			</Menu>;

		const renderMobileMenu =
			<Menu
				anchorEl={mobileAnchor}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={isMobileMenuOpen}
				onClose={this.onHandleMobileMenuClose}>
				<MenuItem onClick={this.onHandleMobileMenuClose}>
					<Button component={Link} to='/properties/dashboard'>Properties</Button>
				</MenuItem>
				<MenuItem onClick={this.onHandleMobileMenuClose}>
					<Button component={Link} to='/vehicles'>Vehicles</Button>
				</MenuItem>
				<MenuItem onClick={this.onHandleMobileMenuClose}>
					<Button component={Link} to='/profile'>Profile</Button>
				</MenuItem>
				<MenuItem onClick={this.onHandleMobileMenuClose}>
					<Button component={Link} to='/logount'>Logount</Button>
				</MenuItem>
			</Menu>;

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
}

export default withContext(withStyles(styles)(Header));
