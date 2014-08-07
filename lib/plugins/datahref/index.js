var pc = require("paperclip"),
noselector = require("noselector"),
janitor    = require("janitorjs"),
bindable   = require("bindable"),
flatten    = require("flat").flatten;

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


    var params = new bindable.Object();

    route.params.forEach(function (param, i) {
      self._bindings.add(self.context.bind(param, { to: function (_id) {
        params.set(param, _id);
      }}).now());

    });

    function setHref () {

      loc = (process.browser ? "#!" : "") + (pathname = route.getPathnameWithParams(flatten(params.context())));

      while (/:[^\/]+/.test(loc)) {
        var paramName = loc.match(/:([^\/]+)/)[1];
        loc = loc.replace(":" + paramName, context.get("application.location.params." + paramName));
      }

      if (self.node.nodeName === "A") {
        $node.attr("href", loc);
      }
    }

    setHref();
    params.on("change", setHref);
      



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
