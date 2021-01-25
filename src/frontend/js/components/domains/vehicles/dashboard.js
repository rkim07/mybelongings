import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withContext } from '../../../contexts/appcontext';
import { sectionToggler } from '../../helpers/section';
import { Routes, Route } from 'react-router-dom';
import Dialogger from '../../shared/dialogger';
import Notifier from '../../shared/notifier';
import List from './list';
import Page from './page';
import { currentYear } from '../../helpers/date';
import Container from '@material-ui/core/Container';

const styles = theme => ({
	root: {
		flexGrow: 1
	},
	cardGrid: {
		paddingTop: theme.spacing(8),
		paddingBottom: theme.spacing(8),
	}
});

class Dashboard extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			section: 'list',
			vehicle: {},
			vehicles: [],
			file: [],
			openNotifier: false,
			notifierType: '',
			notifierMsg: '',
			openDialog: false,
			dialogType: '',
			loading: true
		}

		this.onHandleChange = this.onHandleChange.bind(this);
		this.onHandleClick = this.onHandleClick.bind(this);
		this.onHandleDelete = this.onHandleDelete.bind(this);
		this.onHandleSubmit = this.onHandleSubmit.bind(this);
		this.onHandleGoBack = this.onHandleGoBack.bind(this);
		this.onHandleOpenDialog = this.onHandleOpenDialog.bind(this);
		this.onHandleCloseDialog = this.onHandleCloseDialog.bind(this);
		this.onHandleCloseNotifier = this.onHandleCloseNotifier.bind(this);
	}

	componentDidMount() {
		this.props.getUserVehicles().then(response => {
			this.setState({
				vehicles: response.vehicles,
				loading: false
			});
		});
	}

	onHandleChange = (e) => {
		const { name, value } = e.target;
		let vehicle = this.state.vehicle;

		if (name === "mfrKey") {
			vehicle['modelKey'] = '';
		}

		vehicle[name] = value;

		this.setState({
			vehicle: vehicle
		});
	}

	onHandleClick = (data, section) => {
		const vehicle = section !== 'add' ? data :
			{
				mfrKey: '',
				modelKey: '',
				image: '',
				condition: 'new',
				year: currentYear(),
				color: '',
				vin: '',
				plate: ''
			}

		this.setState({
			section: section,
			vehicle: vehicle,
			openNotifier: false,
			notifierType: '',
			notifierMsg: ''
		});
	}

	onHandleDelete = async(e, key) => {
		e.preventDefault();
		const { section, vehicles } = this.state;

		const response = await this.props.deleteVehicle(key, vehicles);

		if (response.status) {
			this.setState({
				section: sectionToggler(response.statusType, section),
				openNotifier: true,
				openDialog: false,
				notifierType: response.statusType,
				notifierMsg: response.message,
				vehicles: response.vehicles
			});
		}
	}

	onHandleSubmit = async(e) => {
		e.preventDefault();

		const {section, file, vehicle, vehicles} = this.state;

		// Upload file first if any
		if (file.length) {
			const upload = await this.props.uploadFile(file[0]);
			if (upload.status) {
				vehicle.image = upload.fileName;
			}
		}

		// Update if there's existing key otherwise add
		const response = vehicle.key ?
			await this.props.updateVehicle(vehicle.key, vehicle, vehicles)
			:
			await this.props.addVehicle(vehicle, vehicles);

		if (response.status) {
			this.setState({
				section: sectionToggler(response.statusType, section),
				openNotifier: true,
				notifierType: response.statusType,
				notifierMsg: response.message,
				vehicles: response.vehicles
			});
		}
	}

	onHandleImageChange = (file) => {
		if (_.size(file) > 0) {
			this.setState({
				file: file
			});
		}
	}

	onHandleGoBack = () => {
		this.setState({
			section: 'list'
		});
	}

	onHandleOpenDialog = (type, vehicle) => {
		this.setState({
			dialogType: type,
			vehicle: vehicle,
			openDialog: true
		});
	}

	onHandleCloseDialog = () => {
		this.setState({
			openDialog: false
		});
	}

	onHandleCloseNotifier = () => {
		this.setState({
			section: this.state.section,
			openNotifier: !this.state.openNotifier,
			notifierType: '',
			notifierMsg: ''
		})
	}

	/**
	 * Render
	 *
	 * @returns {*}
	 */
	render() {
		const { classes } = this.props;
		const {
			loading,
			section,
			vehicle,
			vehicles,
			dialogType,
			openDialog,
			openNotifier,
			notifierMsg,
			notifierType
		} = this.state

		return (
			<Container className={classes.cardGrid} maxWidth="md">
				{ openNotifier && (
					<Notifier
						open={ openNotifier }
						notifierType={ notifierType }
						notifierMsg={ notifierMsg }
						onHandleCloseNotifier={ this.onHandleCloseNotifier }
					/>
				)}
				{ openDialog && (
					<Dialogger
						open={ openDialog }
						dialogType={ dialogType }
						vehicle={ vehicle }
						onHandleDelete={ this.onHandleDelete }
						onHandleCloseDialog={ this.onHandleCloseDialog }
					/>
				)}
				<Routes>
					<Route path="/" element={
						<List
							loading={ loading }
							vehicles={ vehicles }
							onHandleClick={this.onHandleClick}
							onHandleOpenDialog={ this.onHandleOpenDialog }
						/>}
					/>
					<Route path=":id" element={
						<Page
							section={ section }
							vehicle={ vehicle }
							onHandleChange={ this.onHandleChange }
							onHandleImageChange={ this.onHandleImageChange }
							onHandleOpenDialog={ this.onHandleOpenDialog }
							onHandleGoBack={ this.onHandleGoBack }
							onHandleSubmit={ this.onHandleSubmit }
						/>}
					/>
				</Routes>
			</Container>
		)
	}
}

export default withContext(withStyles(styles)(Dashboard));
