import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withContext } from '../../../contexts/appcontext';
import { parseResponse } from '../../helpers/response';
import { sectionToggler } from '../../helpers/section';
import List from './list';
import Page from './page';
import Notifier from '../../shared/notifier';
import AlertDialog from '../../shared/alertdialog';
import { currentYear } from '../../helpers/date';
import { addUpdateCollection, removeFromCollection } from '../../helpers/collection';
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
			file: [],
			openNotifier: false,
			openAlert: false,
			notifierType: '',
			notifierMsg: '',
			vehicles: []
		}

		this.onHandleChange = this.onHandleChange.bind(this);
		this.onHandleClick = this.onHandleClick.bind(this);
		this.onHandleDelete = this.onHandleDelete.bind(this);
		this.onHandleSubmit = this.onHandleSubmit.bind(this);
		this.onHandleGoBack = this.onHandleGoBack.bind(this);
		this.onHandleToggleAlert = this.onHandleToggleAlert.bind(this);
		this.onHandleCloseNotifier = this.onHandleCloseNotifier.bind(this);
	}

	componentDidMount() {
		this.props.getVehiclesByUserKey().then(response => {
			this.setState({
				vehicles: response.data.vehicles
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

	onHandleDelete = async(key) => {
		const { section, vehicles } = this.state;

		const results = await this.props.deleteVehicle(key).then((response) => {
			if (response.data.statusCode < 400) {
				removeFromCollection(vehicles, response.data.vehicle);
			}

			return response;
		});

		const parsed = parseResponse(results);

		this.setState({
			section: sectionToggler(parsed, section),
			openNotifier: true,
			openAlert: false,
			notifierType: parsed.statusType,
			notifierMsg: parsed.message,
			vehicles: vehicles
		});
	}

	onHandleSubmit = async (e) => {
		e.preventDefault();

		const { section, file, vehicle, vehicles } = this.state;

		if (file.length) {
			const uploadedResponse = await this.props.uploadFile(file[0]);
			vehicle.image = uploadedResponse.data.fileName;
		}

		vehicle.year = parseInt(vehicle.year);
		vehicle['userKey'] = this.props.user.userKey;

		// Update if there's existing key otherwise add
		const results = vehicle.key ?
			await this.props.updateVehicle(vehicle.key, vehicle).then((response) => {
				if (response.data.statusCode < 400) {
					addUpdateCollection(vehicles, response.data.vehicle);
				}
				return response;
			})
			:
			await this.props.addVehicle(vehicle).then((response) => {
				if (response.data.statusCode < 400) {
					addUpdateCollection(vehicles, response.data.vehicle);
				}
				return response;
			});

		const parsed = parseResponse(results);

		this.setState({
			section: sectionToggler(parsed, section),
			openNotifier: true,
			notifierType: parsed.statusType,
			notifierMsg: parsed.message,
			vehicles: vehicles
		});
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

	onHandleToggleAlert = () => {
		this.setState({
			openAlert: !this.state.openAlert
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
			section,
			vehicle,
			vehicles,
			openAlert,
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
					/>)
				}
				{ openAlert && (
					<AlertDialog
						open={ openAlert }
						onHandleToggleAlert={ this.onHandleToggleAlert  }
						onHandleDelete={ this.onHandleDelete }
					/>)
				}
				{
					section === 'list' && (
						<List
							vehicles={ vehicles }
							onHandleClick={this.onHandleClick}
							onHandleDelete={ this.onHandleToggleAlert }
						/>
					)
				}
				{
					section !== 'list' && (
						<Page
							section={ section }
							vehicle={ vehicle }
							onHandleChange={ this.onHandleChange }
							onHandleImageChange={ this.onHandleImageChange }
							onHandleGoBack={ this.onHandleGoBack }
							onHandleDelete={ this.onHandleToggleAlert }
							onHandleSubmit={ this.onHandleSubmit }
						/>
					)
				}
			</Container>
		)
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withContext(withStyles(styles)(Dashboard));
