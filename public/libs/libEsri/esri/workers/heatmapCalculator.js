//>>built
!function(g,v){function w(a){var f=a.data,k=f.action;a=f.msgId;k&&a&&("initialize"==k?(u=new g.HeatmapCalculator(f),postMessage({msgId:a})):"calculate"==k&&(f=u.calculateImageData(f),postMessage({msgId:a,imageData:f},f)))}if("function"==typeof define&&define.amd?define([],v):g.HeatmapCalculator=v(),g.importScripts&&"function"==typeof g.importScripts){var u;g.addEventListener("message",w,!1)}}(this,function(){function g(a){a=a||{};this.radius=a.blurRadius||10;this.maxVal=a.maxPixelIntensity;this.minVal=
a.minPixelIntensity;this.field=a.field;this.fieldOffset=a.fieldOffset;this.width=a.width;this.height=a.height;this.gradient=a.gradient;this.stats=null}function v(a,f){for(var k=Array(a),b=0;a>b;b++)for(var c=k[b]=Array(f),d=0;f>d;d++)c[d]=0;return k}function w(a,f){return a-f}var u=window.ArrayBuffer?!0:!1;return g.prototype.calculateImageData=function(a){var f=this.radius=a.blurRadius||this.blurRadius;this.maxVal=null!=a.maxPixelIntensity?a.maxPixelIntensity:this.maxPixelIntensity;this.minVal=null!=
a.minPixelIntensity?a.minPixelIntensity:this.minPixelIntensity;var k=this.field="field"in a?a.field:this.field,b=this.fieldOffset="fieldOffset"in a?a.fieldOffset:this.fieldOffset,c=a.screenPoints,d=a.gradient;if(d)this.gradient=d;else{if(!this.gradient)return!1;d=this.gradient}var e=a.features,h=a.mapinfo;c||(e&&h?c=this.screenPoints=this._calculateScreenPoints(e,h):!h&&this.screenPoints&&(e=!0,a.width&&a.width!=this.width&&(e=!1,this.width=a.width),a.height&&a.height!=this.height&&(e=!1,this.height=
a.height),e?c=this.screenPoints:this.screenPoints=null));if(!c)return!1;e=h.width||a.width||this.width;a=h.height||a.height||this.height;f=this._calculateIntensityMatrix(c,e,a,f,k,b);this._lastMatrix=f.matrix;this._maxIntVal=f.max;return this._createImageData(e,a,this._lastMatrix,d)},g.prototype._calculateScreenPoints=function(a,f){var k=f.resolution,b=f.width,c=f.height,d=f.extent,e=[];if(!d)return!1;k||(k=c?Math.abs(d[3]-d[1])/c:Math.abs(d[2]-d[0])/b);b=0;for(c=a.length;c>b;b++){var h=a[b];e[b]=
{x:Math.round((h.geometry.x-d[0])/k),y:Math.round((d[3]-h.geometry.y)/k),attributes:h.attributes}}return e},g.prototype._calculateIntensityMatrix=function(a,f,k,b,c,d){var e,h=v(k,f),n=Math.round(4.5*b),p=b*b,l=[],g=2*n+1,m=-1,q=1,x=-(1/0);d=d||0;for(c=function(a){return"function"==typeof a?a:a?"abs"==d?function(b){return-1*+b.attributes[a]}:function(b){return+b.attributes[a]+d}:function(){return 1}}(c);++m<g;)l[m]=Math.exp(-Math.pow(m-n,2)/(2*p))/Math.sqrt(2*Math.PI)*(b/2);for(m=0;m<a.length;m++){var t=
a[m];b=t.x-n;var p=t.y-n,g=b,u=p;if(q=+c(t),!isNaN(q)&&null!==q)for(var w=Math.min(t.y+n,k-1),t=Math.min(t.x+n,f-1);w>=p;){for(var y=l[p-u];t>=b;)-1<b&&-1<p&&(e=h[p][b]+=y*l[b-g]*q,e>x&&(x=e)),b++;p++;b=g}}return{matrix:h,max:x}},g.prototype._createImageData=function(a,f,k,b){if(!u)return this._createPixelData(a,f,k,b);var c=new Uint32Array(a*f);b=b.buffer?new Uint32Array(b.buffer):new Uint32Array((new Uint8Array(b)).buffer);for(var d=this.minVal,e=b.length/(this.maxVal-d),h=0;f>h;h++)for(var n=k[h],
g=0;a>g;g++){var l=Math.floor((n[g]-d)*e);c[h*a+g]=0>l?b[0]:l<b.length?b[l]:b[b.length-1]}return c},g.prototype._createPixelData=function(a,f,k,b){for(var c=Array(a*f*4),d=this.minVal,e=b.length/4/(this.maxVal-d),h=3,g=0;f>g;g++)for(var p=k[g],l=0;a>l;l++){var r=4*(g*a+l)+3,m=4*Math.floor((p[l]-d)*e)+3;3>m?m=3:m>b.length-1&&(m=b.length-1);for(h=4;h--;)c[r-h]=b[m-h]}return c},g.calculateStats=function(a,f){if(!a)return!1;for(var k,b,c,d,e,h=a.length,g=0,p=0,l=0,r=0,m=1/0,q=-(1/0);h--;)for(c=a[h],k=
c.length;k--;)e=c[k],f&&!f(e)||(d||(d=e),b=e-d,r+=e,g+=b,p+=b*b,m>e&&(m=e),e>q&&(q=e),l++);return 0<l?{mean:r/l,stdDev:Math.sqrt((p-g*g/l)/l),min:m,max:q,mid:(q-m)/2}:{mean:0,stdDev:0,min:0,max:0,mid:0}},g.getBinnedValues=function(a){function f(){console.log("not enough information to determine bins for HeatmapCalculator.getBinnedValues")}function g(a,b,c){for(var d=[];b>a;a+=c)d.push(a);return d}a=a||{};var b=a.stats,c=a.min,d=a.max,e=a.bins,h=a.count,n=a.size;a=a.values;if(!a)return console.log("values are required for HeatmapCalculator.getBinnedValues function"),
!1;if(b&&null!=b.max&&null!=b.min&&(c=b.min,d=b.max),!e)if(n){if(null==c&&(c=0),null==d){if(null==h)return f(),!1;d=c+h*n}e=g(c,d,n)}else if(h){if(b&&null!=b.min&&null!=b.max?(c=b.min,d=b.max):null!=d&&0<d&&null==c&&(c=0),null==c||null==d)return f(),!1;e=g(c,d,(d-c)/h)}for(var h=e.length,p,l=v(h,0),r=a.length;r--;)for(c=a[r],b=c.length;b--;){d=c[b];for(n=1;h>n&&(p=e[n],!(p>d));n++);l[n-1].push(d)}return l.map(function(a){return a.sort(w)})},g.getHistogramData=function(a){a=a||{};var f=a.binnedData,
k=a.stats,b=a.byStdDev,c=a.matrix;a=a.binOptions||{};if(!f){if(!c)return console.log("no data provided to HeatmapCalculator.getHistogramData"),!1;if(a.values=c,b&&(k||(k=g.calculateStats(c)),a.size=k.stdDev),a.stats=k,f=g.getBinnedValues(a),!f)return!1}var d,e;if(a.bins)c=a.bins;else for(c=[],b=0;b<f.length;b++)e=f[b],c.push(e[0]);a=[];for(b=0;b<c.length-1;b++)e=c[b],a[b]={range:[e,c[b+1]],count:e.length};return k?d=k.max:(e=f[b],d=e[e.length-1]),e=c[b],a[b]={range:[e,d],count:e.length},a},g});