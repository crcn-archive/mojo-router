var pc = require("paperclip"),
kubrik = require("kubrik");

module.exports = function (app) {

  app.use(require("mojo-mediator"));
  pc.nodeBinding("data-href", require("./plugins/datahref"));
  app.use(require("./plugins/statesRouter"));

  var r = app.router = new kubrik.Router({});

  if (process.browser) {
    r.use(kubrik.listeners.http);
  }

  r.bind("location.query"  , { target: app, to: "models.query" });
  r.bind("location.params" , { target: app, to: "models.params" });
  r.bind("location.states" , { target: app, to: "models.states" });

  app.mediator.on("post bootstrap", function (message, next) {
    r.init();
    next();
  });

  return r;
};
