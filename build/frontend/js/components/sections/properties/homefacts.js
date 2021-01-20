"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const _ = require("lodash");
const prop_types_1 = require("prop-types");
const Grid_1 = require("@material-ui/core/Grid");
const Table_1 = require("@material-ui/core/Table");
const TableBody_1 = require("@material-ui/core/TableBody");
const TableCell_1 = require("@material-ui/core/TableCell");
const TableContainer_1 = require("@material-ui/core/TableContainer");
const TableRow_1 = require("@material-ui/core/TableRow");
const Typography_1 = require("@material-ui/core/Typography");
const styles_1 = require("@material-ui/core/styles");
const appcontext_1 = require("../../../appcontext");
const styles = {};
function HomeFacts(props) {
    const { classes, property } = props;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
            react_1.default.createElement(Typography_1.default, { variant: "h6", gutterBottom: true }, "Home Facts")),
        react_1.default.createElement(Grid_1.default, { item: true, xs: 6 },
            react_1.default.createElement(TableContainer_1.default, null,
                react_1.default.createElement(Table_1.default, { className: classes.table, "aria-label": "custom table" },
                    react_1.default.createElement(TableBody_1.default, null,
                        react_1.default.createElement(TableRow_1.default, { key: "year" },
                            react_1.default.createElement(TableCell_1.default, { component: "th", scope: "row" }, "Year Built"),
                            react_1.default.createElement(TableCell_1.default, { style: { width: 80 }, align: "right" }, property.year)),
                        react_1.default.createElement(TableRow_1.default, { key: "type" },
                            react_1.default.createElement(TableCell_1.default, { component: "th", scope: "row" }, "Type"),
                            react_1.default.createElement(TableCell_1.default, { style: { width: 80 }, align: "right" }, _.startCase(property.type))),
                        react_1.default.createElement(TableRow_1.default, { key: "style" },
                            react_1.default.createElement(TableCell_1.default, { component: "th", scope: "row" }, "Style"),
                            react_1.default.createElement(TableCell_1.default, { style: { width: 80 }, align: "right" }, _.startCase(property.style))),
                        react_1.default.createElement(TableRow_1.default, { key: "sq_ft" },
                            react_1.default.createElement(TableCell_1.default, { component: "th", scope: "row" }, "Sq Ft"),
                            react_1.default.createElement(TableCell_1.default, { style: { width: 80 }, align: "right" }, property.sqFt)),
                        react_1.default.createElement(TableRow_1.default, { key: "lot_size" },
                            react_1.default.createElement(TableCell_1.default, { component: "th", scope: "row" }, "Lot Size"),
                            react_1.default.createElement(TableCell_1.default, { style: { width: 80 }, align: "right" }, property.lotSize)),
                        react_1.default.createElement(TableRow_1.default, { key: "stories" },
                            react_1.default.createElement(TableCell_1.default, { component: "th", scope: "row" }, "Stories"),
                            react_1.default.createElement(TableCell_1.default, { style: { width: 80 }, align: "right" }, property.stories)),
                        react_1.default.createElement(TableRow_1.default, { key: "subdivision" },
                            react_1.default.createElement(TableCell_1.default, { component: "th", scope: "row" }, "Subdivision"),
                            react_1.default.createElement(TableCell_1.default, { style: { width: 80 }, align: "right" }, _.startCase(property.subdivision))))))),
        react_1.default.createElement(Grid_1.default, { item: true, xs: 6 },
            react_1.default.createElement(TableContainer_1.default, null,
                react_1.default.createElement(Table_1.default, { className: classes.table, "aria-label": "custom table" },
                    react_1.default.createElement(TableBody_1.default, null,
                        react_1.default.createElement(TableRow_1.default, { key: "bedrooms" },
                            react_1.default.createElement(TableCell_1.default, { component: "th", scope: "row" }, "Bedrooms"),
                            react_1.default.createElement(TableCell_1.default, { style: { width: 80 }, align: "right" }, property.bedrooms)),
                        react_1.default.createElement(TableRow_1.default, { key: "bathrooms" },
                            react_1.default.createElement(TableCell_1.default, { component: "th", scope: "row" }, "Bathrooms"),
                            react_1.default.createElement(TableCell_1.default, { style: { width: 80 }, align: "right" }, property.bathrooms)),
                        react_1.default.createElement(TableRow_1.default, { key: "basement" },
                            react_1.default.createElement(TableCell_1.default, { component: "th", scope: "row" }, "Basement"),
                            react_1.default.createElement(TableCell_1.default, { style: { width: 80 }, align: "right" }, property.basement)),
                        react_1.default.createElement(TableRow_1.default, { key: "garage" },
                            react_1.default.createElement(TableCell_1.default, { component: "th", scope: "row" }, "Garage"),
                            react_1.default.createElement(TableCell_1.default, { style: { width: 80 }, align: "right" }, property.garage)),
                        react_1.default.createElement(TableRow_1.default, { key: "parking_spaces" },
                            react_1.default.createElement(TableCell_1.default, { component: "th", scope: "row" }, "Parking Spaces"),
                            react_1.default.createElement(TableCell_1.default, { style: { width: 80 }, align: "right" }, property.parkingSpaces)),
                        react_1.default.createElement(TableRow_1.default, { key: "features" },
                            react_1.default.createElement(TableCell_1.default, { component: "th", scope: "row" }, "Features"),
                            react_1.default.createElement(TableCell_1.default, { style: { width: 80 }, align: "right" }, property.features)),
                        react_1.default.createElement(TableRow_1.default, { key: "apn" },
                            react_1.default.createElement(TableCell_1.default, { component: "th", scope: "row" }, "APN"),
                            react_1.default.createElement(TableCell_1.default, { style: { width: 80 }, align: "right" }, property.apn))))))));
}
HomeFacts.propTypes = {
    classes: prop_types_1.default.object.isRequired,
};
exports.default = appcontext_1.withContext(styles_1.withStyles(styles)(HomeFacts));
//# sourceMappingURL=homefacts.js.map