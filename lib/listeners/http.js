var hasher = require("hasher");

module.exports = function (router) {

  function onHashChange (newHash) {

    // make sure any hash stuff isn't included
    router.redirect(newHash.match(/(\w.+)/)[1]);
  }

  hasher.changed.add(onHashChange);
  hasher.initialized.add(onHashChange);
  hasher.init();
}