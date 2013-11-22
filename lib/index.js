var Router = require("./router");

module.exports = {

  /**
   */

  router: function () {
    return new Router();
  },

  /**
   */

  listeners: require("./listeners")
};