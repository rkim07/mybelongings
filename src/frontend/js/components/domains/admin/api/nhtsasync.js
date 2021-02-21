import React, { useContext, useRef, useState } from 'react';
import * as _ from 'lodash';
import AppContext from '../../../../appcontext';
import Notifier from '../../../shared/feedback/notifier';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SyncIcon from '@material-ui/icons/Sync';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4)
	},
	paper: {
		marginTop: theme.spacing(4),
		flexGrow: 1,
		alignItems: 'center'
	},
	card: {
		maxWidth: 345,
	}
}));

export default function NhtsaSync(props) {
	const notifierRef = useRef();
	const apis = useContext(AppContext);
	const classes = useStyles();

	const initialValues = {
		loading: false
	};

	const [values, setValues] = useState(initialValues);

	// Handle select and input changes
	const handleClick = async(e) => {
		e.preventDefault();

		setValues(prevState => ({
			...prevState,
			loading: true
		}));

		apis.syncNhtsa().then(response => {
			const { payload, statusCode, statusType, message } = response
			if (statusCode < 400) {
				setValues(prevState => ({
					...prevState,
					loading: false
				}));
			}
		});
	}

	return (
		<Container maxWidth='lg' className={classes.container}>
			<div className={classes.paper}>
				<Notifier ref={ notifierRef } />
				<Card className={classes.card}>
					<CardHeader>
						<Typography variant='body1'>
							NHTSA Sync
						</Typography>
					</CardHeader>
					<CardContent>
						<Button
							fullWidth
							size='small'
							variant='contained'
							className={classes.button}
							startIcon={<SyncIcon />}
							onClick={ handleClick }
						>
							Sync NHTSA
						</Button>
						{ values.loading && <CircularProgress /> }
					</CardContent>
				</Card>
			</div>
		</Container>
	);
}
