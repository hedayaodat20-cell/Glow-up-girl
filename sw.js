const CACHE='glowup-v3';
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'])));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;if(/\.workers\.dev$/.test(new URL(e.request.url).hostname))return;e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request)));});

/* 🔔 إشعارات التذكيرات (Web Push) */
self.addEventListener('push',e=>{
  let d={};
  try{d=e.data?e.data.json():{};}catch(_){d={body:e.data?e.data.text():''};}
  const scope=self.registration.scope;
  e.waitUntil(self.registration.showNotification(d.title||'Glow Up 365',{
    body:d.body||'',
    icon:scope+'icon-192.png',
    badge:scope+'badge-96.png',
    dir:'rtl',
    lang:'ar',
    tag:d.tag||'glowup',
    renotify:true,
    data:{url:d.url||scope}
  }));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const url=(e.notification.data&&e.notification.data.url)||self.registration.scope;
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    for(const c of list){if(c.url.startsWith(self.registration.scope)&&'focus' in c)return c.focus();}
    if(clients.openWindow)return clients.openWindow(url);
  }));
});
