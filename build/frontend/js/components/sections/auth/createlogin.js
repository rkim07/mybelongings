"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const prop_types_1 = require("prop-types");
const ajax_1 = require("../../../utils/ajax");
const Button_1 = require("@material-ui/core/Button");
const FormControl_1 = require("@material-ui/core/FormControl");
const Grid_1 = require("@material-ui/core/Grid");
const Paper_1 = require("@material-ui/core/Paper");
const Typography_1 = require("@material-ui/core/Typography");
const styles_1 = require("@material-ui/core/styles");
const react_material_ui_form_validator_1 = require("react-material-ui-form-validator");
const appcontext_1 = require("../../../appcontext");
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
    form: {
        width: '100%',
        marginTop: theme.spacing(),
    },
    submit: {
        marginTop: theme.spacing(3),
    }
});
class CreateLogin extends react_1.default.Component {
    /**
     * Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);
        /**
         * Handle form changes
         *
         * @param e
         */
        this.handleChange = (e) => {
            const { name, value } = e.target;
            this.setState({
                [name]: value
            });
        };
        // Submit
        this.handleSubmit = () => {
            let data = ajax_1.prepareLoginData(this.state);
            this.props.register(data);
            this.props.history.push('/login');
        };
        this.state = {
            id: props.userRegId || '',
            username: '',
            password: '',
            repeatPassword: ''
        };
    }
    componentDidMount() {
        // custom rule will have name 'isPasswordMatch'
        react_material_ui_form_validator_1.ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.password) {
                return false;
            }
            return true;
        });
    }
    render() {
        const { classes, systemNoticesType, systemNoticesAdminEmail, userRegName } = this.props;
        if (systemNoticesType) {
            let message = '';
            switch (systemNoticesType) {
                case 'error':
                    message = react_1.default.createElement("h3", null, "User has already created credentials.  Please go ahead and login.");
                    break;
                case 'expired':
                    message = react_1.default.createElement("h3", null,
                        "Your registration period have expired.  Please contact the ",
                        react_1.default.createElement("a", { href: `mailto:${systemNoticesAdminEmail}` }, "administrator"),
                        " and request again.");
                    break;
            }
            return (react_1.default.createElement(Paper_1.default, { className: classes.paper }, message));
        }
        else {
            return (react_1.default.createElement("main", { className: classes.main },
                react_1.default.createElement(Grid_1.default, { container: true, justify: 'center' },
                    react_1.default.createElement(Grid_1.default, { item: true, xs: 12, sm: 12, md: 12 },
                        react_1.default.createElement(Paper_1.default, { className: classes.paper },
                            react_1.default.createElement(Typography_1.default, { component: 'h1', variant: 'h5' },
                                "Welcome ",
                                userRegName,
                                ", please enter an username and password to create your access."),
                            react_1.default.createElement(react_material_ui_form_validator_1.ValidatorForm, { className: classes.form, ref: 'form', onSubmit: this.handleSubmit },
                                react_1.default.createElement(FormControl_1.default, { margin: 'normal', required: true, fullWidth: true },
                                    react_1.default.createElement(react_material_ui_form_validator_1.TextValidator, { label: 'Username', onChange: this.handleChange, name: 'username', value: this.state.username, validators: ['required'], errorMessages: ['This field is required'] })),
                                react_1.default.createElement("br", null),
                                react_1.default.createElement(FormControl_1.default, { margin: 'normal', required: true, fullWidth: true },
                                    react_1.default.createElement(react_material_ui_form_validator_1.TextValidator, { label: 'Password', onChange: this.handleChange, name: 'password', type: 'password', value: this.state.password, validators: ['required'], errorMessages: ['This field is required'] })),
                                react_1.default.createElement(FormControl_1.default, { margin: 'normal', required: true, fullWidth: true },
                                    react_1.default.createElement(react_material_ui_form_validator_1.TextValidator, { label: 'Confirm Password', onChange: this.handleChange, name: 'repeatPassword', type: 'password', value: this.state.repeatPassword, validators: ['isPasswordMatch', 'required'], errorMessages: ['Password mismatch', 'This field is required'] })),
                                react_1.default.createElement("br", null),
                                react_1.default.createElement(Button_1.default, { type: 'submit', fullWidth: true, variant: 'contained', color: 'primary', className: classes.submit }, "Create")))))));
        }
    }
}
CreateLogin.propTypes = {
    classes: prop_types_1.default.object.isRequired,
};
exports.default = appcontext_1.withContext(styles_1.withStyles(styles)(CreateLogin));
//# sourceMappingURL=createlogin.js.map