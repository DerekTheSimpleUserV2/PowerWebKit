const CACHE_NAME = 'powerhen-cache-v1';

// Lista de todos los archivos locales del repositorio que se guardarán para uso offline
const ASSETS = [
  './',
  './index.html',
  './payload.js'
];

// Evento de instalación: Almacena los archivos en la caché interna de la consola
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('PowerHEN: Archivos guardados en caché offline con éxito.');
      return cache.addAll(ASSETS);
    })
  );
  // Fuerza al Service Worker a activarse inmediatamente sin esperar
  self.skipWaiting();
});

// Evento de activación: Limpia cachés antiguas si actualizas el HEN en el futuro
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('PowerHEN: Limpiando caché antigua...');
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Evento de intercepción: Sirve los archivos desde la caché si la consola no tiene internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Devuelve el archivo desde la caché offline, o si tiene red, busca la versión online
      return cachedResponse || fetch(event.request);
    })
  );
});
