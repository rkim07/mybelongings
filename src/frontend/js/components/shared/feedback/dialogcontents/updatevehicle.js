import React from 'react';
import Modify from '../../../domains/admin/vehicles/modify';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

export default function UpdateVehicle(props) {
	const {
		vehicleKey,
		activeStep,
		onHandleClose, // parent call in dialogger
	} = props.params;

	return (
		<React.Fragment>
			<DialogContent>
				<Modify
					{ ...props }
				/>
			</DialogContent>
		</React.Fragment>
	)
}
