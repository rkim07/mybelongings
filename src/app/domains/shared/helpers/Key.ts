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
