import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TwoColumnsTable from '../../shared/view/twocolumnstable';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';

/**
 * Child component of information
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function Details(props) {
	const { key } = useParams();
	const { ...other } = props;

	const tableCells = {
		condition: 'Condition',
		year: 'Year',
		mfrName: 'Manufacturer',
		model: 'Model',
		color: 'Color',
		style: 'Style',
		mileage: 'Mileage',
		plate: 'Plate',
		vin: 'VIN'
	};

	return (
		<React.Fragment>
			<TwoColumnsTable tableCells={ tableCells } { ...other } />
		</React.Fragment>
	)
}
