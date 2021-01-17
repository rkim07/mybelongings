"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const prop_types_1 = require("prop-types");
const Avatar_1 = require("@material-ui/core/Avatar");
const Button_1 = require("@material-ui/core/Button");
const FormControl_1 = require("@material-ui/core/FormControl");
const LockOutlined_1 = require("@material-ui/icons/LockOutlined");
const Paper_1 = require("@material-ui/core/Paper");
const Typography_1 = require("@material-ui/core/Typography");
const styles_1 = require("@material-ui/core/styles");
const withlogin_1 = require("../../hoc/withlogin");
const react_material_ui_form_validator_1 = require("react-material-ui-form-validator");
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
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    avatar: {
        margin: theme.spacing(),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(),
    },
    submit: {
        marginTop: theme.spacing(3),
    }
});
class Login extends react_1.default.Component {
    render() {
        const { classes } = this.props;
        return (react_1.default.createElement(Paper_1.default, { className: classes.paper },
            react_1.default.createElement(Avatar_1.default, { className: classes.avatar },
                react_1.default.createElement(LockOutlined_1.default, null)),
            react_1.default.createElement(Typography_1.default, { component: 'h1', variant: 'h5' }, "Log in"),
            react_1.default.createElement(react_material_ui_form_validator_1.ValidatorForm, { className: classes.form, ref: 'form', onSubmit: this.props.handleSubmit },
                react_1.default.createElement(FormControl_1.default, { margin: 'normal', required: true, fullWidth: true },
                    react_1.default.createElement(react_material_ui_form_validator_1.TextValidator, { label: 'Username', onChange: this.props.handleChange, name: 'username', value: this.props.username, validators: ['required'], errorMessages: ['This field is required'] })),
                react_1.default.createElement("br", null),
                react_1.default.createElement(FormControl_1.default, { margin: 'normal', required: true, fullWidth: true },
                    react_1.default.createElement(react_material_ui_form_validator_1.TextValidator, { label: 'Password', onChange: this.props.handleChange, name: 'password', type: 'password', value: this.props.password, validators: ['required'], errorMessages: ['This field is required'] })),
                react_1.default.createElement("br", null),
                react_1.default.createElement(Button_1.default, { type: 'submit', fullWidth: true, variant: 'contained', color: 'primary', className: classes.submit }, "Log in"))));
    }
}
Login.propTypes = {
    classes: prop_types_1.default.object.isRequired,
};
exports.default = withlogin_1.default(styles_1.withStyles(styles)(Login));
//# sourceMappingURL=login.js.map