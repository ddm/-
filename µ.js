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
    .before(/Element/, function() { console.log("CAN I HAZ AOP PLZ?") })
    .after(
      function() { return true },
      function() { console.log("How many getters does window have?", µ(window).match(/get/).length) }
    )
  .getElementsByTagName('head')
).match(/./)
*/
function µ(decorated) {
  return _.extend(Object.create(decorated), {
    match: function(selector) {
      var self = this;
      var methods = _.difference(_.functions(self), _.functions(µ(null)));
      return methods.filter(function(method) {
        return _.isString(selector) ? method === selector
          : _.isRegExp(selector) ? selector.test(method)
          : _.isFunction(selector) ? selector(method)
          : false;
      });
    },
    before: function(selector, decorator) {
      var self = this;
      var selected = self.match(selector);
      _.each(selected, function(method) {
        var original = self[method];
        self[method] = function() {
          var new_arguments = decorator.apply(self, arguments);
          return original.apply(self, new_arguments || arguments);
        };
      });
      return self;
    },
    after: function(selector, decorator) {
      var self = this;
      var selected = self.match(selector);
      _.each(selected, function(method) {
        var original = self[method];
        self[method] = function() {
          var original_result = original.apply(self, arguments);
          return decorator.apply(self, [ original_result ]) || original_result;
        };
      });
      return self;
    },
    insteadOf: function(selector, decorator) {
      var self = this;
      var selected = self.match(selector);
      _.each(selected, function(method) {
        self[method] = function() {
          return decorator.apply(self, arguments);
        };
      });
      return self;
    }
  });
}
/* vim: set ts=2 sw=2 noai et : */
