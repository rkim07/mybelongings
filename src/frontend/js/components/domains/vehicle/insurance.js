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
export default function Insurance() {
	const { key } = useParams();
	const { ...other } = props;

	// Needs to be implemented
	const tableCells = {

	};

	return (
		<React.Fragment>
			<TwoColumnsTable tableCells={ tableCells } { ...other } />
		</React.Fragment>
	)
}
