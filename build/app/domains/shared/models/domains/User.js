"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const Datetime_1 = require("../utilities/Datetime");
const Key_1 = require("../utilities/Key");
const bcrypt = require('bcrypt');
class User {
    /**
     * Constructor
     *
     * @param data
     */
    constructor(data) {
        this.intr_type = User.TypeEnum.User;
        this.key = Key_1.Key.generate();
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.username = data.username;
        this.password = this.encryptPassword(data.password);
        this.modified = this.created = Datetime_1.Datetime.getNow();
    }
    /**
     * Password encryption
     *
     * @param password
     */
    encryptPassword(password) {
        const saltRounds = 10;
        return bcrypt.hashSync(password, saltRounds);
    }
}
exports.User = User;
(function (User) {
    let TypeEnum;
    (function (TypeEnum) {
        TypeEnum[TypeEnum["User"] = 'User'] = "User";
    })(TypeEnum = User.TypeEnum || (User.TypeEnum = {}));
})(User = exports.User || (exports.User = {}));
//# sourceMappingURL=User.js.map