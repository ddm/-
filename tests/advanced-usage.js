describe('Advanced usage', function () {
  var original = {
    add: function (x, y) {
      return x + y;
    }
  };

  describe('#intercept()', function () {

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

    it('Validate original method source code', function () {
      var modified = µ(original);
      modified.intercept('add', function interceptor (method, original) {
        var source = original.toString();
        expect(/x \+ y/.test(source)).to.be(true);
      });
      modified.add(1, 2);
    });

    it('Kitchen sink', function kitchenSink () {
      var adder = {
        name: "MyAdder",
        add: function (x, y) {
          return x + y;
        }
      };
      var modified = µ(adder);
      modified.intercept('add', function interceptor (method, original, args, object) {
        expect(method.caller.name).to.be("kitchenSink");
        expect(original.length).to.be(2);
        expect(original.length).to.be(args.length);
        expect(object.add).to.be(original);
        expect(object.name).to.be("MyAdder");
        expect(object.name).to.be(modified.name);
      });
      modified.add(1, 2);
    });

  });

  describe('Experiment with your favourite libraries', function () {

    it('Fun with jQuery', function () {
      var steps = [ "body", "div", "ul#mocha-report" ];
      var µ$ = µ($);
      µ$.before("find", function (selector) {
        expect(selector).to.be(steps[0]);
        steps = steps.slice(1);
      }).after("find", function (result) {
        expect(result.length).to.be(1);
      });
      µ$("body").find("div").find("ul#mocha-report");
      expect(steps.length).to.be(0);
    });

    it('Fun with underscore (object)', function () {
      var noop = function () {};
      var µ_ = µ(_([1]));
      µ_.before("each", function (iterator) {
        expect(iterator).to.be.a("function");
        expect(iterator).to.be(noop);
      });
      µ_.each(noop);
    });

    it('Fun with underscore (functions)', function () {
      var noop = function () {};
      var µ_ = µ(_);
      µ_.before("each", function (array, iterator) {
        expect(array).to.be.an("array");
        expect(array.length).to.be(1);
        expect(array[0]).to.be(1);
        expect(iterator).to.be.a("function");
        expect(iterator).to.be(noop);
      });
      µ_.each([ 1 ], noop);
      console.log(µ_.after.toString());
    });

  });

});
