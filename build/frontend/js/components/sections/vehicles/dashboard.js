"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const prop_types_1 = require("prop-types");
const notifier_1 = require("../../helpers/notifier");
const response_1 = require("../../helpers/response");
const styles_1 = require("@material-ui/core/styles");
const appcontext_1 = require("../../../appcontext");
const date_1 = require("../../../utils/date");
const list_1 = require("./list");
const page_1 = require("./page");
const Container_1 = require("@material-ui/core/Container");
const styles = theme => ({
    root: {
        flexGrow: 1
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    }
});
class Dashboard extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.onHandleChange = (e) => {
            const { name, value } = e.target;
            let vehicle = this.state.vehicle;
            if (name === "mfrKey") {
                vehicle['modelKey'] = '';
            }
            vehicle[name] = value;
            this.setState({
                vehicle: vehicle
            });
        };
        this.onHandleClick = (data, pageMode) => {
            const vehicle = pageMode !== 'new' ? data :
                {
                    mfrKey: '',
                    modelKey: '',
                    image: '',
                    condition: 'new',
                    year: date_1.currentYear(),
                    color: '',
                    vin: '',
                    plate: ''
                };
            this.setState({
                pageMode: pageMode,
                vehicle: vehicle,
                openNotifier: false,
                notifierType: '',
                notifierMsg: ''
            });
        };
        this.onHandleDelete = (key) => __awaiter(this, void 0, void 0, function* () {
            const results = yield this.props.deleteVehicle(key);
            /*if (results) {
                const vehicles = this.props.vehicles;
    
                _.remove(vehicles, (vehicle) => {
                    return vehicle.key === results.data.vehicle.key;
                });
            }*/
            const response = response_1.parseResponse(results);
            this.setState({
                pageMode: response.statusType === 'error' ? this.state.pageMode : 'list',
                openNotifier: true,
                notifierType: response.statusType,
                notifierMsg: response.message
            });
        });
        this.onHandleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const { file, vehicle } = this.state;
            if (file.length) {
                const uploadedResponse = yield this.props.uploadFile(file[0]);
                vehicle.image = uploadedResponse.data.fileName;
            }
            vehicle.year = parseInt(vehicle.year);
            vehicle['userKey'] = this.props.user.userKey;
            const results = vehicle.key ?
                yield this.props.updateVehicle(vehicle.key, vehicle) :
                yield this.props.addVehicle(vehicle);
            const response = response_1.parseResponse(results);
            this.setState({
                pageMode: response.statusType === 'error' ? this.state.pageMode : 'list',
                openNotifier: true,
                notifierType: response.statusType,
                notifierMsg: response.message
            });
        });
        this.onHandleImageChange = (file) => {
            if (_.size(file) > 0) {
                this.setState({
                    file: file
                });
            }
        };
        this.onHandleGoBack = () => {
            this.setState({
                pageMode: 'list'
            });
        };
        this.onHandleCloseNotifier = () => {
            this.setState({
                pageMode: this.state.pageMode,
                openNotifier: false,
                notifierType: '',
                notifierMsg: ''
            });
        };
        this.state = {
            pageMode: 'list',
            vehicle: {},
            file: [],
            openNotifier: false,
            notifierType: '',
            notifierMsg: ''
        };
        this.onHandleChange = this.onHandleChange.bind(this);
        this.onHandleClick = this.onHandleClick.bind(this);
        this.onHandleDelete = this.onHandleDelete.bind(this);
        this.onHandleSubmit = this.onHandleSubmit.bind(this);
        this.onHandleGoBack = this.onHandleGoBack.bind(this);
        this.onHandleCloseNotifier = this.onHandleCloseNotifier.bind(this);
    }
    /**
     * Render
     *
     * @returns {*}
     */
    render() {
        const { classes } = this.props;
        return (react_1.default.createElement(Container_1.default, { className: classes.cardGrid, maxWidth: "md" },
            this.state.openNotifier && (react_1.default.createElement(notifier_1.default, { openNotifier: this.state.openNotifier, notifierType: this.state.notifierType, notifierMsg: this.state.notifierMsg, onHandleCloseNotifier: this.onHandleCloseNotifier })),
            {
                'list': react_1.default.createElement(list_1.default, { onHandleClick: this.onHandleClick, onHandleDelete: this.onHandleDelete }),
                'new': react_1.default.createElement(page_1.default, { pageMode: "new", vehicle: this.state.vehicle, onHandleChange: this.onHandleChange, onHandleImageChange: this.onHandleImageChange, onHandleGoBack: this.onHandleGoBack, onHandleSubmit: this.onHandleSubmit }),
                'update': react_1.default.createElement(page_1.default, { pageMode: "update", vehicle: this.state.vehicle, onHandleChange: this.onHandleChange, onHandleImageChange: this.onHandleImageChange, onHandleDelete: this.onHandleDelete, onHandleGoBack: this.onHandleGoBack, onHandleSubmit: this.onHandleSubmit }),
                'view': react_1.default.createElement(page_1.default, { pageMode: "view", vehicle: this.state.vehicle, onHandleGoBack: this.onHandleGoBack })
            }[this.state.pageMode]));
    }
}
Dashboard.propTypes = {
    classes: prop_types_1.default.object.isRequired,
};
exports.default = appcontext_1.withContext(styles_1.withStyles(styles)(Dashboard));
//# sourceMappingURL=dashboard.js.map