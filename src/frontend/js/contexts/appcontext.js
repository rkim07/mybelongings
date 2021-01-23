import React from 'react';
import { login, register} from "./auth";
import { uploadFile } from './file';
import { getApiMfrs, getApiModelsByMfrKey } from './vehicleapi';
import { getUserProperties } from './properties';
import { getUserVehicles, addVehicle, updateVehicle, deleteVehicle } from './vehicles';

const AppContext = React.createContext('');

export class AppContextProvider extends React.Component
{
	/**
	 * Constructor
	 *
	 * @param props
	 */
	constructor(props) {
		super(props);

		this.state = {
			accessToken: localStorage.getItem('accessToken') !== undefined ? localStorage.getItem('accessToken') : '',
			refreshToken: localStorage.getItem('refreshToken') !== undefined ? localStorage.getItem('refreshToken') : ''
		};

		this.register = register.bind(this);
		this.login = login.bind(this);
		this.uploadFile = uploadFile.bind(this);
		this.getApiMfrs = getApiMfrs.bind(this);
		this.getApiModelsByMfrKey = getApiModelsByMfrKey.bind(this);
		this.getUserProperties = getUserProperties.bind(this);
		this.getUserVehicles = getUserVehicles.bind(this);
		this.addVehicle = addVehicle.bind(this);
		this.updateVehicle = updateVehicle.bind(this);
		this.deleteVehicle = deleteVehicle.bind(this);
	}

	/**
	 * Logout
	 */
	logout = () => {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');

		this.setState({
			accessToken: '',
			refreshToken: ''
		});
	}

	render() {
		return (
			<AppContext.Provider
				value={{
					register: this.register,
					login: this.login,
					logout: this.logout,
					uploadFile: this.uploadFile,
					getApiMfrs: this.getApiMfrs,
					getApiModelsByMfrKey: this.getApiModelsByMfrKey,
					getUserProperties: this.getUserProperties,
					getUserVehicles: this.getUserVehicles,
					addVehicle: this.addVehicle,
					updateVehicle: this.updateVehicle,
					deleteVehicle: this.deleteVehicle,
					...this.state
				}}>

				{ this.props.children }

			</AppContext.Provider>
		)
	}
}

export const withContext = Component => {
	return props => {
		return (
			<AppContext.Consumer>
				{
					globalState => {
						return (
							<Component
								{...globalState}
								{...props}
							/>
						)
					}
				}
			</AppContext.Consumer>
		)
	}
}
