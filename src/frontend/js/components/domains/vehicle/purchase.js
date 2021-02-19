import React from 'react';
import { useParams } from 'react-router-dom';
import VehiclePurchaseTable from '../../shared/view/vehiclepurchasetable';
import Box from '@material-ui/core/Box';
import AppContext from "../../../appcontext";

/**
 * Child component of information
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function Purchase(props) {
	const { key } = useParams();
	const { ...other } = props;

	// Needs to be implemented
	const tableCells = {
		odometer: 'Odometer',
		deposit: 'Deposit',
		downPayment: 'Down payment',
		msrpPrice: 'MSRP price',
		stickerPrice: 'Sticker price',
		purchasePrice: 'Purchase price',
		purchaseType: 'Purchase type',
		purchased: 'Purchase date',
		agreement: 'Purchase agreement'
	};
	return (
		<React.Fragment>
			<VehiclePurchaseTable
				tableCells={ tableCells }
				{ ...other }
			/>
		</React.Fragment>
	)
}
