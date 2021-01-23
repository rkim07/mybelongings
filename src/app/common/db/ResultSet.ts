import { CollectionWrapper } from './CollectionWrapper';
import { 
    buildQuery,
    hasQuery,
    parseColumns,
    translateQuery
} from './Utils';

/**
 * Used to provide a chainable query when .chain()
 * is called on an instance of CollectionWrapper.
 * has an interface very close to the LokiJS implementation
 * in using this, the impact of changing database implementation is small.
 * This class now translates most LokiJS queries to SQL queries for MariaDB
 */
export class ResultSet {
    collection: CollectionWrapper;
    sortQuery: string = '';
    limitQuery: string = '';
    findQuery: string = '';
    constructor(collection) {
        this.collection = collection;
    }
    find(query?) {
        const { tableName, columns } = this.collection;
        let constructedQuery;
        if (hasQuery(query)) {
            const translated = translateQuery(query);
            const built = buildQuery(translated, columns);
            constructedQuery = `SELECT COLUMN_JSON(dynamic_cols) as rows FROM ${tableName} ${built}`;
        } else {
            constructedQuery = `SELECT COLUMN_JSON(dynamic_cols) as rows FROM ${tableName}`;
        }
        this.findQuery = constructedQuery;
        return this;
    }
    simplesort(sortBy: string, desc: boolean) {
        const direction = desc ? ' DESC' : '';
        this.sortQuery = `ORDER BY COLUMN_GET(dynamic_cols, '${sortBy}' AS CHAR)${direction}`;
        return this;
    }
    compoundsort(sortBy: Array<any>) {
        const [ first ] = sortBy;
        if (first && first.length === 1) {
            this.sortQuery = `ORDER BY COLUMN_GET(dynamic_cols, '${first}' AS CHAR)`;
        }
        if (first && first.length === 2) {
            const [ column, desc ] = first;
            const direction = (desc === true) ? ' DESC' : '';
            this.sortQuery = `ORDER BY COLUMN_GET(dynamic_cols, '${column}' AS CHAR)${direction}`;
        }
        return this;
    }
    limit(qty?: number) {
        if (qty) {
            this.limitQuery = `LIMIT ${qty}`;
        }
        return this;
    }
    async data() {
        const { columns } = this.collection;
        const constructedQuery = `${this.findQuery} ${this.sortQuery} ${this.limitQuery}`;
        let res;
        let err;
        let rows;
        try {
            res = await this.collection.query(constructedQuery);
        } catch (error) {
            err = error;
            this.collection.log('data query error:', error);
        }
        try {
            rows = res.map(r => parseColumns(JSON.parse(r.rows), columns));
        } catch (error) {
            err = error;
            this.collection.log('data parse error:', error);
        }
        return err ? Promise.reject(err) : Promise.resolve(rows);
    }
}
