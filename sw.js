const CACHE_NAME = 'vicus-inmunizacion-v2.1.0';
const urlsToCache = [
  './',
  './index.html',
  './dashboard_inmunizacion.html',
  './reporte_individual.html',
  './Vicus_vacunas.html',
  './css/pwa-styles.css',
  './js/pwa-utils.js',
  './js/config-sensores.js',
  './manifest.json',
  './logos/logo_rih.jpg',
  './logos/footer.jpg',
  './logos/portal-vicus.png',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Instalando Vicus Inmunización v2.1.0...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cacheando archivos críticos...');
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

// Estrategia de Cache: Network First para HTML/JS, Cache First para estáticos (Imágenes/CSS)
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Network First para HTML, archivos JS de lógica, JSON y llamadas al backend (Apps Script)
  if (
    event.request.url.includes('.html') || 
    event.request.url.includes('.js') || 
    event.request.url.includes('.json') || 
    event.request.url.includes('script.google.com') || 
    url.pathname === '/'
  ) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Cache First para recursos estáticos (imágenes, CSS, iconos)
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request).then(networkResponse => {
            if (networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          });
        })
    );
  }
});
