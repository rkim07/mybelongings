import { activatePasswordReset, isAdmin, isSignedIn, signin, signout, resetPassword, signup } from "./auth";
import { getNhtsaMfrs, getNhtsaModelsByMfrKey, syncNhtsa } from './nhtsa';
import { uploadFile } from './upload';
import { getVehiclesByUser, addVehicle, deleteVehicle, getVehicle, getVehicles, updateVehicle } from './vehicles';
import { getUserProperties } from './properties';
import { deleteBusiness, getBusiness, getBusinesses, getBusinessesByType } from './businesses';

const globalApis = {
	signup,
	signin,
	signout,
	isAdmin,
	isSignedIn,
	activatePasswordReset,
	resetPassword,
	uploadFile,
	syncNhtsa,
	getNhtsaMfrs,
	getNhtsaModelsByMfrKey,
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
