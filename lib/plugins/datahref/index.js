var pc = require("paperclip"),
noselector = require("noselector"),
janitor    = require("janitorjs"),
bindable   = require("bindable");

module.exports = pc.BaseNodeBinding.extend({
  type: "attr",
  bind: function (context) {

    pc.BaseNodeBinding.prototype.bind.apply(this, arguments);

    var $node = this.$node = noselector(this.node);
    var href = $node.attr("data-href");

    var route = context.get("application.router").routes.find({ pathname: href });
    var loc = "";
    var pathname = "";

    this._bindings = janitor();

    if (!route) return;

    var self = this;

    this._bindings.add(this.context.bind(route.params.join(","), function () {
      var params = new bindable.Object(), args = arguments;

      route.params.forEach(function (param, i) {
        var arg;
        if (!(arg = args[i])) return;

        self._bindings.add(arg.bind("cid, _id", { to: function (v) {
          params.set(param, arg.get("cid") || arg.get("_id"))
        }}).now());

      });

      function setHref () {

        loc = (process.browser ? "#!" : "") + (pathname = route.getPathnameWithParams(params.context()))

        while (/:\w+/.test(loc)) {
          var paramName = loc.match(/:(\w+)/)[1];
          loc = loc.replace(":" + paramName, context.get("application.location.params." + paramName));
        }

        if (self.node.nodeName === "A") {
          $node.attr("href", loc);
        }
      }

      setHref();
      params.on("change", setHref);
      

    }).now());

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
    if (this._bindings) this._bindings.dispose();
    if (this.$node) this.$node.unbind("click", this._onClick);
    return ret;
  }
});
