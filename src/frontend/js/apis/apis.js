import { activatePasswordReset, isAdmin, isSignedIn, signin, signout, resetPassword, signup } from "./auth";
import { uploadFile } from './upload';
import { getVehiclesByUser, addVehicle, deleteVehicle, getVehicle, getVehicles, updateVehicle } from './vehicles';
import { deleteBusiness, getBusiness, getBusinesses, getBusinessesByType } from './businesses';
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
	getApiMfrs,
	getApiModelsByMfrKey,
	getVehiclesByUser,
	getVehicle,
	getVehicles,
	addVehicle,
	updateVehicle,
	deleteVehicle,
	getUserProperties,
	getBusiness,
	getBusinesses,
	getBusinessesByType,
	deleteBusiness
}

export default globalApis;
