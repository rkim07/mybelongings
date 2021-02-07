import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMessage } from '../../shared/helpers/flashmessages';
import AppContext from '../../../appcontext';
import AuthHeader from './shared/authheader';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';

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
		background: '#696969',
		color: 'white',
		height: 36,
		margin: theme.spacing(3, 0, 2)
	}
}));

export default function Signup() {
	const apis = useContext(AppContext);
	const classes = useStyles();

	const initialValues = {
		firstName: '',
		lastName: '',
		email: '',
		mobile: '',
		username: '',
		password: '',
		repeatPassword: '',
		submitted: false,
		statusType: '',
		errorCode: '',
		serverMsg: ''
	};

	const [values, setValues] = useState(initialValues);

	// Validate password matches
	useEffect(() => {
		if (!ValidatorForm.hasValidationRule('isPasswordMatch')) {
			ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
				if (value !== values.password) {
					return false;
				}
				return true;
			});
		}

		return function cleanPasswordMatchRule() {
			if (ValidatorForm.hasValidationRule('isPasswordMatch')) {
				ValidatorForm.removeValidationRule('isPasswordMatch');
			}
		};
	});

	// Handle select and input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value });
	}

	// Reset password
	const handleSubmit = async(e) => {
		e.preventDefault();

		const response = await apis.signup(values);

		setValues({
			...values,
			submitted: true,
			statusType: response.statusType,
			errorCode: response.errorCode ,
			serverMsg: response.message
		});
	}

	return (
		<Container component='main' maxWidth='xs'>
			<div className={classes.root}>
				<AuthHeader title='Sign Up' />
				{ values.submitted ? (
					<Typography component='h1' variant='h5'>
						{ values.statusType === 'success' ?
							getMessage(
								values.statusType,
								values.serverMsg,
								'AUTH_SERVICE_MESSAGES.SIGNUP'
							)
							:
							getMessage(
								values.statusType,
								values.serverMsg,
								values.errorCode
							)
						}
					</Typography>
				) : (
					<ValidatorForm
						onSubmit={ handleSubmit }
						className={classes.form}
					>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextValidator
									fullWidth
									variant='outlined'
									label='First name'
									name='firstName'
									value={ values.firstName }
									onChange={ handleChange }
									validators={['required']}
									errorMessages={['This field is required']}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextValidator
									fullWidth
									variant='outlined'
									label='Last name'
									name='lastName'
									value={ values.lastName }
									onChange={ handleChange }
									validators={['required']}
									errorMessages={['This field is required']}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextValidator
									fullWidth
									variant='outlined'
									label='Email'
									name='email'
									value={ values.email }
									onChange={ handleChange }
									validators={['required']}
									errorMessages={['This field is required']}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextValidator
									fullWidth
									variant='outlined'
									label='Mobile number'
									name='mobile'
									value={ values.mobile }
									onChange={ handleChange }
								/>
							</Grid>
							<Grid item xs={12}>
								<TextValidator
									fullWidth
									variant='outlined'
									label='Username'
									name='username'
									value={ values.username }
									onChange={ handleChange }
									validators={['required']}
									errorMessages={['This field is required']}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextValidator
									fullWidth
									variant='outlined'
									label='Password'
									type='password'
									name='password'
									value={ values.password }
									onChange={ handleChange }
									validators={['required']}
									errorMessages={['This field is required']}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextValidator
									fullWidth
									variant='outlined'
									label='Confirm password'
									type='password'
									name='repeatPassword'
									value={ values.repeatPassword }
									onChange={ handleChange }
									validators={['required', 'isPasswordMatch']}
									errorMessages={['This field is required', 'Password mismatch']}
								/>
							</Grid>
						</Grid>
						<Button
							fullWidth
							type='submit'
							variant='contained'
							color='default'
							className={classes.button}
						>
							Sign Up
						</Button>
						<Grid container justify='flex-end'>
							<Grid item>
								<Link to='/account/signin' variant='body2'>
									Already have an account? Sign in
								</Link>
							</Grid>
						</Grid>
					</ValidatorForm>
				)}
			</div>
		</Container>
	)
}
