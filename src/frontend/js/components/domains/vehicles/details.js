import React, { useContext, useEffect, useState } from 'react';
import { Link, Routes, Route, useParams, useNavigate} from 'react-router-dom';
import { withStyles }  from '@material-ui/core/styles';
import Info	from './info';
import Insurance from './insurance';
import AppContext from '../../../appcontext';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ArrowBack from '@material-ui/icons/ArrowBack';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
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

function tabAttrs(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const styles = (theme) => ({
	button: {
		margin: theme.spacing(1),
	}
});

/**
 * Main component for both info and insurance
 *
 * Contains:
 * Nested routes
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function Details(props) {
	const apis = useContext(AppContext);
	const navigate = useNavigate();
	const { key } = useParams();
	const { classes } = props;

	const [value, setValue] = useState(0);

	/**
	 * Hand tab changes
	 *
	 * @param event
	 * @param newValue
	 */
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<Grid container spacing={4}>
			<Grid item xs={12}>
				<Button
					type='button'
					variant='contained'
					color='default'
					className={classes.button}
					startIcon={<ArrowBack />}
					onClick={ () => navigate('/vehicles') }
				>
					Back
				</Button>
			</Grid>
			<Grid item xs={12}>
				<AppBar position="static">
					<Tabs
						value={ value }
						onChange={handleChange}
					>
						<Tab label="Info" icon={<DirectionsCarIcon />} component={Link} to="info" />
						<Tab label="Upgrades" icon={<BeachAccessIcon />} component={Link} to="upgrades" />
						<Tab label="Insurance" icon={<BeachAccessIcon />} component={Link} to="insurance" />
					</Tabs>
				</AppBar>
				<Routes>
					<TabPanel value={value} index={0} >
						<Route path="info" element={ <Info key={ key } /> } />
					</TabPanel>
					<TabPanel value={value} index={1} >

					</TabPanel>
					<TabPanel value={value} index={2} >
						<Route path="insurance" element={ <Insurance key={ key } /> } />
					</TabPanel>
				</Routes>
			</Grid>
		</Grid>
	);
}

export default withStyles(styles)(Details);
