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
exports.DatabaseCollectionService = void 0;
const _ = require("lodash");
const Database_1 = require("../../../common/Database");
const logging_1 = require("../../../common/logging");
const models_1 = require("../models/models");
/**
 * Abstracts common collection-related code away from domain-specific collection services. Extended by any Collection Service.
 */
class DatabaseCollectionService {
    constructor(collectionName) {
        this.collectionName = collectionName;
        this.loadCollection();
    }
    /**
     * Clears the collection
     */
    clearCollection() {
        return __awaiter(this, void 0, void 0, function* () {
            // Wait for the database to connect and the collection to load
            yield this.loadCollection();
            // Remove data
            yield this.collection.removeDataOnly();
        });
    }
    /**
     * Get all items in a collection
     * @return {Promise}
     */
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadCollection();
            // return all items in this collection
            return this.collection.getAll();
        });
    }
    /**
     * Insert one record into the collection
     * @param  {any}
     * @return {Promise<any>}
     */
    addOne(item) {
        return __awaiter(this, void 0, void 0, function* () {
            // Wait for the database to connect and the collection to load
            yield this.loadCollection();
            // Insert the provided items
            return this.collection.insert(item);
        });
    }
    /**
     * Inserts many records into the collection
     * @param  {[type]}
     * @return {Promise<any>}
     */
    addMany(items) {
        return __awaiter(this, void 0, void 0, function* () {
            // Wait for the database to connect and the collection to load
            yield this.loadCollection();
            let results = [];
            for (const item in items) {
                if (items.hasOwnProperty(item)) {
                    results.push(yield this.collection.insert(items[item]));
                }
            }
            return results;
        });
    }
    /**
     * Adds an item to the database if the an associated item is not found in the collection. Field to use for comparison is passed as an argument
     * @return {Promise<any>}
     */
    upsert(item, field) {
        return __awaiter(this, void 0, void 0, function* () {
            // Wait for the database to connect and the collection to load
            yield this.loadCollection();
            // Build the query
            const uniqueId = item[field];
            const query = {};
            query[field] = { $eq: uniqueId };
            // Retrieve the item if it exists in the collection, based on the query
            const existingItem = yield this.collection.findOne(query);
            if (existingItem) {
                // If the item already exists in the collection, map the values
                _.forEach(item, (val, key) => {
                    existingItem[key] = val;
                });
                // Updated the item in the collection
                return this.collection.update(existingItem, query);
            }
            else {
                // No associated item exists; insert a new record
                return this.collection.insert(item);
            }
        });
    }
    /**
     * Upserts an array of items
     *
     * @param items
     * @param field
     */
    upsertMany(items, field) {
        return __awaiter(this, void 0, void 0, function* () {
            // Wait for the database to connect and the collection to load
            yield this.loadCollection();
            // Upserts each item atomically
            for (const item of items) {
                yield this.upsert(item, field);
            }
        });
    }
    /**
     * Finds documents in the collection for provided query
     * @param  {[type]}       query [description]
     * @return {Promise<any>}       [description]
     */
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            // Wait for the database to connect and the collection to load
            yield this.loadCollection();
            // Execute the query
            return yield this.collection.find(query);
        });
    }
    /**
     * Find a single document in the collection for the provided query
     * @param  {[type]}       query [description]
     * @return {Promise<any>}       [description]
     */
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            // Wait for the database to connect and the collection to load
            yield this.loadCollection();
            // Execute the query
            return this.collection.findOne(query);
        });
    }
    /**
     * A simple query helper to retrieve those records within the collection whose field is matched by specified value.
     * Optionally, indicate whether 1 or many items is required
     *
     * @param field
     * @param values
     * @param quantity
     */
    findByField(field, values, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            // Wait for the database to connect and the collection to load
            yield this.loadCollection();
            // Create the query
            const query = {};
            if (values.length) {
                query[field] = { $in: values };
            }
            else {
                query[field] = { $eq: values };
            }
            // Switch to determine whether we return an array or single document
            if (quantity === 1) {
                return this.collection.findOne(query);
            }
            else {
                return this.collection.chain()
                    .find(query)
                    .simplesort('priority', false)
                    .limit(quantity)
                    .data();
            }
        });
    }
    /**
     * Retrieves and updates a single document given supplied date
     * @param {any    }} data [description]
     */
    updateOne(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateFields = {};
            updateFields[data.updateField] = data.updateFieldValue;
            return this.updateManyFields({
                uniqueField: data.uniqueField,
                uniqueFieldValue: data.uniqueFieldValue,
                updateFields
            });
        });
    }
    removeByFieldValue(field, value) {
        return __awaiter(this, void 0, void 0, function* () {
            // Wait for the database to connect and the collection to load
            yield this.loadCollection();
            // Form the query
            const query = {};
            // If value contains multiple values, use an $in comparison
            if (_.isArray(value)) {
                query[field] = { $in: value };
            }
            else {
                query[field] = { $eq: value };
            }
            // Remove all matching items
            // Cast to any because `findAndRemove` function is not in the types file
            return this.collection.findAndRemove(query);
        });
    }
    /**
     * Saves a provided document to the Database
     * @param  {any} document The document to save back to the Database
     * @return {Promise<any>} A promise containing the updated document
     */
    save(document) {
        return __awaiter(this, void 0, void 0, function* () {
            // Wait for the database to connect and the collection to load
            yield this.loadCollection();
            // Update the modified field of the document, if it exists
            if (document.modified) {
                document.modified = models_1.Datetime.getNow();
            }
            // Update the provided document
            return this.collection.update(document);
        });
    }
    /**
     * Update the modified field of the associated ShoppingBasket
     * @param  {models.Key}                     basketKey [description]
     * @return {Promise<models.ShoppingBasket>}           [description]
     */
    updateModified(uniqueField, uniqueFieldValue, modifiedField = 'modified') {
        return __awaiter(this, void 0, void 0, function* () {
            // Wait for the database to connect and the collection to load
            yield this.loadCollection();
            return this.updateOne({
                uniqueField,
                uniqueFieldValue,
                updateField: modifiedField,
                updateFieldValue: models_1.Datetime.getNow()
            });
        });
    }
    /**
     * Loads the collection and stores locally for future use
     * @return {Promise<Collection<any>>}
     */
    loadCollection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // If no collection has been loaded before
                if (!this.collection) {
                    // Get collection from database
                    this.collection = yield Database_1.Database.getCollection(this.collectionName);
                }
            }
            catch (e) {
                logging_1.logger.error(`Couldn't retrieve the ${this.collectionName} collection from the DB`);
            }
        });
    }
    /**
     * Retrieves and updates a single document's fields given supplied data
     * @param {any}} data [description]
     */
    updateManyFields(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Wait for the database to connect and the collection to load
            yield this.loadCollection();
            // Form the query
            const query = {};
            query[data.uniqueField] = { $eq: data.uniqueFieldValue };
            // Find the document matching the 'unique' data
            const document = yield this.collection.findOne(query);
            // Updated the required field
            for (const key in data.updateFields) {
                const value = data.updateFields[key];
                document[key] = value;
            }
            // Update the document in the database and return the document
            return this.collection.update(document);
        });
    }
}
exports.DatabaseCollectionService = DatabaseCollectionService;
//# sourceMappingURL=DatabaseCollectionService.js.map