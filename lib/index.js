var pc  = require("paperclip"),
crowbar = require("crowbar");

module.exports = function (app) {

  if (!app.mediator) app.use(require("mojo-mediator"));
  pc.nodeBinding("data-href", require("./plugins/datahref"));
  app.use(require("./plugins/statesRouter"));

  var r = app.router = crowbar({});

  r.bind("location.query"  , { target: app, to: "models.query" });
  r.bind("location.params" , { target: app, to: "models.params" });
  r.bind("location.states" , { target: app, to: "models.states" });

  // want to load on pre bootstrap to beat anything such as i18n loading, and
  // initializing views

  // UPDATE - want to make sure that check session is initialized before this (CC)
  app.mediator.on("post bootstrap", function (message, next) {

    if (process.browser && message.data.useHistory !== false) {
      r.use(crowbar.listeners.http);
    }

    r.init();

    if (!process.browser) return next();

    r.bind("location", { max: 1, to: function () {
      next();
    }}).now();
  });


  // express plugin
  r.middleware = function (options) {

    if (!options) options = {};
    if (!options.mainViewName) options.mainViewName = "main";

    var cachedViews = {};

    return function (req, res, next) {
      var request = r.request(req.url);
      request.enter(function (err) {

        if (err) {
          if (err.code == "404") return next();
          return next();
        }

        var viewName = request.route.options.view || options.mainViewName;

        var view = cachedViews[viewName] || (cachedViews[viewName] = app.views.create(viewName));

        view.setProperties({
          states: request.get("states"),
          location: request
        });

        app.set('location', request);

        res.send(view.render().toString());

      })
    }
  }

  return r;
};
