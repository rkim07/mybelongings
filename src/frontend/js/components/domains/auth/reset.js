import * as _ from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import AppContext from '../../../appcontext';
import { resetPassword } from '../../../apis/auth';
import AuthHeader from './shared/authheader';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from "@material-ui/core/Box";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputAdornment from "@material-ui/core/InputAdornment";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { TextValidator, ValidatorForm  } from 'react-material-ui-form-validator';
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
		background: '#404040',
		color: 'white',
		height: 36,
		margin: theme.spacing(3, 0, 2)
	}
}));

export default function Reset() {
	const apis = useContext(AppContext);
	const { email, resetCode } = useParams();
	const classes = useStyles();

	const initialValues = {
		email: email,
		resetCode: resetCode,
		password: '',
		repeatPassword: '',
		submitted: false,
		statusType: '',
		errorCode: '',
		message: ''
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

	// Submit
	const handleSubmit = async(e) => {
		e.preventDefault();

		const response = await apis.resetPassword(values);

		setValues({
			...values,
			submitted: true,
			statusType: response.statusType,
			errorCode: response.errorCode ,
			message: response.message
		});
	}

	return (
		<Container component='main' maxWidth='xs'>
			<div className={classes.root}>
				<AuthHeader title='Forgot Password' />
				{ values.submitted ? (
					 values.statusType === 'success' ? (
						<Box mt={2}>
							<Typography variant='body1'>
								{ values.message }
							</Typography>
							<Button
								fullWidth
								variant='contained'
								color='default'
								className={classes.button}
								component={Link}
								to={ '/account/signin' }
							>
								Sign In
							</Button>
						</Box>
					) : (
						<Box mt={2}>
							<Typography variant='body1'>
								{ displayErrorMsg(values.errorCode, values.message) }
							</Typography>
						</Box>
					)
				) : (
					<ValidatorForm
						onSubmit={ handleSubmit }
						className={classes.form}
					>
						<TextValidator
							fullWidth
							variant='outlined'
							margin='normal'
							label='New password'
							type='password'
							name='password'
							value={ values.password }
							onChange={ handleChange }
							validators={['required']}
							errorMessages={['This field is required']}
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<VpnKeyIcon/>
									</InputAdornment>
								)
							}}
						/>
						<TextValidator
							fullWidth
							variant='outlined'
							margin='normal'
							label='Confirm new password'
							type='password'
							name='repeatPassword'
							value={ values.repeatPassword }
							onChange={ handleChange }
							validators={['required', 'isPasswordMatch']}
							errorMessages={['This field is required', 'Password mismatch']}
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<VpnKeyIcon/>
									</InputAdornment>
								)
							}}
						/>
						<Button
							fullWidth
							type='submit'
							variant='contained'
							color='default'
							className={classes.button}
						>
							Reset password
						</Button>
						<Grid container justify='flex-end'>
							<Grid item>
								<Link to='/account/signin' variant='body2'>
									Remember your password? Sign In
								</Link>
							</Grid>
						</Grid>
					</ValidatorForm>
				)}
			</div>
		</Container>
	)
}
