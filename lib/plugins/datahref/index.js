pc = require("paperclip")

module.exports = pc.BaseNodeBinding.extend({
  type: "attr",
  bind: function (context) {

    pc.BaseNodeBinding.prototype.bind.apply(this, arguments);

    var href = $(this.node).attr("data-href");

    var route = context.get("application.router").routes.find({ pathname: href });
    var loc = "";
    var pathname = "";

    if (!route) return;

    var self = this;

    this._binding = this.context.bind(route.params.join(","), function () {
      var params = {}, args = arguments;

      route.params.forEach(function (param, i) {
        var arg;
        if (!(arg = args[i])) return;
        params[param] = arg.get("_id");
      });

      loc = "#!" + (pathname = route.getPathnameWithParams(params))

      if (self.node.nodeName === "A") {
        $(self.node).attr("href", loc);
      }

    }).now()

    if (this.node.nodeName !== "A" || ! process.browser) {
      $(self.node).click(function () {
        if (process.browser) {
          window.location = loc;
        } else {
          context.application.router.redirect(pathname);
        }
      });
    }
  },

  unbind: function () {
    var ret = pc.BaseNodeBinding.prototype.unbind.apply(this, arguments);
    if (this._binding) this._binding.dispose();
    return ret;
  }
});
