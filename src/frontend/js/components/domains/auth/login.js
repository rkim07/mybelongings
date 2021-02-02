import React, { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { getMessage } from '../../shared/helpers/flashmessages';
import AppContext from '../../../appcontext';
import Alert from '@material-ui/lab/Alert';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { TextValidator, ValidatorForm  } from 'react-material-ui-form-validator';

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

	const { classes, redirectUrl } = props;

	const initialValues = {
		username: '',
		password: '',
		submitted: false,
		statusType: '',
		statusType: '',
		errorCode: '',
		serverMsg: ''
	};

	const [values, setValues] = useState(initialValues);

	// Handle select and input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value });
	}

	// Log in the user
	const handleSubmit = async(e) => {
		e.preventDefault();

		const response = await apis.login(values);

		setValues({
			...values,
			submitted: true,
			statusType: response.statusType,
			errorCode: response.errorCode,
			serverMsg: response.message
		});
	}

	return (
		<Container className={classes.root} maxWidth='md'>
			{ (values.submitted && values.statusType === 'success') && (<Navigate to={ redirectUrl } />)}
			<ValidatorForm
				onSubmit={ handleSubmit }
			>
				<Grid container justify='center'>
					<Grid item xs={12} sm={12} md={12}>
						{ (values.submitted && values.statusType === 'error') && (
							<Alert variant='filled' severity='error'>
								{
									getMessage(
										values.statusType,
										values.serverMsg,
										values.errorCode
									)
								}
							</Alert>
						)}
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
											name='username'
											value={ values.username }
											onChange={ handleChange }
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
											label='Password'
											type='password'
											name='password'
											value={ values.password }
											onChange={ handleChange }
											validators={['required']}
											errorMessages={['This field is required']}
										/>
									</ThemeProvider>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<Typography align='center'>
									<Link to='/account/password/lost'>Forgot password</Link>
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography align='center'>
									<Link to='/account/signup'>Not enrolled? Sign up now</Link>
								</Typography>
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
