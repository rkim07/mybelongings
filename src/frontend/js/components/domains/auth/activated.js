import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { getMessage } from '../../shared/helpers/flashmessages';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
	root: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		marginLeft: theme.spacing(3),
		marginRight: theme.spacing(3),
		[theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
			width: 400,
			marginLeft: 'auto',
			marginRight: 'auto',
		},
	},
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(),
	},
	submit: {
		marginTop: theme.spacing(3),
	}
});

function Activated(props) {
	const { param } = useParams();
	const { classes } = props;

	return (
		<Container className={classes.root} maxWidth='md'>
			<Grid container justify='center'>
				<Grid item xs={12} sm={12} md={12}>
					<Paper className={classes.paper}>
						<Typography component='h1' variant='h5'>
							{ param === 'success' ?
								getMessage(
									'success',
									'',
									'AUTH_SERVICE_MESSAGES.ACTIVATED'
								)
								:
								getMessage(
									'success',
									'',
									'AUTH_SERVICE_MESSAGES.ALREADY_ACTIVATED'
								)
							}
						</Typography>
						<Button
							type='button'
							variant='contained'
							color='default'
							className={classes.button}
							startIcon=""
							component={Link}
							to={ '/account/login' }
						>
							Login
						</Button>
					</Paper>
				</Grid>
			</Grid>
		</Container>
	)
}

export default withStyles(styles)(Activated);
