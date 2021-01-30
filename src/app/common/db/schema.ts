import { TableSchema } from './Utils';

export const schema: Array<TableSchema> = [
    {
        collectionName: 'User',
        tableName: 'users',
        isBlob: false,
        columns: [
            { name: 'key', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'firstName', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'lastName', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'email', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'username', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'password', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'active', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'resetCode', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'signupCode', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'refreshToken', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'authorities', type: 'CHAR', shouldParse: true, hasPersistentColumn: false },
            { name: 'created', type: 'DATE', shouldParse: false, hasPersistentColumn: false },
            { name: 'modified', type: 'DATE', shouldParse: false, hasPersistentColumn: false }
        ]
    },
    {
        collectionName: 'Address',
        tableName: 'addresses',
        isBlob: false,
        columns: [
            { name: 'key', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'street', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'city', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'state', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'zip', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'county', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'country', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'type', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'created', type: 'DATE', shouldParse: false, hasPersistentColumn: false },
            { name: 'modified', type: 'DATE', shouldParse: false, hasPersistentColumn: false }
        ]
    },
    {
        collectionName: 'Property',
        tableName: 'properties',
        isBlob: false,
        columns: [
            { name: 'key', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'userKey', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'addressKey', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'image', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'year', type: 'INTEGER', shouldParse: false, hasPersistentColumn: false },
            { name: 'type', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'style', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'bedrooms', type: 'INTEGER', shouldParse: false, hasPersistentColumn: false },
            { name: 'bathrooms', type: 'INTEGER', shouldParse: false, hasPersistentColumn: false },
            { name: 'stories', type: 'INTEGER', shouldParse: false, hasPersistentColumn: false },
            { name: 'garage', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'parkingSpaces', type: 'INTEGER', shouldParse: false, hasPersistentColumn: false },
            { name: 'basement', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'features', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'lotSize', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'apn', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'subdivision', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'created', type: 'DATE', shouldParse: false, hasPersistentColumn: false },
            { name: 'modified', type: 'DATE', shouldParse: false, hasPersistentColumn: false }
        ]
    },
    {
        collectionName: 'PropertyArea',
        tableName: 'property_areas',
        isBlob: false,
        columns: [
            { name: 'key', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'propertyKey', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'paintKey', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'image', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'name', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'sqFt', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'location', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'notes', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'painted', type: 'DATE', shouldParse: false, hasPersistentColumn: false },
            { name: 'created', type: 'DATE', shouldParse: false, hasPersistentColumn: false },
            { name: 'modified', type: 'DATE', shouldParse: false, hasPersistentColumn: false }
        ]
    },
    {
        collectionName: 'Paint',
        tableName: 'paints',
        isBlob: false,
        columns: [
            { name: 'key', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'storeKey', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'image', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'name', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'finish', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'number', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'color', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'hex', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'rgb', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'lrv', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'barcode', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'usage', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'notes', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'created', type: 'DATE', shouldParse: false, hasPersistentColumn: false },
            { name: 'modified', type: 'DATE', shouldParse: false, hasPersistentColumn: false }
        ]
    },
    {
        collectionName: 'Store',
        tableName: 'stores',
        isBlob: false,
        columns: [
            { name: 'key', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'addressKey', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'name', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'phone', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'email', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'website', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'salesPerson', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'notes', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'created', type: 'DATE', shouldParse: false, hasPersistentColumn: false },
            { name: 'modified', type: 'DATE', shouldParse: false, hasPersistentColumn: false }
        ]
    },
    {
        collectionName: 'Vehicle',
        tableName: 'vehicles',
        isBlob: false,
        columns: [
            { name: 'key', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'userKey', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'mfrKey', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'modelKey', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'image', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'year', type: 'INTEGER', shouldParse: false, hasPersistentColumn: false },
            { name: 'color', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'vin', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'plate', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'condition', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'created', type: 'DATE', shouldParse: false, hasPersistentColumn: false },
            { name: 'modified', type: 'DATE', shouldParse: false, hasPersistentColumn: false }
        ]
    },
    {
        collectionName: 'NhtsaApiVehicleMfr',
        tableName: 'nhtsaapivehiclemfrs',
        isBlob: false,
        columns: [
            { name: 'key', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'mfrId', type: 'INTEGER', shouldParse: false, hasPersistentColumn: false },
            { name: 'mfrName', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'created', type: 'DATE', shouldParse: false, hasPersistentColumn: false },
            { name: 'modified', type: 'DATE', shouldParse: false, hasPersistentColumn: false }
        ]
    },
    {
        collectionName: 'NhtsaApiVehicleModel',
        tableName: 'nhtsaapivehiclemodels',
        isBlob: false,
        columns: [
            { name: 'key', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'mfrKey', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'modelId', type: 'INTEGER', shouldParse: false, hasPersistentColumn: false },
            { name: 'model', type: 'CHAR', shouldParse: false, hasPersistentColumn: false },
            { name: 'created', type: 'DATE', shouldParse: false, hasPersistentColumn: false },
            { name: 'modified', type: 'DATE', shouldParse: false, hasPersistentColumn: false }
        ]
    }
];
