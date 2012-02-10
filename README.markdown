# factory.js

factory.js is a JavaScript module that allows you to create JavaScript objects from templates in a repeatable way.

## Requirements

* [Underscore.js](http://documentcloud.github.com/underscore/)

## Usage

### Factory.define(name, [options], callback)

Define a new factory with the given name and callback.

    Factory.define("student", function() {
      return {
        name: "John",
        age: 21
      };
    });

A factory may declare a parent factory from which properties should be inherited.

    Factory.define("freshman", {parent: "person"}, function() {
      return {
        age: 18
      };
    });

### Factory.create(name, [options])

Create a new object using the factory with the given name.

    var student = Factory.create("student");

    student.name; //=> "John"
    student.age;  //=> 21

You can pass an optional set of properties which will override the factory defaults.

    var bob = Factory.create("student", {name: "Bob"});

    bob.name; //=> "Bob"
    bob.age;  //=> 21

### Factory.sequence(name, [callback])

Define a sequence that may be iterated upon.

    Factory.sequence("email", function(n) {
      return "test+" + n + "@example.com";
    });

Sequences without a callback function will simply return the next integer in the sequence.

Sequences may also be scoped to a factory definition. These sequences will only be available within that factory. Every
object created by the factory will automatically include the next iteration in the sequence.

    Factory.define("user", function() {
      return {
        email: this.sequence(function(n) {
          return "test+" + n + "@example.com";
        }
      };
    });

    Factory.create("user").email; //=> "test+1@example.com"
    Factory.create("user").email; //=> "test+2@example.com"
    Factory.create("user").email; //=> "test+3@example.com"

### Factory.next(name)

Return the next iteration in the sequence.

    Factory.next("email"); //=> "test+1@example.com"
    Factory.next("email"); //=> "test+2@example.com"
    Factory.next("email"); //=> "test+3@example.com"

## License

factory.js is available under the MIT license.
