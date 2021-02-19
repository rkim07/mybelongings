import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../../appcontext';
import AuthHeader from './shared/authheader';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputAdornment from "@material-ui/core/InputAdornment";
import EmailIcon from "@material-ui/icons/Email";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
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

export default function ResetEmail() {
	const apis = useContext(AppContext);
	const classes = useStyles();

	const initialValues = {
		email: '',
		submitted: false,
		statusType: '',
		errorCode: '',
		message: ''
	};

	const [values, setValues] = useState(initialValues);

	// Handle select and input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value });
	}

	// Send reset password email
	const handleSubmit = async(e) => {
		e.preventDefault();

		const response = await apis.activatePasswordReset(values);

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
					<Box mt={8}>
						<Typography variant='body1'>
							{ values.message }
						</Typography>
					</Box>
				) : (

					<ValidatorForm
						onSubmit={ handleSubmit }
						className={classes.form}
					>
						<Typography variant='body1'>
							Lost your password? Please enter your email address and we'll send you a link to reset your password.
						</Typography>
						<TextValidator
							fullWidth
							variant='outlined'
							margin='normal'
							label='Email'
							name='email'
							value={ values.email }
							onChange={ handleChange }
							validators={[
								'required',
								'isEmail'
							]}
							errorMessages={[
								'This field is required',
								'Invalid email'
							]}
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<EmailIcon/>
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
							Submit
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
