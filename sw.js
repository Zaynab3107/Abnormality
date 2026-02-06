self.addEventListener('install', (e) => {
  console.log('Service Worker Installed');
});

self.addEventListener('fetch', (e) => {
  // Ye website load karne mein madad karta hai
  e.respondWith(fetch(e.request));
});