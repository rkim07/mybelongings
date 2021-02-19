import { activatePasswordReset, isAdmin, isSignedIn, signin, signout, resetPassword, signup } from "./auth";
import { downloadFile, uploadFile } from './upload';
import { getVehiclesByUser, addVehicle, deleteVehicle, getVehicle, getVehicles, updateVehicle } from './vehicles';
import { getStoresByType } from './stores';
import { getApiMfrs, getApiModelsByMfrKey } from './vehicleapi';
import { getUserProperties } from './properties';

const globalApis = {
	signup,
	signin,
	signout,
	isAdmin,
	isSignedIn,
	activatePasswordReset,
	resetPassword,
	uploadFile,
	downloadFile,
	getApiMfrs,
	getApiModelsByMfrKey,
	getVehiclesByUser,
	getVehicle,
	getVehicles,
	addVehicle,
	updateVehicle,
	deleteVehicle,
	getUserProperties,
	getStoresByType
}

export default globalApis;
