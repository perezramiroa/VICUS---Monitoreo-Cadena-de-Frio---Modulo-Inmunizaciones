const CACHE_NAME = 'vicus-inmunizacion-v1.0.1';
const urlsToCache = [
  './',
  './index.html',
  './dashboard_inmunizacion.html',
  './reporte_individual.html',
  './reporte_individual_vacunas.html',
  './normativa_inmunizacion.html',
  './normativa_inmunizacion_zona1.html',
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

// Estrategia de Cache: Cache First, falling back to Network
self.addEventListener('fetch', event => {
  // Solo interceptar peticiones GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devolver desde caché si existe
        if (response) {
          return response;
        }
        
        // Si no está, buscar en la red
        return fetch(event.request)
          .then(networkResponse => {
            // Guardar una copia en caché para la próxima vez si es una respuesta válida
            if (networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Si falla la red y es una página HTML, mostrar index como offline
            if (event.request.url.includes('.html')) {
              return caches.match('./index.html');
            }
          });
      })
  );
});