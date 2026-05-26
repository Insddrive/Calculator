const CACHE_NAME = 'punjabi-calc-v15';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// ਇੰਸਟਾਲੇਸ਼ਨ ਅਤੇ ਫਾਈਲਾਂ ਨੂੰ ਕੈਸ਼ ਕਰਨਾ
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// ਨੈੱਟਵਰਕ ਫੇਲ ਹੋਣ 'ਤੇ ਵੀ ਕੈਸ਼ ਵਿੱਚੋਂ ਐਪ ਚਲਾਉਣਾ (Offline Support)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // ਜੇਕਰ ਕੈਸ਼ ਵਿੱਚ ਫਾਈਲ ਮਿਲ ਜਾਵੇ ਤਾਂ ਉੱਥੋਂ ਦਿਓ, ਨਹੀਂ ਤਾਂ ਇੰਟਰਨੈੱਟ ਤੋਂ ਲਿਆਓ
        return response || fetch(event.request).catch(() => {
          // ਜੇਕਰ ਦੋਵੇਂ ਫੇਲ ਹੋ ਜਾਣ (ਆਫਲਾਈਨ ਹਾਲਤ ਵਿੱਚ)
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

// ਪੁਰਾਣੇ ਕੈਸ਼ ਨੂੰ ਸਾਫ਼ ਕਰਨਾ
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});
