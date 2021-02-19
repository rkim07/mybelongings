import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppContext from "./appcontext";
import globalApis from './apis/apis';
import ProtectedRoute from './components/structure/protectedroute';
import Header from './components/structure/default/header';
import Footer from './components/structure/default/footer';
import LandingPage from './components/structure/default/landing';
import AdminMain from './components/domains/admin/main';
import AdminUnauthorized from "./components/structure/adminunauthorized";
import Login from './components/domains/auth/signin';
import ResetEmail from './components/domains/auth/resetemail';
import Reset from './components/domains/auth/reset';
import Signup from './components/domains/auth/signup';
import Activated from './components/domains/auth/activated';
/*import Profile from './components/domains/users/profile';
import PropertiesDashboard from './components/domains/property/dashboard';*/
import VehiclesDashboard from './components/domains/vehicle/dashboard';
import NotFound from './components/structure/notfound';
import CssBaseline from '@material-ui/core/CssBaseline';

export default function App() {
	return (
		<AppContext.Provider value={ globalApis }>
			<Router>
				<CssBaseline />
				<Header />
				<Routes>
					<Route path='/' element={<LandingPage />} />
					<Route path='account/signin' element={ <Login redirectUrl='/vehicles' />} />
					<Route path='account/signup' element={ <Signup redirectUrl='/account/signin' />} />
					<Route path='account/activated/:param' element={ <Activated />} />
					<Route path='account/password/lost' element={ <ResetEmail />} />
					<Route path='account/password/reset/:email/:resetCode' element={ <Reset redirectUrl='/account/signin' />} />
					<Route path='admin/unauthorized' element={ <AdminUnauthorized />} />
					<ProtectedRoute path='admin/*' element={ <AdminMain />} />
					<ProtectedRoute path='vehicles/*' element={ <VehiclesDashboard /> } />
					{/*<ProtectedRoute path='properties/*' element={ <PropertiesDashboard/> } />*/}
					<Route path='/*' element={<NotFound/> } />
				</Routes>
				<Footer />
			</Router>
		</AppContext.Provider>
	)
}
