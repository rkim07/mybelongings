import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import _isUndefined from 'lodash/isUndefined';
import Grid from '@material-ui/core/Grid';
// import Notifier from '../../components/notifier/main';
import { withStyles } from '@material-ui/core/styles';
import { withContext } from '../../appcontext';

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
	}
});

const withLogin = (WrappedComponent) => {
	class withLogin extends React.Component
	{
		// Constructor
		constructor(props) {
			super(props);

			this.state = {
				username: 	 	 '',
				password: 	 	 '',
				section:         props.section,
				redirectUrl: 	 props.redirectUrl,
				displayNotifier: false
			}

			this.props.clearNotifier();
		}

		// Handle form changes
		handleChange = (e) => {
			const { name, value } = e.target

			this.setState({
				[name]: value
			})

			this.props.clearNotifier();
		}

		// Submit
		handleSubmit = () => {
			this.props.login(this.state)
				.then(response => {
					if (!_isUndefined(response)) {
						if (response.redirect) {
							this.props.history.push(this.state.redirectUrl)
						} else if (response.status !== 200) {
							this.setState({
								displayNotifier: true
							});
						}
					}
				});
		}

		// Clear input
		clearInputs = () => {
			this.setState({
				username: '',
				password: ''
			})
		}

		render() {
			const { classes } = this.props;
			// const { openNotifier, notifierType, notifierMsg } = this.props.getNotifier();

			return (
				<main className={classes.main}>
					{/*{ this.state.displayNotifier  ?
						<Notifier open={openNotifier} type={notifierType} message={notifierMsg}/>
						:
						null
					}*/}
					<Grid container justify='center'>
						<Grid item xs={12} sm={12} md={12}>
							<WrappedComponent
								handleChange={this.handleChange}
								handleSubmit={this.handleSubmit}
								handleRedirect={this.handleRedirect}
								{...this.state}
							/>
						</Grid>
					</Grid>
				</main>
			)
		}
	}

	withLogin.propTypes = {
		classes: PropTypes.object.isRequired,
	};

	return withContext(withRouter(withStyles(styles)(withLogin)));
};

export default withLogin;
