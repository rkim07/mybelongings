import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Modify from './modify';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

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
		setValues({
			...values,
			open: false
		});
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
					'add':
						<React.Fragment>
							<DialogContent>
								<Modify
									onHandleClose={ handleClose }
									{ ...values.params }
								/>
							</DialogContent>
						</React.Fragment>,
					'update':
						<React.Fragment>
							<DialogContent>
								<Modify
									onHandleClose={ handleClose }
									{ ...values.params }
								/>
							</DialogContent>
						</React.Fragment>,
					'delete':
						<React.Fragment>
							<DialogTitle id='alert-dialog-title'>{ `Delete vehicle?` }</DialogTitle>
							<DialogContent>
								<DialogContentText id='alert-dialog-description'>
									This action will permanently remove the vehicle from the database.  Do you want to continue?
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button
									onClick={ () => {
										handleClose();
										values.params.onHandleDelete(values.params.vehicleKey);
									}}
									color='primary'
								>
									Yes
								</Button>
								<Button
									onClick={ () => handleClose() }
									color='primary'
									autoFocus
								>
									No
								</Button>
							</DialogActions>
						</React.Fragment>
				}[values.type]
			}
		</Dialog>
	)
})

export default Dialogger;
