import { activatePasswordReset, isLoggedIn, login, logout, resetPassword, signup } from "./auth";
import { uploadFile } from './upload';
import { getUserVehicles, addVehicle, deleteVehicle, getVehicle, updateVehicle } from './vehicles';
import { getApiMfrs, getApiModelsByMfrKey } from './vehicleapi';
import { getUserProperties } from './properties';

const globalApis = {
	signup,
	login,
	logout,
	isLoggedIn,
	activatePasswordReset,
	resetPassword,
	uploadFile,
	getApiMfrs,
	getApiModelsByMfrKey,
	getUserProperties,
	getUserVehicles,
	getVehicle,
	addVehicle,
	updateVehicle,
	deleteVehicle
}

export default globalApis;
