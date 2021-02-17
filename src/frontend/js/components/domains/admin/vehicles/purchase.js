import React, {useEffect} from 'react';
import * as _ from 'lodash';
import moment from 'moment';
import {  useParams } from 'react-router-dom';
import { decimalFormatter } from '../../../../helpers/input';
import { DropzoneArea } from 'material-ui-dropzone';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import {SelectValidator, TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
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

/**
 * Child component of modify
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Purchase(props) {
	const { key } = useParams();
	const classes = useStyles();

	const {
		purchase,
		onHandleFileChange, // parent call
		onHandlePurchaseChange, // parent call
	} = props;

	// Handle dropdown and input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		let newValue;

		if ((name === 'odometer' ||
			name === 'deposit' ||
			name === 'downPayment' ||
			name === 'msrpPrice' ||
			name === 'stickerPrice' ||
			name === 'purchasePrice') && value !== '') {
			newValue = decimalFormatter(value);
		}

		onHandlePurchaseChange(name, newValue ? newValue: value);
	}

	// Handle date selection
	const handleDateChange = (date) => {
		onHandlePurchaseChange('purchased', date);
	}

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} sm={6}>
				<MuiPickersUtilsProvider utils={ DateFnsUtils }>
					<KeyboardDatePicker
						autoOk={ true }
						disableToolbar
						variant='inline'
						label='Purchased date'
						format="MM/dd/yyyy"
						value={ purchase.purchased }
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
					label='Purchase type'
					name='purchaseType'
					value={ purchase.purchaseType }
					onChange={ handleChange }
					validators={['required']}
					errorMessages={['Model is required']}
				>
					<MenuItem
						key='lease'
						value='lease'
					>
						Lease
					</MenuItem>
					<MenuItem
						key='finance'
						value='finance'
					>
						Finance
					</MenuItem>
				</SelectValidator>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextValidator
					fullWidth
					variant='outlined'
					label='Odometer'
					name='odometer'
					value={ purchase.odometer }
					onChange={ handleChange }
					validators={['required']}
					errorMessages={['Odometer is required']}
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextValidator
					fullWidth
					variant='outlined'
					label='MSRP price'
					name='msrpPrice'
					value={ purchase.msrpPrice }
					onChange={ handleChange }
					validators={['required']}
					errorMessages={['MSRP price is required']}
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextValidator
					fullWidth
					variant='outlined'
					label='Sticker price'
					name='stickerPrice'
					value={ purchase.stickerPrice }
					onChange={ handleChange }
					validators={['required']}
					errorMessages={['Sticker price is required']}
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextValidator
					fullWidth
					variant='outlined'
					label='Purchase price'
					name='purchasePrice'
					value={ purchase.purchasePrice }
					onChange={ handleChange }
					validators={['required']}
					errorMessages={['Purchase price is required']}
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextValidator
					fullWidth
					variant='outlined'
					label='Deposit'
					name='deposit'
					value={ purchase.deposit }
					onChange={ handleChange }
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextValidator
					fullWidth
					variant='outlined'
					label='Down payment'
					name='downPayment'
					value={ purchase.downPayment }
					onChange={ handleChange }
				/>
			</Grid>
			<Grid item xs={12}>
				<ThemeProvider theme={theme}>
					<DropzoneArea
						role='form'
						initialFiles={ purchase.filePath ? [purchase.filePath] : [] }
						filesLimit={1}
						showPreviews={false}
						showPreviewsInDropzone={true}
						clearOnUnmount={true}
						dropzoneText="Add your purchase agreement here"
						onChange={ onHandleFileChange }
					/>
				</ThemeProvider>
			</Grid>
		</Grid>
	)
}
