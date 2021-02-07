import { activatePasswordReset, isSignedIn, signin, signout, resetPassword, signup } from "./auth";
import { uploadFile } from './upload';
import { getVehiclesByUser, addVehicle, deleteVehicle, getVehicle, updateVehicle } from './vehicles';
import { getApiMfrs, getApiModelsByMfrKey } from './vehicleapi';
import { getUserProperties } from './properties';

const globalApis = {
	signup,
	signin,
	signout,
	isSignedIn,
	activatePasswordReset,
	resetPassword,
	uploadFile,
	getApiMfrs,
	getApiModelsByMfrKey,
	getVehiclesByUser,
	getVehicle,
	addVehicle,
	updateVehicle,
	deleteVehicle,
	getUserProperties
}

export default globalApis;
