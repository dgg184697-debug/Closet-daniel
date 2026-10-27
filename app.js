/* App-only behaviour (the Vercel version): live Medellín weather, the outfit of the day,
   the agenda from Daniel's agenda server, and saved outfits kept on this phone.
   Runs after the page script, so it can use DATA, INV, st, judge, render, wxRender… */
(() => {
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (_) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) { } },
  };

  /* ---------- agenda ---------- */
  const AGENDA_DEF = 'https://srv1964247.hstgr.cloud/agenda';
  (function takeKeyFromUrl() {
    const q = new URLSearchParams(location.search); const k = q.get('clave');
    if (k) { store.set('agenda_clave', k); q.delete('clave'); history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : '') + location.hash); }
  })();
  async function agendaFor(day) {
    const clave = store.get('agenda_clave', ''); if (!clave) return null;
    const base = (store.get('agenda_api', '') || AGENDA_DEF).replace(/\/$/, '');
    const r = await fetch(`${base}/api/datos?dia=${day}&dias=1`, { headers: { 'X-Panel-Token': clave }, cache: 'no-store' });
    if (r.status === 401) throw new Error('clave');
    if (!r.ok) throw new Error('http ' + r.status);
    const d = await r.json();
    // inicio comes in UTC; show it in Medellín time
    const hora = iso => { const t = new Date(iso); return isNaN(t) ? '' : t.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Bogota' }); };
    return (d.eventos || []).slice().sort((a, b) => String(a.inicio).localeCompare(String(b.inicio)))
      .map(e => ({ titulo: e.titulo || '', hora: e.sin_hora ? 'Sin hora' : hora(e.inicio), categoria: e.categoria || '', lugar: e.lugar || '', rutina: !!e.rutina }));
  }

  /* ---------- weather (Open-Meteo, straight from the phone) ---------- */
  const WMO = c => c === 0 ? 'Despejado' : c <= 2 ? 'Parcialmente nublado' : c === 3 ? 'Nublado' : c <= 48 ? 'Niebla' : c <= 57 ? 'Llovizna' : c <= 65 ? 'Lluvia' : c <= 67 ? 'Lluvia fría' : c <= 82 ? 'Aguaceros' : 'Tormenta';
  async function forecast() {
    const u = 'https://api.open-meteo.com/v1/forecast?latitude=6.2442&longitude=-75.5812&hourly=temperature_2m,precipitation_probability,precipitation,weather_code&timezone=America%2FBogota&forecast_days=3';
    const r = await fetch(u, { cache: 'no-store' }); if (!r.ok) throw new Error('clima ' + r.status); return r.json();
  }
  const localNow = () => { const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false }).formatToParts(new Date()); const g = t => p.find(x => x.type === t).value; return { day: `${g('year')}-${g('month')}-${g('day')}`, hour: +g('hour') % 24 }; };
  const addDay = (d, n) => { const x = new Date(d + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
  function summarize(fc, day) {
    const H = fc.hourly, idx = H.time.map((t, i) => [t, i]).filter(([t]) => t.startsWith(day)).map(([, i]) => i);
    const at = i => ({ h: +H.time[i].slice(11, 13), t: H.temperature_2m[i], p: H.precipitation_probability[i] ?? 0, mm: H.precipitation[i] ?? 0, c: H.weather_code[i] });
    const hrs = idx.map(at).filter(x => x.h >= 6 && x.h <= 23);
    const band = (a, b, nombre) => { const xs = hrs.filter(x => x.h >= a && x.h < b); if (!xs.length) return null;
      const wet = xs.filter(x => x.c >= 51 || (x.p >= 50 && x.mm >= 0.2)); const worst = xs.reduce((m, x) => x.c > m.c ? x : m, xs[0]);
      const estado = wet.length ? WMO(Math.max(...wet.map(x => x.c), 61)) : WMO(worst.c);
      return { nombre, estado, lluvia: wet.length > 0, prob: Math.max(...xs.map(x => x.p)), t: xs.reduce((s, x) => s + x.t, 0) / xs.length }; };
    const franjas = [band(6, 12, 'Mañana'), band(12, 18, 'Tarde'), band(18, 24, 'Noche')].filter(Boolean);
    const ts = hrs.map(x => x.t), mm = hrs.reduce((s, x) => s + x.mm, 0);
    const fog = hrs.some(x => x.c === 45 || x.c === 48);
    return { tmin: Math.min(...ts), tmax: Math.max(...ts), lluvia_mm: Math.round(mm * 10) / 10, franjas, llueve: franjas.some(f => f.lluvia) || mm >= 2, fog, mananaLluvia: !!(franjas[0] && franjas[0].lluvia) };
  }
  function resumen(w) {
    const f = w.franjas, wet = f.filter(x => x.lluvia).map(x => x.nombre.toLowerCase());
    if (!wet.length) return w.tmax >= 27 ? 'Día seco y caluroso' : w.tmin <= 16 ? 'Día seco y fresco' : 'Día seco y templado';
    if (wet.length === f.length) return 'Lluvia durante todo el día';
    return `Lluvia en la ${wet.join(' y la ')}`.replace('la mañana y la tarde', 'mañana y la tarde');
  }

  /* ---------- outfit of the day ---------- */
  const RAIN_OK = ['Z03', 'Z07'];
  const BELT_FOR = { Z02: ['A03', 'A04'], Z03: ['A01', 'A03b'], Z04: ['A01', 'A02'], Z06: ['A01', 'A03b'], Z01: ['A02', 'A01'], Z05: ['A02', 'A01'], Z07: ['A02', 'A01'] };
  const LAYERS = ['S11', 'S07', 'S04', 'S13', 'S01', 'S05', 'S12', 'S08', 'S03'];
  function dayKind(events, day) {
    const txt = (events || []).map(e => (e.titulo + ' ' + e.categoria + ' ' + e.lugar).toLowerCase()).join(' | ');
    const dow = new Date(day + 'T12:00:00-05:00').getUTCDay(); const weekend = dow === 0 || dow === 6;
    if (/etiqueta|esmoquin|black tie|gala/.test(txt)) return { target: 4.6, label: 'evento de etiqueta', evening: true, tux: true };
    if (/cena|gala|boda|matrimonio|evento|cóctel|coctel/.test(txt)) return { target: 4, label: 'cena o evento', evening: true };
    if (/reuni|cliente|junta|presentaci|cita con|comit|negocia/.test(txt)) return { target: 3.8, label: 'reuniones' };
    if (/vuelo|aeropuerto|viaje/.test(txt)) return { target: 2.4, label: 'viaje', travel: true };
    if (/gimnasio|gym|golf|tenis|finca|paseo/.test(txt)) return { target: 2, label: 'plan relajado' };
    return weekend ? { target: 2.2, label: 'fin de semana' } : { target: 3, label: 'día de agencia' };
  }
  function adapt(o, w) {
    const c = { capa: o.capa, camisa: o.arriba, corbata: o.corbata || null, panuelo: o.panuelo || null, pantalon: o.abajo, correa: o.correa, zapatos: o.zapatos, rain: w.llueve };
    const why = [];
    if (o.capa === TUX) return { c, why }; // black tie is fixed, and it is indoors
    if (w.llueve && !RAIN_OK.includes(c.zapatos)) { c.zapatos = INV[c.pantalon].formalidad >= 3 ? 'Z03' : 'Z07'; why.push(c.zapatos === 'Z03' ? 'oxford burdeos de cuero que aguantan el agua' : 'tenis de cuero, que no se dañan con la lluvia'); }
    if (!NO_BELT.includes(c.pantalon) && !(BELT_FOR[c.zapatos] || []).includes(c.correa)) c.correa = (BELT_FOR[c.zapatos] || ['A01'])[0];
    if (NO_BELT.includes(c.pantalon)) c.correa = null;
    const cool = w.tmin <= 17 || w.fog || w.mananaLluvia;
    if (cool && !c.capa) { c.capa = LAYERS.find(s => INV[s] && s !== c.capa && INV[s].color !== INV[c.pantalon].color) || null; if (c.capa) why.push('una capa para la mañana fresca'); }
    if (w.tmax >= 27 && c.capa && !SUIT[c.capa]) { c.capa = null; why.push('sin capa, porque hace calor'); }
    if (w.llueve && !c.capa && INV.S20 && INV[c.pantalon].formalidad <= 4) { c.capa = 'S20'; why.push('la Harrington de Burberry encima, para la lluvia'); }
    if (!c.camisa && !c.capa) c.camisa = 'C02';
    return { c, why };
  }
  function hash(s) { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) | 0; return Math.abs(h); }
  function pickOutfit(w, kind, day) {
    let best = null;
    for (const o of DATA.outfits) {
      if ((o.capa === TUX) !== !!kind.tux) continue; // the tuxedo only for black-tie days, and only it
      const { c, why } = adapt(o, w); const j = judge(c);
      let score = -Math.abs(j.avg - kind.target) * 3 - j.notes.filter(n => n.lvl === 'bad').length * 10 - j.notes.length * 1.5;
      if (kind.evening && o.id === 'O03') score += 2; if (kind.travel && o.id === 'O07') score += 3;
      if (w.llueve && o.id === 'O10') score += 1.5;
      score += (hash(day + o.id) % 100) / 100; // a little variety between days
      if (!best || score > best.score) best = { o, c, why, score };
    }
    return best;
  }
  function porQue(best, w, kind) {
    const o = best.o, bits = [];
    bits.push(`Para un ${kind.label}${w.llueve ? ' con lluvia' : ''}: parte de «${o.nombre}».`);
    if (best.why.length) bits.push('Lleva ' + best.why.join(', ') + '.');
    else bits.push(o.por_que);
    return bits.join(' ');
  }

  /* ---------- render the "Clima y pinta" section ---------- */
  const head = document.querySelector('#clima .sec-head');
  head.querySelector('.label').textContent = 'Se actualiza cada vez que abres la app';
  head.querySelector('p').textContent = 'El pronóstico de Medellín, tu agenda y la pinta que te sugiero con lo que hay en tu clóset. Antes de las 2 p. m. mira hoy; después, mañana.';
  const bar = document.createElement('div'); bar.className = 'wxbar';
  bar.innerHTML = `<div class="seg" role="group" aria-label="Día"><button type="button" data-d="hoy">Hoy</button><button type="button" data-d="manana">Mañana</button></div><button type="button" class="btn ghost" id="agbtn">Conectar agenda</button>`;
  head.after(bar);
  const dlg = document.createElement('dialog'); dlg.className = 'agdlg';
  dlg.innerHTML = `<form method="dialog"><h3>Conectar tu agenda</h3><p>Pega la clave del panel de tu agenda (la misma que usa la app Agenda). Se guarda solo en este celular.</p><label>Clave del panel<input id="agkey" type="password" autocomplete="off"></label><div class="row2"><button class="btn ghost" value="cancel" type="submit">Cancelar</button><button class="btn" id="agsave" value="ok" type="submit">Guardar</button></div><p class="msg" id="agmsg"></p></form>`;
  document.body.appendChild(dlg);
  $('#agbtn').addEventListener('click', () => { $('#agkey').value = store.get('agenda_clave', ''); dlg.showModal(); });
  dlg.addEventListener('close', () => { if (dlg.returnValue === 'ok') { store.set('agenda_clave', $('#agkey').value.trim()); refresh(); } });

  let which = null, fc = null, fcAt = 0;
  bar.querySelector('.seg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; which = b.dataset.d; refresh(); });

  async function refresh() {
    const now = localNow(); const auto = now.hour < 14 ? 'hoy' : 'manana'; const sel = which || auto;
    bar.querySelectorAll('.seg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.d === sel)));
    const day = sel === 'hoy' ? now.day : addDay(now.day, 1);
    try { if (!fc || Date.now() - fcAt > 20 * 60e3) { fc = await forecast(); fcAt = Date.now(); store.set('fc_cache', { fc, fcAt }); } }
    catch (e) { const c = store.get('fc_cache', null); if (c) { fc = c.fc; fcAt = c.fcAt; } else { $('#wx').innerHTML = '<p class="empty">No pude traer el clima. Revisa la conexión y vuelve a abrir.</p>'; return; } }
    const w = summarize(fc, day);
    let events = null, agErr = '';
    try { events = await agendaFor(day); } catch (e) { agErr = e.message === 'clave' ? 'La clave de la agenda no funcionó.' : 'No pude leer la agenda.'; }
    $('#agbtn').textContent = store.get('agenda_clave', '') ? 'Agenda conectada' : 'Conectar agenda';
    const kind = dayKind(events, day);
    const best = pickOutfit(w, kind, day);
    const fecha = new Date(day + 'T12:00:00-05:00').toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', timeZone: 'America/Bogota' });
    const consejo = w.llueve ? 'Nada de gamuza ni Belgian: zapatos de cuero y paraguas a la mano.' : w.tmax >= 27 ? 'Telas livianas y colores claros; el suéter sobra.' : w.tmin <= 16 ? 'Mañana fría: lleva una capa que puedas quitarte al mediodía.' : '';
    wxRender({
      revisado: new Date(fcAt).toISOString(), fuente: 'Open-Meteo', ciudad: 'Medellín',
      etiqueta: (sel === 'hoy' ? 'Hoy, ' : 'Mañana, ') + fecha, resumen: resumen(w), tmin: w.tmin, tmax: w.tmax, lluvia_mm: w.lluvia_mm, llueve: w.llueve,
      franjas: w.franjas, consejo: agErr ? (consejo ? consejo + ' ' : '') + agErr : consejo, agenda: events || undefined,
      pinta: { nombre: best.o.nombre + (best.why.length ? ' (ajustado al clima)' : ''), ...best.c, por_que: porQue(best, w, kind) },
    });
  }
  refresh();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });

  /* ---------- saved outfits on this phone ---------- */
  const list = $('#savedlist'); $('#saved').hidden = false; $('#savebox').hidden = false;
  function showSaved() {
    const all = store.get('pintas', []);
    if (!all.length) { list.innerHTML = '<p class="muted">Aún no hay pintas guardadas. Arma una arriba y toca «Guardar esta pinta».</p>'; return; }
    list.innerHTML = all.map((p, i) => { const ids = ORDER.map(k => p[k]).filter(id => id && INV[id]); const when = p.creada ? new Date(p.creada).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }) : '';
      return `<div class="sv" data-i="${i}"><div class="thumbs">${ids.map(x => `<img src="${img(x)}" alt="${esc(name(x))}">`).join('')}</div><div class="meta"><b>${esc(p.nombre || 'Pinta sin nombre')}</b><span>${esc(when)}</span></div><div class="acts"><button class="btn ghost" type="button" data-a="load">Probar</button><button class="btn ghost" type="button" data-a="del">Borrar</button></div></div>`; }).join('');
  }
  list.addEventListener('click', e => { const b = e.target.closest('[data-a]'); if (!b) return; const i = +b.closest('.sv').dataset.i; const all = store.get('pintas', []); const p = all[i]; if (!p) return;
    if (b.dataset.a === 'load') { ORDER.forEach(k => st[k] = p[k] ?? null); st.preset = matchPreset(); render(); $('#probador').scrollIntoView(); return; }
    if (b.dataset.armed !== '1') { b.dataset.armed = '1'; b.textContent = '¿Borrar? Toca otra vez'; setTimeout(() => { b.dataset.armed = ''; b.textContent = 'Borrar'; }, 4000); return; }
    all.splice(i, 1); store.set('pintas', all); showSaved(); });
  $('#savebtn').addEventListener('click', () => {
    if (!st.capa && !st.camisa) { $('#savemsg').textContent = 'Falta la parte de arriba.'; return; }
    const all = store.get('pintas', []); const body = {}; ORDER.forEach(k => body[k] = st[k] || null);
    body.nombre = ($('#pname').value.trim() || (st.preset ? DATA.outfits.find(o => o.id === st.preset).nombre : 'Mi pinta')).slice(0, 60); body.creada = new Date().toISOString();
    all.unshift(body); store.set('pintas', all.slice(0, 60)); $('#pname').value = ''; $('#savemsg').textContent = 'Guardada en este celular.'; showSaved();
  });
  showSaved();

  /* ---------- style: follow the phone, classic, brighter or dark ---------- */
  const ESTILOS = [['auto', 'Auto'], ['clasico', 'Clásico'], ['claro', 'Claro'], ['oscuro', 'Oscuro']];
  const PAPER = { clasico: '#EDF1F6', claro: '#FBFCFD', oscuro: '#0E1524' };
  const est = document.createElement('div'); est.className = 'estilo';
  est.innerHTML = `<span class="label">Estilo</span><div class="seg" role="group" aria-label="Estilo de la app">${ESTILOS.map(([k, t]) => `<button type="button" data-e="${k}">${t}</button>`).join('')}</div>`;
  document.querySelector('.mast .wrap').appendChild(est);
  function setEstilo(e) {
    const r = document.documentElement;
    if (e === 'oscuro') r.dataset.theme = 'dark'; else if (e === 'clasico' || e === 'claro') r.dataset.theme = 'light'; else delete r.dataset.theme;
    if (e === 'claro') r.dataset.tono = 'claro'; else delete r.dataset.tono;
    const dark = e === 'oscuro' || (e === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.querySelector('meta[name="theme-color"]').content = PAPER[e] || (dark ? PAPER.oscuro : PAPER.clasico);
    est.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.e === e)));
    store.set('estilo', e);
  }
  est.addEventListener('click', ev => { const b = ev.target.closest('button'); if (b) setEstilo(b.dataset.e); });
  setEstilo(store.get('estilo', 'auto'));

  /* ---------- avatar / photos toggle in the probador ---------- */
  const frame = document.querySelector('.stage-frame');
  const tog = document.createElement('div'); tog.className = 'seg viewseg'; tog.setAttribute('role', 'group');
  tog.innerHTML = '<button type="button" data-v="avatar">Avatar</button><button type="button" data-v="fotos">Fotos</button>';
  frame.prepend(tog);
  const av = document.createElement('div'); av.className = 'avatar3d'; av.id = 'avatar3d'; $('#stage').before(av);
  let view = store.get('vista', 'avatar');
  function setView(v) { view = v; store.set('vista', v); av.hidden = v !== 'avatar'; $('#stage').hidden = v === 'avatar'; tog.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v))); if (v === 'avatar') window.dispatchEvent(new Event('avatar:show')); }
  tog.addEventListener('click', e => { const b = e.target.closest('button'); if (b) setView(b.dataset.v); });
  setView(view);
})();
