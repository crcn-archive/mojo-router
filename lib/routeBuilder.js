var protoclass = require("protoclass"),
Route          = require("./route"),
RoutePath      = require("./routePath"),
crema          = require("crema");

function RouteBuilder (options) {
  options.path = new RoutePath(options.path);
  this.route = new Route(options);
}


protoclass(RouteBuilder, {

  /**
   */

  name: function (name) {
    this.route.name = name;
    return this;
  },

  /**
   */

  enter: function () {
    this.route._enter = this.route._enter.concat(Array.prototype.slice.call(arguments, 0));
    return this;
  },

  /**
   */

  exit: function (fn) {
    this.route._exit = this.route._exit.concat(Array.prototype.slice.call(arguments, 0));
    return this;
  },

  /**
   */

  states: function (states) {
    this.route.states = states;
  },

  /**
   */

  on: function (event, listener) {
    this.route.on(event, listener);
    return this;
  },

  /**
   */

  _addListeners: function (collection, listeners) {
    listeners = Array.prototype.slice.call(arguments, 0).reverse();
    collecti
  }
});


module.exports = RouteBuilder;