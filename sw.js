// Cache de l'application pour l'utiliser hors ligne.
// Pages : réseau d'abord (pour recevoir les mises à jour), cache en secours.
// Fichiers de l'application et polices : cache d'abord.
const CACHE = 'etudes-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './manifest.webmanifest', './icon-192.png'])).catch(() => {}));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const enCache = (req, res) => {
  if (res && res.ok) { const copie = res.clone(); caches.open(CACHE).then((c) => c.put(req, copie)); }
  return res;
};

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const polices = /(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (url.origin !== self.location.origin && !polices) return;

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => enCache('./', res))
        .catch(() => caches.match('./').then((r) => r || caches.match(req, { ignoreSearch: true })))
    );
    return;
  }
  e.respondWith(caches.match(req).then((r) => r || fetch(req).then((res) => enCache(req, res))));
});
