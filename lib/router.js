var protoclass = require("protoclass"),
RouteBuilder   = require("./routeBuilder"),
RoutePath      = require("./routePath"),
type           = require("type-component"),
flatstack      = require("flatstack"),
comerr         = require("comerr"),
bindable       = require("bindable"),
Url            = require("url");


function Router () {

  Router.parent.call(this, this);

  this._routes = [];
  this._queue  = flatstack();
  this.loaders = {
    param: {},
    query: {}
  }
}

protoclass(bindable.Object, Router, {

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

  use: function (plugin) {
    plugin(this);
    return this;
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

    var request = new bindable.Object(), self = this;
    request.context(request);
    request.set(request);
    request.set("path", urlParts.pathname);
    request.set("query", options.query || urlParts.query);

    this._queue.push(function() {
      self._redirect(new RoutePath(request.path), request, next);
    });
  },

  /**
   */

  _redirect: function (path, request, next) {

    var route = this._findRoute(path), self = this;

    if(this.current) {
      if(route == this.current) return next(new Error("cannot redirect to same route"));
      this._queue.push(function (next) {
        self.current.exit(request, next);
      });
    }

    if (!route) {
      return next(comerr.notFound("path '" + path + "' not found"));
    }

    request.set("params", route.path.params(path));
    this.set("current", route);

    this._queue.push(function (next) {
      route.enter(request, next);
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