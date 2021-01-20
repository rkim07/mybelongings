import { CommonFilter } from "./CommonFilter";

export class KarmaAutomotiveLlc extends CommonFilter {

    /**
     * Constructor
     */
    constructor() {
        super();
    }

    /**
     * Extra validate by calling parent method
     *
     * @param name
     */
    public formatFrontEndMfrName(name) {
        const parent = super.formatFrontEndMfrName(name);
        return parent.replace(/llc/gi, '').trim();
    }
}
