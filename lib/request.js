var protoclass = require("protoclass"),
bindable       = require("bindable"),
urlgrey        = require("urlgrey"),
_ = require("underscore");


function Request (data) {
  Request.parent.call(this, this);
  this.set(data);
  this._params = _.extend({},data.params);
}


protoclass(bindable.Object, Request, {
  toString: function () {
    return urlgrey(this._stringifyPath()).query(this.query).extendedPath();
  },
  _stringifyPath: function () {
    var path = this.path.toString(true), self = this;
    return ("/" + path.split("/").map(function (part) {
      if(part.substr(0, 1) !== ":") return part;
      return self._params[part.substr(1)];
    }).join("/")).replace(/\/+/, "/");
  }
});

module.exports = Request;