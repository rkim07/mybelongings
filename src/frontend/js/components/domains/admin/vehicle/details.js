import React, { useContext, useEffect, useState } from 'react';
import * as _ from 'lodash';
import { useParams } from 'react-router-dom';
import AppContext from '../../../../appcontext';
import { getVehicleColors, getVehicleStyles } from '../../vehicle/models/vehicle';
import { getYearsRange } from '../../../../helpers/date';
import { decimalFormatter } from '../../../../helpers/input';
import { DropzoneArea } from 'material-ui-dropzone';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import BusinessIcon from '@material-ui/icons/Business';
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import GradeIcon from '@material-ui/icons/Grade';
import SubtitlesIcon from '@material-ui/icons/Subtitles';
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
		MuiDropzoneArea: {
			root: {
				minHeight: 150
			}
		},
		MuiDropzonePreviewList: {
			image: {
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
 * Child component of modify
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Details(props) {
	const { key } = useParams();
	const classes = useStyles();
	const apis = useContext(AppContext);

	const {
		vehicle,
		onHandleImageChange, // parent call
		onHandleVehicleChange, // parent call
	} = props;

	const initialValues = {
		manufacturers: '',
		models: ''
	};

	const [values, setValues] = useState(initialValues);

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
		if (vehicle.mfrKey !== '') {
			apis.getApiModelsByMfrKey(vehicle.mfrKey).then(response => {
				setValues(prevState => ({
					...prevState,
					models: response.payload
				}));
			});
		}
	},[vehicle.mfrKey]);

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
		let newValue;

		if (name === 'mfrKey') {
			vehicle.modelKey = '';
		}

		if (name === 'mileage' && value !== '') {
			newValue = decimalFormatter(value);
		}

		onHandleVehicleChange(name, newValue ? newValue: value);
	}

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<ThemeProvider theme={theme}>
					<DropzoneArea
						role='form'
						initialFiles={ vehicle.imagePath ? [vehicle.imagePath] : [] }
						filesLimit={1}
						showPreviews={false}
						showPreviewsInDropzone={true}
						clearOnUnmount={true}
						dropzoneText='Add your vehicle image here'
						onChange={ onHandleImageChange }
					/>
				</ThemeProvider>
			</Grid>
			<Grid item xs={12} sm={6}>
				<SelectValidator
					fullWidth
					variant='outlined'
					label='Condition'
					name='condition'
					value={ vehicle.condition.toLowerCase() }
					onChange={ handleChange }
					validators={['required']}
					errorMessages={['Condition is required']}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<GradeIcon />
							</InputAdornment>
						)
					}}
				>
					<MenuItem value='new'>New</MenuItem>
					<MenuItem value='used'>Used</MenuItem>
				</SelectValidator>
			</Grid>
			<Grid item xs={12} sm={6}>
				<SelectValidator
					fullWidth
					variant='outlined'
					label='Year'
					name='year'
					value={ years ? vehicle.year : '' }
					onChange={ handleChange }
					validators={['required']}
					errorMessages={['Year is required']}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<CalendarTodayIcon />
							</InputAdornment>
						)
					}}
				>
					<MenuItem aria-label='None' value='' />
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
					label='Manufacturer'
					name='mfrKey'
					value={ values.manufacturers ? vehicle.mfrKey : '' }
					onChange={ handleChange }
					disabled={ key ? true : false }
					validators={['required']}
					errorMessages={['Manufacturer is required']}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<BusinessIcon />
							</InputAdornment>
						)
					}}
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
					label='Model'
					name='modelKey'
					value={ values.models ? vehicle.modelKey : '' }
					onChange={ handleChange }
					disabled={ key ? true : false }
					validators={['required']}
					errorMessages={['Model is required']}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<DirectionsCarIcon />
							</InputAdornment>
						)
					}}
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
					label='Color'
					name='color'
					value={ colors ? vehicle.color.toLowerCase() : '' }
					onChange={ handleChange }
					validators={['required']}
					errorMessages={['Color is required']}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<FormatColorFillIcon />
							</InputAdornment>
						)
					}}
				>
					<MenuItem aria-label='None' value='' />
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
					label='Style'
					name='style'
					value={ styles ? vehicle.style.toLowerCase() : '' }
					onChange={ handleChange }
					validators={['required']}
					errorMessages={['Style is required']}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<DirectionsCarIcon />
							</InputAdornment>
						)
					}}
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
					label='Mileage'
					name='mileage'
					value={ vehicle.mileage }
					onChange={ handleChange }
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<AccessTimeIcon />
							</InputAdornment>
						)
					}}
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextValidator
					fullWidth
					variant='outlined'
					label='Plate number'
					name='plate'
					value={ vehicle.plate }
					onChange={ handleChange }
					validators={['isMaxPlateLength']}
					errorMessages={['Plate number cannot exceed more than 8 characters']}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<KeyboardIcon />
							</InputAdornment>
						)
					}}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextValidator
					fullWidth
					variant='outlined'
					label='VIN'
					name='vin'
					value={ vehicle.vin }
					onChange={ handleChange }
					validators={[
						'required',
						'isCorrectVinLength',
					]}
					errorMessages={[
						'VIN is required',
						'VIN length must be between 11 and 17 characters'
					]}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<SubtitlesIcon />
							</InputAdornment>
						)
					}}
				/>
			</Grid>
		</Grid>
	)
}
