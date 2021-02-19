import React, { useEffect, useRef, useState } from 'react';
import * as _ from 'lodash';
import { currentYear } from '../../../../helpers/date';
import { decimalFormatter } from '../../../../helpers/input';
import Details from './details';
import Purchase from './purchase';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
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
	const classes = useStyles();
	const form = useRef();
	const steps = 4;
	const {
		vehicleKey,
		activeStep,
		onHandleSubmit,
		onHandleClose
	} = props;

	const initialValues = {
		vehicle: {
			mfrKey: '',
			modelKey: '',
			mfrName: '',
			condition: 'new',
			year: currentYear(),
			model: '',
			color: '',
			style: '',
			mileage: 0,
			vin: '',
			plate: '',
			image: '',
			imagePath: '',
			purchase: {
				storeKey: '',
				odometer: 0,
				deposit: 0,
				downPayment: 0,
				msrpPrice: 0,
				stickerPrice: 0,
				purchasePrice: 0,
				agreement: '',
				purchaseType: '',
				purchased: new Date()
			},
			insurance: {}
		},
		file: [],
		image: [],
		activeStep: activeStep || 0
	};

	const [values, setValues] = useState(initialValues);

	// Fetch vehicle by key and run effect only
	// once unless it's a different vehicle
	useEffect(() => {
		if (vehicleKey) {
			apis.getVehicle(vehicleKey).then(response => {
				const { payload, statusCode, statusType, message } = response
				if (statusCode < 400) {
					setValues(prevState => ({
						...prevState,
						vehicle: _.assign(prevState.vehicle, payload)
					}));
				} else {
					onHandleNotifier(statusType, message);
					navigate('/vehicles');
				}
			});
		}
	}, []);

	// Add or update vehicle
	const handleSubmit = async(e) => {
		e.preventDefault();
		onHandleSubmit(values);
	}

	// Handle vehicle step changes
	const handleVehicleChange = (name, value) => {
		setValues({
			...values,
			vehicle: {
				...values.vehicle,
				[name]: value
			}
		});
	}

	// Handle purchase step changes
	const handlePurchaseChange = (name, value) => {
		setValues({
			...values,
			vehicle: {
				...values.vehicle,
				purchase: {
					...values.vehicle.purchase,
					[name]: value
				}
			}
		});
	}

	// Handle insurance step changes
	const handleInsuranceChange = (name, value) => {
		setValues({
			...values,
			vehicle: {
				...values.vehicle,
				insurance: {
					...values.vehicle.insurance,
					[name]: value
				}
			}
		});
	}

	// Handle image
	const handleImageChange = (image) => {
		if (_.size(image) > 0) {
			setValues({ ...values, image: image });
		}
	}

	// Handle file
	const handleFileChange = (file) => {
		if (_.size(file) > 0) {
			setValues({ ...values, file: file });
		}
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
							{ vehicleKey ? 'Update ' : 'Add new ' } vehicle
						</Typography>
					</Grid>
				</Grid>
				{ !vehicleKey && (
					<Stepper activeStep={values.activeStep} alternativeLabel>
						<Step key='0'>
							<StepLabel>Vehicle information</StepLabel>
						</Step>
						<Step key='1'>
							<StepLabel>Purchase information</StepLabel>
						</Step>
						<Step key='2'>
							<StepLabel>Financial information</StepLabel>
						</Step>
						<Step key='3'>
							<StepLabel>Insurance information</StepLabel>
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
							<Button onClick={ handleReset }>Reset</Button>
						</React.Fragment>
					) : (
						<React.Fragment>
							{
								{
									'0': <Details
										vehicle={ values.vehicle }
										onHandleImageChange={ handleImageChange }
										onHandleVehicleChange={ handleVehicleChange }
									/>,
									'1': <Purchase
										purchase={ values.vehicle.purchase }
										onHandleFileChange={ handleFileChange }
										onHandlePurchaseChange={ handlePurchaseChange }
									/>,
									'2': <h1>Finance</h1>,
									'3': <h1>Insurance</h1>
								}[values.activeStep]
							}
							{ vehicleKey ? (
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
