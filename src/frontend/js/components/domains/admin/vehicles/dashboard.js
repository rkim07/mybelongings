import React from 'react';
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

export default function Dashboard() {
	const classes = useStyles();

	return (
		<Container maxWidth='sm' component='main' className={classes.main}>
			<Paper elevation={1} className={classes.paper}>
				<Typography variant='h5' component='h3'>
					Vehicles Dashboard
				</Typography>
			</Paper>
		</Container>
	)
}
