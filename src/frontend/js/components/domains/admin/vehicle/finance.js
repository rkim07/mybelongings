import React, {useContext, useEffect, useState} from 'react';
import * as _ from 'lodash';
import moment from 'moment';
import AppContext from '../../../../appcontext';
import { decimalFormatter } from '../../../../helpers/input';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import BusinessIcon from '@material-ui/icons/Business';
import PersonIcon from '@material-ui/icons/Person';
import HistoryIcon from '@material-ui/icons/History';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
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

/**
 * Child component of modify
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Finance(props) {
	const apis = useContext(AppContext);
	const classes = useStyles();

	const {
		finance,
		onHandleFinanceChange, // parent call
	} = props;

	const initialValues = {
		businesses: []
	};

	const [values, setValues] = useState(initialValues);

	// Determine if user is an admin
	useEffect(() => {
		apis.getBusinessesByType('bank').then(response => {
			if (response.statusCode < 400) {
				setValues(prevState => ({
					...prevState,
					businesses: response.payload
				}));
			}
		});
	}, []);

	// Handle dropdown and input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		let newValue;

		if ((name === 'originalLoan' ||
			name === 'currentPrincipal' ||
			name === 'paymentAmount' ) && value !== '') {
			newValue = decimalFormatter(value);
		}

		onHandleFinanceChange(name, newValue ? newValue: value);
	}

	// Handle date selection
	const handleDateChange = (date) => {
		onHandleFinanceChange('originated', date);
	}

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<SelectValidator
					fullWidth
					variant='outlined'
					label='Business'
					name='businessKey'
					value={ values.businesses ? finance.businessKey : '' }
					onChange={ handleChange }
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<BusinessIcon />
							</InputAdornment>
						)
					}}
				>
					<MenuItem aria-label='None' value='' />
					{ values.businesses && values.businesses.map((business) => (
						<MenuItem
							key={ business.key }
							value={ business.key }
						>
							{ business.customName }
						</MenuItem>
					))}
				</SelectValidator>
			</Grid>
			<Grid item xs={12} sm={6}>
				<MuiPickersUtilsProvider utils={ DateFnsUtils }>
					<KeyboardDatePicker
						autoOk={ true }
						variant='inline'
						label='Origination date'
						format='MM/dd/yyyy'
						value={ finance.originated }
						onChange={ handleDateChange }
						KeyboardButtonProps={{
							'aria-label': 'change date',
						}}
					/>
				</MuiPickersUtilsProvider>
			</Grid>
			<Grid item xs={12} sm={6}>
				<SelectValidator
					fullWidth
					variant='outlined'
					label='Term'
					name='term'
					value={ finance.term ? finance.term : '' }
					onChange={ handleChange }
					validators={['required']}
					errorMessages={['Term is required']}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<HistoryIcon />
							</InputAdornment>
						)
					}}
				>
					<MenuItem
						key='36'
						value='36'
					>
						36 months
					</MenuItem>
					<MenuItem
						key='48'
						value='48'
					>
						48 months
					</MenuItem>
					<MenuItem
						key='60'
						value='60'
					>
						60 months
					</MenuItem>
				</SelectValidator>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextValidator
					fullWidth
					variant='outlined'
					label='Account number'
					name='accountNumber'
					value={ finance.accountNumber }
					onChange={ handleChange }
					validators={['required']}
					errorMessages={['Account number is required']}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<PersonIcon />
							</InputAdornment>
						)
					}}
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextValidator
					fullWidth
					variant='outlined'
					label='Original loan'
					name='originalLoan'
					value={ finance.originalLoan }
					onChange={ handleChange }
					validators={['required']}
					errorMessages={['Original loan amount is required']}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								$
							</InputAdornment>
						)
					}}
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextValidator
					fullWidth
					variant='outlined'
					label='Current principal'
					name='currentPrincipal'
					value={ finance.currentPrincipal }
					onChange={ handleChange }
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								$
							</InputAdornment>
						)
					}}
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextValidator
					fullWidth
					variant='outlined'
					label='Paymnet amount'
					name='paymentAmount'
					value={ finance.paymentAmount }
					onChange={ handleChange }
					validators={['required']}
					errorMessages={['Payment amount is required']}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								$
							</InputAdornment>
						)
					}}
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextValidator
					fullWidth
					variant='outlined'
					label='Interest rate'
					name='interestRate'
					value={ finance.interestRate }
					onChange={ handleChange }
					validators={['required']}
					errorMessages={['Interest rate is required']}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								%
							</InputAdornment>
						)
					}}
				/>
			</Grid>
		</Grid>
	)
}
