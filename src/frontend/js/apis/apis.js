import { activatePasswordReset, isSignedIn, signin, signout, resetPassword, signup } from "./auth";
import { uploadFile } from './upload';
import { getUserVehicles, addVehicle, deleteVehicle, getVehicle, getDealerByVehicle, updateVehicle } from './vehicles';
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
	getUserVehicles,
	getVehicle,
	addVehicle,
	updateVehicle,
	deleteVehicle,
	getDealerByVehicle,
	getUserProperties
}

export default globalApis;
