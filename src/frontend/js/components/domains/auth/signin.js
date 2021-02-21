import React, { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AppContext from '../../../appcontext';
import AuthHeader from './shared/authheader';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { TextValidator, ValidatorForm  } from 'react-material-ui-form-validator';
import { makeStyles } from '@material-ui/core/styles';
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";

const useStyles = makeStyles((theme) => ({
	root: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	form: {
		width: '100%',
		marginTop: theme.spacing(3)
	},
	button: {
		background: '#404040',
		color: 'white',
		height: 36,
		margin: theme.spacing(3, 0, 2)
	}
}));

export default function SignIn(props) {
	const apis = useContext(AppContext);
	const classes = useStyles();
	const { redirectUrl } = props;

	const initialValues = {
		username: '',
		password: '',
		submitted: false,
		statusType: '',
		statusType: '',
		message: ''
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

		const response = await apis.signin(values);

		setValues({
			...values,
			submitted: true,
			statusType: response.statusType,
			message: response.message,
			showPassword: false
		});
	}

	// Handle click show
	const handleClickShowPassword = () => {
		setValues({
			...values,
			showPassword: !values.showPassword
		});
	};

	// Handle mouse down
	const handleMouseDownPassword = (e) => {
		e.preventDefault();
	};

	return (
		<Container component='main' maxWidth='xs'>
			{ (values.submitted && values.statusType === 'success') && <Navigate to={ redirectUrl } />}
			{ (values.submitted && values.statusType === 'error') &&
				<Alert variant='filled' severity='error'>
					{ values.message }
				</Alert>
			}
			<div className={classes.root}>
				<AuthHeader title='Sign In' />
				<ValidatorForm
					onSubmit={ handleSubmit }
					className={classes.form}
				>
					<TextValidator
						fullWidth
						variant='outlined'
						margin='normal'
						label='Username'
						name='username'
						value={ values.username }
						onChange={ handleChange }
						validators={['required']}
						errorMessages={['This field is required']}
					/>
					<TextValidator
						fullWidth
						variant='outlined'
						margin='normal'
						label='Password'
						type={ values.showPassword ? 'text' : 'password' }
						name='password'
						value={ values.password }
						onChange={ handleChange }
						validators={['required']}
						errorMessages={['This field is required']}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={ handleClickShowPassword }
										onMouseDown={ handleMouseDownPassword }
									>
										{ values.showPassword ? <Visibility /> : <VisibilityOff /> }
									</IconButton>
								</InputAdornment>
							)
						}}
					/>
					<Button
						type='submit'
						variant='contained'
						color='default'
						className={classes.button}
						fullWidth
					>
						Sign In
					</Button>
					<Grid container>
						<Grid item xs>
							<Link to='/account/password/lost' variant='body2'>
								Forgot password?
							</Link>
						</Grid>
						<Grid item>
							<Link to='/account/signup' variant='body2'>
								Don't have an account? Sign Up
							</Link>
						</Grid>
					</Grid>
				</ValidatorForm>
			</div>
		</Container>
	)
}
