"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const content_1 = require("./content");
const Snackbar_1 = require("@material-ui/core/Snackbar");
const notifier_1 = require("./../../helpers/notifier");
class Main extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleOpen = (event) => {
            this.setState({
                open: true
            });
        };
        this.handleClose = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }
            // Clear local storage notifier
            notifier_1.clearNotifier();
            this.setState({
                open: false,
                message: '',
                closedByTimeout: true
            });
        };
        this.state = {
            open: false,
            message: '',
            type: 'success',
            closedByTimeout: false
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (state.closedByTimeout) {
            return {
                open: false,
                message: '',
                closedByTimeout: false
            };
        }
        else {
            return {
                open: props.open,
                message: props.message,
                type: props.type
            };
        }
    }
    render() {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement(Snackbar_1.default, { anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }, open: this.state.open, autoHideDuration: 6000, onClose: this.handleClose, onExiting: this.handleClose },
                react_1.default.createElement(content_1.default, { onClose: this.handleClose, variant: this.state.type, message: this.state.message }))));
    }
}
exports.default = Main;
//# sourceMappingURL=main.js.map