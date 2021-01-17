"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const prop_types_1 = require("prop-types");
const Grid_1 = require("@material-ui/core/Grid");
const Paper_1 = require("@material-ui/core/Paper");
const Typography_1 = require("@material-ui/core/Typography");
const styles_1 = require("@material-ui/core/styles");
const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block',
        margin: theme.spacing(3),
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    }
});
function Landing(props) {
    const { classes } = props;
    return (react_1.default.createElement("main", { className: classes.main },
        react_1.default.createElement(Grid_1.default, { container: true, justify: 'center' },
            react_1.default.createElement(Grid_1.default, { item: true },
                react_1.default.createElement(Paper_1.default, { className: classes.paper, elevation: 1 },
                    react_1.default.createElement(Typography_1.default, { variant: 'h5', component: 'h3' }, "My Belongings"))))));
}
Landing.propTypes = {
    classes: prop_types_1.default.object.isRequired,
};
exports.default = styles_1.withStyles(styles)(Landing);
//# sourceMappingURL=landing.js.map