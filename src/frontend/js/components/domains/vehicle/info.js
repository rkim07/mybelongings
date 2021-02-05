import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TwoColumnsTable from '../../shared/view/twocolumnstable';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';

/**
 * Child component of details
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function Info(props) {
	const { key } = useParams();
	const { ...other } = props;

	// Needs to be implemented
	const tableCells = {
		condition: 'Condition',
		year: 'Year',
		mfrName: 'Manufacturer',
		model: 'Model',
		color: 'Color',
		style: 'Style',
		mileage: 'Mileage',
		vin: 'VIN',
		plate: 'Plate'
	};

	return (
		<React.Fragment>
			<TwoColumnsTable tableCells={ tableCells } { ...other } />
		</React.Fragment>
	)
}
