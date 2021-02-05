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
export default function Dealer() {
	const { key } = useParams();
	const {
		dealer,
		loading,
		type
	} = props;

	return (
		<React.Fragment>
			{ loading ? (
				<Box>
					<Skeleton />
					<Skeleton />
					<Skeleton />
					<Skeleton />
					<Skeleton />
					<Skeleton />
					<Skeleton />
				</Box>
			) : (
				<TwoColumnsTable type="dealer" model={ dealer } />
			) }
		</React.Fragment>
	)
}
