// Copyright (c) 2012 Dimitri del Marmol (MIT license)
function µ(decorated) {
  return _.isFunction(decorated) ? decorated : _.extend(Object.create(decorated), {
    match: function(selector) {
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
    before: function(selector, decorator) {
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
    after: function(selector, decorator) {
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
    insteadOf: function(selector, decorator) {
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
/* vim: set ts=2 sw=2 noai et : */
