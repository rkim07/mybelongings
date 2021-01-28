import React, { useEffect, useState } from 'react';
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

	const { classes,
		open,
		type,
		message,
		onHandleNotifier
	} = props;

	const vertical = 'top';
	const horizontal = 'center';

	const [snackPack, setSnackPack] = useState([]);
	const [openSnack, setOpenSnack] = useState(open);
	const [messageInfo, setMessageInfo] = useState(message);

	useEffect(() => {
		if (snackPack.length && !messageInfo) {
			// Set a new snack when we don't have an active one
			setMessageInfo({ ...snackPack[0] });
			setSnackPack((prev) => prev.slice(1));
			setOpenSnack(true);
		} else if (snackPack.length && messageInfo && open) {
			// Close an active snack when a new one is added
			setOpenSnack(false);
		}
	}, [snackPack, messageInfo, openSnack]);

	const handleClick = (message) => () => {
		setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenSnack(false);
	};

	const handleExited = () => {
		setMessageInfo(undefined);
	};

	return (
		<Snackbar
			key={messageInfo ? messageInfo.key : undefined}
			open={ open }
			autoHideDuration={ 5000 }
			onClose={ onHandleNotifier }
			onExited={ handleExited }
			anchorOrigin={{
				vertical,
				horizontal
			}}
		>
				<Alert
					severity={ type }
					onClose={ onHandleNotifier }
				>
					{ message }
				</Alert>
		</Snackbar>
	);
}
