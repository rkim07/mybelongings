import React from 'react';
import PropTypes from 'prop-types';
import Notifier from '../../helpers/notifier';
import { parseResponse } from '../../helpers/response';
import { withStyles } from '@material-ui/core/styles';
import { withContext } from '../../../appcontext';
import { currentYear } from '../../../utils/date';
import List from './list';
import Page from './page';
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
			pageMode: 'list',
			vehicle: {},
			file: [],
			openNotifier: false,
			notifierType: '',
			notifierMsg: ''
		}

		this.onHandleChange = this.onHandleChange.bind(this);
		this.onHandleClick = this.onHandleClick.bind(this);
		this.onHandleDelete = this.onHandleDelete.bind(this);
		this.onHandleSubmit = this.onHandleSubmit.bind(this);
		this.onHandleGoBack = this.onHandleGoBack.bind(this);
		this.onHandleCloseNotifier = this.onHandleCloseNotifier.bind(this);
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

	onHandleClick = (data, pageMode) => {
		const vehicle = pageMode !== 'new' ? data :
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
			pageMode: pageMode,
			vehicle: vehicle,
			openNotifier: false,
			notifierType: '',
			notifierMsg: ''
		});
	}

	onHandleDelete = async(key) => {
		const results = await this.props.deleteVehicle(key);

		/*if (results) {
			const vehicles = this.props.vehicles;

			_.remove(vehicles, (vehicle) => {
				return vehicle.key === results.data.vehicle.key;
			});
		}*/
		const response = parseResponse(results);

		this.setState({
			pageMode: response.statusType === 'error' ? this.state.pageMode : 'list',
			openNotifier: true,
			notifierType: response.statusType,
			notifierMsg: response.message
		});
	}

	onHandleSubmit = async (e) => {
		e.preventDefault();

		const { file, vehicle } = this.state;

		if (file.length) {
			const uploadedResponse = await this.props.uploadFile(file[0]);
			vehicle.image = uploadedResponse.data.fileName;
		}

		vehicle.year = parseInt(vehicle.year);
		vehicle['userKey'] = this.props.user.userKey;

		const results = vehicle.key ?
			await this.props.updateVehicle(vehicle.key, vehicle) :
			await this.props.addVehicle(vehicle);

		const response = parseResponse(results);

		this.setState({
			pageMode: response.statusType === 'error' ? this.state.pageMode : 'list',
			openNotifier: true,
			notifierType: response.statusType,
			notifierMsg: response.message
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
			pageMode: 'list'
		});
	}

	onHandleCloseNotifier = () => {
		this.setState({
			pageMode: this.state.pageMode,
			openNotifier: false,
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

		return (
			<Container className={classes.cardGrid} maxWidth="md">
				{ this.state.openNotifier && (
					<Notifier
						openNotifier={ this.state.openNotifier }
						notifierType={ this.state.notifierType }
						notifierMsg={ this.state.notifierMsg }
						onHandleCloseNotifier={ this.onHandleCloseNotifier }
					/>
				)}
				{
					{
						'list':
							<List
								onHandleClick={ this.onHandleClick }
								onHandleDelete={ this.onHandleDelete }
							/>,
						'new':
							<Page
								pageMode="new"
								vehicle={ this.state.vehicle }
								onHandleChange={ this.onHandleChange }
								onHandleImageChange={ this.onHandleImageChange }
								onHandleGoBack={ this.onHandleGoBack }
								onHandleSubmit={ this.onHandleSubmit }
							/>,
						'update':
							<Page
								pageMode="update"
								vehicle={ this.state.vehicle }
								onHandleChange={ this.onHandleChange }
								onHandleImageChange={ this.onHandleImageChange }
								onHandleDelete={ this.onHandleDelete }
								onHandleGoBack={ this.onHandleGoBack }
								onHandleSubmit={ this.onHandleSubmit }
							/>,
						'view':
							<Page
								pageMode="view"
								vehicle={ this.state.vehicle }
								onHandleGoBack={ this.onHandleGoBack }
							/>
					}[this.state.pageMode]
				}
			</Container>
		)
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withContext(withStyles(styles)(Dashboard));
