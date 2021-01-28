import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

export default function DeleteVehicle(props) {
	const {
		vehicleKey,
		onHandleDialog, // parent call
		onHandleDelete // parent call
	} = props;

	return (
		<React.Fragment>
			<DialogTitle id="alert-dialog-title">{ "Delete vehicle" }</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					This action will permanently remove the vehicle from the database.  Do you want to continue?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={ () => onHandleDelete(vehicleKey) } color="primary">
					Yes
				</Button>
				<Button onClick={ () => onHandleDialog() } color="primary" autoFocus>
					No
				</Button>
			</DialogActions>
		</React.Fragment>
	)

}
