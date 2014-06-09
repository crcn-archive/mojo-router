module.exports = function (app) {

  app.views.decorator({
      priority: "load",
      getOptions: function (view) {
        return view.route;
      },
      decorate: function (view, route) {
        var binding = view.bind("models.states." + route, { to: function (v) {
          view.set("currentName", v);
        }}).now();
        view.once("dispose", binding.dispose);
      }
  });

}
