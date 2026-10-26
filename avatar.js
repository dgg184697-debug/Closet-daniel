// Mii-style 3D avatar that wears the closet. Built from simple shapes so every
// garment is redrawn in the same cartoon style instead of using the photos.
import * as THREE from './vendor/three.module.min.js';
import { STYLE, SKIN_DEFAULT } from './garments.js';

const TAU = Math.PI * 2;
const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: o.rough ?? 0.72, metalness: o.metal ?? 0, map: o.map || null, side: o.side || THREE.FrontSide });
const shade = (hex, k) => { const c = new THREE.Color(hex); const h = {}; c.getHSL(h); c.setHSL(h.h, h.s, Math.max(0, Math.min(1, h.l + k))); return '#' + c.getHexString(); };

// body proportions (units: about 1 = 60 cm, Mii-like big head)
const B = { headY: 2.27, headR: 0.56, neckY: 1.66, torsoTop: 1.58, torsoBot: 0.92, torsoR: [0.40, 0.37], depth: 0.72,
  shoulderX: 0.47, legX: 0.17, hipY: 0.96, kneeY: 0.5, ankleY: 0.16 };

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

// ---------- 2D drawing of the torso front (shirt, tie, layer) ----------
function drawStripes(g, x0, y0, w, h, s, scale = 1) {
  g.fillStyle = s.base; g.fillRect(x0, y0, w, h);
  if (s.stripe) { g.fillStyle = s.stripe; const step = 34 * scale, sw = (s.stripeW ? 12 : 6) * scale; for (let x = x0; x < x0 + w; x += step) g.fillRect(x, y0, sw, h); }
  if (s.weave) { g.fillStyle = 'rgba(0,0,0,0.035)'; for (let y = y0; y < y0 + h; y += 4) g.fillRect(x0, y, w, 1); }
  if (s.knit) { g.fillStyle = 'rgba(255,255,255,0.06)'; for (let y = y0; y < y0 + h; y += 6) g.fillRect(x0, y, w, 2); }
}
function drawKnit(g, x0, y0, w, h, s) {
  g.fillStyle = s.base; g.fillRect(x0, y0, w, h);
  if (s.heather) { for (let i = 0; i < 2600; i++) { g.fillStyle = Math.random() < .5 ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)'; g.fillRect(x0 + Math.random() * w, y0 + Math.random() * h, 2, 2); } }
  if (s.rib) { g.fillStyle = 'rgba(0,0,0,.09)'; for (let x = x0; x < x0 + w; x += 9) g.fillRect(x, y0, 3, h); }
  if (s.waffle) { g.strokeStyle = 'rgba(0,0,0,.10)'; g.lineWidth = 2; for (let x = x0; x < x0 + w; x += 14) { g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y0 + h); g.stroke(); } for (let y = y0; y < y0 + h; y += 14) { g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + w, y); g.stroke(); } }
  if (s.fleece) { g.fillStyle = 'rgba(255,255,255,.05)'; for (let i = 0; i < 900; i++) g.fillRect(x0 + Math.random() * w, y0 + Math.random() * h, 3, 3); }
  if (s.emboss) { g.fillStyle = 'rgba(255,255,255,.07)'; for (let y = y0 + 20; y < y0 + h; y += 46) for (let x = x0 + ((y / 46) % 2) * 23; x < x0 + w; x += 46) { g.beginPath(); g.arc(x, y, 6, 0, TAU); g.arc(x - 7, y - 7, 3.5, 0, TAU); g.arc(x + 7, y - 7, 3.5, 0, TAU); g.fill(); } }
}
function drawTie(g, cx, top, len, s) {
  const w = 64;
  g.save(); g.beginPath(); g.moveTo(cx - 20, top); g.lineTo(cx + 20, top); g.lineTo(cx + w / 2 + 4, top + len - 26); g.lineTo(cx, top + len); g.lineTo(cx - w / 2 - 4, top + len - 26); g.closePath();
  g.fillStyle = s.base; g.fill(); g.clip();
  g.fillStyle = s.dot;
  for (let y = top + 40; y < top + len; y += 26) for (let x = cx - 40 + ((y / 26) % 2) * 13; x < cx + 40; x += 26) {
    if (s.dotShape === 'racket') { g.beginPath(); g.ellipse(x, y, 3.2, 4.2, 0, 0, TAU); g.fill(); g.fillRect(x - .8, y + 4, 1.6, 4); }
    else if (s.dotShape === 'flower') { for (let a = 0; a < 4; a++) { g.beginPath(); g.arc(x + Math.cos(a * TAU / 4) * 2.6, y + Math.sin(a * TAU / 4) * 2.6, 2, 0, TAU); g.fill(); } }
    else { g.beginPath(); g.arc(x, y, 2.4, 0, TAU); g.fill(); }
  }
  g.restore();
  g.fillStyle = shade(s.base, -0.08); g.beginPath(); g.moveTo(cx - 24, top - 2); g.lineTo(cx + 24, top - 2); g.lineTo(cx + 16, top + 30); g.lineTo(cx - 16, top + 30); g.closePath(); g.fill(); // knot
}

function torsoTexture(o, skin) {
  const sh = o.camisa && STYLE[o.camisa], cp = o.capa && STYLE[o.capa], tie = o.corbata && sh && STYLE[o.corbata];
  return canvasTex(1024, 512, (g, W, H) => {
    const cx = W / 2; // front centre (u = 0.5)
    // base layer: shirt, or skin when the sweater goes on bare skin
    if (sh) {
      drawStripes(g, 0, 0, W, H, sh);
      g.fillStyle = shade(sh.base, -0.06); g.fillRect(cx - 3, 0, 6, H); // placket
      g.fillStyle = shade(sh.base, 0.12); for (let y = 60; y < H; y += 70) { g.beginPath(); g.arc(cx, y, 4.5, 0, TAU); g.fill(); }
      if (sh.pocket) { g.strokeStyle = shade(sh.base, -0.14); g.lineWidth = 2.5; g.strokeRect(cx + 60, 120, 70, 80); }
      if (tie) drawTie(g, cx, 6, 330, tie);
    } else { g.fillStyle = skin; g.fillRect(0, 0, W, H); }
    const square = () => { if (o.panuelo && STYLE[o.panuelo]) { const p = STYLE[o.panuelo]; g.fillStyle = p.base; g.beginPath(); g.moveTo(cx + 56, 132); g.lineTo(cx + 150, 132); g.lineTo(cx + 128, 72); g.lineTo(cx + 100, 94); g.lineTo(cx + 74, 70); g.closePath(); g.fill(); g.fillStyle = p.dot; for (const [dx, dy] of [[86, 108], [104, 100], [118, 112]]) { g.beginPath(); g.arc(cx + dx, dy, 3, 0, TAU); g.fill(); } } };
    if (!cp) { square(); return; }
    // layer on top, with its neckline cut out
    g.save();
    g.beginPath(); g.rect(0, 0, W, H);
    if (cp.kind === 'crew') { g.moveTo(cx - 70, 0); g.quadraticCurveTo(cx, 46, cx + 70, 0); }
    else if (cp.kind === 'vest' || cp.kind === 'cardigan') { g.moveTo(cx - 80, 0); g.lineTo(cx, cp.kind === 'vest' ? 230 : 250); g.lineTo(cx + 80, 0); }
    else if (cp.kind === 'polo') { g.moveTo(cx - 60, 0); g.lineTo(cx, 150); g.lineTo(cx + 60, 0); }
    else if (cp.kind === 'halfzip') { g.moveTo(cx - 40, 0); g.lineTo(cx - 6, 120); g.lineTo(cx + 6, 120); g.lineTo(cx + 40, 0); }
    g.clip('evenodd');
    drawKnit(g, 0, 0, W, H, cp);
    // ribbed hem and neckline trim
    g.fillStyle = shade(cp.base, -0.07); g.fillRect(0, H - 54, W, 54);
    g.fillStyle = 'rgba(0,0,0,.08)'; for (let x = 0; x < W; x += 8) g.fillRect(x, H - 54, 3, 54);
    g.restore();
    g.strokeStyle = shade(cp.base, -0.1); g.lineWidth = 12;
    if (cp.kind === 'crew') { g.beginPath(); g.moveTo(cx - 76, 0); g.quadraticCurveTo(cx, 54, cx + 76, 0); g.stroke(); }
    if (cp.kind === 'vest' || cp.kind === 'cardigan') { g.beginPath(); g.moveTo(cx - 86, 0); g.lineTo(cx, cp.kind === 'vest' ? 240 : 260); g.lineTo(cx + 86, 0); g.stroke(); }
    if (cp.kind === 'polo') { g.beginPath(); g.moveTo(cx - 64, 0); g.lineTo(cx, 158); g.lineTo(cx + 64, 0); g.stroke(); }
    if (cp.tape) { g.fillStyle = cp.tape; g.fillRect(cx - 74, 0, 148, 5); }
    // closures
    if (cp.kind === 'cardigan' || cp.kind === 'polo') { g.fillStyle = shade(cp.base, -0.1); g.fillRect(cx - 9, cp.kind === 'polo' ? 150 : 250, 18, H); g.fillStyle = cp.buttons; for (let y = (cp.kind === 'polo' ? 185 : 285); y < H - 60; y += 58) { g.beginPath(); g.arc(cx, y, 7, 0, TAU); g.fill(); } }
    if (cp.kind === 'zip') { g.fillStyle = '#9aa0a8'; g.fillRect(cx - 3, 0, 6, H - 10); g.fillRect(cx - 7, 30, 14, 26); }
    if (cp.kind === 'halfzip') { g.fillStyle = '#7d6a4f'; g.fillRect(cx - 3, 0, 6, 120); g.fillStyle = '#c9b089'; g.fillRect(cx - 7, 96, 14, 22); }
    if (cp.pockets) { g.fillStyle = shade(cp.base, -0.06); g.fillRect(cx - 230, 300, 120, 110); g.fillRect(cx + 110, 300, 120, 110); }
    if (cp.logo) { g.fillStyle = cp.logo; g.beginPath(); g.ellipse(cx + 120, 150, 14, 10, 0, 0, TAU); g.fill(); }
    if (cp.bear) { g.fillStyle = '#c9a77a'; g.beginPath(); g.arc(cx + 130, 150, 16, 0, TAU); g.fill(); g.fillStyle = '#e8e2d4'; g.fillRect(cx + 116, 166, 28, 30); }
    if (cp.kind === 'vest' && sh) { /* armholes show the shirt on the sides */ drawStripes(g, cx - 330, 40, 40, 200, sh); drawStripes(g, cx + 290, 40, 40, 200, sh); }
    square();
  });
}
function sleeveTexture(s, layer) {
  return canvasTex(256, 256, (g, W, H) => { if (layer) { drawKnit(g, 0, 0, W, H, s); g.fillStyle = shade(s.base, -0.07); g.fillRect(0, H - 34, W, 34); } else drawStripes(g, 0, 0, W, H, s, 0.6); });
}
function pantsTexture(s) {
  return canvasTex(256, 512, (g, W, H) => { g.fillStyle = s.base; g.fillRect(0, 0, W, H); if (s.heather) for (let i = 0; i < 1500; i++) { g.fillStyle = Math.random() < .5 ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)'; g.fillRect(Math.random() * W, Math.random() * H, 2, 2); }
    g.fillStyle = shade(s.base, 0.06); g.fillRect(W / 2 - 2, 0, 4, H); /* crease at the front (u=.5) */ });
}

// ---------- the avatar ----------
export function createAvatar(host, { onSwipe, look = SKIN_DEFAULT } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);
  const cvs = renderer.domElement; cvs.style.display = 'block'; cvs.style.width = '100%'; cvs.style.height = '100%'; cvs.style.touchAction = 'pan-y';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0, 1.5, 7.9); camera.lookAt(0, 1.28, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8f9c, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.7); key.position.set(2.5, 5, 4); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -2; key.shadow.camera.right = 2; key.shadow.camera.top = 3; key.shadow.camera.bottom = -1; key.shadow.radius = 6;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xdfe8ff, 0.6); rim.position.set(-3, 3, -3); scene.add(rim);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(1.4, 48), new THREE.ShadowMaterial({ opacity: 0.18 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  const rig = new THREE.Group(); scene.add(rig);
  const body = new THREE.Group(); rig.add(body);
  const parts = {}; // slot groups to rebuild
  const cast = m => { m.castShadow = true; return m; };

  // --- head (fixed) ---
  const head = new THREE.Group(); head.position.y = B.headY; body.add(head);
  const skinM = mat(look.skin, { rough: 0.55 });
  const skull = cast(new THREE.Mesh(new THREE.SphereGeometry(B.headR, 48, 32), skinM)); skull.scale.set(1.04, 0.98, 0.96); head.add(skull);
  for (const sx of [-1, 1]) { const ear = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 16), skinM); ear.position.set(sx * 0.56, -0.02, 0); ear.scale.set(0.6, 1, 0.8); head.add(ear); }
  const hairM = mat(look.hair, { rough: 0.5 });
  if (look.hairStyle === 'wavyBack') {
    // medium-long wavy hair combed back: thick locks running from the hairline over the top to the nape
    const capM = mat(shade(look.hair, -0.02), { rough: 0.7 });
    const cap = cast(new THREE.Mesh(new THREE.SphereGeometry(B.headR * 1.03, 40, 20, 0, TAU, 0, Math.PI * 0.5), capM)); cap.rotation.x = -0.8; cap.position.set(0, 0.03, -0.05); head.add(cap);
    const lockM = mat(look.hair, { rough: 0.45 });
    let seed = 5; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const R = B.headR, pt = (th, a, r) => { const y = Math.sin(th) * r, z = Math.cos(th) * r; return new THREE.Vector3(-Math.sin(a) * y, Math.cos(a) * y + 0.02, z - 0.02); };
    const N = 37;
    for (let i = 0; i < N; i++) {
      const a0 = -1.5 + 3 * i / (N - 1) + (rnd() - 0.5) * 0.05, side = Math.abs(a0) / 1.5, ph = rnd() * TAU;
      const th0 = Math.PI * (0.29 + 0.25 * side * side), th1 = Math.PI * (1.17 - 0.06 * side);
      const P = [];
      for (let k = 0; k <= 24; k++) {
        const t = k / 24, th = th0 + (th1 - th0) * t;
        const wave = Math.sin(t * 5.5 * Math.PI + ph);                       // the waves
        const a = a0 * (1 + 0.08 * Math.sin(Math.PI * t)) + 0.05 * wave;    // locks spread a little over the crown
        const lift = 0.09 * Math.exp(-t * 6) * (1 - side) + 0.1 * Math.sin(Math.PI * Math.min(1, t * 1.6)) + 0.04 * Math.max(0, t - 0.75) * 4; // quiff, volume, flick at the ends
        P.push(pt(th, a, R * (1.04 + lift) + 0.015 * wave));
      }
      const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(P), 60, 0.085 + rnd() * 0.02, 10, false), lockM);
      tube.castShadow = true; head.add(tube);
      for (const q of [P[0], P[P.length - 1]]) { const end = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 10), lockM); end.position.copy(q); head.add(end); }
    }
  } else if (look.hairStyle === 'curlyBack') {
    // curly hair combed back: a dark cap under many small curl clumps, hairline set back from the forehead
    const capM = mat(shade(look.hair, -0.04), { rough: 0.8 });
    const cap = cast(new THREE.Mesh(new THREE.SphereGeometry(B.headR * 1.03, 40, 20, 0, TAU, 0, Math.PI * 0.5), capM)); cap.rotation.x = -0.62; cap.position.set(0, 0.03, -0.05); head.add(cap);
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const pts = [];
    for (let i = 0; i < 3000 && pts.length < 340; i++) {
      const y = 1 - 2 * rnd(), r = Math.sqrt(1 - y * y), th = rnd() * TAU, x = Math.cos(th) * r, z = Math.sin(th) * r;
      // hairline: high on the forehead, above the ears on the sides, down to the nape at the back
      const lim = z > 0 ? 0.14 + 0.5 * z : 0.14 + 0.5 * z;
      if (y < lim) continue;
      if (Math.abs(x) > 0.8 && y < 0.1 && z > -0.3) continue; // keep the ears clear
      pts.push([x, y, z]);
    }
    const curl = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 2), mat('#ffffff', { rough: 0.55 }), pts.length); curl.castShadow = true;
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), sc = new THREE.Vector3();
    pts.forEach(([x, y, z], i) => {
      const lift = 1.02 + 0.19 * Math.max(0, y) + 0.04 * Math.max(0, -z); // volume on top and towards the back
      v.set(x * B.headR * 1.04 * lift, y * B.headR * lift + 0.04, z * B.headR * lift - 0.04 * Math.max(0, y));
      // clumps stretched front-to-back and tipped up at the front, so the curls read as combed back
      const rr = 0.06 + rnd() * 0.035; sc.set(rr * (0.95 + rnd() * 0.2), rr * 0.8, rr * (1.5 + rnd() * 0.4));
      e.set(-0.5 * z * Math.max(0, y) - 0.15, Math.atan2(x, z) * 0.25, (rnd() - 0.5) * 0.6); q.setFromEuler(e); m4.compose(v, q, sc); curl.setMatrixAt(i, m4);
      curl.setColorAt(i, new THREE.Color(look.hair).multiplyScalar(0.8 + rnd() * 0.45));
    });
    head.add(curl);
  } else if (look.hairStyle === 'swept') {
    // longish hair combed back with volume on top, covering the top of the ears
    const cap = cast(new THREE.Mesh(new THREE.SphereGeometry(B.headR * 1.07, 48, 24, 0, TAU, 0, Math.PI * 0.56), hairM)); cap.rotation.x = -0.42; cap.position.set(0, 0.06, -0.04); cap.scale.set(1.06, 1.08, 1.04); head.add(cap);
    const top = cast(new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 20), hairM)); top.scale.set(1.28, 0.62, 1.08); top.position.set(0.03, 0.42, 0.04); top.rotation.z = -0.08; head.add(top);
    const front = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 16), hairM); front.scale.set(1.45, 0.62, 0.8); front.position.set(0.06, 0.36, 0.3); front.rotation.set(-0.35, 0, -0.1); head.add(front);
    for (const sx of [-1, 1]) { const side = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), hairM); side.scale.set(0.55, 1.05, 1.15); side.position.set(sx * 0.5, 0.12, -0.08); head.add(side); }
    const back = cast(new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 20), hairM)); back.scale.set(1.1, 0.95, 0.75); back.position.set(0, 0.0, -0.2); head.add(back);
  } else {
    const hair = cast(new THREE.Mesh(new THREE.SphereGeometry(B.headR * 1.06, 48, 24, 0, TAU, 0, Math.PI * 0.5), hairM)); hair.rotation.x = -0.32; hair.position.set(0, 0.04, -0.03); hair.scale.set(1.04, 1.02, 1.0); head.add(hair);
    const fringe = new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 16), hairM); fringe.scale.set(1.45, 0.42, 0.7); fringe.position.set(-0.08, 0.33, 0.28); fringe.rotation.z = 0.18; head.add(fringe);
  }
  const eyes = [];
  const eyeM = mat(look.eyes || '#1b1716', { rough: 0.25 }), whiteM = mat('#ffffff', { rough: 0.3 });
  for (const sx of [-1, 1]) {
    const e = new THREE.Group(); e.position.set(sx * 0.19, 0.04, 0.5); head.add(e);
    const w = new THREE.Mesh(new THREE.SphereGeometry(0.085, 20, 16), whiteM); w.scale.set(0.85, 1.15, 0.35); e.add(w);
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.058, 20, 16), eyeM); p.scale.set(0.9, 1.15, 0.4); p.position.z = 0.02; e.add(p);
    const hl = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 8), whiteM); hl.position.set(0.018, 0.03, 0.045); e.add(hl);
    eyes.push(e);
    const brow = new THREE.Mesh(new THREE.CapsuleGeometry(0.022, 0.12, 4, 8), mat(look.brows)); brow.scale.set(look.thickBrows ? 1.4 : 1, 1, 1); brow.rotation.z = Math.PI / 2 + sx * 0.12; brow.position.set(sx * 0.19, 0.19, 0.5); head.add(brow);
  }
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 20, 16), mat(shade(look.skin, -0.05), { rough: 0.55 })); nose.scale.set(1, 0.8, 0.9); nose.position.set(0, -0.08, 0.54); head.add(nose);
  if (look.smile) {
    // big open smile: white teeth in a lower half-disc with a lip line
    const sm = new THREE.Group(); sm.position.set(0, -0.2, 0.565); sm.rotation.x = -0.25; head.add(sm);
    const teeth = new THREE.Mesh(new THREE.CircleGeometry(0.1, 28, Math.PI, Math.PI), mat('#fbf7f0', { rough: 0.35 })); teeth.scale.set(1.15, 0.62, 1); sm.add(teeth);
    const lip = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.014, 8, 28, Math.PI), mat('#8a3b33')); lip.rotation.z = Math.PI; lip.scale.set(1.15, 0.62, 1); sm.add(lip);
    const lid = new THREE.Mesh(new THREE.CapsuleGeometry(0.012, 0.21, 4, 8), mat('#8a3b33')); lid.rotation.z = Math.PI / 2; sm.add(lid);
  } else {
    const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.018, 8, 24, Math.PI * 0.8), mat('#8a3b33')); mouth.rotation.z = Math.PI * 1.1; mouth.position.set(0, -0.2, 0.5); head.add(mouth);
  }
  if (look.beard) {
    // stubble: dots on a shell over jaw, chin and upper lip, denser on the chin and moustache
    const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d');
    let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    g.fillStyle = look.beard;
    for (let i = 0; i < 26000; i++) {
      const u = rnd(), w = rnd(), cu = Math.abs(u - 0.5) * 2; // 0 centre .. 1 sides
      let d;
      if (w < 0.13) d = cu < 0.2 ? 0.75 : (cu > 0.85 ? 0.35 : 0);            // moustache, sideburns
      else if (w < 0.3) d = cu < 0.12 ? 0.15 : (cu > 0.6 ? 0.25 + 0.4 * cu : 0.08); // cheeks next to the mouth
      else d = 0.35 + 0.45 * Math.min(1, (w - 0.3) / 0.4);                      // jaw and chin
      if (rnd() > d * 0.55) continue;
      g.globalAlpha = 0.55 + rnd() * 0.4; g.beginPath(); g.arc(u * 512, w * 512, 1.1 + rnd() * 1.3, 0, TAU); g.fill();
    }
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const bm = new THREE.MeshStandardMaterial({ map: tex, transparent: true, depthWrite: false, roughness: 1 });
    const bd = new THREE.Mesh(new THREE.SphereGeometry(B.headR * 1.012, 48, 24, Math.PI / 2 - 1.3, 2.6, Math.PI * 0.56, Math.PI * 0.36), bm);
    bd.scale.set(1.04, 0.98, 0.965); head.add(bd);
  }
  if (look.glasses) { const gm = mat('#222', { rough: 0.3 }); for (const sx of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.012, 8, 28), gm); r.position.set(sx * 0.19, 0.04, 0.53); head.add(r); } const br = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.16, 6), gm); br.rotation.z = Math.PI / 2; br.position.set(0, 0.06, 0.56); head.add(br); }
  const neck = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.3, 20), skinM)); neck.position.y = B.neckY; body.add(neck);

  // hands (fixed)
  const hands = [];
  for (const sx of [-1, 1]) { const h = cast(new THREE.Mesh(new THREE.SphereGeometry(0.115, 20, 16), skinM)); h.position.set(sx * 0.62, 0.86, 0.02); body.add(h); hands.push(h); }

  // ---------- garment builders ----------
  function clear(slot) { const g = parts[slot]; if (g) { body.remove(g); g.traverse(m => { if (m.geometry) m.geometry.dispose(); if (m.material) { if (m.material.map) m.material.map.dispose(); m.material.dispose(); } }); } parts[slot] = new THREE.Group(); parts[slot].userData.slot = slot; body.add(parts[slot]); return parts[slot]; }
  const tag = (m, slot) => { m.userData.slot = slot; return cast(m); };

  function buildTop(o) {
    const g = clear('top');
    const sh = o.camisa && STYLE[o.camisa], cp = o.capa && STYLE[o.capa];
    const slotTorso = cp ? 'capa' : 'camisa';
    const tex = torsoTexture(o, look.skin);
    const h = B.torsoTop - B.torsoBot;
    const torso = tag(new THREE.Mesh(new THREE.CylinderGeometry(B.torsoR[0] + (cp ? 0.02 : 0), B.torsoR[1] + (cp ? 0.02 : 0), h, 48, 1, true, Math.PI, TAU), mat('#fff', { map: tex, rough: cp ? 0.9 : 0.7 })), slotTorso);
    torso.scale.z = B.depth; torso.position.y = B.torsoBot + h / 2; g.add(torso);
    const shoulders = tag(new THREE.Mesh(new THREE.SphereGeometry(B.torsoR[0] + (cp ? 0.02 : 0), 48, 16, 0, TAU, 0, Math.PI / 2), mat(cp ? cp.base : sh.base, { rough: cp ? 0.9 : 0.7 })), slotTorso);
    shoulders.scale.set(1.1, 0.2, B.depth); shoulders.position.y = B.torsoTop - 0.01; g.add(shoulders);
    // sleeves: layer's sleeves if it has them, else the shirt's
    const sleeveS = cp && cp.kind !== 'vest' ? cp : sh || cp; const layerSleeve = !!(cp && cp.kind !== 'vest');
    for (const sx of [-1, 1]) {
      const sl = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.13, 0.72, 20), mat('#fff', { map: sleeveTexture(sleeveS, layerSleeve), rough: layerSleeve ? 0.9 : 0.7 })), layerSleeve ? 'capa' : 'camisa');
      sl.position.set(sx * 0.545, 1.24, 0); sl.rotation.z = sx * 0.17; g.add(sl);
      const sho = tag(new THREE.Mesh(new THREE.SphereGeometry(0.128, 20, 16), mat(sleeveS.base, { rough: 0.85 })), sl.userData.slot); sho.position.set(sx * 0.47, 1.545, 0); g.add(sho);
      if (layerSleeve && sh) { const cuff = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.108, 0.108, 0.05, 18), mat(sh.base)), 'camisa'); cuff.position.set(sx * 0.605, 0.905, 0); cuff.rotation.z = sx * 0.17; g.add(cuff); }
    }
    // collar
    if (sh && !(cp && cp.kind === 'zip')) {
      const spread = sh.collar === 'spread' ? 0.75 : sh.collar === 'bd' ? 0.45 : 0.55;
      for (const sx of [-1, 1]) {
        const shape = new THREE.Shape(); shape.moveTo(0, 0); shape.lineTo(0.19, 0.02); shape.lineTo(0.03, -0.2); shape.closePath();
        const flap = tag(new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.02, bevelEnabled: false }), mat(sh.base, { side: THREE.DoubleSide })), 'camisa');
        flap.position.set(sx * 0.03, B.torsoTop + 0.115, 0.15); flap.rotation.set(-0.95, sx > 0 ? 0.35 : Math.PI - 0.35, sx > 0 ? -spread * 0.45 : spread * 0.45); g.add(flap);
        if (sh.collar === 'bd') { const b = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 8), mat('#f5f5f5')); b.position.set(sx * 0.13, B.torsoTop - 0.0, 0.29); g.add(b); }
      }
      const band = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.165, 0.175, 0.09, 24, 1, true), mat(sh.base, { side: THREE.DoubleSide })), 'camisa'); band.position.y = B.torsoTop + 0.1; g.add(band);
    }
    if (cp && cp.kind === 'crew') { const r = tag(new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.035, 10, 32), mat(shade(cp.base, -0.08), { rough: 0.95 })), 'capa'); r.rotation.x = Math.PI / 2 - 0.25; r.position.set(0, B.torsoTop + 0.06, 0.03); r.scale.set(1.15, 1, 1); g.add(r); }
    if (cp && cp.kind === 'zip') { const c = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.2, 28, 1, true), mat(cp.base, { rough: 0.9, side: THREE.DoubleSide })), 'capa'); c.position.y = B.torsoTop + 0.08; g.add(c); }
    if (cp && cp.kind === 'polo') for (const sx of [-1, 1]) { const shape = new THREE.Shape(); shape.moveTo(0, 0); shape.lineTo(0.2, 0); shape.lineTo(0.03, -0.2); shape.closePath(); const flap = tag(new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.025, bevelEnabled: false }), mat(shade(cp.base, -0.05), { rough: 0.95 })), 'capa'); flap.position.set(sx * 0.02, B.torsoTop + 0.08, 0.17); flap.rotation.set(-0.5, sx > 0 ? 0.2 : Math.PI - 0.2, sx > 0 ? -0.35 : 0.35); g.add(flap); }
    if (cp && cp.patch) { const p = tag(new THREE.Mesh(new THREE.CircleGeometry(0.05, 20), mat('#f2f2f2')), 'capa'); p.position.set(-0.6, 1.33, 0.06); p.rotation.y = -0.6; g.add(p); }
    // a 3D tie tip so it reads in profile too
    if (o.corbata && sh && STYLE[o.corbata] && !(cp && ['crew', 'zip'].includes(cp.kind))) {
      const t = STYLE[o.corbata]; const knot = tag(new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), mat(shade(t.base, -0.05))), 'corbata'); knot.scale.set(1, 1.1, 0.7); knot.position.set(0, B.torsoTop - 0.02, 0.27); g.add(knot);
    }
  }
  function buildBottom(o) {
    const g = clear('bottom');
    const s = STYLE[o.pantalon] || { base: '#555' };
    const tex = pantsTexture(s);
    const hip = tag(new THREE.Mesh(new THREE.CylinderGeometry(B.torsoR[1] + 0.015, 0.36, 0.3, 40, 1, false, Math.PI, TAU), mat(s.base, { rough: s.sheen ? 0.45 : 0.75 })), 'pantalon');
    hip.scale.z = B.depth; hip.position.y = B.hipY - 0.12; g.add(hip);
    for (const sx of [-1, 1]) {
      const leg = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.135, B.hipY - 0.12 - B.ankleY, 24, 1, false, Math.PI, TAU), mat('#fff', { map: tex, rough: s.sheen ? 0.45 : 0.75 })), 'pantalon');
      leg.position.set(sx * B.legX, (B.hipY - 0.12 + B.ankleY) / 2, 0); g.add(leg);
    }
    if (s.adjusters) for (const sx of [-1, 1]) { const a = tag(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.03), mat(shade(s.base, -0.08))), 'pantalon'); a.position.set(sx * 0.33, B.hipY - 0.02, 0.14); a.rotation.y = sx * 0.9; g.add(a); }
    // belt
    const gb = clear('belt');
    if (o.correa && STYLE[o.correa]) {
      const b = STYLE[o.correa];
      const band = tag(new THREE.Mesh(new THREE.CylinderGeometry(B.torsoR[1] + 0.03, B.torsoR[1] + 0.03, 0.075, 40, 1, true), mat(b.base, { rough: b.woven ? 0.95 : 0.4, side: THREE.DoubleSide })), 'correa');
      band.scale.z = B.depth + 0.02; band.position.y = B.hipY - 0.03; gb.add(band);
      const metal = mat(b.buckle === 'oval' ? '#55585e' : '#c8ccd2', { rough: 0.25, metal: 0.9 });
      let k;
      if (b.buckle === 'horseshoe') { k = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.011, 8, 20, Math.PI * 1.3), metal); k.rotation.z = -Math.PI * 0.15 - Math.PI / 2; }
      else if (b.buckle === 'oval') { k = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 8, 24), metal); k.scale.set(1, 0.8, 1); }
      else { k = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.075, 0.015), metal); }
      tag(k, 'correa'); k.position.set(0, B.hipY - 0.03, (B.torsoR[1] + 0.03) * (B.depth + 0.02) + 0.012); gb.add(k);
    }
  }
  function buildShoes(o) {
    const g = clear('shoes');
    const s = STYLE[o.zapatos] || { base: '#333', kind: 'oxford' };
    for (const sx of [-1, 1]) {
      const sh = new THREE.Group(); sh.position.set(sx * B.legX, 0, 0.06); g.add(sh);
      const main = mat(s.base, { rough: s.kind === 'oxford' ? 0.32 : s.kind === 'sneaker' ? 0.6 : 0.9 });
      const foot = tag(new THREE.Mesh(new THREE.SphereGeometry(0.15, 28, 18), main), 'zapatos');
      foot.scale.set(1, s.kind === 'loafer' ? 0.6 : 0.72, 1.75); foot.position.set(0, 0.085, 0.07); sh.add(foot);
      const sole = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, s.kind === 'sneaker' ? 0.06 : 0.035, 28), mat(s.kind === 'sneaker' ? '#ffffff' : shade(s.base, -0.18), { rough: 0.8 })), 'zapatos');
      sole.scale.set(1.02, 1, 1.78); sole.position.set(0, s.kind === 'sneaker' ? 0.03 : 0.018, 0.07); sh.add(sole);
      if (s.kind === 'chelsea') { const shaft = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.16, 0.22, 24), main), 'zapatos'); shaft.position.set(0, 0.2, -0.04); sh.add(shaft);
        const el = tag(new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.17, 0.09), mat(s.elastic, { rough: 0.95 })), 'zapatos'); el.position.set(sx * 0.155, 0.22, -0.04); sh.add(el); }
      if (s.kind === 'oxford' || s.kind === 'sneaker') { const lace = tag(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.14), mat(s.kind === 'sneaker' ? '#d9d9d6' : shade(s.base, -0.12), { rough: 0.7 })), 'zapatos'); lace.position.set(0, 0.17, 0.07); lace.rotation.x = -0.35; sh.add(lace);
        if (s.kind === 'oxford') { const cap = tag(new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.008, 6, 24, Math.PI), mat(shade(s.base, -0.15))), 'zapatos'); cap.rotation.x = -Math.PI / 2 + 0.3; cap.position.set(0, 0.11, 0.2); cap.scale.set(1, 0.9, 1); sh.add(cap); } }
      if (s.kind === 'loafer') { const pip = tag(new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.014, 8, 30), mat(s.trim, { rough: 0.6 })), 'zapatos'); pip.rotation.x = -Math.PI / 2; pip.scale.set(0.95, 1.5, 1); pip.position.set(0, 0.13, 0.0); sh.add(pip);
        const bow = tag(new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.018, 0.03), mat(s.trim)), 'zapatos'); bow.position.set(0, 0.145, 0.2); sh.add(bow); }
    }
  }

  // ---------- state, animation ----------
  let outfit = {}; const pop = {}; let hop = 0, spin = 0, blinkT = 2;
  function set(o, changed) {
    const prev = outfit; outfit = { ...o };
    const diff = k => changed ? changed === k : prev[k] !== o[k];
    if (!parts.top || ['camisa', 'capa', 'corbata', 'panuelo'].some(diff)) buildTop(outfit);
    if (!parts.bottom || ['pantalon', 'correa'].some(diff)) buildBottom(outfit);
    if (!parts.shoes || diff('zapatos')) buildShoes(outfit);
    if (changed) { pop[{ camisa: 'top', capa: 'top', corbata: 'top', panuelo: 'top', pantalon: 'bottom', correa: 'belt', zapatos: 'shoes' }[changed]] = 1; hop = 1; }
  }
  function celebrate() { spin = 1; }

  function resize() { const r = host.getBoundingClientRect(); const w = Math.max(1, r.width), h = Math.max(1, r.height); renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  new ResizeObserver(resize).observe(host); resize();

  let last = performance.now(), t = 0, running = true;
  function frame(now) {
    if (!running) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
    body.position.y = Math.sin(t * 2) * 0.012 + Math.sin(Math.min(1, 1 - hop) * Math.PI) * 0.12 * (hop > 0 ? 1 : 0);
    if (hop > 0) hop = Math.max(0, hop - dt * 2.6);
    rig.rotation.y = Math.sin(t * 0.6) * 0.18 + (spin > 0 ? (1 - spin) * TAU : 0);
    if (spin > 0) { spin = Math.max(0, spin - dt * 0.9); }
    head.rotation.z = Math.sin(t * 0.9) * 0.04;
    for (const k in pop) { const g = parts[k]; if (!g) continue; const p = pop[k]; const s = 1 + Math.sin((1 - p) * Math.PI) * 0.06; g.scale.set(s, 1 + (s - 1) * 0.4, s); pop[k] = Math.max(0, p - dt * 3); if (!pop[k]) { g.scale.set(1, 1, 1); delete pop[k]; } }
    blinkT -= dt; const bl = blinkT < 0.12 && blinkT > 0 ? 0.1 : 1; eyes.forEach(e => e.scale.y = bl); if (blinkT < 0) blinkT = 2 + Math.random() * 3;
    renderer.render(scene, camera); requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) { last = performance.now(); requestAnimationFrame(frame); } });

  // ---------- swipe on the avatar ----------
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function slotAt(x, y) {
    const r = cvs.getBoundingClientRect(); ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(body.children, true).find(h => h.object.userData.slot);
    let slot = hit ? hit.object.userData.slot : null;
    // tie strip on the chest
    if (hit && (slot === 'camisa' || slot === 'capa') && outfit.camisa && Math.abs(hit.point.x - rig.position.x) < 0.07 && hit.point.y > 1.15 && outfit.corbata) slot = 'corbata';
    if (!slot) { // nothing under the finger: pick by height
      const p = new THREE.Vector3(); ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), p);
      slot = p.y > 1.62 ? null : p.y > 0.98 ? (outfit.capa ? 'capa' : 'camisa') : p.y > 0.86 ? 'correa' : p.y > 0.24 ? 'pantalon' : 'zapatos';
    }
    return slot;
  }
  let s0 = null;
  cvs.addEventListener('pointerdown', e => { if (e.button > 0) return; s0 = { x: e.clientX, y: e.clientY, id: e.pointerId, slot: slotAt(e.clientX, e.clientY), lock: null, t: performance.now() }; });
  cvs.addEventListener('pointermove', e => { if (!s0 || e.pointerId !== s0.id) return; const dx = e.clientX - s0.x, dy = e.clientY - s0.y;
    if (!s0.lock && Math.hypot(dx, dy) > 8) { s0.lock = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'; if (s0.lock === 'x') try { cvs.setPointerCapture(e.pointerId) } catch (_) { } }
    if (s0.lock === 'x') rig.position.x = Math.max(-0.25, Math.min(0.25, dx / 900)); });
  const end = e => { if (!s0 || e.pointerId !== s0.id) return; const dx = e.clientX - s0.x, dy = e.clientY - s0.y; const { slot, lock, t: t0 } = s0; s0 = null; rig.position.x = 0;
    if (lock === 'x' && Math.abs(dx) > 40 && slot && onSwipe) onSwipe(slot, dx < 0 ? 1 : -1);
    else if (!lock && performance.now() - t0 < 300 && Math.hypot(dx, dy) < 8) hop = 1; };
  cvs.addEventListener('pointerup', end); cvs.addEventListener('pointercancel', end);
  cvs.addEventListener('dblclick', () => celebrate());

  return { set, celebrate, setLook(l) { Object.assign(look, l); } };
}
