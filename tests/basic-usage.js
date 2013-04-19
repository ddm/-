describe('Basic usage', function () {
  var original = {
    add: function (x, y) {
      return x + y;
    }
  };

  describe('Add behavior before a method with #before()', function () {

    it('Check arguments', function () {
      var modified = µ(original);
      modified.before('add', function (x, y) {
        expect(x).to.be(1);
        expect(y).to.be(2);
      });
      var result = modified.add(1, 2);
      expect(result).to.be(3);
    });

    it('Modify arguments', function () {
      var modified = µ(original);
      modified.before('add', function (x, y) {
        return [ 2*x, 2*y ]
      });
      var doubled = modified.add(1, 2);
      expect(doubled).to.be(6);
    });

  });

  describe('Add behavior after a method with #after()', function () {

    it('Check result', function () {
      var modified = µ(original);
      modified.after('add', function (result) {
        expect(result).to.be(3);
      });
      modified.add(1, 2);
    });

    it('Modify result', function () {
      var modified = µ(original);
      modified.after('add', function (result) {
        return result+".00";
      });
      var formatted = modified.add(1, 2);
      expect(formatted).to.be("3.00");
    });

  });

  describe('Replace a method with #insteadOf()', function () {

    it('Stub result', function () {
      var modified = µ(original);
      modified.insteadOf('add', function (result) {
        return 0;
      });
      var alwaysZero = modified.add(1, 2);
      expect(alwaysZero).to.be(0);
    });

  });

  describe('Chain modifications for complex scenarios', function () {

    it('Check arguments and format result', function () {
      var modified = µ(original);
      modified
          .before('add', function (x, y) {
            expect(x%2).to.be(0);
            expect(y%2).to.be(0);
          })
          .after('add', function (result) {
            return result + " is even";
          });
      var mustBeEven = modified.add(2, 4);
      expect(mustBeEven).to.be("6 is even");
    });

  });

});
