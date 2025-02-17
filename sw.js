const CACHE_NAME = 'herova-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/assets/logo.png',
  '/assets/logo-192x192.png',
  '/assets/logo-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Intenta cachear todos los recursos, pero no falles si algunos no se pueden cachear
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(error => {
              console.error('No se pudo cachear: ' + url, error);
              // No lanzamos el error para que no falle toda la operación
            })
          )
        );
      })
      .then(() => {
        console.log('Caché inicializado');
        return self.skipWaiting();
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - devuelve la respuesta
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            // Comprueba si recibimos una respuesta válida
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona la respuesta
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});