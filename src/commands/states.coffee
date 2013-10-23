module.exports = (message, next) ->
  models = message.mediator.router.models

  for stateName of message.options
    models.set "states.#{stateName}", message.options[stateName]

  next()