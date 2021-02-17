import React, { forwardRef, useImperativeHandle, useState } from 'react';
import UpdateVehicle from './dialogcontents/updatevehicle';
import DeleteVehicle from './dialogcontents/deletevehicle';
import Dialog from '@material-ui/core/Dialog';

const Dialogger = forwardRef((props, ref) => {
	const initialValues = {
		open: false,
		type: '',
		params: {}
	};

	const [values, setValues] = useState(initialValues);

	useImperativeHandle(ref, () => ({
		openDialogger(type, params) {
			setValues({
				...values,
				open: !values.open,
				type: type,
				params: params
			});
		},
		closeDialogger() {
			handleClose();
		}
	}));

	// Handle close
	const handleClose = () => {
		setValues({...values, open: false});
	};

	return (
		<Dialog
			open={values.open}
			onClose={handleClose}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			{
				{
					'update':
						<UpdateVehicle
							params={values.params}
							onHandleClose={handleClose}
						/>,
					'delete':
						<DeleteVehicle
							params={values.params}
							onHandleClose={handleClose}
						/>
				}[values.type]
			}
		</Dialog>
	)
})

export default Dialogger;
