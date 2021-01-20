import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles }  from '@material-ui/core/styles';
import { withContext } from '../../../appcontext';
import { getVehicleColors } from '../../../utils/list';
import { getYearsRange } from '../../../utils/date';
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
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

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

function Page(props) {
	const {
		classes,
		pageMode,
		vehicle,
		onHandleImageChange,
		onHandleChange,
		onHandleDelete,
		onHandleGoBack,
		onHandleSubmit,
		getApiMfrs,
		getApiModelsByMfrKey
	} = props;

	// Manufacturers use effect
	const [manufacturers, setManufacturers] = useState('');
	useEffect(() => {
		getApiMfrs().then(response => {
			setManufacturers(response.data.mfrs);
		});

		return () => setManufacturers('');
	}, []);

	// Models use effect
	const [models, setModels] = useState('');
	useEffect(() => {
		if (vehicle.mfrKey) {
			getApiModelsByMfrKey(vehicle.mfrKey).then(response => {
				setModels(response.data.models);
			});
		}

		return () => setModels('');
	}, [vehicle.mfrKey]);

	// Years use effect
	const [years, setYears] = useState('');
	useEffect(() => {
		setYears(getYearsRange(1950, 2022));

		return () => setYears('');
	}, []);

	// Colors use effect
	const [colors, setColors] = useState('');
	useEffect(() => {
		setColors(getVehicleColors());

		return () => setColors('');
	}, []);

	return (
		<Grid container spacing={4}>
			<ValidatorForm
				onSubmit={ (event) => onHandleSubmit(event) }
			>
				<Grid item xs={12}>
					{ pageMode === 'view' ?
						<Image src={ vehicle.image_path } />
						:
						<FormControl className={classes.formControl} required>
							<ThemeProvider theme={theme}>
								<DropzoneArea
									role="form"
									initialFiles={ pageMode !== 'new' ? [vehicle.image_path] : [] }
									filesLimit={1}
									showPreviews={false}
									showPreviewsInDropzone={true}
									clearOnUnmount={true}
									onChange={ (file) => onHandleImageChange(file) }
								/>
							</ThemeProvider>
						</FormControl>
					}
				</Grid>
				<Grid item xs={12}>
					<FormControl className={classes.formControl}>
						<ThemeProvider theme={theme}>
							<SelectValidator
								label="Condition *"
								value={ vehicle.condition }
								onChange={ (event) => onHandleChange(event) }
								inputProps={{
									name: "condition",
									id:   "condition",
									readOnly: pageMode === 'view'
								}}
								validators={["required"]}
								errorMessages={["This field is required"]}
							>
								<MenuItem aria-label="None" value="" />
								<MenuItem value="new">New</MenuItem>
								<MenuItem value="used">Used</MenuItem>
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
									label="Year *"
									value={ vehicle.year }
									onChange={ (event) => onHandleChange(event) }
									inputProps={{
										name: "year",
										id:   "year",
										readOnly: pageMode === 'view'
									}}
									validators={["required"]}
									errorMessages={["This field is required"]}
								>
									<MenuItem aria-label="None" value="" />
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
								label="Manufacturer *"
								value={ vehicle.mfrKey }
								onChange={ (event) => onHandleChange(event) }
								inputProps={{
									name: "mfrKey",
									id:   "mfrKey",
									readOnly: pageMode === 'view'
								}}
								validators={["required"]}
								errorMessages={["This field is required"]}
							>
								<MenuItem aria-label="None" value="" />
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
									label="Model *"
									value={ vehicle.modelKey }
									onChange={ (event) => onHandleChange(event) }
									inputProps={{
										name: "modelKey",
										id:   "modelKey",
										readOnly: pageMode === 'view'
									}}
									validators={["required"]}
									errorMessages={["This field is required"]}
								>
									<MenuItem aria-label="None" value="" />
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
									label="Color *"
									value={ vehicle.color }
									onChange={ (event) => onHandleChange(event) }
									inputProps={{
										name: "color",
										id:   "color",
										readOnly: pageMode === 'view'
									}}
									validators={["required"]}
									errorMessages={["This field is required"]}
								>
									<MenuItem aria-label="None" value="" />
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
						label="VIN *"
						value={ vehicle.vin }
						onChange={ (event) => onHandleChange(event) }
						validators={["required"]}
						errorMessages={["This field is required"]}
						inputProps={{
							name: "vin",
							id:   "vin",
							readOnly: pageMode === 'view'
						}}
					/>
					<FormHelperText>Vehicle identifier number</FormHelperText>
					</FormControl>
				</Grid>
				<Grid item xs={12}>
					<FormControl className={classes.formControl}>
					<TextValidator
						label="Plate"
						margin="normal"
						value={ vehicle.plate }
						onChange={ (event) => onHandleChange(event) }
						inputProps={{
							name: "plate",
							id:   "plate",
							readOnly: pageMode === 'view'
						}}
					/>
					</FormControl>
				</Grid>
				<Grid item xs={12}>
					{ pageMode !== 'view' &&
					<Button
						type="submit"
						variant="contained"
						color="default"
						className={classes.button}
						startIcon={<SaveIcon/>}
					>
						{ pageMode === 'new' ? 'New' : 'Update' }
					</Button>
					}
					{ pageMode === 'update' &&
					<Button
						type="button"
						variant="contained"
						color="default"
						className={classes.button}
						startIcon={<DeleteIcon />}
						onClick={ (event) => onHandleDelete(vehicle.key) }
					>
						Delete
					</Button>
					}
					<Button
						type="button"
						variant="contained"
						color="default"
						className={classes.button}
						startIcon={<ArrowBack />}
						onClick={ () => onHandleGoBack() }
					>
						Back
					</Button>
				</Grid>
			</ValidatorForm>
		</Grid>
	)
}

Page.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withContext(withStyles(styles)(Page));
