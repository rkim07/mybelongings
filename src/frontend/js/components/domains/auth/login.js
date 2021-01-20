import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withContext } from '../../../contexts/appcontext';
import { withRouter } from 'react-router-dom';
import Notifier from "../../shared/notifier";
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
	avatar: {
		margin: theme.spacing(),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(),
	},
	submit: {
		marginTop: theme.spacing(3),
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

class Login extends React.Component
{
	// Constructor
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			redirectUrl: props.redirectUrl,
			openNotifier: false,
			notifierType: '',
			notifierMsg: '',
		}

		this.onHandleChange = this.onHandleChange.bind(this);
		this.onHandleSubmit = this.onHandleSubmit.bind(this);
	}

	onHandleChange = (e) => {
		const { name, value } = e.target

		this.setState({
			[name]: value
		})
	}

	onHandleSubmit = (e) => {
		e.preventDefault();

		this.props.login(this.state)
			.then((response) => {
				if (response.redirect) {
					this.props.history.push(this.state.redirectUrl)
				} else if (response.status !== 200) {
					this.setState({
						openNotifier: true
					});
				}
			});
	}

	clearInputs = () => {
		this.setState({
			username: '',
			password: ''
		})
	}

	render() {
		const { classes } = this.props;
		const {
			username,
			password,
			openNotifier,
			notifierType,
			notifierMsg
		} = this.state;

		return (
			<Container className={classes.root} maxWidth="md">
				{ openNotifier && (
					<Notifier
						open={ openNotifier }
						notifierType={ notifierType }
						notifierMsg={ notifierMsg }
						onHandleCloseNotifier={ this.onHandleCloseNotifier }
					/>)
				}
				<ValidatorForm
					onSubmit={ (event) => this.onHandleSubmit(event) }
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
									<FormControl margin='normal' required fullWidth>
										<ThemeProvider theme={theme}>
											<TextValidator
												label='Username'
												onChange={ this.onHandleChange }
												name='username'
												value={ username}
												validators={['required']}
												errorMessages={['This field is required']}
											/>
										</ThemeProvider>
									</FormControl>
									<br/>
									<FormControl margin='normal' required fullWidth>
										<ThemeProvider theme={theme}>
											<TextValidator
												label='Password'
												onChange={ this.onHandleChange }
												name='password'
												type='password'
												value={ password }
												validators={['required']}
												errorMessages={['This field is required']}
											/>
										</ThemeProvider>
									</FormControl>
									<br/>
									<Button
										type='submit'
										fullWidth
										variant='contained'
										color='primary'
										className={classes.submit}>
										Log in
									</Button>
							</Paper>
						</Grid>
					</Grid>
				</ValidatorForm>
			</Container>
		)
	}
}

Login.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withContext(withRouter(withStyles(styles)(Login)));
