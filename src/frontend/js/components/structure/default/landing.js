import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
	main: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		margin: theme.spacing(3),
	},
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
	}
});

function Landing(props) {
	const { classes } = props;

	return (
		<main className={classes.main}>
			<Grid container justify='center'>
				<Grid item>
					<Paper className={classes.paper} elevation={1}>
						<Typography variant='h5' component='h3'>
							My Belongings
						</Typography>
					</Paper>
				</Grid>
			</Grid>
		</main>
	)
}

export default withStyles(styles)(Landing);
