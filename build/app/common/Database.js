"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const config = require("config");
const mariadb = require("mariadb");
const db_1 = require("./db");
const logging_1 = require("./logging");
const host = config.get('db.host').toString();
const port = config.get('db.port');
const database = config.get('db.database').toString();
const user = config.get('db.user').toString();
const connectionLimit = parseInt(config.get('db.connectionLimit'));
let buff = Buffer.from(config.get('db.password').toString(), 'base64');
let password = buff.toString('ascii');
const poolConfig = {
    host,
    port,
    database,
    user,
    password,
    connectionLimit
};
let pool;
try {
    pool = mariadb.createPool(poolConfig);
}
catch (error) {
    logging_1.logger.error(error, `error creating database pool`);
}
var Database;
(function (Database) {
    function getCollection(collectionName) {
        const tableInformation = db_1.schema.find(t => t.collectionName === collectionName);
        return Promise.resolve(new db_1.CollectionWrapper(tableInformation.tableName, pool));
    }
    Database.getCollection = getCollection;
})(Database = exports.Database || (exports.Database = {}));
//# sourceMappingURL=Database.js.map