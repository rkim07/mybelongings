import React, {useContext} from 'react'
import { Route, Navigate } from 'react-router-dom';
import AppContext from '../../appcontext'

function ProtectedRoute(props) {
	const apis = useContext(AppContext);
	const { path, element } = props;

	return (
		apis.isLoggedIn() ?
			<Route path={path} element={element} />
			:
			<Navigate to='/account/login' />
	)
}

export default ProtectedRoute;
