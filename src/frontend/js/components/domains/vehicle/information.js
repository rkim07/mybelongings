import React, { useContext, useEffect, useState } from 'react';
import { Link, Routes, Route, useParams, useNavigate} from 'react-router-dom';
import Details	from './details';
import Purchase from './purchase';
import Finance from './finance';
import Insurance from './insurance';
import AppContext from '../../../appcontext';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import BuildIcon from '@material-ui/icons/Build';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import StoreIcon from '@material-ui/icons/Store';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { makeStyles } from '@material-ui/core/styles';
import * as _ from "lodash";

const useStyles = makeStyles((theme) => ({
	root: {
		marginTop: theme.spacing(4),
		flexGrow: 1,
		alignItems: 'center'
	},
	appBar: {
		backgroundColor: '#404040',
		width: '100%',
		alignItems: 'center'
	},
	button: {
		background: '#404040',
		color: 'white',
		height: 36,
		margin: theme.spacing(3, 0, 2)
	}
}));

function TabPanel(props) {
	const {
		children,
		value,
		index,
		...other
	} = props;

	return (
		<div
			role='tabpanel'
			align="center" // align contents inside tab panel
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography component={'div'}>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

/**
 * Parent component for both info and insurance
 *
 * Contains:
 * Nested routes
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Information() {
	const apis = useContext(AppContext);
	const navigate = useNavigate();
	const { key } = useParams();
	const classes = useStyles();

	const initialValues = {
		vehicle: {
			mfrKey: '',
			mfrName: '',
			modelKey: '',
			model: '',
			image: '',
			imagePath: '',
			condition: '',
			sytle: '',
			mileage: '',
			year: '',
			color: '',
			vin: '',
			plate: ''
		},
		loading: true,
		tabValue: 0
	};

	const [values, setValues] = useState(initialValues);

	useEffect(() => {
		apis.getVehicle(key).then(response => {
			const {payload, statusCode, statusType, message} = response
			if (statusCode < 400) {
				setValues(prevState => ({
					...prevState,
					vehicle: _.assign(prevState.vehicle, payload),
					loading: false
				}));
			} else {
				onHandleNotifier(statusType, message);
				navigate('/vehicles');
			}
		});
	}, []);

	// Hand tab changes
	const handleChange = (e, value) => {
		setValues({
			...values,
			tabValue: value
		})
	};

	return (
		<Container component='main' maxWidth='md'>
			<div className={classes.root}>
				<Grid container justify='flex-start'>
					<Grid item>
						<Typography gutterBottom variant='h5'>
							Details
						</Typography>
					</Grid>
				</Grid>
				<AppBar position='static' className={classes.appBar}>
					<Tabs
						value={ values.tabValue }
						onChange={ handleChange }
					>
						<Tab label='Details' icon={<DirectionsCarIcon />} component={Link} to='details' />
						<Tab label='Purchase' icon={<StoreIcon />} component={Link} to='purchase' />
						<Tab label='Finance' icon={<AttachMoneyIcon />} component={Link} to='finance' disabled />
						<Tab label='Insurance' icon={<BeachAccessIcon />} component={Link} to='insurance' disabled />
					</Tabs>
				</AppBar>
				<Routes>
					<TabPanel value={ values.tabValue } index={0} >
						<Route path='details' element={
							<Details
								model={ values.vehicle }
								loading={ values.loading }
							/>
						} />
					</TabPanel>
					<TabPanel value={ values.tabValue } index={1} >
						<Route path='purchase' element={
							<Purchase
								model={ values.vehicle.purchase }
								loading={ values.loading }
							/>
						} />
					</TabPanel>
					<TabPanel value={ values.tabValue } index={2} >
						<Route path='finance' element={
							<Finance
								model={ values.vehicle.finance }
								loading={ values.loading }
							/>
						} />
					</TabPanel>
					<TabPanel value={ values.tabValue } index={3} >
						<Route path='insurance' element={
							<Insurance
								model={ values.vehicle.insurance }
								loading={ values.loading }
							/>
						} />
					</TabPanel>
				</Routes>
				<Grid container justify='flex-end'>
					<Grid item>
						<Button
							type='button'
							variant='contained'
							className={classes.button}
							startIcon={<ArrowBack />}
							onClick={ () => navigate('/vehicles') }
						>
							Back
						</Button>
					</Grid>
				</Grid>
			</div>
		</Container>
	);
}
