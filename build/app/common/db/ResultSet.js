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
exports.ResultSet = void 0;
const Utils_1 = require("./Utils");
/**
 * Used to provide a chainable query when .chain()
 * is called on an instance of CollectionWrapper.
 * has an interface very close to the LokiJS implementation
 * in using this, the impact of changing database implementation is small.
 * This class now translates most LokiJS queries to SQL queries for MariaDB
 */
class ResultSet {
    constructor(collection) {
        this.sortQuery = '';
        this.limitQuery = '';
        this.findQuery = '';
        this.collection = collection;
    }
    find(query) {
        const { tableName, columns } = this.collection;
        let constructedQuery;
        if (Utils_1.hasQuery(query)) {
            const translated = Utils_1.translateQuery(query);
            const built = Utils_1.buildQuery(translated, columns);
            constructedQuery = `SELECT COLUMN_JSON(dynamic_cols) as rows FROM ${tableName} ${built}`;
        }
        else {
            constructedQuery = `SELECT COLUMN_JSON(dynamic_cols) as rows FROM ${tableName}`;
        }
        this.findQuery = constructedQuery;
        return this;
    }
    simplesort(sortBy, desc) {
        const direction = desc ? ' DESC' : '';
        this.sortQuery = `ORDER BY COLUMN_GET(dynamic_cols, '${sortBy}' AS CHAR)${direction}`;
        return this;
    }
    compoundsort(sortBy) {
        const [first] = sortBy;
        if (first && first.length === 1) {
            this.sortQuery = `ORDER BY COLUMN_GET(dynamic_cols, '${first}' AS CHAR)`;
        }
        if (first && first.length === 2) {
            const [column, desc] = first;
            const direction = (desc === true) ? ' DESC' : '';
            this.sortQuery = `ORDER BY COLUMN_GET(dynamic_cols, '${column}' AS CHAR)${direction}`;
        }
        return this;
    }
    limit(qty) {
        if (qty) {
            this.limitQuery = `LIMIT ${qty}`;
        }
        return this;
    }
    data() {
        return __awaiter(this, void 0, void 0, function* () {
            const { columns } = this.collection;
            const constructedQuery = `${this.findQuery} ${this.sortQuery} ${this.limitQuery}`;
            let res;
            let err;
            let rows;
            try {
                res = yield this.collection.query(constructedQuery);
            }
            catch (error) {
                err = error;
                this.collection.log('data query error:', error);
            }
            try {
                rows = res.map(r => Utils_1.parseColumns(JSON.parse(r.rows), columns));
            }
            catch (error) {
                err = error;
                this.collection.log('data parse error:', error);
            }
            return err ? Promise.reject(err) : Promise.resolve(rows);
        });
    }
}
exports.ResultSet = ResultSet;
//# sourceMappingURL=ResultSet.js.map