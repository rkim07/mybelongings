"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionWrapper = void 0;
const logging_1 = require("../logging");
const ResultSet_1 = require("./ResultSet");
const schema_1 = require("./schema");
const Utils_1 = require("./Utils");
/**
 * Wraps what was previously known as a "collection" in LokiJS
 * and has an interface very close to the LokiJS implementation
 * in using this, the impact of changing database implementation is small.
 * This class now translates most LokiJS queries to SQL queries for MariaDB
 */
class CollectionWrapper {
    constructor(name, pool) {
        this.tableName = '';
        this.columns = [];
        this.data = {};
        this.selectQuery = '';
        const schemaInfo = schema_1.schema.find(s => s.tableName === name);
        if (schemaInfo) {
            this.tableName = name;
            this.pool = pool;
            this.columns = schemaInfo.columns;
            this.schemaInfo = schemaInfo;
            this.selectQuery = `SELECT COLUMN_JSON(dynamic_cols) as rows FROM`;
        }
        else {
            throw new Error(`no schema information found for ${name}`);
        }
    }
    log(...args) {
        logging_1.logger.debug(`CW: table:${this.tableName} - :`, ...args);
    }
    chain() {
        return new ResultSet_1.ResultSet(this);
    }
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log(`find for query ${JSON.stringify(query)}`);
            let constructedQuery;
            if (Utils_1.hasQuery(query)) {
                const built = Utils_1.buildQuery(Utils_1.translateQuery(query), this.columns);
                constructedQuery = `${this.selectQuery} ${this.tableName} ${built}`;
            }
            else {
                constructedQuery = `${this.selectQuery} ${this.tableName}`;
            }
            this.log('beforeQuery:', constructedQuery);
            return yield this.queryAndParse(constructedQuery);
        });
    }
    findByField(fieldName, fieldValue) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log(`find for findByField: ${fieldName} fieldValue:${fieldValue}`);
            const query = `${this.selectQuery} ${this.tableName} WHERE COLUMN_GET(dynamic_cols, '${fieldName}' AS CHAR) = '${fieldValue}'`;
            return yield this.queryAndParse(query);
        });
    }
    insert(record) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('insert');
            const valuesQuery = Utils_1.createQuery(record, Utils_1.QueryType.INSERT);
            let res, err, constructedQuery;
            constructedQuery = `INSERT INTO ${this.tableName} (id,dynamic_cols) VALUES ('${record.key}', COLUMN_CREATE(${valuesQuery}))`;
            try {
                res = yield this.query(constructedQuery);
            }
            catch (error) {
                err = error;
                this.log('findByField query error:', error);
            }
            if (err) {
                return Promise.reject(err);
            }
            else {
                const { affectedRows } = res;
                if (affectedRows > 0) {
                    return this.findOne({ key: { $eq: record.key } });
                }
                else {
                    return Promise.reject(new Error(`No rows affected on insert for ${this.tableName}`));
                }
            }
        });
    }
    query(query) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log(query);
            let conn, err, result;
            try {
                conn = yield this.pool.getConnection();
                result = yield conn.query(query);
            }
            catch (error) {
                err = error;
            }
            finally {
                if (conn) {
                    conn.end();
                }
            }
            return new Promise((res, rej) => err ? rej(err) : res(result));
        });
    }
    queryAndParse(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let res, err, rows = [];
            try {
                res = yield this.query(query);
            }
            catch (error) {
                err = error;
            }
            if (err) {
                return Promise.reject(err);
            }
            try {
                rows = res.map(r => Utils_1.parseColumns(JSON.parse(r.rows), this.columns));
            }
            catch (error) {
                err = error;
            }
            return err ? Promise.reject(err) : Promise.resolve(rows);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('getAll');
            if (this.schemaInfo.isBlob) {
                return this.findBlob();
            }
            return yield this.queryAndParse(`${this.selectQuery} ${this.tableName}`);
        });
    }
    update(entity, query) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('update');
            const valuesQuery = Utils_1.createQuery(entity, Utils_1.QueryType.UPDATE);
            let constructedQuery, whereClause, err;
            if (query) {
                const translated = Utils_1.translateQuery(query);
                whereClause = Utils_1.buildQuery(translated, this.columns);
            }
            else {
                whereClause = `WHERE id='${entity.key}'`;
            }
            constructedQuery = `UPDATE ${this.tableName} SET dynamic_cols=COLUMN_ADD(dynamic_cols,${valuesQuery}) ${whereClause}`;
            try {
                yield this.query(constructedQuery);
            }
            catch (error) {
                err = error;
                this.log('findByField query error:', error);
            }
            if (err) {
                return Promise.reject(err);
            }
            return this.findOne({ key: { $eq: entity.key } });
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log(`findOne for query ${JSON.stringify(query)}`);
            let constructedQuery;
            let err;
            let res;
            if (Utils_1.hasQuery(query)) {
                const translated = Utils_1.translateQuery(query);
                const built = Utils_1.buildQuery(translated, this.columns);
                constructedQuery = `SELECT id, COLUMN_JSON(dynamic_cols) as rows FROM ${this.tableName} ${built} LIMIT 1`;
            }
            else {
                constructedQuery = `SELECT id, COLUMN_JSON(dynamic_cols) as rows FROM ${this.tableName} LIMIT 1`;
            }
            try {
                res = yield this.query(constructedQuery);
            }
            catch (error) {
                err = error;
                this.log('find query error:', error);
            }
            if (err) {
                return Promise.reject(err);
            }
            else {
                const [first] = res;
                if (first && first.rows) {
                    let parsed = JSON.parse(first.rows);
                    parsed = Utils_1.parseColumns(parsed, this.columns);
                    return Promise.resolve(parsed);
                }
                else {
                    return Promise.resolve();
                }
            }
        });
    }
    findAndRemove(query) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('findAndRemove', query);
            let err;
            const translated = Utils_1.translateQuery(query);
            const built = Utils_1.buildQuery(translated, this.columns);
            const constructedQuery = `DELETE FROM ${this.tableName} ${built}`;
            try {
                yield this.query(constructedQuery);
            }
            catch (error) {
                err = error;
                this.log('findByField query error:', error);
            }
            return err ? Promise.reject(err) : Promise.resolve([]);
        });
    }
    insertBlob(blob) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('insertBlob');
            let constructedQuery, err, res;
            constructedQuery = `INSERT INTO ${this.tableName} VALUES ('${this.tableName}', COLUMN_CREATE('stringified','${JSON.stringify(blob)}'))`;
            try {
                res = yield this.query(constructedQuery);
            }
            catch (error) {
                err = error;
            }
            return err ? Promise.reject(err) : Promise.resolve(res);
        });
    }
    findBlob() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('findBlob');
            let parsed, res, err;
            try {
                res = yield this.findOne();
                if (res) {
                    const { stringified } = res;
                    parsed = JSON.parse(stringified);
                }
            }
            catch (error) {
                this.log(error);
                err = error;
            }
            if (err) {
                return Promise.reject(err);
            }
            if (parsed) {
                return new Promise(resolve => resolve(parsed));
            }
            else {
                return Promise.resolve([]);
            }
        });
    }
    removeDataOnly() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.query(`DELETE FROM ${this.tableName}`);
        });
    }
}
exports.CollectionWrapper = CollectionWrapper;
//# sourceMappingURL=CollectionWrapper.js.map