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
const _ = require("lodash");
const prop_types_1 = require("prop-types");
const Dialog_1 = require("@material-ui/core/Dialog");
const DialogTitle_1 = require("@material-ui/core/DialogTitle");
const DialogContent_1 = require("@material-ui/core/DialogContent");
const IconButton_1 = require("@material-ui/core/IconButton");
const Close_1 = require("@material-ui/icons/Close");
const Card_1 = require("@material-ui/core/Card");
const CardMedia_1 = require("@material-ui/core/CardMedia");
const CardContent_1 = require("@material-ui/core/CardContent");
const Typography_1 = require("@material-ui/core/Typography");
const styles_1 = require("@material-ui/core/styles");
const appcontext_1 = require("../../../appcontext");
const styles = (theme, props) => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    }
});
const DialogTitle = styles_1.withStyles(styles)((props) => {
    const { children, classes, onClose } = props, other = __rest(props, ["children", "classes", "onClose"]);
    return (react_1.default.createElement(DialogTitle_1.default, Object.assign({ disableTypography: true, className: classes.root }, other),
        react_1.default.createElement(Typography_1.default, { variant: "h6" }, children),
        onClose ? (react_1.default.createElement(IconButton_1.default, { "aria-label": "close", className: classes.closeButton, onClick: onClose },
            react_1.default.createElement(Close_1.default, null))) : null));
});
const DialogContent = styles_1.withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(DialogContent_1.default);
function PaintDetailsDialog(props) {
    const { classes, paint, open, onHandleClose, areaName } = props;
    return (react_1.default.createElement(Dialog_1.default, { onClose: onHandleClose, "aria-labelledby": "customized-dialog-title", open: open },
        react_1.default.createElement(DialogTitle, { id: "customized-dialog-title", onClose: onHandleClose },
            _.startCase(areaName),
            " Paint"),
        react_1.default.createElement(DialogContent, { dividers: true },
            react_1.default.createElement(Card_1.default, { className: classes.root },
                react_1.default.createElement(CardMedia_1.default, { component: "img", alt: "Paint Details", height: "140", image: paint.image_path, title: "Paint Details" }),
                react_1.default.createElement(CardContent_1.default, null,
                    react_1.default.createElement(Typography_1.default, { variant: "body2", color: "textSecondary", component: "p" }, _.startCase(paint.name)),
                    react_1.default.createElement(Typography_1.default, { variant: "body2", color: "textSecondary", component: "p" }, _.startCase(paint.usage)),
                    react_1.default.createElement(Typography_1.default, { variant: "body2", color: "textSecondary", component: "p" }, _.startCase(paint.color)),
                    react_1.default.createElement(Typography_1.default, { variant: "body2", color: "textSecondary", component: "p" }, paint.hex),
                    react_1.default.createElement(Typography_1.default, { variant: "body2", color: "textSecondary", component: "p" }, paint.rgb),
                    react_1.default.createElement(Typography_1.default, { variant: "body2", color: "textSecondary", component: "p" }, paint.lrv),
                    react_1.default.createElement(Typography_1.default, { variant: "body2", color: "textSecondary", component: "p" }, paint.barcode),
                    react_1.default.createElement(Typography_1.default, { variant: "body2", color: "textSecondary", component: "p" },
                        "Notes: ",
                        paint.notes))))));
}
PaintDetailsDialog.propTypes = {
    classes: prop_types_1.default.object.isRequired,
};
exports.default = appcontext_1.withContext(styles_1.withStyles(styles)(PaintDetailsDialog));
//# sourceMappingURL=paintdetailsdialog.js.map