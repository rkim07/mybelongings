import * as _ from 'lodash';

import { CollectionWrapper } from 'app/common/db';
import { Database } from '../../../common/Database';
import { logger } from '../../../common/logging';
import { Datetime } from '../models/models';

export abstract class DatabaseCollectionService {

    protected collectionName: string;
    protected collection: CollectionWrapper;

    protected constructor(collectionName: string) {
        this.collectionName = collectionName;
        this.loadCollection();
    }

    /**
     * Clears the collection
     */
    public async clearCollection() {
        // Wait for the database to connect and the collection to load
        await this.loadCollection();
        // Remove data
        await this.collection.removeDataOnly();
    }

    /**
     * Get all items in a collection
     */
    public async getAll(): Promise<any> {
        await this.loadCollection();
        // return all items in this collection
        return this.collection.getAll();
    }

    /**
     * Insert one record into the collection
     *
     * @param item
     */
    public async addOne(item: any): Promise<any> {
        // Wait for the database to connect and the collection to load
        await this.loadCollection();
        // Insert the provided items
        return this.collection.insert(item);
    }

    /**
     * Inserts many records into the collection
     *
     * @param items
     */
    public async addMany(items: Array<any>): Promise<any> {
        // Wait for the database to connect and the collection to load
        await this.loadCollection();

        let results: Array<any> = [];

        for (const item in items) {
            if (items.hasOwnProperty(item)) {
                results.push(await this.collection.insert(items[item]));
            }
        }

        return results;
    }

    /**
     * Adds an item to the database if the an associated item is not found in the collection.
     * Field to use for comparison is passed as an argument
     * @param item
     * @param field
     */
    public async upsert(item: any, field): Promise<any> {

        // Wait for the database to connect and the collection to load
        await this.loadCollection();

        // Build the query
        const uniqueId: string = item[field];
        const query: any = {};
        query[field] = {$eq: uniqueId};

        // Retrieve the item if it exists in the collection, based on the query
        const existingItem: any = await this.collection.findOne(query);

        if (existingItem) {

            // If the item already exists in the collection, map the values
            _.forEach(item, (val, key) => {
                existingItem[key] = val;
            });

            // Updated the item in the collection
            return this.collection.update(existingItem, query);

        } else {
            // No associated item exists; insert a new record
            return this.collection.insert(item);
        }
    }

    /**
     * Upsert an array of items
     *
     * @param items
     * @param field
     */
    public async upsertMany(items: Array<any>, field: string) {

        // Wait for the database to connect and the collection to load
        await this.loadCollection();

        // Upsert each item atomically
        for (const item of items) {
            await this.upsert(item, field);
        }
    }

    /**
     * Finds documents in the collection for provided query
     *
     * @param query
     */
    public async find(query?: any): Promise<any> {
        // Wait for the database to connect and the collection to load
        await this.loadCollection();
        // Execute the query
        return await this.collection.find(query);
    }

    /**
     * Find a single document in the collection for the provided query
     *
     * @param query
     */
    public async findOne(query): Promise<any> {
        // Wait for the database to connect and the collection to load
        await this.loadCollection();
        // Execute the query
        return this.collection.findOne(query);
    }

    /**
     * A simple query helper to retrieve those records within the collection whose field
     * is matched by specified value.  Optionally, indicate whether 1 or many items is required
     *
     * @param field
     * @param values
     * @param quantity
     */
    public async findByField(field: string, values: any, quantity?: number): Promise<any> {
        // Wait for the database to connect and the collection to load
        await this.loadCollection();
        // Create the query
        const query: any = {};

        if (values.length) {
            query[field] = { $in: values };
        } else {
            query[field] = { $eq: values };
        }

        // Switch to determine whether we return an array or single document
        if (quantity === 1) {
            return this.collection.findOne(query);
        } else {
            return this.collection.chain()
                .find(query)
                .simplesort('priority', false)
                .limit(quantity)
                .data();
        }
    }

    /**
     * Retrieves and updates a single document given supplied date
     *
     * @param data
     */
    public async updateOne(data: {
        uniqueField: string,
        uniqueFieldValue: any,
        updateField: string,
        updateFieldValue: any
    }) {

        const updateFields = {};
        updateFields[data.updateField] = data.updateFieldValue;

        return this.updateManyFields({
            uniqueField: data.uniqueField,
            uniqueFieldValue: data.uniqueFieldValue,
            updateFields
        });
    }

    /**
     * Remove field by value
     *
     * @param field
     * @param value
     */
    public async removeByFieldValue(field: string, value: any) {

        // Wait for the database to connect and the collection to load
        await this.loadCollection();

        // Form the query
        const query: any = {};

        // If value contains multiple values, use an $in comparison
        if (_.isArray(value)) {
            query[field] = {$in: value};
        } else {
            query[field] = {$eq: value};
        }

        // Remove all matching items
        // Cast to any because `findAndRemove` function is not in the types file
        return (this.collection as any).findAndRemove(query);
    }

    /**
     * Saves a provided document to the Database
     *
     * @param document
     */
    public async save(document: any): Promise<any> {
        // Wait for the database to connect and the collection to load
        await this.loadCollection();
        // Update the modified field of the document, if it exists
        if (document.modified) {
            document.modified = Datetime.getNow();
        }
        // Update the provided document
        return this.collection.update(document);
    }

    /**
     * Update the modified field of the associated object
     *
     * @param uniqueField
     * @param uniqueFieldValue
     * @param modifiedField
     */
    public async updateModified(uniqueField: string, uniqueFieldValue: any, modifiedField: string = 'modified'): Promise<any> {
        // Wait for the database to connect and the collection to load
        await this.loadCollection();

        return this.updateOne({
            uniqueField,
            uniqueFieldValue,
            updateField: modifiedField,
            updateFieldValue: Datetime.getNow()
        });
    }

    /**
     * Loads the collection and stores locally for future use
     *
     * @protected
     */
    protected async loadCollection(): Promise<any> {
        try {
            // If no collection has been loaded before
            if (!this.collection) {
                // Get collection from database
                this.collection = await Database.getCollection(this.collectionName);
            }
        } catch(e) {
            logger.error(`Couldn't retrieve the ${this.collectionName} collection from the DB`);
        }
    }

    /**
     * Retrieves and updates a single document's fields given supplied data
     *
     * @param data
     * @protected
     */
    protected async updateManyFields(data: {
        uniqueField: string,
        uniqueFieldValue: any,
        updateFields: Object
    }) {

        // Wait for the database to connect and the collection to load
        await this.loadCollection();

        // Form the query
        const query: any = {};
        query[data.uniqueField] = {$eq: data.uniqueFieldValue};

        // Find the document matching the 'unique' data
        const document: any = await this.collection.findOne(query);

        // Updated the required field
        for (const key in data.updateFields) {
            document[key] = data.updateFields[key];
        }
        // Update the document in the database and return the document
        return this.collection.update(document);
    }

}
