/*
µ({
  doSomething: function() {
    console.log("ok")
  }
}).before(/do./, function() {
  console.log("ready?")
}).doSomething()
*/
function Mutable(target) {
// pointcut: join point selector function, regex or string (exact match)
// aspect: function executed before, after or instead of matched join points

  return _.extend(Object.create(target), {

    match: function(pointcut) {
      var self = this;
      var methods = _.difference(_.functions(self), _.functions(Mutable(null)));
      return methods.filter(function(method) {
        if (_.isString(pointcut)) {
          return method === pointcut;
        } else if (_.isRegExp(pointcut)) {
          return pointcut.test(method);
        } else if (_.isFunction(pointcut)) {
          return pointcut(method);
        } else {
          throw "Illegal pointcut: " + pointcut;
        }
      });
    },

    // before: executes before the selected join points
    // ...is called with the same arguments as the join points
    // ...can modify the arguments before the join points executes
    // ...is responsible for returning the original or modified arguments
    before: function(pointcut, aspect) {
      var self = this;
      var join_points = self.match(pointcut);
      _.each(join_points, function(join_point) {
        var original = self[join_point];
        self[join_point] = function() {
          var new_arguments = aspect.apply(self, arguments);
          return original.apply(self, new_arguments);
        };
      });
      return self;
    },

    // after: executes after the selected join points
    // ...is called with the result of the join points
    // ...can modify the result of the join points
    // ...is responsible for returning the original or modified result
    after: function(pointcut, aspect) {
      var self = this;
      var join_points = self.match(pointcut);
      _.each(join_points, function(join_point) {
        var original = self[join_point];
        self[join_point] = function() {
          var original_result = original.apply(self, arguments);
          return aspect.apply(self, [ original_result ]);
        };
      });
      return self;
    },

    // insteadOf: executes instead of the selected join points
    insteadOf: function(pointcut, aspect) {
      var self = this;
      var join_points = self.match(pointcut);
      _.each(join_points, function(join_point) {
        self[join_point] = function() {
          return aspect.apply(self, arguments);
        };
      });
      return self;
    }
  });

}
var µ = Mutable;
/* vim: set ts=2 sw=2 noai et : */
