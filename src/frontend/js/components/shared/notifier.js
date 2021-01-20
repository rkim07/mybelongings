import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
	return <MuiAlert
		elevation={6}
		variant="filled"
		{...props}
	/>;
}

export default function Notifier(props) {
	const { open, notifierType, notifierMsg, onHandleCloseNotifier } = props;
	const vertical = 'top';
	const horizontal = 'center';

	return (
		<div className="">
			<Snackbar
				open={ open }
				onClose={ onHandleCloseNotifier }
				key={ 'top' + 'center' }
				anchorOrigin={{ vertical, horizontal }}
			>
				<Alert onClose={ onHandleCloseNotifier } severity={ notifierType }>
					{ notifierMsg }
				</Alert>
			</Snackbar>
		</div>
	);
}
