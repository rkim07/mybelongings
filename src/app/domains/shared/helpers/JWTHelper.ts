import * as config from 'config';
import * as jwt from 'jsonwebtoken';
import * as models from '../models/models';

const bluebird = require('bluebird');

const JWT_AUTH_SECRET = config.get('jwt.auth.secret').toString();
const JWT_SERVER_ISSUER = config.get('jwt.server.issuer').toString();
const JWT_SERVER_TOKEN_ACCESS_SECRET = config.get('jwt.server.token.access.secret').toString();
const JWT_SERVER_TOKEN_ACCESS_EXPIRATION = config.get('jwt.server.token.access.expiration');
const JWT_SERVER_TOKEN_REFRESH_SECRET = config.get('jwt.server.token.refresh.secret').toString();
const JWT_SERVER_TOKEN_REFRESH_EXPIRATION = config.get('jwt.server.token.refresh.expiration');

const jwtServerToken = {
    access: {
        secret: JWT_SERVER_TOKEN_ACCESS_SECRET,
        expiration: JWT_SERVER_TOKEN_ACCESS_EXPIRATION
    },
    refresh: {
        secret: JWT_SERVER_TOKEN_REFRESH_SECRET,
        expiration: JWT_SERVER_TOKEN_REFRESH_EXPIRATION
    }
};

enum TokenTypes {
    access,
    refresh
}

class JWTHelperImpl {
    private verify = bluebird.Promise.promisify(jwt.verify);

    /**
     * Provide just the payload in case of creating new BoB token
     *
     * @param payload
     * @param tokenType
     * @param secretOrPublicKey
     * @param opts
     */
    public signToken = (payload: string | Buffer | object, tokenType?: string, secretOrPublicKey?: jwt.Secret, opts?: jwt.SignOptions) => {
        // Default
        if (!tokenType) {
            tokenType = 'access';
        }

        return jwt.sign(
            payload,
            secretOrPublicKey || Buffer.from(jwtServerToken[tokenType].secret, 'base64'),
            {
                issuer: JWT_SERVER_ISSUER,
                expiresIn: jwtServerToken[tokenType].expiration,
                jwtid: models.Key.generate().toString()
            }
        );
    }

    /**
     * Decide if server secret or authSecret has to be used
     *
     * @param token
     * @param tokenType
     */
    public verifyToken = (token: string, tokenType?: string) => {
        // Default
        if (!tokenType) {
            tokenType = 'access';
        }

        const decodedToken = jwt.decode(token);
        let secret: Buffer = Buffer.from(JWT_AUTH_SECRET, 'base64');

        // Type cast to any because JWT will return wrong type
        if ((decodedToken as any).iss === JWT_SERVER_ISSUER) {
            secret = Buffer.from(jwtServerToken[tokenType].secret, 'base64');
        }
        
        return this.verify(token, secret);
    }
}

const JWTHelper = new JWTHelperImpl();

export {
  JWTHelper
};
