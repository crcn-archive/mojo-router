var protoclass = require("protoclass"),
bindable       = require("bindable"),
urlgrey        = require("urlgrey");


function Request (data) {
  Request.parent.call(this, this);
  this.set(data);
}


protoclass(bindable.Object, Request, {
  toString: function () {
    return urlgrey(this.path).query(this.query).extendedPath();
  }
});

module.exports = Request;