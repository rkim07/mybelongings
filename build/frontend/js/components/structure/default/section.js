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
const react_router_dom_1 = require("react-router-dom");
const landing_1 = require("../../../components/structure/default/landing");
const createlogin_1 = require("../../../components/sections/auth/createlogin");
const login_1 = require("../../../components/sections/auth/login");
const footer_1 = require("../../../components/structure/default/footer");
const profile_1 = require("../../sections/profile");
const dashboard_1 = require("../../sections/properties/dashboard");
const dashboard_2 = require("../../sections/vehicles/dashboard");
const protectedroute_1 = require("../../../components/sections/auth/protectedroute");
const notfound_1 = require("../../../components/structure/notfound");
const AppBar_1 = require("@material-ui/core/AppBar");
const Toolbar_1 = require("@material-ui/core/Toolbar");
const IconButton_1 = require("@material-ui/core/IconButton");
const Typography_1 = require("@material-ui/core/Typography");
const Button_1 = require("@material-ui/core/Button");
const MenuItem_1 = require("@material-ui/core/MenuItem");
const Menu_1 = require("@material-ui/core/Menu");
const AccountCircle_1 = require("@material-ui/icons/AccountCircle");
const MoreVert_1 = require("@material-ui/icons/MoreVert");
const react_router_dom_2 = require("react-router-dom");
const styles_1 = require("@material-ui/core/styles");
const appcontext_1 = require("../../../appcontext");
const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    grow: {
        flexGrow: 1,
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
});
class Section extends react_1.default.Component {
    // Constructor
    constructor(props) {
        super(props);
        this.handleProfileMenuOpen = event => {
            this.setState({
                anchorEl: event.currentTarget
            });
        };
        this.handleMenuClose = () => {
            this.setState({
                anchorEl: null,
                mobileMoreAnchorEl: null
            });
        };
        this.handleMobileMenuOpen = event => {
            this.setState({ mobileMoreAnchorEl: event.currentTarget });
        };
        this.handleMobileMenuClose = () => {
            this.setState({ mobileMoreAnchorEl: null });
        };
        this.state = {
            anchorEl: null,
            mobileMoreAnchorEl: null
        };
    }
    render() {
        const { anchorEl, mobileMoreAnchorEl } = this.state;
        const _a = this.props, { classes } = _a, other = __rest(_a, ["classes"]);
        const isMenuOpen = Boolean(anchorEl);
        const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
        const desktopSection = react_1.default.createElement("div", { className: classes.sectionDesktop }, !this.props.token || !this.props.user ?
            react_1.default.createElement(Button_1.default, { color: 'primary', variant: 'outlined', component: react_router_dom_2.Link, to: '/login' }, "Login")
            :
                react_1.default.createElement("div", null,
                    react_1.default.createElement(Button_1.default, { component: react_router_dom_2.Link, to: '/properties/dashboard' }, "Properties"),
                    react_1.default.createElement(Button_1.default, { component: react_router_dom_2.Link, to: '/vehicles/dashboard' }, "Vehicles"),
                    react_1.default.createElement(IconButton_1.default, { "aria-owns": isMenuOpen ? 'material-appbar' : undefined, "aria-haspopup": 'true', onClick: this.handleProfileMenuOpen, color: 'inherit' },
                        react_1.default.createElement(AccountCircle_1.default, null))));
        const mobileSection = react_1.default.createElement("div", { className: classes.sectionMobile }, !this.props.token ?
            react_1.default.createElement(Button_1.default, { color: 'primary', variant: 'outlined', component: react_router_dom_2.Link, to: '/login' }, "Login")
            :
                react_1.default.createElement(IconButton_1.default, { "aria-haspopup": 'true', onClick: this.handleMobileMenuOpen, color: 'inherit' },
                    react_1.default.createElement(MoreVert_1.default, null)));
        const renderMenu = react_1.default.createElement(Menu_1.default, { anchorEl: anchorEl, anchorOrigin: { vertical: 'top', horizontal: 'right' }, transformOrigin: { vertical: 'top', horizontal: 'right' }, open: isMenuOpen, onClose: this.handleMenuClose },
            react_1.default.createElement(MenuItem_1.default, { onClick: this.handleMenuClose, component: react_router_dom_2.Link, to: '/profile' }, "My Account"),
            react_1.default.createElement(MenuItem_1.default, { onClick: () => {
                    this.handleMenuClose();
                    this.props.logout('user');
                } }, "Logout"));
        const renderMobileMenu = react_1.default.createElement(Menu_1.default, { anchorEl: mobileMoreAnchorEl, anchorOrigin: { vertical: 'top', horizontal: 'right' }, transformOrigin: { vertical: 'top', horizontal: 'right' }, open: isMobileMenuOpen, onClose: this.handleMenuClose },
            react_1.default.createElement(MenuItem_1.default, { onClick: this.handleMobileMenuClose },
                react_1.default.createElement(Button_1.default, { component: react_router_dom_2.Link, to: '/properties/dashboard' }, "Properties")),
            react_1.default.createElement(MenuItem_1.default, { onClick: this.handleMobileMenuClose },
                react_1.default.createElement(Button_1.default, { component: react_router_dom_2.Link, to: '/vehicles/dashboard' }, "Vehicles")),
            react_1.default.createElement(MenuItem_1.default, { onClick: this.handleMobileMenuOpen },
                react_1.default.createElement(IconButton_1.default, { "aria-owns": isMenuOpen ? 'material-appbar' : undefined, "aria-haspopup": 'true', onClick: this.handleProfileMenuOpen, color: 'inherit' },
                    react_1.default.createElement(AccountCircle_1.default, null))));
        return (react_1.default.createElement("div", { className: classes.root },
            react_1.default.createElement(AppBar_1.default, { position: 'static', color: 'default' },
                react_1.default.createElement(Toolbar_1.default, null,
                    react_1.default.createElement(Typography_1.default, { className: classes.title, variant: 'h6', color: 'inherit', noWrap: true }),
                    react_1.default.createElement("div", { className: classes.grow }),
                    desktopSection,
                    mobileSection)),
            renderMenu,
            renderMobileMenu,
            react_1.default.createElement(react_router_dom_1.Switch, null,
                react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: '/', render: (routeProps) => react_1.default.createElement(landing_1.default, Object.assign({}, routeProps)) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: '/login', render: (routeProps) => react_1.default.createElement(login_1.default, Object.assign({}, routeProps, { section: 'user', redirectUrl: '/properties/dashboard' })) }),
                react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: '/registration/email/:token/:email', render: (routeProps) => react_1.default.createElement(createlogin_1.default, Object.assign({}, routeProps, other)) }),
                react_1.default.createElement(protectedroute_1.default, { path: '/profile', component: profile_1.default }),
                react_1.default.createElement(protectedroute_1.default, { path: '/properties', component: dashboard_1.default }),
                react_1.default.createElement(protectedroute_1.default, { path: '/vehicles', component: dashboard_2.default }),
                react_1.default.createElement(react_router_dom_1.Route, { path: '*', component: notfound_1.default })),
            react_1.default.createElement(footer_1.default, null)));
    }
}
Section.propTypes = {
    classes: prop_types_1.default.object.isRequired,
};
exports.default = appcontext_1.withContext(styles_1.withStyles(styles)(Section));
//# sourceMappingURL=section.js.map