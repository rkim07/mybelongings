export class Text {

    /**
     * Capitalize each word in sentence
     *
     * @param sentence
     * @returns {*}
     */
    static capitalizeWords(sentence) {
        return sentence.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    }
}
