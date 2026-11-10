/* Yatra Portal service worker v12: full offline (app shell, tickets, data), push notifications, notification clicks */
const V='yatra-v12',STATIC=V+'-static',RT=V+'-rt',SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(STATIC).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>!x.startsWith(V)&&x!=='ph-audio').map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('message',e=>{const d=e.data||{};if(d.type==='cache'&&Array.isArray(d.urls)){e.waitUntil(caches.open(STATIC).then(c=>Promise.all(d.urls.map(u=>c.add(u).catch(()=>{})))).then(()=>{if(e.source)e.source.postMessage({type:'cached',n:d.urls.length})}))}});
const swr=(r,name)=>caches.open(name).then(c=>c.match(r,{ignoreVary:true}).then(h=>{const n=fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque'))c.put(r,x.clone()).catch(()=>{});return x}).catch(()=>h);return h||n}));
const netFirst=(r,name,ms)=>caches.open(name).then(c=>new Promise(res=>{let done=false;const fb=()=>c.match(r,{ignoreVary:true}).then(h=>{if(!done&&h){done=true;res(h)}});const t=ms?setTimeout(fb,ms):0;fetch(r).then(x=>{clearTimeout(t);if(x.ok)c.put(r,x.clone()).catch(()=>{});if(!done){done=true;res(x)}}).catch(()=>{clearTimeout(t);c.match(r,{ignoreVary:true}).then(h=>{if(!done){done=true;res(h||new Response('',{status:504}))}})})}));
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET')return;
 if(r.mode==='navigate'||(u.origin===location.origin&&u.pathname.endsWith('/index.html'))){e.respondWith(fetch(r).then(x=>{if(x.ok){const c=x.clone();caches.open(STATIC).then(ch=>ch.put('./index.html',c))}return x}).catch(()=>caches.match('./index.html').then(h=>h||caches.match('./'))));return}
 if(u.origin===location.origin){e.respondWith(swr(r,STATIC));return}
 if(u.pathname.indexOf('/rest/v1/')>=0){e.respondWith(netFirst(r,RT,3500));return}
 if(/\.supabase\.co$/.test(u.hostname)||/^(image|font|style|script)$/.test(r.destination)||/wikimedia|wikipedia|openstreetmap|ytimg|fonts\.g|cdnjs|jsdelivr|unpkg|open-meteo/.test(u.hostname)){if(/open-meteo/.test(u.hostname)){e.respondWith(netFirst(r,RT,4000));return}e.respondWith(swr(r,RT));return}
});
self.addEventListener('push',e=>{let d={};try{d=e.data.json()}catch(x){d={title:'Yatra',body:e.data?e.data.text():''}}
 const prio=!!d.prio,o={body:d.body||'',tag:d.tag||'yatra',renotify:true,icon:'icons/icon-192.png',badge:'icons/icon-192.png',image:d.image||undefined,data:{url:d.url||'./index.html#today',kind:d.kind},requireInteraction:prio||d.kind==='alarm',vibrate:prio?[600,200,600,200,600,200,600,200,1200]:[200,100,200],silent:false,timestamp:Date.now()};
 e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cl=>{const fg=cl.find(c=>c.visibilityState==='visible'&&c.focused);
  if(fg){fg.postMessage({type:'push',payload:d});if(!prio&&d.kind!=='alarm')return}
  return self.registration.showNotification(d.title||'Yatra',o)}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const url=(e.notification.data&&e.notification.data.url)||'./index.html#today';
 e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cl=>{for(const c of cl){if('focus' in c){c.postMessage({type:'open',url});return c.focus()}}return self.clients.openWindow(url)}))});
