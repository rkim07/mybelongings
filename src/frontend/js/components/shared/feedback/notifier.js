import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const Notifier = forwardRef((props, ref) => {
	const vertical = 'top';
	const horizontal = 'center';

	const [snackPack, setSnackPack] = useState([]);
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState('');
	const [type, setType] = useState("success");

	useEffect(() => {
		if (snackPack.length && !message) {
			// Set a new snack when we don't have an active one
			setMessage({ ...snackPack[0] });
			setSnackPack((prev) => prev.slice(1));
			setOpen(true);
		} else if (snackPack.length && message && open) {
			// Close an active snack when a new one is added
			setOpen(false);
		}
	}, [snackPack, message, open]);

	useImperativeHandle(ref, () => ({
		isNotifierOpened() {
			return open;
		},

		openNotifier(type, message) {
			setType(type);
			setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
		}
	}));

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
	};

	const handleExited = () => {
		setMessage(undefined);
	};

	return (
		<Snackbar
			key={message ? message.key : undefined}
			open={ open }
			autoHideDuration={ 5000 }
			onClose={ handleClose }
			onExited={ handleExited }
			anchorOrigin={{
				vertical,
				horizontal
			}}
		>
			<MuiAlert
				elevation={6}
				variant="filled"
				severity={ type }
				onClose={ handleClose }
			>
				{ message ? message.message : undefined }
			</MuiAlert>
		</Snackbar>
	)
});

export default Notifier;
