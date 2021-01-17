"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const prop_types_1 = require("prop-types");
const classnames_1 = require("classnames");
const CheckCircle_1 = require("@material-ui/icons/CheckCircle");
const Error_1 = require("@material-ui/icons/Error");
const Info_1 = require("@material-ui/icons/Info");
const Close_1 = require("@material-ui/icons/Close");
const green_1 = require("@material-ui/core/colors/green");
const amber_1 = require("@material-ui/core/colors/amber");
const IconButton_1 = require("@material-ui/core/IconButton");
const SnackbarContent_1 = require("@material-ui/core/SnackbarContent");
const Warning_1 = require("@material-ui/icons/Warning");
const styles_1 = require("@material-ui/core/styles");
const variantIcon = {
    success: CheckCircle_1.default,
    warning: Warning_1.default,
    error: Error_1.default,
    info: Info_1.default
};
const styles = theme => ({
    success: {
        backgroundColor: green_1.default[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.dark,
    },
    warning: {
        backgroundColor: amber_1.default[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
});
function Content(props) {
    const { classes, className, message, onClose, variant } = props, other = __rest(props, ["classes", "className", "message", "onClose", "variant"]);
    const Icon = variantIcon[variant];
    return (react_1.default.createElement(SnackbarContent_1.default, Object.assign({ className: classnames_1.default(classes[variant], className), "aria-describedby": 'client-snackbar', message: react_1.default.createElement("span", { id: 'client-snackbar', className: classes.message },
            react_1.default.createElement(Icon, { className: classnames_1.default(classes.icon, classes.iconVariant) }),
            message), action: [
            react_1.default.createElement(IconButton_1.default, { key: 'close', "aria-label": 'Close', color: 'inherit', className: classes.close, onClick: onClose },
                react_1.default.createElement(Close_1.default, { className: classes.icon })),
        ] }, other)));
}
Content.propTypes = {
    classes: prop_types_1.default.object.isRequired,
    className: prop_types_1.default.string,
    message: prop_types_1.default.node,
    onClose: prop_types_1.default.func,
    variant: prop_types_1.default.oneOf(['success', 'warning', 'error', 'info', '']).isRequired,
};
exports.default = styles_1.withStyles(styles)(Content);
//# sourceMappingURL=content.js.map