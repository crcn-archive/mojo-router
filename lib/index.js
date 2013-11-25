var Router = require("./router");

module.exports = function (app) {
	var router = new Router();
    app.router = router;
    router.application = app;
    router.bind("current.request.query").to(app, "models.query");
    router.bind("current.states").to(app, "models.states");
    router.use(module.exports.listeners.http);
}

module.exports.router = function () {
    return new Router();
}

module.exports.listeners = require("./listeners")