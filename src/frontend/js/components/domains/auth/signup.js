import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { getMessage } from '../../shared/helpers/flashmessages';
import AppContext from '../../../appcontext';
import { prepareLoginData } from '../../shared/helpers/ajax';
import { Notifier } from '../../shared/feedback/notifier';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Container from '@material-ui/core/Container';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const styles = theme => ({
	main: {
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

function Signup(props) {
	const apis = useContext(AppContext);

	const { classes } = props;

	const initialValues = {
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		username: '',
		password: '',
		confirmPassword: '',
		submitted: false,
		statusType: '',
		errorCode: '',
		serverMsg: ''
	};

	const [values, setValues] = useState(initialValues);

	// Validate password matches
	useEffect(() => {
		if (!ValidatorForm.hasValidationRule("isPasswordMatch")) {
			ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
				if (value !== values.password) {
					return false;
				}
				return true;
			});
		}

		return function cleanPasswordMatchRule() {
			if (ValidatorForm.hasValidationRule("isPasswordMatch")) {
				ValidatorForm.removeValidationRule("isPasswordMatch");
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
		<Container className={classes.root} maxWidth='md'>
			<ValidatorForm
				onSubmit={ handleSubmit }
			>
				<Grid container justify='center'>
					<Grid item xs={12} sm={12} md={12}>
						{ values.submitted ? (
							<Paper className={classes.paper}>
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
							</Paper>
						) : (
							<Paper className={classes.paper}>
								<Typography component='h1' variant='h5'>
									Create your MyBelongings account
								</Typography>
								<Grid item xs={12}>
									<FormControl margin='normal' required fullWidth>
										<TextValidator
											label='First name'
											name='firstName'
											onChange={ handleChange }
											value={ values.firstName }
											validators={['required']}
											errorMessages={['This field is required']}
										/>
									</FormControl>
								</Grid>
								<Grid item xs={12}>
									<FormControl margin='normal' required fullWidth>
										<TextValidator
											label='Last name'
											name='lastName'
											onChange={ handleChange }
											value={ values.lastName }
											validators={['required']}
											errorMessages={['This field is required']}
										/>
									</FormControl>
								</Grid>
								<Grid item xs={12}>
									<FormControl margin='normal' required fullWidth>
										<TextValidator
											label='Email'
											name='email'
											onChange={ handleChange }
											value={ values.email }
											validators={['required']}
											errorMessages={['This field is required']}
										/>
									</FormControl>
								</Grid>
								<Grid item xs={12}>
									<FormControl margin='normal' required fullWidth>
										<TextValidator
											label='Phone number'
											name='phone'
											onChange={ handleChange }
											value={ values.phone }
										/>
									</FormControl>
								</Grid>
								<Grid item xs={12}>
									<FormControl margin='normal' required fullWidth>
										<TextValidator
											label='Username'
											name='username'
											onChange={ handleChange }
											value={ values.username }
											validators={['required']}
											errorMessages={['This field is required']}
										/>
									</FormControl>
								</Grid>
								<Grid item xs={12}>
									<FormControl margin='normal' required fullWidth>
										<TextValidator
											label='Password'
											type='password'
											name='password'
											value={ values.password }
											onChange={ handleChange }
											validators={['required']}
											errorMessages={['This field is required']}
										/>
									</FormControl>
								</Grid>
								<Grid item xs={12}>
									<FormControl margin='normal' required fullWidth>
										<TextValidator
											label='Confirm password'
											type='password'
											name='confirmPassword'
											value={ values.confirmPassword }
											onChange={ handleChange }
											validators={['required', 'isPasswordMatch']}
											errorMessages={['This field is required', 'Password mismatch']}
										/>
									</FormControl>
								</Grid>
								<Grid item xs={12}>
									<Button
										type='submit'
										fullWidth
										variant='contained'
										color='primary'
										startIcon={ <PersonAddIcon /> }
										className={classes.submit}
									>
										Signup
									</Button>
								</Grid>
							</Paper>
						)}
					</Grid>
				</Grid>
			</ValidatorForm>
		</Container>
	)
}

export default withStyles(styles)(Signup);
