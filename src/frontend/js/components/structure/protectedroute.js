import React from 'react'
import { Route, Redirect } from 'react-router-dom';
import { withContext } from '../../contexts/appcontext'

function ProtectedRoute(props) {
	const { component: Component, ...rest } = props;

	return (
		props.accessToken ?
			<Route {...rest} component={Component} /> :
			<Redirect to='/login' />
	)
}

export default withContext(ProtectedRoute);
