var protoclass = require("protoclass"),
bindable       = require("bindable"),
flatstack      = require("flatstack");


function Route (options) {

  Route.parent.call(this, this);

  this._enter = [];
  this._exit  = [];

  this.path    = options.path;
  this.loaders = options.loaders;
  this.router  = options.router;
}

protoclass(bindable.Object, Route, {

  /**
   */

  test: function (path) {
    return String(path) === this.name || this.path.test(path);
  },

  /**
   */

  enter: function (request, next) {
    var q = flatstack(), self = this;

    q.push(function (next) {
      self._loadParams(request, next);
    });

    q.push(function (next) {
      self._loadQuery(request, next);
    });

    this._each(q, this._enter, request, next);

    q.push(function() {

      self.set({
        request: request
      })
      next();
    });
  },

  /**
   */

  exit: function (request, next) {
    this._each(flatstack(), this._exit, request, next);
  },

  /**
   */

  _each: function(queue, collection, request, next) {
    collection.forEach(function (fn) {
      queue.push(function (next) {
        if(fn.length < 2) {
          fn(request);
          next();
        } else {
          fn(request, next);
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