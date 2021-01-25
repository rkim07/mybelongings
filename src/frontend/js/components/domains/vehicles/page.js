import React, { useState, useEffect } from 'react';
import { withStyles }  from '@material-ui/core/styles';
import { withContext } from '../../../contexts/appcontext';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { getVehicleColors } from '../../helpers/list';
import { getYearsRange } from '../../helpers/date';
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

function Page(props) {
	const {
		classes,
		section,
		vehicle,
		getApiModelsByMfrKey,
		getApiMfrs,
		onHandleImageChange,
		onHandleOpenDialog,
		onHandleChange,
		onHandleGoBack,
		onHandleSubmit
	} = props;

	// Manufacturers use effect
	const [manufacturers, setManufacturers] = useState();
	useEffect(() => {
		getApiMfrs().then(response => {
			setManufacturers(response.data.mfrs);
		});

		return () => setManufacturers('');
	}, []);

	// Models use effect
	const [models, setModels] = useState();
	useEffect(() => {
		if (vehicle.mfrKey) {
			getApiModelsByMfrKey(vehicle.mfrKey).then(response => {
				setModels(response.data.models);
			});
		}

		return () => setModels('');
	}, [vehicle.mfrKey]);

	// Years use effect
	const [years, setYears] = useState();
	useEffect(() => {
		setYears(getYearsRange(1950, 2022));

		return () => setYears('');
	}, []);

	// Colors use effect
	const [colors, setColors] = useState();
	useEffect(() => {
		setColors(getVehicleColors());

		return () => setColors('');
	}, []);

	return (
		<ValidatorForm
			instantValidate={false}
			onSubmit={ (e) => onHandleSubmit(e) }
		>
			<Grid container spacing={4}>
				<Grid item xs={12}>
					{ section === 'view' ?
						<Image src={ vehicle.image_path } />
						:
						<FormControl className={classes.formControl} required>
							<ThemeProvider theme={theme}>
								<DropzoneArea
									role="form"
									initialFiles={ section !== 'add' ? [vehicle.image_path] : [] }
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
								onChange={ (e) => onHandleChange(e) }
								inputProps={{
									name: "condition",
									id:   "condition",
									readOnly: section === 'view'
								}}
								validators={["required"]}
								errorMessages={["Condition is required"]}
							>
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
									onChange={ (e) => onHandleChange(e) }
									inputProps={{
										name: "year",
										id:   "year",
										readOnly: section === 'view'
									}}
									validators={["required"]}
									errorMessages={["Year is required"]}
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
									label="Manufacturer *"
									value={ vehicle.mfrKey }
									onChange={ (e) => onHandleChange(e) }
									inputProps={{
										name: "mfrKey",
										id:   "mfrKey",
										readOnly: section === 'view',
										disabled: section === 'update'
									}}
									validators={["required"]}
									errorMessages={["Manufacturer is required"]}
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
									onChange={ (e) => onHandleChange(e) }
									inputProps={{
										name: "modelKey",
										id:   "modelKey",
										readOnly: section === 'view',
										disabled: section === 'update'
									}}
									validators={["required"]}
									errorMessages={["Model is required"]}
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
									onChange={ (e) => onHandleChange(e) }
									inputProps={{
										name: "color",
										id:   "color",
										readOnly: section === 'view'
									}}
									validators={["required"]}
									errorMessages={["Color is required"]}
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
						label="VIN *"
						value={ vehicle.vin }
						onChange={ (e) => onHandleChange(e) }
						validators={['required']}
						errorMessages={['VIN is required']}
						inputProps={{
							name: "vin",
							id:   "vin",
							readOnly: section === 'view',
							disabled: section === 'update'
						}}
					/>
					<FormHelperText>Vehicle identifier number</FormHelperText>
					</FormControl>
				</Grid>
				<Grid item xs={12}>
					<FormControl className={classes.formControl}>
					<TextValidator
						label="Plate"
						value={ vehicle.plate }
						onChange={ (e) => onHandleChange(e) }
						inputProps={{
							name: "plate",
							id:   "plate",
							readOnly: section === 'view'
						}}
					/>
					</FormControl>
				</Grid>
				<Grid item xs={12}>
					{ section !== 'view' && (
						<Button
							type="submit"
							variant="contained"
							color="default"
							className={classes.button}
							startIcon={<SaveIcon/>}
						>
							{ section === 'add' ? 'Add' : 'Update' }
						</Button>
					)}
					{ section === 'view' && (
						<Button
							type="button"
							variant="contained"
							color="default"
							className={classes.button}
							startIcon={<DeleteIcon />}
							onClick={ () => onHandleOpenDialog('delete', vehicle) }
						>
							Delete
						</Button>
					)}
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
			</Grid>
		</ValidatorForm>
	)
}

export default withContext(withStyles(styles)(Page));
