// Aqua Life Story — V1.97 service worker for the public play page (GitHub Pages). The page asks for it only there.
// The pictures (img/, named by their content), the songs and the character sheets are kept on the phone: the next visit starts
// without downloading them again. The page itself is always asked from the network first (new versions show at once) and kept
// for offline. A new version (V2.03) starts a fresh store and removes the old one.
const V='als-V2.03';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(K=>Promise.all(K.filter(k=>k.startsWith('als-')&&k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;const p=u.pathname;
 if(/\/(img|music)\//.test(p)){e.respondWith(caches.open(V).then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok&&res.status===200)c.put(r,res.clone());return res}))));return}
 if(/\/chars\//.test(p)){e.respondWith(caches.open(V).then(c=>c.match(r).then(m=>{const f=fetch(r).then(res=>{if(res.ok&&res.status===200)c.put(r,res.clone());return res}).catch(()=>m);return m||f})));return}
 if(r.mode==='navigate'||/\/(index\.html)?$/.test(p)){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r)))}});
