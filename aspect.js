/* vim: set ts=2 sw=2 noai et: */
// pointcut: join point selector pattern (regex) or name (string)
// aspect: function to be executed before or after the join points
// example:
/*
var myTarget = new Interceptable({
  doSomething: function() {
    console.log("ok");
  }
});
myTarget.before(/do./, function() {
  console.log("ready?")
});
myTarget.doSomething();
*/
function Interceptable(target) {

  return _.extend(target, {

    match: function(pointcut) {
      var self = this;
      var methods = _.difference(_.functions(self), _.functions(new Interceptable({})));
      return methods.filter(function(method) {
        if (_.isString(pointcut)) {
          return method === pointcut;
        } else if (_.isRegExp(pointcut)) {
          var matches = method.match(pointcut);
          return matches && matches.length > 0;
        } else {
          throw "Illegal pointcut: " + pointcut;
        }
      });
    },

    // before: aspect executes before the selected join points
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
    },

    // after: aspect to executes after the selected join points
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
    },

    // instead: aspect executes instead of the selected join points
    instead: function(pointcut, aspect) {
      var self = this;
      var join_points = self.match(pointcut);
      _.each(join_points, function(join_point) {
        self[join_point] = function() {
          return aspect.apply(self, arguments);
        };
      });
    }
  });

}
