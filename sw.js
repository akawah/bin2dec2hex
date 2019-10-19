const version = "0.0.1";
const cacheName = "bin-dec-hex-" + version;
const appShellFilesToCache = [
  "/",
  "/sw.js",
  "/index.html",
  "/manifest.json",
  "/fonts/roboto.eot",
  "/fonts/roboto.svg",
  "/fonts/roboto.ttf",
  "/fonts/roboto.woff",
  "/fonts/roboto.woff2",
  "/css/styles.min.css",
  "/js/script.min.js",
  "/img/favicon.ico",
  "/img/logo.svg",
  "img/icon-72x72.png",
  "img/icon-96x96.png",
  "img/icon-128x128.png",
  "img/icon-144x144.png",
  "img/icon-152x152.png",
  "img/icon-192x192.png",
  "img/icon-384x384.png",
  "img/icon-512x512.png"
];

self.addEventListener("install", event => {
  //self.skipWaiting();
  console.log("[Service Worker]: Installed");
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log("[Service Worker]: Caching App Shell");
      return cache.addAll(appShellFilesToCache);
    })
  );
});

self.addEventListener("activate", event => {
  console.log("[Service Worker]: Active");
  self.clients.claim();
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== cacheName) {
            console.log("[Service Worker]: Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", event => {
  console.log("[Service Worker]: Fetch");
  event.respondWith(
    caches.match(event.request).then(response => {
      /*if (response) {
        console.log(
          "[Service Worker]: returning " + event.request.url + " from cache"
        );
        return response;
      } else {
        console.log(
          "[Service Worker]: returning " + event.request.url + " from net"
        );
        return fetch(event.request);
      }*/
      // w/o debug
      return response || fetch(event.request);
    })
  );
});