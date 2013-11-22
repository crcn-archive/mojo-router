var protoclass = require("protoclass"),
EventEmitter   = require("events").EventEmitter,
flatstack      = require("flatstack");


function Route (options) {

  this._enter = [];
  this._exit  = [];

  this.path    = options.path;
  this.loaders = options.loaders;
  this.router  = options.router;
}

protoclass(EventEmitter, Route, {

  /**
   */

  test: function (path) {
    return String(path) === this.name || this.path.test(path);
  },

  /**
   */

  enter: function (options, next) {
    var q = flatstack(), self = this;

    q.push(function (next) {
      self._loadParams(options, next);
    });

    q.push(function (next) {
      self._loadQuery(options, next);
    });

    this._each(q, this._enter, options, next);
  },

  /**
   */

  exit: function (options, next) {
    this._each(flatstack(), this._exit, options, next);
  },

  /**
   */

  _each: function(queue, collection, options, next) {
    collection.forEach(function (fn) {
      queue.push(function (next) {
        if(fn.length < 2) {
          fn(options);
          next();
        } else {
          fn(options, next);
        }
      }); 
    });

    queue.push(function () {
      next();
    });
  },

  /**
   */

  _loadParams: function (options, next) {
    this._loadData(options.params, flatstack(), this.loaders.param, options, next);
  },

  /**
   */

  _loadQuery: function (options, next) {
    this._loadData(options.query, flatstack(), this.loaders.query, options, next);
  },

  /**
   */

  _loadData: function (data, queue, loaders, options, next) {

    function loadKey(key, value) {
      var loader;

      if(!(loader = loaders[key])) {
        return;
      }

      queue.push(function (next) {
        loader(options, function(err, newValue) {
          data[key] = newValue;
          next();
        }, value);
      });
    }

    for (var key in data) {
      loadKey(key, data[key]);
    }


    queue.push(function() {
      next();
    });
  }
});

module.exports = Route;