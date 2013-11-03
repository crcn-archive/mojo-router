module.exports = function (message, next) {
  var models = message.mediator.router.models;

  for (var stateName in message.options) {
    models.set("states." + stateName, message.options[stateName]);
  }

  next();
};


/*

module.exports = (message, next) ->
  models = message.mediator.router.models

  for stateName of message.options
    models.set "states.#{stateName}", message.options[stateName]

  next()
*/