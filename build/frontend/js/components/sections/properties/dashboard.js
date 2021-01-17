"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const prop_types_1 = require("prop-types");
const list_1 = require("./list");
const view_1 = require("./view");
const Container_1 = require("@material-ui/core/Container");
const styles_1 = require("@material-ui/core/styles");
const appcontext_1 = require("../../../appcontext");
const styles = theme => ({
    root: {
        flexGrow: 1
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    }
});
class Dashboard extends react_1.default.Component {
    /**
     * Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);
        /**
         * Handle buttons click
         * @param property
         * @param mode
         */
        this.onHandleClick = (property, mode) => {
            this.setState({
                mode: mode,
                property: property
            });
        };
        this.state = {
            mode: 'list',
            property: {}
        };
        this.onHandleClick = this.onHandleClick.bind(this);
    }
    /**
     * After component is mounted
     */
    componentDidMount() {
        this.props.getPropertiesByUserKey(this.props.user.userKey);
    }
    /**
     * Render
     *
     * @returns {*}
     */
    render() {
        const { classes } = this.props;
        return (react_1.default.createElement(Container_1.default, { className: classes.cardGrid, maxWidth: "md" }, {
            'list': react_1.default.createElement(list_1.default, { onHandleClick: this.onHandleClick }),
            'view': react_1.default.createElement(view_1.default, { property: this.state.property })
        }[this.state.mode]));
    }
}
Dashboard.propTypes = {
    classes: prop_types_1.default.object.isRequired,
};
exports.default = appcontext_1.withContext(styles_1.withStyles(styles)(Dashboard));
//# sourceMappingURL=dashboard.js.map