import { flatten, isArray, isBoolean, isFunction, isNumber, isObject, isString, isUndefined } from 'lodash';
import { logger } from '../logging';

const { keys } = Object;

interface ColumnSchema {
    name: string;
    type: string;
    shouldParse: boolean;
    hasPersistentColumn: boolean;
    keysToParse?: Array<string>;
}

interface TableSchema {
    collectionName: string;
    tableName: string;
    isBlob: boolean;
    columns: Array<ColumnSchema>;
}

interface QueryPart {
    property: string;
    operator: string;
    value: any;
}

/**
 * Checks the existence of a query, by validating the truthiness and length.
 * Examples of a valid query would be
 * `{ $and: [ { status: { $eq: models.Order.StatusEnum.PROCESSING } } ] }`
 * or `{ key: { $eq: record.key }}`.
 * `{}` however would return false
 */
const hasQuery = (query: object) => query && keys(query).length > 0;

/**
 * Takes a query object
 * and ensures that the query object is structured correctly
 * for example: `{ status: { $eq: 'OPEN' } }`, would be correct
 * `{ 'property': 'value' }`, would be an invalid query
 */
const queryValid = (query: object): void => {
    const childrenAreObjects = keys(query).map(property => {
        return isObject(query[property]);
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
const translateSingleQuery = (query: object): Array<QueryPart> => {
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
const translateNestedQuery = (query: object): Array<QueryPart> => {
    const [ firstKey ] = keys(query);
    const nestedQueries = query[firstKey];
    const translated = nestedQueries.map(q => translateQuery(q));
    return flatten(translated);
};

const supportedNestedOperators: Array<string> = [ '$and' ];

/**
 * Transforms queries from their object form to an array with structured query parts.
 * Example of a query would be { status: { $eq: 'OPEN' } } that transforms to
 * { property: 'created', operator: '$eq', value: 'OPEN' }
 * @param query a valid query object
 */
const translateQuery = (query: object): Array<QueryPart> => {
    queryValid(query);
    const [ operator ] = keys(query); // NOTE: for now we only support nested queries with one operator "$and"
    if (supportedNestedOperators.includes(operator)) {
        return translateNestedQuery(query);
    } else {
        return translateSingleQuery(query);
    }
};

/**
 * Given array `["value1","value2"]` this method will return
 * `'value1','value2'`
 * @param s the array to be "stringified"
 */
const stringifyValue = (s: Array<any>) => s.map(x => `'${x}'`).join(',');

const guardDecorateType = (queryPart: QueryPart, columnInfo: Array<ColumnSchema>) => {
    const item = columnInfo.find(x => x.name === queryPart.property);
    if (item) {
        return true;
    } else {
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
const decorateType = (queryPart: QueryPart, columnInfo: Array<ColumnSchema>) => {
    const { type, hasPersistentColumn } = columnInfo.find(x => x.name === queryPart.property);
    const { operator, value: val } = queryPart;
    const inValQuery = (isArray(val) && operator === '$in') ? stringifyValue(val) : `'${val}'`;
    let queryVal = (operator === '$in') ? ` IN (${inValQuery})` : val;
    if (operator === '$eq') {
        queryVal = ` = '${val}'`;
    }
    if (operator === '$ne') {
        queryVal = ` != '${val}'`;
    }
    return { ...queryPart, type, queryVal, hasPersistentColumn };
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
const queryPartsHasDotNotation = (qps: Array<QueryPart>): boolean => {
    return qps.reduce((acc, qp) => qp.property.includes('.') ? true : acc, false);
};

/**
 * Converts a query part that contains . notation into a SQL query.
 * For example `{ 'user.identity': { $eq: 'something' } };` will be transformed to
 * `COLUMN_GET(COLUMN_GET(dynamic_cols, 'user' AS BINARY), 'identity' as CHAR) = 'something'`
 * @param qp the query part that contains the property with the .
 */
const convertDotNotationQuery = (qp: QueryPart): string => {
    const split = qp.property.split('.');
    const isSupported = (split.length === 2);
    if (isSupported) {
        const [ entity, prop ] = split;
        return `COLUMN_GET(COLUMN_GET(dynamic_cols, '${entity}' AS BINARY), '${prop}' as CHAR) = '${qp.value}'`;
    } else {
        return `>2 DOT NOTATION NOT SUPPORTED`;
    }
};

const buildQueryByColumnType = x => {
    if (x.hasPersistentColumn) {
        return `${x.property}${x.queryVal}`;
    } else {
        return `COLUMN_GET(dynamic_cols, '${x.property}' AS ${x.type})${x.queryVal}`;
    }
};

/**
 * Builds a SQL query from the query parts it is provided.
 */
const buildQuery = (parts: Array<QueryPart>, columnInfo: Array<ColumnSchema>): string => {
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

const parseNestedObject = (nested: object, keys: Array<string>) => {
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
const parseColumns = (entity: object, columnInfo: Array<ColumnSchema>) => {
    return keys(entity).reduce((acc, key) => {
        const column = columnInfo.find(c => c.name === key);
        if (column && column.shouldParse) {
            if (column.keysToParse) {
                acc[key] = parseNestedObject(entity[key], column.keysToParse);
            } else {
                try {
                    const toParse = entity[key];
                    acc[key] = JSON.parse(toParse);
                } catch (error) {
                    logger.error('Failed to parse [' + key + '] on ' + JSON.stringify(entity, null, 2));
                    throw error;
                }
            }
        } else {
            if (column && column.type === 'BLOB' && !column.shouldParse && entity[key] === '{}') {
                acc[key] = {};
            } else {
                acc[key] = entity[key];
            }
        }
        return acc;
    }, {});
};

/**
 * Converts certain values into a format required for SQL queries
 */
const returnValueBasedOnType = v => {
    let val = v;
    if (isBoolean(v)) {
        val = v;
    }
    if (isString(v)) {
        val = `'${v}'`;
    }
    if (isNumber(v)) {
        val = v;
    }
    if (isUndefined(v)) {
        val = `'${v}'`;
    }
    return val;
};

enum QueryType {
    INSERT,
    UPDATE
}

/**
 * The query builder that provided a record and query type
 * will build the appropriate parts for a query
 */
const createQuery = (record: object, queryType: QueryType) => {
    let query = '';
    if (isObject(record)) {
        const objectKeys = keys(record);
        objectKeys.forEach((k, i) => {
            const val = record[k];
            const isLastKey = i + 1 === objectKeys.length;
            const insertComma = isLastKey ? '' : ',';
            if (isArray(val)) {
                const arrayAsString = JSON.stringify(val);
                query = `${query}'${k}', '${arrayAsString}'${insertComma}`;
            } else if (isObject(val) && !isFunction(val)) {
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
            } else {
                if (isFunction(val)) {
                } else {
                    query = `${query}'${k}',${returnValueBasedOnType(val)}${insertComma}`;
                }
            }
        });
    } else {
        throw new Error('Record provided was expected to be an object');
    }
    return query;
};

export {
    hasQuery,
    translateQuery,
    buildQuery,
    parseColumns,
    returnValueBasedOnType,
    createQuery,
    QueryType,
    TableSchema,
    ColumnSchema,
    stringifyValue
};
