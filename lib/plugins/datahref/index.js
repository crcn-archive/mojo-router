var pc = require("paperclip"),
noselector = require("noselector"),
janitor    = require("janitorjs"),
BindableObject   = require("bindable-object"),
_          = require("lodash");

module.exports = pc.BaseAttrBinding.extend({
  didChange: function (href) {
    this._href = href;
  },
  bind: function (context) {

    pc.BaseAttrBinding.prototype.bind.apply(this, arguments);

    var $node = this.$node = noselector(this.node),
    href      = this._href,
    self      = this,
    pathname  = "",
    loc       = "";


    $node.bind("click", self._onClick = function (event) {

      if (event.metaKey || event.ctrlKey) {
        return;
      }

      event.preventDefault();

      context.application.router.redirect(pathname);
    });


    this._locationBinding = context.bind("application.location", function (location) {

      if (!location) location = new BindableObject();
      if (self._bindings) self._bindings.dispose();

      var pparams = location.get("params"),
      params      = new BindableObject(_.extend({}, pparams ? pparams.toJSON() : {})),
      route       = context.get("application.router").routes.find({ pathname: href, params: params });

      function setHref () {

        loc = (process.browser ? "#!" : "") + (pathname = route.getPathname({params:params}));
        if (self.node.nodeName === "A") {
          $node.attr("href", loc);
        }
      }
      self._bindings = janitor();

      if (!route) return;

      route.params.forEach(function (param, i) {
        self._bindings.add(self.context.bind(param, { to: function (_id) {
          params.set(param, _id);
        }}).now());
      });


      setHref();
      params.on("change", setHref);
        
    }).now();
  },

  unbind: function () {
    var ret = pc.BaseNodeBinding.prototype.unbind.apply(this, arguments);
    if (this._bindings) this._bindings.dispose();
    if (this.$node) this.$node.unbind("click", this._onClick);
    if (this._locationBinding) this._locationBinding.dispose();
    return ret;
  }
});
