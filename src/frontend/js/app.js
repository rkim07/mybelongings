import React from 'react';
import { withRouter } from 'react-router';
import UsersSection from './components/structure/default/section';

function App(props) {
	const { classes } = props;

	return (
		<UsersSection {...props} />
	)
}

export default withRouter(App);
