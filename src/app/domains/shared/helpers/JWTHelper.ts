import * as config from 'config';
import * as bluebird from 'bluebird';
import * as jwt from 'jsonwebtoken';
import * as models from '../models/models';

const JWT_AUTH_SECRET = config.get('jwt.auth.secret').toString();
const JWT_SERVER_ISSUER = config.get('jwt.server.issuer').toString();
const JWT_SERVER_SECRET = config.get('jwt.server.secret').toString();
const JWT_SERVER_TOKEN_ACCESS_EXPIRATION = config.get('jwt.server.token.access.expiration');
const JWT_SERVER_TOKEN_REFRESH_EXPIRATION = config.get('jwt.server.token.refresh.expiration');

const jwtServerToken = {
    access: {
        expiration: JWT_SERVER_TOKEN_ACCESS_EXPIRATION
    },
    refresh: {
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
            secretOrPublicKey || Buffer.from(JWT_SERVER_SECRET, 'base64'),
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
     */
    public verifyToken = (token: string) => {
        const decodedToken = jwt.decode(token);
        let secret: Buffer = Buffer.from(JWT_AUTH_SECRET, 'base64');

        // Type cast to any because JWT will return wrong type
        if ((decodedToken as any).iss === JWT_SERVER_ISSUER) {
            secret = Buffer.from(JWT_SERVER_SECRET, 'base64');
        }

        return this.verify(token, secret);
    }
}

const JWTHelper = new JWTHelperImpl();

export {
  JWTHelper
};
