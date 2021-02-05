import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TwoColumnsTable from "../../shared/view/twocolumnstable";
import Box from '@material-ui/core/Box';
import Skeleton from "@material-ui/lab/Skeleton";

/**
 * Child component of details
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function Dealer(props) {
	const { key } = useParams();
	const { ...other } = props;

	// Needs to be implemented
	const tableCells = {
		odometer: 'Odometer',
		deposit: 'Deposit',
		vehiclePrice: 'Vehicle Price',
		purchasePrice: 'Purchase Price',
		purchaseDate: 'Purchase Date',
		agreement: 'Purchase Agreement'
	};

	return (
		<React.Fragment>
			<TwoColumnsTable tableCells={ tableCells } { ...other } />
		</React.Fragment>
	)
}
