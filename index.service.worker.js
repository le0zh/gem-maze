// Generated version ties the HTML, engine and game pack to one complete release.
const CACHE_PREFIX = 'gem-maze:' + self.registration.scope + ':';
const CACHE_NAME = CACHE_PREFIX + 'd525382d6ba41e1583b1';
const FILES = ["index.144x144.png", "index.180x180.png", "index.512x512.png", "index.apple-touch-icon.png", "index.audio.position.worklet.js", "index.audio.worklet.js", "index.html", "index.icon.png", "index.js", "index.manifest.json", "index.offline.html", "index.pck", "index.png", "index.wasm"];
const urls = new Set(FILES.map(file => new URL(file, self.registration.scope).href));
const entry = new URL('index.html', self.registration.scope).href;

self.addEventListener('install', event => {
  // A failed/partial download never becomes the active offline release.
  event.waitUntil(caches.open(CACHE_NAME).then(async cache => {
    try {
      await cache.addAll([...urls].map(url => new Request(url, { cache: 'reload' })));
    } catch (error) {
      await caches.delete(CACHE_NAME);
      throw error;
    }
  }));
  // Let an existing game finish. A new release activates after its windows close.
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  url.search = '';
  url.hash = '';
  const key = event.request.mode === 'navigate' &&
    (url.href === self.registration.scope || url.href === entry) ? entry : url.href;
  if (!urls.has(key)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    return (await cache.match(key)) || fetch(event.request);
  })());
});
