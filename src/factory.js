Factory = (function() {
  var Factory, factories, sequences;

  function initialize() {
    factories = {};
    sequences = {};
  }

  Factory = function(options, callback) {
    var self = {},
      builder = {},
      count = 0;

    options = options || {};

    builder.sequence = function(callback) {
      return callback ? callback(count) : count;
    };

    function hasParent() {
      return !!options.parent;
    }

    function getParent() {
      return factories[options.parent];
    }

    self.create = function(overrides) {
      var instance;

      count += 1;

      instance = callback.call(builder);

      if (hasParent()) {
        instance = getParent().create(instance);
      }

      return _(instance).extend(overrides);
    };

    return self;
  };

  Factory.define = function(name) {
    var callback,
      options = {};

    if (arguments.length == 2) {
      callback = arguments[1];
    } else {
      options = arguments[1];
      callback = arguments[2];
    }

    factories[name] = new Factory(options, callback);
  };

  Factory.create = function(name, overrides) {
    var factory = factories[name];

    return factory.create(overrides);
  };

  Factory.sequence = function(name, sequence) {
    sequences[name] = {
      count: 0,
      callback: sequence
    };
  };

  Factory.next = function(name) {
    var sequence = sequences[name];

    sequence.count += 1;

    return sequence.callback ? sequence.callback(sequence.count) : sequence.count;
  };

  Factory.reset = function() {
    initialize();
  };

  initialize();

  return Factory;
}());
