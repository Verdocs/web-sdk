import{p as h,q as l}from"./components-BUY51Sj4.js";var x=function(e,u,r){var o=e.get(u);o?o.includes(r)||o.push(r):e.set(u,[r])},C=function(e,u){var r;return function(){for(var o=[],i=0;i<arguments.length;i++)o[i]=arguments[i];r&&clearTimeout(r),r=setTimeout(function(){r=0,e.apply(void 0,o)},u)}},P=function(e){return!("isConnected"in e)||e.isConnected},m=C(function(e){for(var u=0,r=e.keys();u<r.length;u++){var o=r[u];e.set(o,e.get(o).filter(P))}},2e3),T=function(){if(typeof h!="function")return{};var e=new Map;return{dispose:function(){return e.clear()},get:function(u){var r=h();r&&x(e,u,r)},set:function(u){var r=e.get(u);r&&e.set(u,r.filter(l)),m(e)},reset:function(){e.forEach(function(u){return u.forEach(l)}),m(e)}}},v=function(e){return typeof e=="function"?e():e},j=function(e,u){u===void 0&&(u=function(t,n){return t!==n});var r=v(e),o=new Map(Object.entries(r??{})),i={dispose:[],get:[],set:[],reset:[]},p=function(){var t;o=new Map(Object.entries((t=v(e))!==null&&t!==void 0?t:{})),i.reset.forEach(function(n){return n()})},y=function(){i.dispose.forEach(function(t){return t()}),p()},g=function(t){return i.get.forEach(function(n){return n(t)}),o.get(t)},d=function(t,n){var a=o.get(t);u(n,a,t)&&(o.set(t,n),i.set.forEach(function(f){return f(t,n,a)}))},E=typeof Proxy>"u"?{}:new Proxy(r,{get:function(t,n){return g(n)},ownKeys:function(t){return Array.from(o.keys())},getOwnPropertyDescriptor:function(){return{enumerable:!0,configurable:!0}},has:function(t,n){return o.has(n)},set:function(t,n,a){return d(n,a),!0}}),s=function(t,n){return i[t].push(n),function(){k(i[t],n)}},b=function(t,n){var a=s("set",function(c,O){c===t&&n(O)}),f=s("reset",function(){return n(v(e)[t])});return function(){a(),f()}},w=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];var a=t.reduce(function(f,c){return c.set&&f.push(s("set",c.set)),c.get&&f.push(s("get",c.get)),c.reset&&f.push(s("reset",c.reset)),c.dispose&&f.push(s("dispose",c.dispose)),f},[]);return function(){return a.forEach(function(f){return f()})}},M=function(t){var n=o.get(t);i.set.forEach(function(a){return a(t,n,n)})};return{state:E,get:g,set:d,on:s,onChange:b,use:w,dispose:y,reset:p,forceUpdate:M}},k=function(e,u){var r=e.indexOf(u);r>=0&&(e[r]=e[e.length-1],e.length--)},R=function(e,u){var r=j(e,u);return r.use(T()),r};export{R as c};
