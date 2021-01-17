"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_1 = require("react-router");
const section_1 = require("./components/structure/default/section");
function App(props) {
    const { classes } = props;
    return (react_1.default.createElement(section_1.default, Object.assign({}, props)));
}
exports.default = react_router_1.withRouter(App);
//# sourceMappingURL=app.js.map