import * as _ from 'lodash';
import * as mariadb from 'mariadb';
import { Container, Inject } from 'typedi';
import { logger } from '../logging';
import { ResultSet } from './ResultSet';
import { schema } from './schema';
import {
    buildQuery,
    ColumnSchema,
    createQuery,
    hasQuery,
    parseColumns,
    QueryType,
    TableSchema,
    translateQuery
} from './Utils';

/**
 * Wraps what was previously known as a "collection" in LokiJS
 * and has an interface very close to the LokiJS implementation
 * in using this, the impact of changing database implementation is small.
 * This class now translates most LokiJS queries to SQL queries for MariaDB
 */
export class CollectionWrapper {

    tableName: string = '';
    pool: mariadb.Pool;
    columns: Array<ColumnSchema> = [];
    schemaInfo: TableSchema;
    data: object = {};
    selectQuery: string = '';
    constructor(name: string, pool: mariadb.Pool) {
        const schemaInfo: TableSchema = schema.find(s => s.tableName === name);
        if (schemaInfo) {
            this.tableName = name;
            this.pool = pool;
            this.columns = schemaInfo.columns;
            this.schemaInfo = schemaInfo;
            this.selectQuery = `SELECT COLUMN_JSON(dynamic_cols) as rows FROM`;
        } else {
            throw new Error(`no schema information found for ${name}`);
        }
    }
    log(...args) {
        logger.debug(`CW: table:${this.tableName} - :`, ...args);
    }
    chain() {
        return new ResultSet(this);
    }
    async find(query?: object) {
        this.log(`find for query ${JSON.stringify(query)}`);
        let constructedQuery;
        if (hasQuery(query)) {
            const built = buildQuery(translateQuery(query), this.columns);
            constructedQuery = `${this.selectQuery} ${this.tableName} ${built}`;
        } else {
            constructedQuery = `${this.selectQuery} ${this.tableName}`;
        }
        this.log('beforeQuery:', constructedQuery);

        return await this.queryAndParse(constructedQuery);
    }
    async findByField(fieldName: string, fieldValue) {
        this.log(`find for findByField: ${fieldName} fieldValue:${fieldValue}`);
        const query = `${this.selectQuery} ${this.tableName} WHERE COLUMN_GET(dynamic_cols, '${fieldName}' AS CHAR) = '${fieldValue}'`;
        return await this.queryAndParse(query);
    }
    async insert(record) {
        this.log('insert');
        const valuesQuery = createQuery(record, QueryType.INSERT);

        let res, err, constructedQuery;
        constructedQuery = `INSERT INTO ${this.tableName} (id,dynamic_cols) VALUES ('${record.key}', COLUMN_CREATE(${valuesQuery}))`;
        try {
            res = await this.query(constructedQuery);
        } catch (error) {
            err = error;
            this.log('findByField query error:', error);
        }
        if (err) {
            return Promise.reject(err);
        } else {
            const { affectedRows } = res;
            if (affectedRows > 0) {
                return this.findOne({ key: { $eq: record.key }});
            } else {
                return Promise.reject(new Error(`No rows affected on insert for ${this.tableName}`));
            }
        }
    }
    async query(query) {
        this.log(query);
        let conn, err, result;
        try {
            conn = await this.pool.getConnection();
            result = await conn.query(query);
        } catch (error) {
            err = error;
        } finally {
            if (conn) {
                conn.end();
            }
        }
        return new Promise((res, rej) => err ? rej(err) : res(result));
    }
    async queryAndParse(query) {
        let res, err, rows = [];
        try {
            res = await this.query(query);
        } catch (error) {
            err = error;
        }
        if (err) {
            return Promise.reject(err);
        }
        try {
            rows = res.map(r => parseColumns(JSON.parse(r.rows), this.columns));
        } catch (error) {
            err = error;
        }
        return err ? Promise.reject(err) : Promise.resolve(rows);
    }
    async getAll() {
        this.log('getAll');
        if (this.schemaInfo.isBlob) {
            return this.findBlob();
        }

        return await this.queryAndParse(`${this.selectQuery} ${this.tableName}`);
    }
    async update(entity, query?) {
        this.log('update');
        const valuesQuery = createQuery(entity, QueryType.UPDATE);
        let constructedQuery, whereClause, err;
        if (query) {
            const translated = translateQuery(query);
            whereClause = buildQuery(translated, this.columns);
        } else {
            whereClause = `WHERE id='${entity.key}'`;
        }
        constructedQuery = `UPDATE ${this.tableName} SET dynamic_cols=COLUMN_ADD(dynamic_cols,${valuesQuery}) ${whereClause}`;
        try {
            await this.query(constructedQuery);
        } catch (error) {
            err = error;
            this.log('findByField query error:', error);
        }
        if (err) {
            return Promise.reject(err);
        }
        return this.findOne({ key: { $eq: entity.key }});
    }
    async findOne(query?) {
        this.log(`findOne for query ${JSON.stringify(query)}`);
        let constructedQuery;
        let err;
        let res;
        if (hasQuery(query)) {
            const translated = translateQuery(query);
            const built = buildQuery(translated, this.columns);
            constructedQuery = `SELECT id, COLUMN_JSON(dynamic_cols) as rows FROM ${this.tableName} ${built} LIMIT 1`;
        } else {
            constructedQuery = `SELECT id, COLUMN_JSON(dynamic_cols) as rows FROM ${this.tableName} LIMIT 1`;
        }
        try {
            res = await this.query(constructedQuery);
        } catch (error) {
            err = error;
            this.log('find query error:', error);
        }
        if (err) {
            return Promise.reject(err);
        } else {
            const [ first ] = res;
            if (first && first.rows) {
                let parsed = JSON.parse(first.rows);
                parsed = parseColumns(parsed, this.columns);
                return Promise.resolve(parsed);
            } else {
                return Promise.resolve();
            }
        }
    }
    async findAndRemove(query) {
        this.log('findAndRemove', query);
        let err;
        const translated = translateQuery(query);
        const built = buildQuery(translated, this.columns);
        const constructedQuery = `DELETE FROM ${this.tableName} ${built}`;
        try {
            await this.query(constructedQuery);
        } catch (error) {
            err = error;
            this.log('findByField query error:', error);
        }
        return err ? Promise.reject(err) : Promise.resolve([]);
    }
    async insertBlob(blob: any) {
        this.log('insertBlob');
        let constructedQuery, err, res;
        constructedQuery = `INSERT INTO ${this.tableName} VALUES ('${this.tableName}', COLUMN_CREATE('stringified','${JSON.stringify(blob)}'))`;
        try {
            res = await this.query(constructedQuery);
        } catch (error) {
            err = error;
        }
        return err ? Promise.reject(err) : Promise.resolve(res);
    }
    async findBlob(): Promise<any> {
        this.log('findBlob');
        let parsed, res, err;
        try {
            res = await this.findOne();
            if (res) {
                const { stringified } = res;
                parsed = JSON.parse(stringified);
            }
        } catch (error) {
            this.log(error);
            err = error;
        }
        if (err) {
            return Promise.reject(err);
        }
        if (parsed) {
            return new Promise(resolve => resolve(parsed));
        } else {
            return Promise.resolve([]);
        }
    }
    async removeDataOnly() {
        return this.query(`DELETE FROM ${this.tableName}`);
    }
}
