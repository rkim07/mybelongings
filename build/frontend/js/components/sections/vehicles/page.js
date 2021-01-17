"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const _ = require("lodash");
const prop_types_1 = require("prop-types");
const react_router_dom_1 = require("react-router-dom");
const styles_1 = require("@material-ui/core/styles");
const appcontext_1 = require("../../../appcontext");
const utils_1 = require("../../../helpers/utils");
const list_1 = require("../../../helpers/list");
const date_1 = require("../../../helpers/date");
const Grid_1 = require("@material-ui/core/Grid");
const FormControl_1 = require("@material-ui/core/FormControl");
const FormHelperText_1 = require("@material-ui/core/FormHelperText");
const MenuItem_1 = require("@material-ui/core/MenuItem");
const TextField_1 = require("@material-ui/core/TextField");
const material_ui_image_1 = require("material-ui-image");
const Button_1 = require("@material-ui/core/Button");
const ArrowBack_1 = require("@material-ui/icons/ArrowBack");
const Save_1 = require("@material-ui/icons/Save");
const Delete_1 = require("@material-ui/icons/Delete");
const react_material_ui_form_validator_1 = require("react-material-ui-form-validator");
const material_ui_dropzone_1 = require("material-ui-dropzone");
const styles_2 = require("@material-ui/core/styles");
const styles = theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    button: {
        margin: theme.spacing(1),
    }
});
// Control preview image size in dropzone
const theme = styles_2.createMuiTheme({
    overrides: {
        MuiDropzonePreviewList: {
            image: {
                width: 600
            }
        },
    }
});
class Page extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.onHandleChange = (e) => {
            const { name, value } = e.target;
            if (name === "mfrKey") {
                this.props.getApiModelsByMfrKey(value);
            }
            let vehicle = this.state.vehicle;
            vehicle[name] = value;
            this.setState({
                vehicle: vehicle
            });
        };
        this.onHandleImage = (file) => {
            if (_.size(file) > 0) {
                this.setState({
                    file: file
                });
            }
        };
        this.onGoBack = () => {
            this.props.onHandleGoBack();
        };
        this.onDelete = (key) => {
            this.props.onHandleDelete(key);
        };
        this.onSubmit = (e) => {
            e.preventDefault();
            const { vehicle, file } = this.state;
            this.props.onHandleSubmit(vehicle, file);
        };
        this.state = {
            vehicle: {
                mfrKey: '',
                modelKey: '',
                year: date_1.currentYear(),
                color: '',
                vin: '',
                plate: '',
                condition: '',
                image: ''
            },
            file: [],
            disabled: false
        };
        this.onHandleChange = this.onHandleChange.bind(this);
        this.onHandleImage = this.onHandleImage.bind(this);
        this.onGoBack = this.onGoBack.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    componentDidMount() {
        this.props.getApiMfrs();
        if (this.props.pageMode === 'view' || this.props.pageMode === 'update') {
            this.setState({
                vehicle: this.props.vehicle,
            });
        }
    }
    /**
     * Render
     *
     * @returns {*}
     */
    render() {
        const { classes, pageMode, manufacturers, models, onHandleGoBack, onHandleDelete } = this.props;
        const yearsList = date_1.getYearsRange(1950);
        const colorsList = list_1.getVehicleColors();
        return (react_1.default.createElement(Grid_1.default, { container: true, spacing: 4 },
            react_1.default.createElement(react_material_ui_form_validator_1.ValidatorForm, { onSubmit: this.onSubmit },
                react_1.default.createElement(Grid_1.default, { item: true, xs: 12 }, pageMode === 'view' ?
                    react_1.default.createElement(material_ui_image_1.default, { src: this.props.vehicle.image_path })
                    :
                        react_1.default.createElement(FormControl_1.default, { margin: "normal", required: true },
                            react_1.default.createElement(styles_2.MuiThemeProvider, { theme: theme },
                                react_1.default.createElement(material_ui_dropzone_1.DropzoneArea, { role: "form", initialFiles: pageMode !== 'add' ? [this.props.vehicle.image_path] : [], filesLimit: 1, showPreviews: true, showPreviewsInDropzone: false, clearOnUnmount: true, onChange: this.onHandleImage })))),
                react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                    react_1.default.createElement(FormControl_1.default, { className: classes.formControl },
                        react_1.default.createElement(react_material_ui_form_validator_1.SelectValidator, { label: "Condition", value: this.state.vehicle.condition, onChange: this.onHandleChange, validators: ["required"], errorMessages: ["This field is required"], inputProps: {
                                name: "condition",
                                id: "condition",
                                readOnly: pageMode === 'view'
                            }, className: classes.selectEmpty },
                            react_1.default.createElement(MenuItem_1.default, { "aria-label": "None", value: "" }),
                            react_1.default.createElement(MenuItem_1.default, { value: "new" }, "New"),
                            react_1.default.createElement(MenuItem_1.default, { value: "used" }, "Used")),
                        react_1.default.createElement(FormHelperText_1.default, null, "Some important helper text"))),
                react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                    react_1.default.createElement(FormControl_1.default, { className: classes.formControl },
                        react_1.default.createElement(react_material_ui_form_validator_1.SelectValidator, { label: "Year", value: this.state.vehicle.year, onChange: this.onHandleChange, className: classes.selectEmpty, validators: ["required"], errorMessages: ["This field is required"], inputProps: {
                                name: "year",
                                id: "year",
                                readOnly: pageMode === 'view'
                            } },
                            react_1.default.createElement(MenuItem_1.default, { "aria-label": "None", value: "" }),
                            yearsList.map((year) => (react_1.default.createElement(MenuItem_1.default, { key: year.value, value: year.value }, year.label)))),
                        react_1.default.createElement(FormHelperText_1.default, null, "Some important helper text"))),
                manufacturers && (react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                    react_1.default.createElement(FormControl_1.default, { className: classes.formControl },
                        react_1.default.createElement(react_material_ui_form_validator_1.SelectValidator, { label: "Manufacturer", value: this.state.vehicle.mfrKey, onChange: this.onHandleChange, className: classes.selectEmpty, validators: ["required"], errorMessages: ["This field is required"], inputProps: {
                                name: "mfrKey",
                                id: "mfrKey",
                                readOnly: pageMode === 'view'
                            } },
                            react_1.default.createElement(MenuItem_1.default, { "aria-label": "None", value: "" }),
                            manufacturers.map((mfr) => (react_1.default.createElement(MenuItem_1.default, { key: mfr.key, value: mfr.key }, utils_1.capitalizeWords(mfr.mfrName))))),
                        react_1.default.createElement(FormHelperText_1.default, null, "Some important helper text")))),
                models && (react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                    react_1.default.createElement(FormControl_1.default, { className: classes.formControl },
                        react_1.default.createElement(react_material_ui_form_validator_1.SelectValidator, { label: "Model", value: this.state.vehicle.modelKey, onChange: this.onHandleChange, className: classes.selectEmpty, validators: ["required"], errorMessages: ["This field is required"], inputProps: {
                                name: "modelKey",
                                id: "modelKey",
                                readOnly: pageMode === 'view'
                            } },
                            react_1.default.createElement(MenuItem_1.default, { "aria-label": "None", value: "" }),
                            models.map((model) => (react_1.default.createElement(MenuItem_1.default, { key: model.key, value: model.key }, utils_1.capitalizeWords(model.model))))),
                        react_1.default.createElement(FormHelperText_1.default, null, "Some important helper text")))),
                react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                    react_1.default.createElement(FormControl_1.default, { className: classes.formControl },
                        react_1.default.createElement(react_material_ui_form_validator_1.SelectValidator, { label: "Color", value: this.state.vehicle.color, className: classes.selectEmpty, validators: ["required"], errorMessages: ["This field is required"], onChange: this.onHandleChange, inputProps: {
                                name: "color",
                                id: "color",
                                readOnly: pageMode === 'view'
                            } },
                            react_1.default.createElement(MenuItem_1.default, { "aria-label": "None", value: "" }),
                            colorsList.map((color) => (react_1.default.createElement(MenuItem_1.default, { key: color.value, value: color.value }, color.label)))),
                        react_1.default.createElement(FormHelperText_1.default, null, "Some important helper text"))),
                react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                    react_1.default.createElement(TextField_1.default, { id: "standard-required", label: "VIN", name: "vin", value: this.state.vehicle.vin, margin: "normal", variant: "outlined", onChange: this.onHandleChange, InputProps: {
                            readOnly: pageMode === 'view'
                        } })),
                react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                    react_1.default.createElement(TextField_1.default, { id: "standard-basic", label: "Plate", name: "plate", value: this.state.vehicle.plate, margin: "normal", variant: "outlined", onChange: this.onHandleChange, InputProps: {
                            readOnly: pageMode === 'view'
                        } })),
                react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                    pageMode !== 'view' &&
                        react_1.default.createElement(Button_1.default, { type: "submit", variant: "contained", color: "default", className: classes.button, startIcon: react_1.default.createElement(Save_1.default, null) }, pageMode === 'add' ? 'Add' : 'Update'),
                    pageMode === 'update' &&
                        react_1.default.createElement(Button_1.default, { type: "button", variant: "contained", color: "default", className: classes.button, startIcon: react_1.default.createElement(Delete_1.default, null), onClick: () => onHandleDelete(this.props.vehicle.key) }, "Delete"),
                    react_1.default.createElement(Button_1.default, { type: "button", variant: "contained", color: "default", className: classes.button, startIcon: react_1.default.createElement(ArrowBack_1.default, null), onClick: () => onHandleDelete }, "Back")))));
    }
}
Page.propTypes = {
    classes: prop_types_1.default.object.isRequired,
};
exports.default = appcontext_1.withContext(react_router_dom_1.withRouter(styles_1.withStyles(styles)(Page)));
//# sourceMappingURL=page.js.map