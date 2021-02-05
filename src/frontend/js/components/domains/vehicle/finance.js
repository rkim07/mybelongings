import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../../../appcontext';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';

/**
 * Child component of details
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function Finance() {
	const apis = useContext(AppContext);
	const { key } = useParams();

	const [loading, setLoading] = useState(true);

	return (
		<React.Fragment>
			<Box>
				This is insurance tab.
			</Box>
		</React.Fragment>
	)
}
