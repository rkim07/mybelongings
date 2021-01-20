"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const prop_types_1 = require("prop-types");
const styles_1 = require("@material-ui/core/styles");
const appcontext_1 = require("../../../appcontext");
const Grid_1 = require("@material-ui/core/Grid");
const Card_1 = require("@material-ui/core/Card");
const CardContent_1 = require("@material-ui/core/CardContent");
const CardActions_1 = require("@material-ui/core/CardActions");
const Typography_1 = require("@material-ui/core/Typography");
const Button_1 = require("@material-ui/core/Button");
const IconButton_1 = require("@material-ui/core/IconButton");
const material_ui_image_1 = require("material-ui-image");
const Add_1 = require("@material-ui/icons/Add");
const DirectionsCar_1 = require("@material-ui/icons/DirectionsCar");
const Edit_1 = require("@material-ui/icons/Edit");
const Delete_1 = require("@material-ui/icons/Delete");
const styles = theme => ({
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardContent: {
        flexGrow: 1,
    },
    button: {
        margin: theme.spacing(1),
    }
});
function List(props) {
    const { classes, user, onHandleClick, onHandleDelete, getVehiclesByUserKey } = props;
    const [vehicles, setVehicles] = react_1.useState('');
    react_1.useEffect(() => {
        getVehiclesByUserKey(user.userKey).then(response => {
            setVehicles(response.data.vehicles);
        });
        return () => setVehicles('');
    }, []);
    return (react_1.default.createElement(Grid_1.default, { container: true, spacing: 4 },
        react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
            react_1.default.createElement(Button_1.default, { type: "button", variant: "contained", color: "default", className: classes.button, startIcon: react_1.default.createElement(Add_1.default, null), onClick: () => onHandleClick(null, 'new') }, "Add New")),
        vehicles &&
            vehicles.map((vehicle) => (react_1.default.createElement(Grid_1.default, { item: true, key: vehicle.key, xs: 12, sm: 6, md: 4 },
                react_1.default.createElement(Card_1.default, { className: classes.card },
                    react_1.default.createElement(CardContent_1.default, { className: classes.cardContent },
                        react_1.default.createElement(material_ui_image_1.default, { src: vehicle.image_path }),
                        react_1.default.createElement(Typography_1.default, { gutterBottom: true, variant: "h5", component: "h4" },
                            vehicle.year,
                            " ",
                            vehicle.mfrName,
                            " ",
                            vehicle.model)),
                    react_1.default.createElement(CardActions_1.default, null,
                        react_1.default.createElement(IconButton_1.default, { "aria-label": "view", color: "default", className: classes.button, onClick: () => onHandleClick(vehicle, 'view') },
                            react_1.default.createElement(DirectionsCar_1.default, null)),
                        react_1.default.createElement(IconButton_1.default, { "aria-label": "update", color: "default", className: classes.button, onClick: () => onHandleClick(vehicle, 'update') },
                            react_1.default.createElement(Edit_1.default, null)),
                        react_1.default.createElement(IconButton_1.default, { "aria-label": "delete", color: "default", className: classes.button, onClick: () => onHandleDelete(vehicle.key) },
                            react_1.default.createElement(Delete_1.default, null)))))))));
}
List.propTypes = {
    classes: prop_types_1.default.object.isRequired,
};
exports.default = appcontext_1.withContext(styles_1.withStyles(styles)(List));
//# sourceMappingURL=list.js.map