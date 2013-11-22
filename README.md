HTTP Router for Mojo.js

### Installation

```javascript
var mojo     = require("mojojs"),
mojoRouter   = require("mojo-router"),
router       = mojoRouter.router();


// add a parameter that's loaded whenever
// it's defined in a route
router.param("user", function (id, next) {
  // load user
  // next(null, someUser);
});

// define a route
router. 
  route("/users/:user").
  enter(auth).
  states({
    app: "home",
    main: "app"
  });

// wait for the router to change, then do 
router.on("redirect", function (options) {
  console.log(optons.route);        // users/:user
  console.log(options.path);        // users/someUserId
  console.log(options.states);      // { app: "home", main: "app" }
  console.log(options.params.user); // user object
}); 

// listen to http changes
router.use(mojoRouter.listeners.http);

//install as a mojo plugin
mojo.use(router.plugin);
```


## View Structure

```javascript
var HomeView = mojo.View.extend({
  paper: require("./home.pc")
});

var AppView = mojo.View.extend({
  paper: require("./app.pc")
  sections: {
    app: {
      type: "states",
      views: [
        { viewClass: HomeView, name: "home" }
      ]
    }
  }
});
var MainView = mojo.View.extend({
  sections: { 
    main: {
      type: "states",
      views: [
        { viewClass: AppView, name: "app" },
        { viewClass: LoginView, name: "login" }
      ]
    }
  }
});
```

## API

### router mojoRouter.router()

creates a new router

### router.param(param, load)

Load the param if it's used in a path. 

```javascript
router.param("user", function (id, next) {
  loadUser({ _id: id }, next);
});

router.route("/users/:user");

router.redirect("/users/userId", function (err, options) {
  console.log(options.params.user); // user obj
});
```

### router.current

returns the current route

### router.query(name, load)

similar to `router.param(...)`, except for the query parameter

### router.on(event, listener)

creates a new listener for the following events:

- `redirect` - emitted on redirect

### router.use(plugin)

uses a router plugin

### route router.route(path)

creates a new route

### route.enter(fn)

called when the route is entered.

```javascript
router.
  route("/home").
  enter(function (options) {
    console.log(options.params);  // {}
    console.log(options.query);   // {}
  });
```

### route.exit(fn)

Similar to enter, but called when the route leaves its state



