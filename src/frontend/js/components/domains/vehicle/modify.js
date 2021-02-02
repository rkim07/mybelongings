import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import * as _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import AppContext from '../../../appcontext';
import { getVehicleColors } from '../../shared/helpers/list';
import { currentYear, getYearsRange } from '../../shared/helpers/date';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import Image from 'material-ui-image';
import Button from '@material-ui/core/Button';
import ArrowBack from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import { SelectValidator, TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { DropzoneArea } from 'material-ui-dropzone';

const styles = (theme) => ({
	formControl: {
		margin: theme.spacing(1)
	},
	validatorElement: {
		minWidth: 150
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

const colors = getVehicleColors();
const years = getYearsRange(1950, 2022);

function Modify(props) {
	const navigate = useNavigate();
	const { key } = useParams();
	const apis = useContext(AppContext);

	const {
		classes,
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
				const {payload, statusCode, statusType, message} = response
				if (statusCode < 400) {
					setValues(prevState => ({...prevState, vehicle: _.assign(prevState.vehicle, payload)}));
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
			setValues(prevState => ({ ...prevState, manufacturers: response.payload}));
		});
	}, []);

	// Fetch models when a particular manufacturer is selected
	useEffect(() => {
		if (values.vehicle.mfrKey !== '') {
			apis.getApiModelsByMfrKey(values.vehicle.mfrKey).then(response => {
				setValues(prevState => ({...prevState, models: response.payload}));
			});
		}
	},[values.vehicle.mfrKey]);

	// Validate VIN length
	useEffect(() => {
		if (!ValidatorForm.hasValidationRule("isCorrectVinLength")) {
			ValidatorForm.addValidationRule('isCorrectVinLength', (value) => {
				if (value.length < 11 || value.length > 17) {
					return false;
				}

				return true;
			});
		}

		return function cleanVinLengthMatchRule() {
			if (ValidatorForm.hasValidationRule("isCorrectVinLength")) {
				ValidatorForm.removeValidationRule("isCorrectVinLength");
			}
		};
	});

	// Validate plate number length
	useEffect(() => {
		if (!ValidatorForm.hasValidationRule("isMaxPlateLength")) {
			ValidatorForm.addValidationRule('isMaxPlateLength', (value) => {
				if (value.length > 8) {
					return false;
				}

				return true;
			});
		}

		return function cleanPlateLengthMatchRule() {
			if (ValidatorForm.hasValidationRule("isMaxPlateLength")) {
				ValidatorForm.removeValidationRule("isMaxPlateLength");
			}
		};
	});

	// Handle select and input changes
	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === "mfrKey") {
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
		<ValidatorForm
			onSubmit={ (e) => onHandleSubmit(e, values.file, values.vehicle) }
		>
			<Grid container spacing={4}>
				<Grid item xs={12}>
					<FormControl className={classes.formControl} required>
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
					</FormControl>
				</Grid>
				<Grid item xs={12}>
					<FormControl className={classes.formControl}>
						<ThemeProvider theme={theme}>
							<SelectValidator
								label='Condition *'
								value={ values.vehicle.condition }
								onChange={ handleChange }
								inputProps={{
									name: 'condition',
									id:   'condition'
								}}
								validators={['required']}
								errorMessages={['Condition is required']}
							>
								<MenuItem value='new'>New</MenuItem>
								<MenuItem value='used'>Used</MenuItem>
							</SelectValidator>
							<FormHelperText>The condition when the car was purchased</FormHelperText>
						</ThemeProvider>
					</FormControl>
				</Grid>
				{ years && (
					<Grid item xs={12}>
						<FormControl className={classes.formControl}>
							<ThemeProvider theme={theme}>
								<SelectValidator
									label='Year *'
									value={ values.vehicle.year }
									onChange={ handleChange }
									inputProps={{
										name: 'year',
										id:   'year'
									}}
									validators={['required']}
									errorMessages={['Year is required']}
								>
									{ years.map((year) => (
										<MenuItem key={ year.value } value={ year.value }>{ year.label }</MenuItem>
									))}
								</SelectValidator>
							</ThemeProvider>
							<FormHelperText>Year that vehicle was made</FormHelperText>
						</FormControl>
					</Grid>
				)}
				{ values.manufacturers && (
					<Grid item xs={12}>
						<FormControl className={classes.formControl}>
							<ThemeProvider theme={theme}>
								<SelectValidator
									label='Manufacturer *'
									value={ values.vehicle.mfrKey }
									onChange={ handleChange }
									inputProps={{
										name: 'mfrKey',
										id:   'mfrKey',
										disabled: key ? true : false
									}}
									validators={['required']}
									errorMessages={['Manufacturer is required']}
								>
									<MenuItem aria-label='None' value='' />
									{ values.manufacturers.map((mfr) => (
										<MenuItem key={ mfr.key } value={ mfr.key }>{ mfr.mfrName }</MenuItem>
									))}
								</SelectValidator>
							</ThemeProvider>
							<FormHelperText>Choose a manufacturer to show all the models below</FormHelperText>
						</FormControl>
					</Grid>
				)}
				{ values.models && (
					<Grid item xs={12}>
						<FormControl className={classes.formControl}>
							<ThemeProvider theme={theme}>
								<SelectValidator
									label='Model *'
									value={ values.vehicle.modelKey || '' }
									onChange={ handleChange }
									inputProps={{
										name: 'modelKey',
										id:   'modelKey',
										disabled: key ? true : false
									}}
									validators={['required']}
									errorMessages={['Model is required']}
								>
									<MenuItem aria-label='None' value='' />
									{ values.models.map((model) => (
										<MenuItem key={ model.key } value={ model.key }>{ model.model }</MenuItem>
									))}
								</SelectValidator>
							</ThemeProvider>
							<FormHelperText>Models will be changing according to selected manufacturer</FormHelperText>
						</FormControl>
					</Grid>
				)}
				{ colors && (
					<Grid item xs={12}>
						<FormControl className={classes.formControl}>
							<ThemeProvider theme={theme}>
								<SelectValidator
									label='Color *'
									value={ values.vehicle.color }
									onChange={ handleChange }
									inputProps={{
										name: 'color',
										id:   'color'
									}}
									validators={['required']}
									errorMessages={['Color is required']}
								>
									{ colors.map((color) => (
										<MenuItem key={ color.value } value={ color.value }>{ color.label }</MenuItem>
									))}
								</SelectValidator>
							</ThemeProvider>
						</FormControl>
					</Grid>
				)}
				<Grid item xs={12}>
					<FormControl className={classes.formControl}>
					<TextValidator
						label='VIN *'
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
						inputProps={{
							name: 'vin',
							id:   'vin'
						}}
					/>
					<FormHelperText>Vehicle identifier number</FormHelperText>
					</FormControl>
				</Grid>
				<Grid item xs={12}>
					<FormControl className={classes.formControl}>
					<TextValidator
						label='Plate'
						value={ values.vehicle.plate }
						onChange={ handleChange }
						inputProps={{
							name: 'plate',
							id:   'plate'
						}}
						validators={['isMaxPlateLength']}
						errorMessages={['Plate number cannot exceed more than 8 characters']}
					/>
					</FormControl>
				</Grid>
				<Grid item xs={12}>
					<Button
						type='submit'
						variant='contained'
						color='default'
						className={classes.button}
						startIcon={<SaveIcon/>}
					>
						{ key ? 'Update' : 'Add' }
					</Button>
					<Button
						type='button'
						variant='contained'
						color='default'
						className={classes.button}
						startIcon={<ArrowBack />}
						onClick={ () => navigate(-1) }
					>
						Back
					</Button>
				</Grid>
			</Grid>
		</ValidatorForm>
	)
}

export default withStyles(styles)(Modify);
