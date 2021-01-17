"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./domains/User"), exports);
__exportStar(require("./domains/Property"), exports);
__exportStar(require("./domains/Vehicle"), exports);
__exportStar(require("./domains/Address"), exports);
__exportStar(require("./domains/Store"), exports);
__exportStar(require("./domains/Paint"), exports);
__exportStar(require("./utilities/Datetime"), exports);
__exportStar(require("./utilities/Key"), exports);
__exportStar(require("./utilities/HandleUpstreamError"), exports);
__exportStar(require("./utilities/ResponseError"), exports);
__exportStar(require("./utilities/CustomError"), exports);
/**
 * @swagger
 * definitions:
 *
 *   Key:
 *     type: string
 *     pattern: "^[A-Za-z0-9_-]*$"
 *     uniqueItems: true
 *     description: Unique GUID indentifier
 *     minLength: 1
 *
 *   Datetime:
 *     description: 'Datetime as ISO 8601 including Date, Time and Timezone offset. Format:
 *       ''yyyy-mm-ddThh:mm:ss.SS(+/-)hh:mm''. E.g: ''2017-05-30T23:59:59.00+00:00'' where
 *       ''+00:00'' is for UTC'
 *     type: string
 *     format: datetime
 *     pattern: "^[1-9][0-9]{3}-[0-1][0-9]-[0-3][0-9]T[0-2][0-9]:[0-5][0-9]:[0-5][0-9].[0-5][0-9][+-][0-2][0-9]:[0-5][0-9]$"
 *     example: '2017-05-30T23:59:59.00+00:00'
 *
 *   ResponseError:
 *     type: object
 *     properties:
 *       statusCode:
 *         type: number
 *       errorCode:
 *         type: string
 *       message:
 *         type: string
 *     additionalProperties: false
 *     required:
 *       - statusCode
 *       - errorCode
 *       - message
 *
 *   User:
 *     type: object
 *     properties:
 *       key:
 *         $ref: "#/definitions/Key"
 *       firstName:
 *         type: string
 *         minLength: 1
 *       lastName:
 *         type: string
 *         minLength: 1
 *       email:
 *         type: string
 *         minLength: 1
 *       username:
 *         type: string
 *         minLength: 1
 *       password:
 *         type: string
 *         minLength: 1
 *
 *       created:
 *         description: Date/time when user entry was created.
 *         allOf:
 *           - $ref: "#/definitions/Datetime"
 *       modified:
 *         description: Date/time when user entry was modified.
 *         allOf:
 *           - $ref: "#/definitions/Datetime"
 *     additionalProperties: false
 *     required:
 *       - firstName
 *       - lastName
 *       - email
 *       - username
 *
 *   Vehicle:
 *     type: object
 *     properties:
 *       key:
 *         $ref: "#/definitions/Key"
 *       userKey:
 *         $ref: "#/definitions/Key"
 *       mfrKey:
 *         $ref: "#/definitions/Key"
 *       modelKey:
 *         $ref: "#/definitions/Key"
 *       image:
 *         type: string
 *       year:
 *         type: number
 *       color:
 *         type: string
 *       vin:
 *         type: string
 *       plate:
 *         type: string
 *       condition:
 *         type: string
 *       created:
 *         description: Date/time when vehicle was created.
 *         allOf:
 *           - $ref: "#/definitions/Datetime"
 *       modified:
 *         description: Date/time when vehicle was modified.
 *         allOf:
 *           - $ref: "#/definitions/Datetime"
 *     additionalProperties: false
 *     required:
 *       - mfrKey
 *       - modelKey
 *       - year
 *       - color
 *       - vin
 *       - plate
 *       - condition
 *
 *   Property:
 *     type: object
 *     properties:
 *       key:
 *         $ref: "#/definitions/Key"
 *       userKey:
 *         $ref: "#/definitions/Key"
 *       addressKey:
 *         $ref: "#/definitions/Key"
 *       image:
 *         type: string
 *       year:
 *         type: number
 *       type:
 *         type: string
 *         minLength: 1
 *       style:
 *         type: string
 *         minLength: 1
 *       bedrooms:
 *         type: number
 *         minLength: 1
 *       bathrooms:
 *         type: number
 *         minLength: 1
 *       stories:
 *         type: number
 *         minLength: 1
 *       garage:
 *         type: string
 *         minLength: 1
 *       parkingSpaces:
 *         type: number
 *         minLength: 1
 *       basement:
 *         type: string
 *         minLength: 1
 *       features:
 *         type: string
 *       sqFt:
 *         type: string
 *         minLength: 1
 *       lotSize:
 *         type: string
 *       apn:
 *         type: string
 *       subdivision:
 *         type: string
 *       created:
 *         description: Date/time when property entry was created.
 *         allOf:
 *           - $ref: "#/definitions/Datetime"
 *       modified:
 *         description: Date/time when property entry was modified.
 *         allOf:
 *           - $ref: "#/definitions/Datetime"
 *     additionalProperties: false
 *     required:
 *       - userKey
 *       - addressKey
 *       - year
 *       - type
 *       - stories
 *       - bedrooms
 *       - bathrooms
 *       - garage
 *       - sqFt
 *
 *   PropertyArea:
 *     type: object
 *     properties:
 *       key:
 *         $ref: "#/definitions/Key"
 *       propertyKey:
 *         $ref: "#/definitions/Key"
 *       paintKey:
 *         $ref: "#/definitions/Key"
 *       image:
 *         type: string
 *       name:
 *         type: string
 *       location:
 *         type: string
 *       notes:
 *         type: string
 *       painted:
 *         type: string
 *       created:
 *         description: Date/time when property paint was created.
 *         allOf:
 *           - $ref: "#/definitions/Datetime"
 *       modified:
 *         description: Date/time when property paint entry was modified.
 *         allOf:
 *           - $ref: "#/definitions/Datetime"
 *
 *   Paint:
 *     type: object
 *     properties:
 *       key:
 *         $ref: "#/definitions/Key"
 *       storeKey:
 *         $ref: "#/definitions/Key"
 *       image:
 *         type: string
 *       name:
 *         type: string
 *         minLength: 1
 *       number:
 *         type: string
 *         minLength: 1
 *       color:
 *         type: string
 *       hex:
 *         type: string
 *       rgb:
 *         type: string
 *       lrv:
 *         type: string
 *       barcode:
 *         type: string
 *       usage:
 *         type: string
 *       notes:
 *         type: string
 *       created:
 *         description: Date/time when paint entry was created.
 *         allOf:
 *           - $ref: "#/definitions/Datetime"
 *       modified:
 *         description: Date/time when paint entry was modified.
 *         allOf:
 *           - $ref: "#/definitions/Datetime"
 *
 *   Store:
 *     type: object
 *     properties:
 *       key:
 *         $ref: "#/definitions/Key"
 *       addressKey:
 *         $ref: "#/definitions/Key"
 *       name:
 *         type: string
 *         minLength: 1
 *       phone:
 *         type: string
 *         minLength: 1
 *       email:
 *         type: string
 *       website:
 *         type: string
 *       salesPerson:
 *         type: string
 *       notes:
 *         type: string
 *       created:
 *         description: Date/time when paint entry was created.
 *         allOf:
 *           - $ref: "#/definitions/Datetime"
 *       modified:
 *         description: Date/time when paint entry was modified.
 *         allOf:
 *           - $ref: "#/definitions/Datetime"
 *
 *   Address:
 *     type: object
 *     properties:
 *       key:
 *         $ref: "#/definitions/Key"
 *       street:
 *         type: string
 *         minLength: 1
 *       city:
 *         type: string
 *         minLength: 1
 *       state:
 *         type: string
 *         minLength: 1
 *       zip:
 *         type: string
 *         minLength: 1
 *       county:
 *         type: string
 *       country:
 *         type: string
 *         minLength: 1
 *       type:
 *         type: string
 *         minLength: 1
 *       created:
 *         description: Date/time when address entry was created.
 *         allOf:
 *           - $ref: "#/definitions/Datetime"
 *       modified:
 *         description: Date/time when address entry was modified.
 *         allOf:
 *           - $ref: "#/definitions/Datetime"
 *     additionalProperties: false
 *     required:
 *       - street
 *       - city
 *       - zip
 *       - country
 *       - type
 */
//# sourceMappingURL=models.js.map