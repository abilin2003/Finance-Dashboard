// Network first, so updates you upload to GitHub show straight away. Falls back to the saved copy offline.
const CACHE = "myfinance-v6";
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./","./index.html","./manifest.webmanifest","./icon-192.png"]).catch(()=>{}))); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch", e => {
  if(e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => { if(r && r.ok && (r.type==="basic"||r.type==="cors")){ const c = r.clone(); caches.open(CACHE).then(x=>x.put(e.request,c)); } return r; })
    .catch(() => caches.match(e.request, {ignoreSearch:true}).then(m => m || caches.match("./index.html"))));
});
