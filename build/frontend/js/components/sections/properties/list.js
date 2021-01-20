"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const _ = require("lodash");
const prop_types_1 = require("prop-types");
const Grid_1 = require("@material-ui/core/Grid");
const Card_1 = require("@material-ui/core/Card");
const CardContent_1 = require("@material-ui/core/CardContent");
const CardActions_1 = require("@material-ui/core/CardActions");
const Typography_1 = require("@material-ui/core/Typography");
const Button_1 = require("@material-ui/core/Button");
const material_ui_image_1 = require("material-ui-image");
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
    }
};
function List(props) {
    const { classes, properties } = props;
    function handleClick(property) {
        props.onHandleClick(property, 'view');
    }
    return (react_1.default.createElement(Grid_1.default, { container: true, spacing: 4 }, properties &&
        properties.map((property) => (react_1.default.createElement(Grid_1.default, { item: true, key: property.key, xs: 12, sm: 6, md: 4 },
            react_1.default.createElement(Card_1.default, { className: classes.card },
                react_1.default.createElement(CardContent_1.default, { className: classes.cardContent },
                    react_1.default.createElement(material_ui_image_1.default, { src: property.image_path }),
                    react_1.default.createElement(Typography_1.default, { gutterBottom: true, variant: "h5", component: "h4" },
                        _.startCase(property.address.street),
                        " ",
                        react_1.default.createElement("br", null),
                        _.startCase(property.address.city),
                        ", ",
                        property.address.state,
                        ", ",
                        property.address.zip)),
                react_1.default.createElement(CardActions_1.default, null,
                    react_1.default.createElement(Button_1.default, { size: "small", color: "primary", onClick: () => handleClick(property) }, "View"),
                    react_1.default.createElement(Button_1.default, { size: "small", color: "primary" }, "Edit"))))))));
}
List.propTypes = {
    classes: prop_types_1.default.object.isRequired,
};
exports.default = appcontext_1.withContext(styles_1.withStyles(styles)(List));
//# sourceMappingURL=list.js.map