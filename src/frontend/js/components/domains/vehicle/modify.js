import * as _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppContext from '../../../appcontext';
import { getVehicleColors, getVehicleStyles } from '../../shared/helpers/vehicleshelper';
import { currentYear, getYearsRange } from '../../../../../helpers/date';
import { DropzoneArea } from 'material-ui-dropzone';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Image from 'material-ui-image';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ArrowBack from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import { SelectValidator, TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	root: {
		marginTop: theme.spacing(4),
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
		}
	}
});

// Predefined lists
const colors = getVehicleColors();
const styles = getVehicleStyles();
const years = getYearsRange(1950, 2022);

/**
 * Child component of dashboard
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Modify(props) {
	const navigate = useNavigate();
	const { key } = useParams();
	const classes = useStyles();
	const apis = useContext(AppContext);

	const {
		onHandleSubmit, // parent call
		onHandleNotifier // parent call
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
			mileage: '',
			vin: '',
			plate: '',
			image: '',
			imagePath: ''
		},
		manufacturers: '',
		models: '',
		file: []
	};

	const [values, setValues] = useState(initialValues);

	// Fetch vehicle by key and run effect only
	// once unless it's a different vehicle
	useEffect(() => {
		if (key) {
			apis.getVehicle(key).then(response => {
				const {payload, statusCode, statusType, message } = response
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

	// Fetch manufacturers
	useEffect(() => {
		apis.getApiMfrs().then(response => {
			setValues(prevState => ({
				...prevState,
				manufacturers: response.payload
			}));
		});
	}, []);

	// Fetch models when a particular manufacturer is selected
	useEffect(() => {
		if (values.vehicle.mfrKey !== '') {
			apis.getApiModelsByMfrKey(values.vehicle.mfrKey).then(response => {
				setValues(prevState => ({
					...prevState,
					models: response.payload
				}));
			});
		}
	},[values.vehicle.mfrKey]);

	// Validate VIN length
	useEffect(() => {
		if (!ValidatorForm.hasValidationRule('isCorrectVinLength')) {
			ValidatorForm.addValidationRule('isCorrectVinLength', (value) => {
				if (value.length < 11 || value.length > 17) {
					return false;
				}

				return true;
			});
		}

		return function cleanVinLengthMatchRule() {
			if (ValidatorForm.hasValidationRule('isCorrectVinLength')) {
				ValidatorForm.removeValidationRule('isCorrectVinLength');
			}
		};
	});

	// Validate plate number length
	useEffect(() => {
		if (!ValidatorForm.hasValidationRule('isMaxPlateLength')) {
			ValidatorForm.addValidationRule('isMaxPlateLength', (value) => {
				if (value.length > 8) {
					return false;
				}

				return true;
			});
		}

		return function cleanPlateLengthMatchRule() {
			if (ValidatorForm.hasValidationRule('isMaxPlateLength')) {
				ValidatorForm.removeValidationRule('isMaxPlateLength');
			}
		};
	});

	// Handle select and input changes
	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === 'mfrKey') {
			values.vehicle.modelKey = '';
		}

		setValues({
			...values,
			vehicle: {
				...values.vehicle,
				[name]: value
			}
		});
	}

	// Handle image
	const handleImageChange = (file) => {
		if (_.size(file) > 0) {
			setValues({ ...values, file: file });
		}
	}

	return (
		<Container component='main' maxWidth="sm">
			<div className={classes.root}>
				<Grid container justify='flex-start'>
					<Grid item>
						<Typography gutterBottom variant='h5'>
							{ key ? 'Edit vehicle' : 'Add new vehicle' }
						</Typography>
					</Grid>
				</Grid>
				<ValidatorForm
					onSubmit={ (e) => onHandleSubmit(e, values.file, values.vehicle) }
					className={classes.form}
				>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<ThemeProvider theme={theme}>
								<DropzoneArea
									role='form'
									initialFiles={ values.vehicle.imagePath ? [values.vehicle.imagePath] : [] }
									filesLimit={1}
									showPreviews={false}
									showPreviewsInDropzone={true}
									clearOnUnmount={true}
									onChange={ handleImageChange }
								/>
							</ThemeProvider>
						</Grid>
						<Grid item xs={12} sm={6}>
							<SelectValidator
								fullWidth
								variant='outlined'
								label='Select condition'
								value={ values.vehicle.condition }
								onChange={ handleChange }
								name='condition'
								validators={['required']}
								errorMessages={['Condition is required']}
							>
								<MenuItem value='new'>New</MenuItem>
								<MenuItem value='used'>Used</MenuItem>
							</SelectValidator>
						</Grid>
						<Grid item xs={12} sm={6}>
							<SelectValidator
								fullWidth
								variant='outlined'
								label='Select year'
								value={ years ? values.vehicle.year : '' }
								onChange={ handleChange }
								name='year'
								validators={['required']}
								errorMessages={['Year is required']}
							>
								{ years && years.map((year) => (
									<MenuItem
										key={ year.value }
										value={ year.value }
									>
										{ year.label }
									</MenuItem>
								))}
							</SelectValidator>
						</Grid>
						<Grid item xs={12} sm={6}>
							<SelectValidator
								fullWidth
								variant='outlined'
								label='Select manufacturer'
								value={ values.manufacturers ? values.vehicle.mfrKey : '' }
								onChange={ handleChange }
								name='mfrKey'
								disabled={ key ? true : false }
								validators={['required']}
								errorMessages={['Manufacturer is required']}
							>
								<MenuItem aria-label='None' value='' />
								{ values.manufacturers && values.manufacturers.map((mfr) => (
									<MenuItem
										key={ mfr.key }
										value={ mfr.key }
									>
										{ mfr.mfrName }
									</MenuItem>
								))}
							</SelectValidator>
						</Grid>
						<Grid item xs={12} sm={6}>
							<SelectValidator
								fullWidth
								variant='outlined'
								label='Select model'
								value={ values.models ? values.vehicle.modelKey : '' }
								onChange={ handleChange }
								name='modelKey'
								disabled={ key ? true : false }
								validators={['required']}
								errorMessages={['Model is required']}
							>
								<MenuItem aria-label='Select a manufacturer first' value='' />
								{ values.models && values.models.map((model) => (
									<MenuItem
										key={ model.key }
										value={ model.key }
									>
										{ model.model }
									</MenuItem>
								))}
							</SelectValidator>
						</Grid>
						<Grid item xs={12} sm={6}>
							<SelectValidator
								fullWidth
								variant='outlined'
								label='Select color'
								value={ colors ? values.vehicle.color : '' }
								onChange={ handleChange }
								name='color'
								validators={['required']}
								errorMessages={['Color is required']}
							>
								{ colors && colors.map((color) => (
									<MenuItem
										key={ color.value }
										value={ color.value }
									>
										{ color.label }
									</MenuItem>
								))}
							</SelectValidator>
						</Grid>
						<Grid item xs={12} sm={6}>
							<SelectValidator
								fullWidth
								variant='outlined'
								label='Select style'
								value={ styles ? values.vehicle.style : '' }
								onChange={ handleChange }
								name='style'
								validators={['required']}
								errorMessages={['Style is required']}
							>
								{ styles && styles.map((style) => (
									<MenuItem
										key={ style.value }
										value={ style.value }
									>
										{ style.label }
									</MenuItem>
								))}
							</SelectValidator>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextValidator
								fullWidth
								variant='outlined'
								label='Enter mileage'
								name='mileage'
								value={ values.vehicle.mileage }
								onChange={ handleChange }
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextValidator
								fullWidth
								variant='outlined'
								label='Enter plate number'
								name='plate'
								value={ values.vehicle.plate }
								onChange={ handleChange }
								validators={['isMaxPlateLength']}
								errorMessages={['Plate number cannot exceed more than 8 characters']}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextValidator
								fullWidth
								variant='outlined'
								label='Enter VIN'
								name='vin'
								value={ values.vehicle.vin }
								onChange={ handleChange }
								validators={[
									'required',
									'isCorrectVinLength',
								]}
								errorMessages={[
									'VIN is required',
									'VIN length must be between 11 and 17 characters'
								]}
							/>
						</Grid>
					</Grid>
					<Grid container justify='flex-end' spacing={1}>
						<Grid item>
							<Button
								fullWidth
								size='small'
								type='button'
								variant='contained'
								className={classes.button}
								startIcon={<ArrowBack />}
								onClick={ () => navigate(-1) }
							>
								Back
							</Button>
						</Grid>
						<Grid item>
							<Button
								fullWidth
								size='small'
								type='submit'
								variant='contained'
								className={classes.button}
								startIcon={<SaveIcon/>}
							>
								{ key ? 'Update' : 'Add' }
							</Button>
						</Grid>
					</Grid>
				</ValidatorForm>
			</div>
		</Container>
	)
}
