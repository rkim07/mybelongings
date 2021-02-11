
import { Bmw } from './filters/Bmw';
import { MercedesBenz } from './filters/MercedesBenz';
import { KarmaAutomotiveLlc } from './filters/KarmaAutomotiveLlc';

const classes = {
    Bmw,
    MercedesBenz,
    KarmaAutomotiveLlc
};

/**
 * Factory class to instantiate other filters
 */
export class FilterFactory {
    constructor(className, opts) {
        return new classes[className](opts);
    }
}
