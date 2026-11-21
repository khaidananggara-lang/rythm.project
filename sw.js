var C="rythm-v2";
self.addEventListener("install",function(e){self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
  var r=e.request;if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
  var html=r.mode==="navigate"||/\.html?$/.test(new URL(r.url).pathname);
  if(html){
    e.respondWith(fetch(r).then(function(x){var y=x.clone();caches.open(C).then(function(c){c.put(r,y)});return x}).catch(function(){return caches.match(r)}));
    return;
  }
  e.respondWith(caches.open(C).then(function(c){return c.match(r).then(function(m){
    var n=fetch(r).then(function(x){if(x&&x.ok)c.put(r,x.clone());return x}).catch(function(){return m});
    return m||n;
  })}));
});
