;(function (global, undefined) {

  var _ = global._;

  if (!_ && typeof require !== 'undefined') {
    _ = require('underscore');
  }

  function µ (o) {
    var toExtend = !_.isFunction(o) ? Object.create(o === undefined ? null : o) : o;
    var µtated = _.defaults(toExtend, {
      match: function match (selector) {
        var methods = _.difference(_.functions(µtated), _.functions(µ()));
        var selected = _.isString(selector) ? function (method) { return selector === method; }
                     : _.isRegExp(selector) ? function (method) { return selector.test(method); }
                     : _.isFunction(selector) ? selector
                     : false;
        return methods.filter(selected).filter(function (method) {
          return µtated[method].apply;
        });
      },
      intercept: function intercept (selector, interceptor) {
        var selected = !_.isFunction(interceptor) ? [] : µtated.match(selector);
        _.each(selected, function (method) {
          var original = µtated[method];
          µtated[method] = function intercepted () {
            var args = arguments;
            interceptor(intercepted, original, args, o);
          };
        });
        return µtated;
      },
      before: function before (selector, decorator) {
        var selected = !_.isFunction(decorator) ? [] : µtated.match(selector);
        _.each(selected, function (method) {
          var original = µtated[method];
          µtated[method] = function () {
            var new_arguments = decorator.apply(µtated, arguments);
            return original.apply(µtated, new_arguments || arguments);
          };
        });
        return µtated;
      },
      after: function after (selector, decorator) {
        var selected = !_.isFunction(decorator) ? [] : µtated.match(selector);
        _.each(selected, function (method) {
          var original = µtated[method];
          µtated[method] = function () {
            var original_result = original.apply(µtated, arguments);
            return decorator.apply(µtated, [ original_result ]) || original_result;
          };
        });
        return µtated;
      },
      insteadOf: function insteadOf (selector, decorator) {
        var selected = !_.isFunction(decorator) ? [] : µtated.match(selector);
        _.each(selected, function (method) {
          µtated[method] = function () {
            return decorator.apply(µtated, arguments);
          };
        });
        return µtated;
      }
    });
    return µtated;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = µ;
  } else {
    global.µ = µ;
  }

}(this));
