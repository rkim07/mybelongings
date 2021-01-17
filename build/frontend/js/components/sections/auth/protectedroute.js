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
const react_router_dom_1 = require("react-router-dom");
const appcontext_1 = require("../../../appcontext");
function ProtectedRoute(props) {
    const { component: Component } = props, rest = __rest(props, ["component"]);
    return (props.token ?
        react_1.default.createElement(react_router_dom_1.Route, Object.assign({}, rest, { component: Component })) :
        react_1.default.createElement(react_router_dom_1.Redirect, { to: '/login' }));
}
exports.default = appcontext_1.withContext(ProtectedRoute);
//# sourceMappingURL=protectedroute.js.map