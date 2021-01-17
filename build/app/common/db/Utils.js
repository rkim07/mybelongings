"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyValue = exports.QueryType = exports.createQuery = exports.returnValueBasedOnType = exports.parseColumns = exports.buildQuery = exports.translateQuery = exports.hasQuery = void 0;
const lodash_1 = require("lodash");
const logging_1 = require("../logging");
const { keys } = Object;
/**
 * Checks the existence of a query, by validating the truthiness and length.
 * Examples of a valid query would be
 * `{ $and: [ { status: { $eq: models.Order.StatusEnum.PROCESSING } } ] }`
 * or `{ key: { $eq: record.key }}`.
 * `{}` however would return false
 */
const hasQuery = (query) => query && keys(query).length > 0;
exports.hasQuery = hasQuery;
/**
 * Takes a query object
 * and ensures that the query object is structured correctly
 * for example: `{ status: { $eq: 'OPEN' } }`, would be correct
 * `{ 'property': 'value' }`, would be an invalid query
 */
const queryValid = (query) => {
    const childrenAreObjects = keys(query).map(property => {
        return lodash_1.isObject(query[property]);
    });
    const isValid = childrenAreObjects.every(x => x === true);
    if (!isValid) {
        throw new Error('The query is not structured correctly');
    }
};
/**
 * Takes a query object
 * and transforms it into the object `{ property, operator, value }`
 * for example: `{ status: { $eq: 'OPEN' } }`, would be transformed into:
 * `{ property: 'status', operator: '$eq', value: 'OPEN' }`
 */
const translateSingleQuery = (query) => {
    return keys(query).map(property => {
        const [operator] = keys(query[property]);
        const value = query[property][operator];
        return { property, operator, value };
    });
};
/**
 * Takes a nested query object and extracts the queries nested inside operators
 * for example: `{ $eq: { status: { $eq: 'OPEN' } } }`, would be transformed into:
 * `{ property: 'status', operator: '$eq', value: 'OPEN' }`
 */
const translateNestedQuery = (query) => {
    const [firstKey] = keys(query);
    const nestedQueries = query[firstKey];
    const translated = nestedQueries.map(q => translateQuery(q));
    return lodash_1.flatten(translated);
};
const supportedNestedOperators = ['$and'];
/**
 * Transforms queries from their object form to an array with structured query parts.
 * Example of a query would be { status: { $eq: 'OPEN' } } that transforms to
 * { property: 'created', operator: '$eq', value: 'OPEN' }
 * @param query a valid query object
 */
const translateQuery = (query) => {
    queryValid(query);
    const [operator] = keys(query); // NOTE: for now we only support nested queries with one operator "$and"
    if (supportedNestedOperators.includes(operator)) {
        return translateNestedQuery(query);
    }
    else {
        return translateSingleQuery(query);
    }
};
exports.translateQuery = translateQuery;
/**
 * Given array `["value1","value2"]` this method will return
 * `'value1','value2'`
 * @param s the array to be "stringified"
 */
const stringifyValue = (s) => s.map(x => `'${x}'`).join(',');
exports.stringifyValue = stringifyValue;
const guardDecorateType = (queryPart, columnInfo) => {
    const item = columnInfo.find(x => x.name === queryPart.property);
    if (item) {
        return true;
    }
    else {
        throw new Error(`Could not find schema information for property:${queryPart.property}`);
    }
};
/**
 * Takes a query part
 * and decorates it with the type of the column according to a schema definition,
 * this query part for example: `{ property: 'created', operator: '$eq', value: 'OPEN' }`
 * with this columnInfo: `{ name: 'created', type: 'DATE', shouldParse: false }`,
 * would be decorated to be:
 * `{ property: 'created', operator: '$eq', value: 'OPEN', type: 'DATE' }`
 */
const decorateType = (queryPart, columnInfo) => {
    const { type, hasPersistentColumn } = columnInfo.find(x => x.name === queryPart.property);
    const { operator, value: val } = queryPart;
    const inValQuery = (lodash_1.isArray(val) && operator === '$in') ? stringifyValue(val) : `'${val}'`;
    let queryVal = (operator === '$in') ? ` IN (${inValQuery})` : val;
    if (operator === '$eq') {
        queryVal = ` = '${val}'`;
    }
    if (operator === '$ne') {
        queryVal = ` != '${val}'`;
    }
    return Object.assign(Object.assign({}, queryPart), { type, queryVal, hasPersistentColumn });
};
/**
 * Check the query part for a .
 * in cases where the following query is provided
 * `{
 *      'user.identity': {
 *          $eq: user.identity
 *      }
 * }`
 * this method will be able to identify that 'user.identity'
 * was passed as a property to query against
 * @param qps the query parts to inspect
 */
const queryPartsHasDotNotation = (qps) => {
    return qps.reduce((acc, qp) => qp.property.includes('.') ? true : acc, false);
};
/**
 * Converts a query part that contains . notation into a SQL query.
 * For example `{ 'user.identity': { $eq: 'crew' } };` will be transformed to
 * `COLUMN_GET(COLUMN_GET(dynamic_cols, 'user' AS BINARY), 'identity' as CHAR) = 'crew'`
 * @param qp the query part that contains the property with the .
 */
const convertDotNotationQuery = (qp) => {
    const split = qp.property.split('.');
    const isSupported = (split.length === 2);
    if (isSupported) {
        const [entity, prop] = split;
        return `COLUMN_GET(COLUMN_GET(dynamic_cols, '${entity}' AS BINARY), '${prop}' as CHAR) = '${qp.value}'`;
    }
    else {
        return `>2 DOT NOTATION NOT SUPPORTED`;
    }
};
const buildQueryByColumnType = x => {
    if (x.hasPersistentColumn) {
        return `${x.property}${x.queryVal}`;
    }
    else {
        return `COLUMN_GET(dynamic_cols, '${x.property}' AS ${x.type})${x.queryVal}`;
    }
};
/**
 * Builds a SQL query from the query parts it is provided.
 */
const buildQuery = (parts, columnInfo) => {
    const hasDotNotation = queryPartsHasDotNotation(parts);
    let query;
    if (!hasDotNotation && parts.length === 1) {
        parts.map(x => guardDecorateType(x, columnInfo));
        query = parts
            .map(x => decorateType(x, columnInfo))
            .map(x => buildQueryByColumnType(x));
        query = `WHERE ${query}`;
    }
    if (!hasDotNotation && parts.length > 1) {
        parts.map(x => guardDecorateType(x, columnInfo));
        query = parts
            .map(x => decorateType(x, columnInfo))
            .map(x => buildQueryByColumnType(x))
            .join(' AND ');
        query = `WHERE ${query}`;
    }
    if (hasDotNotation && parts.length === 1) {
        query = parts.map(x => convertDotNotationQuery(x));
        query = `WHERE ${query}`;
    }
    return query;
};
exports.buildQuery = buildQuery;
const parseNestedObject = (nested, keys) => {
    const returnOb = {};
    for (const key in nested) {
        const element = nested[key];
        const value = keys.includes(key) ? JSON.parse(element) : element;
        returnOb[key] = value;
    }
    return returnOb;
};
/**
 * Parses columns where the column schema specifies it to be necessary,
 * this is for properties like arrays that are serialized and deserialized.
 */
const parseColumns = (entity, columnInfo) => {
    return keys(entity).reduce((acc, key) => {
        const column = columnInfo.find(c => c.name === key);
        if (column && column.shouldParse) {
            if (column.keysToParse) {
                acc[key] = parseNestedObject(entity[key], column.keysToParse);
            }
            else {
                try {
                    const toParse = entity[key];
                    acc[key] = JSON.parse(toParse);
                }
                catch (error) {
                    logging_1.logger.error('Failed to parse [' + key + '] on ' + JSON.stringify(entity, null, 2));
                    throw error;
                }
            }
        }
        else {
            if (column && column.type === 'BLOB' && !column.shouldParse && entity[key] === '{}') {
                acc[key] = {};
            }
            else {
                acc[key] = entity[key];
            }
        }
        return acc;
    }, {});
};
exports.parseColumns = parseColumns;
/**
 * Converts certain values into a format required for SQL queries
 */
const returnValueBasedOnType = v => {
    let val = v;
    if (lodash_1.isBoolean(v)) {
        val = v;
    }
    if (lodash_1.isString(v)) {
        val = `'${v}'`;
    }
    if (lodash_1.isNumber(v)) {
        val = v;
    }
    if (lodash_1.isUndefined(v)) {
        val = `'${v}'`;
    }
    return val;
};
exports.returnValueBasedOnType = returnValueBasedOnType;
var QueryType;
(function (QueryType) {
    QueryType[QueryType["INSERT"] = 0] = "INSERT";
    QueryType[QueryType["UPDATE"] = 1] = "UPDATE";
})(QueryType || (QueryType = {}));
exports.QueryType = QueryType;
/**
 * The query builder that provided a record and query type
 * will build the appropriate parts for a query
 */
const createQuery = (record, queryType) => {
    let query = '';
    if (lodash_1.isObject(record)) {
        const objectKeys = keys(record);
        objectKeys.forEach((k, i) => {
            const val = record[k];
            const isLastKey = i + 1 === objectKeys.length;
            const insertComma = isLastKey ? '' : ',';
            if (lodash_1.isArray(val)) {
                const arrayAsString = JSON.stringify(val);
                query = `${query}'${k}', '${arrayAsString}'${insertComma}`;
            }
            else if (lodash_1.isObject(val) && !lodash_1.isFunction(val)) {
                if (keys(val).length === 0) {
                    query = `${query}'${k}', '{}'${insertComma}`;
                    return;
                }
                if (queryType === QueryType.INSERT) {
                    query = `${query}'${k}', COLUMN_CREATE(${createQuery(val, queryType)})${insertComma}`;
                }
                if (queryType === QueryType.UPDATE) {
                    query = `${query}'${k}', COLUMN_ADD(COLUMN_GET(dynamic_cols,'${k}' as BINARY),${createQuery(val, queryType)})${insertComma}`;
                }
            }
            else {
                if (lodash_1.isFunction(val)) {
                }
                else {
                    query = `${query}'${k}',${returnValueBasedOnType(val)}${insertComma}`;
                }
            }
        });
    }
    else {
        throw new Error('Record provided was expected to be an object');
    }
    return query;
};
exports.createQuery = createQuery;
//# sourceMappingURL=Utils.js.map