// borsha-nav.js · Borsha's chapter control: words written with a finger in the fog on the tea stall's glass.
// Each chapter's Bangla word is wiped out of a patch of fog, so the street shows through the stroke. The word you are in is fresh:
// sharp, beaded along its lower edge where the pushed water gathers, with one drip running from its lowest point. The others have
// fogged back, but the finger's oil keeps them clearer than the glass around them, so they stay as ghosts (Nazar's anatomy, section 12).
import {nav} from './lib/nav.js';
import {hand} from './lib/hand.js';
const N = nav({drv:null}), f = document.getElementById('fogn'), cv = f.querySelector('canvas'), ol = f.querySelector('ol'), n = N.list.length;
const words = N.list.map((c, k) => ({k, n:c.n, t:c.t})).filter(w => w.n);
ol.innerHTML = words.map(w => `<li><button type="button" data-i="${w.k}" aria-label="${w.t}"></button></li>`).join('');
const lab = document.createElement('span'); lab.className = 'lab'; f.appendChild(lab);
ol.addEventListener('click', e => { const b = e.target.closest('button'); if (b) N.go(+b.dataset.i); });
// the index is a paper note stuck to the inside of the glass with clear tape, written in marker
const ixb = f.querySelector('.ixb'), note = hand('ALL FIFTEEN', {size:13, slant:-4, seed:4217, track:1.4});
ixb.innerHTML = `<svg viewBox="-6 -4 ${Math.ceil(note.w) + 12} 21" aria-hidden="true"><g class="mk">${note.svg}</g></svg><span class="sr">All fifteen worlds</span>`;
ixb.addEventListener('click', N.open);
document.body.style.setProperty('--dfg', N.next[5]);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
// fog on glass is always paler than what is behind it: a pale veil on a dark street, a milky one on a pale ground, its droplets rimmed darker
const lum = h => { const v = parseInt(h.slice(1), 16); return ((v >> 16 & 255) * .3 + (v >> 8 & 255) * .59 + (v & 255) * .11) / 255; };
let FOG = '212,220,217', DROP = '240,243,238', FA = 1;
const tone = door => { const light = door && lum(N.next[4]) > .55; document.body.classList.toggle('lightdoor', light); FOG = light ? '253,253,251' : '212,220,217'; DROP = light ? '132,138,136' : '240,243,238'; FA = light ? 1.35 : 1; };
const ctx = cv.getContext('2d'), FONT = sz => `400 ${sz}px 'Tiro Bangla', serif`, GHOST = .2;
let W = 0, H = 0, edge = null, boxes = [], drops = [], beads = [], dripAt = null, dripT0 = 0, cj = -1, hov = -1, alpha = words.map(() => GHOST), raf = 0, marks = [];
let seed = 7; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;

// a fingertip, not a typeface: the word thickened until its thicks and thins are one even width, slanted like a hand, softened at the edge,
// with the streaks a finger leaves in what it wiped. One mask per word, used for the clear stroke and for its ghost.
const PAD = 16;
function mask(j){ const q = boxes[j], ow = Math.ceil(q.w + q.sz * .5 + PAD * 2), oh = Math.ceil(q.sz * 1.8), base = Math.round(q.sz * 1.15), dpr = Math.min(2, devicePixelRatio || 1);
 const a = document.createElement('canvas'); a.width = ow * dpr; a.height = oh * dpr; const c = a.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
 c.translate(PAD, base); c.transform(1, 0, -.13, 1, 0, 0); c.rotate(-.02 + (j % 3 - 1) * .015); c.font = FONT(q.sz); c.lineJoin = c.lineCap = 'round'; c.fillStyle = c.strokeStyle = '#000';
 c.lineWidth = q.sz * .085; c.fillText(words[j].n, 0, 0); c.strokeText(words[j].n, 0, 0);
 const b = document.createElement('canvas'); b.width = a.width; b.height = a.height; const d = b.getContext('2d'); d.filter = `blur(${(1.05 * dpr).toFixed(1)}px)`; d.drawImage(a, 0, 0); d.filter = 'none';
 // the smear: fine streaks of fog the finger left behind inside its own stroke
 d.globalCompositeOperation = 'destination-out'; d.globalAlpha = .16; d.lineWidth = .9 * dpr; d.strokeStyle = '#000';
 for (let k = 0; k < 26; k++){ const y = (rnd() * oh) * dpr; d.beginPath(); d.moveTo(0, y); d.bezierCurveTo(ow * dpr * .3, y + (rnd() - .5) * 8 * dpr, ow * dpr * .6, y + (rnd() - .5) * 8 * dpr, ow * dpr, y + (rnd() - .5) * 6 * dpr); d.stroke(); }
 return {cv:b, ox:q.x - PAD, oy:q.y - base, ow, oh, dpr}; }

function layout(){ const dpr = Math.min(2, devicePixelRatio || 1); W = f.clientWidth; H = f.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
 const sz = Math.round(H * .4); ctx.font = FONT(sz); let x = Math.round(H * .16);
 boxes = words.map(w => { const m = ctx.measureText(w.n), b = {x, y:Math.round(H * .6), w:m.width, sz}; x += m.width + sz * .75; return b; });
 ol.querySelectorAll('button').forEach((b, j) => { const q = boxes[j]; Object.assign(b.style, {left:(q.x - 8) + 'px', top:(q.y - q.sz) + 'px', width:(q.w + 16) + 'px', height:(q.sz * 1.4) + 'px'}); });
 seed = 7; drops = Array.from({length:Math.round(W * H / 80)}, () => ({x:rnd() * W, y:rnd() * H, r:.35 + rnd() * rnd() * 1.6, a:.08 + rnd() * .22}));
 edge = breath(); marks = words.map((w, j) => mask(j)); fresh(); paint(); }

// breath on glass has no clean outline: a lobed, uneven edge, fuller below where the warm air settled, thinning in soft tongues
function breath(){ const dpr = Math.min(2, devicePixelRatio || 1), c = document.createElement('canvas'); c.width = W * dpr; c.height = H * dpr;
 const x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); seed = 29; const ph = [rnd() * 7, rnd() * 7, rnd() * 7, rnd() * 7];
 const cx = W * .47, cy = H * .54, rx = W * .44, ry = H * .37; x.filter = `blur(${Math.max(6, Math.round(H * .09))}px)`; x.fillStyle = '#000'; x.beginPath();
 for (let k = 0; k <= 120; k++){ const a = k / 120 * Math.PI * 2, m = 1 + .09 * Math.sin(2 * a + ph[0]) + .06 * Math.sin(3 * a + ph[1]) + .035 * Math.sin(7 * a + ph[2]) + .02 * Math.sin(13 * a + ph[3]);
  const px = cx + Math.cos(a) * rx * m, py = cy + Math.sin(a) * ry * m * (Math.sin(a) > 0 ? 1.1 : .92); k ? x.lineTo(px, py) : x.moveTo(px, py); }
 x.fill(); x.filter = 'none'; return c; }

// where the water gathers: read the stroke's own edge; beads sit along both sides, and gather heavier on the lower edge where it runs down
function fresh(){ beads = []; dripAt = null; if (cj < 0 || !marks[cj]) return;
 const m = marks[cj], w = m.cv.width, h = m.cv.height, d = m.cv.getContext('2d').getImageData(0, 0, w, h).data, A = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? 0 : d[(y * w + x) * 4 + 3];
 let low = null; const st = Math.max(2, Math.round(2 * m.dpr));
 for (let y = st; y < h - st; y += st) for (let x = st; x < w - st; x += st){ if (A(x, y) < 150) continue;
  const below = A(x, y + st * 2) < 50, edge = below || A(x, y - st * 2) < 50 || A(x - st * 2, y) < 50 || A(x + st * 2, y) < 50; if (!edge) continue;
  const p = {x:m.ox + x / m.dpr, y:m.oy + y / m.dpr}; if (below && (!low || p.y > low.y)) low = p;
  if (rnd() < (below ? .3 : .07)) beads.push({x:p.x + (below ? 0 : (rnd() - .5) * 1.5), y:p.y + (below ? 1.2 : 0), r:below ? .8 + rnd() * 1.5 : .45 + rnd() * .8}); }
 dripAt = low; dripT0 = performance.now(); }

function draw(t){ raf = 0; const now = t || performance.now();
 ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H);
 // the fog: a pale film of fine droplets, thinning toward its edges so it reads as part of the pane, not a box laid on it
 const g = ctx.createRadialGradient(W * .42, H * .55, 8, W * .42, H * .55, W * .62);
 g.addColorStop(0, `rgba(${FOG},${(.52 * FA).toFixed(2)})`); g.addColorStop(.62, `rgba(${FOG},${(.4 * FA).toFixed(2)})`); g.addColorStop(1, `rgba(${FOG},${(.12 * FA).toFixed(2)})`);
 ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
 for (const p of drops){ const e = Math.min(1, 1.25 - Math.hypot((p.x - W * .42) / (W * .62), (p.y - H * .55) / (H * .75))); if (e <= 0) continue; ctx.fillStyle = `rgba(${DROP},${p.a * e})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); }
 if (edge){ ctx.globalCompositeOperation = 'destination-in'; ctx.drawImage(edge, 0, 0, W, H); }
 // the words, wiped: the fresh one fully clear, the rest ghosts that the fog will not settle on
 ctx.globalCompositeOperation = 'destination-out'; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; let moving = false;
 words.forEach((w, j) => { const target = (j === cj || j === hov) ? 1 : GHOST;
  if (alpha[j] < target) alpha[j] = target; else if (alpha[j] > target){ alpha[j] = reduce ? target : Math.max(target, alpha[j] - .006); moving = true; }
  const m = marks[j]; if (!m) return; ctx.globalAlpha = alpha[j]; ctx.drawImage(m.cv, m.ox, m.oy, m.ow, m.oh); });
 // one drip runs from the lowest point of the fresh word, fast then slowing, and stops
 let tip = null; if (dripAt){ const k = reduce ? 1 : Math.min(1, (now - dripT0) / 1900), L = (1 - (1 - k) * (1 - k)) * H * .3;
  ctx.globalAlpha = 1; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(dripAt.x, dripAt.y - 2); ctx.lineTo(dripAt.x + L * .04, dripAt.y + L); ctx.stroke(); tip = {x:dripAt.x + L * .04, y:dripAt.y + L}; if (k < 1) moving = true; }
 // the water the finger pushed aside gathers in beads on the stroke's lower edge: a dark rim below, a bright point on top
 ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
 for (const b of (tip ? [...beads, {...tip, r:2}] : beads)){ ctx.fillStyle = 'rgba(16,20,22,.32)'; ctx.beginPath(); ctx.arc(b.x, b.y + b.r * .9, b.r, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,248,232,.82)'; ctx.beginPath(); ctx.arc(b.x - b.r * .25, b.y + b.r * .45, b.r * .55, 0, 7); ctx.fill(); }
 if (moving) raf = requestAnimationFrame(draw); }
const paint = () => { if (!raf) raf = requestAnimationFrame(draw); };

ol.addEventListener('pointerover', e => { const b = e.target.closest('button'); if (b){ hov = words.findIndex(w => w.k === +b.dataset.i); lab.textContent = words[hov].t; f.classList.add('say'); paint(); } });
ol.addEventListener('pointerout', () => { hov = -1; lab.textContent = cj >= 0 ? words[cj].t : ''; f.classList.remove('say'); paint(); });
ol.addEventListener('focusin', e => { const b = e.target.closest('button'); if (b){ hov = words.findIndex(w => w.k === +b.dataset.i); paint(); } });
ol.addEventListener('focusout', () => { hov = -1; paint(); });

// the chapter's English name speaks for two seconds on the glass, then the pane rests; on the menu and the rule the page already says it
let first = true, quiet = 0;
N.on((i, c) => { document.body.classList.toggle('mid', i > 0 && i < n - 1); cj = words.findIndex(w => w.k === i); fresh(); paint(); lab.textContent = c.t;
 ol.querySelectorAll('button').forEach(b => b.toggleAttribute('aria-current', +b.dataset.i === i));
 document.body.classList.toggle('amber', c.el === '#rule'); document.body.classList.toggle('at-door', i === n - 1); tone(i === n - 1); paint();
 if (first){ first = false; return; } clearTimeout(quiet); if (c.el !== '#hero'){ f.classList.remove('say'); return; } f.classList.add('say'); quiet = setTimeout(() => f.classList.remove('say'), 2200); });
document.fonts.ready.then(layout); addEventListener('resize', () => { layout(); paint(); }); layout();
N.door(document.getElementById('door'), {verb:'Wipe the glass'});
