var m          = require(".."),
expect         = require("expect.js");


describe("router#", function () {

  var router;

  /**
   */

  it("can create a new router", function () {
    router = m.router();
  });


  /**
   */

  it("can add a new route", function () {
    router.route("/hello/world").name("helloWorld");
    router.route("/hello/:world").name("helloWorld2");
  });

  /**
   */

  it("can redirect to many different routes", function () {
    router.redirect("/hello/world");
    expect(router.current.name).to.be("helloWorld");
    router.redirect("/hello/world2");
    expect(router.current.name).to.be("helloWorld2");
  });

  /**
   */

  it("can redirect by name", function () {
    var router = m.router();
    router.route("/hello/world").name("helloWorld");
    router.redirect("helloWorld");
    expect(router.current.name).to.be("helloWorld");
  });

  /**
   */

  it("can call one enter synchronously", function (next) {
    var router = m.router();

    router.
      route("/hello/world").
      name("helloWorld").
      enter(function (options) {

      });

    router.on("redirect", function () {
      expect(router.current.name).to.be("helloWorld");
      next();
    });

    router.redirect("/hello/world");
  });

  /**
   */

  it("can call on enter asynchronously", function (next) {
    var router = m.router();

    router.
      route("/hello/world").
      enter(function (options, next) {
        next();
      });

    router.on("redirect", function () {
      next();
    });

    router.redirect("/hello/world");
  });

  /**
   */

  it("can call enter multiple times", function (next) {

    var c = 0;
    var router = m.router();

    router.
      route("/hello/world").
      enter(function(){
        c++;
      }).
      enter(function() {
        c++;
      }).
      enter(function (options, next) {
        c++;
        next();
      });

    router.on("redirect", function () {
      expect(c).to.be(3);
      next();
    });

    router.redirect("/hello/world");
  });

  /**
   */

  it("can load parameters", function (next) {

    var router = m.router(),
    user1 = {},
    user2 = {};

    router.param("user1", function (options, next, id) {
      expect(options.path).to.be("/hello/user1/user2");
      user1._id = id;
      next(null, user1);
    });

    router.param("user2", function (options, next, id) {
      user2._id = id;
      next(null, user2);
    });

    router.
      route("/hello/:user1/:user2").
      name("helloUser12").
      enter(function (options) {
        expect(options.params.user1._id).to.be("user1");
        expect(options.params.user2._id).to.be("user2");
        next();
      });

    router.redirect("/hello/user1/user2");
  });

  /**
   */

  it("can load query params", function (next) {

    var router = m.router();

    var router = m.router(),
    user1 = {},
    user2 = {};

    router.query("user1", function (options, next, id) {
      expect(options.path).to.be("/hello");
      user1._id = id;
      next(null, user1);
    });

    router.query("user2", function (options, next, id) {
      user2._id = id;
      next(null, user2);
    });

    router.
      route("/hello").
      name("helloUser12").
      enter(function (options) {
        expect(options.query.user1._id).to.be("1");
        expect(options.query.user2._id).to.be("2");
        next();
      });

    router.redirect("/hello?user1=1&user2=2");
  });

  /**
   */

  it("can exit a route", function (next) {
    var router = m.router(), states = { enter: {}, exit: {} };


    router.
      route("/route1").
      enter(function () {
        states.enter.entered = true;
      }).
      exit(function() {
        states.enter.exited = true;
      })

    router.
      route("/route2").
      enter(function () {
        states.exit.entered = true;
      }).
      exit(function() {
        states.exit.exited = true;
      })


    router.redirect("/route1", function () {
      expect(states.enter.entered).to.be(true);
      expect(states.enter.exited).to.be(undefined);
    });
    router.redirect("/route2", function() {
      expect(states.enter.exited).to.be(true);
      expect(states.exit.entered).to.be(true);
      expect(states.exit.exited).to.be(undefined);
    });
    router.redirect("/route1", function () {
      expect(states.exit.exited).to.be(true);
      next();
    });
  });

  /**
   */

  it("can set the states of a given route", function () {
    var router = m.router();
    router.
      route("/auth")
  });

  /**


  // options check
  // exit async
  // exit multiple
  // set states
  // emit redirect
  */
});