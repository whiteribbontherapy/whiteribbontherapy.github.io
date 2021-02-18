var CACHE_NAME = 'site';
var urlsToCache = [
  '/white-ribbon-therapy/index.html',
  '/white-ribbon-therapy/cover.css',
  '/white-ribbon-therapy/joanna-kosinska-DNjfFnDWBi0-unsplash.jpg'
];

// Install and cache
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Return cached response
// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//       caches.match(event.request)
//         .then(function(response) {
//           // Cache hit - return response
//           if (response) {
//             return response;
//           }
//           return fetch(event.request);
//         }
//       )
//     );
//   });
self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
              console.log("Cache hit - returning response.")
              return response;
          }
  
        //   return fetch(event.request, {credentials: 'include'}).then(
          return fetch(event.request).then(
            function(response) {
              // Check if we received a valid response
              if(!response || response.status !== 200 || response.type !== 'basic') {
                  console.log(`Non-basic response, so returning: ${response.status} ${response.type}`)
                  return response;
              }
  
              // IMPORTANT: Clone the response. A response is a stream
              // and because we want the browser to consume the response
              // as well as the cache consuming the response, we need
              // to clone it so we have two streams.
              var responseToCache = response.clone();
  
              caches.open(CACHE_NAME)
                .then(function(cache) {
                    console.log("Caching new response.")
                    cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          );
        })
      );
  });

// Cleaning up caches on activation
self.addEventListener('activate', function(event) {

    var cacheAllowlist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
        return Promise.all(
            cacheNames.map(function(cacheName) {
            if (cacheAllowlist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
            }
            })
        );
        })
    );
});
