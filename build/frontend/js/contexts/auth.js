"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const axios_1 = require("axios");
// Login user
function login(credentials) {
    return axios_1.default
        .post('/auth-svc/login', credentials)
        .then(response => {
        if (response.status === 201) {
            if (response.data) {
                const { user, token } = response.data;
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("token", token);
                response.redirect = true;
                this.setState({
                    token: token,
                    user: user
                });
                return response;
            }
            else if (response.error) {
                // setNotifierMsg("error", response);
                return response.status;
            }
        }
    })
        .catch((err) => {
        return err;
    });
}
exports.login = login;
// Register user
function register(credentials) {
    return axios_1.default
        .post('/auth-svc/register', credentials)
        .then(response => {
        if (response.status === 201) {
            if (response.data) {
                const { user, token } = response.data;
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("token", token);
                this.setState({
                    user: user
                });
                return response;
            }
            else if (response.error) {
                // setNotifierMsg("error", response);
                return response.status;
            }
        }
    })
        .catch((err) => {
        return err;
    });
}
exports.register = register;
//# sourceMappingURL=auth.js.map