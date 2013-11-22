var Router = require("./router"),
listeners  = require("./listeners");

module.exports = function(app) {
  var router = new Router();
  router.use(listeners.http);
  app.router = router;
  router.application = app;
  router.bind("current.request.query").to(app, "models.query");
  router.bind("current.states").to(app, "models.states");
};


module.exports.router = function () {
  return new Router();
};

module.exports.listeners = listeners;