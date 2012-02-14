Factory = (function() {
  var Factory, Sequence, factories, sequences;

  function initialize() {
    factories = {};
    sequences = {};
  }

  Sequence = function(callback) {
    var self = {},
      count = 0;

    self.next = function() {
      count += 1;

      return callback ? callback(count) : count;
    };

    return self;
  };

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

  Factory.sequence = function(name, callback) {
    sequences[name] = new Sequence(callback);
  };

  Factory.next = function(name) {
    var sequence = sequences[name];

    return sequence.next();
  };

  Factory.reset = function() {
    initialize();
  };

  initialize();

  return Factory;
}());
