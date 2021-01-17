"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const prop_types_1 = require("prop-types");
const react_router_dom_1 = require("react-router-dom");
const isUndefined_1 = require("lodash/isUndefined");
const Grid_1 = require("@material-ui/core/Grid");
// import Notifier from '../../components/notifier/main';
const styles_1 = require("@material-ui/core/styles");
const appcontext_1 = require("../../appcontext");
const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block',
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    }
});
const withLogin = (WrappedComponent) => {
    class withLogin extends react_1.default.Component {
        // Constructor
        constructor(props) {
            super(props);
            // Handle form changes
            this.handleChange = (e) => {
                const { name, value } = e.target;
                this.setState({
                    [name]: value
                });
                this.props.clearNotifier();
            };
            // Submit
            this.handleSubmit = () => {
                this.props.login(this.state)
                    .then(response => {
                    if (!isUndefined_1.default(response)) {
                        if (response.redirect) {
                            this.props.history.push(this.state.redirectUrl);
                        }
                        else if (response.status !== 200) {
                            this.setState({
                                displayNotifier: true
                            });
                        }
                    }
                });
            };
            // Clear input
            this.clearInputs = () => {
                this.setState({
                    username: '',
                    password: ''
                });
            };
            this.state = {
                username: '',
                password: '',
                section: props.section,
                redirectUrl: props.redirectUrl,
                displayNotifier: false
            };
            this.props.clearNotifier();
        }
        render() {
            const { classes } = this.props;
            // const { openNotifier, notifierType, notifierMsg } = this.props.getNotifier();
            return (react_1.default.createElement("main", { className: classes.main },
                react_1.default.createElement(Grid_1.default, { container: true, justify: 'center' },
                    react_1.default.createElement(Grid_1.default, { item: true, xs: 12, sm: 12, md: 12 },
                        react_1.default.createElement(WrappedComponent, Object.assign({ handleChange: this.handleChange, handleSubmit: this.handleSubmit, handleRedirect: this.handleRedirect }, this.state))))));
        }
    }
    withLogin.propTypes = {
        classes: prop_types_1.default.object.isRequired,
    };
    return appcontext_1.withContext(react_router_dom_1.withRouter(styles_1.withStyles(styles)(withLogin)));
};
exports.default = withLogin;
//# sourceMappingURL=withlogin.js.map