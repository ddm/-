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
*/function Interceptable(e){return _.extend(Object.create(e),{match:function(e){var t=this,n=_.difference(_.functions(t),_.functions(new Interceptable({})));return n.filter(function(t){if(_.isString(e))return t===e;if(_.isRegExp(e)){var n=t.match(e);return n&&n.length>0}throw"Illegal pointcut: "+e})},before:function(e,t){var n=this,r=n.match(e);_.each(r,function(e){var r=n[e];n[e]=function(){var e=t.apply(n,arguments);return r.apply(n,e)}})},after:function(e,t){var n=this,r=n.match(e);_.each(r,function(e){var r=n[e];n[e]=function(){var e=r.apply(n,arguments);return t.apply(n,[e])}})},instead:function(e,t){var n=this,r=n.match(e);_.each(r,function(e){n[e]=function(){return t.apply(n,arguments)}})}})};
