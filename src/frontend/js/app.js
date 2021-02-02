import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppContext from "./appcontext";
import globalApis from './apis/apis';
import ProtectedRoute from './components/structure/protectedroute';
import Header from './components/structure/default/header';
import Footer from './components/structure/default/footer';
import LandingPage from './components/structure/default/landing';
import Login from './components/domains/auth/login';
import Lost from './components/domains/auth/lost';
import Reset from './components/domains/auth/reset';
import Signup from './components/domains/auth/signup';
import Activated from './components/domains/auth/activated';
/*import Profile from './components/domains/users/profile';
import PropertiesDashboard from './components/domains/property/dashboard';*/
import VehiclesDashboard from './components/domains/vehicle/dashboard';
import NotFound from './components/structure/notfound';

function App() {
	return (
		<AppContext.Provider value={ globalApis }>
			<Router>
				<div style={{ flexGrow: 1 }}>
					<Header />
					<Routes>
						<Route path='/' element={<LandingPage />} />
						<Route path='account/login' element={ <Login redirectUrl='/vehicles' />} />
						<Route path='account/signup' element={ <Signup redirectUrl='/account/login' />} />
						<Route path='account/activated/:param' element={ <Activated />} />
						<Route path='account/password/lost' element={ <Lost />} />
						<Route path='account/password/reset/:email/:resetCode' element={ <Reset redirectUrl='/account/login' />} />
						<ProtectedRoute path='vehicles/*' element={ <VehiclesDashboard/> } />
						{/*<ProtectedRoute path='properties/*' element={ <PropertiesDashboard/> } />*/}
						<Route path='/*' element={<NotFound/> } />
					</Routes>
					<Footer />
				</div>
			</Router>
		</AppContext.Provider>
	)
}

export default App;
