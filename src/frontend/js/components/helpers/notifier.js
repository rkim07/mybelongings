import React, { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
	return <MuiAlert
				elevation={6}
				variant="filled"
				{...props}
			/>;
}

function Notifier(props) {
	const { openNotifier, notifierType, notifierMsg, onHandleCloseNotifier } = props;
	const vertical = 'top';
	const horizontal = 'center';

	return (
		<div className="">
			<Snackbar
				anchorOrigin={{ vertical, horizontal }}
				open={ openNotifier }
				key={ 'top' + 'center' }
			>
				<Alert onClose={ onHandleCloseNotifier } severity={ notifierType }>
					{ notifierMsg }
				</Alert>
			</Snackbar>
		</div>
	);
}

export default Notifier;
