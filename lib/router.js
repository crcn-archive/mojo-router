var protoclass = require("protoclass"),
RouteBuilder   = require("./routeBuilder"),
RoutePath      = require("./routePath"),
type           = require("type-component"),
flatstack      = require("flatstack"),
comerr         = require("comerr"),
bindable       = require("bindable"),
Url            = require("url"),
Request        = require("./request"),
outcome        = require("outcome");

flatstack.enforceAsync = false;


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

  redirect: function (pathStr, options, next) {

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

    var urlParts = Url.parse(pathStr, true),
    path = new RoutePath(urlParts.pathname);


    var route = this._findRoute(path), self = this, q = flatstack();

    if (!route) {
      return next(comerr.notFound("path '" + path + "' not found"));
    }


    var request = new Request({
      path: route.path,
      query: options.query || urlParts.query,
      route: route,
      params: options.params || route.path.params(path)
    }), self = this;


    this._queue.push(function() {
      self._redirect(request, function () {
        next();
      });
    });
  },

  /**
   */

  _redirect: function (request, next) {


    var self = this, q = flatstack();

    var o = outcome.e(next);

    if(this.current) {
      // if(route == this.current) return next(new Error("cannot redirect to same route"));
      q.push(function (next) {
        self.current.exit(request, next);
      });
    }


    q.push(function (next) {
      request.route.enter(request, o.s(function () {
        self.setProperties({
          location: request,
          current: request.route
        });
        next();
      }));
    });

    q.push(function () {
      self.emit("redirect", request);
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