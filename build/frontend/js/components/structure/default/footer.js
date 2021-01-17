"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const prop_types_1 = require("prop-types");
const Typography_1 = require("@material-ui/core/Typography");
const Grid_1 = require("@material-ui/core/Grid");
const classnames_1 = require("classnames");
const core_1 = require("@material-ui/core");
const styles = theme => ({
    footer: {
        marginTop: theme.spacing(8),
        borderTop: `1px solid ${theme.palette.divider}`,
        padding: `${theme.spacing(6)}px 0`,
    }
});
const footers = [
    {
        title: 'Company',
        description: ['Team', 'History', 'Contact us', 'Locations'],
    },
    {
        title: 'Features',
        description: ['Cool stuff', 'Random feature', 'Team feature', 'Developer stuff', 'Another one'],
    },
    {
        title: 'Resources',
        description: ['Resource', 'Resource name', 'Another resource', 'Final resource'],
    },
    {
        title: 'Legal',
        description: ['Privacy policy', 'Terms of use'],
    },
];
function Footer(props) {
    const { classes } = props;
    return (react_1.default.createElement("footer", { className: classnames_1.default(classes.footer, classes.layout) },
        react_1.default.createElement(Grid_1.default, { container: true, spacing: 2, justify: 'space-evenly' }, footers.map(footer => (react_1.default.createElement(Grid_1.default, { item: true, xs: true, key: footer.title },
            react_1.default.createElement(Typography_1.default, { variant: 'h6', color: 'textPrimary', gutterBottom: true }, footer.title),
            footer.description.map(item => (react_1.default.createElement(Typography_1.default, { key: item, variant: 'subtitle1', color: 'textSecondary' }, item)))))))));
}
Footer.propTypes = {
    classes: prop_types_1.default.object.isRequired,
};
exports.default = core_1.withStyles(styles)(Footer);
//# sourceMappingURL=footer.js.map