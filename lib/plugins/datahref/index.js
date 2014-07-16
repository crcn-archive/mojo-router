var pc = require("paperclip"),
noselector = require("noselector")

module.exports = pc.BaseNodeBinding.extend({
  type: "attr",
  bind: function (context) {

    pc.BaseNodeBinding.prototype.bind.apply(this, arguments);

    var $node = this.$node = noselector(this.node);
    var href = $node.attr("data-href");

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
        params[param] = arg.get("cid") || arg.get("_id");
      });
      
      loc = (process.browser ? "#!" : "") + (pathname = route.getPathnameWithParams(params))

      if (self.node.nodeName === "A") {
        $node.attr("href", loc);
      }

    }).now();

    $node.bind("click", this._onClick = function (event) {

      if (event.metaKey || event.ctrlKey) {
        return;
      }

      event.preventDefault();

      context.application.router.redirect(pathname);
    });
  },

  unbind: function () {
    var ret = pc.BaseNodeBinding.prototype.unbind.apply(this, arguments);
    if (this._binding) this._binding.dispose();
    if (this.$node) this.$node.unbind("click", this._onClick);
    return ret;
  }
});
