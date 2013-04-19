describe('Advanced usage with #intercept()', function () {
  var original = {
    add: function (x, y) {
      return x + y;
    }
  };

  describe('Inspect caller function', function () {

    it('Verify caller name', function () {
      function main () {
        var modified = µ(original);
        modified.intercept('add', function interceptor (method) {
          expect(method.caller.name).to.be("main");
        });
        modified.add(1, 2);
      }

      main();
    });

  });

  describe('Inspect original method', function () {

    it('Validate original method source code', function () {
      var modified = µ(original);
      modified.intercept('add', function interceptor (method, original) {
        var source = original.toString();
        expect(/x \+ y/.test(source)).to.be(true);
      });
      modified.add(1, 2);
    });

  });

  describe('Perform complex verifications', function () {

    it('Kitchen sink', function checkEverything () {
      var adder = {
        name: "MyAdder",
        add: function (x, y) {
          return x + y;
        }
      };
      var modified = µ(adder);
      modified.intercept('add', function interceptor (method, original, args, object) {
        expect(method.caller.name).to.be("checkEverything");
        expect(original.length).to.be(2);
        expect(original.length).to.be(args.length);
        expect(object.add).to.be(original);
        expect(object.name).to.be("MyAdder");
        expect(object.name).to.be(modified.name);
      });
      modified.add(1, 2);
    });

  });

});
