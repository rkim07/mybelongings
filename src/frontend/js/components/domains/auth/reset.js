import * as _ from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { resetPassword } from '../../../apis/auth';
import { getMessage } from '../../shared/helpers/flashmessages';
import AppContext from '../../../appcontext';
import Notifier from '../../shared/feedback/notifier';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { TextValidator, ValidatorForm  } from 'react-material-ui-form-validator';
import AddIcon from '@material-ui/icons/Add';

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
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing()
	},
	submit: {
		marginTop: theme.spacing(3)
	},
	button: {
		margin: theme.spacing(1),
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

function Reset(props) {
	const apis = useContext(AppContext);
	const { email, resetCode } = useParams();

	const { classes } = props;

	const initialValues = {
		email: email,
		resetCode: resetCode,
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
								{ values.statusType === 'success' ? (
									<React.Fragment>
										<Typography component='h1' variant='h5'>
											{
												getMessage(
													values.statusType,
													values.serverMsg,
													'AUTH_SERVICE_MESSAGES.RESET'
												)
											}
										</Typography>
										<Button
											type='button'
											variant='contained'
											color='default'
											className={classes.button}
											startIcon={<AddIcon />}
											component={Link}
											to={ '/account/login' }
										>
											Login
										</Button>
									</React.Fragment>
							 	) : (
									<Typography component='h1' variant='h5'>
										{
											getMessage(
												values.statusType,
												values.serverMsg,
												values.errorCode
											)
										}
									</Typography>
								) }
							</Paper>
						) : (
							<Paper className={classes.paper}>
								<Typography component='h1' variant='h5'>
									Reset Password
								</Typography>
								<Typography component='h5' variant='h5'>
									Please enter your new password
								</Typography>
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
											label='Confirm Password'
											type='password'
											name='repeatPassword'
											value={ values.repeatPassword }
											onChange={ handleChange }
											validators={[
												'required',
												'isPasswordMatch'
											]}
											errorMessages={[
												'This field is required',
												'Password mismatch'
											]}
										/>
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
										Reset password
									</Button>
								</Grid>
								<Grid item xs={12}>
									<Typography component='h5' variant='h5'>
										<Link to='/account/login'>Remember your password?</Link>
									</Typography>
								</Grid>
							</Paper>
						)}
					</Grid>
				</Grid>
			</ValidatorForm>
		</Container>
	)
}

export default withStyles(styles)(Reset);
