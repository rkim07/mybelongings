"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const prop_types_1 = require("prop-types");
const styles_1 = require("@material-ui/core/styles");
const appcontext_1 = require("../../../appcontext");
const list_1 = require("../../../utils/list");
const date_1 = require("../../../utils/date");
const Grid_1 = require("@material-ui/core/Grid");
const FormControl_1 = require("@material-ui/core/FormControl");
const FormHelperText_1 = require("@material-ui/core/FormHelperText");
const MenuItem_1 = require("@material-ui/core/MenuItem");
const material_ui_image_1 = require("material-ui-image");
const Button_1 = require("@material-ui/core/Button");
const ArrowBack_1 = require("@material-ui/icons/ArrowBack");
const Save_1 = require("@material-ui/icons/Save");
const Delete_1 = require("@material-ui/icons/Delete");
const react_material_ui_form_validator_1 = require("react-material-ui-form-validator");
const material_ui_dropzone_1 = require("material-ui-dropzone");
const styles_2 = require("@material-ui/core/styles");
const styles = (theme) => ({
    formControl: {
        margin: theme.spacing(1)
    },
    validatorElement: {
        minWidth: 150
    },
    button: {
        margin: theme.spacing(1),
    }
});
// Override style
const theme = styles_2.createMuiTheme({
    overrides: {
        MuiDropzonePreviewList: {
            image: {
                width: 600
            }
        },
        MuiSelect: {
            select: {
                width: 150
            }
        },
        MuiInputBase: {
            input: {
                width: 300
            }
        }
    }
});
function Page(props) {
    const { classes, pageMode, vehicle, onHandleImageChange, onHandleChange, onHandleDelete, onHandleGoBack, onHandleSubmit, getApiMfrs, getApiModelsByMfrKey } = props;
    // Manufacturers use effect
    const [manufacturers, setManufacturers] = react_1.useState('');
    react_1.useEffect(() => {
        getApiMfrs().then(response => {
            setManufacturers(response.data.mfrs);
        });
        return () => setManufacturers('');
    }, []);
    // Models use effect
    const [models, setModels] = react_1.useState('');
    react_1.useEffect(() => {
        if (vehicle.mfrKey) {
            getApiModelsByMfrKey(vehicle.mfrKey).then(response => {
                setModels(response.data.models);
            });
        }
        return () => setModels('');
    }, [vehicle.mfrKey]);
    // Years use effect
    const [years, setYears] = react_1.useState('');
    react_1.useEffect(() => {
        setYears(date_1.getYearsRange(1950, 2022));
        return () => setYears('');
    }, []);
    // Colors use effect
    const [colors, setColors] = react_1.useState('');
    react_1.useEffect(() => {
        setColors(list_1.getVehicleColors());
        return () => setColors('');
    }, []);
    return (react_1.default.createElement(Grid_1.default, { container: true, spacing: 4 },
        react_1.default.createElement(react_material_ui_form_validator_1.ValidatorForm, { onSubmit: (event) => onHandleSubmit(event) },
            react_1.default.createElement(Grid_1.default, { item: true, xs: 12 }, pageMode === 'view' ?
                react_1.default.createElement(material_ui_image_1.default, { src: vehicle.image_path })
                :
                    react_1.default.createElement(FormControl_1.default, { className: classes.formControl, required: true },
                        react_1.default.createElement(styles_2.ThemeProvider, { theme: theme },
                            react_1.default.createElement(material_ui_dropzone_1.DropzoneArea, { role: "form", initialFiles: pageMode !== 'new' ? [vehicle.image_path] : [], filesLimit: 1, showPreviews: false, showPreviewsInDropzone: true, clearOnUnmount: true, onChange: (file) => onHandleImageChange(file) })))),
            react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                react_1.default.createElement(FormControl_1.default, { className: classes.formControl },
                    react_1.default.createElement(styles_2.ThemeProvider, { theme: theme },
                        react_1.default.createElement(react_material_ui_form_validator_1.SelectValidator, { label: "Condition *", value: vehicle.condition, onChange: (event) => onHandleChange(event), inputProps: {
                                name: "condition",
                                id: "condition",
                                readOnly: pageMode === 'view'
                            }, validators: ["required"], errorMessages: ["This field is required"] },
                            react_1.default.createElement(MenuItem_1.default, { "aria-label": "None", value: "" }),
                            react_1.default.createElement(MenuItem_1.default, { value: "new" }, "New"),
                            react_1.default.createElement(MenuItem_1.default, { value: "used" }, "Used")),
                        react_1.default.createElement(FormHelperText_1.default, null, "The condition when the car was purchased")))),
            years && (react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                react_1.default.createElement(FormControl_1.default, { className: classes.formControl },
                    react_1.default.createElement(styles_2.ThemeProvider, { theme: theme },
                        react_1.default.createElement(react_material_ui_form_validator_1.SelectValidator, { label: "Year *", value: vehicle.year, onChange: (event) => onHandleChange(event), inputProps: {
                                name: "year",
                                id: "year",
                                readOnly: pageMode === 'view'
                            }, validators: ["required"], errorMessages: ["This field is required"] },
                            react_1.default.createElement(MenuItem_1.default, { "aria-label": "None", value: "" }),
                            years.map((year) => (react_1.default.createElement(MenuItem_1.default, { key: year.value, value: year.value }, year.label))))),
                    react_1.default.createElement(FormHelperText_1.default, null, "Year that vehicle was made")))),
            manufacturers && (react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                react_1.default.createElement(FormControl_1.default, { className: classes.formControl },
                    react_1.default.createElement(styles_2.ThemeProvider, { theme: theme },
                        react_1.default.createElement(react_material_ui_form_validator_1.SelectValidator, { label: "Manufacturer *", value: vehicle.mfrKey, onChange: (event) => onHandleChange(event), inputProps: {
                                name: "mfrKey",
                                id: "mfrKey",
                                readOnly: pageMode === 'view'
                            }, validators: ["required"], errorMessages: ["This field is required"] },
                            react_1.default.createElement(MenuItem_1.default, { "aria-label": "None", value: "" }),
                            manufacturers.map((mfr) => (react_1.default.createElement(MenuItem_1.default, { key: mfr.key, value: mfr.key }, mfr.mfrName))))),
                    react_1.default.createElement(FormHelperText_1.default, null, "Choose a manufacturer to show all the models below")))),
            models && (react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                react_1.default.createElement(FormControl_1.default, { className: classes.formControl },
                    react_1.default.createElement(styles_2.ThemeProvider, { theme: theme },
                        react_1.default.createElement(react_material_ui_form_validator_1.SelectValidator, { label: "Model *", value: vehicle.modelKey, onChange: (event) => onHandleChange(event), inputProps: {
                                name: "modelKey",
                                id: "modelKey",
                                readOnly: pageMode === 'view'
                            }, validators: ["required"], errorMessages: ["This field is required"] },
                            react_1.default.createElement(MenuItem_1.default, { "aria-label": "None", value: "" }),
                            models.map((model) => (react_1.default.createElement(MenuItem_1.default, { key: model.key, value: model.key }, model.model))))),
                    react_1.default.createElement(FormHelperText_1.default, null, "Models will be changing according to selected manufacturer")))),
            colors && (react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                react_1.default.createElement(FormControl_1.default, { className: classes.formControl },
                    react_1.default.createElement(styles_2.ThemeProvider, { theme: theme },
                        react_1.default.createElement(react_material_ui_form_validator_1.SelectValidator, { label: "Color *", value: vehicle.color, onChange: (event) => onHandleChange(event), inputProps: {
                                name: "color",
                                id: "color",
                                readOnly: pageMode === 'view'
                            }, validators: ["required"], errorMessages: ["This field is required"] },
                            react_1.default.createElement(MenuItem_1.default, { "aria-label": "None", value: "" }),
                            colors.map((color) => (react_1.default.createElement(MenuItem_1.default, { key: color.value, value: color.value }, color.label)))))))),
            react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                react_1.default.createElement(FormControl_1.default, { className: classes.formControl },
                    react_1.default.createElement(react_material_ui_form_validator_1.TextValidator, { label: "VIN *", value: vehicle.vin, onChange: (event) => onHandleChange(event), validators: ["required"], errorMessages: ["This field is required"], inputProps: {
                            name: "vin",
                            id: "vin",
                            readOnly: pageMode === 'view'
                        } }),
                    react_1.default.createElement(FormHelperText_1.default, null, "Vehicle identifier number"))),
            react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                react_1.default.createElement(FormControl_1.default, { className: classes.formControl },
                    react_1.default.createElement(react_material_ui_form_validator_1.TextValidator, { label: "Plate", margin: "normal", value: vehicle.plate, onChange: (event) => onHandleChange(event), inputProps: {
                            name: "plate",
                            id: "plate",
                            readOnly: pageMode === 'view'
                        } }))),
            react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                pageMode !== 'view' &&
                    react_1.default.createElement(Button_1.default, { type: "submit", variant: "contained", color: "default", className: classes.button, startIcon: react_1.default.createElement(Save_1.default, null) }, pageMode === 'new' ? 'New' : 'Update'),
                pageMode === 'update' &&
                    react_1.default.createElement(Button_1.default, { type: "button", variant: "contained", color: "default", className: classes.button, startIcon: react_1.default.createElement(Delete_1.default, null), onClick: (event) => onHandleDelete(vehicle.key) }, "Delete"),
                react_1.default.createElement(Button_1.default, { type: "button", variant: "contained", color: "default", className: classes.button, startIcon: react_1.default.createElement(ArrowBack_1.default, null), onClick: () => onHandleGoBack() }, "Back")))));
}
Page.propTypes = {
    classes: prop_types_1.default.object.isRequired,
};
exports.default = appcontext_1.withContext(styles_1.withStyles(styles)(Page));
//# sourceMappingURL=page.js.map