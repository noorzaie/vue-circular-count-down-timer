(function(e){function t(t){for(var i,s,o=t[0],a=t[1],c=t[2],p=0,d=[];p<o.length;p++)s=o[p],Object.prototype.hasOwnProperty.call(l,s)&&l[s]&&d.push(l[s][0]),l[s]=0;for(i in a)Object.prototype.hasOwnProperty.call(a,i)&&(e[i]=a[i]);u&&u(t);while(d.length)d.shift()();return n.push.apply(n,c||[]),r()}function r(){for(var e,t=0;t<n.length;t++){for(var r=n[t],i=!0,o=1;o<r.length;o++){var a=r[o];0!==l[a]&&(i=!1)}i&&(n.splice(t--,1),e=s(s.s=r[0]))}return e}var i={},l={app:0},n=[];function s(t){if(i[t])return i[t].exports;var r=i[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,s),r.l=!0,r.exports}s.m=e,s.c=i,s.d=function(e,t,r){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(s.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)s.d(r,i,function(t){return e[t]}.bind(null,i));return r},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/vue-circular-count-down-timer/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],a=o.push.bind(o);o.push=t,o=o.slice();for(var c=0;c<o.length;c++)t(o[c]);var u=a;n.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("56d7")},"034f":function(e,t,r){"use strict";r("85ec")},"56d7":function(e,t,r){"use strict";r.r(t);r("e260"),r("e6cf"),r("cca6"),r("a79d");var i=r("2b0e"),l=r("8f48"),n=r.n(l),s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"app"}},[e._m(0),e._l(e.examples,(function(t){return r("div",{key:t.title,staticClass:"example__container"},[r("h1",[e._v(e._s(t.title))]),r("circular-count-down-timer",{attrs:{circles:t.circles,interval:t.interval,"main-circle-id":t.mainCircleId||"1",size:t.size,"container-classes":t.containerClasses,"circle-classes":t.circleClasses,"stop-conditions":t.stopConditions,"trigger-update":t.triggerUpdate,"stroke-width":t.strokeWidth,"stroke-color":t.strokeColor,"underneath-stroke-color":t.underneathStrokeColor,"fill-color":t.fillColor,"value-font-size":t.valueFontSize,"label-font-size":t.labelFontSize,"label-position":t.labelPosition}})],1)}))],2)},o=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("h1",[e._v(" Vue circular count down "),r("a",{attrs:{href:"https://github.com/noorzaie/vue-circular-count-down-timer/tree/examples",target:"_blank"}},[e._v("examples")])])}],a={name:"app",data:function(){return{examples:[{title:"Simple",circles:[{id:"1",steps:10,size:200,label:"label"}]},{title:"Full configuration",containerClasses:[],circleClasses:[],interval:1e3,mainCircleId:"1",stopConditions:{},triggerUpdate:!1,circles:[{id:"1",classList:["item"],startValue:-2,value:1,size:200,strokeWidth:20,strokeColor:"#db47a0",underneathStrokeColor:"orange",fillColor:"#fff0a0",valueFontSize:30,labelFontSize:30,steps:10,stepLength:1,label:"label",labelPosition:"bottom"}]},{title:"Dependent circles",circles:[{id:"3",steps:24,size:200,label:"hours"},{id:"2",steps:60,size:200,label:"minutes",dependentCircles:["3"]},{id:"1",steps:60,size:200,value:50,label:"seconds",dependentCircles:["2"]}]},{title:"Stop conditions (stops at 01:05)",stopConditions:{1:5,2:1},mainCircleId:"1",circles:[{id:"2",steps:60,size:200,label:"minutes"},{id:"1",steps:60,size:200,value:55,label:"seconds",dependentCircles:["2"]}]},{title:"Decremental counter",circles:[{id:"2",steps:60,size:200,value:20,stepLength:-1,label:"minutes"},{id:"1",steps:60,size:200,value:30,stepLength:-1,label:"seconds",dependentCircles:["2"]}]},{title:"Circles arrangement",containerClasses:["circle__container--1"],circles:[{id:"1",steps:10,size:200,label:"circle 1"},{id:"2",steps:10,size:200,label:"circle 2"},{id:"3",steps:10,size:200,label:"circle 3"},{id:"4",steps:10,size:200,label:"circle 4"}]},{title:"Shared circle props",interval:400,size:150,strokeWidth:15,strokeColor:"blue",underneathStrokeColor:"green",fillColor:"cyan",valueFontSize:40,labelFontSize:30,labelPosition:"bottom",circles:[{id:"3",steps:24,size:200,label:"hours"},{id:"2",steps:60,size:200,label:"minutes",dependentCircles:["3"]},{id:"1",steps:60,size:200,value:50,label:"seconds",dependentCircles:["2"]}]}]}}},c=a,u=(r("034f"),r("2877")),p=Object(u["a"])(c,s,o,!1,null,null,null),d=p.exports;i["a"].config.productionTip=!1,i["a"].use(n.a),new i["a"]({render:function(e){return e(d)}}).$mount("#app")},"85ec":function(e,t,r){}});
//# sourceMappingURL=app.2547284e.js.map