import React from 'react';
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4)
	},
	paper: {
		marginTop: theme.spacing(4),
		flexGrow: 1,
		alignItems: 'center'
	}
}));

export default function Dashboard() {
	const classes = useStyles();

	return (
		<Container maxWidth='lg' className={classes.container}>
			<div className={classes.paper}>
				<Typography variant='h5' component='h3'>
					API Dashboard
				</Typography>
			</div>
		</Container>
	)
}
