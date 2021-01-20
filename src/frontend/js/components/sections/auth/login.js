import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withLogin from '../../hoc/withlogin';
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

class Login extends React.Component
{
	render() {
		const { classes } = this.props;

		return (
			<Paper className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component='h1' variant='h5'>
					Log in
				</Typography>
				<ValidatorForm
					className={classes.form}
					ref='form'
					onSubmit={this.props.handleSubmit}
				>
					<FormControl margin='normal' required fullWidth>
						<TextValidator
							label='Username'
							onChange={this.props.handleChange}
							name='username'
							value={this.props.username}
							validators={['required']}
							errorMessages={['This field is required']}
						/>
					</FormControl>
					<br />
					<FormControl margin='normal' required fullWidth>
						<TextValidator
							label='Password'
							onChange={this.props.handleChange}
							name='password'
							type='password'
							value={this.props.password}
							validators={['required']}
							errorMessages={['This field is required']}
						/>
					</FormControl>
					<br />
					<Button
						type='submit'
						fullWidth
						variant='contained'
						color='primary'
						className={classes.submit}>
						Log in
					</Button>
				</ValidatorForm>
			</Paper>
		)
	}
}

Login.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withLogin(withStyles(styles)(Login));
