"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsHelper = exports.UtilsHelperImpl = void 0;
const Url = require("url-parse");
class UtilsHelperImpl {
    getImagePath(url, image) {
        const urlObj = new Url(url);
        const origin = urlObj.origin;
        return image ? `${origin}/${image}` : `${origin}/no_pic.png`;
    }
}
exports.UtilsHelperImpl = UtilsHelperImpl;
const UtilsHelper = new UtilsHelperImpl();
exports.UtilsHelper = UtilsHelper;
//# sourceMappingURL=UtilsHelper.js.map