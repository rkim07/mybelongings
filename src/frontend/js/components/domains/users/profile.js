import React from 'react';
import { withStyles }  from '@material-ui/core/styles';
import { withContext } from '../../../appcontext';
import { getStates } from '../../helpers/list';
import { formatPhoneNumber, textMaskCustom } from '../../helpers/utils';
import { prepareProfileData } from '../../helpers/ajax';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

const styles = theme => ({
	root: {
		width: '100%'
	},
	mainHeader: {
		marginTop: theme.spacing(4),
		marginBottom: theme.spacing(2),
		alignItems: 'center',
		textAlign: 'center',
		fontSize: theme.typography.pxToRem(18),
	},
	heading: {
		fontSize: theme.typography.pxToRem(15),
	},
	secondaryHeading: {
		fontSize: theme.typography.pxToRem(15),
		color: theme.palette.text.secondary,
	},
	icon: {
		verticalAlign: 'bottom',
		height: 20,
		width: 20,
	},
	column: {
		flexBasis: '33.33%',
	},
	textField: {
		marginRight: theme.spacing(1),
		width: 200,
	}
});

class Profile extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			user:           props.user ? props.user : '',
			oldPhoneNumber: props.user.phone,
			newEmail:       '',
			repeatEmail:    '',
			expanded:       null,
			isEmailChange:  true
		};
	}

	componentDidMount() {
		ValidatorForm.addValidationRule('isEmailMatch', (value) => {
			if (value !== this.state.newEmail) {
				return false;
			}

			this.setState({
				isEmailChange: false
			});

			return true;
		});
	}

	handlePanelChange = panel => (event, expanded) => {
		this.setState({
			expanded: expanded ? panel : false,
		});
	}

	handleChange = (e) => {
		const { name, value } = e.target;

		if (name === 'newEmail') {
			this.setState({
				newEmail: value
			});
		} else if (name === 'repeatEmail') {
			this.setState({
				repeatEmail: value
			});
		} else {
			const user = this.state.user;

			user[name] = value;

			this.setState({
				user: user
			});
		}
	}

	handleSubmit = (e) => {
		let type = e.currentTarget.dataset.type;
		let data = prepareProfileData(type, this.state);

		this.props.updateUser(data)
			.then(response => {
				if (response.error) {
					this.setState({errorMsg: response.error})
				} else {

				}
			})
	}

	render() {
		const { classes }  = this.props;
		const { expanded, user, newEmail, repeatEmail, isEmailChange, oldPhoneNumber } = this.state;
		let formattedPhone = formatPhoneNumber(oldPhoneNumber);

		return (
			<div className={classes.root}>
				<Grid container justify='center'>
					<Grid item xs={10} className={classes.mainHeader}>
						<Typography variant='h6'>
							Profile
						</Typography>
					</Grid>
					<Grid item xs={10}>
						<ValidatorForm
							className={classes.form}
							onSubmit={this.handleSubmit}
						>
							<ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handlePanelChange('panel1')}>
								<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
									<div className={classes.column}>
										<Typography className={classes.heading}>Name</Typography>
									</div>
									<div className={classes.column}>
										<Typography className={classes.secondaryHeading}>{user.first_name} {user.last_name}</Typography>
									</div>
								</ExpansionPanelSummary>
								<ExpansionPanelDetails>
									<TextValidator
										label='First name *'
										onChange={this.handleChange}
										className={classes.textField}
										name='first_name'
										value={user.first_name}
										validators={['required']}
										errorMessages={['This field is required']}
									/>
									<TextValidator
										label='Last name *'
										onChange={this.handleChange}
										className={classes.textField}
										name='last_name'
										value={user.last_name}
										validators={['required']}
										errorMessages={['This field is required']}
									/>
								</ExpansionPanelDetails>
								<Divider />
								<ExpansionPanelActions>
									<Button size='small' onClick={this.handlePanelChange('panel1')}>Cancel</Button>
									<Button size='small' data-type='name' onClick={this.handleSubmit} color='primary'>Save</Button>
								</ExpansionPanelActions>
							</ExpansionPanel>
							<ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handlePanelChange('panel2')}>
								<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
									<div className={classes.column}>
										<Typography className={classes.heading}>Address</Typography>
									</div>
									<div className={classes.column}>
										<Typography className={classes.secondaryHeading}>{user.address}<br/>{user.city}, {user.state}, {user.zip}</Typography>
									</div>
								</ExpansionPanelSummary>
								<ExpansionPanelDetails>
									<TextField
										label='Address'
										name='address'
										value={user.address}
										onChange={this.handleChange}
										fullWidth
									/>
								</ExpansionPanelDetails>
								<ExpansionPanelDetails>
									<TextField
										label='City'
										name='city'
										value={user.city}
										onChange={this.handleChange}
										className={classes.textField}
									/>
									<TextField
										select
										label='State'
										name='state'
										value={user.state}
										className={classes.textField}
										onChange={this.handleChange}
									>
										{
											getStates().map(option => (
												<MenuItem key={option.value} value={option.value}>
													{option.label}
												</MenuItem> )
											)
										}
									</TextField>
									<TextField
										label='Zip'
										onChange={this.handleChange}
										name='zip'
										value={user.zip}
									/>
								</ExpansionPanelDetails>
								<Divider />
								<ExpansionPanelActions>
									<Button size='small' onClick={this.handlePanelChange('panel2')}>Cancel</Button>
									<Button size='small' data-type='address' onClick={this.handleSubmit} color='primary'>Save</Button>
								</ExpansionPanelActions>
							</ExpansionPanel>
							<ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handlePanelChange('panel3')}>
								<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
									<div className={classes.column}>
										<Typography className={classes.heading}>Phone</Typography>
									</div>
									<div className={classes.column}>
										<Typography className={classes.secondaryHeading}>{formattedPhone}</Typography>
									</div>
								</ExpansionPanelSummary>
								<ExpansionPanelDetails>
									<Input
										label='Phone'
										name='phone'
										value={user.phone}
										onChange={this.handleChange}
										id='formatted-text-mask-input'
										inputComponent={textMaskCustom}
									/>
								</ExpansionPanelDetails>
								<Divider />
								<ExpansionPanelActions>
									<Button size='small' onClick={this.handlePanelChange('panel3')}>Cancel</Button>
									<Button size='small' data-type='phone' onClick={this.handleSubmit}  color='primary'>Save</Button>
								</ExpansionPanelActions>
							</ExpansionPanel>
							<ExpansionPanel expanded={expanded === 'panel5'} onChange={this.handlePanelChange('panel5')}>
								<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
									<div className={classes.column}>
										<Typography className={classes.heading}>Email</Typography>
									</div>
									<div className={classes.column}>
										<Typography className={classes.secondaryHeading}>{user.email}</Typography>
									</div>
								</ExpansionPanelSummary>
								<ExpansionPanelDetails>
									<TextValidator
										name='newEmail'
										label='New email'
										type='text'
										className={classes.textField}
										value={newEmail}
										onChange={this.handleChange}
										validators={['required']}
										errorMessages={['this field is required']}
									/>
									<TextValidator
										name='repeatEmail'
										label='Confirm new email'
										type='text'
										className={classes.textField}
										value={repeatEmail}
										onChange={this.handleChange}
										validators={['isEmailMatch', 'required']}
										errorMessages={['Email mismatch', 'this field is required']}
									/>
								</ExpansionPanelDetails>
								<Divider />
								<ExpansionPanelActions>
									<Button size='small' onClick={this.handlePanelChange('panel5')}>Cancel</Button>
									<Button size='small' data-type='email' onClick={this.handleSubmit} color='primary' disabled={ isEmailChange }>Save</Button>
								</ExpansionPanelActions>
							</ExpansionPanel>
						</ValidatorForm>
					</Grid>
				</Grid>
			</div>
		)
	}
}

export default withContext(withStyles(styles)(Profile));
