'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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