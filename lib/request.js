var protoclass = require("protoclass"),
bindable       = require("bindable"),
_ = require("underscore"),
qs = require("querystring");


function Request (data) {
  Request.parent.call(this, this);
  this.set(data);
  this._params = _.extend({},data.params);
}


protoclass(bindable.Object, Request, {
  getUrl: function () {


    var path = this._stringifyPath();

    var q = qs.stringify(this.query);

    if(q.length) {
      path += "?" + q;
    }

    return path;
  },
  toString: function () {
    return this.getUrl();
  },
  _stringifyPath: function () {
    var path = this.path.getUrl(true), self = this;
    return ("/" + path.split("/").map(function (part) {
      if(part.substr(0, 1) !== ":") return part;
      return self._params[part.substr(1)];
    }).join("/")).replace(/\/+/, "/");
  }
});

module.exports = Request;