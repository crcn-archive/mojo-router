mediocre = require "mediocre"
commands = require "./commands"
type     = require "type-component"

class Router

  ###
  ###

  constructor: () ->
    @_mediator = mediocre()
    @_mediator.router = @
    @on commands


  ###
  ###

  on: (nameOrRoutes, listener) ->

    if type(nameOrRoutes) is "object"
      for name of nameOrRoutes
        @on name, nameOrRoutes[name]
      return

    @_mediator.on nameOrRoutes, listener
    @

  ###
  ###

  redirect: () ->




module.exports = (routes = {}) ->

  router = new Router()
  router.on routes

  (mojo) ->
    router.models = mojo.models
    mojo.router = router
