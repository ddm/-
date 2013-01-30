function µ(decorated) {
  var undefined = (function(undefined) { return undefined })();

  return _.extend(Object.create(decorated === undefined ? null : decorated), {
    match: function match(selector) {
      var self = this
      var methods = _.difference(_.functions(self), _.functions(µ(null)))
      var selected =
        _.isString(selector) ? function(method) { return selector === method }
        : _.isRegExp(selector) ? function(method) { return selector.test(method) }
        : _.isFunction(selector) ? selector
        : false
      return methods.filter(selected).filter(function(method) {
        return self[method].apply
      })
    },
    before: function before(selector, decorator) {
      var self = this
      var selected = !_.isFunction(decorator) ? [] : self.match(selector)
      _.each(selected, function(method) {
        var original = self[method]
        self[method] = function() {
          var new_arguments = decorator.apply(self, arguments)
          return original.apply(self, new_arguments || arguments)
        }
      })
      return self
    },
    after: function after(selector, decorator) {
      var self = this
      var selected = !_.isFunction(decorator) ? [] : self.match(selector)
      _.each(selected, function(method) {
        var original = self[method]
        self[method] = function() {
          var original_result = original.apply(self, arguments)
          return decorator.apply(self, [ original_result ]) || original_result
        }
      })
      return self
    },
    insteadOf: function insteadOf(selector, decorator) {
      var self = this
      var selected = !_.isFunction(decorator) ? [] : self.match(selector)
      _.each(selected, function(method) {
        self[method] = function() {
          return decorator.apply(self, arguments)
        }
      })
      return self
    }
  })
}
