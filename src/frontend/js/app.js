import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppContext from './appcontext';
import ProtectedRoute from './components/structure/protectedroute';
import Header from './components/structure/default/header';
import Footer from './components/structure/default/footer';
import LandingPage from './components/structure/default/landing';
import Login from './components/domains/auth/login';
import LostPassword from './components/domains/auth/lostpassword';
import Signup from './components/domains/auth/signup';
/*import Profile from './components/domains/users/profile';
import PropertiesDashboard from './components/domains/properties/dashboard';*/
import VehiclesDashboard from './components/domains/vehicles/dashboard';
import NotFound from './components/structure/notfound';
import globalApis from './apis/apis';

function App() {
	return (
		<AppContext.Provider value={ globalApis }>
			<Router>
				<div style={{ flexGrow: 1 }}>
					<Header />
					<Routes>
						<Route path='/' element={<LandingPage />} />
						<Route path='login' element={ <Login redirectUrl='/vehicles' />} />
						<Route path='signup' element={ <Signup redirectUrl='login' />} />
						<Route path='account/password/lost' element={ <LostPassword />} />
						<Route path='account/password/reset/:email/:resetCode' element={ <LandingPage redirectUrl='login' />} />
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
