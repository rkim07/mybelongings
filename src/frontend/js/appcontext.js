import React from 'react';
import { isLoggedIn, login, logout, register } from "./apis/auth";
import { uploadFile } from './apis/upload';
import { getUserVehicles, addVehicle, deleteVehicle, getVehicle, updateVehicle } from './apis/vehicles';
import { getApiMfrs, getApiModelsByMfrKey } from './apis/vehicleapi';
import { getUserProperties } from './apis/properties';

const AppContext = React.createContext('');

export class AppContextProvider extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {
		const { children } = this.props;

		return (
			<AppContext.Provider
				value={{
					register: register.bind(this),
					login: login.bind(this),
					logout: logout.bind(this),
					isLoggedIn: isLoggedIn.bind(this),
					uploadFile: uploadFile.bind(this),
					getApiMfrs: getApiMfrs.bind(this),
					getApiModelsByMfrKey: getApiModelsByMfrKey.bind(this),
					getUserProperties: getUserProperties.bind(this),
					getUserVehicles: getUserVehicles.bind(this),
					getVehicle: getVehicle.bind(this),
					addVehicle: addVehicle.bind(this),
					updateVehicle: updateVehicle.bind(this),
					deleteVehicle: deleteVehicle.bind(this)
				}}>
				{ children }
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
