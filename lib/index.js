var Router = require("./router"),
listeners  = require("./listeners");

module.exports = function (app) {
	var router = new Router();
    app.router = router;
    router.application = app;
    router.bind("current.request.query"  , { target: app, to: "models.query"   });
    router.bind("current.request.params" , { target: app, to: "models.params"  });
    router.bind("current.states"         , { target: app, to: "models.states"  });
    if(process.browser && !app.fake) router.use(module.exports.listeners.http);
}

module.exports.router = function () {
    return new Router();
}

module.exports.listeners = require("./listeners")
