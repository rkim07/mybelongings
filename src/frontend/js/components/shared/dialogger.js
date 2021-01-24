import React from 'react';
import DeleteVehicle from "./dialogcontents/deletevehicle";
import Dialog from '@material-ui/core/Dialog';

export default function Dialogger(props) {
	const {
		open,
		vehicle,
		dialogType,
		onHandleCloseDialog,
		onHandleDelete
	} = props;

	return (
		<Dialog
			open={ open }
			onClose={ onHandleCloseDialog }
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			{
				{
					'delete':
						<DeleteVehicle
							vehicleKey={ vehicle.key }
							onHandleDelete={ onHandleDelete }
							onHandleCloseDialog={ onHandleCloseDialog }
						/>

				}[dialogType]
			}
		</Dialog>
	);
}
