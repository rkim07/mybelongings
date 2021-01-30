import * as uuidv4 from 'uuid/v4';

/**
 * Unique GUID indentifier
 * @author Swagger/James Gibbs
 */
export class Key {
    /**
     * Returns a 32-character guid
     * @return {string}
     */
    static generate(): Key {
        return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}



/**
 * Unique GUID indentifier
 */
export class Code {
    /**
     * Returns a 32-character guid
     * @return {string}
     */
    static generate(): string {
        return uuidv4();
    }
}
