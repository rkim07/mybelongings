import * as Url from 'url-parse';

export class TextHelperImpl {

    /**
     * Capitalize each word in sentence
     *
     * @param sentence
     * @returns {*}
     */
    public capitalizeWords(sentence) {
        return sentence.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    }
}

const TextHelper = new TextHelperImpl();

export {
    TextHelper
};
