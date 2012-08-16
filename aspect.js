// pointcut: join point selector (name or regexp)
// aspect: function to be executed before or after the join points
var Interceptable = {

  match: function(pointcut) {
    var self = this;
    return _.reject(_.functions(self).filter(function(method) {
      if (_.isString(pointcut)) {
        return method === pointcut;
      } else if (_.isRegExp(pointcut)) {
        var matches = method.match(pointcut);
        return matches && matches.length > 0;
      } else {
        throw "Illegal pointcut: " + pointcut;
      }
    }), function(method) {
      // No point in instrumenting the instruments?
      return method === "before" || method === "after";
    });
  },

  // before allows an aspect to execute before the pointcut
  // the aspect receives the arguments
  // can modify the arguments
  // is responsible for returning the arguments
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

  // after allows an aspect to execute after the pointcut
  // the aspect receives the result of the pointcut
  // can modify the result
  // is responsible for returning the result
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
  }

};

var bird = _.extend(Interceptable, {
  fly: function(distance) {
    console.log("flew", distance);
    return distance;
  }
});

function enhance(bird) {
  bird.before('fly', function(distance) {
    console.log("sung");
    return [ distance + " away"];
  });
  bird.after(/f.y/, function(distance) {
    console.log("landed", distance);
    return distance;
  });
  bird.after('before', function() {
    console.log("should never happen");
  });
}
