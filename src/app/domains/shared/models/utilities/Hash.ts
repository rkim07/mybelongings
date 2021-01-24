import * as config from 'config';
const bcrypt = require('bcrypt');

const SALT_ROUNDS = config.get('hash.bcrypt.saltRounds');

export class Hash {

    /**
     * Hash text
     *
     * @param text
     */
    static bcryptHash(text) {
        return bcrypt.hashSync(text, SALT_ROUNDS);
    }

    /**
     * Compare plain text with hashed text and
     * return true or false
     *
     * @param plainText
     * @param hashedText
     */
    static bcryptCompare(plainText, hashedText) {
        return bcrypt.compareSync(plainText, hashedText);
    }
}
