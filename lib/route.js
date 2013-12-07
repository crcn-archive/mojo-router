var protoclass = require("protoclass"),
bindable       = require("bindable"),
flatstack      = require("flatstack"),
async          = require("async"),
outcome        = require("outcome");



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

    var o = outcome.e(next);

    q.push(function (next) {
      self._loadParams(request, o.s(next));
    });

    q.push(function (next) {
      self._loadQuery(request, o.s(next));
    });

    q.push(function() {
      self._each(self._enter, request, function(err) {

        self.set({
          request: request
        });
        
        next(err);
      });
    });

  },

  /**
   */

  exit: function (request, next) {
    this._each(this._exit, request, next);
  },

  /**
   */

  _each: function(collection, request, next) {
    async.eachSeries(collection, function (fn, next) {
      if(fn.length < 2) {
        fn(request);
        next();
      } else {
        fn(request, next);
      }
    }, next);
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