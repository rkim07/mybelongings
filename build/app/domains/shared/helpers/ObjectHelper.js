"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectHelper = void 0;
class ObjectHelperImpl {
    /**
     * Sorts the object's properties and strips any properties that are "private" (property name begins with "intr_")
     * @param input The input object
     * @returns The input object with private properties removed and the properties sorted
     */
    stripPrivatePropertiesAndSort(input) {
        const clone = {};
        Object.keys(input).sort().forEach((key) => {
            if (key && key.indexOf('intr_') != 0) {
                clone[key] = input[key];
            }
        });
        return clone;
    }
    useragentToDeviceInfo(useragent) {
        return {
            devicePlatform: useragent.platform,
            mobile: useragent.isMobile,
            tablet: useragent.isTablet,
            normal: !useragent.isMobile && !useragent.isTablet,
            source: useragent.source,
        };
    }
}
const ObjectHelper = new ObjectHelperImpl();
exports.ObjectHelper = ObjectHelper;
//# sourceMappingURL=ObjectHelper.js.map