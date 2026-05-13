const CACHE_NAME = 'vicus-inmunizacion-v1.1.0';
const urlsToCache = [
  './',
  './index.html',
  './reporte_individual.html',
  './normativa_inmunizacion.html',
  './css/pwa-styles.css',
  './js/pwa-utils.js',
  './logos/logo_rih.jpg',
  './logos/footer.jpg',
  './logos/portal-vicus.png',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Instalando Vicus Inmunización...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cacheando archivos unificados...');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación y limpieza de caches antiguas
self.addEventListener('activate', event => {
  console.log('[SW] Activando Service Worker...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Eliminando cache antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Estrategia de Fetch
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request).then(networkResponse => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        });
      })
      .catch(() => caches.match('./index.html'))
  );
});