// pointcut: method name
// aspect: function to be executed before, after or around a pointcut
var Interceptable = {

  // before allows an aspect to execute before the pointcut
  // the aspect receives the arguments
  // can modify the arguments
  // is responsible for returning the arguments
  before: function(pointcut, aspect) {
    var self = this;
    var join_point = pointcut;
    var original = this[join_point];
    this[join_point] = function() {
      var new_arguments = aspect.apply(self, arguments);
      return original.apply(self, new_arguments);
    };
  },

  // after allows an aspect to execute after the pointcut
  // the aspect receives the result of the pointcut
  // can modify the result
  // is responsible for returning the result
  after: function(pointcut, aspect) {
    var self = this;
    var join_point = pointcut;
    var original = this[join_point];
    this[join_point] = function() {
      var original_result = original.apply(self, arguments);
      return aspect.apply(self, [ original_result ]);
    };
  }

};

var bird = Object.create(Interceptable);
bird.fly = function(distance) {
  console.log('flew', distance);
  return distance;
};

function enhance(bird) {
  bird.before('fly', function(distance) {
    console.log('sung');
    return [ distance + " away"];
  });
  bird.after('fly', function(distance) {
    console.log('landed', distance);
    return distance;
  });
}
