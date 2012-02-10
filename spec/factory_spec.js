describe("Factory", function() {
  describe(".define", function() {
    it("should define a factory that can be created with .create", function() {
      Factory.define("person", function() {
        return {
          name: "John",
          age: 25
        };
      });

      var person = Factory.create("person");

      expect(person).toEqual({name: "John", age: 25});
    });

    it("should inherit defaults from a parent factory", function() {
      Factory.define("shape", function() {
        return {
          sides: 4,
          color: "green"
        };
      });

      Factory.define("triangle", {parent: "shape"}, function() {
        return {
          sides: 3
        }
      });

      var triangle = Factory.create("triangle");

      expect(triangle.sides).toEqual(3);
      expect(triangle.color).toEqual("green");
    });

    describe("this.sequence", function() {
      it("should define a local sequence that will iterate with each .create", function() {
        Factory.define("user", function() {
          return {
            email: this.sequence(function(n) {
              return "user+" + n + "@example.com";
            })
          };
        });

        Factory.define("admin", function() {
          return {
            email: this.sequence(function(n) {
              return "admin+" + n + "@example.com";
            })
          };
        });

        expect(Factory.create("user").email).toEqual("user+1@example.com");
        expect(Factory.create("user").email).toEqual("user+2@example.com");
        expect(Factory.create("user").email).toEqual("user+3@example.com");

        expect(Factory.create("admin").email).toEqual("admin+1@example.com");
        expect(Factory.create("admin").email).toEqual("admin+2@example.com");

        expect(Factory.create("user").email).toEqual("user+4@example.com");
        expect(Factory.create("user").email).toEqual("user+5@example.com");

        expect(Factory.create("admin").email).toEqual("admin+3@example.com");
      });
    });
  });

  describe(".create", function() {
    beforeEach(function() {
      Factory.define("person", function() {
        return {
          name: "John",
          age: 25
        }
      });
    });

    it("should override the defaults with the given options", function() {
      var person = Factory.create("person", {name: "Bob"});

      expect(person.name).toEqual("Bob");
      expect(person.age).toEqual(25);
    });
  });

  describe(".sequence", function() {
    it("should define a sequence that can be iterated with .next", function() {
      Factory.sequence("email", function(n) {
        return "test+" + n + "@example.com";
      });

      expect(Factory.next("email")).toEqual("test+1@example.com");
      expect(Factory.next("email")).toEqual("test+2@example.com");
      expect(Factory.next("email")).toEqual("test+3@example.com");
    });
  });

  describe(".next", function() {
    beforeEach(function() {
      Factory.sequence("foo", function(n) {
        return n;
      });

      Factory.sequence("bar", function(n) {
        return n;
      });
    });

    it("should increment sequences separately", function() {
      expect(Factory.next("foo")).toEqual(1);
      expect(Factory.next("foo")).toEqual(2);
      expect(Factory.next("foo")).toEqual(3);

      expect(Factory.next("bar")).toEqual(1);
      expect(Factory.next("bar")).toEqual(2);

      expect(Factory.next("foo")).toEqual(4);
      expect(Factory.next("foo")).toEqual(5);

      expect(Factory.next("bar")).toEqual(3);
    });
  });
});
