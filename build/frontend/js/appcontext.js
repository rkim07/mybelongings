"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withContext = exports.AppContextProvider = void 0;
const react_1 = require("react");
const auth_1 = require("./contexts/auth");
const notifier_1 = require("./helpers/notifier");
const file_1 = require("./contexts/file");
const vehicleapi_1 = require("./contexts/vehicleapi");
const properties_1 = require("./contexts/properties");
const vehicles_1 = require("./contexts/vehicles");
const AppContext = react_1.default.createContext('');
class AppContextProvider extends react_1.default.Component {
    /**
     * Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);
        /**
         * Logout
         */
        this.logout = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.setState({
                token: '',
                user: '',
            });
        };
        this.state = {
            token: localStorage.getItem('token') !== undefined ? localStorage.getItem('token') : '',
            user: localStorage.getItem('user') !== undefined ? JSON.parse(localStorage.getItem('user')) : '',
            manufacturers: '',
            models: '',
            properties: '',
            vehicles: ''
        };
        this.register = auth_1.register.bind(this);
        this.login = auth_1.login.bind(this);
        this.getNotifier = notifier_1.getNotifier.bind(this);
        this.clearNotifier = notifier_1.clearNotifier.bind(this);
        this.uploadFile = file_1.uploadFile.bind(this);
        this.getApiMfrs = vehicleapi_1.getApiMfrs.bind(this);
        this.getApiModelsByMfrKey = vehicleapi_1.getApiModelsByMfrKey.bind(this);
        this.getPropertiesByUserKey = properties_1.getPropertiesByUserKey.bind(this);
        this.getVehiclesByUserKey = vehicles_1.getVehiclesByUserKey.bind(this);
        this.addVehicle = vehicles_1.addVehicle.bind(this);
        this.updateVehicle = vehicles_1.updateVehicle.bind(this);
        this.deleteVehicle = vehicles_1.deleteVehicle.bind(this);
    }
    render() {
        return (react_1.default.createElement(AppContext.Provider, { value: Object.assign({ register: this.register, login: this.login, logout: this.logout, getNotifier: this.getNotifier, clearNotifier: this.clearNotifier, uploadFile: this.uploadFile, getApiMfrs: this.getApiMfrs, getApiModelsByMfrKey: this.getApiModelsByMfrKey, getPropertiesByUserKey: this.getPropertiesByUserKey, getVehiclesByUserKey: this.getVehiclesByUserKey, addVehicle: this.addVehicle, updateVehicle: this.updateVehicle, deleteVehicle: this.deleteVehicle }, this.state) }, this.props.children));
    }
}
exports.AppContextProvider = AppContextProvider;
exports.withContext = Component => {
    return props => {
        return (react_1.default.createElement(AppContext.Consumer, null, globalState => {
            return (react_1.default.createElement(Component, Object.assign({}, globalState, props)));
        }));
    };
};
//# sourceMappingURL=appcontext.js.map