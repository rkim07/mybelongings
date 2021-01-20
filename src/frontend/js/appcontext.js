import React from 'react';
import { login, register } from './contexts/auth';
import { uploadFile } from './contexts/file';
import { getApiMfrs, getApiModelsByMfrKey } from './contexts/vehicleapi';
import { getPropertiesByUserKey } from './contexts/properties';
import { getVehiclesByUserKey, addVehicle, updateVehicle, deleteVehicle } from './contexts/vehicles';

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
			token: localStorage.getItem('token') !== undefined ? localStorage.getItem('token') : '',
			user: localStorage.getItem('user') !== undefined ? JSON.parse(localStorage.getItem('user')) : '',
		};

		this.register = register.bind(this);
		this.login = login.bind(this);
		this.uploadFile = uploadFile.bind(this);
		this.getApiMfrs = getApiMfrs.bind(this);
		this.getApiModelsByMfrKey = getApiModelsByMfrKey.bind(this);
		this.getPropertiesByUserKey = getPropertiesByUserKey.bind(this);
		this.getVehiclesByUserKey = getVehiclesByUserKey.bind(this);
		this.addVehicle = addVehicle.bind(this);
		this.updateVehicle = updateVehicle.bind(this);
		this.deleteVehicle = deleteVehicle.bind(this);
	}

	/**
	 * Logout
	 */
	logout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');

		this.setState({
			token: '',
			user: '',
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
					getPropertiesByUserKey: this.getPropertiesByUserKey,
					getVehiclesByUserKey: this.getVehiclesByUserKey,
					addVehicle: this.addVehicle,
					updateVehicle: this.updateVehicle,
					deleteVehicle: this.deleteVehicle,
					...this.state
				}}>

				{this.props.children}

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
