import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const Notifier = forwardRef((props, ref) => {
	const vertical = 'top';
	const horizontal = 'center';

	const [snackPack, setSnackPack] = useState([]);
	const [open, setOpen] = useState(false);
	const [messageInfo, setMessageInfo] = useState(undefined);
	const [type, setType] = useState("success");

	useEffect(() => {
		if (snackPack.length && !messageInfo) {
			// Set a new snack when we don't have an active one
			setMessageInfo({ ...snackPack[0] });
			setSnackPack((prev) => prev.slice(1));
			setOpen(true);
		} else if (snackPack.length && messageInfo && open) {
			// Close an active snack when a new one is added
			setOpen(false);
		}
	}, [snackPack, messageInfo, open]);

	useImperativeHandle(ref, () => ({
		isNotifierOpened() {
			return open;
		},

		openNotifier(type, message) {
			setType(type);
			setSnackPack((prev) => [...prev, {message, key: new Date().getTime()}]);
		}
	}));

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
	};

	const handleExited = () => {
		setMessageInfo(undefined);
	};

	return (
		<Snackbar
			key={messageInfo ? messageInfo.key : undefined}
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
				{ messageInfo ? messageInfo.message : undefined }
			</MuiAlert>
		</Snackbar>
	)
});

export default Notifier;
