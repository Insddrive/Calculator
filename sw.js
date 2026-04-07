const CACHE_NAME = 'punjabi-calc-v3';
const urlsToCache = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// ਇੰਸਟਾਲ ਹੋਣ ਵੇਲੇ ਫਾਈਲਾਂ ਸੇਵ (Cache) ਕਰਨਾ
self.addEventListener('install', event => {
  // skipWaiting: ਪੁਰਾਣੇ SW ਦੀ ਉਡੀਕ ਕੀਤੇ ਬਿਨਾਂ ਤੁਰੰਤ ਐਕਟਿਵ ਹੋ ਜਾਓ
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// ਆਫਲਾਈਨ ਚੱਲਣ ਲਈ ਫਾਈਲਾਂ ਨੂੰ Cache ਵਿੱਚੋਂ ਦੇਣਾ
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// ਪੁਰਾਣੀ ਕੈਸ਼ ਡਿਲੀਟ ਕਰਨਾ ਅਤੇ ਤੁਰੰਤ ਕੰਟਰੋਲ ਲੈਣਾ
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
      // ਸਾਰੇ ਖੁੱਲੇ ਟੈਬਾਂ ਉੱਤੇ ਤੁਰੰਤ ਕੰਟਰੋਲ ਲਓ
      return self.clients.claim();
    })
  );
});
