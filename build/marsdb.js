(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Mars = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * Based on Meteor's Base64 package.
 * Rewrite with ES6 and better formated for passing
 * linter
 */
var BASE_64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var BASE_64_VALS = {};

(function setupBase64Vals() {
  for (var j = 0; j < BASE_64_CHARS.length; j++) {
    BASE_64_VALS[BASE_64_CHARS.charAt(j)] = j;
  }
})();

var getChar = function getChar(val) {
  return BASE_64_CHARS.charAt(val);
};

var getVal = function getVal(ch) {
  if (ch === '=') {
    return -1;
  }
  return BASE_64_VALS[ch];
};

// Base 64 encoding

var Base64 = exports.Base64 = (function () {
  function Base64() {
    _classCallCheck(this, Base64);
  }

  _createClass(Base64, [{
    key: 'encode',
    value: function encode(array) {
      if (typeof array === 'string') {
        var str = array;
        array = this.newBinary(str.length);
        for (var i = 0; i < str.length; i++) {
          var ch = str.charCodeAt(i);
          if (ch > 0xFF) {
            throw new Error('Not ascii. Base64.encode can only take ascii strings.');
          }
          array[i] = ch;
        }
      }

      var answer = [];
      var a = null;
      var b = null;
      var c = null;
      var d = null;
      for (var i = 0; i < array.length; i++) {
        switch (i % 3) {
          case 0:
            a = array[i] >> 2 & 0x3F;
            b = (array[i] & 0x03) << 4;
            break;
          case 1:
            b |= array[i] >> 4 & 0xF;
            c = (array[i] & 0xF) << 2;
            break;
          case 2:
            c |= array[i] >> 6 & 0x03;
            d = array[i] & 0x3F;
            answer.push(getChar(a));
            answer.push(getChar(b));
            answer.push(getChar(c));
            answer.push(getChar(d));
            a = null;
            b = null;
            c = null;
            d = null;
            break;
        }
      }
      if (a != null) {
        answer.push(getChar(a));
        answer.push(getChar(b));
        if (c == null) {
          answer.push('=');
        } else {
          answer.push(getChar(c));
        }
        if (d == null) {
          answer.push('=');
        }
      }
      return answer.join('');
    }
  }, {
    key: 'decode',
    value: function decode(str) {
      var len = Math.floor(str.length * 3 / 4);
      if (str.charAt(str.length - 1) == '=') {
        len--;
        if (str.charAt(str.length - 2) == '=') {
          len--;
        }
      }
      var arr = this.newBinary(len);

      var one = null;
      var two = null;
      var three = null;

      var j = 0;

      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i);
        var v = getVal(c);
        switch (i % 4) {
          case 0:
            if (v < 0) {
              throw new Error('invalid base64 string');
            }
            one = v << 2;
            break;
          case 1:
            if (v < 0) {
              throw new Error('invalid base64 string');
            }
            one |= v >> 4;
            arr[j++] = one;
            two = (v & 0x0F) << 4;
            break;
          case 2:
            if (v >= 0) {
              two |= v >> 2;
              arr[j++] = two;
              three = (v & 0x03) << 6;
            }
            break;
          case 3:
            if (v >= 0) {
              arr[j++] = three | v;
            }
            break;
        }
      }
      return arr;
    }
  }, {
    key: 'newBinary',
    value: function newBinary(len) {
      if (typeof Uint8Array === 'undefined' || typeof ArrayBuffer === 'undefined') {
        var ret = [];
        for (var i = 0; i < len; i++) {
          ret.push(0);
        }
        ret.$Uint8ArrayPolyfill = true;
        return ret;
      }
      return new Uint8Array(new ArrayBuffer(len));
    }
  }]);

  return Base64;
})();

exports.default = new Base64();

},{}],2:[function(require,module,exports){
'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Collection = undefined;

var _forEach = require('fast.js/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _map2 = require('fast.js/map');

var _map3 = _interopRequireDefault(_map2);

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _DocumentModifier = require('./DocumentModifier');

var _DocumentModifier2 = _interopRequireDefault(_DocumentModifier);

var _IndexManager = require('./IndexManager');

var _IndexManager2 = _interopRequireDefault(_IndexManager);

var _StorageManager = require('./StorageManager');

var _StorageManager2 = _interopRequireDefault(_StorageManager);

var _CursorObservable = require('./CursorObservable');

var _CursorObservable2 = _interopRequireDefault(_CursorObservable);

var _Random = require('./Random');

var _Random2 = _interopRequireDefault(_Random);

var _Document = require('./Document');

var _Document2 = _interopRequireDefault(_Document);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

// Defaults
var _defaultRandomGenerator = new _Random2.default();
var _defaultCursorClass = _CursorObservable2.default;
var _defaultStorageManager = _StorageManager2.default;
var _defaultIdGenerator = function _defaultIdGenerator(modelName) {
  var nextSeed = _defaultRandomGenerator.hexString(20);
  var sequenceSeed = [nextSeed, '/collection/' + modelName];
  return {
    value: _Random2.default.createWithSeed.apply(null, sequenceSeed).id(17),
    seed: nextSeed
  };
};

var Collection = exports.Collection = (function (_EventEmitter) {
  _inherits(Collection, _EventEmitter);

  function Collection(name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Collection);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Collection).call(this));

    _this._methods = {};
    _this._modelName = name;

    // Init managers
    var storageManagerClass = options.storageManager || _defaultStorageManager;
    _this.indexManager = new _IndexManager2.default(_this, options);
    _this.storageManager = new storageManagerClass(_this, options);
    _this.idGenerator = options.idGenerator || _defaultIdGenerator;
    return _this;
  }

  _createClass(Collection, [{
    key: 'create',

    /**
     * Factory for creating an object of the model
     * @param  {String|Object} raw
     * @return {Document}
     */
    value: function create(raw) {
      return new _Document2.default(this, raw);
    }

    /**
     * Set a static function in a model. Chainable.
     * @param  {String}   name
     * @param  {Function} fn
     * @return {this}
     */

  }, {
    key: 'static',
    value: function _static(name, fn) {
      (0, _invariant2.default)(!Collection.prototype.hasOwnProperty(name) && typeof fn === 'function', 'Static function `%s` must not be an existing one in a model', name);
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

  }, {
    key: 'method',
    value: function method(name, fn) {
      (0, _invariant2.default)(!this._methods[name] && typeof fn === 'function', 'Method function `%s` already defined in a model', name);
      this._methods[name] = fn;
      return this;
    }

    /**
     * Ensures index by delegating to IndexManager.
     * @param  {String} key
     * @return {Promise}
     */

  }, {
    key: 'ensureIndex',
    value: function ensureIndex(key) {
      return this.indexManager.ensureIndex(key);
    }

    /**
     * Insert a document into the model and
     * emit `synd:insert` event (if not quiet).
     * @param  {Object} doc
     * @param  {Boolean} quiet
     * @return {Promise}
     */

  }, {
    key: 'insert',
    value: function insert(doc) {
      var _this2 = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      // Prepare document for insertion
      var randomId = this.idGenerator(this.modelName);
      doc = this.create(doc);
      doc._id = doc._id || randomId.value;

      // Fire sync event
      if (!options.quiet) {
        this.emit('sync:insert', doc, randomId);
      }

      // Add to indexes and persist
      return this.indexManager.indexDocument(doc).then(function () {
        return _this2.storageManager.persist(doc._id, doc).then(function () {
          _this2.emit('insert', doc, null, randomId);
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

  }, {
    key: 'insertAll',
    value: function insertAll(docs, options) {
      var _this3 = this;

      return Promise.all((0, _map3.default)(docs, function (d) {
        return _this3.insert(d, options);
      }));
    }

    /**
     * Remove an object (or objects with options.multi)
     * from the model.
     * @param  {Object} query
     * @param  {Object} options
     * @param  {Boolean} quiet
     * @return {Promise}
     */

  }, {
    key: 'remove',
    value: function remove(query) {
      var _this4 = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      // Fire sync event
      if (!options.quiet) {
        this.emit('sync:remove', query, options);
      }

      // Remove locally
      return this.find(query).exec().then(function (docs) {
        (0, _invariant2.default)(docs.length <= 1 || options.multi, 'remove(..): multi removing is not enabled by options.multi');

        var removeStorgePromises = (0, _map3.default)(docs, function (d) {
          return _this4.storageManager.delete(d._id);
        });
        var removeIndexPromises = (0, _map3.default)(docs, function (d) {
          return _this4.indexManager.deindexDocument(d);
        });
        var allPromises = removeStorgePromises.concat(removeIndexPromises);

        return Promise.all(allPromises).then(function () {
          (0, _forEach2.default)(docs, function (d) {
            return _this4.emit('remove', null, d);
          });
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

  }, {
    key: 'update',
    value: function update(query, modifier) {
      var _this5 = this;

      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      options.upsert = false;

      // Fire sync event
      if (!options.quiet) {
        this.emit('sync:update', query, modifier, options);
      }

      // Update locally
      return new _DocumentModifier2.default(this, query).modify(modifier, options).then(function (result) {
        var original = result.original;
        var updated = result.updated;

        updated = (0, _map3.default)(updated, function (x) {
          return _this5.create(x);
        });

        var updateStorgePromises = (0, _map3.default)(updated, function (d) {
          return _this5.storageManager.persist(d._id, d);
        });
        var updateIndexPromises = (0, _map3.default)(updated, function (d, i) {
          return _this5.indexManager.reindexDocument(original[i], d);
        });
        var allPromises = updateStorgePromises.concat(updateIndexPromises);

        return Promise.all(allPromises).then(function () {
          (0, _forEach2.default)(updated, function (d, i) {
            _this5.emit('update', d, original[i]);
          });
          return {
            modified: updated.length,
            original: original,
            updated: updated
          };
        });
      });
    }

    /**
     * Return all currently indexed ids
     * @return {Array}
     */

  }, {
    key: 'getIndexIds',
    value: function getIndexIds() {
      return this.indexes._id.getAll();
    }

    /**
     * Make a cursor with given query and return
     * @param  {Object} query
     * @return {CursorObservable}
     */

  }, {
    key: 'find',
    value: function find(query) {
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

  }, {
    key: 'findOne',
    value: function findOne(query, sortObj) {
      return this.find(query).sort(sortObj).limit(1).aggregate(function (docs) {
        return docs[0];
      });
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

  }, {
    key: 'count',
    value: function count(query) {
      return this.ids(query).then(function (ids) {
        return ids.length;
      });
    }

    /**
     * Return a list of ids by given query. Uses only
     * indexes.
     * @param  {Object} query
     * @return {Promise}
     */

  }, {
    key: 'ids',
    value: function ids(query) {
      return new _defaultCursorClass(this, query).ids();
    }
  }, {
    key: 'modelName',
    get: function get() {
      return this._modelName;
    }
  }, {
    key: 'indexes',
    get: function get() {
      return this.indexManager.indexes;
    }
  }, {
    key: 'storage',
    get: function get() {
      return this.storageManager;
    }
  }], [{
    key: 'defaultStorageManager',
    value: function defaultStorageManager(managerClass) {
      _defaultStorageManager = managerClass;
    }
  }, {
    key: 'defaultIdGenerator',
    value: function defaultIdGenerator(generator) {
      _defaultIdGenerator = generator;
    }
  }, {
    key: 'defaultCursorClass',
    value: function defaultCursorClass(cursorClass) {
      _defaultCursorClass = cursorClass;
    }
  }]);

  return Collection;
})(_eventemitter2.default);

exports.default = Collection;

},{"./CursorObservable":5,"./Document":6,"./DocumentModifier":8,"./IndexManager":12,"./Random":14,"./StorageManager":15,"eventemitter3":18,"fast.js/forEach":24,"fast.js/map":26,"invariant":33}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollectionIndex = undefined;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var CollectionIndex = exports.CollectionIndex = (function () {
  function CollectionIndex() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, CollectionIndex);

    (0, _invariant2.default)(options.fieldName, 'CollectionIndex(...): you must specify a "feildName" option');
    (0, _invariant2.default)(!Array.isArray(options.fieldName), 'CollectionIndex(...): compound index is not supported yet');

    this.fieldName = options.fieldName;
    this.unique = options.unique || false;
    this.sparse = options.sparse || false;

    this.reset();
  }

  _createClass(CollectionIndex, [{
    key: 'reset',
    value: function reset() {
      // TODO
    }
  }, {
    key: 'insert',
    value: function insert(doc) {
      // TODO
    }
  }, {
    key: 'remove',
    value: function remove(doc) {
      // TODO
    }
  }, {
    key: 'update',
    value: function update(oldDoc, newDoc) {
      // TODO
    }
  }, {
    key: 'getMatching',
    value: function getMatching(value) {
      // TODO
    }
  }, {
    key: 'getBetweenBounds',
    value: function getBetweenBounds(query) {
      // TODO
    }
  }, {
    key: 'getAll',
    value: function getAll(options) {
      // TODO
    }
  }]);

  return CollectionIndex;
})();

exports.default = CollectionIndex;

},{"invariant":33}],4:[function(require,module,exports){
'use strict';

function _typeof2(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

var _PIPELINE_PROCESSORS;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cursor = exports.PIPELINE_PROCESSORS = exports.PIPELINE_TYPE = undefined;

var _forEach = require('fast.js/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _map2 = require('fast.js/map');

var _map3 = _interopRequireDefault(_map2);

var _checkTypes = require('check-types');

var _checkTypes2 = _interopRequireDefault(_checkTypes);

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _keymirror = require('keymirror');

var _keymirror2 = _interopRequireDefault(_keymirror);

var _DocumentRetriver = require('./DocumentRetriver');

var _DocumentRetriver2 = _interopRequireDefault(_DocumentRetriver);

var _DocumentMatcher = require('./DocumentMatcher');

var _DocumentMatcher2 = _interopRequireDefault(_DocumentMatcher);

var _DocumentSorter = require('./DocumentSorter');

var _DocumentSorter2 = _interopRequireDefault(_DocumentSorter);

var _EJSON = require('./EJSON');

var _EJSON2 = _interopRequireDefault(_EJSON);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _typeof(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof2(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }return obj;
}

// Maker used for stopping pipeline processing
var PIPLEINE_STOP_MARKER = {};

// Pipeline processors definition
var PIPELINE_TYPE = exports.PIPELINE_TYPE = (0, _keymirror2.default)({
  Filter: null,
  Sort: null,
  Map: null,
  Aggregate: null,
  Reduce: null,
  Join: null,
  JoinEach: null,
  JoinAll: null,
  IfNotEmpty: null
});

var PIPELINE_PROCESSORS = exports.PIPELINE_PROCESSORS = (_PIPELINE_PROCESSORS = {}, _defineProperty(_PIPELINE_PROCESSORS, PIPELINE_TYPE.Filter, function (docs, pipeObj) {
  return docs.filter(pipeObj.value);
}), _defineProperty(_PIPELINE_PROCESSORS, PIPELINE_TYPE.Sort, function (docs, pipeObj) {
  return docs.sort(pipeObj.value);
}), _defineProperty(_PIPELINE_PROCESSORS, PIPELINE_TYPE.Map, function (docs, pipeObj) {
  return docs.map(pipeObj.value);
}), _defineProperty(_PIPELINE_PROCESSORS, PIPELINE_TYPE.Aggregate, function (docs, pipeObj) {
  return pipeObj.value(docs);
}), _defineProperty(_PIPELINE_PROCESSORS, PIPELINE_TYPE.Reduce, function (docs, pipeObj) {
  return docs.reduce(pipeObj.value, pipeObj.args[0]);
}), _defineProperty(_PIPELINE_PROCESSORS, PIPELINE_TYPE.Join, function (docs, pipeObj, cursor) {
  if (_checkTypes2.default.array(docs)) {
    return PIPELINE_PROCESSORS[PIPELINE_TYPE.JoinEach](docs, pipeObj, cursor);
  } else {
    return PIPELINE_PROCESSORS[PIPELINE_TYPE.JoinAll](docs, pipeObj, cursor);
  }
}), _defineProperty(_PIPELINE_PROCESSORS, PIPELINE_TYPE.JoinEach, function (docs, pipeObj, cursor) {
  docs = _checkTypes2.default.array(docs) ? docs : [docs];
  var docsLength = docs.length;
  return Promise.all((0, _map3.default)(docs, function (x, i) {
    return PIPELINE_PROCESSORS[PIPELINE_TYPE.JoinAll](x, pipeObj, cursor, i, docsLength);
  }));
}), _defineProperty(_PIPELINE_PROCESSORS, PIPELINE_TYPE.JoinAll, function (docs, pipeObj, cursor) {
  var i = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
  var len = arguments.length <= 4 || arguments[4] === undefined ? 1 : arguments[4];

  var updatedFn = cursor._propagateUpdate ? cursor._propagateUpdate.bind(cursor) : function () {};

  var res = pipeObj.value(docs, updatedFn, i, len);
  res = _checkTypes2.default.array(res) ? res : [res];

  (0, _forEach2.default)(res, function (observeStopper) {
    if (_checkTypes2.default.object(observeStopper) && observeStopper.then) {
      if (observeStopper.parent) {
        observeStopper.parent(cursor);
        cursor.once('stopped', observeStopper.stop);
        cursor.once('cursorChanged', observeStopper.stop);
      }
    }
  });

  return Promise.all(res).then(function () {
    return docs;
  });
}), _defineProperty(_PIPELINE_PROCESSORS, PIPELINE_TYPE.IfNotEmpty, function (docs) {
  var isEmptyRes = !_checkTypes2.default.assigned(docs) || _checkTypes2.default.array(docs) && _checkTypes2.default.emptyArray(docs) || _checkTypes2.default.object(docs) && _checkTypes2.default.emptyObject(docs);
  return isEmptyRes ? PIPLEINE_STOP_MARKER : docs;
}), _PIPELINE_PROCESSORS);

/**
 * Class for storing information about query
 * and executing it. It also have a sugar like
 * map/reduce, aggregation and others for making
 * fully customizable response
 */

var Cursor = (function (_EventEmitter) {
  _inherits(Cursor, _EventEmitter);

  function Cursor(db, query) {
    _classCallCheck(this, Cursor);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Cursor).call(this));

    _this.db = db;
    _this._query = query;
    _this._pipeline = [];
    _this._executing = null;
    _this._ensureMatcherSorter();
    return _this;
  }

  _createClass(Cursor, [{
    key: 'skip',
    value: function skip(_skip) {
      this._ensureNotExecuting();
      (0, _invariant2.default)(_skip >= 0 || typeof _skip === 'undefined', 'skip(...): skip must be a positive number');

      this._skip = _skip;
      return this;
    }
  }, {
    key: 'limit',
    value: function limit(_limit) {
      this._ensureNotExecuting();
      (0, _invariant2.default)(_limit >= 0 || typeof _limit === 'undefined', 'limit(...): limit must be a positive number');

      this._limit = _limit;
      return this;
    }
  }, {
    key: 'find',
    value: function find(query) {
      this._ensureNotExecuting();
      this._query = query || this._query;
      this._ensureMatcherSorter();
      return this;
    }
  }, {
    key: 'sort',
    value: function sort(sortObj) {
      this._ensureNotExecuting();
      (0, _invariant2.default)((typeof sortObj === 'undefined' ? 'undefined' : _typeof(sortObj)) === 'object' || typeof sortObj === 'undefined' || Array.isArray(sortObj), 'sort(...): argument must be an object');

      this._sort = sortObj;
      this._ensureMatcherSorter();
      return this;
    }
  }, {
    key: 'sortFunc',
    value: function sortFunc(sortFn) {
      (0, _invariant2.default)(typeof sortFn === 'function', 'sortFunc(...): argument must be a function');

      this.addPipeline(PIPELINE_TYPE.Sort, sortFn);
      return this;
    }
  }, {
    key: 'filter',
    value: function filter(filterFn) {
      (0, _invariant2.default)(typeof filterFn === 'function', 'filter(...): argument must be a function');

      this.addPipeline(PIPELINE_TYPE.Filter, filterFn);
      return this;
    }
  }, {
    key: 'map',
    value: function map(mapperFn) {
      (0, _invariant2.default)(typeof mapperFn === 'function', 'map(...): mapper must be a function');

      this.addPipeline(PIPELINE_TYPE.Map, mapperFn);
      return this;
    }
  }, {
    key: 'reduce',
    value: function reduce(reduceFn, initial) {
      (0, _invariant2.default)(typeof reduceFn === 'function', 'reduce(...): reducer argument must be a function');

      this.addPipeline(PIPELINE_TYPE.Reduce, reduceFn, initial);
      return this;
    }
  }, {
    key: 'aggregate',
    value: function aggregate(aggrFn) {
      (0, _invariant2.default)(typeof aggrFn === 'function', 'aggregate(...): aggregator must be a function');

      this.addPipeline(PIPELINE_TYPE.Aggregate, aggrFn);
      return this;
    }
  }, {
    key: 'join',
    value: function join(joinFn) {
      (0, _invariant2.default)(typeof joinFn === 'function', 'join(...): argument must be a function');

      this.addPipeline(PIPELINE_TYPE.Join, joinFn);
      return this;
    }
  }, {
    key: 'joinEach',
    value: function joinEach(joinFn) {
      (0, _invariant2.default)(typeof joinFn === 'function', 'joinEach(...): argument must be a function');

      this.addPipeline(PIPELINE_TYPE.JoinEach, joinFn);
      return this;
    }
  }, {
    key: 'joinAll',
    value: function joinAll(joinFn) {
      (0, _invariant2.default)(typeof joinFn === 'function', 'joinAll(...): argument must be a function');

      this.addPipeline(PIPELINE_TYPE.JoinAll, joinFn);
      return this;
    }
  }, {
    key: 'ifNotEmpty',
    value: function ifNotEmpty() {
      this.addPipeline(PIPELINE_TYPE.IfNotEmpty);
      return this;
    }
  }, {
    key: 'addPipeline',
    value: function addPipeline(type, val) {
      this._ensureNotExecuting();
      (0, _invariant2.default)(type && PIPELINE_TYPE[type], 'Unknown pipeline processor type %s', type);

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      this._pipeline.push({
        type: type,
        value: val,
        args: args || []
      });
      return this;
    }
  }, {
    key: 'processPipeline',
    value: function processPipeline(docs) {
      var _this2 = this;

      var i = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      var pipeObj = this._pipeline[i];
      if (!pipeObj) {
        return Promise.resolve(docs);
      } else {
        return Promise.resolve(PIPELINE_PROCESSORS[pipeObj.type](docs, pipeObj, this)).then(function (result) {
          if (result === PIPLEINE_STOP_MARKER) {
            return result;
          } else {
            return _this2.processPipeline(result, i + 1);
          }
        });
      }
    }
  }, {
    key: 'processSkipLimits',
    value: function processSkipLimits(docs) {
      var skip = this._skip || 0;
      var limit = this._limit || docs.length;
      return docs.slice(skip, limit + skip);
    }
  }, {
    key: 'exec',
    value: function exec() {
      var _this3 = this;

      this._executing = this._matchObjects().then(function (docs) {
        var clonned = (0, _map3.default)(docs, function (doc) {
          return _EJSON2.default.clone(doc);
        });
        return _this3.processPipeline(clonned);
      }).then(function (docs) {
        _this3._executing = null;
        return docs;
      });

      return this._executing;
    }
  }, {
    key: 'ids',
    value: function ids() {
      var _this4 = this;

      this._executing = this._matchObjects().then(function (docs) {
        return (0, _map3.default)(docs, function (x) {
          return x._id;
        });
      }).then(function (ids) {
        _this4._executing = null;
        return ids;
      });

      return this._executing;
    }
  }, {
    key: 'then',
    value: function then(resolve, reject) {
      return this.exec().then(resolve, reject);
    }
  }, {
    key: 'whenNotExecuting',
    value: function whenNotExecuting() {
      return Promise.resolve(this._executing);
    }
  }, {
    key: '_matchObjects',
    value: function _matchObjects() {
      var _this5 = this;

      return new _DocumentRetriver2.default(this.db).retriveForQeury(this._query).then(function (docs) {
        var results = [];
        var withFastLimit = _this5._limit && !_this5._skip && !_this5._sorter;

        (0, _forEach2.default)(docs, function (d) {
          var match = _this5._matcher.documentMatches(d);
          if (match.result) {
            results.push(d);
          }
          if (withFastLimit && results.length === _this5._limit) {
            return false;
          }
        });

        if (withFastLimit) {
          return results;
        }

        if (_this5._sorter) {
          var comparator = _this5._sorter.getComparator();
          results.sort(comparator);
        }

        return _this5.processSkipLimits(results);
      });
    }
  }, {
    key: '_ensureMatcherSorter',
    value: function _ensureMatcherSorter() {
      this._sorter = undefined;
      this._matcher = new _DocumentMatcher2.default(this._query || {});

      if (this._matcher.hasGeoQuery || this._sort) {
        this._sorter = new _DocumentSorter2.default(this._sort || [], { matcher: this._matcher });
      }
    }
  }, {
    key: '_ensureNotExecuting',
    value: function _ensureNotExecuting() {
      (0, _invariant2.default)(!this.isExecuting, '_ensureNotExecuting(...): cursor is executing, cursor is immutable!');
    }
  }, {
    key: 'isExecuting',
    get: function get() {
      return !!this._executing;
    }
  }]);

  return Cursor;
})(_eventemitter2.default);

exports.Cursor = Cursor;
exports.default = Cursor;

},{"./DocumentMatcher":7,"./DocumentRetriver":9,"./DocumentSorter":10,"./EJSON":11,"check-types":17,"eventemitter3":18,"fast.js/forEach":24,"fast.js/map":26,"invariant":33,"keymirror":32}],5:[function(require,module,exports){
'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CursorObservable = undefined;
exports.debounce = debounce;

var _checkTypes = require('check-types');

var _checkTypes2 = _interopRequireDefault(_checkTypes);

var _map2 = require('fast.js/map');

var _map3 = _interopRequireDefault(_map2);

var _keys2 = require('fast.js/object/keys');

var _keys3 = _interopRequireDefault(_keys2);

var _Cursor2 = require('./Cursor');

var _Cursor3 = _interopRequireDefault(_Cursor2);

var _EJSON = require('./EJSON');

var _EJSON2 = _interopRequireDefault(_EJSON);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * Observable cursor is used for making request auto-updatable
 * after some changes is happen in a database.
 */

var CursorObservable = (function (_Cursor) {
  _inherits(CursorObservable, _Cursor);

  function CursorObservable(db, query) {
    _classCallCheck(this, CursorObservable);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CursorObservable).call(this, db, query));

    _this.update = debounce(_this.update.bind(_this), 1000 / 15, 10);
    _this.maybeUpdate = _this.maybeUpdate.bind(_this);
    return _this;
  }

  /**
   * Change a batch size of updater.
   * Btach size is a number of changes must be happen
   * in debounce interval to force execute debounced
   * function (update a result, in our case)
   *
   * @param  {Number} batchSize
   * @return {CursorObservable}
   */

  _createClass(CursorObservable, [{
    key: 'batchSize',
    value: function batchSize(_batchSize) {
      this.update.updateBatchSize(_batchSize);
      return this;
    }

    /**
     * Change debounce wait time of the updater
     * @param  {Number} waitTime
     * @return {CursorObservable}
     */

  }, {
    key: 'debounce',
    value: function debounce(waitTime) {
      this.update.updateWait(waitTime);
      return this;
    }

    /**
     * Observe changes of the cursor.
     * It returns a Stopper – Promise with `stop` function.
     * It is been resolved when first result of cursor is ready and
     * after first observe listener call.
     *
     * if `options.declare` is true, then initial update of
     * the cursor is not initiated and function will return
     * `this` instead promise. It means, that you can't stop
     * observer by a stopper object. Use `stopObservers()`
     * function instead.
     *
     * @param  {Function}
     * @param  {Object} options
     * @param  {Boolean} options.declare
     * @return {Stopper}
     */

  }, {
    key: 'observe',
    value: function observe(listener) {
      var _this2 = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      // Make new wrapper for make possible to observe
      // multiple times (for removeListener)
      var updateWrapper = function updateWrapper(a, b) {
        return _this2.maybeUpdate(a, b);
      };
      this.db.on('insert', updateWrapper);
      this.db.on('update', updateWrapper);
      this.db.on('remove', updateWrapper);

      var stopper = function stopper() {
        _this2.db.removeListener('insert', updateWrapper);
        _this2.db.removeListener('update', updateWrapper);
        _this2.db.removeListener('remove', updateWrapper);
        _this2.removeListener('update', listener);
        _this2.emit('stopped', listener);
      };

      listener = this._prepareListener(listener);
      this.on('update', listener);
      this.on('stop', stopper);

      var parentSetter = function parentSetter(cursor) {
        _this2._parentCursor = cursor;
      };

      var cursorThenGenerator = function cursorThenGenerator(currPromise) {
        return function (successFn, failFn) {
          successFn = _this2._prepareListener(successFn);
          return createStoppablePromise(currPromise.then(successFn, failFn));
        };
      };

      var createStoppablePromise = function createStoppablePromise(currPromise) {
        return {
          parent: parentSetter,
          stop: stopper,
          then: cursorThenGenerator(currPromise)
        };
      };

      if (options.declare) {
        return this;
      } else {
        var firstUpdatePromise = this.update(true);
        return createStoppablePromise(firstUpdatePromise);
      }
    }

    /**
     * Stop all observers of the cursor by one call
     * of this function.
     * It also stops any delaied update of the cursor.
     */

  }, {
    key: 'stopObservers',
    value: function stopObservers() {
      this.update.cancel();
      this.emit('stop');
    }

    /**
     * Update a cursor result. Debounced function,
     * return a Promise that resolved when cursor
     * is updated.
     * @return {Promise}
     */

  }, {
    key: 'update',
    value: function update() {
      var _this3 = this;

      var firstRun = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      return this.exec().then(function (result) {
        _this3._latestResult = result;
        _this3._updateLatestIds();
        _this3._propagateUpdate(firstRun);
        return result;
      });
    }

    /**
     * Consider to update a query by given newDoc and oldDoc,
     * received form insert/udpate/remove oparation.
     * Should make a decision as smart as possible.
     * (Don't update a cursor if it does not change a result
     * of a cursor)
     *
     * TODO we should update _latestResult by hands in some cases
     *      without a calling of `update` method
     *
     * @param  {Object} newDoc
     * @param  {Object} oldDoc
     */

  }, {
    key: 'maybeUpdate',
    value: function maybeUpdate(newDoc, oldDoc) {
      // When it's remove operation we just check
      // that it's in our latest result ids list
      var removedFromResult = !newDoc && oldDoc && (!this._latestIds || this._latestIds.has(oldDoc._id));

      // When it's an update operation we check four things
      // 1. Is a new doc or old doc matched by a query?
      // 2. Is a new doc has different number of fields then an old doc?
      // 3. Is a new doc has a greater updatedAt time then an old doc?
      // 4. Is a new doc not equals to an old doc?
      var updatedInResult = removedFromResult || newDoc && oldDoc && (this._matcher.documentMatches(newDoc).result || this._matcher.documentMatches(oldDoc).result) && ((0, _keys3.default)(newDoc).length !== (0, _keys3.default)(oldDoc).length || newDoc.updatedAt && (!oldDoc.updatedAt || oldDoc.updatedAt && newDoc.updatedAt > oldDoc.updatedAt) || !_EJSON2.default.equals(newDoc, oldDoc));

      // When it's an insert operation we just check
      // it's match a query
      var insertedInResult = updatedInResult || newDoc && !oldDoc && this._matcher.documentMatches(newDoc).result;

      if (insertedInResult) {
        this.emit('cursorChanged');
        return this.update();
      }
    }

    /**
     * Preapare a listener of updates. By default it just debounce
     * it a little for no useless updates when update propagated
     * from children cursors.
     * It also applied to successFn of `then` of returned by
     * `observer` stoper object.
     * @param  {Function} listener
     * @return {Promise}
     */

  }, {
    key: '_prepareListener',
    value: function _prepareListener(listener) {
      // Debounce listener a little for update propagation
      // when joins updated
      return debounce(listener, 0, 0);
    }

    /**
     * Emits an update event with current result of a cursor
     * and call this method on parent cursor if it exists
     * and if it is not first run of update.
     */

  }, {
    key: '_propagateUpdate',
    value: function _propagateUpdate() {
      var firstRun = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      this.emit('update', this._latestResult, firstRun);
      if (!firstRun && this._parentCursor && this._parentCursor._propagateUpdate) {
        this._parentCursor._propagateUpdate(false);
      }
    }

    /**
     * By a `_latestResult` update a `_latestIds` field of
     * the object
     */

  }, {
    key: '_updateLatestIds',
    value: function _updateLatestIds() {
      if (_checkTypes2.default.array(this._latestResult)) {
        this._latestIds = new Set((0, _map3.default)(this._latestResult, function (x) {
          return x._id;
        }));
      } else if (this._latestResult && this._latestResult._id) {
        this._latestIds = new Set([this._latestResult._id]);
      }
    }
  }]);

  return CursorObservable;
})(_Cursor3.default);

/**
 * Debounce with updetable wait time and force
 * execution on some number of calls (batch execution)
 * Return promise that resolved with result of execution.
 * Promise cerated on each new execution (on idle).
 * @param  {Function} func
 * @param  {Number} wait
 * @param  {Number} batchSize
 * @return {Promise}
 */

exports.CursorObservable = CursorObservable;
function debounce(func, wait, batchSize) {
  var timeout = null;
  var callsCount = 0;
  var promise = null;
  var doNotResolve = true;
  var maybeResolve = null;

  var debouncer = function debouncer() {
    var context = this;
    var args = arguments;

    if (!promise) {
      promise = new Promise(function (resolve, reject) {
        maybeResolve = function () {
          if (doNotResolve) {
            timeout = setTimeout(maybeResolve, wait);
            doNotResolve = false;
          } else {
            promise = null;
            callsCount = 0;
            timeout = null;
            doNotResolve = true;
            maybeResolve = null;
            resolve(func.apply(context, args));
          }
        };
        maybeResolve();
      });
    } else {
      var callNow = batchSize && callsCount >= batchSize;
      doNotResolve = !callNow;

      if (callNow && maybeResolve) {
        clearTimeout(timeout);
        maybeResolve();
      }
    }

    callsCount += 1;
    return promise;
  };

  var updateBatchSize = function updateBatchSize(newBatchSize) {
    batchSize = newBatchSize;
  };

  var updateWait = function updateWait(newWait) {
    wait = newWait;
  };

  var cancel = function cancel() {
    clearTimeout(timeout);
  };

  debouncer.updateBatchSize = updateBatchSize;
  debouncer.updateWait = updateWait;
  debouncer.cancel = cancel;
  return debouncer;
}

exports.default = CursorObservable;

},{"./Cursor":4,"./EJSON":11,"check-types":17,"fast.js/map":26,"fast.js/object/keys":29}],6:[function(require,module,exports){
'use strict';

function _typeof2(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MongoTypeComp = undefined;
exports.Document = Document;
exports.selectorIsId = selectorIsId;
exports.selectorIsIdPerhapsAsObject = selectorIsIdPerhapsAsObject;
exports.isArray = isArray;
exports.isPlainObject = isPlainObject;
exports.isIndexable = isIndexable;
exports.isOperatorObject = isOperatorObject;
exports.isNumericKey = isNumericKey;

var _assign2 = require('fast.js/object/assign');

var _assign3 = _interopRequireDefault(_assign2);

var _checkTypes = require('check-types');

var _checkTypes2 = _interopRequireDefault(_checkTypes);

var _forEach = require('fast.js/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _keys2 = require('fast.js/object/keys');

var _keys3 = _interopRequireDefault(_keys2);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _EJSON = require('./EJSON');

var _EJSON2 = _interopRequireDefault(_EJSON);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _typeof(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
}

/*
 * Instance of a model (Document)
 * It delegates some useful methods to a given
 * collection object(`remove`, `update`).
 */
function Document(db) {
  var _this = this;

  var raw = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  (0, _invariant2.default)(db, 'Document(...): you must give a collection for the document');

  // Ensure raw object
  raw = _checkTypes2.default.string(raw) ? _EJSON2.default.parse(raw) : raw;

  // Define internal methods
  Object.defineProperty(this, 'remove', {
    value: function value() {
      (0, _invariant2.default)(_this._id, 'remove(...): document must have an _id for remove');
      return db.remove({ _id: self._id });
    },
    writable: false
  });

  Object.defineProperty(this, 'update', {
    value: function value(modifier) {
      (0, _invariant2.default)(this._id, 'update(...): document must have an _id for update');
      return db.update({ _id: self._id }, modifier);
    },
    writable: false
  });

  Object.defineProperty(this, 'copy', {
    value: function value() {
      return new Document(db, _EJSON2.default.clone(_this));
    },
    writable: false
  });

  Object.defineProperty(this, 'serialize', {
    value: function value() {
      return _EJSON2.default.stringify(_this);
    },
    writable: false
  });

  // Special methods from collection
  for (var method in db._methods) {
    Object.defineProperty(this, method, {
      value: db._methods[method],
      writable: false
    });
  }

  // Move given raw object to a Document
  (0, _assign3.default)(this, raw);
}

exports.default = Document;

/**
 * Return true if given selector is an
 * object id type (string or number)
 * @param  {Mixed} selector
 * @return {Boolean}
 */

function selectorIsId(selector) {
  return typeof selector === 'string' || typeof selector === 'number';
}

function selectorIsIdPerhapsAsObject(selector) {
  return selectorIsId(selector) || selector && (typeof selector === 'undefined' ? 'undefined' : _typeof(selector)) === 'object' && selector._id && selectorIsId(selector._id) && (0, _keys3.default)(selector).length === 1;
}

// Like _isArray, but doesn't regard polyfilled Uint8Arrays on old browsers as
// arrays.
// XXX maybe this should be EJSON.isArray
function isArray(x) {
  return _checkTypes2.default.array(x) && !_EJSON2.default.isBinary(x);
}

// XXX maybe this should be EJSON.isObject, though EJSON doesn't know about
// RegExp
// XXX note that _type(undefined) === 3!!!!
function isPlainObject(x) {
  return x && MongoTypeComp._type(x) === 3;
}

function isIndexable(x) {
  return isArray(x) || isPlainObject(x);
}

// Returns true if this is an object with at least one key and all keys begin
// with $.  Unless inconsistentOK is set, throws if some keys begin with $ and
// others don't.
function isOperatorObject(valueSelector, inconsistentOK) {
  if (!isPlainObject(valueSelector)) {
    return false;
  }

  var theseAreOperators = undefined;
  (0, _forEach2.default)(valueSelector, function (value, selKey) {
    var thisIsOperator = selKey.substr(0, 1) === '$';
    if (theseAreOperators === undefined) {
      theseAreOperators = thisIsOperator;
    } else if (theseAreOperators !== thisIsOperator) {
      if (!inconsistentOK) {
        throw new Error('Inconsistent operator: ' + JSON.stringify(valueSelector));
      }
      theseAreOperators = false;
    }
  });
  return !!theseAreOperators; // {} has no operators
}

// string can be converted to integer
function isNumericKey(s) {
  return (/^[0-9]+$/.test(s)
  );
}

// helpers used by compiled selector code
var MongoTypeComp = exports.MongoTypeComp = {
  // XXX for _all and _in, consider building 'inquery' at compile time..

  _type: function _type(v) {
    if (typeof v === 'number') {
      return 1;
    } else if (typeof v === 'string') {
      return 2;
    } else if (typeof v === 'boolean') {
      return 8;
    } else if (isArray(v)) {
      return 4;
    } else if (v === null) {
      return 10;
    } else if (v instanceof RegExp) {
      // note that typeof(/x/) === 'object'
      return 11;
    } else if (typeof v === 'function') {
      return 13;
    } else if (v instanceof Date) {
      return 9;
    } else if (_EJSON2.default.isBinary(v)) {
      return 5;
    }
    return 3; // object

    // XXX support some/all of these:
    // 14, symbol
    // 15, javascript code with scope
    // 16, 18: 32-bit/64-bit integer
    // 17, timestamp
    // 255, minkey
    // 127, maxkey
  },

  // deep equality test: use for literal document and array matches
  _equal: function _equal(a, b) {
    return _EJSON2.default.equals(a, b, { keyOrderSensitive: true });
  },

  // maps a type code to a value that can be used to sort values of
  // different types
  _typeorder: function _typeorder(t) {
    // http://www.mongodb.org/display/DOCS/What+is+the+Compare+Order+for+BSON+Types
    // XXX what is the correct sort position for Javascript code?
    // ('100' in the matrix below)
    // XXX minkey/maxkey
    return [-1, // (not a type)
    1, // number
    2, // string
    3, // object
    4, // array
    5, // binary
    -1, // deprecated
    6, // ObjectID
    7, // bool
    8, // Date
    0, // null
    9, // RegExp
    -1, // deprecated
    100, // JS code
    2, // deprecated (symbol)
    100, // JS code
    1, // 32-bit int
    8, // Mongo timestamp
    1][// 64-bit int
    t];
  },

  // compare two values of unknown type according to BSON ordering
  // semantics. (as an extension, consider 'undefined' to be less than
  // any other value.) return negative if a is less, positive if b is
  // less, or 0 if equal
  _cmp: function _cmp(a, b) {
    if (a === undefined) {
      return b === undefined ? 0 : -1;
    }
    if (b === undefined) {
      return 1;
    }
    var ta = MongoTypeComp._type(a);
    var tb = MongoTypeComp._type(b);
    var oa = MongoTypeComp._typeorder(ta);
    var ob = MongoTypeComp._typeorder(tb);
    if (oa !== ob) {
      return oa < ob ? -1 : 1;
    }
    if (ta !== tb) {
      // XXX need to implement this if we implement Symbol or integers, or
      // Timestamp
      throw Error('Missing type coercion logic in _cmp');
    }
    if (ta === 7) {
      // ObjectID
      // Convert to string.
      ta = tb = 2;
      a = a.toHexString();
      b = b.toHexString();
    }
    if (ta === 9) {
      // Date
      // Convert to millis.
      ta = tb = 1;
      a = a.getTime();
      b = b.getTime();
    }

    if (ta === 1) {
      // double
      return a - b;
    }
    if (tb === 2) {
      // string
      return a < b ? -1 : a === b ? 0 : 1;
    }
    if (ta === 3) {
      // Object
      // this could be much more efficient in the expected case ...
      var to_array = function to_array(obj) {
        var ret = [];
        for (var key in obj) {
          ret.push(key);
          ret.push(obj[key]);
        }
        return ret;
      };
      return MongoTypeComp._cmp(to_array(a), to_array(b));
    }
    if (ta === 4) {
      // Array
      for (var i = 0;; i++) {
        if (i === a.length) {
          return i === b.length ? 0 : -1;
        }
        if (i === b.length) {
          return 1;
        }
        var s = MongoTypeComp._cmp(a[i], b[i]);
        if (s !== 0) {
          return s;
        }
      }
    }
    if (ta === 5) {
      // binary
      // Surprisingly, a small binary blob is always less than a large one in
      // Mongo.
      if (a.length !== b.length) {
        return a.length - b.length;
      }
      for (i = 0; i < a.length; i++) {
        if (a[i] < b[i]) {
          return -1;
        }
        if (a[i] > b[i]) {
          return 1;
        }
      }
      return 0;
    }
    if (ta === 8) {
      // boolean
      if (a) {
        return b ? 0 : 1;
      }
      return b ? -1 : 0;
    }
    if (ta === 10) {
      // null
      return 0;
    }
    if (ta === 11) {
      // regexp
      throw Error('Sorting not supported on regular expression'); // XXX
    }
    // 13: javascript code
    // 14: symbol
    // 15: javascript code with scope
    // 16: 32-bit integer
    // 17: timestamp
    // 18: 64-bit integer
    // 255: minkey
    // 127: maxkey
    if (ta === 13) {
      // javascript code
      throw Error('Sorting not supported on Javascript code'); // XXX
    }
    throw Error('Unknown type to sort');
  }
};

},{"./EJSON":11,"check-types":17,"fast.js/forEach":24,"fast.js/object/assign":27,"fast.js/object/keys":29,"invariant":33}],7:[function(require,module,exports){
'use strict';

function _typeof2(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ELEMENT_OPERATORS = exports.DocumentMatcher = undefined;
exports.regexpElementMatcher = regexpElementMatcher;
exports.equalityElementMatcher = equalityElementMatcher;
exports.makeLookupFunction = makeLookupFunction;
exports.expandArraysInBranches = expandArraysInBranches;

var _checkTypes = require('check-types');

var _checkTypes2 = _interopRequireDefault(_checkTypes);

var _forEach = require('fast.js/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _keys2 = require('fast.js/object/keys');

var _keys3 = _interopRequireDefault(_keys2);

var _map2 = require('fast.js/map');

var _map3 = _interopRequireDefault(_map2);

var _some2 = require('fast.js/array/some');

var _some3 = _interopRequireDefault(_some2);

var _every2 = require('fast.js/array/every');

var _every3 = _interopRequireDefault(_every2);

var _indexOf2 = require('fast.js/array/indexOf');

var _indexOf3 = _interopRequireDefault(_indexOf2);

var _geojsonUtils = require('geojson-utils');

var _geojsonUtils2 = _interopRequireDefault(_geojsonUtils);

var _EJSON = require('./EJSON');

var _EJSON2 = _interopRequireDefault(_EJSON);

var _Document = require('./Document');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _typeof(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

// The minimongo selector compiler!

// Terminology:
//  - a 'selector' is the EJSON object representing a selector
//  - a 'matcher' is its compiled form (whether a full Minimongo.Matcher
//    object or one of the component lambdas that matches parts of it)
//  - a 'result object' is an object with a 'result' field and maybe
//    distance and arrayIndices.
//  - a 'branched value' is an object with a 'value' field and maybe
//    'dontIterate' and 'arrayIndices'.
//  - a 'document' is a top-level object that can be stored in a collection.
//  - a 'lookup function' is a function that takes in a document and returns
//    an array of 'branched values'.
//  - a 'branched matcher' maps from an array of branched values to a result
//    object.
//  - an 'element matcher' maps from a single value to a bool.

// Main entry point.
//   var matcher = new Minimongo.Matcher({a: {$gt: 5}});
//   if (matcher.documentMatches({a: 7})) ...

var DocumentMatcher = exports.DocumentMatcher = (function () {
  function DocumentMatcher(selector) {
    _classCallCheck(this, DocumentMatcher);

    // A set (object mapping string -> *) of all of the document paths looked
    // at by the selector. Also includes the empty string if it may look at any
    // path (eg, $where).
    this._paths = {};
    // Set to true if compilation finds a $near.
    this._hasGeoQuery = false;
    // Set to true if compilation finds a $where.
    this._hasWhere = false;
    // Set to false if compilation finds anything other than a simple equality or
    // one or more of '$gt', '$gte', '$lt', '$lte', '$ne', '$in', '$nin' used with
    // scalars as operands.
    this._isSimple = true;
    // Set to a dummy document which always matches this Matcher. Or set to null
    // if such document is too hard to find.
    this._matchingDocument = undefined;
    // A clone of the original selector. It may just be a function if the user
    // passed in a function; otherwise is definitely an object (eg, IDs are
    // translated into {_id: ID} first. Used by canBecomeTrueByModifier and
    // Sorter._useWithMatcher.
    this._selector = null;
    this._docMatcher = this._compileSelector(selector);
  }

  _createClass(DocumentMatcher, [{
    key: 'documentMatches',
    value: function documentMatches(doc) {
      if (!doc || (typeof doc === 'undefined' ? 'undefined' : _typeof(doc)) !== 'object') {
        throw Error('documentMatches needs a document');
      }
      return this._docMatcher(doc);
    }
  }, {
    key: '_compileSelector',

    // Given a selector, return a function that takes one argument, a
    // document. It returns a result object.
    value: function _compileSelector(selector) {
      // you can pass a literal function instead of a selector
      if (selector instanceof Function) {
        this._isSimple = false;
        this._selector = selector;
        this._recordPathUsed('');
        return function (doc) {
          return { result: !!selector.call(doc) };
        };
      }

      // shorthand -- scalars match _id
      if ((0, _Document.selectorIsId)(selector)) {
        this._selector = { _id: selector };
        this._recordPathUsed('_id');
        return function (doc) {
          return { result: _EJSON2.default.equals(doc._id, selector) };
        };
      }

      // protect against dangerous selectors.  falsey and {_id: falsey} are both
      // likely programmer error, and not what you want, particularly for
      // destructive operations.
      if (!selector || '_id' in selector && !selector._id) {
        this._isSimple = false;
        return nothingMatcher;
      }

      // Top level can't be an array or true or binary.
      if (typeof selector === 'boolean' || (0, _Document.isArray)(selector) || _EJSON2.default.isBinary(selector)) {
        throw new Error('Invalid selector: ' + selector);
      }

      this._selector = _EJSON2.default.clone(selector);
      return compileDocumentSelector(selector, this, { isRoot: true });
    }
  }, {
    key: '_recordPathUsed',
    value: function _recordPathUsed(path) {
      this._paths[path] = true;
    }

    // Returns a list of key paths the given selector is looking for. It includes
    // the empty string if there is a $where.

  }, {
    key: '_getPaths',
    value: function _getPaths() {
      return _checkTypes2.default.object(this._paths) ? (0, _keys3.default)(this._paths) : null;
    }
  }, {
    key: 'hasGeoQuery',
    get: function get() {
      return this._hasGeoQuery;
    }
  }, {
    key: 'hasWhere',
    get: function get() {
      return this._hasWhere;
    }
  }, {
    key: 'isSimple',
    get: function get() {
      return this._isSimple;
    }
  }]);

  return DocumentMatcher;
})();

exports.default = DocumentMatcher;

// Takes in a selector that could match a full document (eg, the original
// selector). Returns a function mapping document->result object.
//
// matcher is the Matcher object we are compiling.
//
// If this is the root document selector (ie, not wrapped in $and or the like),
// then isRoot is true. (This is used by $near.)

var compileDocumentSelector = function compileDocumentSelector(docSelector, matcher) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var docMatchers = [];
  (0, _forEach2.default)(docSelector, function (subSelector, key) {
    if (key.substr(0, 1) === '$') {
      // Outer operators are either logical operators (they recurse back into
      // this function), or $where.
      if (!LOGICAL_OPERATORS.hasOwnProperty(key)) {
        throw new Error('Unrecognized logical operator: ' + key);
      }
      matcher._isSimple = false;
      docMatchers.push(LOGICAL_OPERATORS[key](subSelector, matcher, options.inElemMatch));
    } else {
      // Record this path, but only if we aren't in an elemMatcher, since in an
      // elemMatch this is a path inside an object in an array, not in the doc
      // root.
      if (!options.inElemMatch) {
        matcher._recordPathUsed(key);
      }
      var lookUpByIndex = makeLookupFunction(key);
      var valueMatcher = compileValueSelector(subSelector, matcher, options.isRoot);
      docMatchers.push(function (doc) {
        var branchValues = lookUpByIndex(doc);
        return valueMatcher(branchValues);
      });
    }
  });

  return andDocumentMatchers(docMatchers);
};

// Takes in a selector that could match a key-indexed value in a document; eg,
// {$gt: 5, $lt: 9}, or a regular expression, or any non-expression object (to
// indicate equality).  Returns a branched matcher: a function mapping
// [branched value]->result object.
var compileValueSelector = function compileValueSelector(valueSelector, matcher, isRoot) {
  if (valueSelector instanceof RegExp) {
    matcher._isSimple = false;
    return convertElementMatcherToBranchedMatcher(regexpElementMatcher(valueSelector));
  } else if ((0, _Document.isOperatorObject)(valueSelector)) {
    return operatorBranchedMatcher(valueSelector, matcher, isRoot);
  } else {
    return convertElementMatcherToBranchedMatcher(equalityElementMatcher(valueSelector));
  }
};

// Given an element matcher (which evaluates a single value), returns a branched
// value (which evaluates the element matcher on all the branches and returns a
// more structured return value possibly including arrayIndices).
var convertElementMatcherToBranchedMatcher = function convertElementMatcherToBranchedMatcher(elementMatcher) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return function (branches) {
    var expanded = branches;
    if (!options.dontExpandLeafArrays) {
      expanded = expandArraysInBranches(branches, options.dontIncludeLeafArrays);
    }
    var ret = {};
    ret.result = (0, _some3.default)(expanded, function (element) {
      var matched = elementMatcher(element.value);

      // Special case for $elemMatch: it means 'true, and use this as an array
      // index if I didn't already have one'.
      if (typeof matched === 'number') {
        // XXX This code dates from when we only stored a single array index
        // (for the outermost array). Should we be also including deeper array
        // indices from the $elemMatch match?
        if (!element.arrayIndices) {
          element.arrayIndices = [matched];
        }
        matched = true;
      }

      // If some element matched, and it's tagged with array indices, include
      // those indices in our result object.
      if (matched && element.arrayIndices) {
        ret.arrayIndices = element.arrayIndices;
      }

      return matched;
    });
    return ret;
  };
};

// Takes a RegExp object and returns an element matcher.
function regexpElementMatcher(regexp) {
  return function (value) {
    if (value instanceof RegExp) {
      // Comparing two regexps means seeing if the regexps are identical
      // (really!). Underscore knows how.
      return String(value) === String(regexp);
    }
    // Regexps only work against strings.
    if (typeof value !== 'string') {
      return false;
    }

    // Reset regexp's state to avoid inconsistent matching for objects with the
    // same value on consecutive calls of regexp.test. This happens only if the
    // regexp has the 'g' flag. Also note that ES6 introduces a new flag 'y' for
    // which we should *not* change the lastIndex but MongoDB doesn't support
    // either of these flags.
    regexp.lastIndex = 0;

    return regexp.test(value);
  };
}

// Takes something that is not an operator object and returns an element matcher
// for equality with that thing.
function equalityElementMatcher(elementSelector) {
  if ((0, _Document.isOperatorObject)(elementSelector)) {
    throw Error('Can\'t create equalityValueSelector for operator object');
  }

  // Special-case: null and undefined are equal (if you got undefined in there
  // somewhere, or if you got it due to some branch being non-existent in the
  // weird special case), even though they aren't with EJSON.equals.
  if (elementSelector == null) {
    // undefined or null
    return function (value) {
      return value == null; // undefined or null
    };
  }

  return function (value) {
    return _Document.MongoTypeComp._equal(elementSelector, value);
  };
}

// Takes an operator object (an object with $ keys) and returns a branched
// matcher for it.
var operatorBranchedMatcher = function operatorBranchedMatcher(valueSelector, matcher, isRoot) {
  // Each valueSelector works separately on the various branches.  So one
  // operator can match one branch and another can match another branch.  This
  // is OK.

  var operatorMatchers = [];
  (0, _forEach2.default)(valueSelector, function (operand, operator) {
    // XXX we should actually implement $eq, which is new in 2.6
    var simpleRange = (0, _indexOf3.default)(['$lt', '$lte', '$gt', '$gte'], operator) >= 0 && _checkTypes2.default.number(operand);
    var simpleInequality = operator === '$ne' && !_checkTypes2.default.object(operand);
    var simpleInclusion = (0, _indexOf3.default)(['$in', '$nin'], operator) >= 0 && _checkTypes2.default.array(operand) && !(0, _some3.default)(operand, _checkTypes2.default.object);

    if (!(operator === '$eq' || simpleRange || simpleInclusion || simpleInequality)) {
      matcher._isSimple = false;
    }

    if (VALUE_OPERATORS.hasOwnProperty(operator)) {
      operatorMatchers.push(VALUE_OPERATORS[operator](operand, valueSelector, matcher, isRoot));
    } else if (ELEMENT_OPERATORS.hasOwnProperty(operator)) {
      var options = ELEMENT_OPERATORS[operator];
      operatorMatchers.push(convertElementMatcherToBranchedMatcher(options.compileElementSelector(operand, valueSelector, matcher), options));
    } else {
      throw new Error('Unrecognized operator: ' + operator);
    }
  });

  return andBranchedMatchers(operatorMatchers);
};

var compileArrayOfDocumentSelectors = function compileArrayOfDocumentSelectors(selectors, matcher, inElemMatch) {
  if (!(0, _Document.isArray)(selectors) || _checkTypes2.default.emptyArray(selectors)) {
    throw Error('$and/$or/$nor must be nonempty array');
  }
  return (0, _map3.default)(selectors, function (subSelector) {
    if (!(0, _Document.isPlainObject)(subSelector)) {
      throw Error('$or/$and/$nor entries need to be full objects');
    }
    return compileDocumentSelector(subSelector, matcher, { inElemMatch: inElemMatch });
  });
};

// Operators that appear at the top level of a document selector.
var LOGICAL_OPERATORS = {
  $and: function $and(subSelector, matcher, inElemMatch) {
    var matchers = compileArrayOfDocumentSelectors(subSelector, matcher, inElemMatch);
    return andDocumentMatchers(matchers);
  },

  $or: function $or(subSelector, matcher, inElemMatch) {
    var matchers = compileArrayOfDocumentSelectors(subSelector, matcher, inElemMatch);

    // Special case: if there is only one matcher, use it directly, *preserving*
    // any arrayIndices it returns.
    if (matchers.length === 1) {
      return matchers[0];
    }

    return function (doc) {
      var result = (0, _some3.default)(matchers, function (f) {
        return f(doc).result;
      });
      // $or does NOT set arrayIndices when it has multiple
      // sub-expressions. (Tested against MongoDB.)
      return { result: result };
    };
  },

  $nor: function $nor(subSelector, matcher, inElemMatch) {
    var matchers = compileArrayOfDocumentSelectors(subSelector, matcher, inElemMatch);
    return function (doc) {
      var result = (0, _every3.default)(matchers, function (f) {
        return !f(doc).result;
      });
      // Never set arrayIndices, because we only match if nothing in particular
      // 'matched' (and because this is consistent with MongoDB).
      return { result: result };
    };
  },

  $where: function $where(selectorValue, matcher) {
    // Record that *any* path may be used.
    matcher._recordPathUsed('');
    matcher._hasWhere = true;
    if (!(selectorValue instanceof Function)) {
      // XXX MongoDB seems to have more complex logic to decide where or or not
      // to add 'return'; not sure exactly what it is.
      selectorValue = Function('obj', 'return ' + selectorValue); //eslint-disable-line no-new-func
    }
    return function (doc) {
      // We make the document available as both `this` and `obj`.
      // XXX not sure what we should do if this throws
      return { result: selectorValue.call(doc, doc) };
    };
  },

  // This is just used as a comment in the query (in MongoDB, it also ends up in
  // query logs); it has no effect on the actual selection.
  $comment: function $comment() {
    return function () {
      return { result: true };
    };
  }
};

// Returns a branched matcher that matches iff the given matcher does not.
// Note that this implicitly 'deMorganizes' the wrapped function.  ie, it
// means that ALL branch values need to fail to match innerBranchedMatcher.
var invertBranchedMatcher = function invertBranchedMatcher(branchedMatcher) {
  return function (branchValues) {
    var invertMe = branchedMatcher(branchValues);
    // We explicitly choose to strip arrayIndices here: it doesn't make sense to
    // say 'update the array element that does not match something', at least
    // in mongo-land.
    return { result: !invertMe.result };
  };
};

// Operators that (unlike LOGICAL_OPERATORS) pertain to individual paths in a
// document, but (unlike ELEMENT_OPERATORS) do not have a simple definition as
// 'match each branched value independently and combine with
// convertElementMatcherToBranchedMatcher'.
var VALUE_OPERATORS = {
  $not: function $not(operand, valueSelector, matcher) {
    return invertBranchedMatcher(compileValueSelector(operand, matcher));
  },
  $ne: function $ne(operand) {
    return invertBranchedMatcher(convertElementMatcherToBranchedMatcher(equalityElementMatcher(operand)));
  },
  $nin: function $nin(operand) {
    return invertBranchedMatcher(convertElementMatcherToBranchedMatcher(ELEMENT_OPERATORS.$in.compileElementSelector(operand)));
  },
  $exists: function $exists(operand) {
    var exists = convertElementMatcherToBranchedMatcher(function (value) {
      return value !== undefined;
    });
    return operand ? exists : invertBranchedMatcher(exists);
  },
  // $options just provides options for $regex; its logic is inside $regex
  $options: function $options(operand, valueSelector) {
    if (!_checkTypes2.default.object(valueSelector) || !valueSelector.hasOwnProperty('$regex')) {
      throw Error('$options needs a $regex');
    }
    return everythingMatcher;
  },
  // $maxDistance is basically an argument to $near
  $maxDistance: function $maxDistance(operand, valueSelector) {
    if (!valueSelector.$near) {
      throw Error('$maxDistance needs a $near');
    }
    return everythingMatcher;
  },
  $all: function $all(operand, valueSelector, matcher) {
    if (!(0, _Document.isArray)(operand)) {
      throw Error('$all requires array');
    }
    // Not sure why, but this seems to be what MongoDB does.
    if (_checkTypes2.default.emptyArray(operand)) {
      return nothingMatcher;
    }

    var branchedMatchers = [];
    (0, _forEach2.default)(operand, function (criterion) {
      // XXX handle $all/$elemMatch combination
      if ((0, _Document.isOperatorObject)(criterion)) {
        throw Error('no $ expressions in $all');
      }
      // This is always a regexp or equality selector.
      branchedMatchers.push(compileValueSelector(criterion, matcher));
    });
    // andBranchedMatchers does NOT require all selectors to return true on the
    // SAME branch.
    return andBranchedMatchers(branchedMatchers);
  },
  $near: function $near(operand, valueSelector, matcher, isRoot) {
    if (!isRoot) {
      throw Error('$near can\'t be inside another $ operator');
    }
    matcher._hasGeoQuery = true;

    // There are two kinds of geodata in MongoDB: coordinate pairs and
    // GeoJSON. They use different distance metrics, too. GeoJSON queries are
    // marked with a $geometry property.

    var maxDistance, point, distance;
    if ((0, _Document.isPlainObject)(operand) && operand.hasOwnProperty('$geometry')) {
      // GeoJSON '2dsphere' mode.
      maxDistance = operand.$maxDistance;
      point = operand.$geometry;
      distance = function (value) {
        // XXX: for now, we don't calculate the actual distance between, say,
        // polygon and circle. If people care about this use-case it will get
        // a priority.
        if (!value || !value.type) {
          return null;
        }
        if (value.type === 'Point') {
          return _geojsonUtils2.default.pointDistance(point, value);
        } else {
          return _geojsonUtils2.default.geometryWithinRadius(value, point, maxDistance) ? 0 : maxDistance + 1;
        }
      };
    } else {
      maxDistance = valueSelector.$maxDistance;
      if (!(0, _Document.isArray)(operand) && !(0, _Document.isPlainObject)(operand)) {
        throw Error('$near argument must be coordinate pair or GeoJSON');
      }
      point = pointToArray(operand);
      distance = function (value) {
        if (!(0, _Document.isArray)(value) && !(0, _Document.isPlainObject)(value)) {
          return null;
        }
        return distanceCoordinatePairs(point, value);
      };
    }

    return function (branchedValues) {
      // There might be multiple points in the document that match the given
      // field. Only one of them needs to be within $maxDistance, but we need to
      // evaluate all of them and use the nearest one for the implicit sort
      // specifier. (That's why we can't just use ELEMENT_OPERATORS here.)
      //
      // Note: This differs from MongoDB's implementation, where a document will
      // actually show up *multiple times* in the result set, with one entry for
      // each within-$maxDistance branching point.
      branchedValues = expandArraysInBranches(branchedValues);
      var result = { result: false };
      (0, _forEach2.default)(branchedValues, function (branch) {
        var curDistance = distance(branch.value);
        // Skip branches that aren't real points or are too far away.
        if (curDistance === null || curDistance > maxDistance) {
          return;
        }
        // Skip anything that's a tie.
        if (result.distance !== undefined && result.distance <= curDistance) {
          return;
        }
        result.result = true;
        result.distance = curDistance;
        if (!branch.arrayIndices) {
          delete result.arrayIndices;
        } else {
          result.arrayIndices = branch.arrayIndices;
        }
      });
      return result;
    };
  }
};

// Helpers for $near.
var distanceCoordinatePairs = function distanceCoordinatePairs(a, b) {
  a = pointToArray(a);
  b = pointToArray(b);
  var x = a[0] - b[0];
  var y = a[1] - b[1];
  if (!_checkTypes2.default.number(x) || !_checkTypes2.default.number(y)) {
    return null;
  }
  return Math.sqrt(x * x + y * y);
};

// Makes sure we get 2 elements array and assume the first one to be x and
// the second one to y no matter what user passes.
// In case user passes { lon: x, lat: y } returns [x, y]
var pointToArray = function pointToArray(point) {
  return (0, _map3.default)(point, function (x) {
    return x;
  });
};

// Helper for $lt/$gt/$lte/$gte.
var makeInequality = function makeInequality(cmpValueComparator) {
  return {
    compileElementSelector: function compileElementSelector(operand) {
      // Arrays never compare false with non-arrays for any inequality.
      // XXX This was behavior we observed in pre-release MongoDB 2.5, but
      //     it seems to have been reverted.
      //     See https://jira.mongodb.org/browse/SERVER-11444
      if ((0, _Document.isArray)(operand)) {
        return function () {
          return false;
        };
      }

      // Special case: consider undefined and null the same (so true with
      // $gte/$lte).
      if (operand === undefined) {
        operand = null;
      }

      var operandType = _Document.MongoTypeComp._type(operand);

      return function (value) {
        if (value === undefined) {
          value = null;
        }
        // Comparisons are never true among things of different type (except
        // null vs undefined).
        if (_Document.MongoTypeComp._type(value) !== operandType) {
          return false;
        }
        return cmpValueComparator(_Document.MongoTypeComp._cmp(value, operand));
      };
    }
  };
};

// Each element selector contains:
//  - compileElementSelector, a function with args:
//    - operand - the 'right hand side' of the operator
//    - valueSelector - the 'context' for the operator (so that $regex can find
//      $options)
//    - matcher - the Matcher this is going into (so that $elemMatch can compile
//      more things)
//    returning a function mapping a single value to bool.
//  - dontExpandLeafArrays, a bool which prevents expandArraysInBranches from
//    being called
//  - dontIncludeLeafArrays, a bool which causes an argument to be passed to
//    expandArraysInBranches if it is called
var ELEMENT_OPERATORS = exports.ELEMENT_OPERATORS = {
  $lt: makeInequality(function (cmpValue) {
    return cmpValue < 0;
  }),
  $gt: makeInequality(function (cmpValue) {
    return cmpValue > 0;
  }),
  $lte: makeInequality(function (cmpValue) {
    return cmpValue <= 0;
  }),
  $gte: makeInequality(function (cmpValue) {
    return cmpValue >= 0;
  }),
  $mod: {
    compileElementSelector: function compileElementSelector(operand) {
      if (!((0, _Document.isArray)(operand) && operand.length === 2 && typeof operand[0] === 'number' && typeof operand[1] === 'number')) {
        throw Error('argument to $mod must be an array of two numbers');
      }
      // XXX could require to be ints or round or something
      var divisor = operand[0];
      var remainder = operand[1];
      return function (value) {
        return typeof value === 'number' && value % divisor === remainder;
      };
    }
  },
  $in: {
    compileElementSelector: function compileElementSelector(operand) {
      if (!(0, _Document.isArray)(operand)) {
        throw Error('$in needs an array');
      }

      var elementMatchers = [];
      (0, _forEach2.default)(operand, function (option) {
        if (option instanceof RegExp) {
          elementMatchers.push(regexpElementMatcher(option));
        } else if ((0, _Document.isOperatorObject)(option)) {
          throw Error('cannot nest $ under $in');
        } else {
          elementMatchers.push(equalityElementMatcher(option));
        }
      });

      return function (value) {
        // Allow {a: {$in: [null]}} to match when 'a' does not exist.
        if (value === undefined) {
          value = null;
        }
        return (0, _some3.default)(elementMatchers, function (e) {
          return e(value);
        });
      };
    }
  },
  $size: {
    // {a: [[5, 5]]} must match {a: {$size: 1}} but not {a: {$size: 2}}, so we
    // don't want to consider the element [5,5] in the leaf array [[5,5]] as a
    // possible value.
    dontExpandLeafArrays: true,
    compileElementSelector: function compileElementSelector(operand) {
      if (typeof operand === 'string') {
        // Don't ask me why, but by experimentation, this seems to be what Mongo
        // does.
        operand = 0;
      } else if (typeof operand !== 'number') {
        throw Error('$size needs a number');
      }
      return function (value) {
        return (0, _Document.isArray)(value) && value.length === operand;
      };
    }
  },
  $type: {
    // {a: [5]} must not match {a: {$type: 4}} (4 means array), but it should
    // match {a: {$type: 1}} (1 means number), and {a: [[5]]} must match {$a:
    // {$type: 4}}. Thus, when we see a leaf array, we *should* expand it but
    // should *not* include it itself.
    dontIncludeLeafArrays: true,
    compileElementSelector: function compileElementSelector(operand) {
      if (typeof operand !== 'number') {
        throw Error('$type needs a number');
      }
      return function (value) {
        return value !== undefined && _Document.MongoTypeComp._type(value) === operand;
      };
    }
  },
  $regex: {
    compileElementSelector: function compileElementSelector(operand, valueSelector) {
      if (!(typeof operand === 'string' || operand instanceof RegExp)) {
        throw Error('$regex has to be a string or RegExp');
      }

      var regexp;
      if (valueSelector.$options !== undefined) {
        // Options passed in $options (even the empty string) always overrides
        // options in the RegExp object itself. (See also
        // Mongo.Collection._rewriteSelector.)

        // Be clear that we only support the JS-supported options, not extended
        // ones (eg, Mongo supports x and s). Ideally we would implement x and s
        // by transforming the regexp, but not today...
        if (/[^gim]/.test(valueSelector.$options)) {
          throw new Error('Only the i, m, and g regexp options are supported');
        }

        var regexSource = operand instanceof RegExp ? operand.source : operand;
        regexp = new RegExp(regexSource, valueSelector.$options);
      } else if (operand instanceof RegExp) {
        regexp = operand;
      } else {
        regexp = new RegExp(operand);
      }
      return regexpElementMatcher(regexp);
    }
  },
  $elemMatch: {
    dontExpandLeafArrays: true,
    compileElementSelector: function compileElementSelector(operand, valueSelector, matcher) {
      if (!(0, _Document.isPlainObject)(operand)) {
        throw Error('$elemMatch need an object');
      }

      var subMatcher, isDocMatcher;
      if ((0, _Document.isOperatorObject)(operand, true)) {
        subMatcher = compileValueSelector(operand, matcher);
        isDocMatcher = false;
      } else {
        // This is NOT the same as compileValueSelector(operand), and not just
        // because of the slightly different calling convention.
        // {$elemMatch: {x: 3}} means 'an element has a field x:3', not
        // 'consists only of a field x:3'. Also, regexps and sub-$ are allowed.
        subMatcher = compileDocumentSelector(operand, matcher, { inElemMatch: true });
        isDocMatcher = true;
      }

      return function (value) {
        if (!(0, _Document.isArray)(value)) {
          return false;
        }
        for (var i = 0; i < value.length; ++i) {
          var arrayElement = value[i];
          var arg;
          if (isDocMatcher) {
            // We can only match {$elemMatch: {b: 3}} against objects.
            // (We can also match against arrays, if there's numeric indices,
            // eg {$elemMatch: {'0.b': 3}} or {$elemMatch: {0: 3}}.)
            if (!(0, _Document.isPlainObject)(arrayElement) && !(0, _Document.isArray)(arrayElement)) {
              return false;
            }
            arg = arrayElement;
          } else {
            // dontIterate ensures that {a: {$elemMatch: {$gt: 5}}} matches
            // {a: [8]} but not {a: [[8]]}
            arg = [{ value: arrayElement, dontIterate: true }];
          }
          // XXX support $near in $elemMatch by propagating $distance?
          if (subMatcher(arg).result) {
            return i; // specially understood to mean 'use as arrayIndices'
          }
        }
        return false;
      };
    }
  }
};

// makeLookupFunction(key) returns a lookup function.
//
// A lookup function takes in a document and returns an array of matching
// branches.  If no arrays are found while looking up the key, this array will
// have exactly one branches (possibly 'undefined', if some segment of the key
// was not found).
//
// If arrays are found in the middle, this can have more than one element, since
// we 'branch'. When we 'branch', if there are more key segments to look up,
// then we only pursue branches that are plain objects (not arrays or scalars).
// This means we can actually end up with no branches!
//
// We do *NOT* branch on arrays that are found at the end (ie, at the last
// dotted member of the key). We just return that array; if you want to
// effectively 'branch' over the array's values, post-process the lookup
// function with expandArraysInBranches.
//
// Each branch is an object with keys:
//  - value: the value at the branch
//  - dontIterate: an optional bool; if true, it means that 'value' is an array
//    that expandArraysInBranches should NOT expand. This specifically happens
//    when there is a numeric index in the key, and ensures the
//    perhaps-surprising MongoDB behavior where {'a.0': 5} does NOT
//    match {a: [[5]]}.
//  - arrayIndices: if any array indexing was done during lookup (either due to
//    explicit numeric indices or implicit branching), this will be an array of
//    the array indices used, from outermost to innermost; it is falsey or
//    absent if no array index is used. If an explicit numeric index is used,
//    the index will be followed in arrayIndices by the string 'x'.
//
//    Note: arrayIndices is used for two purposes. First, it is used to
//    implement the '$' modifier feature, which only ever looks at its first
//    element.
//
//    Second, it is used for sort key generation, which needs to be able to tell
//    the difference between different paths. Moreover, it needs to
//    differentiate between explicit and implicit branching, which is why
//    there's the somewhat hacky 'x' entry: this means that explicit and
//    implicit array lookups will have different full arrayIndices paths. (That
//    code only requires that different paths have different arrayIndices; it
//    doesn't actually 'parse' arrayIndices. As an alternative, arrayIndices
//    could contain objects with flags like 'implicit', but I think that only
//    makes the code surrounding them more complex.)
//
//    (By the way, this field ends up getting passed around a lot without
//    cloning, so never mutate any arrayIndices field/var in this package!)
//
//
// At the top level, you may only pass in a plain object or array.
//
// See the test 'minimongo - lookup' for some examples of what lookup functions
// return.
function makeLookupFunction(key, options) {
  options = options || {};
  var parts = key.split('.');
  var firstPart = parts.length ? parts[0] : '';
  var firstPartIsNumeric = (0, _Document.isNumericKey)(firstPart);
  var nextPartIsNumeric = parts.length >= 2 && (0, _Document.isNumericKey)(parts[1]);
  var lookupRest;
  if (parts.length > 1) {
    lookupRest = makeLookupFunction(parts.slice(1).join('.'));
  }

  var omitUnnecessaryFields = function omitUnnecessaryFields(retVal) {
    if (!retVal.dontIterate) {
      delete retVal.dontIterate;
    }
    if (retVal.arrayIndices && !retVal.arrayIndices.length) {
      delete retVal.arrayIndices;
    }
    return retVal;
  };

  // Doc will always be a plain object or an array.
  // apply an explicit numeric index, an array.
  return function (doc, arrayIndices) {
    if (!arrayIndices) {
      arrayIndices = [];
    }

    if ((0, _Document.isArray)(doc)) {
      // If we're being asked to do an invalid lookup into an array (non-integer
      // or out-of-bounds), return no results (which is different from returning
      // a single undefined result, in that `null` equality checks won't match).
      if (!(firstPartIsNumeric && firstPart < doc.length)) {
        return [];
      }

      // Remember that we used this array index. Include an 'x' to indicate that
      // the previous index came from being considered as an explicit array
      // index (not branching).
      arrayIndices = arrayIndices.concat(+firstPart, 'x');
    }

    // Do our first lookup.
    var firstLevel = doc[firstPart];

    // If there is no deeper to dig, return what we found.
    //
    // If what we found is an array, most value selectors will choose to treat
    // the elements of the array as matchable values in their own right, but
    // that's done outside of the lookup function. (Exceptions to this are $size
    // and stuff relating to $elemMatch.  eg, {a: {$size: 2}} does not match {a:
    // [[1, 2]]}.)
    //
    // That said, if we just did an *explicit* array lookup (on doc) to find
    // firstLevel, and firstLevel is an array too, we do NOT want value
    // selectors to iterate over it.  eg, {'a.0': 5} does not match {a: [[5]]}.
    // So in that case, we mark the return value as 'don't iterate'.
    if (!lookupRest) {
      return [omitUnnecessaryFields({
        value: firstLevel,
        dontIterate: (0, _Document.isArray)(doc) && (0, _Document.isArray)(firstLevel),
        arrayIndices: arrayIndices })];
    }

    // We need to dig deeper.  But if we can't, because what we've found is not
    // an array or plain object, we're done. If we just did a numeric index into
    // an array, we return nothing here (this is a change in Mongo 2.5 from
    // Mongo 2.4, where {'a.0.b': null} stopped matching {a: [5]}). Otherwise,
    // return a single `undefined` (which can, for example, match via equality
    // with `null`).
    if (!(0, _Document.isIndexable)(firstLevel)) {
      if ((0, _Document.isArray)(doc)) {
        return [];
      }
      return [omitUnnecessaryFields({
        value: undefined,
        arrayIndices: arrayIndices
      })];
    }

    var result = [];
    var appendToResult = function appendToResult(more) {
      Array.prototype.push.apply(result, more);
    };

    // Dig deeper: look up the rest of the parts on whatever we've found.
    // (lookupRest is smart enough to not try to do invalid lookups into
    // firstLevel if it's an array.)
    appendToResult(lookupRest(firstLevel, arrayIndices));

    // If we found an array, then in *addition* to potentially treating the next
    // part as a literal integer lookup, we should also 'branch': try to look up
    // the rest of the parts on each array element in parallel.
    //
    // In this case, we *only* dig deeper into array elements that are plain
    // objects. (Recall that we only got this far if we have further to dig.)
    // This makes sense: we certainly don't dig deeper into non-indexable
    // objects. And it would be weird to dig into an array: it's simpler to have
    // a rule that explicit integer indexes only apply to an outer array, not to
    // an array you find after a branching search.
    //
    // In the special case of a numeric part in a *sort selector* (not a query
    // selector), we skip the branching: we ONLY allow the numeric part to mean
    // 'look up this index' in that case, not 'also look up this index in all
    // the elements of the array'.
    if ((0, _Document.isArray)(firstLevel) && !(nextPartIsNumeric && options.forSort)) {
      (0, _forEach2.default)(firstLevel, function (branch, arrayIndex) {
        if ((0, _Document.isPlainObject)(branch)) {
          appendToResult(lookupRest(branch, arrayIndices.concat(arrayIndex)));
        }
      });
    }

    return result;
  };
}

function expandArraysInBranches(branches, skipTheArrays) {
  var branchesOut = [];
  (0, _forEach2.default)(branches, function (branch) {
    var thisIsArray = (0, _Document.isArray)(branch.value);
    // We include the branch itself, *UNLESS* we it's an array that we're going
    // to iterate and we're told to skip arrays.  (That's right, we include some
    // arrays even skipTheArrays is true: these are arrays that were found via
    // explicit numerical indices.)
    if (!(skipTheArrays && thisIsArray && !branch.dontIterate)) {
      branchesOut.push({
        value: branch.value,
        arrayIndices: branch.arrayIndices
      });
    }
    if (thisIsArray && !branch.dontIterate) {
      (0, _forEach2.default)(branch.value, function (leaf, i) {
        branchesOut.push({
          value: leaf,
          arrayIndices: (branch.arrayIndices || []).concat(i)
        });
      });
    }
  });
  return branchesOut;
}

var nothingMatcher = function nothingMatcher(docOrBranchedValues) {
  return { result: false };
};

var everythingMatcher = function everythingMatcher(docOrBranchedValues) {
  return { result: true };
};

// NB: We are cheating and using this function to implement 'AND' for both
// 'document matchers' and 'branched matchers'. They both return result objects
// but the argument is different: for the former it's a whole doc, whereas for
// the latter it's an array of 'branched values'.
var andSomeMatchers = function andSomeMatchers(subMatchers) {
  if (subMatchers.length === 0) {
    return everythingMatcher;
  }
  if (subMatchers.length === 1) {
    return subMatchers[0];
  }

  return function (docOrBranches) {
    var ret = {};
    ret.result = (0, _every3.default)(subMatchers, function (f) {
      var subResult = f(docOrBranches);
      // Copy a 'distance' number out of the first sub-matcher that has
      // one. Yes, this means that if there are multiple $near fields in a
      // query, something arbitrary happens; this appears to be consistent with
      // Mongo.
      if (subResult.result && subResult.distance !== undefined && ret.distance === undefined) {
        ret.distance = subResult.distance;
      }
      // Similarly, propagate arrayIndices from sub-matchers... but to match
      // MongoDB behavior, this time the *last* sub-matcher with arrayIndices
      // wins.
      if (subResult.result && subResult.arrayIndices) {
        ret.arrayIndices = subResult.arrayIndices;
      }
      return subResult.result;
    });

    // If we didn't actually match, forget any extra metadata we came up with.
    if (!ret.result) {
      delete ret.distance;
      delete ret.arrayIndices;
    }
    return ret;
  };
};

var andDocumentMatchers = andSomeMatchers;
var andBranchedMatchers = andSomeMatchers;

},{"./Document":6,"./EJSON":11,"check-types":17,"fast.js/array/every":19,"fast.js/array/indexOf":21,"fast.js/array/some":23,"fast.js/forEach":24,"fast.js/map":26,"fast.js/object/keys":29,"geojson-utils":31}],8:[function(require,module,exports){
'use strict';

function _typeof2(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DocumentModifier = undefined;

var _checkTypes = require('check-types');

var _checkTypes2 = _interopRequireDefault(_checkTypes);

var _assign2 = require('fast.js/object/assign');

var _assign3 = _interopRequireDefault(_assign2);

var _forEach = require('fast.js/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _every2 = require('fast.js/array/every');

var _every3 = _interopRequireDefault(_every2);

var _EJSON = require('./EJSON');

var _EJSON2 = _interopRequireDefault(_EJSON);

var _DocumentRetriver = require('./DocumentRetriver');

var _DocumentRetriver2 = _interopRequireDefault(_DocumentRetriver);

var _DocumentMatcher = require('./DocumentMatcher');

var _DocumentMatcher2 = _interopRequireDefault(_DocumentMatcher);

var _DocumentSorter = require('./DocumentSorter');

var _DocumentSorter2 = _interopRequireDefault(_DocumentSorter);

var _Document = require('./Document');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _typeof(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var DocumentModifier = exports.DocumentModifier = (function () {
  function DocumentModifier(db) {
    var query = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, DocumentModifier);

    this.db = db;
    this._matcher = new _DocumentMatcher2.default(query);
    this._query = query;
  }

  _createClass(DocumentModifier, [{
    key: 'modify',
    value: function modify(mod) {
      var _this = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new _DocumentRetriver2.default(this.db).retriveForQeury(this._query).then(function (docs) {
        var oldResults = [];
        var newResults = [];
        (0, _forEach2.default)(docs, function (d) {
          var match = _this._matcher.documentMatches(d);
          if (match.result) {
            var matchOpts = (0, _assign3.default)({ arrayIndices: match.arrayIndices }, options);
            var newDoc = _this._modifyDocument(d, mod, matchOpts);
            newResults.push(newDoc);
            oldResults.push(d);
          }
        });

        return {
          updated: newResults,
          original: oldResults
        };
      });
    }

    // XXX need a strategy for passing the binding of $ into this
    // function, from the compiled selector
    //
    // maybe just {key.up.to.just.before.dollarsign: array_index}
    //
    // XXX atomicity: if one modification fails, do we roll back the whole
    // change?
    //
    // options:
    //   - isInsert is set when _modify is being called to compute the document to
    //     insert as part of an upsert operation. We use this primarily to figure
    //     out when to set the fields in $setOnInsert, if present.

  }, {
    key: '_modifyDocument',
    value: function _modifyDocument(doc, mod) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      if (!(0, _Document.isPlainObject)(mod)) {
        throw new Error('Modifier must be an object');
      }

      // Make sure the caller can't mutate our data structures.
      mod = _EJSON2.default.clone(mod);

      var isModifier = (0, _Document.isOperatorObject)(mod);

      var newDoc;

      if (!isModifier) {
        if (mod._id && !_EJSON2.default.equals(doc._id, mod._id)) {
          throw new Error('Cannot change the _id of a document');
        }

        // replace the whole document
        for (var k in mod) {
          if (/\./.test(k)) {
            throw new Error('When replacing document, field name may not contain \'.\'');
          }
        }
        newDoc = mod;
        newDoc._id = doc._id;
      } else {
        // apply modifiers to the doc.
        newDoc = _EJSON2.default.clone(doc);

        (0, _forEach2.default)(mod, function (operand, op) {
          var modFunc = MODIFIERS[op];
          // Treat $setOnInsert as $set if this is an insert.
          if (options.isInsert && op === '$setOnInsert') {
            modFunc = MODIFIERS.$set;
          }
          if (!modFunc) {
            throw new Error('Invalid modifier specified ' + op);
          }
          (0, _forEach2.default)(operand, function (arg, keypath) {
            if (keypath === '') {
              throw new Error('An empty update path is not valid.');
            }

            if (keypath === '_id') {
              throw new Error('Mod on _id not allowed');
            }

            var keyparts = keypath.split('.');

            if (!(0, _every3.default)(keyparts, function (x) {
              return x;
            })) {
              throw new Error('The update path \'' + keypath + '\' contains an empty field name, which is not allowed.');
            }

            var target = findModTarget(newDoc, keyparts, {
              noCreate: NO_CREATE_MODIFIERS[op],
              forbidArray: op === '$rename',
              arrayIndices: options.arrayIndices
            });
            var field = keyparts.pop();
            modFunc(target, field, arg, keypath, newDoc);
          });
        });
      }

      return newDoc;
    }
  }]);

  return DocumentModifier;
})();

exports.default = DocumentModifier;

// for a.b.c.2.d.e, keyparts should be ['a', 'b', 'c', '2', 'd', 'e'],
// and then you would operate on the 'e' property of the returned
// object.
//
// if options.noCreate is falsey, creates intermediate levels of
// structure as necessary, like mkdir -p (and raises an exception if
// that would mean giving a non-numeric property to an array.) if
// options.noCreate is true, return undefined instead.
//
// may modify the last element of keyparts to signal to the caller that it needs
// to use a different value to index into the returned object (for example,
// ['a', '01'] -> ['a', 1]).
//
// if forbidArray is true, return null if the keypath goes through an array.
//
// if options.arrayIndices is set, use its first element for the (first) '$' in
// the path.

var findModTarget = function findModTarget(doc, keyparts, options) {
  options = options || {};
  var usedArrayIndex = false;
  for (var i = 0; i < keyparts.length; i++) {
    var last = i === keyparts.length - 1;
    var keypart = keyparts[i];
    var indexable = (0, _Document.isIndexable)(doc);
    if (!indexable) {
      if (options.noCreate) {
        return undefined;
      }
      var e = new Error('cannot use the part \'' + keypart + '\' to traverse ' + doc);
      e.setPropertyError = true;
      throw e;
    }
    if (doc instanceof Array) {
      if (options.forbidArray) {
        return null;
      }
      if (keypart === '$') {
        if (usedArrayIndex) {
          throw new Error('Too many positional (i.e. \'$\') elements');
        }
        if (!options.arrayIndices || !options.arrayIndices.length) {
          throw new Error('The positional operator did not find the ' + 'match needed from the query');
        }
        keypart = options.arrayIndices[0];
        usedArrayIndex = true;
      } else if ((0, _Document.isNumericKey)(keypart)) {
        keypart = parseInt(keypart, 10);
      } else {
        if (options.noCreate) {
          return undefined;
        }
        throw new Error('can\'t append to array using string field name [' + keypart + ']');
      }
      if (last) {
        // handle 'a.01'
        keyparts[i] = keypart;
      }
      if (options.noCreate && keypart >= doc.length) {
        return undefined;
      }
      while (doc.length < keypart) {
        doc.push(null);
      }
      if (!last) {
        if (doc.length === keypart) {
          doc.push({});
        } else if (_typeof(doc[keypart]) !== 'object') {
          throw new Error('can\'t modify field \'' + keyparts[i + 1] + '\' of list value ' + JSON.stringify(doc[keypart]));
        }
      }
    } else {
      if (keypart.length && keypart.substr(0, 1) === '$') {
        throw new Error('can\'t set field named ' + keypart);
      }
      if (!(keypart in doc)) {
        if (options.noCreate) {
          return undefined;
        }
        if (!last) {
          doc[keypart] = {};
        }
      }
    }

    if (last) {
      return doc;
    }
    doc = doc[keypart];
  }

  // notreached
};

var NO_CREATE_MODIFIERS = {
  $unset: true,
  $pop: true,
  $rename: true,
  $pull: true,
  $pullAll: true
};

var MODIFIERS = {
  $inc: function $inc(target, field, arg) {
    if (typeof arg !== 'number') {
      throw new Error('Modifier $inc allowed for numbers only');
    }
    if (field in target) {
      if (typeof target[field] !== 'number') {
        throw new Error('Cannot apply $inc modifier to non-number');
      }
      target[field] += arg;
    } else {
      target[field] = arg;
    }
  },
  $set: function $set(target, field, arg) {
    if (!_checkTypes2.default.object(target) && !_checkTypes2.default.array(target)) {
      var e = new Error('Cannot set property on non-object field');
      e.setPropertyError = true;
      throw e;
    }
    if (target === null) {
      var e = new Error('Cannot set property on null');
      e.setPropertyError = true;
      throw e;
    }
    target[field] = arg;
  },
  $setOnInsert: function $setOnInsert(target, field, arg) {
    // converted to `$set` in `_modify`
  },
  $unset: function $unset(target, field, arg) {
    if (target !== undefined) {
      if (target instanceof Array) {
        if (field in target) {
          target[field] = null;
        }
      } else {
        delete target[field];
      }
    }
  },
  $push: function $push(target, field, arg) {
    if (target[field] === undefined) {
      target[field] = [];
    }
    if (!(target[field] instanceof Array)) {
      throw new Error('Cannot apply $push modifier to non-array');
    }

    if (!(arg && arg.$each)) {
      // Simple mode: not $each
      target[field].push(arg);
      return;
    }

    // Fancy mode: $each (and maybe $slice and $sort and $position)
    var toPush = arg.$each;
    if (!(toPush instanceof Array)) {
      throw new Error('$each must be an array');
    }

    // Parse $position
    var position = undefined;
    if ('$position' in arg) {
      if (typeof arg.$position !== 'number') {
        throw new Error('$position must be a numeric value');
      }
      // XXX should check to make sure integer
      if (arg.$position < 0) {
        throw new Error('$position in $push must be zero or positive');
      }
      position = arg.$position;
    }

    // Parse $slice.
    var slice = undefined;
    if ('$slice' in arg) {
      if (typeof arg.$slice !== 'number') {
        throw new Error('$slice must be a numeric value');
      }
      // XXX should check to make sure integer
      if (arg.$slice > 0) {
        throw new Error('$slice in $push must be zero or negative');
      }
      slice = arg.$slice;
    }

    // Parse $sort.
    var sortFunction = undefined;
    if (arg.$sort) {
      if (slice === undefined) {
        throw new Error('$sort requires $slice to be present');
      }
      // XXX this allows us to use a $sort whose value is an array, but that's
      // actually an extension of the Node driver, so it won't work
      // server-side. Could be confusing!
      // XXX is it correct that we don't do geo-stuff here?
      sortFunction = new _DocumentSorter2.default(arg.$sort).getComparator();
      for (var i = 0; i < toPush.length; i++) {
        if (_Document.MongoTypeComp._type(toPush[i]) !== 3) {
          throw new Error('$push like modifiers using $sort ' + 'require all elements to be objects');
        }
      }
    }

    // Actually push.
    if (position === undefined) {
      for (var j = 0; j < toPush.length; j++) {
        target[field].push(toPush[j]);
      }
    } else {
      var spliceArguments = [position, 0];
      for (var j = 0; j < toPush.length; j++) {
        spliceArguments.push(toPush[j]);
      }
      Array.prototype.splice.apply(target[field], spliceArguments);
    }

    // Actually sort.
    if (sortFunction) {
      target[field].sort(sortFunction);
    }

    // Actually slice.
    if (slice !== undefined) {
      if (slice === 0) {
        target[field] = []; // differs from Array.slice!
      } else {
          target[field] = target[field].slice(slice);
        }
    }
  },
  $pushAll: function $pushAll(target, field, arg) {
    if (!((typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg instanceof Array)) {
      throw new Error('Modifier $pushAll/pullAll allowed for arrays only');
    }
    var x = target[field];
    if (x === undefined) {
      target[field] = arg;
    } else if (!(x instanceof Array)) {
      throw new Error('Cannot apply $pushAll modifier to non-array');
    } else {
      for (var i = 0; i < arg.length; i++) {
        x.push(arg[i]);
      }
    }
  },
  $addToSet: function $addToSet(target, field, arg) {
    var isEach = false;
    if ((typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object') {
      //check if first key is '$each'
      for (var k in arg) {
        if (k === '$each') {
          isEach = true;
        }
        break;
      }
    }
    var values = isEach ? arg.$each : [arg];
    var x = target[field];
    if (x === undefined) {
      target[field] = values;
    } else if (!(x instanceof Array)) {
      throw new Error('Cannot apply $addToSet modifier to non-array');
    } else {
      (0, _forEach2.default)(values, function (value) {
        for (var i = 0; i < x.length; i++) {
          if (_Document.MongoTypeComp._equal(value, x[i])) {
            return;
          }
        }
        x.push(value);
      });
    }
  },
  $pop: function $pop(target, field, arg) {
    if (target === undefined) {
      return;
    }
    var x = target[field];
    if (x === undefined) {
      return;
    } else if (!(x instanceof Array)) {
      throw new Error('Cannot apply $pop modifier to non-array');
    } else {
      if (typeof arg === 'number' && arg < 0) {
        x.splice(0, 1);
      } else {
        x.pop();
      }
    }
  },
  $pull: function $pull(target, field, arg) {
    if (target === undefined) {
      return;
    }
    var x = target[field];
    if (x === undefined) {
      return;
    } else if (!(x instanceof Array)) {
      throw new Error('Cannot apply $pull/pullAll modifier to non-array');
    } else {
      var out = [];
      if (arg != null && (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && !(arg instanceof Array)) {
        // XXX would be much nicer to compile this once, rather than
        // for each document we modify.. but usually we're not
        // modifying that many documents, so we'll let it slide for
        // now

        // XXX Minimongo.Matcher isn't up for the job, because we need
        // to permit stuff like {$pull: {a: {$gt: 4}}}.. something
        // like {$gt: 4} is not normally a complete selector.
        // same issue as $elemMatch possibly?
        var matcher = new _DocumentMatcher2.default(arg);
        for (var i = 0; i < x.length; i++) {
          if (!matcher.documentMatches(x[i]).result) {
            out.push(x[i]);
          }
        }
      } else {
        for (var i = 0; i < x.length; i++) {
          if (!_Document.MongoTypeComp._equal(x[i], arg)) {
            out.push(x[i]);
          }
        }
      }
      target[field] = out;
    }
  },
  $pullAll: function $pullAll(target, field, arg) {
    if (!((typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg instanceof Array)) {
      throw new Error('Modifier $pushAll/pullAll allowed for arrays only');
    }
    if (target === undefined) {
      return;
    }
    var x = target[field];
    if (x === undefined) {
      return;
    } else if (!(x instanceof Array)) {
      throw new Error('Cannot apply $pull/pullAll modifier to non-array');
    } else {
      var out = [];
      for (var i = 0; i < x.length; i++) {
        var exclude = false;
        for (var j = 0; j < arg.length; j++) {
          if (_Document.MongoTypeComp._equal(x[i], arg[j])) {
            exclude = true;
            break;
          }
        }
        if (!exclude) {
          out.push(x[i]);
        }
      }
      target[field] = out;
    }
  },
  $rename: function $rename(target, field, arg, keypath, doc) {
    if (keypath === arg) {
      // no idea why mongo has this restriction..
      throw new Error('$rename source must differ from target');
    }
    if (target === null) {
      throw new Error('$rename source field invalid');
    }
    if (typeof arg !== 'string') {
      throw new Error('$rename target must be a string');
    }
    if (target === undefined) {
      return;
    }
    var v = target[field];
    delete target[field];

    var keyparts = arg.split('.');
    var target2 = findModTarget(doc, keyparts, { forbidArray: true });
    if (target2 === null) {
      throw new Error('$rename target field invalid');
    }
    var field2 = keyparts.pop();
    target2[field2] = v;
  },
  $bit: function $bit(target, field, arg) {
    // XXX mongo only supports $bit on integers, and we only support
    // native javascript numbers (doubles) so far, so we can't support $bit
    throw new Error('$bit is not supported');
  }
};

},{"./Document":6,"./DocumentMatcher":7,"./DocumentRetriver":9,"./DocumentSorter":10,"./EJSON":11,"check-types":17,"fast.js/array/every":19,"fast.js/forEach":24,"fast.js/object/assign":27}],9:[function(require,module,exports){
'use strict';

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DocumentRetriver = undefined;

var _checkTypes = require('check-types');

var _checkTypes2 = _interopRequireDefault(_checkTypes);

var _keys2 = require('fast.js/object/keys');

var _keys3 = _interopRequireDefault(_keys2);

var _map2 = require('fast.js/map');

var _map3 = _interopRequireDefault(_map2);

var _Document = require('./Document');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * Class for getting data objects by given list of ids.
 * Promises based. It makes requests asyncronousle by
 * getting request frame from database.
 * It's not use caches, because it's a task of store.
 * It just retrives content by 'get' method.
 */

var DocumentRetriver = exports.DocumentRetriver = (function () {
  function DocumentRetriver(db) {
    _classCallCheck(this, DocumentRetriver);

    this.db = db;
  }

  /**
   * Retrive an optimal superset of documents
   * by given query based on _id field of the query
   * @param  {Object} query
   * @return {Promise}
   */

  _createClass(DocumentRetriver, [{
    key: 'retriveForQeury',
    value: function retriveForQeury(query) {
      // Try to get list of ids
      var selectorIds = undefined;
      if ((0, _Document.selectorIsId)(query)) {
        // fast path for scalar query
        selectorIds = [query];
      } else if ((0, _Document.selectorIsIdPerhapsAsObject)(query)) {
        // also do the fast path for { _id: idString }
        selectorIds = [query._id];
      } else if (_checkTypes2.default.object(query) && query.hasOwnProperty('_id') && _checkTypes2.default.object(query._id) && query._id.hasOwnProperty('$in') && _checkTypes2.default.array(query._id.$in)) {
        // and finally fast path for multiple ids
        // selected by $in operator
        selectorIds = query._id.$in;
      }

      // Retrive optimally
      if (_checkTypes2.default.object(selectorIds) && (0, _keys3.default)(selectorIds).length > 0) {
        return this.retriveIds(selectorIds);
      } else {
        return this.retriveAll();
      }
    }

    /**
     * Retrive all documents in the storage of
     * the collection
     * @return {Promise}
     */

  }, {
    key: 'retriveAll',
    value: function retriveAll() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var result = [];
        _this.db.storage.createReadStream().on('data', function (data) {
          return result.push(_this.db.create(data.value));
        }).on('end', function () {
          return resolve(result);
        });
      });
    }

    /**
     * Rterive all ids given in constructor.
     * If some id is not retrived (retrived qith error),
     * then returned promise will be rejected with that error.
     * @return {Promise}
     */

  }, {
    key: 'retriveIds',
    value: function retriveIds(ids) {
      var _this2 = this;

      var retrPromises = (0, _map3.default)(ids, function (id) {
        return _this2.retriveOne(id);
      });
      return Promise.all(retrPromises);
    }

    /**
     * Retrive one document by given id
     * @param  {String} id
     * @return {Promise}
     */

  }, {
    key: 'retriveOne',
    value: function retriveOne(id) {
      var _this3 = this;

      return this.db.storage.get(id).then(function (buf) {
        return _this3.db.create(buf);
      });
    }
  }]);

  return DocumentRetriver;
})();

exports.default = DocumentRetriver;

},{"./Document":6,"check-types":17,"fast.js/map":26,"fast.js/object/keys":29}],10:[function(require,module,exports){
'use strict';

function _typeof2(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DocumentSorter = undefined;

var _checkTypes = require('check-types');

var _checkTypes2 = _interopRequireDefault(_checkTypes);

var _forEach = require('fast.js/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _every2 = require('fast.js/array/every');

var _every3 = _interopRequireDefault(_every2);

var _map2 = require('fast.js/map');

var _map3 = _interopRequireDefault(_map2);

var _indexOf2 = require('fast.js/array/indexOf');

var _indexOf3 = _interopRequireDefault(_indexOf2);

var _keys2 = require('fast.js/object/keys');

var _keys3 = _interopRequireDefault(_keys2);

var _DocumentMatcher = require('./DocumentMatcher');

var _DocumentMatcher2 = _interopRequireDefault(_DocumentMatcher);

var _Document = require('./Document');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _typeof(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

// Give a sort spec, which can be in any of these forms:
//   {'key1': 1, 'key2': -1}
//   [['key1', 'asc'], ['key2', 'desc']]
//   ['key1', ['key2', 'desc']]
//
// (.. with the first form being dependent on the key enumeration
// behavior of your javascript VM, which usually does what you mean in
// this case if the key names don't look like integers ..)
//
// return a function that takes two objects, and returns -1 if the
// first object comes first in order, 1 if the second object comes
// first, or 0 if neither object comes before the other.

var DocumentSorter = exports.DocumentSorter = (function () {
  function DocumentSorter(spec) {
    var _this = this;

    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, DocumentSorter);

    this._sortSpecParts = [];

    var addSpecPart = function addSpecPart(path, ascending) {
      if (!path) {
        throw Error('sort keys must be non-empty');
      }
      if (path.charAt(0) === '$') {
        throw Error('unsupported sort key: ' + path);
      }
      _this._sortSpecParts.push({
        path: path,
        lookup: (0, _DocumentMatcher.makeLookupFunction)(path, { forSort: true }),
        ascending: ascending
      });
    };

    if (spec instanceof Array) {
      for (var i = 0; i < spec.length; i++) {
        if (typeof spec[i] === 'string') {
          addSpecPart(spec[i], true);
        } else {
          addSpecPart(spec[i][0], spec[i][1] !== 'desc');
        }
      }
    } else if ((typeof spec === 'undefined' ? 'undefined' : _typeof(spec)) === 'object') {
      (0, _forEach2.default)(spec, function (value, key) {
        addSpecPart(key, value >= 0);
      });
    } else {
      throw Error('Bad sort specification: ' + JSON.stringify(spec));
    }

    // To implement affectedByModifier, we piggy-back on top of Matcher's
    // affectedByModifier code; we create a selector that is affected by the same
    // modifiers as this sort order. This is only implemented on the server.
    if (this.affectedByModifier) {
      var selector = {};
      (0, _forEach2.default)(this._sortSpecParts, function (nextSpec) {
        selector[nextSpec.path] = 1;
      });
      this._selectorForAffectedByModifier = new _DocumentMatcher2.default(selector);
    }

    this._keyComparator = composeComparators((0, _map3.default)(this._sortSpecParts, function (nextSpec, j) {
      return _this._keyFieldComparator(j);
    }));

    // If you specify a matcher for this Sorter, _keyFilter may be set to a
    // function which selects whether or not a given 'sort key' (tuple of values
    // for the different sort spec fields) is compatible with the selector.
    this._keyFilter = null;
    if (options.matcher) {
      this._useWithMatcher(options.matcher);
    }
  }

  _createClass(DocumentSorter, [{
    key: 'getComparator',
    value: function getComparator(options) {
      // If we have no distances, just use the comparator from the source
      // specification (which defaults to 'everything is equal'.
      if (!options || !options.distances) {
        return this._getBaseComparator();
      }

      var distances = options.distances;

      // Return a comparator which first tries the sort specification, and if that
      // says 'it's equal', breaks ties using $near distances.
      return composeComparators([this._getBaseComparator(), function (a, b) {
        if (!distances.has(a._id)) {
          throw Error('Missing distance for ' + a._id);
        }
        if (!distances.has(b._id)) {
          throw Error('Missing distance for ' + b._id);
        }
        return distances.get(a._id) - distances.get(b._id);
      }]);
    }
  }, {
    key: '_getPaths',
    value: function _getPaths() {
      return (0, _map3.default)(this._sortSpecParts, function (x) {
        return x.path;
      });
    }

    // Finds the minimum key from the doc, according to the sort specs.  (We say
    // 'minimum' here but this is with respect to the sort spec, so 'descending'
    // sort fields mean we're finding the max for that field.)
    //
    // Note that this is NOT 'find the minimum value of the first field, the
    // minimum value of the second field, etc'... it's 'choose the
    // lexicographically minimum value of the key vector, allowing only keys which
    // you can find along the same paths'.  ie, for a doc {a: [{x: 0, y: 5}, {x:
    // 1, y: 3}]} with sort spec {'a.x': 1, 'a.y': 1}, the only keys are [0,5] and
    // [1,3], and the minimum key is [0,5]; notably, [0,3] is NOT a key.

  }, {
    key: '_getMinKeyFromDoc',
    value: function _getMinKeyFromDoc(doc) {
      var _this2 = this;

      var minKey = null;

      this._generateKeysFromDoc(doc, function (key) {
        if (!_this2._keyCompatibleWithSelector(key)) {
          return;
        }

        if (minKey === null) {
          minKey = key;
          return;
        }
        if (_this2._compareKeys(key, minKey) < 0) {
          minKey = key;
        }
      });

      // This could happen if our key filter somehow filters out all the keys even
      // though somehow the selector matches.
      if (minKey === null) {
        throw Error('sort selector found no keys in doc?');
      }
      return minKey;
    }
  }, {
    key: '_keyCompatibleWithSelector',
    value: function _keyCompatibleWithSelector(key) {
      return !this._keyFilter || this._keyFilter(key);
    }

    // Iterates over each possible 'key' from doc (ie, over each branch), calling
    // 'cb' with the key.

  }, {
    key: '_generateKeysFromDoc',
    value: function _generateKeysFromDoc(doc, cb) {
      if (this._sortSpecParts.length === 0) {
        throw new Error('can\'t generate keys without a spec');
      }

      // maps index -> ({'' -> value} or {path -> value})
      var valuesByIndexAndPath = [];

      var pathFromIndices = function pathFromIndices(indices) {
        return indices.join(',') + ',';
      };

      var knownPaths = null;

      (0, _forEach2.default)(this._sortSpecParts, function (spec, whichField) {
        // Expand any leaf arrays that we find, and ignore those arrays
        // themselves.  (We never sort based on an array itself.)
        var branches = (0, _DocumentMatcher.expandArraysInBranches)(spec.lookup(doc), true);

        // If there are no values for a key (eg, key goes to an empty array),
        // pretend we found one null value.
        if (!branches.length) {
          branches = [{ value: null }];
        }

        var usedPaths = false;
        valuesByIndexAndPath[whichField] = {};
        (0, _forEach2.default)(branches, function (branch) {
          if (!branch.arrayIndices) {
            // If there are no array indices for a branch, then it must be the
            // only branch, because the only thing that produces multiple branches
            // is the use of arrays.
            if (branches.length > 1) {
              throw Error('multiple branches but no array used?');
            }
            valuesByIndexAndPath[whichField][''] = branch.value;
            return;
          }

          usedPaths = true;
          var path = pathFromIndices(branch.arrayIndices);
          if (valuesByIndexAndPath[whichField].hasOwnProperty(path)) {
            throw Error('duplicate path: ' + path);
          }
          valuesByIndexAndPath[whichField][path] = branch.value;

          // If two sort fields both go into arrays, they have to go into the
          // exact same arrays and we have to find the same paths.  This is
          // roughly the same condition that makes MongoDB throw this strange
          // error message.  eg, the main thing is that if sort spec is {a: 1,
          // b:1} then a and b cannot both be arrays.
          //
          // (In MongoDB it seems to be OK to have {a: 1, 'a.x.y': 1} where 'a'
          // and 'a.x.y' are both arrays, but we don't allow this for now.
          // #NestedArraySort
          // XXX achieve full compatibility here
          if (knownPaths && !knownPaths.hasOwnProperty(path)) {
            throw Error('cannot index parallel arrays');
          }
        });

        if (knownPaths) {
          // Similarly to above, paths must match everywhere, unless this is a
          // non-array field.
          if (!valuesByIndexAndPath[whichField].hasOwnProperty('') && (0, _keys3.default)(knownPaths).length !== (0, _keys3.default)(valuesByIndexAndPath[whichField]).length) {
            throw Error('cannot index parallel arrays!');
          }
        } else if (usedPaths) {
          knownPaths = {};
          (0, _forEach2.default)(valuesByIndexAndPath[whichField], function (x, path) {
            knownPaths[path] = true;
          });
        }
      });

      if (!knownPaths) {
        // Easy case: no use of arrays.
        var soleKey = (0, _map3.default)(valuesByIndexAndPath, function (values) {
          if (!values.hasOwnProperty('')) {
            throw Error('no value in sole key case?');
          }
          return values[''];
        });
        cb(soleKey);
        return;
      }

      (0, _forEach2.default)(knownPaths, function (x, path) {
        var key = (0, _map3.default)(valuesByIndexAndPath, function (values) {
          if (values.hasOwnProperty('')) {
            return values[''];
          }
          if (!values.hasOwnProperty(path)) {
            throw Error('missing path?');
          }
          return values[path];
        });
        cb(key);
      });
    }

    // Takes in two keys: arrays whose lengths match the number of spec
    // parts. Returns negative, 0, or positive based on using the sort spec to
    // compare fields.

  }, {
    key: '_compareKeys',
    value: function _compareKeys(key1, key2) {
      if (key1.length !== this._sortSpecParts.length || key2.length !== this._sortSpecParts.length) {
        throw Error('Key has wrong length');
      }

      return this._keyComparator(key1, key2);
    }

    // Given an index 'i', returns a comparator that compares two key arrays based
    // on field 'i'.

  }, {
    key: '_keyFieldComparator',
    value: function _keyFieldComparator(i) {
      var invert = !this._sortSpecParts[i].ascending;
      return function (key1, key2) {
        var compare = _Document.MongoTypeComp._cmp(key1[i], key2[i]);
        if (invert) {
          compare = -compare;
        }
        return compare;
      };
    }

    // Returns a comparator that represents the sort specification (but not
    // including a possible geoquery distance tie-breaker).

  }, {
    key: '_getBaseComparator',
    value: function _getBaseComparator() {
      var _this3 = this;

      // If we're only sorting on geoquery distance and no specs, just say
      // everything is equal.
      if (!this._sortSpecParts.length) {
        return function (doc1, doc2) {
          return 0;
        };
      }

      return function (doc1, doc2) {
        var key1 = _this3._getMinKeyFromDoc(doc1);
        var key2 = _this3._getMinKeyFromDoc(doc2);
        return _this3._compareKeys(key1, key2);
      };
    }

    // In MongoDB, if you have documents
    //    {_id: 'x', a: [1, 10]} and
    //    {_id: 'y', a: [5, 15]},
    // then C.find({}, {sort: {a: 1}}) puts x before y (1 comes before 5).
    // But  C.find({a: {$gt: 3}}, {sort: {a: 1}}) puts y before x (1 does not
    // match the selector, and 5 comes before 10).
    //
    // The way this works is pretty subtle!  For example, if the documents
    // are instead {_id: 'x', a: [{x: 1}, {x: 10}]}) and
    //             {_id: 'y', a: [{x: 5}, {x: 15}]}),
    // then C.find({'a.x': {$gt: 3}}, {sort: {'a.x': 1}}) and
    //      C.find({a: {$elemMatch: {x: {$gt: 3}}}}, {sort: {'a.x': 1}})
    // both follow this rule (y before x).  (ie, you do have to apply this
    // through $elemMatch.)
    //
    // So if you pass a matcher to this sorter's constructor, we will attempt to
    // skip sort keys that don't match the selector. The logic here is pretty
    // subtle and undocumented; we've gotten as close as we can figure out based
    // on our understanding of Mongo's behavior.

  }, {
    key: '_useWithMatcher',
    value: function _useWithMatcher(matcher) {
      if (this._keyFilter) {
        throw Error('called _useWithMatcher twice?');
      }

      // If we are only sorting by distance, then we're not going to bother to
      // build a key filter.
      // XXX figure out how geoqueries interact with this stuff
      if (_checkTypes2.default.emptyArray(this._sortSpecParts)) {
        return;
      }

      var selector = matcher._selector;

      // If the user just passed a literal function to find(), then we can't get a
      // key filter from it.
      if (selector instanceof Function) {
        return;
      }

      var constraintsByPath = {};
      (0, _forEach2.default)(this._sortSpecParts, function (spec, i) {
        constraintsByPath[spec.path] = [];
      });

      (0, _forEach2.default)(selector, function (subSelector, key) {
        // XXX support $and and $or

        var constraints = constraintsByPath[key];
        if (!constraints) {
          return;
        }

        // XXX it looks like the real MongoDB implementation isn't 'does the
        // regexp match' but 'does the value fall into a range named by the
        // literal prefix of the regexp', ie 'foo' in /^foo(bar|baz)+/  But
        // 'does the regexp match' is a good approximation.
        if (subSelector instanceof RegExp) {
          // As far as we can tell, using either of the options that both we and
          // MongoDB support ('i' and 'm') disables use of the key filter. This
          // makes sense: MongoDB mostly appears to be calculating ranges of an
          // index to use, which means it only cares about regexps that match
          // one range (with a literal prefix), and both 'i' and 'm' prevent the
          // literal prefix of the regexp from actually meaning one range.
          if (subSelector.ignoreCase || subSelector.multiline) {
            return;
          }
          constraints.push((0, _DocumentMatcher.regexpElementMatcher)(subSelector));
          return;
        }

        if ((0, _Document.isOperatorObject)(subSelector)) {
          (0, _forEach2.default)(subSelector, function (operand, operator) {
            if ((0, _indexOf3.default)(['$lt', '$lte', '$gt', '$gte'], operator) >= 0) {
              // XXX this depends on us knowing that these operators don't use any
              // of the arguments to compileElementSelector other than operand.
              constraints.push(_DocumentMatcher.ELEMENT_OPERATORS[operator].compileElementSelector(operand));
            }

            // See comments in the RegExp block above.
            if (operator === '$regex' && !subSelector.$options) {
              constraints.push(_DocumentMatcher.ELEMENT_OPERATORS.$regex.compileElementSelector(operand, subSelector));
            }

            // XXX support {$exists: true}, $mod, $type, $in, $elemMatch
          });
          return;
        }

        // OK, it's an equality thing.
        constraints.push((0, _DocumentMatcher.equalityElementMatcher)(subSelector));
      });

      // It appears that the first sort field is treated differently from the
      // others; we shouldn't create a key filter unless the first sort field is
      // restricted, though after that point we can restrict the other sort fields
      // or not as we wish.
      var currConstraint = constraintsByPath[this._sortSpecParts[0].path];
      if (!_checkTypes2.default.assigned(currConstraint) || _checkTypes2.default.emptyArray(currConstraint)) {
        return;
      }

      this._keyFilter = function (key) {
        return (0, _every3.default)(this._sortSpecParts, function (specPart, index) {
          return (0, _every3.default)(constraintsByPath[specPart.path], function (f) {
            return f(key[index]);
          });
        });
      };
    }
  }]);

  return DocumentSorter;
})();

exports.default = DocumentSorter;

// Given an array of comparators
// (functions (a,b)->(negative or positive or zero)), returns a single
// comparator which uses each comparator in order and returns the first
// non-zero value.

var composeComparators = function composeComparators(comparatorArray) {
  return function (a, b) {
    for (var i = 0; i < comparatorArray.length; ++i) {
      var compare = comparatorArray[i](a, b);
      if (compare !== 0) {
        return compare;
      }
    }
    return 0;
  };
};

},{"./Document":6,"./DocumentMatcher":7,"check-types":17,"fast.js/array/every":19,"fast.js/array/indexOf":21,"fast.js/forEach":24,"fast.js/map":26,"fast.js/object/keys":29}],11:[function(require,module,exports){
'use strict';

function _typeof2(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EJSON = undefined;

var _Base = require('./Base64');

var _Base2 = _interopRequireDefault(_Base);

var _some2 = require('fast.js/array/some');

var _some3 = _interopRequireDefault(_some2);

var _checkTypes = require('check-types');

var _checkTypes2 = _interopRequireDefault(_checkTypes);

var _keys2 = require('fast.js/object/keys');

var _keys3 = _interopRequireDefault(_keys2);

var _forEach = require('fast.js/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _typeof(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} /**
   * Based on Meteor's EJSON package.
   * Rewrite with ES6 and better formated for passing
   * linter
   */

// Internal utils
function _isNaN(val) {
  return typeof val === 'number' && val != +val;
}
function _has(obj, key) {
  return _checkTypes2.default.object(obj) && obj.hasOwnProperty(key);
}
function _isInfOrNan(val) {
  return _isNaN(val) || val === Infinity || val === -Infinity;
}
function _isArguments(val) {
  return !!val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) == 'object' && Object.prototype.hasOwnProperty.call(val, 'callee') && !Object.prototype.propertyIsEnumerable.call(val, 'callee');
}

var EJSON = exports.EJSON = (function () {
  // @ngInject

  function EJSON() {
    _classCallCheck(this, EJSON);

    this._setupBuiltinConverters();
    this._customTypes = {};
  }

  /**
   * @summary Add a custom type, using a method of your choice to get to and
   * from a basic JSON-able representation.  The factory argument
   * is a function of JSON-able --> your object
   * The type you add must have:
   * - A toJSONValue() method, so that Meteor can serialize it
   * - a typeName() method, to show how to look it up in our type table.
   * It is okay if these methods are monkey-patched on.
   * EJSON.clone will use toJSONValue and the given factory to produce
   * a clone, but you may specify a method clone() that will be used instead.
   * Similarly, EJSON.equals will use toJSONValue to make comparisons,
   * but you may provide a method equals() instead.
   * @locus Anywhere
   * @param {String} name A tag for your custom type; must be unique among custom data types defined in your project, and must match the result of your type's `typeName` method.
   * @param {Function} factory A function that deserializes a JSON-compatible value into an instance of your type.  This should match the serialization performed by your type's `toJSONValue` method.
   */

  _createClass(EJSON, [{
    key: 'addType',
    value: function addType(name, factory) {
      if (_has(this._customTypes, name)) {
        throw new Error('Type ' + name + ' already present');
      }
      this._customTypes[name] = factory;
    }

    /**
     * @summary Serialize an EJSON-compatible value into its plain JSON representation.
     * @locus Anywhere
     * @param {EJSON} val A value to serialize to plain JSON.
     */

  }, {
    key: 'toJSONValue',
    value: function toJSONValue(item) {
      var changed = this._toJSONValueHelper(item);
      if (changed !== undefined) {
        return changed;
      }
      if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
        item = this.clone(item);
        this._adjustTypesToJSONValue(item);
      }
      return item;
    }

    /**
     * @summary Deserialize an EJSON value from its plain JSON representation.
     * @locus Anywhere
     * @param {JSONCompatible} val A value to deserialize into EJSON.
     */

  }, {
    key: 'fromJSONValue',
    value: function fromJSONValue(item) {
      var changed = this._fromJSONValueHelper(item);
      if (changed === item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
        item = this.clone(item);
        this._adjustTypesFromJSONValue(item);
        return item;
      } else {
        return changed;
      }
    }

    /**
     * @summary Serialize a value to a string.
     * For EJSON values, the serialization fully represents the value. For non-EJSON values, serializes the same way as `JSON.stringify`.
     * @locus Anywhere
     * @param {EJSON} val A value to stringify.
     */

  }, {
    key: 'stringify',
    value: function stringify(item) {
      var json = this.toJSONValue(item);
      return JSON.stringify(json);
    }

    /**
     * @summary Parse a string into an EJSON value. Throws an error if the string is not valid EJSON.
     * @locus Anywhere
     * @param {String} str A string to parse into an EJSON value.
     */

  }, {
    key: 'parse',
    value: function parse(item) {
      if (typeof item !== 'string') {
        throw new Error('EJSON.parse argument should be a string');
      }
      return this.fromJSONValue(JSON.parse(item));
    }

    /**
     * @summary Returns true if `x` is a buffer of binary data, as returned from [`EJSON.newBinary`](#ejson_new_binary).
     * @param {Object} x The variable to check.
     * @locus Anywhere
     */

  }, {
    key: 'isBinary',
    value: function isBinary(obj) {
      return !!(typeof Uint8Array !== 'undefined' && obj instanceof Uint8Array || obj && obj.$Uint8ArrayPolyfill);
    }

    /**
     * @summary Return true if `a` and `b` are equal to each other.  Return false otherwise.  Uses the `equals` method on `a` if present, otherwise performs a deep comparison.
     * @locus Anywhere
     * @param {EJSON} a
     * @param {EJSON} b
     * @param {Object} [options]
     * @param {Boolean} options.keyOrderSensitive Compare in key sensitive order, if supported by the JavaScript implementation.  For example, `{a: 1, b: 2}` is equal to `{b: 2, a: 1}` only when `keyOrderSensitive` is `false`.  The default is `false`.
     */

  }, {
    key: 'equals',
    value: function equals(a, b, options) {
      var _this = this;

      var i;
      var keyOrderSensitive = !!(options && options.keyOrderSensitive);
      if (a === b) {
        return true;
      }
      if (_isNaN(a) && _isNaN(b)) {
        return true; // This differs from the IEEE spec for NaN equality, b/c we don't want
        // anything ever with a NaN to be poisoned from becoming equal to anything.
      }
      if (!a || !b) {
        // if either one is falsy, they'd have to be === to be equal
        return false;
      }
      if (!((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' && (typeof b === 'undefined' ? 'undefined' : _typeof(b)) === 'object')) {
        return false;
      }
      if (a instanceof Date && b instanceof Date) {
        return a.valueOf() === b.valueOf();
      }
      if (this.isBinary(a) && this.isBinary(b)) {
        if (a.length !== b.length) {
          return false;
        }
        for (i = 0; i < a.length; i++) {
          if (a[i] !== b[i]) {
            return false;
          }
        }
        return true;
      }
      if (typeof a.equals === 'function') {
        return a.equals(b, options);
      }
      if (typeof b.equals === 'function') {
        return b.equals(a, options);
      }
      if (a instanceof Array) {
        if (!(b instanceof Array)) {
          return false;
        }
        if (a.length !== b.length) {
          return false;
        }
        for (i = 0; i < a.length; i++) {
          if (!this.equals(a[i], b[i], options)) {
            return false;
          }
        }
        return true;
      }
      // fallback for custom types that don't implement their own equals
      switch (this._isCustomType(a) + this._isCustomType(b)) {
        case 1:
          return false;
        case 2:
          return this.equals(this.toJSONValue(a), this.toJSONValue(b));
      }
      // fall back to structural equality of objects
      var ret;
      if (keyOrderSensitive) {
        var bKeys = (0, _keys3.default)(b);
        i = 0;
        ret = (0, _keys3.default)(a).every(function (x) {
          if (i >= bKeys.length) {
            return false;
          }
          if (x !== bKeys[i]) {
            return false;
          }
          if (!_this.equals(a[x], b[bKeys[i]], options)) {
            return false;
          }
          i++;
          return true;
        });
        return ret && i === bKeys.length;
      } else {
        i = 0;
        ret = (0, _keys3.default)(a).every(function (key) {
          if (!_has(b, key)) {
            return false;
          }
          if (!_this.equals(a[key], b[key], options)) {
            return false;
          }
          i++;
          return true;
        });
        return ret && (0, _keys3.default)(b).length === i;
      }
    }

    /**
     * @summary Return a deep copy of `val`.
     * @locus Anywhere
     * @param {EJSON} val A value to copy.
     */

  }, {
    key: 'clone',
    value: function clone(v) {
      var _this2 = this;

      var ret;
      if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) !== 'object') {
        return v;
      }
      if (v === null) {
        return null; // null has typeof 'object'
      }
      if (v instanceof Date) {
        return new Date(v.getTime());
      }
      // RegExps are not really EJSON elements (eg we don't define a serialization
      // for them), but they're immutable anyway, so we can support them in clone.
      if (v instanceof RegExp) {
        return v;
      }
      if (this.isBinary(v)) {
        ret = _Base2.default.newBinary(v.length);
        for (var i = 0; i < v.length; i++) {
          ret[i] = v[i];
        }
        return ret;
      }

      if (_checkTypes2.default.array(v) || _isArguments(v)) {
        ret = [];
        for (var i = 0; i < v.length; i++) {
          ret[i] = this.clone(v[i]);
        }
        return ret;
      }
      // handle general user-defined typed Objects if they have a clone method
      if (typeof v.clone === 'function') {
        return v.clone();
      }
      // handle other custom types
      if (this._isCustomType(v)) {
        return this.fromJSONValue(this.clone(this.toJSONValue(v)), true);
      }
      // handle other objects
      ret = {};
      (0, _forEach2.default)(v, function (val, key) {
        ret[key] = _this2.clone(val);
      });
      return ret;
    }
  }, {
    key: 'newBinary',
    value: function newBinary(len) {
      return _Base2.default.newBinary(len);
    }
  }, {
    key: '_setupBuiltinConverters',
    value: function _setupBuiltinConverters() {
      var _this3 = this;

      this._builtinConverters = [{ // Date
        matchJSONValue: function matchJSONValue(obj) {
          return _has(obj, '$date') && (0, _keys3.default)(obj).length === 1;
        },
        matchObject: function matchObject(obj) {
          return obj instanceof Date;
        },
        toJSONValue: function toJSONValue(obj) {
          return { $date: obj.getTime() };
        },
        fromJSONValue: function fromJSONValue(obj) {
          return new Date(obj.$date);
        }
      }, { // NaN, Inf, -Inf. (These are the only objects with typeof !== 'object'
        // which we match.)
        matchJSONValue: function matchJSONValue(obj) {
          return _has(obj, '$InfNaN') && (0, _keys3.default)(obj).length === 1;
        },
        matchObject: _isInfOrNan,
        toJSONValue: function toJSONValue(obj) {
          var sign;
          if (_isNaN(obj)) {
            sign = 0;
          } else if (obj === Infinity) {
            sign = 1;
          } else {
            sign = -1;
          }
          return { $InfNaN: sign };
        },
        fromJSONValue: function fromJSONValue(obj) {
          return obj.$InfNaN / 0;
        }
      }, { // Binary
        matchJSONValue: function matchJSONValue(obj) {
          return _has(obj, '$binary') && (0, _keys3.default)(obj).length === 1;
        },
        matchObject: function matchObject(obj) {
          return typeof Uint8Array !== 'undefined' && obj instanceof Uint8Array || obj && _has(obj, '$Uint8ArrayPolyfill');
        },
        toJSONValue: function toJSONValue(obj) {
          return { $binary: _Base2.default.encode(obj) };
        },
        fromJSONValue: function fromJSONValue(obj) {
          return _Base2.default.decode(obj.$binary);
        }
      }, { // Escaping one level
        matchJSONValue: function matchJSONValue(obj) {
          return _has(obj, '$escape') && (0, _keys3.default)(obj).length === 1;
        },
        matchObject: function matchObject(obj) {
          if (!_checkTypes2.default.assigned(obj) || _checkTypes2.default.emptyObject(obj) || _checkTypes2.default.object(obj) && (0, _keys3.default)(obj).length > 2) {
            return false;
          }
          return (0, _some3.default)(_this3._builtinConverters, function (converter) {
            return converter.matchJSONValue(obj);
          });
        },
        toJSONValue: function toJSONValue(obj) {
          var newObj = {};
          (0, _forEach2.default)(obj, function (val, key) {
            newObj[key] = _this3.toJSONValue(val);
          });
          return { $escape: newObj };
        },
        fromJSONValue: function fromJSONValue(obj) {
          var newObj = {};
          (0, _forEach2.default)(obj.$escape, function (val, key) {
            newObj[key] = _this3.fromJSONValue(val);
          });
          return newObj;
        }
      }, { // Custom
        matchJSONValue: function matchJSONValue(obj) {
          return _has(obj, '$type') && _has(obj, '$value') && (0, _keys3.default)(obj).length === 2;
        },
        matchObject: function matchObject(obj) {
          return _this3._isCustomType(obj);
        },
        toJSONValue: function toJSONValue(obj) {
          var jsonValue = obj.toJSONValue();
          return { $type: obj.typeName(), $value: jsonValue };
        },
        fromJSONValue: function fromJSONValue(obj) {
          var typeName = obj.$type;
          if (!_has(_this3._customTypes, typeName)) {
            throw new Error('Custom EJSON type ' + typeName + ' is not defined');
          }
          var converter = _this3._customTypes[typeName];
          return converter(obj.$value);
        }
      }];
    }
  }, {
    key: '_isCustomType',
    value: function _isCustomType(obj) {
      return obj && typeof obj.toJSONValue === 'function' && typeof obj.typeName === 'function' && _has(this._customTypes, obj.typeName());
    }

    /**
     * For both arrays and objects, in-place modification.
     */

  }, {
    key: '_adjustTypesToJSONValue',
    value: function _adjustTypesToJSONValue(obj) {
      var _this4 = this;

      // Is it an atom that we need to adjust?
      if (obj === null) {
        return null;
      }
      var maybeChanged = this._toJSONValueHelper(obj);
      if (maybeChanged !== undefined) {
        return maybeChanged;
      }

      // Other atoms are unchanged.
      if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
        return obj;
      }

      // Iterate over array or object structure.
      (0, _forEach2.default)(obj, function (value, key) {
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' && value !== undefined && !_isInfOrNan(value)) {
          return;
        }

        var changed = _this4._toJSONValueHelper(value);
        if (changed) {
          obj[key] = changed;
          return;
        }
        // if we get here, value is an object but not adjustable
        // at this level.  recurse.
        _this4._adjustTypesToJSONValue(value);
      });
      return obj;
    }

    /**
     * Either return the JSON-compatible version of the argument, or undefined
     * (if the item isn't itself replaceable, but maybe some fields in it are)
     */

  }, {
    key: '_toJSONValueHelper',
    value: function _toJSONValueHelper(item) {
      for (var i = 0; i < this._builtinConverters.length; i++) {
        var converter = this._builtinConverters[i];
        if (converter.matchObject(item)) {
          return converter.toJSONValue(item);
        }
      }
      return undefined;
    }

    /**
     * For both arrays and objects. Tries its best to just
     * use the object you hand it, but may return something
     * different if the object you hand it itself needs changing.
     */

  }, {
    key: '_adjustTypesFromJSONValue',
    value: function _adjustTypesFromJSONValue(obj) {
      var _this5 = this;

      if (obj === null) {
        return null;
      }
      var maybeChanged = this._fromJSONValueHelper(obj);
      if (maybeChanged !== obj) {
        return maybeChanged;
      }

      // Other atoms are unchanged.
      if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
        return obj;
      }

      (0, _forEach2.default)(obj, function (value, key) {
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
          var changed = _this5._fromJSONValueHelper(value);
          if (value !== changed) {
            obj[key] = changed;
            return;
          }
          // if we get here, value is an object but not adjustable
          // at this level.  recurse.
          _this5._adjustTypesFromJSONValue(value);
        }
      });
      return obj;
    }

    /**
     * Either return the argument changed to have the non-json
     * rep of itself (the Object version) or the argument itself.
     * DOES NOT RECURSE.  For actually getting the fully-changed value,
     * use EJSON.fromJSONValue
     */

  }, {
    key: '_fromJSONValueHelper',
    value: function _fromJSONValueHelper(value) {
      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null) {
        if ((0, _keys3.default)(value).length <= 2 && (0, _keys3.default)(value).every(function (k) {
          return typeof k === 'string' && k.substr(0, 1) === '$';
        })) {
          for (var i = 0; i < this._builtinConverters.length; i++) {
            var converter = this._builtinConverters[i];
            if (converter.matchJSONValue(value)) {
              return converter.fromJSONValue(value);
            }
          }
        }
      }
      return value;
    }
  }]);

  return EJSON;
})();

exports.default = new EJSON();

},{"./Base64":1,"check-types":17,"fast.js/array/some":23,"fast.js/forEach":24,"fast.js/object/keys":29}],12:[function(require,module,exports){
'use strict';

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexManager = undefined;

var _keys2 = require('fast.js/object/keys');

var _keys3 = _interopRequireDefault(_keys2);

var _forEach = require('fast.js/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _map2 = require('fast.js/map');

var _map3 = _interopRequireDefault(_map2);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _PromiseQueue = require('./PromiseQueue');

var _PromiseQueue2 = _interopRequireDefault(_PromiseQueue);

var _CollectionIndex = require('./CollectionIndex');

var _CollectionIndex2 = _interopRequireDefault(_CollectionIndex);

var _DocumentRetriver = require('./DocumentRetriver');

var _DocumentRetriver2 = _interopRequireDefault(_DocumentRetriver);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * Manager for controlling a list of indexes
 * for some model. Building indexes is promise
 * based.
 * By default it creates an index for `_id` field.
 */

var IndexManager = exports.IndexManager = (function () {
  function IndexManager(db) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, IndexManager);

    this.db = db;
    this.indexes = {};
    this._queue = new _PromiseQueue2.default(options.concurrency || 2);

    // By default ensure index by _id field
    this.ensureIndex({
      fieldName: '_id',
      unique: true
    });
  }

  /**
   * Check index existance for given `options.fieldName` and
   * if index not exists it creates new one.
   * Always return a promise that resolved only when
   * index succesfully created, built and ready for working with.
   * If `options.forceRebuild` provided and equals to true then
   * existing index will be rebuilt, otherwise existing index
   * don't touched.
   *
   * @param  {Object} options.fieldName     name of the field for indexing
   * @param  {Object} options.forceRebuild  rebuild index if it exists
   * @return {Promise}
   */

  _createClass(IndexManager, [{
    key: 'ensureIndex',
    value: function ensureIndex(options) {
      (0, _invariant2.default)(options && options.fieldName, 'You must specify a fieldName in options object');

      var key = options.fieldName;
      if (!this.indexes[key]) {
        this.indexes[key] = new _CollectionIndex2.default(options);
        return this.buildIndex(key);
      } else if (this.indexes[key].buildPromise) {
        return this.indexes[key].buildPromise;
      } else if (options && options.forceRebuild) {
        return this.buildIndex(key);
      } else {
        return Promise.resolve();
      }
    }

    /**
     * Buld an existing index (ensured) and return a
     * promise that will be resolved only when index successfully
     * built for all documents in the storage.
     * @param  {String} key
     * @return {Promise}
     */

  }, {
    key: 'buildIndex',
    value: function buildIndex(key) {
      var _this = this;

      (0, _invariant2.default)(this.indexes[key], 'Index with key `%s` does not ensured yet', key);

      var cleanup = function cleanup() {
        return _this.indexes[key].buildPromise = null;
      };
      var buildPromise = this._queue.add(this._doBuildIndex.bind(this, key)).then(cleanup, cleanup);

      this.indexes[key].buildPromise = buildPromise;
      return buildPromise;
    }

    /**
     * Schedule a task for each index in the
     * manager. Return promise that will be resolved
     * when all indexes is successfully built.
     * @return {Promise}
     */

  }, {
    key: 'buildAllIndexes',
    value: function buildAllIndexes() {
      var _this2 = this;

      return Promise.all((0, _map3.default)((0, _keys3.default)(this.indexes), function (k) {
        return _this2.ensureIndex({
          fieldName: k,
          forceRebuild: true
        });
      }));
    }

    /**
     * Remove an index
     * @param  {String} key
     * @return {Promise}
     */

  }, {
    key: 'removeIndex',
    value: function removeIndex(key) {
      var _this3 = this;

      return this._queue.add(function () {
        delete _this3.indexes[key];
      });
    }

    /**
     * Add a document to all indexes
     * @param  {Object} doc
     * @return {Promise}
     */

  }, {
    key: 'indexDocument',
    value: function indexDocument(doc) {
      var _this4 = this;

      return this._queue.add(function () {
        var keys = (0, _keys3.default)(_this4.indexes);
        var failingIndex = null;
        try {
          (0, _forEach2.default)(keys, function (k, i) {
            failingIndex = i;
            _this4.indexes[k].insert(doc);
          });
        } catch (e) {
          (0, _forEach2.default)(keys.slice(0, failingIndex), function (k) {
            _this4.indexes[k].remove(doc);
          });
          throw e;
        }
      });
    }

    /**
     * Update all indexes with new version of
     * the document
     * @param  {Object} oldDoc
     * @param  {Object} newDoc
     * @return {Promise}
     */

  }, {
    key: 'reindexDocument',
    value: function reindexDocument(oldDoc, newDoc) {
      var _this5 = this;

      return this._queue.add(function () {
        var keys = (0, _keys3.default)(_this5.indexes);
        var failingIndex = null;
        try {
          (0, _forEach2.default)(keys, function (k, i) {
            failingIndex = i;
            _this5.indexes[k].update(oldDoc, newDoc);
          });
        } catch (e) {
          (0, _forEach2.default)(keys.slice(0, failingIndex), function (k) {
            _this5.indexes[k].revertUpdate(oldDoc, newDoc);
          });
          throw e;
        }
      });
    }

    /**
     * Remove document from all indexes
     * @param  {Object} doc
     * @return {Promise}
     */

  }, {
    key: 'deindexDocument',
    value: function deindexDocument(doc) {
      var _this6 = this;

      return this._queue.add(function () {
        var keys = (0, _keys3.default)(_this6.indexes);
        (0, _forEach2.default)(keys, function (k) {
          _this6.indexes[k].remove(doc);
        });
      });
    }

    /**
     * Build an existing index with reseting first
     * @param  {String} key
     * @return {Promise}
     */

  }, {
    key: '_doBuildIndex',
    value: function _doBuildIndex(key) {
      // Get and reset index
      var index = this.indexes[key];
      index.reset();

      // Loop through all doucments in the storage
      var errors = [];
      return new _DocumentRetriver2.default(this.db).retriveAll().then(function (docs) {
        (0, _forEach2.default)(docs, function (doc) {
          try {
            index.insert(doc);
          } catch (e) {
            errors.push([e, doc]);
          }
        });

        if (errors.length > 0) {
          throw new Error('Index build failed with errors: ', errors);
        }
      });
    }
  }]);

  return IndexManager;
})();

exports.default = IndexManager;

},{"./CollectionIndex":3,"./DocumentRetriver":9,"./PromiseQueue":13,"fast.js/forEach":24,"fast.js/map":26,"fast.js/object/keys":29,"invariant":33}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Queue;
/**
 * @return {Object}
 */
var LocalPromise = typeof Promise !== 'undefined' ? Promise : function () {
  return {
    then: function then() {
      throw new Error('Queue.configure() before use Queue');
    }
  };
};

var noop = function noop() {};

/**
 * @param {*} value
 * @returns {LocalPromise}
 */
var resolveWith = function resolveWith(value) {
  if (value && typeof value.then === 'function') {
    return value;
  }

  return new LocalPromise(function (resolve) {
    resolve(value);
  });
};

/**
 * It limits concurrently executed promises
 *
 * @param {Number} [maxPendingPromises=Infinity] max number of concurrently executed promises
 * @param {Number} [maxQueuedPromises=Infinity]  max number of queued promises
 * @constructor
 *
 * @example
 *
 * var queue = new Queue(1);
 *
 * queue.add(function () {
 *     // resolve of this promise will resume next request
 *     return downloadTarballFromGithub(url, file);
 * })
 * .then(function (file) {
 *     doStuffWith(file);
 * });
 *
 * queue.add(function () {
 *     return downloadTarballFromGithub(url, file);
 * })
 * // This request will be paused
 * .then(function (file) {
 *     doStuffWith(file);
 * });
 */
function Queue(maxPendingPromises, maxQueuedPromises) {
  this.pendingPromises = 0;
  this.maxPendingPromises = typeof maxPendingPromises !== 'undefined' ? maxPendingPromises : Infinity;
  this.maxQueuedPromises = typeof maxQueuedPromises !== 'undefined' ? maxQueuedPromises : Infinity;
  this.queue = [];
}

/**
 * Defines promise promiseFactory
 * @param {Function} GlobalPromise
 */
Queue.configure = function (GlobalPromise) {
  LocalPromise = GlobalPromise;
};

/**
 * @param {Function} promiseGenerator
 * @return {LocalPromise}
 */
Queue.prototype.add = function (promiseGenerator) {
  var self = this;
  return new LocalPromise(function (resolve, reject, notify) {
    // Do not queue to much promises
    if (self.queue.length >= self.maxQueuedPromises) {
      reject(new Error('Queue limit reached'));
      return;
    }

    // Add to queue
    self.queue.push({
      promiseGenerator: promiseGenerator,
      resolve: resolve,
      reject: reject,
      notify: notify || noop
    });

    self._dequeue();
  });
};

/**
 * Number of simultaneously running promises (which are resolving)
 *
 * @return {number}
 */
Queue.prototype.getPendingLength = function () {
  return this.pendingPromises;
};

/**
 * Number of queued promises (which are waiting)
 *
 * @return {number}
 */
Queue.prototype.getQueueLength = function () {
  return this.queue.length;
};

/**
 * @returns {boolean} true if first item removed from queue
 * @private
 */
Queue.prototype._dequeue = function () {
  var self = this;
  if (this.pendingPromises >= this.maxPendingPromises) {
    return false;
  }

  // Remove from queue
  var item = this.queue.shift();
  if (!item) {
    return false;
  }

  try {
    this.pendingPromises++;

    resolveWith(item.promiseGenerator())
    // Forward all stuff
    .then(function (value) {
      // It is not pending now
      self.pendingPromises--;
      // It should pass values
      item.resolve(value);
      self._dequeue();
    }, function (err) {
      // It is not pending now
      self.pendingPromises--;
      // It should not mask errors
      item.reject(err);
      self._dequeue();
    }, function (message) {
      // It should pass notifications
      item.notify(message);
    });
  } catch (err) {
    self.pendingPromises--;
    item.reject(err);
    self._dequeue();
  }

  return true;
};

},{}],14:[function(require,module,exports){
'use strict';

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

// see http://baagoe.org/en/wiki/Better_random_numbers_for_javascript
// for a full discussion and Alea implementation.
var Alea = function Alea() {
  function Mash() {
    var n = 0xefc8249d;

    var mash = function mash(data) {
      data = data.toString();
      for (var i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000; // 2^32
      }
      return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };

    mash.version = 'Mash 0.9';
    return mash;
  }

  return (function (args) {
    var s0 = 0;
    var s1 = 0;
    var s2 = 0;
    var c = 1;

    if (args.length == 0) {
      args = [+new Date()];
    }
    var mash = Mash();
    s0 = mash(' ');
    s1 = mash(' ');
    s2 = mash(' ');

    for (var i = 0; i < args.length; i++) {
      s0 -= mash(args[i]);
      if (s0 < 0) {
        s0 += 1;
      }
      s1 -= mash(args[i]);
      if (s1 < 0) {
        s1 += 1;
      }
      s2 -= mash(args[i]);
      if (s2 < 0) {
        s2 += 1;
      }
    }
    mash = null;

    var random = function random() {
      var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
      s0 = s1;
      s1 = s2;
      return s2 = t - (c = t | 0);
    };
    random.uint32 = function () {
      return random() * 0x100000000; // 2^32
    };
    random.fract53 = function () {
      return random() + (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
    };
    random.version = 'Alea 0.9';
    random.args = args;
    return random;
  })(Array.prototype.slice.call(arguments));
};

var UNMISTAKABLE_CHARS = '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz';
var BASE64_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' + '0123456789-_';

var Random = exports.Random = (function () {
  function Random() {
    _classCallCheck(this, Random);

    // Get first argumnts with this method
    // because ngInject tries to inject any
    // service from a declared consturcor
    var seedArray = arguments[0];

    // Get default seed in the browser
    if (seedArray === undefined && !(typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues)) {
      var height = typeof window !== 'undefined' && window.innerHeight || typeof document !== 'undefined' && document.documentElement && document.documentElement.clientHeight || typeof document !== 'undefined' && document.body && document.body.clientHeight || 1;

      var width = typeof window !== 'undefined' && window.innerWidth || typeof document !== 'undefined' && document.documentElement && document.documentElement.clientWidth || typeof document !== 'undefined' && document.body && document.body.clientWidth || 1;

      var agent = typeof navigator !== 'undefined' && navigator.userAgent || '';
      seedArray = [new Date(), height, width, agent, Math.random()];
    }

    // Use Alea then seed provided
    if (seedArray !== undefined) {
      this.alea = Alea.apply(null, seedArray);
    }
  }

  _createClass(Random, [{
    key: 'fraction',
    value: function fraction() {
      var self = this;
      if (self.alea) {
        return self.alea();
      } else if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        var array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return array[0] * 2.3283064365386963e-10; // 2^-32
      } else {
          throw new Error('No random generator available');
        }
    }
  }, {
    key: 'hexString',
    value: function hexString(digits) {
      var self = this;
      var hexDigits = [];

      for (var i = 0; i < digits; ++i) {
        hexDigits.push(self.choice('0123456789abcdef'));
      }

      return hexDigits.join('');
    }
  }, {
    key: '_randomString',
    value: function _randomString(charsCount, alphabet) {
      var self = this;
      var digits = [];
      for (var i = 0; i < charsCount; i++) {
        digits[i] = self.choice(alphabet);
      }
      return digits.join('');
    }
  }, {
    key: 'id',
    value: function id(charsCount) {
      var self = this;
      // 17 characters is around 96 bits of entropy, which is the amount of
      // state in the Alea PRNG.
      if (charsCount === undefined) {
        charsCount = 17;
      }

      return self._randomString(charsCount, UNMISTAKABLE_CHARS);
    }
  }, {
    key: 'secret',
    value: function secret(charsCount) {
      var self = this;
      // Default to 256 bits of entropy, or 43 characters at 6 bits per
      // character.
      if (charsCount === undefined) {
        charsCount = 43;
      }
      return self._randomString(charsCount, BASE64_CHARS);
    }
  }, {
    key: 'choice',
    value: function choice(arrayOrString) {
      var index = Math.floor(this.fraction() * arrayOrString.length);
      if (typeof arrayOrString === 'string') {
        return arrayOrString.substr(index, 1);
      } else {
        return arrayOrString[index];
      }
    }
  }], [{
    key: 'createWithSeed',
    value: function createWithSeed() {
      if (arguments.length === 0) {
        throw new Error('No seeds were provided');
      }
      return new Random(arguments);
    }
  }]);

  return Random;
})();

exports.default = Random;

},{}],15:[function(require,module,exports){
'use strict';

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StorageManager = undefined;

var _forEach = require('fast.js/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _PromiseQueue = require('./PromiseQueue');

var _PromiseQueue2 = _interopRequireDefault(_PromiseQueue);

var _EJSON = require('./EJSON');

var _EJSON2 = _interopRequireDefault(_EJSON);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * Manager for dealing with backend storage
 * of the daatabase. Default implementation uses
 * memory. You can implement the same interface
 * and use another storage (with levelup, for example)
 */

var StorageManager = exports.StorageManager = (function () {
  function StorageManager(db, options) {
    _classCallCheck(this, StorageManager);

    this.db = db;
    this._queue = new _PromiseQueue2.default(1);
    this._storage = {};
    this.reload();
  }

  _createClass(StorageManager, [{
    key: 'loaded',
    value: function loaded() {
      return this._loadedPromise;
    }
  }, {
    key: 'reload',
    value: function reload() {
      var _this = this;

      if (this._loadedPromise) {
        this._loadedPromise = this._loadedPromise.then(function () {
          return _this._loadStorage();
        });
      } else {
        this._loadedPromise = this._loadStorage();
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var _this2 = this;

      return this.loaded().then(function () {
        _this2._storage = {};
      });
    }
  }, {
    key: 'persist',
    value: function persist(key, value) {
      var _this3 = this;

      return this.loaded().then(function () {
        _this3._storage[key] = _EJSON2.default.clone(value);
      });
    }
  }, {
    key: 'delete',
    value: function _delete(key) {
      var _this4 = this;

      return this.loaded().then(function () {
        delete _this4._storage[key];
      });
    }
  }, {
    key: 'get',
    value: function get(key) {
      var _this5 = this;

      return this.loaded().then(function () {
        return _this5._storage[key];
      });
    }
  }, {
    key: 'createReadStream',
    value: function createReadStream() {
      var _this6 = this;

      var emitter = new _eventemitter2.default();
      this.loaded().then(function () {
        (0, _forEach2.default)(_this6._storage, function (v, k) {
          emitter.emit('data', { value: v });
        });
        emitter.emit('end');
      });
      return emitter;
    }
  }, {
    key: '_loadStorage',
    value: function _loadStorage() {
      return Promise.resolve();
    }
  }]);

  return StorageManager;
})();

exports.default = StorageManager;

},{"./EJSON":11,"./PromiseQueue":13,"eventemitter3":18,"fast.js/forEach":24}],16:[function(require,module,exports){
'use strict';

var Collection = require('./dist/Collection').default;
var CursorObservable = require('./dist/CursorObservable').default;
var StorageManager = require('./dist/StorageManager').default;
var Random = require('./dist/Random').default;
var EJSON = require('./dist/EJSON').default;
var Base64 = require('./dist/Base64').default;

module.exports = {
  __esModule: true,
  default: Collection,
  Random: Random,
  EJSON: EJSON,
  Base64: Base64,
  Collection: Collection,
  CursorObservable: CursorObservable,
  StorageManager: StorageManager
};

},{"./dist/Base64":1,"./dist/Collection":2,"./dist/CursorObservable":5,"./dist/EJSON":11,"./dist/Random":14,"./dist/StorageManager":15}],17:[function(require,module,exports){
/*globals define, module, Symbol */

(function (globals) {
  'use strict';

  var messages, predicates, functions,
      assert, not, maybe, either,
      collections, slice;

  messages = {
    equal: 'Invalid value',
    undefined: 'Invalid value',
    null: 'Invalid value',
    assigned: 'Invalid value',
    zero: 'Invalid number',
    infinity: 'Invalid number',
    number: 'Invalid number',
    integer: 'Invalid number',
    even: 'Invalid number',
    odd: 'Invalid number',
    greater: 'Invalid number',
    less: 'Invalid number',
    between: 'Invalid number',
    greaterOrEqual: 'Invalid number',
    lessOrEqual: 'Invalid number',
    inRange: 'Invalid number',
    positive: 'Invalid number',
    negative: 'Invalid number',
    string: 'Invalid string',
    emptyString: 'Invalid string',
    nonEmptyString: 'Invalid string',
    contains: 'Invalid string',
    match: 'Invalid string',
    boolean: 'Invalid boolean',
    object: 'Invalid object',
    emptyObject: 'Invalid object',
    instance: 'Invalid type',
    builtIn: 'Invalid type',
    userDefined: 'Invalid type',
    like: 'Invalid type',
    array: 'Invalid array',
    emptyArray: 'Invalid array',
    arrayLike: 'Invalid array-like object',
    iterable: 'Invalid iterable',
    includes: 'Invalid value',
    hasLength: 'Invalid length',
    date: 'Invalid date',
    function: 'Invalid function'
  };

  predicates = {
    equal: equal,
    undefined: isUndefined,
    null: isNull,
    assigned: assigned,
    zero: zero,
    infinity: infinity,
    number: number,
    integer : integer,
    even: even,
    odd: odd,
    greater: greater,
    less: less,
    between: between,
    greaterOrEqual: greaterOrEqual,
    lessOrEqual: lessOrEqual,
    inRange: inRange,
    positive: positive,
    negative: negative,
    string: string,
    emptyString: emptyString,
    nonEmptyString: nonEmptyString,
    contains: contains,
    match: match,
    boolean: boolean,
    object: object,
    emptyObject: emptyObject,
    instance: instance,
    builtIn: builtIn,
    userDefined: userDefined,
    like: like,
    array: array,
    emptyArray: emptyArray,
    arrayLike: arrayLike,
    iterable: iterable,
    includes: includes,
    hasLength: hasLength,
    date: date,
    function: isFunction
  };

  functions = {
    apply: apply,
    map: map,
    all: all,
    any: any
  };

  collections = [ 'array', 'arrayLike', 'iterable', 'object' ];
  slice = Array.prototype.slice;

  functions = mixin(functions, predicates);
  assert = createModifiedPredicates(assertModifier, assertImpl);
  not = createModifiedPredicates(notModifier, notImpl);
  maybe = createModifiedPredicates(maybeModifier, maybeImpl);
  either = createModifiedPredicates(eitherModifier);
  assert.not = createModifiedModifier(assertModifier, not);
  assert.maybe = createModifiedModifier(assertModifier, maybe);
  assert.either = createModifiedModifier(assertEitherModifier, predicates);

  collections.forEach(createOfPredicates);
  createOfModifiers(assert, assertModifier);
  createOfModifiers(not, notModifier);
  collections.forEach(createMaybeOfModifiers);

  exportFunctions(mixin(functions, {
    assert: assert,
    not: not,
    maybe: maybe,
    either: either
  }));

  /**
   * Public function `equal`.
   *
   * Returns true if `lhs` and `rhs` are strictly equal, without coercion.
   * Returns false otherwise.
   */
  function equal (lhs, rhs) {
    return lhs === rhs;
  }

  /**
   * Public function `undefined`.
   *
   * Returns true if `data` is undefined, false otherwise.
   */
  function isUndefined (data) {
    return data === undefined;
  }

  /**
   * Public function `null`.
   *
   * Returns true if `data` is null, false otherwise.
   */
  function isNull (data) {
    return data === null;
  }

  /**
   * Public function `assigned`.
   *
   * Returns true if `data` is not null or undefined, false otherwise.
   */
  function assigned (data) {
    return ! isUndefined(data) && ! isNull(data);
  }

  /**
   * Public function `zero`.
   *
   * Returns true if `data` is zero, false otherwise.
   */
  function zero (data) {
    return data === 0;
  }

  /**
   * Public function `infinity`.
   *
   * Returns true if `data` is positive or negative infinity, false otherwise.
   */
  function infinity (data) {
    return data === Number.POSITIVE_INFINITY || data === Number.NEGATIVE_INFINITY;
  }

  /**
   * Public function `number`.
   *
   * Returns true if `data` is a number, false otherwise.
   */
  function number (data) {
    return typeof data === 'number' &&
      isNaN(data) === false &&
      data !== Number.POSITIVE_INFINITY &&
      data !== Number.NEGATIVE_INFINITY;
  }

  /**
   * Public function `integer`.
   *
   * Returns true if `data` is an integer, false otherwise.
   */
  function integer (data) {
    return number(data) && data % 1 === 0;
  }

  /**
   * Public function `even`.
   *
   * Returns true if `data` is an even number, false otherwise.
   */
  function even (data) {
    return number(data) && data % 2 === 0;
  }

  /**
   * Public function `odd`.
   *
   * Returns true if `data` is an odd number, false otherwise.
   */
  function odd (data) {
    return integer(data) && !even(data);
  }

  /**
   * Public function `greater`.
   *
   * Returns true if `lhs` is a number greater than `rhs`, false otherwise.
   */
  function greater (lhs, rhs) {
    return number(lhs) && lhs > rhs;
  }

  /**
   * Public function `less`.
   *
   * Returns true if `lhs` is a number less than `rhs`, false otherwise.
   */
  function less (lhs, rhs) {
    return number(lhs) && lhs < rhs;
  }

  /**
   * Public function `between`.
   *
   * Returns true if `data` is a number between `x` and `y`, false otherwise.
   */
  function between (data, x, y) {
    if (x < y) {
      return greater(data, x) && less(data, y);
    }

    return less(data, x) && greater(data, y);
  }

  /**
   * Public function `greaterOrEqual`.
   *
   * Returns true if `lhs` is a number greater than or equal to `rhs`, false
   * otherwise.
   */
  function greaterOrEqual (lhs, rhs) {
    return number(lhs) && lhs >= rhs;
  }

  /**
   * Public function `lessOrEqual`.
   *
   * Returns true if `lhs` is a number less than or equal to `rhs`, false
   * otherwise.
   */
  function lessOrEqual (lhs, rhs) {
    return number(lhs) && lhs <= rhs;
  }

  /**
   * Public function `inRange`.
   *
   * Returns true if `data` is a number in the range `x..y`, false otherwise.
   */
  function inRange (data, x, y) {
    if (x < y) {
      return greaterOrEqual(data, x) && lessOrEqual(data, y);
    }

    return lessOrEqual(data, x) && greaterOrEqual(data, y);
  }

  /**
   * Public function `positive`.
   *
   * Returns true if `data` is a positive number, false otherwise.
   */
  function positive (data) {
    return greater(data, 0);
  }

  /**
   * Public function `negative`.
   *
   * Returns true if `data` is a negative number, false otherwise.
   */
  function negative (data) {
    return less(data, 0);
  }

  /**
   * Public function `string`.
   *
   * Returns true if `data` is a string, false otherwise.
   */
  function string (data) {
    return typeof data === 'string';
  }

  /**
   * Public function `emptyString`.
   *
   * Returns true if `data` is the empty string, false otherwise.
   */
  function emptyString (data) {
    return data === '';
  }

  /**
   * Public function `nonEmptyString`.
   *
   * Returns true if `data` is a non-empty string, false otherwise.
   */
  function nonEmptyString (data) {
    return string(data) && data !== '';
  }

  /**
   * Public function `contains`.
   *
   * Returns true if `data` is a string that contains `substring`, false
   * otherwise.
   */
  function contains (data, substring) {
    return string(data) && data.indexOf(substring) !== -1;
  }

  /**
   * Public function `match`.
   *
   * Returns true if `data` is a string that matches `regex`, false otherwise.
   */
  function match (data, regex) {
    return string(data) && !! data.match(regex);
  }

  /**
   * Public function `boolean`.
   *
   * Returns true if `data` is a boolean value, false otherwise.
   */
  function boolean (data) {
    return data === false || data === true;
  }

  /**
   * Public function `object`.
   *
   * Returns true if `data` is a plain-old JS object, false otherwise.
   */
  function object (data) {
    return Object.prototype.toString.call(data) === '[object Object]';
  }

  /**
   * Public function `emptyObject`.
   *
   * Returns true if `data` is an empty object, false otherwise.
   */
  function emptyObject (data) {
    return object(data) && Object.keys(data).length === 0;
  }

  /**
   * Public function `instance`.
   *
   * Returns true if `data` is an instance of `prototype`, false otherwise.
   */
  function instance (data, prototype) {
    try {
      return data instanceof prototype;
    } catch (error) {
      return false;
    }
  }

  /**
   * Public function `builtIn`.
   *
   * Returns true if `data` is an instance of `prototype`, false otherwise.
   * Assumes `prototype` is a standard built-in object and additionally checks
   * the result of Object.prototype.toString.
   */
  function builtIn (data, prototype) {
    try {
      return instance(data, prototype) ||
        Object.prototype.toString.call(data) === '[object ' + prototype.name + ']';
    } catch (error) {
      return false;
    }
  }

  /**
   * Public function `userDefined`.
   *
   * Returns true if `data` is an instance of `prototype`, false otherwise.
   * Assumes `prototype` is a user-defined object and additionally checks the
   * value of constructor.name.
   */
  function userDefined (data, prototype) {
    try {
      return instance(data, prototype) ||
        data.constructor.name === prototype.name;
    } catch (error) {
      return false;
    }
  }

  /**
   * Public function `like`.
   *
   * Tests whether `data` 'quacks like a duck'. Returns true if `data` has all
   * of the properties of `archetype` (the 'duck'), false otherwise.
   */
  function like (data, archetype) {
    var name;

    for (name in archetype) {
      if (archetype.hasOwnProperty(name)) {
        if (data.hasOwnProperty(name) === false || typeof data[name] !== typeof archetype[name]) {
          return false;
        }

        if (object(data[name]) && like(data[name], archetype[name]) === false) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Public function `array`.
   *
   * Returns true if `data` is an array, false otherwise.
   */
  function array (data) {
    return Array.isArray(data);
  }

  /**
   * Public function `emptyArray`.
   *
   * Returns true if `data` is an empty array, false otherwise.
   */
  function emptyArray (data) {
    return array(data) && data.length === 0;
  }

  /**
   * Public function `arrayLike`.
   *
   * Returns true if `data` is an array-like object, false otherwise.
   */
  function arrayLike (data) {
    return assigned(data) && number(data.length);
  }

  /**
   * Public function `iterable`.
   *
   * Returns true if `data` is an iterable, false otherwise.
   */
  function iterable (data) {
    if (typeof Symbol === 'undefined') {
      // Fall back to `arrayLike` predicate in pre-ES6 environments.
      return arrayLike(data);
    }

    return assigned(data) && isFunction(data[Symbol.iterator]);
  }

  /**
   * Public function `includes`.
   *
   * Returns true if `data` contains `value`, false otherwise.
   */
  function includes (data, value) {
    var iterator, iteration;

    if (not.assigned(data)) {
      return false;
    }

    try {
      if (typeof Symbol !== 'undefined' && data[Symbol.iterator] && isFunction(data.values)) {
        iterator = data.values();

        do {
          iteration = iterator.next();

          if (iteration.value === value) {
            return true;
          }
        } while (! iteration.done);

        return false;
      }

      Object.keys(data).forEach(function (key) {
        if (data[key] === value) {
          throw 0;
        }
      });
    } catch (ignore) {
      return true;
    }

    return false;
  }

  /**
   * Public function `hasLength`.
   *
   * Returns true if `data` has a length property that equals `length`, false
   * otherwise.
   */
  function hasLength (data, length) {
    return assigned(data) && data.length === length;
  }

  /**
   * Public function `date`.
   *
   * Returns true if `data` is a valid date, false otherwise.
   */
  function date (data) {
    return builtIn(data, Date) && ! isNaN(data.getTime());
  }

  /**
   * Public function `function`.
   *
   * Returns true if `data` is a function, false otherwise.
   */
  function isFunction (data) {
    return typeof data === 'function';
  }

  /**
   * Public function `apply`.
   *
   * Maps each value from the `data` to the corresponding predicate and returns
   * the result array. If the same function is to be applied across all of the
   * data, a single predicate function may be passed in.
   *
   */
  function apply (data, predicates) {
    assert.array(data);

    if (isFunction(predicates)) {
      return data.map(function (value) {
        return predicates(value);
      });
    }

    assert.array(predicates);
    assert.hasLength(data, predicates.length);

    return data.map(function (value, index) {
      return predicates[index](value);
    });
  }

  /**
   * Public function `map`.
   *
   * Maps each value from the `data` to the corresponding predicate and returns
   * the result object. Supports nested objects. If the `data` is not nested and
   * the same function is to be applied across all of it, a single predicate
   * function may be passed in.
   *
   */
  function map (data, predicates) {
    assert.object(data);

    if (isFunction(predicates)) {
      return mapSimple(data, predicates);
    }

    assert.object(predicates);

    return mapComplex(data, predicates);
  }

  function mapSimple (data, predicate) {
    var result = {};

    Object.keys(data).forEach(function (key) {
      result[key] = predicate(data[key]);
    });

    return result;
  }

  function mapComplex (data, predicates) {
    var result = {};

    Object.keys(predicates).forEach(function (key) {
      var predicate = predicates[key];

      if (isFunction(predicate)) {
        if (not.assigned(data)) {
          result[key] = !!predicate._isMaybefied;
        } else {
          result[key] = predicate(data[key]);
        }
      } else if (object(predicate)) {
        result[key] = mapComplex(data[key], predicate);
      }
    });

    return result;
  }

  /**
   * Public function `all`
   *
   * Check that all boolean values are true
   * in an array (returned from `apply`)
   * or object (returned from `map`).
   *
   */
  function all (data) {
    if (array(data)) {
      return testArray(data, false);
    }

    assert.object(data);

    return testObject(data, false);
  }

  function testArray (data, result) {
    var i;

    for (i = 0; i < data.length; i += 1) {
      if (data[i] === result) {
        return result;
      }
    }

    return !result;
  }

  function testObject (data, result) {
    var key, value;

    for (key in data) {
      if (data.hasOwnProperty(key)) {
        value = data[key];

        if (object(value) && testObject(value, result) === result) {
          return result;
        }

        if (value === result) {
          return result;
        }
      }
    }

    return !result;
  }

  /**
   * Public function `any`
   *
   * Check that at least one boolean value is true
   * in an array (returned from `apply`)
   * or object (returned from `map`).
   *
   */
  function any (data) {
    if (array(data)) {
      return testArray(data, true);
    }

    assert.object(data);

    return testObject(data, true);
  }

  function mixin (target, source) {
    Object.keys(source).forEach(function (key) {
      target[key] = source[key];
    });

    return target;
  }

  /**
   * Public modifier `assert`.
   *
   * Throws if `predicate` returns false.
   */
  function assertModifier (predicate, defaultMessage) {
    return function () {
      assertPredicate(predicate, arguments, defaultMessage);
    };
  }

  function assertPredicate (predicate, args, defaultMessage) {
    var message = args[args.length - 1];
    assertImpl(predicate.apply(null, args), nonEmptyString(message) ? message : defaultMessage);
  }

  function assertImpl (value, message) {
    if (value === false) {
      throw new Error(message || 'Assertion failed');
    }
  }

  function assertEitherModifier (predicate, defaultMessage) {
    return function () {
      var error;

      try {
        assertPredicate(predicate, arguments, defaultMessage);
      } catch (e) {
        error = e;
      }

      return {
        or: Object.keys(predicates).reduce(delayedAssert, {})
      };

      function delayedAssert (result, key) {
        result[key] = function () {
          if (error && !predicates[key].apply(null, arguments)) {
            throw error;
          }
        };

        return result;
      }
    };
  }

  /**
   * Public modifier `not`.
   *
   * Negates `predicate`.
   */
  function notModifier (predicate) {
    return function () {
      return notImpl(predicate.apply(null, arguments));
    };
  }

  function notImpl (value) {
    return !value;
  }

  /**
   * Public modifier `maybe`.
   *
   * Returns true if predicate argument is  null or undefined,
   * otherwise propagates the return value from `predicate`.
   */
  function maybeModifier (predicate) {
    var modifiedPredicate = function () {
      if (not.assigned(arguments[0])) {
        return true;
      }

      return predicate.apply(null, arguments);
    };

    // Hackishly indicate that this is a maybe.xxx predicate.
    // Without this flag, the alternative would be to iterate
    // through the maybe predicates or use indexOf to check,
    // which would be time-consuming.
    modifiedPredicate._isMaybefied = true;

    return modifiedPredicate;
  }

  function maybeImpl (value) {
    if (assigned(value) === false) {
      return true;
    }

    return value;
  }

  /**
   * Public modifier `either`.
   *
   * Returns true if either predicate is true.
   */
  function eitherModifier (predicate) {
    return function () {
      var shortcut = predicate.apply(null, arguments);

      return {
        or: Object.keys(predicates).reduce(nopOrPredicate, {})
      };

      function nopOrPredicate (result, key) {
        result[key] = shortcut ? nop : predicates[key];
        return result;
      }
    };

    function nop () {
      return true;
    }
  }

  /**
   * Public modifier `of`.
   *
   * Applies the chained predicate to members of the collection.
   */
  function ofModifier (target, type, predicate) {
    return function () {
      var collection, args;

      collection = arguments[0];

      if (target === 'maybe' && not.assigned(collection)) {
        return true;
      }

      if (!type(collection)) {
        return false;
      }

      collection = coerceCollection(type, collection);
      args = slice.call(arguments, 1);

      try {
        collection.forEach(function (item) {
          if (
            (target !== 'maybe' || assigned(item)) &&
            !predicate.apply(null, [ item ].concat(args))
          ) {
            // TODO: Replace with for...of when ES6 is required.
            throw 0;
          }
        });
      } catch (ignore) {
        return false;
      }

      return true;
    };
  }

  function coerceCollection (type, collection) {
    switch (type) {
      case arrayLike:
        return slice.call(collection);
      case object:
        return Object.keys(collection).map(function (key) {
          return collection[key];
        });
      default:
        return collection;
    }
  }

  function createModifiedPredicates (modifier, object) {
    return createModifiedFunctions([ modifier, predicates, object ]);
  }

  function createModifiedFunctions (args) {
    var modifier, object, functions, result;

    modifier = args.shift();
    object = args.pop();
    functions = args.pop();

    result = object || {};

    Object.keys(functions).forEach(function (key) {
      Object.defineProperty(result, key, {
        configurable: false,
        enumerable: true,
        writable: false,
        value: modifier.apply(null, args.concat(functions[key], messages[key]))
      });
    });

    return result;
  }

  function createModifiedModifier (modifier, modified) {
    return createModifiedFunctions([ modifier, modified, null ]);
  }

  function createOfPredicates (key) {
    predicates[key].of = createModifiedFunctions(
      [ ofModifier.bind(null, null), predicates[key], predicates, null ]
    );
  }

  function createOfModifiers (base, modifier) {
    collections.forEach(function (key) {
      base[key].of = createModifiedModifier(modifier, predicates[key].of);
    });
  }

  function createMaybeOfModifiers (key) {
    maybe[key].of = createModifiedFunctions(
      [ ofModifier.bind(null, 'maybe'), predicates[key], predicates, null ]
    );
    assert.maybe[key].of = createModifiedModifier(assertModifier, maybe[key].of);
    assert.not[key].of = createModifiedModifier(assertModifier, not[key].of);
  }

  function exportFunctions (functions) {
    if (typeof define === 'function' && define.amd) {
      define(function () {
        return functions;
      });
    } else if (typeof module !== 'undefined' && module !== null && module.exports) {
      module.exports = functions;
    } else {
      globals.check = functions;
    }
  }
}(this));

},{}],18:[function(require,module,exports){
'use strict';

//
// We store our EE objects in a plain object whose properties are event names.
// If `Object.create(null)` is not supported we prefix the event names with a
// `~` to make sure that the built-in object properties are not overridden or
// used as an attack vector.
// We also assume that `Object.create(null)` is available when the event name
// is an ES6 Symbol.
//
var prefix = typeof Object.create !== 'function' ? '~' : false;

/**
 * Representation of a single EventEmitter function.
 *
 * @param {Function} fn Event handler to be called.
 * @param {Mixed} context Context for function execution.
 * @param {Boolean} once Only emit once
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal EventEmitter interface that is molded against the Node.js
 * EventEmitter interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() { /* Nothing to set */ }

/**
 * Holds the assigned EventEmitters by name.
 *
 * @type {Object}
 * @private
 */
EventEmitter.prototype._events = undefined;

/**
 * Return a list of assigned event listeners.
 *
 * @param {String} event The events that should be listed.
 * @param {Boolean} exists We only need to know if there are listeners.
 * @returns {Array|Boolean}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event, exists) {
  var evt = prefix ? prefix + event : event
    , available = this._events && this._events[evt];

  if (exists) return !!available;
  if (!available) return [];
  if (available.fn) return [available.fn];

  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
    ee[i] = available[i].fn;
  }

  return ee;
};

/**
 * Emit an event to all registered event listeners.
 *
 * @param {String} event The name of the event.
 * @returns {Boolean} Indication if we've emitted an event.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events || !this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if ('function' === typeof listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Register a new EventListener for the given event.
 *
 * @param {String} event Name of the event.
 * @param {Functon} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;

  if (!this._events) this._events = prefix ? {} : Object.create(null);
  if (!this._events[evt]) this._events[evt] = listener;
  else {
    if (!this._events[evt].fn) this._events[evt].push(listener);
    else this._events[evt] = [
      this._events[evt], listener
    ];
  }

  return this;
};

/**
 * Add an EventListener that's only called once.
 *
 * @param {String} event Name of the event.
 * @param {Function} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;

  if (!this._events) this._events = prefix ? {} : Object.create(null);
  if (!this._events[evt]) this._events[evt] = listener;
  else {
    if (!this._events[evt].fn) this._events[evt].push(listener);
    else this._events[evt] = [
      this._events[evt], listener
    ];
  }

  return this;
};

/**
 * Remove event listeners.
 *
 * @param {String} event The event we want to remove.
 * @param {Function} fn The listener that we need to find.
 * @param {Mixed} context Only remove listeners matching this context.
 * @param {Boolean} once Only remove once listeners.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events || !this._events[evt]) return this;

  var listeners = this._events[evt]
    , events = [];

  if (fn) {
    if (listeners.fn) {
      if (
           listeners.fn !== fn
        || (once && !listeners.once)
        || (context && listeners.context !== context)
      ) {
        events.push(listeners);
      }
    } else {
      for (var i = 0, length = listeners.length; i < length; i++) {
        if (
             listeners[i].fn !== fn
          || (once && !listeners[i].once)
          || (context && listeners[i].context !== context)
        ) {
          events.push(listeners[i]);
        }
      }
    }
  }

  //
  // Reset the array, or remove it completely if we have no more listeners.
  //
  if (events.length) {
    this._events[evt] = events.length === 1 ? events[0] : events;
  } else {
    delete this._events[evt];
  }

  return this;
};

/**
 * Remove all listeners or only the listeners for the specified event.
 *
 * @param {String} event The event want to remove all listeners for.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  if (!this._events) return this;

  if (event) delete this._events[prefix ? prefix + event : event];
  else this._events = prefix ? {} : Object.create(null);

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}

},{}],19:[function(require,module,exports){
'use strict';

var bindInternal3 = require('../function/bindInternal3');

/**
 * # Every
 *
 * A fast `.every()` implementation.
 *
 * @param  {Array}    subject     The array (or array-like) to iterate over.
 * @param  {Function} fn          The visitor function.
 * @param  {Object}   thisContext The context for the visitor.
 * @return {Boolean}              true if all items in the array passes the truth test.
 */
module.exports = function fastEvery (subject, fn, thisContext) {
  var length = subject.length,
      iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
      i;
  for (i = 0; i < length; i++) {
    if (!iterator(subject[i], i, subject)) {
      return false;
    }
  }
  return true;
};

},{"../function/bindInternal3":25}],20:[function(require,module,exports){
'use strict';

var bindInternal3 = require('../function/bindInternal3');

/**
 * # For Each
 *
 * A fast `.forEach()` implementation.
 *
 * @param  {Array}    subject     The array (or array-like) to iterate over.
 * @param  {Function} fn          The visitor function.
 * @param  {Object}   thisContext The context for the visitor.
 */
module.exports = function fastForEach (subject, fn, thisContext) {
  var length = subject.length,
      iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
      i;
  for (i = 0; i < length; i++) {
    iterator(subject[i], i, subject);
  }
};

},{"../function/bindInternal3":25}],21:[function(require,module,exports){
'use strict';

/**
 * # Index Of
 *
 * A faster `Array.prototype.indexOf()` implementation.
 *
 * @param  {Array}  subject   The array (or array-like) to search within.
 * @param  {mixed}  target    The target item to search for.
 * @param  {Number} fromIndex The position to start searching from, if known.
 * @return {Number}           The position of the target in the subject, or -1 if it does not exist.
 */
module.exports = function fastIndexOf (subject, target, fromIndex) {
  var length = subject.length,
      i = 0;

  if (typeof fromIndex === 'number') {
    i = fromIndex;
    if (i < 0) {
      i += length;
      if (i < 0) {
        i = 0;
      }
    }
  }

  for (; i < length; i++) {
    if (subject[i] === target) {
      return i;
    }
  }
  return -1;
};

},{}],22:[function(require,module,exports){
'use strict';

var bindInternal3 = require('../function/bindInternal3');

/**
 * # Map
 *
 * A fast `.map()` implementation.
 *
 * @param  {Array}    subject     The array (or array-like) to map over.
 * @param  {Function} fn          The mapper function.
 * @param  {Object}   thisContext The context for the mapper.
 * @return {Array}                The array containing the results.
 */
module.exports = function fastMap (subject, fn, thisContext) {
  var length = subject.length,
      result = new Array(length),
      iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
      i;
  for (i = 0; i < length; i++) {
    result[i] = iterator(subject[i], i, subject);
  }
  return result;
};

},{"../function/bindInternal3":25}],23:[function(require,module,exports){
'use strict';

var bindInternal3 = require('../function/bindInternal3');

/**
 * # Some
 *
 * A fast `.some()` implementation.
 *
 * @param  {Array}    subject     The array (or array-like) to iterate over.
 * @param  {Function} fn          The visitor function.
 * @param  {Object}   thisContext The context for the visitor.
 * @return {Boolean}              true if at least one item in the array passes the truth test.
 */
module.exports = function fastSome (subject, fn, thisContext) {
  var length = subject.length,
      iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
      i;
  for (i = 0; i < length; i++) {
    if (iterator(subject[i], i, subject)) {
      return true;
    }
  }
  return false;
};

},{"../function/bindInternal3":25}],24:[function(require,module,exports){
'use strict';

var forEachArray = require('./array/forEach'),
    forEachObject = require('./object/forEach');

/**
 * # ForEach
 *
 * A fast `.forEach()` implementation.
 *
 * @param  {Array|Object} subject     The array or object to iterate over.
 * @param  {Function}     fn          The visitor function.
 * @param  {Object}       thisContext The context for the visitor.
 */
module.exports = function fastForEach (subject, fn, thisContext) {
  if (subject instanceof Array) {
    return forEachArray(subject, fn, thisContext);
  }
  else {
    return forEachObject(subject, fn, thisContext);
  }
};
},{"./array/forEach":20,"./object/forEach":28}],25:[function(require,module,exports){
'use strict';

/**
 * Internal helper to bind a function known to have 3 arguments
 * to a given context.
 */
module.exports = function bindInternal3 (func, thisContext) {
  return function (a, b, c) {
    return func.call(thisContext, a, b, c);
  };
};

},{}],26:[function(require,module,exports){
'use strict';

var mapArray = require('./array/map'),
    mapObject = require('./object/map');

/**
 * # Map
 *
 * A fast `.map()` implementation.
 *
 * @param  {Array|Object} subject     The array or object to map over.
 * @param  {Function}     fn          The mapper function.
 * @param  {Object}       thisContext The context for the mapper.
 * @return {Array|Object}             The array or object containing the results.
 */
module.exports = function fastMap (subject, fn, thisContext) {
  if (subject instanceof Array) {
    return mapArray(subject, fn, thisContext);
  }
  else {
    return mapObject(subject, fn, thisContext);
  }
};
},{"./array/map":22,"./object/map":30}],27:[function(require,module,exports){
'use strict';

/**
 * Analogue of Object.assign().
 * Copies properties from one or more source objects to
 * a target object. Existing keys on the target object will be overwritten.
 *
 * > Note: This differs from spec in some important ways:
 * > 1. Will throw if passed non-objects, including `undefined` or `null` values.
 * > 2. Does not support the curious Exception handling behavior, exceptions are thrown immediately.
 * > For more details, see:
 * > https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 *
 *
 *
 * @param  {Object} target      The target object to copy properties to.
 * @param  {Object} source, ... The source(s) to copy properties from.
 * @return {Object}             The updated target object.
 */
module.exports = function fastAssign (target) {
  var totalArgs = arguments.length,
      source, i, totalKeys, keys, key, j;

  for (i = 1; i < totalArgs; i++) {
    source = arguments[i];
    keys = Object.keys(source);
    totalKeys = keys.length;
    for (j = 0; j < totalKeys; j++) {
      key = keys[j];
      target[key] = source[key];
    }
  }
  return target;
};

},{}],28:[function(require,module,exports){
'use strict';

var bindInternal3 = require('../function/bindInternal3');

/**
 * # For Each
 *
 * A fast object `.forEach()` implementation.
 *
 * @param  {Object}   subject     The object to iterate over.
 * @param  {Function} fn          The visitor function.
 * @param  {Object}   thisContext The context for the visitor.
 */
module.exports = function fastForEachObject (subject, fn, thisContext) {
  var keys = Object.keys(subject),
      length = keys.length,
      iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
      key, i;
  for (i = 0; i < length; i++) {
    key = keys[i];
    iterator(subject[key], key, subject);
  }
};

},{"../function/bindInternal3":25}],29:[function(require,module,exports){
'use strict';

/**
 * Object.keys() shim for ES3 environments.
 *
 * @param  {Object} obj The object to get keys for.
 * @return {Array}      The array of keys.
 */
module.exports = typeof Object.keys === "function" ? Object.keys : /* istanbul ignore next */ function fastKeys (obj) {
  var keys = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      keys.push(key);
    }
  }
  return keys;
};
},{}],30:[function(require,module,exports){
'use strict';

var bindInternal3 = require('../function/bindInternal3');

/**
 * # Map
 *
 * A fast object `.map()` implementation.
 *
 * @param  {Object}   subject     The object to map over.
 * @param  {Function} fn          The mapper function.
 * @param  {Object}   thisContext The context for the mapper.
 * @return {Object}               The new object containing the results.
 */
module.exports = function fastMapObject (subject, fn, thisContext) {
  var keys = Object.keys(subject),
      length = keys.length,
      result = {},
      iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
      i, key;
  for (i = 0; i < length; i++) {
    key = keys[i];
    result[key] = iterator(subject[key], key, subject);
  }
  return result;
};

},{"../function/bindInternal3":25}],31:[function(require,module,exports){
(function () {
  var gju = this.gju = {};

  // Export the geojson object for **CommonJS**
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = gju;
  }

  // adapted from http://www.kevlindev.com/gui/math/intersection/Intersection.js
  gju.lineStringsIntersect = function (l1, l2) {
    var intersects = [];
    for (var i = 0; i <= l1.coordinates.length - 2; ++i) {
      for (var j = 0; j <= l2.coordinates.length - 2; ++j) {
        var a1 = {
          x: l1.coordinates[i][1],
          y: l1.coordinates[i][0]
        },
          a2 = {
            x: l1.coordinates[i + 1][1],
            y: l1.coordinates[i + 1][0]
          },
          b1 = {
            x: l2.coordinates[j][1],
            y: l2.coordinates[j][0]
          },
          b2 = {
            x: l2.coordinates[j + 1][1],
            y: l2.coordinates[j + 1][0]
          },
          ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x),
          ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x),
          u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
        if (u_b != 0) {
          var ua = ua_t / u_b,
            ub = ub_t / u_b;
          if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
            intersects.push({
              'type': 'Point',
              'coordinates': [a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y)]
            });
          }
        }
      }
    }
    if (intersects.length == 0) intersects = false;
    return intersects;
  }

  // Bounding Box

  function boundingBoxAroundPolyCoords (coords) {
    var xAll = [], yAll = []

    for (var i = 0; i < coords[0].length; i++) {
      xAll.push(coords[0][i][1])
      yAll.push(coords[0][i][0])
    }

    xAll = xAll.sort(function (a,b) { return a - b })
    yAll = yAll.sort(function (a,b) { return a - b })

    return [ [xAll[0], yAll[0]], [xAll[xAll.length - 1], yAll[yAll.length - 1]] ]
  }

  gju.pointInBoundingBox = function (point, bounds) {
    return !(point.coordinates[1] < bounds[0][0] || point.coordinates[1] > bounds[1][0] || point.coordinates[0] < bounds[0][1] || point.coordinates[0] > bounds[1][1]) 
  }

  // Point in Polygon
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html#Listing the Vertices

  function pnpoly (x,y,coords) {
    var vert = [ [0,0] ]

    for (var i = 0; i < coords.length; i++) {
      for (var j = 0; j < coords[i].length; j++) {
        vert.push(coords[i][j])
      }
	  vert.push(coords[i][0])
      vert.push([0,0])
    }

    var inside = false
    for (var i = 0, j = vert.length - 1; i < vert.length; j = i++) {
      if (((vert[i][0] > y) != (vert[j][0] > y)) && (x < (vert[j][1] - vert[i][1]) * (y - vert[i][0]) / (vert[j][0] - vert[i][0]) + vert[i][1])) inside = !inside
    }

    return inside
  }

  gju.pointInPolygon = function (p, poly) {
    var coords = (poly.type == "Polygon") ? [ poly.coordinates ] : poly.coordinates

    var insideBox = false
    for (var i = 0; i < coords.length; i++) {
      if (gju.pointInBoundingBox(p, boundingBoxAroundPolyCoords(coords[i]))) insideBox = true
    }
    if (!insideBox) return false

    var insidePoly = false
    for (var i = 0; i < coords.length; i++) {
      if (pnpoly(p.coordinates[1], p.coordinates[0], coords[i])) insidePoly = true
    }

    return insidePoly
  }

  // support multi (but not donut) polygons
  gju.pointInMultiPolygon = function (p, poly) {
    var coords_array = (poly.type == "MultiPolygon") ? [ poly.coordinates ] : poly.coordinates

    var insideBox = false
    var insidePoly = false
    for (var i = 0; i < coords_array.length; i++){
      var coords = coords_array[i];
      for (var j = 0; j < coords.length; j++) {
        if (!insideBox){
          if (gju.pointInBoundingBox(p, boundingBoxAroundPolyCoords(coords[j]))) {
            insideBox = true
          }
        }
      }
      if (!insideBox) return false
      for (var j = 0; j < coords.length; j++) {
        if (!insidePoly){
          if (pnpoly(p.coordinates[1], p.coordinates[0], coords[j])) {
            insidePoly = true
          }
        }
      }
    }

    return insidePoly
  }

  gju.numberToRadius = function (number) {
    return number * Math.PI / 180;
  }

  gju.numberToDegree = function (number) {
    return number * 180 / Math.PI;
  }

  // written with help from @tautologe
  gju.drawCircle = function (radiusInMeters, centerPoint, steps) {
    var center = [centerPoint.coordinates[1], centerPoint.coordinates[0]],
      dist = (radiusInMeters / 1000) / 6371,
      // convert meters to radiant
      radCenter = [gju.numberToRadius(center[0]), gju.numberToRadius(center[1])],
      steps = steps || 15,
      // 15 sided circle
      poly = [[center[0], center[1]]];
    for (var i = 0; i < steps; i++) {
      var brng = 2 * Math.PI * i / steps;
      var lat = Math.asin(Math.sin(radCenter[0]) * Math.cos(dist)
              + Math.cos(radCenter[0]) * Math.sin(dist) * Math.cos(brng));
      var lng = radCenter[1] + Math.atan2(Math.sin(brng) * Math.sin(dist) * Math.cos(radCenter[0]),
                                          Math.cos(dist) - Math.sin(radCenter[0]) * Math.sin(lat));
      poly[i] = [];
      poly[i][1] = gju.numberToDegree(lat);
      poly[i][0] = gju.numberToDegree(lng);
    }
    return {
      "type": "Polygon",
      "coordinates": [poly]
    };
  }

  // assumes rectangle starts at lower left point
  gju.rectangleCentroid = function (rectangle) {
    var bbox = rectangle.coordinates[0];
    var xmin = bbox[0][0],
      ymin = bbox[0][1],
      xmax = bbox[2][0],
      ymax = bbox[2][1];
    var xwidth = xmax - xmin;
    var ywidth = ymax - ymin;
    return {
      'type': 'Point',
      'coordinates': [xmin + xwidth / 2, ymin + ywidth / 2]
    };
  }

  // from http://www.movable-type.co.uk/scripts/latlong.html
  gju.pointDistance = function (pt1, pt2) {
    var lon1 = pt1.coordinates[0],
      lat1 = pt1.coordinates[1],
      lon2 = pt2.coordinates[0],
      lat2 = pt2.coordinates[1],
      dLat = gju.numberToRadius(lat2 - lat1),
      dLon = gju.numberToRadius(lon2 - lon1),
      a = Math.pow(Math.sin(dLat / 2), 2) + Math.cos(gju.numberToRadius(lat1))
        * Math.cos(gju.numberToRadius(lat2)) * Math.pow(Math.sin(dLon / 2), 2),
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (6371 * c) * 1000; // returns meters
  },

  // checks if geometry lies entirely within a circle
  // works with Point, LineString, Polygon
  gju.geometryWithinRadius = function (geometry, center, radius) {
    if (geometry.type == 'Point') {
      return gju.pointDistance(geometry, center) <= radius;
    } else if (geometry.type == 'LineString' || geometry.type == 'Polygon') {
      var point = {};
      var coordinates;
      if (geometry.type == 'Polygon') {
        // it's enough to check the exterior ring of the Polygon
        coordinates = geometry.coordinates[0];
      } else {
        coordinates = geometry.coordinates;
      }
      for (var i in coordinates) {
        point.coordinates = coordinates[i];
        if (gju.pointDistance(point, center) > radius) {
          return false;
        }
      }
    }
    return true;
  }

  // adapted from http://paulbourke.net/geometry/polyarea/javascript.txt
  gju.area = function (polygon) {
    var area = 0;
    // TODO: polygon holes at coordinates[1]
    var points = polygon.coordinates[0];
    var j = points.length - 1;
    var p1, p2;

    for (var i = 0; i < points.length; j = i++) {
      var p1 = {
        x: points[i][1],
        y: points[i][0]
      };
      var p2 = {
        x: points[j][1],
        y: points[j][0]
      };
      area += p1.x * p2.y;
      area -= p1.y * p2.x;
    }

    area /= 2;
    return area;
  },

  // adapted from http://paulbourke.net/geometry/polyarea/javascript.txt
  gju.centroid = function (polygon) {
    var f, x = 0,
      y = 0;
    // TODO: polygon holes at coordinates[1]
    var points = polygon.coordinates[0];
    var j = points.length - 1;
    var p1, p2;

    for (var i = 0; i < points.length; j = i++) {
      var p1 = {
        x: points[i][1],
        y: points[i][0]
      };
      var p2 = {
        x: points[j][1],
        y: points[j][0]
      };
      f = p1.x * p2.y - p2.x * p1.y;
      x += (p1.x + p2.x) * f;
      y += (p1.y + p2.y) * f;
    }

    f = gju.area(polygon) * 6;
    return {
      'type': 'Point',
      'coordinates': [y / f, x / f]
    };
  },

  gju.simplify = function (source, kink) { /* source[] array of geojson points */
    /* kink	in metres, kinks above this depth kept  */
    /* kink depth is the height of the triangle abc where a-b and b-c are two consecutive line segments */
    kink = kink || 20;
    source = source.map(function (o) {
      return {
        lng: o.coordinates[0],
        lat: o.coordinates[1]
      }
    });

    var n_source, n_stack, n_dest, start, end, i, sig;
    var dev_sqr, max_dev_sqr, band_sqr;
    var x12, y12, d12, x13, y13, d13, x23, y23, d23;
    var F = (Math.PI / 180.0) * 0.5;
    var index = new Array(); /* aray of indexes of source points to include in the reduced line */
    var sig_start = new Array(); /* indices of start & end of working section */
    var sig_end = new Array();

    /* check for simple cases */

    if (source.length < 3) return (source); /* one or two points */

    /* more complex case. initialize stack */

    n_source = source.length;
    band_sqr = kink * 360.0 / (2.0 * Math.PI * 6378137.0); /* Now in degrees */
    band_sqr *= band_sqr;
    n_dest = 0;
    sig_start[0] = 0;
    sig_end[0] = n_source - 1;
    n_stack = 1;

    /* while the stack is not empty  ... */
    while (n_stack > 0) {

      /* ... pop the top-most entries off the stacks */

      start = sig_start[n_stack - 1];
      end = sig_end[n_stack - 1];
      n_stack--;

      if ((end - start) > 1) { /* any intermediate points ? */

        /* ... yes, so find most deviant intermediate point to
        either side of line joining start & end points */

        x12 = (source[end].lng() - source[start].lng());
        y12 = (source[end].lat() - source[start].lat());
        if (Math.abs(x12) > 180.0) x12 = 360.0 - Math.abs(x12);
        x12 *= Math.cos(F * (source[end].lat() + source[start].lat())); /* use avg lat to reduce lng */
        d12 = (x12 * x12) + (y12 * y12);

        for (i = start + 1, sig = start, max_dev_sqr = -1.0; i < end; i++) {

          x13 = source[i].lng() - source[start].lng();
          y13 = source[i].lat() - source[start].lat();
          if (Math.abs(x13) > 180.0) x13 = 360.0 - Math.abs(x13);
          x13 *= Math.cos(F * (source[i].lat() + source[start].lat()));
          d13 = (x13 * x13) + (y13 * y13);

          x23 = source[i].lng() - source[end].lng();
          y23 = source[i].lat() - source[end].lat();
          if (Math.abs(x23) > 180.0) x23 = 360.0 - Math.abs(x23);
          x23 *= Math.cos(F * (source[i].lat() + source[end].lat()));
          d23 = (x23 * x23) + (y23 * y23);

          if (d13 >= (d12 + d23)) dev_sqr = d23;
          else if (d23 >= (d12 + d13)) dev_sqr = d13;
          else dev_sqr = (x13 * y12 - y13 * x12) * (x13 * y12 - y13 * x12) / d12; // solve triangle
          if (dev_sqr > max_dev_sqr) {
            sig = i;
            max_dev_sqr = dev_sqr;
          }
        }

        if (max_dev_sqr < band_sqr) { /* is there a sig. intermediate point ? */
          /* ... no, so transfer current start point */
          index[n_dest] = start;
          n_dest++;
        } else { /* ... yes, so push two sub-sections on stack for further processing */
          n_stack++;
          sig_start[n_stack - 1] = sig;
          sig_end[n_stack - 1] = end;
          n_stack++;
          sig_start[n_stack - 1] = start;
          sig_end[n_stack - 1] = sig;
        }
      } else { /* ... no intermediate points, so transfer current start point */
        index[n_dest] = start;
        n_dest++;
      }
    }

    /* transfer last point */
    index[n_dest] = n_source - 1;
    n_dest++;

    /* make return array */
    var r = new Array();
    for (var i = 0; i < n_dest; i++)
      r.push(source[index[i]]);

    return r.map(function (o) {
      return {
        type: "Point",
        coordinates: [o.lng, o.lat]
      }
    });
  }

  // http://www.movable-type.co.uk/scripts/latlong.html#destPoint
  gju.destinationPoint = function (pt, brng, dist) {
    dist = dist/6371;  // convert dist to angular distance in radians
    brng = gju.numberToRadius(brng);

    var lon1 = gju.numberToRadius(pt.coordinates[0]);
    var lat1 = gju.numberToRadius(pt.coordinates[1]);

    var lat2 = Math.asin( Math.sin(lat1)*Math.cos(dist) +
                          Math.cos(lat1)*Math.sin(dist)*Math.cos(brng) );
    var lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(dist)*Math.cos(lat1),
                                 Math.cos(dist)-Math.sin(lat1)*Math.sin(lat2));
    lon2 = (lon2+3*Math.PI) % (2*Math.PI) - Math.PI;  // normalise to -180..+180º

    return {
      'type': 'Point',
      'coordinates': [gju.numberToDegree(lon2), gju.numberToDegree(lat2)]
    };
  };

})();

},{}],32:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

"use strict";

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function(obj) {
  var ret = {};
  var key;
  if (!(obj instanceof Object && !Array.isArray(obj))) {
    throw new Error('keyMirror(...): Argument must be an object.');
  }
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;

},{}],33:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if ("production" !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

},{}]},{},[16])(16)
});