import * as config from 'config';
import * as jwt from 'jsonwebtoken';
import * as models from '../models/models';

const bluebird = require('bluebird');

// Helper class for signing and verifying tokens
class JWTHelperImpl {
    private verify = bluebird.Promise.promisify(jwt.verify);

    // Provide just the payload in case of creating new BoB token
    public signToken = (payload: string | Buffer | object, secretOrPublicKey?: jwt.Secret, opts?: jwt.SignOptions) => {
        return jwt.sign(
            payload,
            secretOrPublicKey || Buffer.from(config.get('jwt.server.secret').toString(), 'base64'),
            {
                issuer: config.get('jwt.server.issuer').toString(),
                expiresIn: config.get('jwt.server.expiration'),
                jwtid: models.Key.generate().toString()
            }
        );
    }

    // Decide if server secret or authSecret has to be used
    public verifyToken = (token) => {
        const decodedToken = jwt.decode(token);
        let secret: Buffer = Buffer.from(config.get('jwt.auth.secret').toString(), 'base64');

        // Type cast to any because JWT will return wrong type
        if ((decodedToken as any).iss === config.get('jwt.server.issuer')) {
            secret = Buffer.from(config.get('jwt.server.secret').toString(), 'base64');
        }
        
        return this.verify(token, secret);
    }
        
}

const JWTHelper = new JWTHelperImpl();

export {
  JWTHelper
};
