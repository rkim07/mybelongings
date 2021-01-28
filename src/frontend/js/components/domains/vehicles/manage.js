import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withContext } from '../../../appcontext';
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

function Manage(props) {
	const { key } = useParams();
	const navigate = useNavigate();

	const {
		classes,
		getVehicle, // api call
		getApiMfrs, // api call
		getApiModelsByMfrKey, // api call
		onHandleSubmit // parent call
	} = props;

	// Initial vehicle state
	const [vehicle, setVehicle] = useState({
		mfrKey: '',
		mfrName: '',
		modelKey: '',
		model: '',
		image: '',
		image_path: '',
		condition: 'new',
		year: currentYear(),
		color: '',
		vin: '',
		plate: ''
	});

	const [mode, setMode] = useState(!key ? 'add' : 'update');
	const [file, setFile] = useState([]);
	const [submitted, setSubmitted] = useState(false);

	/**
	 * Fetch vehicle by key or don't do anything
	 * when adding new vehicle
	 */
	useEffect(() => {
		// Don't run this use effect if vehicle key is not set
		// It's add new vehicle page mode
		if (mode === 'update') {
			getVehicle(key).then(response => {
				const { payload, statusCode, statusType, message } = response
				if (statusCode < 400) {
					setVehicle(payload);
				} else {
					onHandleNotifier(statusType, message);
					navigate('/');
				}

			});
		}

		return () => setVehicle('');
	}, []);

	const [imagePath, setImagePath] = useState(vehicle.image_path ? [vehicle.image_path] : [])

	/**
	 * Fetch manufacturers
	 */
	const [manufacturers, setManufacturers] = useState();
	useEffect(() => {
		getApiMfrs().then(response => {
			setManufacturers(response.payload);
		});
	}, []);

	/**
	 * Fetch models when a particular manufacturer is selected
	 */
	const [models, setModels] = useState();
	useEffect(() => {
		if (vehicle.mfrKey) {
			getApiModelsByMfrKey(vehicle.mfrKey).then(response => {
				setModels(response.payload);
			});
		}
	}, [vehicle.mfrKey || '']);

	/**
	 * Handle select and input changes
	 *
	 * @param e
	 */
	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === "mfrKey") {
			vehicle.modelKey = '';
		}

		setVehicle({ ...vehicle, [name]: value });
	}

	/**
	 * Handle image
	 *
	 * @param file
	 */
	const handleImageChange = (file) => {
		if (_.size(file) > 0) {
			setFile(file);
		}
	}

	return (
		<ValidatorForm
			instantValidate={false}
			onSubmit={ (e) => onHandleSubmit(e, file, vehicle) }
		>
			{ submitted && (<Navigate to="/vehicles" />)}
			<Grid container spacing={4}>
				<Grid item xs={12}>
					<FormControl className={classes.formControl} required>
						<ThemeProvider theme={theme}>
							<DropzoneArea
								role='form'
								initialFiles={ imagePath }
								filesLimit={1}
								showPreviews={false}
								showPreviewsInDropzone={true}
								clearOnUnmount={true}
								onChange={ (file) => handleImageChange(file) }
							/>
						</ThemeProvider>
					</FormControl>
				</Grid>
				<Grid item xs={12}>
					<FormControl className={classes.formControl}>
						<ThemeProvider theme={theme}>
							<SelectValidator
								label='Condition *'
								value={ vehicle.condition }
								onChange={ (e) => handleChange(e) }
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
									value={ vehicle.year }
									onChange={ (e) => handleChange(e) }
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
				{ manufacturers && (
					<Grid item xs={12}>
						<FormControl className={classes.formControl}>
							<ThemeProvider theme={theme}>
								<SelectValidator
									label='Manufacturer *'
									value={ vehicle.mfrKey }
									onChange={ (e) => handleChange(e) }
									inputProps={{
										name: 'mfrKey',
										id:   'mfrKey',
										disabled: mode === 'update'
									}}
									validators={['required']}
									errorMessages={['Manufacturer is required']}
								>
									<MenuItem aria-label='None' value='' />
									{ manufacturers.map((mfr) => (
										<MenuItem key={ mfr.key } value={ mfr.key }>{ mfr.mfrName }</MenuItem>
									))}
								</SelectValidator>
							</ThemeProvider>
							<FormHelperText>Choose a manufacturer to show all the models below</FormHelperText>
						</FormControl>
					</Grid>
				)}
				{ models && (
					<Grid item xs={12}>
						<FormControl className={classes.formControl}>
							<ThemeProvider theme={theme}>
								<SelectValidator
									label='Model *'
									value={ vehicle.modelKey }
									onChange={ (e) => handleChange(e) }
									inputProps={{
										name: 'modelKey',
										id:   'modelKey',
										disabled: mode === 'update'
									}}
									validators={['required']}
									errorMessages={['Model is required']}
								>
									<MenuItem aria-label='None' value='' />
									{ models.map((model) => (
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
									value={ vehicle.color }
									onChange={ (e) => handleChange(e) }
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
						value={ vehicle.vin }
						onChange={ (e) => handleChange(e) }
						validators={['required']}
						errorMessages={['VIN is required']}
						inputProps={{
							name: 'vin',
							id:   'vin',
							disabled: mode === 'update'
						}}
					/>
					<FormHelperText>Vehicle identifier number</FormHelperText>
					</FormControl>
				</Grid>
				<Grid item xs={12}>
					<FormControl className={classes.formControl}>
					<TextValidator
						label='Plate'
						value={ vehicle.plate }
						onChange={ (e) => handleChange(e) }
						inputProps={{
							name: 'plate',
							id:   'plate'
						}}
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
						{ mode === 'add' ? 'Add' : 'Update' }
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

export default withContext(withStyles(styles)(Manage));
