import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog(props) {
	const { open, onHandleToggleAlert, onHandleDelete } = props;

	return (
		<div>
			<Dialog
				open={ open }
				onClose={ onHandleToggleAlert }
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{ "Delete vehicle?" }</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						This action will permanently remove the record from the database.  Do you want to continue?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={ onHandleDelete } color="primary">
						Yes
					</Button>
					<Button onClick={ onHandleToggleAlert } color="primary" autoFocus>
						No
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
