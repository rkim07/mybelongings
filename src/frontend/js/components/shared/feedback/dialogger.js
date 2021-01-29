import React, { forwardRef, useImperativeHandle, useState } from 'react';
import DeleteVehicle from "./dialogcontents/deletevehicle";
import Dialog from '@material-ui/core/Dialog';

const Dialogger = forwardRef((props, ref) => {
	const [open, setOpen] = useState(false);
	const [type, setType] = useState('');
	const [params, setParams] = useState({});

	useImperativeHandle(ref, () => ({
		openDialogger(type, params) {
			setType(type);
			setParams(params);
			setOpen(!open);
		},
		closeDialogger() {
			handleClose();
		}
	}));

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Dialog
			open={ open }
			onClose={ handleClose }
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			{
				{
					'delete':
						<DeleteVehicle
							vehicleKey={ params.vehicleKey }
							onHandleClose={ handleClose }
							{ ...props }
						/>

				}[type]
			}
		</Dialog>
	)
});

export default Dialogger;
