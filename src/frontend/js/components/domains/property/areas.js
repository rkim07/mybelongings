import React from 'react';
import { withStyles }  from '@material-ui/core/styles';
import { withContext } from '../../../appcontext';
import PaintDetailsDialog from "./paintdetailsdialog";
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-auto-tabpanel-${index}`}
			aria-labelledby={`scrollable-auto-tab-${index}`}
			{...other}
		>
			{ value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function tabAttrs(index) {
	return {
		id: `scrollable-auto-tab-${index}`,
		'aria-controls': `scrollable-auto-tabpanel-${index}`,
	};
}

const styles = (theme) => ({});

class Areas extends React.Component
{
	/**
	 * Constructor
	 *
	 * @param props
	 */
	constructor(props) {
		super(props);

		this.state = {
			value: 0,
			open: false
		}

		this.onHandleChange = this.onHandleChange.bind(this);
		this.onHandleClickOpen = this.onHandleClickOpen.bind(this);
		this.onHandleClose = this.onHandleClose.bind(this);
	}

	/**
	 * When tabs are changed
	 *
	 * @param event
	 * @param newValue
	 */
	onHandleChange = (event, newValue) => {
		this.setState({
			value: newValue
		})
	};

	onHandleClickOpen = () => {
		this.setState({
			open: true
		});
	};

	onHandleClose = () => {
		this.setState({
			open: false
		});
	};

	render() {
		const { classes, areas } = this.props;
		const tabLabels = [];
		const tabPanels = [];

		areas.map((area, index) => {
			tabLabels.push(<Tab key={ index } label={ area.name} {...tabAttrs(index) } />);
			tabPanels.push(<TabPanel key={ index } value={ this.state.value } index={ index }>
				<TableContainer>
					<Table className={ classes.table } aria-label="custom table">
						<TableBody>
							<TableRow key="square_footage">
								<TableCell component="th" scope="row">
									Size
								</TableCell>
								<TableCell style={{ width: 80 }} align="right">
									{ area.sqFt } sq ft
								</TableCell>
							</TableRow>
							<TableRow key="location">
								<TableCell component="th" scope="row">
									Location
								</TableCell>
								<TableCell style={{ width: 80 }} align="right">
									{ area.location } floor
								</TableCell>
							</TableRow>
							<TableRow key="painted">
								<TableCell component="th" scope="row">
									Painted
								</TableCell>
								<TableCell style={{ width: 80 }} align="right">
									{ area.painted }
								</TableCell>
							</TableRow>
							<TableRow key="paint">
								<TableCell component="th" scope="row">
									Paint
								</TableCell>
								<TableCell style={{ width: 80 }} align="right">
									<Link
										as="button"
										variant="body2"
										onClick={ this.onHandleClickOpen }>
										Details
									</Link>
									<PaintDetailsDialog areaName={ area.name } paint={ area.paint } open={ this.state.open } onHandleClose={ this.onHandleClose }/>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			</TabPanel>);
		});

		return (
			<React.Fragment>
				<Grid item xs={12}>
					<Typography variant="h6" gutterBottom>Areas</Typography>
				</Grid>
				<Grid item xs={12}>
					<AppBar position="static" color="default">
						<Tabs
							value={ this.state.value }
							onChange={ this.onHandleChange }
							indicatorColor="primary"
							textColor="primary"
							variant="scrollable"
							scrollButtons="auto"
							aria-label="scrollable auto tabs example">
							{ tabLabels }
						</Tabs>
					</AppBar>
					{ tabPanels }
				</Grid>
			</React.Fragment>
		)
	}
}

export default withContext(withStyles(styles)(Areas));
