HTTP Router for Mojo.js

### Installation

```javascript
var mojo = require("mojojs"),
router   = require("mojo-router"),

//http routes
routes   = {
  "/": {
    states: {
      main: "app",
      app: "home"
    }
  },
  "/login": {
    states: {
      main: "auth",
      auth: "login"
    }
  }
}


//install as a mojo plugin
mojo.use(router({ routes: routes }));
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