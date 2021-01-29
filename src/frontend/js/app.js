import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppContext from './appcontext';
import ProtectedRoute from './components/structure/protectedroute';
import Header from './components/structure/default/header';
import Footer from './components/structure/default/footer';
import LandingPage from './components/structure/default/landing';
import Login from './components/domains/auth/login';
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
						<Route path='/' element={<LandingPage />}/>
						<Route path='login' element={ <Login redirectUrl='/vehicles' />}/>
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
