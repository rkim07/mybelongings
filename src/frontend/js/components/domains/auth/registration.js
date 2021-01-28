import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withContext } from '../../../appcontext';
import { prepareLoginData } from '../../shared/helpers/ajax';
import { Notifier } from '../../shared/feedback/notifier';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

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

class Registration extends React.Component
{
	/**
	 * Constructor
	 *
	 * @param props
	 */
	constructor(props) {
		super(props);

		this.state = {
			id:             props.userRegId || '',
			username:       '',
			password:       '',
			repeatPassword: ''
		}
	}

	componentDidMount() {
		// custom rule will have name 'isPasswordMatch'
		ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
			if (value !== this.state.password) {
				return false;
			}

			return true;
		});
	}

	/**
	 * Handle form changes
	 *
	 * @param e
	 */
	handleChange = (e) => {
		const { name, value } = e.target

		this.setState({
			[name]: value
		})
	}

	// Submit
	handleSubmit = () => {
		let data = prepareLoginData(this.state);

		this.props.register(data);
		this.props.history.push('/login');
	}

	render() {
		const { classes, systemNoticesType, systemNoticesAdminEmail, userRegName } = this.props;

		if (systemNoticesType) {
			let message = '';

			switch (systemNoticesType) {
				case 'error':
					message = <h3>User has already created credentials.  Please go ahead and login.</h3>;
				break;

				case 'expired':
					message = <h3>Your registration period have expired.  Please contact the <a href={`mailto:${systemNoticesAdminEmail}`}>administrator</a> and request again.</h3>;
				break;
			}

			return (
				<Paper className={classes.paper}>
					{ message }
				</Paper>
			)
		} else {
			return (
				<main className={classes.main}>
					{/* this.props.notifierMsg && (
						<Notifier
							openNotifier={ openNotifier }
							notifierType={ notifierType }
							notifierMsg={ notifierMsg }
							onHandleCloseNotifier={ this.onHandleCloseNotifier }
						/>)
					*/}
					<Grid container justify='center'>
						<Grid item xs={12} sm={12} md={12}>
							<Paper className={classes.paper}>
								<Typography component='h1' variant='h5'>
									Welcome {userRegName}, please enter an username and password to create your access.
								</Typography>
								<ValidatorForm
									className={classes.form}
									ref='form'
									onSubmit={this.handleSubmit}
								>
									<FormControl margin='normal' required fullWidth>
										<TextValidator
											label='Username'
											onChange={this.handleChange}
											name='username'
											value={this.state.username}
											validators={['required']}
											errorMessages={['This field is required']}
										/>
									</FormControl>
									<br/>
									<FormControl margin='normal' required fullWidth>
										<TextValidator
											label='Password'
											onChange={this.handleChange}
											name='password'
											type='password'
											value={this.state.password}
											validators={['required']}
											errorMessages={['This field is required']}
										/>
									</FormControl>
									<FormControl margin='normal' required fullWidth>
										<TextValidator
											label='Confirm Password'
											onChange={this.handleChange}
											name='repeatPassword'
											type='password'
											value={this.state.repeatPassword}
											validators={['isPasswordMatch', 'required']}
											errorMessages={['Password mismatch', 'This field is required']}
										/>
									</FormControl>
									<br/>
									<Button
										type='submit'
										fullWidth
										variant='contained'
										color='primary'
										className={classes.submit}>
										Create
									</Button>
								</ValidatorForm>
							</Paper>
						</Grid>
					</Grid>
				</main>
			)
		}
	}
}

export default withContext(withStyles(styles)(Registration));
