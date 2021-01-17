"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const prop_types_1 = require("prop-types");
const Grid_1 = require("@material-ui/core/Grid");
const styles_1 = require("@material-ui/core/styles");
const appcontext_1 = require("../../../appcontext");
const styles = theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
});
class Add extends react_1.default.Component {
    /**
     * Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.onMfgHandleChange = (property) => {
            this.setState({
                property: property
            });
        };
        this.state = {
            mode: 'add',
            property: {}
        };
        this.onHandleClick = this.onHandleClick.bind(this);
    }
    /**
     * After component is mounted
     */
    componentDidMount() {
        this.props.getApiMfrs();
    }
    /**
     * Render
     *
     * @returns {*}
     */
    render() {
        const { classes, manufacturers } = this.props;
        return (react_1.default.createElement(Grid_1.default, { container: true, spacing: 4 },
            react_1.default.createElement(Grid_1.default, { item: true, xs: 12 })));
    }
}
Add.propTypes = {
    classes: prop_types_1.default.object.isRequired,
};
exports.default = appcontext_1.withContext(styles_1.withStyles(styles)(Add));
//# sourceMappingURL=add.js.map