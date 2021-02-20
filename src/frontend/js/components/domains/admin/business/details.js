import React from 'react';
import { useParams } from 'react-router-dom';
import * as _ from 'lodash';
import AppContext from '../../../../appcontext';
import { getBusinessTypes } from '../../../../helpers/list';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import MaskedInput from 'react-text-mask';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import EmailIcon from '@material-ui/icons/Email';
import PublicIcon from '@material-ui/icons/Public';
import BusinessIcon from '@material-ui/icons/Business';
import StoreIcon from '@material-ui/icons/Store';
import PersonIcon from '@material-ui/icons/Person';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
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

const businessTypes = getBusinessTypes();

function TextMaskCustom(props) {
	const { inputRef, ...other } = props;

	return (
		<MaskedInput
			{...other}
			ref={(ref) => {
				inputRef(ref ? ref.inputElement : null);
			}}
			mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
			placeholderChar={'\u2000'}
			showMask
		/>
	);
}

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
	const {
		business,
		onHandleBusinessChange, // parent call
	} = props;

	const initialValues = {
		landlineTextmask: '(   )    -    ' || business.landline,
		mobileTextmask: '(   )    -    ' || business.mobile
	}
	const [values, setValues] = React.useState(initialValues);

	// Handle select and input changes
	const handleChange = (e) => {
		const { name, value } = e.target;

		onHandleBusinessChange(name, value);
	}

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<TextValidator
					fullWidth
					variant='outlined'
					label='Name'
					name='name'
					value={ business.name }
					onChange={ handleChange }
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<StoreIcon />
							</InputAdornment>
						)
					}}
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<SelectValidator
					fullWidth
					variant='outlined'
					label='Business type'
					name='type'
					value={ businessTypes ? business.type.toLowerCase() : '' }
					onChange={ handleChange }
					validators={['required']}
					errorMessages={['Year is required']}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<BusinessIcon />
							</InputAdornment>
						)
					}}
				>
					<MenuItem aria-label='None' value='' />
					{ businessTypes && businessTypes.map((type) => (
						<MenuItem
							key={ type.value }
							value={ type.value }
						>
							{ type.label }
						</MenuItem>
					))}
				</SelectValidator>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextValidator
					fullWidth
					variant='outlined'
					label='Sales person'
					name='salesPerson'
					value={ business.salesPerson }
					onChange={ handleChange }
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<PersonIcon />
							</InputAdornment>
						)
					}}
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<InputLabel>Landline number</InputLabel>
				<Input
					value={ values.landlineTextmask }
					onChange={ handleChange }
					name='landline'
					inputComponent={ TextMaskCustom }
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<InputLabel>Mobile number</InputLabel>
				<Input
					value={ values.mobileTextmask }
					onChange={ handleChange }
					name='mobile'
					inputComponent={ TextMaskCustom }
				/>
			</Grid>
			<Grid item xs={12}>
				<TextValidator
					fullWidth
					variant='outlined'
					label='Email'
					name='email'
					value={ business.email }
					onChange={ handleChange }
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<EmailIcon />
							</InputAdornment>
						)
					}}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextValidator
					fullWidth
					variant='outlined'
					label='Website'
					name='website'
					value={ business.website }
					onChange={ handleChange }
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<PublicIcon />
							</InputAdornment>
						)
					}}
				/>
			</Grid>
			<Grid item xs={12}>
				<InputLabel>Notes</InputLabel>
				<TextareaAutosize
					rowsMax={4}
					aria-label='maximum height'
					placeholder={ business.notes }
					onChange={ handleChange }
				/>
			</Grid>
		</Grid>
	)
}
