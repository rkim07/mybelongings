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
const paintdetailsdialog_1 = require("./paintdetailsdialog");
const Grid_1 = require("@material-ui/core/Grid");
const AppBar_1 = require("@material-ui/core/AppBar");
const Tabs_1 = require("@material-ui/core/Tabs");
const Tab_1 = require("@material-ui/core/Tab");
const Box_1 = require("@material-ui/core/Box");
const Table_1 = require("@material-ui/core/Table");
const TableBody_1 = require("@material-ui/core/TableBody");
const TableCell_1 = require("@material-ui/core/TableCell");
const TableContainer_1 = require("@material-ui/core/TableContainer");
const TableRow_1 = require("@material-ui/core/TableRow");
const Typography_1 = require("@material-ui/core/Typography");
const Link_1 = require("@material-ui/core/Link");
const styles_1 = require("@material-ui/core/styles");
const appcontext_1 = require("../../../appcontext");
function TabPanel(props) {
    const { children, value, index } = props, other = __rest(props, ["children", "value", "index"]);
    return (react_1.default.createElement("div", Object.assign({ role: "tabpanel", hidden: value !== index, id: `scrollable-auto-tabpanel-${index}`, "aria-labelledby": `scrollable-auto-tab-${index}` }, other), value === index && (react_1.default.createElement(Box_1.default, { p: 3 },
        react_1.default.createElement(Typography_1.default, null, children)))));
}
TabPanel.propTypes = {
    children: prop_types_1.default.node,
    index: prop_types_1.default.any.isRequired,
    value: prop_types_1.default.any.isRequired,
};
function tabAttrs(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}
const styles = (theme) => ({});
class Areas extends react_1.default.Component {
    /**
     * Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);
        /**
         * When tabs are changed
         *
         * @param event
         * @param newValue
         */
        this.onHandleChange = (event, newValue) => {
            this.setState({
                value: newValue
            });
        };
        this.onHandleClickOpen = () => {
            this.setState({
                open: true
            });
        };
        this.onHandleClose = () => {
            this.setState({
                open: false
            });
        };
        this.state = {
            value: 0,
            open: false
        };
        this.onHandleChange = this.onHandleChange.bind(this);
        this.onHandleClickOpen = this.onHandleClickOpen.bind(this);
        this.onHandleClose = this.onHandleClose.bind(this);
    }
    render() {
        const { classes, areas } = this.props;
        const tabLabels = [];
        const tabPanels = [];
        areas.map((area, index) => {
            tabLabels.push(react_1.default.createElement(Tab_1.default, Object.assign({ key: index, label: area.name }, tabAttrs(index))));
            tabPanels.push(react_1.default.createElement(TabPanel, { key: index, value: this.state.value, index: index },
                react_1.default.createElement(TableContainer_1.default, null,
                    react_1.default.createElement(Table_1.default, { className: classes.table, "aria-label": "custom table" },
                        react_1.default.createElement(TableBody_1.default, null,
                            react_1.default.createElement(TableRow_1.default, { key: "square_footage" },
                                react_1.default.createElement(TableCell_1.default, { component: "th", scope: "row" }, "Size"),
                                react_1.default.createElement(TableCell_1.default, { style: { width: 80 }, align: "right" },
                                    area.sqFt,
                                    " sq ft")),
                            react_1.default.createElement(TableRow_1.default, { key: "location" },
                                react_1.default.createElement(TableCell_1.default, { component: "th", scope: "row" }, "Location"),
                                react_1.default.createElement(TableCell_1.default, { style: { width: 80 }, align: "right" },
                                    area.location,
                                    " floor")),
                            react_1.default.createElement(TableRow_1.default, { key: "painted" },
                                react_1.default.createElement(TableCell_1.default, { component: "th", scope: "row" }, "Painted"),
                                react_1.default.createElement(TableCell_1.default, { style: { width: 80 }, align: "right" }, area.painted)),
                            react_1.default.createElement(TableRow_1.default, { key: "paint" },
                                react_1.default.createElement(TableCell_1.default, { component: "th", scope: "row" }, "Paint"),
                                react_1.default.createElement(TableCell_1.default, { style: { width: 80 }, align: "right" },
                                    react_1.default.createElement(Link_1.default, { component: "button", variant: "body2", onClick: this.onHandleClickOpen }, "Details"),
                                    react_1.default.createElement(paintdetailsdialog_1.default, { areaName: area.name, paint: area.paint, open: this.state.open, onHandleClose: this.onHandleClose }))))))));
        });
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                react_1.default.createElement(Typography_1.default, { variant: "h6", gutterBottom: true }, "Areas")),
            react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                react_1.default.createElement(AppBar_1.default, { position: "static", color: "default" },
                    react_1.default.createElement(Tabs_1.default, { value: this.state.value, onChange: this.onHandleChange, indicatorColor: "primary", textColor: "primary", variant: "scrollable", scrollButtons: "auto", "aria-label": "scrollable auto tabs example" }, tabLabels)),
                tabPanels)));
    }
}
Areas.propTypes = {
    classes: prop_types_1.default.object.isRequired,
};
exports.default = appcontext_1.withContext(styles_1.withStyles(styles)(Areas));
//# sourceMappingURL=areas.js.map