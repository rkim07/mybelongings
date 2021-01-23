import React from 'react';
import { withRouter } from 'react-router';
import { withStyles }  from '@material-ui/core/styles';
import Header from './components/structure/default/header';
import Footer from './components/structure/default/footer';
import {Route, Switch} from 'react-router-dom';
import LandingPage from './components/structure/default/landing';
import Login from './components/domains/auth/login';
import CreateLogin from './components/domains/auth/registration';
import ProtectedRoute from './components/structure/protectedroute';
import Profile from './components/domains/users/profile';
import PropertiesDashboard from './components/domains/properties/dashboard';
import VehiclesDashboard from './components/domains/vehicles/dashboard';
import NotFound from './components/structure/notfound';

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	title: {
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'block'
		}
	},
	grow: {
		flexGrow: 1
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex'
		}
	},
	sectionMobile: {
		display: 'flex',
		[theme.breakpoints.up('md')]: {
			display: 'none'
		}
	}
});

function App(props) {
	const { classes, ...other } = props;

	return (
		<div className={classes.root}>
			<Header {...props} />
			<Switch>
				<Route exact path='/' render={(routeProps) => <LandingPage {...routeProps} />}/>
				<Route path='/login' render={(routeProps) => <Login {...routeProps} redirectUrl='/vehicles' />}/>
				<Route exact path='/registration/email/:accessToken/:email' render={(routeProps) => <CreateLogin {...routeProps} {...other} />}/>
				<ProtectedRoute path='/profile' component={ Profile } />
				<ProtectedRoute path='/properties' component={ PropertiesDashboard } />
				<ProtectedRoute path='/vehicles' component={ VehiclesDashboard } />
				<Route path='*' component={ NotFound } />
			</Switch>
			<Footer />
		</div>
	)
}

export default withRouter(withStyles(styles)(App));
