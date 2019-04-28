!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.mqttx=t():e.mqttx=t()}(this,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=4)}([function(e,t){e.exports=require("lodash")},function(e,t){e.exports=require("mqtt")},function(e,t,n){"use strict";(function(e){n.d(t,"a",function(){return l});var r=n(0),o=n(1),i=n.n(o),u=n(3);function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}function a(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}void 0!==e&&"node"===Object(r.get)(e,"release.name")&&(n(1),console.log("after requiring mqtt"));var l=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,n,r;return t=e,r=[{key:"connect",value:function(){this.mqtt=i.a,console.log("CALLING CONNECT"),this.client=i.a.connect.apply(i.a,arguments),this.subscription_manager=new u.a(this)}},{key:"on",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(e){console.log(e)},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=n.qos,o=void 0===r?1:r,i=s(n,["qos"]);console.log("calling on"),this.subscription_manager.subscribe(e,t),this.client.subscribe(e,t,function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){c(e,t,n[t])})}return e}({qos:o},i))}},{key:"subscribe",value:function(){var e;(e=this.subscription_manager).subscribe.apply(e,arguments)}}],(n=null)&&a(t.prototype,n),r&&a(t,r),e}()}).call(this,n(5))},function(e,t,n){"use strict";n.d(t,"a",function(){return a});var r=n(0);function o(e){return function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function c(e,t,n){return t&&u(e.prototype,t),n&&u(e,n),e}var s=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=t.perform,o=t.topic,u=t.is_one_time,c=void 0!==u&&u,s=t.observable,a=t.onBeforeDispose,l=void 0===a?[]:a;i(this,e),Object(r.assign)(this,{_perform:n,topic:o,is_one_time:c,observable:s,_onBeforeDisposeCallbacks:l})}return c(e,[{key:"matchesTopic",value:function(e){return t=e,n=this.topic,t===n;var t,n}},{key:"perform",value:function(e,t,n){var r;this.matchesTopic(e)&&this._perform(_topic,(r=t,JSON.parse(r.toString())),n,this)}},{key:"dispose",value:function(){Object(r.some)(this._onBeforeDisposeCallbacks)&&Object(r.invokeMap)(this._onBeforeDisposeCallbacks,"call"),this.observable&&this.observable.unsubscribe(this),this.observable=null,this.scope=null}}]),e}(),a=function(){function e(t){i(this,e),this.registry={},this.subscriptions=[],this.mqttx=t,console.log("initializing main sub"),this._initializeMainSubscription()}return c(e,[{key:"_initializeMainSubscription",value:function(){var e=this;this.mqttx.client.on("message",function(t,n,r){e.notifySubscriptions(t,n,r)})}},{key:"subscribe",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=n.is_one_time,o=void 0!==r&&r,i=n.onBeforeDispose,u=new s({perform:t,topic:e,is_one_time:o,observable:this,onBeforeDispose:i});this.subscriptions.push(u)}},{key:"unsubscribe",value:function(e){this.mqttx.client.unsubscribe(e.topic),this.subscriptions=this.subscriptions.filter(function(t){return t!==e})}},{key:"notifySubscriptions",value:function(e,t,n){var i=o(this.subscriptions);Object(r.invokeMap)(i,"perform",e,t,n)}}]),e}()},function(e,t,n){"use strict";n.r(t);var r=n(2);n.d(t,"MQTTX",function(){return r.a})},function(e,t){var n,r,o=e.exports={};function i(){throw new Error("setTimeout has not been defined")}function u(){throw new Error("clearTimeout has not been defined")}function c(e){if(n===setTimeout)return setTimeout(e,0);if((n===i||!n)&&setTimeout)return n=setTimeout,setTimeout(e,0);try{return n(e,0)}catch(t){try{return n.call(null,e,0)}catch(t){return n.call(this,e,0)}}}!function(){try{n="function"==typeof setTimeout?setTimeout:i}catch(e){n=i}try{r="function"==typeof clearTimeout?clearTimeout:u}catch(e){r=u}}();var s,a=[],l=!1,f=-1;function p(){l&&s&&(l=!1,s.length?a=s.concat(a):f=-1,a.length&&b())}function b(){if(!l){var e=c(p);l=!0;for(var t=a.length;t;){for(s=a,a=[];++f<t;)s&&s[f].run();f=-1,t=a.length}s=null,l=!1,function(e){if(r===clearTimeout)return clearTimeout(e);if((r===u||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(e);try{r(e)}catch(t){try{return r.call(null,e)}catch(t){return r.call(this,e)}}}(e)}}function h(e,t){this.fun=e,this.array=t}function v(){}o.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];a.push(new h(e,t)),1!==a.length||l||c(b)},h.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=v,o.addListener=v,o.once=v,o.off=v,o.removeListener=v,o.removeAllListeners=v,o.emit=v,o.prependListener=v,o.prependOnceListener=v,o.listeners=function(e){return[]},o.binding=function(e){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}}])});