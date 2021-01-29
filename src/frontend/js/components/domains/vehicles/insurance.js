import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppContext from '../../../appcontext';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';

const styles = (theme) => ({});

function Insurance(props) {
	const apis = useContext(AppContext);
	const { key } = useParams();

	const { classes } = props;

	const [loading, setLoading] = useState(true);

	return (
		<React.Fragment>
			<Grid item xs={12}>
				This is insurance tab.
			</Grid>
		</React.Fragment>
	)
}

export default withStyles(styles)(Insurance);
