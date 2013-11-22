var hasher = require("hasher");

module.exports = function (router) {

  function onHashChange (newHash) {
    
  }

  hasher.changed.add(onHashChange);
  hasher.initialized.add(onHashChange);
  hasher.init();
}