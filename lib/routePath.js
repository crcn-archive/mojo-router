var protoclass = require("protoclass"),
crema          = require("crema");

function RoutePath (path) {
  this._path   = crema(path)[0].path;
  this.segments = this._path.segments;
  this._params = this._path.segments.filter(function (segment) {
    return segment.param;
  }).map(function (segment) {
    return segment.name;
  });
}

protoclass(RoutePath, {

  /**
   */

  toString: function (maintainPathName) {
    return this._path.segments.map(function (part) {
      return part.param ? ":" + (maintainPathName ? part.value : "param")  : part.value;
    }).join("/");
  },

  /**
   */

  test: function (rp) {
    if (rp.segments.length !== this.segments.length) return false;
    for(var i = this.segments.length; i--;) {
      var tseg = this.segments[i];
      if(tseg.value !== rp.segments[i].value && !tseg.param) {
        return false;
      }
    }
    return true;
  },

  /**
   */

  params: function (rp) {
    var params = {};
    if(this.segments.length != rp.segments.length) return params;
    for (var i = this.segments.length; i--;) {
      var tseg = this.segments[i];
      if(tseg.param) {
        params[tseg.value] = rp.segments[i].value;
      }
    }
    return params;
  }

});


module.exports = RoutePath;