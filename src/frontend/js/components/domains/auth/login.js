import React, { useContext, useState } from 'react';
import { Navigate } from "react-router-dom";
import AppContext from '../../../appcontext';
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { TextValidator, ValidatorForm  } from 'react-material-ui-form-validator';
import Notifier from '../../shared/feedback/notifier';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
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
			marginRight: 'auto'
		},
	},
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`
	},
	avatar: {
		margin: theme.spacing(),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing()
	},
	submit: {
		marginTop: theme.spacing(3)
	}
});

// Override style
const theme = createMuiTheme({
	overrides: {
		MuiDropzonePreviewList: {
			image: {
				width: 600
			}
		},
		MuiSelect: {
			select: {
				width: 150
			}
		},
		MuiInputBase: {
			input: {
				width: 300
			}
		}
	}
});

function Login(props) {
	const apis = useContext(AppContext);
	const { classes } = props;
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [submitted, setSubmitted] = useState(false);

	const onHandleSubmit = (e) => {
		e.preventDefault();

		const credentials = {
			username: username,
			password: password
		}

		apis.login(credentials)
			.then((response) => {
				if (response.redirect) {
					setSubmitted(true);
				} else {
					setOpenNotifier(true);
					setNotifierType(response.statusType);
					setNotifierMsg(response.message);
				}
			});
	}

	return (
		<Container className={classes.root} maxWidth="md">
			{ submitted && (<Navigate to={ props.redirectUrl } />)}
			<ValidatorForm
				onSubmit={ e => { onHandleSubmit(e) } }
			>
				<Grid container justify='center'>
					<Grid item xs={12} sm={12} md={12}>
						<Paper className={classes.paper}>
							<Avatar className={classes.avatar}>
								<LockOutlinedIcon />
							</Avatar>
							<Typography component='h1' variant='h5'>
								Log in
							</Typography>
							<Grid item xs={12}>
								<FormControl margin='normal' required fullWidth>
									<ThemeProvider theme={theme}>
										<TextValidator
											label='Username'
											value={ username }
											onChange={ e => setUsername(e.target.value) }
											validators={['required']}
											errorMessages={['This field is required']}
										/>
									</ThemeProvider>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<FormControl margin='normal' required fullWidth>
									<ThemeProvider theme={theme}>
										<TextValidator
											type='password'
											label='Password'
											value={ password }
											onChange={ e => setPassword(e.target.value) }
											validators={['required']}
											errorMessages={['This field is required']}
										/>
									</ThemeProvider>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<Button
									type='submit'
									variant='contained'
									color='default'
									className={classes.submit}
									fullWidth
								>
									Log in
								</Button>
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</ValidatorForm>
		</Container>
	)
}

export default withStyles(styles)(Login);
