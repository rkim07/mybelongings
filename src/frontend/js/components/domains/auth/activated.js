import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMessage } from '../../shared/helpers/flashmessages';
import AuthHeader from './shared/authheader';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	root: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	button: {
		background: '#404040',
		color: 'white',
		height: 36,
		margin: theme.spacing(3, 0, 2)
	},
}));

export default function Activated() {
	const { param } = useParams();
	const classes = useStyles();

	return (
		<Container component='main' maxWidth='xs'>
			<div className={classes.root}>
				<AuthHeader title='Sign Up' />
				<Typography variant='body1'>
					{ param === 'signin' ?
						getMessage(
							'success',
							'',
							'AUTH_SERVICE_MESSAGES.ALREADY_ACTIVATED'
						)
						:
						getMessage(
							'success',
							'',
							'AUTH_SERVICE_MESSAGES.ACTIVATED'
						)
					}
				</Typography>
				<Button
					fullWidth
					type='button'
					variant='contained'
					color='default'
					className={classes.button}
					component={Link}
					to={ '/account/signin' }
				>
					Sign In
				</Button>
			</div>
		</Container>
	)
}
