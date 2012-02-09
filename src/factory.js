Factory = (function() {
  var module = {};

  var factories, sequences;

  var initialize = function() {
    factories = {};
    sequences = {};
  };

  module.define = function(name) {
    var callback,
      options = {};

    if (arguments.length == 2) {
      callback = arguments[1];
    } else {
      options = arguments[1];
      callback = arguments[2];
    }

    factories[name] = {
      options: options,
      callback: callback
    };
  };

  module.create = function(name, options) {
    var instance,
      factory = factories[name];

    instance = factory.callback();

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
