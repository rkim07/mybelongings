import React, { useContext, useEffect, useState } from 'react';
import * as _ from 'lodash';
import { useParams } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppContext from '../../../appcontext';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Skeleton from '@material-ui/lab/Skeleton';

const styles = (theme) => ({});

function Info(props) {
	const apis = useContext(AppContext);
	const { key } = useParams();

	const { classes } = props;

	const initialValues = {
		vehicle: {
			mfrKey: '',
			mfrName: '',
			modelKey: '',
			model: '',
			image: '',
			imagePath: '',
			condition: '',
			year: '',
			color: '',
			vin: '',
			plate: ''
		},
		resetCode: resetCode,
		password: '',
		repeatPassword: '',
		loading: false
	};

	const [values, setValues] = useState(initialValues);

	/**
	 * Fetch vehicle by key
	 */
	useEffect(() => {
		apis.getVehicle(key).then(response => {
			const { payload, statusCode, statusType, message } = response
			if (statusCode < 400) {
				setValues({ ...values, vehicle: response.payload, loading: true });
			} else {
				onHandleNotifier(statusType, message);
				navigate('/');
			}

		});
	}, [values.vehicle.key]);

	return (
		<React.Fragment>
			<Grid item xs={12}>
				{ values.loading ? (
					<React.Fragment>
						<Skeleton />
						<Skeleton />
						<Skeleton />
						<Skeleton />
						<Skeleton />
						<Skeleton />
						<Skeleton />
					</React.Fragment>
				) : (
					<TableContainer>
						<Table className={ classes.table } aria-label='custom table'>
							<TableBody>
								<TableRow key='condition'>
									<TableCell component='th' scope='row'>
										Condition
									</TableCell>
									<TableCell style={{ width: 80 }} align='right'>
										{ _.capitalize(values.vehicle.condition) }
									</TableCell>
								</TableRow>
								<TableRow key='year'>
									<TableCell component='th' scope='row'>
										Year
									</TableCell>
									<TableCell style={{ width: 80 }} align='right'>
										{ values.vehicle.year }
									</TableCell>
								</TableRow>
								<TableRow key='mfrName'>
									<TableCell component='th' scope='row'>
										Manufacturer
									</TableCell>
									<TableCell style={{ width: 80 }} align='right'>
										{ _.capitalize(values.vehicle.mfrName) }
									</TableCell>
								</TableRow>
								<TableRow key='model'>
									<TableCell component='th' scope='row'>
										Model
									</TableCell>
									<TableCell style={{ width: 80 }} align='right'>
										{ _.capitalize(values.vehicle.model) }
									</TableCell>
								</TableRow>
								<TableRow key='color'>
									<TableCell component='th' scope='row'>
										Color
									</TableCell>
									<TableCell style={{ width: 80 }} align='right'>
										{ _.capitalize(values.vehicle.color) }
									</TableCell>
								</TableRow>
								<TableRow key='vin'>
									<TableCell component='th' scope='row'>
										VIN
									</TableCell>
									<TableCell style={{ width: 80 }} align='right'>
										{ values.vehicle.vin }
									</TableCell>
								</TableRow>
								<TableRow key='plate'>
									<TableCell component='th' scope='row'>
										Plate
									</TableCell>
									<TableCell style={{ width: 80 }} align='right'>
										{ values.vehicle.plate }
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
				)}
			</Grid>
		</React.Fragment>
	)
}

export default withStyles(styles)(Info);
