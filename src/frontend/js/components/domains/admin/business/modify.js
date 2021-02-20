import React, {useContext, useEffect, useRef, useState} from 'react';
import * as _ from 'lodash';
import AppContext from '../../../../appcontext';
import Details from './details';
import Address from './address';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ReplayIcon from '@material-ui/icons/Replay';
import SaveIcon from '@material-ui/icons/Save';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
	paper: {
		marginTop: theme.spacing(4),
		flexGrow: 1,
		alignItems: 'center'
	},
	form: {
		width: '100%',
		marginTop: theme.spacing(3)
	},
	backButton: {
		marginRight: theme.spacing(1),
	},
	button: {
		background: '#404040',
		color: 'white',
		height: 36,
		margin: theme.spacing(3, 0, 2)
	},
	instructions: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	}
}));

export default function Modify(props) {
	const apis = useContext(AppContext);
	const classes = useStyles();
	const form = useRef();
	const steps = 2;
	const {
		businessKey,
		activeStep,
		onHandleSubmit,
		onHandleClose
	} = props;

	const initialValues = {
		business: {
			addressKey: '',
			name: '',
			landline: '',
			mobile: '',
			email: '',
			website: '',
			salesPerson: '',
			type: '',
			notes: '',
			address: {
				street: '',
				city: '',
				state: 'ca',
				zip: '',
				county: '',
				country: '',
				type: ''
			}
		},
		activeStep: activeStep || 0
	};

	const [values, setValues] = useState(initialValues);

	// Fetch business by key and run effect only
	// once unless it's a different business
	useEffect(() => {
		if (businessKey) {
			apis.getBusiness(businessKey).then(response => {
				const { payload, statusCode, statusType, message } = response
				if (statusCode < 400) {
					setValues(prevState => ({
						...prevState,
						business: _.assign(prevState.business, payload)
					}));
				} else {
					onHandleNotifier(statusType, message);
					navigate('/business');
				}
			});
		}
	}, []);

	// Add or update business
	const handleSubmit = async(e) => {
		e.preventDefault();
		onHandleSubmit(values.business);
	}

	// Handle business step changes
	const handleBusinessChange = (name, value) => {
		setValues({
			...values,
			business: {
				...values.business,
				[name]: value
			}
		});
	}

	// Handle purchase step changes
	const handleAddressChange = (name, value) => {
		setValues({
			...values,
			business: {
				...values.business,
				address: {
					...values.business.purchase,
					[name]: value
				}
			}
		});
	}

	// Move forward in stepper
	const handleNext = () => {
		form.current.isFormValid(false).then((valid) => {
			if (valid) {
				setValues(prevState => ({
					...prevState,
					activeStep: prevState.activeStep + 1
				}));
			}
		});
	}

	// Allow selected sections to be skipped.
	// Could be added later
	const handleSkip = () => {
		setValues(prevState => ({
			...prevState,
			activeStep: prevState.activeStep + 1
		}));
	}

	// Move backwards in stepper
	const handleBack = () => {
		setValues(prevState => ({
			...prevState,
			activeStep: prevState.activeStep - 1
		}));
	}

	// Reset to beginning of stepper
	const handleReset = () => {
		setValues({
			...values,
			activeStep: 0
		});
	};

	return (
		<Container maxWidth='lg' className={classes.container}>
			<div className={classes.paper}>
				<Grid container justify='flex-start'>
					<Grid item>
						<Typography gutterBottom variant='h5'>
							{ businessKey ? 'Update ' : 'Add new ' } business
						</Typography>
					</Grid>
				</Grid>
				{ !businessKey && (
					<Stepper activeStep={values.activeStep} alternativeLabel>
						<Step key='0'>
							<StepLabel>Address information</StepLabel>
						</Step>
						<Step key='1'>
							<StepLabel>Business information</StepLabel>
						</Step>
					</Stepper>
				)}
				<ValidatorForm
					onSubmit={ (e) => handleSubmit(e) }
					className={classes.form}
					ref={ form }
				>
					{ values.activeStep === steps ? (
						<React.Fragment>
							<Typography className={classes.instructions}>All steps completed</Typography>
							<Button
								fullWidth
								size='small'
								variant='contained'
								className={classes.button}
								startIcon={<ReplayIcon />}
								onClick={ handleReset }
							>
								Reset
							</Button>
						</React.Fragment>
					) : (
						<React.Fragment>
							{
								{
									'0': <Details
										business={ values.business }
										onHandleBusinessChange={ handleBusinessChange }
									/>,
									'1': <Address
										address={ values.business.address }
										onHandleAddressChange={ handleAddressChange }
									/>
								}[values.activeStep]
							}
							{ businessKey ? (
								<Grid container justify='flex-end' spacing={1}>
									<Grid item>
										<Button
											fullWidth
											size='small'
											variant='contained'
											className={classes.button}
											startIcon={<ExitToAppIcon />}
											onClick={ () => onHandleClose() }
										>
											Close
										</Button>
									</Grid>
									<Grid item>
										<Button
											fullWidth
											size='small'
											variant='contained'
											className={classes.button}
											startIcon={<SaveIcon />}
											onClick={ (e) => handleSubmit(e) }
										>
											Update
										</Button>
									</Grid>
								</Grid>
							) : (
								<Grid container justify='flex-end' spacing={1}>
									<Grid item>
										<Button
											fullWidth
											size='small'
											variant='contained'
											className={classes.button}
											startIcon={<NavigateBeforeIcon />}
											onClick={ handleBack }
											disabled={ values.activeStep === 0 }
										>
											Back
										</Button>
									</Grid>
									{ (values.activeStep > 0 && values.activeStep !== steps - 1) && (
										<Grid item>
											<Button
												fullWidth
												size='small'
												variant='contained'
												className={classes.button}
												endIcon={<SkipNextIcon />}
												onClick={ handleSkip }
											>
												Skip
											</Button>
										</Grid>
									)}
									<Grid item>
										<Button
											fullWidth
											size='small'
											variant='contained'
											className={classes.button}
											endIcon={<NavigateNextIcon />}
											onClick={ values.activeStep === steps - 1 ? (e) => handleSubmit(e) : handleNext }
										>
											{ values.activeStep === steps - 1 ? 'Finish' : 'Next' }
										</Button>
									</Grid>
								</Grid>
							)}
						</React.Fragment>
					)}
				</ValidatorForm>
			</div>
		</Container>
	);
}
