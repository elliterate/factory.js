Factory = (function() {
  var self = {};

  var factories, sequences;

  var initialize = function() {
    factories = {};
    sequences = {};
  };

  self.define = function(name) {
    var factory = {
      options: {},
      count: 0
    };

    if (arguments.length == 2) {
      factory.callback = arguments[1];
    } else {
      factory.options = arguments[1];
      factory.callback = arguments[2];
    }

    factories[name] = factory;
  };

  self.create = function(name, options) {
    var builder,
      instance,
      factory = factories[name];

    factory.count += 1;

    builder = {
      sequence: function(callback) {
        return callback ? callback(factory.count) : factory.count;
      }
    };

    instance = factory.callback.call(builder);

    if (factory.options.parent) {
      instance = self.create(factory.options.parent, instance);
    }

    return _(instance).extend(options);
  };

  self.sequence = function(name, sequence) {
    sequences[name] = {
      count: 0,
      callback: sequence
    };
  };

  self.next = function(name) {
    var sequence = sequences[name];

    sequence.count += 1;

    return sequence.callback ? sequence.callback(sequence.count) : sequence.count;
  };

  self.reset = function() {
    initialize();
  };

  initialize();

  return self;
}());
