"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const prop_types_1 = require("prop-types");
const list_1 = require("../../helpers/list");
const utils_1 = require("../../helpers/utils");
const ajax_1 = require("../../helpers/ajax");
const Grid_1 = require("@material-ui/core/Grid");
const ExpansionPanel_1 = require("@material-ui/core/ExpansionPanel");
const ExpansionPanelDetails_1 = require("@material-ui/core/ExpansionPanelDetails");
const ExpansionPanelSummary_1 = require("@material-ui/core/ExpansionPanelSummary");
const ExpansionPanelActions_1 = require("@material-ui/core/ExpansionPanelActions");
const Typography_1 = require("@material-ui/core/Typography");
const ExpandMore_1 = require("@material-ui/icons/ExpandMore");
const Button_1 = require("@material-ui/core/Button");
const Divider_1 = require("@material-ui/core/Divider");
const TextField_1 = require("@material-ui/core/TextField");
const MenuItem_1 = require("@material-ui/core/MenuItem");
const Input_1 = require("@material-ui/core/Input");
const react_material_ui_form_validator_1 = require("react-material-ui-form-validator");
const styles_1 = require("@material-ui/core/styles");
const appcontext_1 = require("../../appcontext");
const styles = theme => ({
    root: {
        width: '100%'
    },
    mainHeader: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(2),
        alignItems: 'center',
        textAlign: 'center',
        fontSize: theme.typography.pxToRem(18),
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    icon: {
        verticalAlign: 'bottom',
        height: 20,
        width: 20,
    },
    column: {
        flexBasis: '33.33%',
    },
    textField: {
        marginRight: theme.spacing(1),
        width: 200,
    }
});
class Profile extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handlePanelChange = panel => (event, expanded) => {
            this.setState({
                expanded: expanded ? panel : false,
            });
        };
        this.handleChange = (e) => {
            const { name, value } = e.target;
            if (name === 'newEmail') {
                this.setState({
                    newEmail: value
                });
            }
            else if (name === 'repeatEmail') {
                this.setState({
                    repeatEmail: value
                });
            }
            else {
                const user = this.state.user;
                user[name] = value;
                this.setState({
                    user: user
                });
            }
        };
        this.handleSubmit = (e) => {
            let type = e.currentTarget.dataset.type;
            let data = ajax_1.prepareProfileData(type, this.state);
            this.props.updateUser(data)
                .then(response => {
                if (response.error) {
                    this.setState({ errorMsg: response.error });
                }
                else {
                }
            });
        };
        this.state = {
            user: props.user ? props.user : '',
            oldPhoneNumber: props.user.phone,
            newEmail: '',
            repeatEmail: '',
            expanded: null,
            isEmailChange: true
        };
    }
    componentDidMount() {
        react_material_ui_form_validator_1.ValidatorForm.addValidationRule('isEmailMatch', (value) => {
            if (value !== this.state.newEmail) {
                return false;
            }
            this.setState({
                isEmailChange: false
            });
            return true;
        });
    }
    render() {
        const { classes } = this.props;
        const { expanded, user, newEmail, repeatEmail, isEmailChange, oldPhoneNumber } = this.state;
        let formattedPhone = utils_1.formatPhoneNumber(oldPhoneNumber);
        return (react_1.default.createElement("div", { className: classes.root },
            react_1.default.createElement(Grid_1.default, { container: true, justify: 'center' },
                react_1.default.createElement(Grid_1.default, { item: true, xs: 10, className: classes.mainHeader },
                    react_1.default.createElement(Typography_1.default, { variant: 'h6' }, "Profile")),
                react_1.default.createElement(Grid_1.default, { item: true, xs: 10 },
                    react_1.default.createElement(react_material_ui_form_validator_1.ValidatorForm, { className: classes.form, onSubmit: this.handleSubmit },
                        react_1.default.createElement(ExpansionPanel_1.default, { expanded: expanded === 'panel1', onChange: this.handlePanelChange('panel1') },
                            react_1.default.createElement(ExpansionPanelSummary_1.default, { expandIcon: react_1.default.createElement(ExpandMore_1.default, null) },
                                react_1.default.createElement("div", { className: classes.column },
                                    react_1.default.createElement(Typography_1.default, { className: classes.heading }, "Name")),
                                react_1.default.createElement("div", { className: classes.column },
                                    react_1.default.createElement(Typography_1.default, { className: classes.secondaryHeading },
                                        user.first_name,
                                        " ",
                                        user.last_name))),
                            react_1.default.createElement(ExpansionPanelDetails_1.default, null,
                                react_1.default.createElement(react_material_ui_form_validator_1.TextValidator, { label: 'First name *', onChange: this.handleChange, className: classes.textField, name: 'first_name', value: user.first_name, validators: ['required'], errorMessages: ['This field is required'] }),
                                react_1.default.createElement(react_material_ui_form_validator_1.TextValidator, { label: 'Last name *', onChange: this.handleChange, className: classes.textField, name: 'last_name', value: user.last_name, validators: ['required'], errorMessages: ['This field is required'] })),
                            react_1.default.createElement(Divider_1.default, null),
                            react_1.default.createElement(ExpansionPanelActions_1.default, null,
                                react_1.default.createElement(Button_1.default, { size: 'small', onClick: this.handlePanelChange('panel1') }, "Cancel"),
                                react_1.default.createElement(Button_1.default, { size: 'small', "data-type": 'name', onClick: this.handleSubmit, color: 'primary' }, "Save"))),
                        react_1.default.createElement(ExpansionPanel_1.default, { expanded: expanded === 'panel2', onChange: this.handlePanelChange('panel2') },
                            react_1.default.createElement(ExpansionPanelSummary_1.default, { expandIcon: react_1.default.createElement(ExpandMore_1.default, null) },
                                react_1.default.createElement("div", { className: classes.column },
                                    react_1.default.createElement(Typography_1.default, { className: classes.heading }, "Address")),
                                react_1.default.createElement("div", { className: classes.column },
                                    react_1.default.createElement(Typography_1.default, { className: classes.secondaryHeading },
                                        user.address,
                                        react_1.default.createElement("br", null),
                                        user.city,
                                        ", ",
                                        user.state,
                                        ", ",
                                        user.zip))),
                            react_1.default.createElement(ExpansionPanelDetails_1.default, null,
                                react_1.default.createElement(TextField_1.default, { label: 'Address', name: 'address', value: user.address, onChange: this.handleChange, fullWidth: true })),
                            react_1.default.createElement(ExpansionPanelDetails_1.default, null,
                                react_1.default.createElement(TextField_1.default, { label: 'City', name: 'city', value: user.city, onChange: this.handleChange, className: classes.textField }),
                                react_1.default.createElement(TextField_1.default, { select: true, label: 'State', name: 'state', value: user.state, className: classes.textField, onChange: this.handleChange }, list_1.getStates().map(option => (react_1.default.createElement(MenuItem_1.default, { key: option.value, value: option.value }, option.label)))),
                                react_1.default.createElement(TextField_1.default, { label: 'Zip', onChange: this.handleChange, name: 'zip', value: user.zip })),
                            react_1.default.createElement(Divider_1.default, null),
                            react_1.default.createElement(ExpansionPanelActions_1.default, null,
                                react_1.default.createElement(Button_1.default, { size: 'small', onClick: this.handlePanelChange('panel2') }, "Cancel"),
                                react_1.default.createElement(Button_1.default, { size: 'small', "data-type": 'address', onClick: this.handleSubmit, color: 'primary' }, "Save"))),
                        react_1.default.createElement(ExpansionPanel_1.default, { expanded: expanded === 'panel3', onChange: this.handlePanelChange('panel3') },
                            react_1.default.createElement(ExpansionPanelSummary_1.default, { expandIcon: react_1.default.createElement(ExpandMore_1.default, null) },
                                react_1.default.createElement("div", { className: classes.column },
                                    react_1.default.createElement(Typography_1.default, { className: classes.heading }, "Phone")),
                                react_1.default.createElement("div", { className: classes.column },
                                    react_1.default.createElement(Typography_1.default, { className: classes.secondaryHeading }, formattedPhone))),
                            react_1.default.createElement(ExpansionPanelDetails_1.default, null,
                                react_1.default.createElement(Input_1.default, { label: 'Phone', name: 'phone', value: user.phone, onChange: this.handleChange, id: 'formatted-text-mask-input', inputComponent: utils_1.textMaskCustom })),
                            react_1.default.createElement(Divider_1.default, null),
                            react_1.default.createElement(ExpansionPanelActions_1.default, null,
                                react_1.default.createElement(Button_1.default, { size: 'small', onClick: this.handlePanelChange('panel3') }, "Cancel"),
                                react_1.default.createElement(Button_1.default, { size: 'small', "data-type": 'phone', onClick: this.handleSubmit, color: 'primary' }, "Save"))),
                        react_1.default.createElement(ExpansionPanel_1.default, { expanded: expanded === 'panel5', onChange: this.handlePanelChange('panel5') },
                            react_1.default.createElement(ExpansionPanelSummary_1.default, { expandIcon: react_1.default.createElement(ExpandMore_1.default, null) },
                                react_1.default.createElement("div", { className: classes.column },
                                    react_1.default.createElement(Typography_1.default, { className: classes.heading }, "Email")),
                                react_1.default.createElement("div", { className: classes.column },
                                    react_1.default.createElement(Typography_1.default, { className: classes.secondaryHeading }, user.email))),
                            react_1.default.createElement(ExpansionPanelDetails_1.default, null,
                                react_1.default.createElement(react_material_ui_form_validator_1.TextValidator, { name: 'newEmail', label: 'New email', type: 'text', className: classes.textField, value: newEmail, onChange: this.handleChange, validators: ['required'], errorMessages: ['this field is required'] }),
                                react_1.default.createElement(react_material_ui_form_validator_1.TextValidator, { name: 'repeatEmail', label: 'Confirm new email', type: 'text', className: classes.textField, value: repeatEmail, onChange: this.handleChange, validators: ['isEmailMatch', 'required'], errorMessages: ['Email mismatch', 'this field is required'] })),
                            react_1.default.createElement(Divider_1.default, null),
                            react_1.default.createElement(ExpansionPanelActions_1.default, null,
                                react_1.default.createElement(Button_1.default, { size: 'small', onClick: this.handlePanelChange('panel5') }, "Cancel"),
                                react_1.default.createElement(Button_1.default, { size: 'small', "data-type": 'email', onClick: this.handleSubmit, color: 'primary', disabled: isEmailChange }, "Save"))))))));
    }
}
Profile.propTypes = {
    classes: prop_types_1.default.object.isRequired
};
exports.default = appcontext_1.withContext(styles_1.withStyles(styles)(Profile));
//# sourceMappingURL=profile.js.map