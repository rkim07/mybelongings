import React from 'react';
import * as _ from 'lodash';
import { useParams } from 'react-router-dom';
import AppContext from '../../../../appcontext';
import { getAddressTypes, getCountries, getStates } from '../../../../helpers/list';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import ExploreIcon from '@material-ui/icons/Explore';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { SelectValidator, TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
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

const addressTypes = getAddressTypes();
const states = getStates();
const countries = getCountries();

/**
 * Child component of modify
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Address(props) {
	const { key } = useParams();
	const classes = useStyles();
	const {
		address,
		onHandleAddressChange, // parent call
	} = props;

	// Handle select and input changes
	const handleChange = (e) => {
		const { name, value } = e.target;

		onHandleAddressChange(name, value);
	}

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} sm={2}>
				<SelectValidator
					fullWidth
					variant='outlined'
					label='Address type'
					name='type'
					value={ addressTypes ? address.type.toLowerCase() : '' }
					onChange={ handleChange }
					validators={['required']}
					errorMessages={['Year is required']}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<MyLocationIcon />
							</InputAdornment>
						)
					}}
				>
					<MenuItem aria-label='None' value='' />
					{ addressTypes && addressTypes.map((type) => (
						<MenuItem
							key={ type.value }
							value={ type.value }
						>
							{ type.label }
						</MenuItem>
					))}
				</SelectValidator>
			</Grid>
			<Grid item xs={12}>
				<TextValidator
					fullWidth
					variant='outlined'
					label='Street'
					name='street'
					value={ address.street }
					onChange={ handleChange }
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<LocationOnIcon />
							</InputAdornment>
						)
					}}
				/>
			</Grid>
			<Grid item xs={12} sm={4}>
				<TextValidator
					fullWidth
					variant='outlined'
					label='City'
					name='city'
					value={ address.city }
					onChange={ handleChange }
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<ExploreIcon />
							</InputAdornment>
						)
					}}
				/>
			</Grid>
			<Grid item xs={12} sm={4}>
				<SelectValidator
					fullWidth
					variant='outlined'
					label='State'
					name='state'
					value={ states ? address.state.toLowerCase() : '' }
					onChange={ handleChange }
					validators={['required']}
					errorMessages={['Year is required']}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<ExploreIcon />
							</InputAdornment>
						)
					}}
				>
					<MenuItem aria-label='None' value='' />
					{ states && states.map((state) => (
						<MenuItem
							key={ state.value }
							value={ state.value }
						>
							{ state.label }
						</MenuItem>
					))}
				</SelectValidator>
			</Grid>
			<Grid item xs={12} sm={4}>
				<TextValidator
					fullWidth
					variant='outlined'
					label='Zip'
					name='zip'
					value={ address.zip }
					onChange={ handleChange }
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<ExploreIcon />
							</InputAdornment>
						)
					}}
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextValidator
					fullWidth
					variant='outlined'
					label='County'
					name='county'
					value={ address.county }
					onChange={ handleChange }
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<ExploreIcon />
							</InputAdornment>
						)
					}}
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<SelectValidator
					fullWidth
					variant='outlined'
					label='Country'
					name='country'
					value={ states ? address.state.toLowerCase() : '' }
					onChange={ handleChange }
					validators={['required']}
					errorMessages={['Country is required']}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<ExploreIcon />
							</InputAdornment>
						)
					}}
				>
					<MenuItem aria-label='None' value='' />
					{ countries && countries.map((country) => (
						<MenuItem
							key={ country.value }
							value={ country.value }
						>
							{ country.label }
						</MenuItem>
					))}
				</SelectValidator>
			</Grid>
		</Grid>
	)
}
