/* Copyright (c) 2012 Dimitri del Marmol (MIT license)
µ({
  doSomething: function() {
    console.log("ok")
  }
}).before(/do./, function() {
  console.log("ready?")
}).doSomething()
*/function Mutable(e){return _.extend(Object.create(e),{match:function(e){var t=this,n=_.difference(_.functions(t),_.functions(Mutable(null)));return n.filter(function(t){if(_.isString(e))return t===e;if(_.isRegExp(e))return e.test(t);if(_.isFunction(e))return e(t);throw"Illegal pointcut: "+e})},before:function(e,t){var n=this,r=n.match(e);return _.each(r,function(e){var r=n[e];n[e]=function(){var e=t.apply(n,arguments);return r.apply(n,e)}}),n},after:function(e,t){var n=this,r=n.match(e);return _.each(r,function(e){var r=n[e];n[e]=function(){var e=r.apply(n,arguments);return t.apply(n,[e])}}),n},insteadOf:function(e,t){var n=this,r=n.match(e);return _.each(r,function(e){n[e]=function(){return t.apply(n,arguments)}}),n}})}var µ=Mutable;
