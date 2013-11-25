var hasher = require("hasher");

module.exports = function (router) {

  function onHashChange (newHash) {

    // make sure any hash stuff isn't included
    router.redirect(String(newHash || "/").replace(/^#?!?/,""));
  }

  hasher.changed.add(onHashChange);
  hasher.initialized.add(onHashChange);
  setTimeout(hasher.init, 0);
}