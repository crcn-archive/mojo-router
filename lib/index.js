var pc  = require("paperclip"),
crowbar = require("kubrik");

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
  app.mediator.on("pre bootstrap", function (message, next) {

    if (process.browser && message.data.useHistory !== false) {
      r.use(crowbar.listeners.http);
    }

    r.init();
    next();
  });

  return r;
};
