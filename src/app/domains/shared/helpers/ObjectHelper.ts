import * as _ from 'lodash';

import { DeviceInfo } from '../interfaces/interfaces';

class ObjectHelperImpl {

  /**
   * Sorts the object's properties and strips any properties that are "private" (property name begins with "intr_")
   * @param input The input object
   * @returns The input object with private properties removed and the properties sorted
   */
  public stripPrivatePropertiesAndSort(input: any): any {
    const clone: any = {};
    Object.keys(input).sort().forEach((key) => {
      if (key && key.indexOf('intr_') != 0) {
        clone[key] = input[key];
      }
    });

    return clone;
  }

  public useragentToDeviceInfo(useragent: ExpressUseragent.UserAgent): DeviceInfo {
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

export {
  ObjectHelper
};
