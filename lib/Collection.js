import _each from 'fast.js/forEach';
import _map from 'fast.js/map';
import EventEmitter from 'eventemitter3';
import invariant from 'invariant';
import DocumentModifier from './DocumentModifier';
import IndexManager from './IndexManager';
import StorageManager from './StorageManager';
import CursorObservable from './CursorObservable';
import Random from './Random';
import Document from './Document';


// Defaults
const _defaultRandomGenerator = new Random();
let _defaultCursorClass = CursorObservable;
let _defaultStorageManager = StorageManager;
let _defaultIdGenerator = function(modelName) {
  const nextSeed = _defaultRandomGenerator.hexString(20);
  const sequenceSeed = [nextSeed, `/collection/${modelName}`];
  return {
    value: Random.createWithSeed.apply(null, sequenceSeed).id(17),
    seed: nextSeed,
  };
};


export class Collection extends EventEmitter {
  constructor(name, options = {}) {
    super();
    this._methods = {};
    this._modelName = name;

    // Init managers
    const storageManagerClass = options.storageManager || _defaultStorageManager;
    this.indexManager = new IndexManager(this, options);
    this.storageManager = new storageManagerClass(this, options);
    this.idGenerator = options.idGenerator || _defaultIdGenerator;
  }

  static defaultStorageManager(managerClass) {
    _defaultStorageManager = managerClass;
  }

  static defaultIdGenerator(generator) {
    _defaultIdGenerator = generator;
  }

  static defaultCursorClass(cursorClass) {
    _defaultCursorClass = cursorClass;
  }

  get modelName() {
    return this._modelName;
  }
  get indexes() {
    return this.indexManager.indexes;
  }
  get storage() {
    return this.storageManager;
  }

  /**
   * Factory for creating an object of the model
   * @param  {String|Object} raw
   * @return {Document}
   */
  create(raw) {
    return new Document(this, raw);
  }

  /**
   * Set a static function in a model. Chainable.
   * @param  {String}   name
   * @param  {Function} fn
   * @return {this}
   */
  static(name, fn) {
    invariant(
      !Collection.prototype.hasOwnProperty(name) && typeof fn === 'function',
      'Static function `%s` must not be an existing one in a model',
      name
    );
    this[name] = fn;
    return this;
  }

  /**
   * Setup a method in a model (all created documents).
   * Chainable.
   * @param  {String}   name
   * @param  {Function} fn
   * @return {this}
   */
  method(name, fn) {
    invariant(
      !this._methods[name] && typeof fn === 'function',
      'Method function `%s` already defined in a model',
      name
    );
    this._methods[name] = fn;
    return this;
  }

  /**
   * Ensures index by delegating to IndexManager.
   * @param  {String} key
   * @return {Promise}
   */
  ensureIndex(key) {
    return this.indexManager.ensureIndex(key);
  }

  /**
   * Insert a document into the model and
   * emit `synd:insert` event (if not quiet).
   * @param  {Object} doc
   * @param  {Boolean} quiet
   * @return {Promise}
   */
  insert(doc, options = {}) {
    // Prepare document for insertion
    const randomId = this.idGenerator(this.modelName);
    doc = this.create(doc);
    doc._id = doc._id || randomId.value;

    // Fire sync event
    if (!options.quiet) {
      this.emit('sync:insert', doc, randomId);
    }

    // Add to indexes and persist
    return this.indexManager.indexDocument(doc).then(() => {
      return this.storageManager.persist(doc._id, doc).then(() => {
        this.emit('insert', doc, null, randomId);
        return doc._id;
      });
    });
  }

  /**
   * Insert all documents in given list
   * @param  {Array} docs
   * @param  {Boolean} quiet
   * @return {Promise}
   */
  insertAll(docs, options) {
    return Promise.all(
      _map(docs, d => this.insert(d, options))
    );
  }

  /**
   * Remove an object (or objects with options.multi)
   * from the model.
   * @param  {Object} query
   * @param  {Object} options
   * @param  {Boolean} quiet
   * @return {Promise}
   */
  remove(query, options = {}) {
    // Fire sync event
    if (!options.quiet) {
      this.emit('sync:remove', query, options);
    }

    // Remove locally
    return this.find(query).exec().then((docs) => {
      invariant(
        docs.length <= 1 || options.multi,
        'remove(..): multi removing is not enabled by options.multi'
      );

      const removeStorgePromises = _map(docs, d => {
        return this.storageManager.delete(d._id);
      });
      const removeIndexPromises = _map(docs, d => {
        return this.indexManager.deindexDocument(d);
      });
      const allPromises = removeStorgePromises.concat(removeIndexPromises);

      return Promise.all(allPromises).then(() => {
        _each(docs, d => this.emit('remove', null, d));
        return docs;
      });
    });
  }

  /**
   * Remove an object (or objects with options.multi)
   * from the model.
   * NOTE: `upsert` is not supported, only `multi`
   * @param  {Object} query
   * @param  {Object} options
   * @param  {Boolean} quiet
   * @return {Promise}
   */
  update(query, modifier, options = {}) {
    options.upsert = false;

    // Fire sync event
    if (!options.quiet) {
      this.emit('sync:update', query, modifier, options);
    }

    // Update locally
    return new DocumentModifier(this, query)
      .modify(modifier, options)
      .then((result) => {
        var {original, updated} = result;
        updated = _map(updated, x => this.create(x));

        const updateStorgePromises = _map(updated, d => {
          return this.storageManager.persist(d._id, d);
        });
        const updateIndexPromises = _map(updated, (d, i) => {
          return this.indexManager.reindexDocument(original[i], d);
        });
        const allPromises = updateStorgePromises.concat(updateIndexPromises);

        return Promise.all(allPromises).then(() => {
          _each(updated, (d, i) => {
            this.emit('update', d, original[i]);
          });
          return {
            modified: updated.length,
            original: original,
            updated: updated,
          };
        });
      });
  }

  /**
   * Return all currently indexed ids
   * @return {Array}
   */
  getIndexIds() {
    return this.indexes._id.getAll();
  }

  /**
   * Make a cursor with given query and return
   * @param  {Object} query
   * @return {CursorObservable}
   */
  find(query) {
    return new _defaultCursorClass(this, query);
  }

  /**
   * Finds one object by given query and sort object.
   * Return a promise that resolved with a document object
   * or with undefined if no object found.
   * @param  {Object} query
   * @param  {Object} sortObj
   * @return {Promise}
   */
  findOne(query, sortObj) {
    return this.find(query)
      .sort(sortObj).limit(1)
      .aggregate(docs => docs[0]);
  }

  /**
   * Returns a number of matched by query objects. It's
   * based on `ids` function and uses only indexes.
   * In this case it's much more faster then doing
   * `find().length`, because it does not going to the
   * storage.
   * @param  {Object} query
   * @return {Promise}
   */
  count(query) {
    return this.ids(query).then((ids) => {
      return ids.length;
    });
  }

  /**
   * Return a list of ids by given query. Uses only
   * indexes.
   * @param  {Object} query
   * @return {Promise}
   */
  ids(query) {
    return new _defaultCursorClass(this, query).ids();
  }
}

export default Collection;
