// Offline-friendly: the page and scripts come from the network when possible, photos from cache.
const V = 'closet-v10';
const SHELL = ['/', '/app.js', '/avatar.js', '/avatar-wire.js', '/garments.js', '/vendor/three.module.min.js', '/manifest.json', '/icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // weather and agenda go straight to the network
  const isImg = /\.(webp|jpg|png)$/.test(u.pathname);
  if (isImg) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); return r; })));
    return;
  }
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(h => h || caches.match('/'))));
});
