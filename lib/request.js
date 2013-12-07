var protoclass = require("protoclass"),
bindable       = require("bindable"),
urlgrey        = require("urlgrey");


function Request (data) {
  Request.parent.call(this, this);
  this.set(data);
}


protoclass(bindable.Object, Request, {
  toString: function () {
    return urlgrey(this._stringifyPath()).query(this.query).extendedPath();
  },
  _stringifyPath: function () {
    var path = this.path.toString(true), self = this;
    return path.split("/").map(function (part) {
      if(path.substr(0, 1) !== ":") return path;
      return self.params[part.substr(1)];
    }).join("/");
  }
});

module.exports = Request;