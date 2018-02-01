import { config } from './common';

const cacheVersion = 1;
const cacheNamePrefix = 'restaurant-reviews-v';
const restoCacheName = `${cacheNamePrefix}${cacheVersion}`;
var allCaches = [
  restoCacheName,
];

self.addEventListener('install', event => {
  console.log('sw install event');
  // prefetch all the assets before the sw is activated
  event.waitUntil(
    caches.open(restoCacheName)
      .then(cache => {
        const assetsPathname = [
          '/index.html',
          '/index-bundle.js',
          '/index-style.css',
          '/restaurant.html',
          '/restaurant-bundle.js',
          '/restaurant-style.css',
          '/data/restaurants.json',
        ];
        for (let i = 0; i < config.nbImages; ++i) {
          assetsPathname.push(`/img/${i + 1}.jpg`);
        }
        const assetsUrl = assetsPathname.map(pathname => `${config.urlOrigin}${pathname}`);
        return cache.addAll(assetsUrl);
      })
      .catch(err => {
        console.log(`sw install event cache.addAll() failed ${err}`);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('sw activate event');
  // delete previous versions of the the caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => {
            return name.startsWith(cacheNamePrefix) && !allCaches.includes(name);
          })
          .map(name => {
            return caches.delete(name);
          })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '/'
      || requestUrl.pathname === '/restaurant.html'
      || requestUrl.pathname.startsWith('/data')
      || requestUrl.pathname.startsWith('/img')) {
      //console.log(`sw fetch event request ${requestUrl.pathname}`);
      const pathname = requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname;
      event.respondWith(
        caches.open(restoCacheName).then(cache => {
          return cache.match(pathname).then(response => {
            // always fetch from network to update the cache
            const fetchResponse = fetch(event.request)
              .then(networkResponse => {
                cache.put(pathname, networkResponse.clone());
                return networkResponse;
              })
              .catch(err => {
                console.log(`sw fetch same origin ${pathname} failed ${err}`);
              });
            if (!response) {
              // should only occur when the cache is manually cleaned from the devtools
              console.log(`sw fetch same origin ${pathname} not found in cache`);
            }
            return response ? response : fetchResponse;
          });
        })
      );
      return;
    }
  }
  //
  event.respondWith(
    // search in all caches or fetch from network
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
        .catch(err => {
          console.log(`sw fetch ${event.request.url} failed ${err}`);
        });
    })
  );
});

