import React from 'react';
import DeleteVehicle from "./dialogcontents/deletevehicle";
import Dialog from '@material-ui/core/Dialog';

export default function Dialogger(props) {
	const {
		open,
		type,
		params,
		onHandleDelete, // parent call
		onHandleDialog, // parent call
	} = props;

	return (
		<Dialog
			open={ open }
			onClose={ onHandleDialog }
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			{
				{
					'delete':
						<DeleteVehicle
							vehicleKey={ params }
							onHandleDelete={ onHandleDelete }
							onHandleDialog={ onHandleDialog }
						/>

				}[type]
			}
		</Dialog>
	);
}
