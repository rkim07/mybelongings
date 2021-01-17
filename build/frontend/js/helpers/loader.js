"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const styles_1 = require("@material-ui/core/styles");
const CircularProgress_1 = require("@material-ui/core/CircularProgress");
const useStyles = styles_1.makeStyles(theme => ({
    progress: {
        margin: theme.spacing(2),
    },
}));
function Loader(props) {
    const classes = useStyles();
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(CircularProgress_1.default, { className: classes.progress })));
}
exports.default = Loader;
//# sourceMappingURL=loader.js.map