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
export default function Finance() {
	const { key } = useParams();
	const { ...other } = props;

	const tableCells = {
		accountNumber: 'Account number',
		originalLoan: 'Original loan',
		currentPrincipal: 'Current principal',
		paymentAmount: 'Payment amount',
		interestRate: 'Interest rate',
		term: 'Term',
		originated: 'Origination date'
	};

	return (
		<React.Fragment>
			<TwoColumnsTable tableCells={ tableCells } { ...other } />
		</React.Fragment>
	)
}
