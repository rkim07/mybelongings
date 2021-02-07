export * from './domains/User';
export * from './domains/Property';
export * from './domains/Vehicle';
export * from './domains/Address';
export * from './domains/Store';
export * from './domains/Paint';

export * from './utilities/CustomError';
export * from './utilities/Datetime';
export * from './utilities/HandleUpstreamError';
export * from './utilities/Hash';
export * from './utilities/Key';
export * from './utilities/ResponseError';
export * from './utilities/Text';

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
 *         minLength: 2
 *       lastName:
 *         type: string
 *         minLength: 1
 *       email:
 *         type: string
 *         minLength: 5
 *       username:
 *         type: string
 *         minLength: 1
 *       password:
 *         type: string
 *         minLength: 1
 *       active:
 *         type: number
 *       refreshToken:
 *         type: string
 *       authorities:
 *         type: array
 *         items:
 *           type: string
 *       created:
 *         $ref: "#/definitions/Datetime"
 *       modified:
 *         $ref: "#/definitions/Datetime"
 *
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
 *       style:
 *         type: string
 *       mileage:
 *         type: number
 *       plate:
 *         type: string
 *       condition:
 *         type: string
 *       created:
 *         $ref: "#/definitions/Datetime"
 *       modified:
 *         $ref: "#/definitions/Datetime"
 *     required:
 *       - mfrKey
 *       - modelKey
 *       - year
 *       - color
 *       - style
 *       - vin
 *       - plate
 *       - condition
 *
 *   VehiclePurchase:
 *     type: object
 *     properties:
 *       key:
 *         $ref: "#/definitions/Key"
 *       vehicleKey:
 *         $ref: "#/definitions/Key"
 *       storeKey:
 *         $ref: "#/definitions/Key"
 *       odometer:
 *         type: number
 *       deposit:
 *         type: number
 *       downPayment:
 *         type: number
 *       msrpPrice:
 *         type: number
 *       stickerPrice:
 *         type: number
 *       purchasePrice:
 *         type: number
 *       agreement:
 *         type: string
 *       purchaseType:
 *         type: string
 *       purchaseDate:
 *         $ref: "#/definitions/Datetime"
 *       created:
 *         $ref: "#/definitions/Datetime"
 *       modified:
 *         $ref: "#/definitions/Datetime"
 *     required:
 *       - vehicleKey
 *       - odometer
 *       - msrpPrice
 *       - purchasePrice
 *       - agreement
 *       - purchaseType
 *       - purchaseDate
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
 *         $ref: "#/definitions/Datetime"
 *       modified:
 *         $ref: "#/definitions/Datetime"
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
 *         $ref: "#/definitions/Datetime"
 *       modified:
 *         $ref: "#/definitions/Datetime"
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
 *         $ref: "#/definitions/Datetime"
 *       modified:
 *         $ref: "#/definitions/Datetime"
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
 *         $ref: "#/definitions/Datetime"
 *       modified:
 *         $ref: "#/definitions/Datetime"
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
 *         $ref: "#/definitions/Datetime"
 *       modified:
 *         $ref: "#/definitions/Datetime"
 *     required:
 *       - street
 *       - city
 *       - zip
 *       - country
 *       - type
 *
 *   Email:
 *     type: object
 *     properties:
 *       firstName:
 *         type: string
 *         minLength: 2
 *       email:
 *         type: string
 *         minLength: 1
 *       type:
 *         type: string
 *         minLength: 1
 *       content:
 *         type: string
 *
 *     required:
 *       - firstName
 *       - email
 *       - type
 *       - content
 */
