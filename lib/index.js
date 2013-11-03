var protoclass = require("protoclass"),
mediocre       = require("mediocre"),
type           = require("type-component")
commands       = require("./commands");


/**
 * Constructor
 */

function Router () {
  this._mediator = mediocre();
  this._mediator.router = this;
  this.on(commands);
}

/**
 */

protoclass(Router, {

  /**
   */

  on: function (route, listener) {

    if (type(route) === "options") {
      var listeners = route;
      for (route in listeners) {
        this.on(route, listeners[route]);
      }
      return;
    }

    this._mediator.on(route, listener);
  }
});

/**
 */

module.exports = function (routes) {
  var router = new Router();
  router.on(routes || {});
  
  return function (mojo) {
    router.models = mojo.models;
  }
}