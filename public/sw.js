const CACHE_NAME = 'oge-math-v1'

// Cache app shell on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(['/math-exam/'])
    )
  )
  self.skipWaiting()
})

// Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Network-first for API, cache-first for assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Never cache API calls
  if (url.pathname.startsWith('/auth') || url.pathname.startsWith('/progress') || url.pathname.startsWith('/subscription')) {
    return
  }

  // Cache-first for assets (JS, CSS, fonts, images)
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then((cached) =>
        cached || fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          }
          return response
        })
      )
    )
  }
})
