"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const prop_types_1 = require("prop-types");
const utils_1 = require("../../../helpers/utils");
const homefacts_1 = require("./homefacts");
const areas_1 = require("./areas");
const Grid_1 = require("@material-ui/core/Grid");
const Card_1 = require("@material-ui/core/Card");
const CardHeader_1 = require("@material-ui/core/CardHeader");
const CardContent_1 = require("@material-ui/core/CardContent");
const Avatar_1 = require("@material-ui/core/Avatar");
const Typography_1 = require("@material-ui/core/Typography");
const styles_1 = require("@material-ui/core/styles");
const appcontext_1 = require("../../../appcontext");
const styles = {
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardContent: {
        flexGrow: 1,
    },
};
function View(props) {
    const { classes, property } = props;
    return (react_1.default.createElement(Grid_1.default, { container: true, spacing: 4 },
        react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
            react_1.default.createElement(Card_1.default, { className: classes.root },
                react_1.default.createElement(CardHeader_1.default, { avatar: react_1.default.createElement(Avatar_1.default, { "aria-label": "property image", src: property.image_path, className: classes.avatar },
                        react_1.default.createElement("br", null)), title: react_1.default.createElement(Typography_1.default, { variant: "h5", component: "h5" },
                        utils_1.capitalizeWords(property.address.street),
                        " ",
                        react_1.default.createElement("br", null),
                        utils_1.capitalizeWords(property.address.city),
                        ", ",
                        property.address.state,
                        ", ",
                        property.address.zip) }),
                react_1.default.createElement(CardContent_1.default, null))),
        react_1.default.createElement(homefacts_1.default, { property: property }),
        react_1.default.createElement(areas_1.default, { areas: property.areas })));
}
View.propTypes = {
    classes: prop_types_1.default.object.isRequired,
};
exports.default = appcontext_1.withContext(styles_1.withStyles(styles)(View));
//# sourceMappingURL=view.js.map