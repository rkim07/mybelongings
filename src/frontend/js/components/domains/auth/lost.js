import React, {useContext, useState} from 'react';
import { Link, Navigate } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
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

function Lost(props) {
	const apis = useContext(AppContext);

	const { classes } = props;

	const initialValues = {
		email: '',
		submitted: false,
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

	// Send reset password email
	const handleSubmit = async(e) => {
		e.preventDefault();

		const response = await apis.activatePasswordReset(values);

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
											'AUTH_SERVICE_MESSAGES.LOST'
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
									Forgot Password
								</Typography>
								<Typography component='h5' variant='h5'>
									Lost your password? Please enter your email address and we'll send you a link to reset your password.
								</Typography>
								<Grid item xs={12}>
									<FormControl margin='normal' required fullWidth>
										<ThemeProvider theme={theme}>
											<TextValidator
												label='Email'
												name='email'
												value={ values.email }
												onChange={ handleChange }
												validators={['required', 'isEmail']}
												errorMessages={['This field is required', 'Invalid email']}
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

export default withStyles(styles)(Lost);
