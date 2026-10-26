// Puts the cartoon avatar in the probador and keeps it dressed like the page state (st).
import { createAvatar } from './avatar.js';

const host = document.getElementById('avatar3d');
let av = null;
function boot() {
  if (av || !host || host.hidden) return;
  try { av = createAvatar(host, { onSwipe: (slot, d) => { if (LISTS[slot]) step(slot, d); } }); av.set(st, null); }
  catch (e) { // no WebGL: fall back to the photos
    host.innerHTML = '<p class="empty" style="padding:24px;text-align:center">Este navegador no puede mostrar el avatar. Te dejo las fotos.</p>';
    document.querySelector('.viewseg [data-v="fotos"]')?.click();
  }
}
window.onRender = (s, ls) => { if (av) av.set(s, ls ? ls.k : null); };
window.addEventListener('avatar:show', boot);
boot();
