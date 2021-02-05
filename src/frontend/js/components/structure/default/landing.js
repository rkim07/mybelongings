import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
	heroContent: {
		padding: theme.spacing(8, 0, 6)
	},
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`
	}
}));

export default function Landing() {
	const classes = useStyles();

	return (
		<Container maxWidth='sm' component='main' className={classes.heroContent}>
			<Paper elevation={1} className={classes.paper}>
				<Typography variant='h5' component='h3'>
					My Belongings
				</Typography>
			</Paper>
		</Container>
	)
}
