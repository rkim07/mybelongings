import * as config from 'config';
import * as mariadb from 'mariadb';
import { CollectionWrapper, schema } from './db';
import { logger } from './logging';

const host = config.get('db.host').toString();
const port: number = config.get('db.port');
const database = config.get('db.database').toString();
const user = config.get('db.user').toString();
const connectionLimit = parseInt(config.get('db.connectionLimit'));
let buff = Buffer.from(config.get('db.password').toString(), 'base64');
let password = buff.toString('ascii');

const poolConfig: mariadb.PoolConfig = {
    host,
    port,
    database,
    user,
    password,
    connectionLimit
};

let pool: mariadb.Pool;

try {
    pool = mariadb.createPool(poolConfig);
} catch (error) {
    logger.error(error, `error creating database pool`);
}

export namespace Database {
    export function getCollection(collectionName: string): Promise<CollectionWrapper> {
        const tableInformation = schema.find(t => t.collectionName === collectionName);
        return Promise.resolve(new CollectionWrapper(tableInformation.tableName, pool));
    }
}
