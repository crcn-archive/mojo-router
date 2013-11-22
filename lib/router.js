var protoclass = require("protoclass"),
RouteBuilder   = require("./routeBuilder"),
RoutePath      = require("./routePath"),
type           = require("type-component"),
flatstack      = require("flatstack"),
comerr         = require("comerr"),
EventEmitter   = require("events").EventEmitter,
bindable       = require("bindable"),
Url            = require("url");


function Router () {
  this._routes = [];
  this._queue  = flatstack();
  this.loaders = {
    param: {},
    query: {}
  }
}

protoclass(EventEmitter, Router, {

  /**
   */

  route: function (path) {

    var routeBuilder = new RouteBuilder({
      path    : path,
      router  : this,
      loaders : this.loaders
    });

    this._routes.unshift(routeBuilder.route);
    return routeBuilder;
  },

  /**
   */

  param: function (name, load) {
    this.loaders.param[name] = load;
  },

  /**
   */

  query: function (name, load) {
    this.loaders.query[name] = load;
  },

  /**
   */

  redirect: function (path, options, next) {

    // redirect("/path", next);
    if (type(options) === "function") {
      next    = options;
      options = {};
    }

    // redirect({ path: "/path", query: {} })
    if(type(path) === "object") {
      options = path;
      path    = options.path;
    }

    if (type(next) !== "function")  {
      next = function () { };
    }

    if (!options) {
      options = {};
    }

    var urlParts = Url.parse(path, true);


    options.path   = urlParts.pathname;
    options.query  = options.query || urlParts.query;

    var ops = new bindable.Object(), self = this;
    ops.context(ops);
    ops.set(options);

    this._queue.push(function() {
      self._redirect(new RoutePath(options.path), ops, next);
    });
  },

  /**
   */

  _redirect: function (path, options, next) {

    var route, self = this;

    if(this.current) {
      this._queue.push(function (next) {
        self.current.exit(options, next);
      });
    }

    route = this._findRoute(path);

    if (!route) {
      return next(comerr.notFound("path '" + path + "' not found"));
    }

    options.set("params", route.path.params(path));

    this.current = route;

    this._queue.push(function (next) {
      route.enter(options, next);
    });

    this._queue.push(function () {
      self.emit("redirect", route);
      next();
    });
  },

  /**
   */

  _findRoute: function (rp) {

    var i, route, rp;

    for (i = this._routes.length; i--;) {
      route = this._routes[i];
      if(route.test(rp)) {
        return route;
      }
    }
  }
});

module.exports = Router;