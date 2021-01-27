import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { withStyles }  from '@material-ui/core/styles';
import Header from './components/structure/default/header';
import Footer from './components/structure/default/footer';
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
			<Routes>
				<Route path='/' element={<LandingPage />}/>
				<Route path='/login' element={ <Login redirectUrl='/vehicles' />}/>
				<ProtectedRoute path='/vehicles/*' element={ <VehiclesDashboard/> } />
				<ProtectedRoute path='/properties/*' element={ <PropertiesDashboard/> } />
				<Route path='/*' element={<NotFound/> } />
			</Routes>
			<Footer />
		</div>
	)
}

export default withStyles(styles)(App);
