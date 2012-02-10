Factory = (function() {
  var module = {};

  var factories, sequences;

  var initialize = function() {
    factories = {};
    sequences = {};
  };

  module.define = function(name) {
    var factory = {
      options: {},
      builder: {},
      count: 0
    };

    if (arguments.length == 2) {
      factory.callback = arguments[1];
    } else {
      factory.options = arguments[1];
      factory.callback = arguments[2];
    }

    factory.builder.sequence = function(callback) {
      return callback(factory.count);
    };

    factories[name] = factory;
  };

  module.create = function(name, options) {
    var instance,
      factory = factories[name];

    factory.count += 1;

    instance = factory.callback.call(factory.builder);

    if (factory.options.parent) {
      instance = module.create(factory.options.parent, instance);
    }

    return _(instance).extend(options);
  };

  module.sequence = function(name, sequence) {
    sequences[name] = {
      count: 0,
      callback: sequence
    };
  };

  module.next = function(name) {
    var sequence = sequences[name];

    sequence.count += 1;

    return sequence.callback(sequence.count);
  };

  module.reset = function() {
    initialize();
  };

  initialize();

  return module;
}());
