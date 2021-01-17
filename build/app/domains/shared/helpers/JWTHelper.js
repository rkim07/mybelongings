"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTHelper = void 0;
const config = require("config");
const jwt = require("jsonwebtoken");
const models = require("../models/models");
const bluebird = require('bluebird');
// Helper class for signing and verifying tokens
class JWTHelperImpl {
    constructor() {
        this.verify = bluebird.Promise.promisify(jwt.verify);
        // Provide just the payload in case of creating new BoB token
        this.signToken = (payload, secretOrPublicKey, opts) => {
            return jwt.sign(payload, secretOrPublicKey || Buffer.from(config.get('jwt.server.secret').toString(), 'base64'), {
                issuer: config.get('jwt.server.issuer').toString(),
                expiresIn: config.get('jwt.server.expiration'),
                jwtid: models.Key.generate().toString()
            });
        };
        // Decide if server secret or authSecret has to be used
        this.verifyToken = (token) => {
            const decodedToken = jwt.decode(token);
            let secret = Buffer.from(config.get('jwt.auth.secret').toString(), 'base64');
            // Type cast to any because JWT will return wrong type
            if (decodedToken.iss === config.get('jwt.server.issuer')) {
                secret = Buffer.from(config.get('jwt.server.secret').toString(), 'base64');
            }
            return this.verify(token, secret);
        };
    }
}
const JWTHelper = new JWTHelperImpl();
exports.JWTHelper = JWTHelper;
//# sourceMappingURL=JWTHelper.js.map