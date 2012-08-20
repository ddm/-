/* Copyright (c) 2012 Dimitri del Marmol (MIT license)
µ({
  doSomething: function() {
    console.log("ok")
  }
}).before(/do./, function() {
  console.log("ready?")
}).doSomething()
µ(
  µ(document)
    .before(/Element/, function() { console.log("interception!") })
    .after(/./, function() { console.log("How many getters does window have?", µ(window).match(/get/).length) })
  .getElementsByTagName('head')
).match(/./)
*/
function µ(target) {
// pointcut: join point selector function, regex or string (exact match)
// aspect: function executed before, after or instead of matched join points
  return _.extend(Object.create(target), {
    match: function(pointcut) {
      var self = this;
      var methods = _.difference(_.functions(self), _.functions(µ(null)));
      return methods.filter(function(method) {
        return _.isString(pointcut) ? method === pointcut
          : _.isRegExp(pointcut) ? pointcut.test(method)
          : _.isFunction(pointcut) ? pointcut(method)
          : false;
      });
    },
    // before: executes before the selected join points
    // ...is called with the same arguments as the join points
    // ...can modify the arguments before the join points executes
    before: function(pointcut, aspect) {
      var self = this;
      var join_points = self.match(pointcut);
      _.each(join_points, function(join_point) {
        var original = self[join_point];
        self[join_point] = function() {
          var new_arguments = aspect.apply(self, arguments);
          return original.apply(self, new_arguments || arguments);
        };
      });
      return self;
    },
    // after: executes after the selected join points
    // ...is called with the result of the join points
    // ...can modify the result of the join points
    after: function(pointcut, aspect) {
      var self = this;
      var join_points = self.match(pointcut);
      _.each(join_points, function(join_point) {
        var original = self[join_point];
        self[join_point] = function() {
          var original_result = original.apply(self, arguments);
          return aspect.apply(self, [ original_result ]) || original_result;
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
/* vim: set ts=2 sw=2 noai et : */
