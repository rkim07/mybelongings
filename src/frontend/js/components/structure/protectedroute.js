import React from 'react'
import { Route, Navigate } from 'react-router-dom';
import { withContext } from '../../contexts/appcontext';

function ProtectedRoute(props) {
	const { path, element, isLoggedIn } = props;

	return (
		isLoggedIn() ?
			<Route path={path} element={element} />
			:
			<Navigate to='/login' />
	)
}

export default withContext(ProtectedRoute);
