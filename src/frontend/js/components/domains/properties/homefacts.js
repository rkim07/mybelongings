import React from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { withStyles }  from '@material-ui/core/styles';
import { withContext } from '../../../contexts/appcontext';

const styles = {};

function HomeFacts(props) {
	const { classes, property } = props;

	return (
		<React.Fragment>
			<Grid item xs={12}>
				<Typography variant="h6" gutterBottom>Home Facts</Typography>
			</Grid>
			<Grid item xs={6}>
				<TableContainer>
					<Table className={ classes.table } aria-label="custom table">
						<TableBody>
							<TableRow key="year">
								<TableCell component="th" scope="row">
									Year Built
								</TableCell>
								<TableCell style={{ width: 80 }} align="right">
									{ property.year }
								</TableCell>
							</TableRow>
							<TableRow key="type">
								<TableCell component="th" scope="row">
									Type
								</TableCell>
								<TableCell style={{ width: 80 }} align="right">
									{ _.startCase(property.type) }
								</TableCell>
							</TableRow>
							<TableRow key="style">
								<TableCell component="th" scope="row">
									Style
								</TableCell>
								<TableCell style={{ width: 80 }} align="right">
									{ _.startCase(property.style) }
								</TableCell>
							</TableRow>
							<TableRow key="sq_ft">
								<TableCell component="th" scope="row">
									Sq Ft
								</TableCell>
								<TableCell style={{ width: 80 }} align="right">
									{ property.sqFt }
								</TableCell>
							</TableRow>
							<TableRow key="lot_size">
								<TableCell component="th" scope="row">
									Lot Size
								</TableCell>
								<TableCell style={{ width: 80 }} align="right">
									{ property.lotSize }
								</TableCell>
							</TableRow>
							<TableRow key="stories">
								<TableCell component="th" scope="row">
									Stories
								</TableCell>
								<TableCell style={{ width: 80 }} align="right">
									{ property.stories }
								</TableCell>
							</TableRow>
							<TableRow key="subdivision">
								<TableCell component="th" scope="row">
									Subdivision
								</TableCell>
								<TableCell style={{ width: 80 }} align="right">
									{ _.startCase(property.subdivision) }
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
			<Grid item xs={6}>
				<TableContainer>
					<Table className={ classes.table } aria-label="custom table">
						<TableBody>
							<TableRow key="bedrooms">
								<TableCell component="th" scope="row">
									Bedrooms
								</TableCell>
								<TableCell style={{ width: 80 }} align="right">
									{ property.bedrooms }
								</TableCell>
							</TableRow>
							<TableRow key="bathrooms">
								<TableCell component="th" scope="row">
									Bathrooms
								</TableCell>
								<TableCell style={{ width: 80 }} align="right">
									{ property.bathrooms }
								</TableCell>
							</TableRow>
							<TableRow key="basement">
								<TableCell component="th" scope="row">
									Basement
								</TableCell>
								<TableCell style={{ width: 80 }} align="right">
									{ property.basement }
								</TableCell>
							</TableRow>
							<TableRow key="garage">
								<TableCell component="th" scope="row">
									Garage
								</TableCell>
								<TableCell style={{ width: 80 }} align="right">
									{ property.garage }
								</TableCell>
							</TableRow>
							<TableRow key="parking_spaces">
								<TableCell component="th" scope="row">
									Parking Spaces
								</TableCell>
								<TableCell style={{ width: 80 }} align="right">
									{ property.parkingSpaces }
								</TableCell>
							</TableRow>
							<TableRow key="features">
								<TableCell component="th" scope="row">
									Features
								</TableCell>
								<TableCell style={{ width: 80 }} align="right">
									{ property.features }
								</TableCell>
							</TableRow>
							<TableRow key="apn">
								<TableCell component="th" scope="row">
									APN
								</TableCell>
								<TableCell style={{ width: 80 }} align="right">
									{ property.apn }
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
		</React.Fragment>
	)
}

HomeFacts.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withContext(withStyles(styles)(HomeFacts));
