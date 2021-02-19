import React, {useContext, useState} from 'react';
import { useParams } from 'react-router-dom';
import VehiclePurchaseTable from '../../shared/view/vehiclepurchasetable';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';
import AppContext from "../../../appcontext";

/**
 * Child component of information
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function Purchase(props) {
	const { key } = useParams();
	const apis = useContext(AppContext);
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

	// Handle download
	const handleDownload = (fileName) => {
		apis.downloadFile(fileName).then(response => {});
	};

	return (
		<React.Fragment>
			<VehiclePurchaseTable
				tableCells={ tableCells }
				onHandleDownload={ handleDownload }
				{ ...other }
			/>
		</React.Fragment>
	)
}
