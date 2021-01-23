import React from 'react';
import { withContext } from '../../contexts/appcontext';

function NotFound() {
	return (
		<React.Fragment>
			<h1> Whoops!</h1>
			<h2>404 - Page not found!</h2>
		</React.Fragment>

	);
}

export default withContext((NotFound));
