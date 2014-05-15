var pc = require("paperclip"),
kubrik = require("kubrik");

module.exports = function (app) {
  pc.nodeBinding("data-href", require("./plugins/datahref"));
  app.use(require("./plugins/statesRouter"));
  app.use(kubrik);
};
