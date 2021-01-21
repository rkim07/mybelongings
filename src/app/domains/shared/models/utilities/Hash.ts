import * as config from 'config';
const bcrypt = require('bcrypt');

const SALT_ROUNDS = config.get('hash.saltRounds').toString();

export class Hash {

    /**
     * Hash text
     *
     * @param text
     */
    static hash(text) {
        return bcrypt.hashSync(text, SALT_ROUNDS);
    }

    /**
     * Compare plain text with hashed text and
     * return true or false
     *
     * @param plainText
     * @param hashedText
     */
    static compare(plainText, hashedText) {
        return bcrypt.compareSync(plainText, hashedText)
    }
}
