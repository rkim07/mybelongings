import { CommonFilter } from "./CommonFilter";

export class KarmaAutomotiveLlc extends CommonFilter {

    /**
     * Constructor
     */
    constructor() {
        super();
    }

    /**
     * Convert manufacturer's model name for front end
     *
     * @param name
     */
    public formatFrontEndMfrName(name) {
        const parent = super.formatFrontEndMfrName(name);
        return parent.replace(/llc/gi, '').trim();
    }
}
