
const CACHE_NAME = 'sgg-grua-v2.0.0';
const CACHE_TIMEOUT = 5000; // 5 segundos timeout para requests

// URLs críticas que siempre deben estar cacheadas
const CRITICAL_URLS = [
  '/',
  '/pwa-grua',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// URLs de la aplicación (rutas SPA)
const APP_URLS = [
  '/',
  '/gruas',
  '/clientes',
  '/operadores',
  '/servicios',
  '/facturas',
  '/cierres',
  '/tipos-servicio',
  '/reportes',
  '/settings',
  '/pwa-grua'
];

// URLs de API que requieren estrategia Network First
const API_PATTERNS = [
  '/api/',
  'supabase.co',
  '/rest/v1/'
];

// Página de fallback offline
const OFFLINE_FALLBACK = '/offline.html';

// === UTILIDADES ===
function log(message, data = '') {
  console.log(`[SW] ${message}`, data);
}

function isAPIRequest(url) {
  return API_PATTERNS.some(pattern => url.includes(pattern));
}

function isAppRequest(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.origin === location.origin && !url.includes('.');
  } catch {
    return false;
  }
}

function createTimeoutPromise(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), ms);
  });
}

async function fetchWithTimeout(request, timeout = CACHE_TIMEOUT) {
  return Promise.race([
    fetch(request),
    createTimeoutPromise(timeout)
  ]);
}

// === ESTRATEGIAS DE CACHE ===

// Cache First - Para recursos estáticos
async function cacheFirst(request) {
  log('Cache First strategy for:', request.url);
  
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      log('Serving from cache:', request.url);
      return cachedResponse;
    }

    log('Not in cache, fetching:', request.url);
    const networkResponse = await fetchWithTimeout(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      log('Cached new resource:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    log('Cache First failed:', error.message);
    
    // Para requests de app, devolver página offline
    if (isAppRequest(request.url)) {
      const offlineResponse = await caches.match(OFFLINE_FALLBACK);
      if (offlineResponse) return offlineResponse;
    }
    
    throw error;
  }
}

// Network First - Para API calls
async function networkFirst(request) {
  log('Network First strategy for:', request.url);
  
  try {
    const networkResponse = await fetchWithTimeout(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      log('Updated cache from network:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    log('Network failed, trying cache:', error.message);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      log('Serving stale from cache:', request.url);
      return cachedResponse;
    }
    
    throw error;
  }
}

// Stale While Revalidate - Para contenido que puede ser un poco desactualizado
async function staleWhileRevalidate(request) {
  log('Stale While Revalidate strategy for:', request.url);
  
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Siempre intentar actualizar en background
  const networkPromise = fetchWithTimeout(request)
    .then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
        log('Background updated cache:', request.url);
      }
      return response;
    })
    .catch(error => {
      log('Background update failed:', error.message);
    });

  // Devolver cache inmediatamente si existe, sino esperar network
  if (cachedResponse) {
    log('Serving stale from cache:', request.url);
    return cachedResponse;
  }
  
  log('No cache, waiting for network:', request.url);
  return networkPromise;
}

// === EVENTOS DEL SERVICE WORKER ===

// Install event
self.addEventListener('install', (event) => {
  log('Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        log('Caching critical resources');
        return cache.addAll(CRITICAL_URLS);
      })
      .then(() => {
        log('Critical resources cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        log('Install failed:', error.message);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  log('Activating...');
  
  event.waitUntil(
    Promise.all([
      // Limpiar caches antiguos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Tomar control de todos los clientes
      self.clients.claim()
    ]).then(() => {
      log('Activation complete');
    })
  );
});

// Fetch event - Aplicar estrategias según el tipo de request
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests que no podemos controlar
  if (url.origin !== location.origin && !isAPIRequest(event.request.url)) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // API requests - Network First
        if (isAPIRequest(event.request.url)) {
          return await networkFirst(event.request);
        }
        
        // App navigation - Stale While Revalidate
        if (isAppRequest(event.request.url)) {
          return await staleWhileRevalidate(event.request);
        }
        
        // Static resources - Cache First
        return await cacheFirst(event.request);
        
      } catch (error) {
        log('Fetch strategy failed:', error.message);
        
        // Fallback para navegación de app
        if (event.request.mode === 'navigate') {
          const offlineResponse = await caches.match(OFFLINE_FALLBACK) || 
                                 await caches.match('/');
          if (offlineResponse) return offlineResponse;
        }
        
        // Fallback genérico
        return new Response('Offline', { status: 503 });
      }
    })()
  );
});

// Background Sync - Para sincronizar datos offline
self.addEventListener('sync', (event) => {
  log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-servicios') {
    event.waitUntil(
      syncOfflineData()
        .then(() => {
          log('Background sync completed successfully');
          return self.registration.showNotification('SGG Grúa', {
            body: 'Datos sincronizados exitosamente',
            icon: '/icon-192.png',
            tag: 'sync-success'
          });
        })
        .catch(error => {
          log('Background sync failed:', error.message);
        })
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  log('Push notification received');
  
  let notificationData = {
    title: 'SGG Grúa Manager',
    body: 'Nueva notificación',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'default',
    data: {
      timestamp: Date.now(),
      url: '/'
    }
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch {
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data,
      actions: [
        {
          action: 'open',
          title: 'Abrir App'
        },
        {
          action: 'dismiss',
          title: 'Descartar'
        }
      ],
      vibrate: [100, 50, 100],
      requireInteraction: true
    })
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  log('Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Si ya hay una ventana abierta, enfocarla
        for (const client of clientList) {
          if (client.url.includes(self.location.origin)) {
            return client.focus();
          }
        }
        
        // Si no, abrir nueva ventana
        return clients.openWindow(urlToOpen);
      })
  );
});

// Message handling - Para comunicación con la app
self.addEventListener('message', (event) => {
  log('Message received:', event.data);
  
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }
  
  if (event.data?.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
    return;
  }
  
  if (event.data?.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => cache.addAll(event.data.urls))
        .then(() => {
          event.ports[0].postMessage({ success: true });
        })
        .catch(error => {
          event.ports[0].postMessage({ success: false, error: error.message });
        })
    );
    return;
  }
});

// === FUNCIONES DE UTILIDAD ===

async function syncOfflineData() {
  log('Starting offline data sync...');
  
  try {
    // Aquí implementarías la lógica específica de sincronización
    // Por ejemplo, enviar servicios creados offline a la API
    
    const offlineData = await getOfflineData();
    if (offlineData.length === 0) {
      log('No offline data to sync');
      return;
    }
    
    for (const item of offlineData) {
      try {
        await syncItem(item);
        await removeOfflineItem(item.id);
        log('Synced offline item:', item.id);
      } catch (error) {
        log('Failed to sync item:', item.id, error.message);
      }
    }
    
    log('Offline sync completed');
  } catch (error) {
    log('Offline sync failed:', error.message);
    throw error;
  }
}

async function getOfflineData() {
  // Implementar obtención de datos offline desde IndexedDB
  return [];
}

async function syncItem(item) {
  // Implementar sincronización de item individual
  return fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
}

async function removeOfflineItem(id) {
  // Implementar eliminación de item sincronizado desde IndexedDB
  return Promise.resolve();
}

// Log de inicialización
log('Service Worker script loaded', {
  version: CACHE_NAME,
  timestamp: new Date().toISOString()
});
