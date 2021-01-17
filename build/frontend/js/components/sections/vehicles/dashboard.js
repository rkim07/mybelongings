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
const styles_1 = require("@material-ui/core/styles");
const appcontext_1 = require("../../../appcontext");
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
        this.onHandleClick = (vehicle, mode) => {
            this.setState({
                mode: mode,
                vehicle: vehicle
            });
        };
        this.onHandleDelete = (key) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.props.deleteVehicle(key);
            if (response === 204) {
                this.setState({
                    mode: 'list'
                });
            }
            else {
            }
        });
        this.onHandleSubmit = (vehicle, file) => __awaiter(this, void 0, void 0, function* () {
            if (file.length) {
                const uploaded = yield this.props.uploadFile(file[0]);
                vehicle.image = uploaded.fileName;
            }
            vehicle.year = parseInt(vehicle.year);
            vehicle['userKey'] = this.props.user.userKey;
            const response = vehicle.key ?
                yield this.props.updateVehicle(vehicle.key, vehicle) :
                yield this.props.addVehicle(vehicle);
            if (response === 200 || response === 201) {
                this.setState({
                    mode: 'list'
                });
            }
            else {
            }
        });
        this.onHandleGoBack = (e) => {
            this.setState({
                mode: 'list'
            });
        };
        this.state = {
            mode: 'list',
            vehicle: {}
        };
        this.onHandleClick = this.onHandleClick.bind(this);
        this.onHandleDelete = this.onHandleDelete.bind(this);
        this.onHandleSubmit = this.onHandleSubmit.bind(this);
        this.onHandleGoBack = this.onHandleGoBack.bind(this);
    }
    componentDidMount() {
        this.props.getVehiclesByUserKey(this.props.user.userKey);
    }
    /**
     * Render
     *
     * @returns {*}
     */
    render() {
        const { classes } = this.props;
        return (react_1.default.createElement(Container_1.default, { className: classes.cardGrid, maxWidth: "md" }, {
            'list': react_1.default.createElement(list_1.default, { onHandleClick: this.onHandleClick, onHandleDelete: this.onHandleDelete }),
            'add': react_1.default.createElement(page_1.default, { pageMode: "add", onHandleGoBack: this.onHandleGoBack, onHandleSubmit: this.onHandleSubmit }),
            'update': react_1.default.createElement(page_1.default, { pageMode: "update", vehicle: this.state.vehicle, onHandleGoBack: this.onHandleGoBack, onHandleSubmit: this.onHandleSubmit, onHandleDelete: this.onHandleDelete }),
            'view': react_1.default.createElement(page_1.default, { pageMode: "view", vehicle: this.state.vehicle, onHandleGoBack: this.onHandleGoBack })
        }[this.state.mode]));
    }
}
Dashboard.propTypes = {
    classes: prop_types_1.default.object.isRequired,
};
exports.default = appcontext_1.withContext(styles_1.withStyles(styles)(Dashboard));
//# sourceMappingURL=dashboard.js.map