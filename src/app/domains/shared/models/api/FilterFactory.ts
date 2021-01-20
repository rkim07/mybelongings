import { AlfaRomeo } from './filters/AlfaRomeo';
import { AstonMartin } from './filters/AstonMartin';
import { Audi } from './filters/Audi';
import { Bmw } from './filters/Bmw';
import { Cadillac } from './filters/Cadillac';
import { KarmaAutomotiveLlc } from './filters/KarmaAutomotiveLlc';

const classes = {
    AlfaRomeo,
    AstonMartin,
    Audi,
    Bmw,
    Cadillac,
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
