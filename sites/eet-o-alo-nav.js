// eet-o-alo-nav.js · Eet o Alo's chapter control: a brass meridian line set in a strip of worn marble (Nazar's anatomy, section 7).
// Read from the real lines: Bianchini's in Santa Maria degli Angeli (Rome, 1702) and Cassini's in San Petronio (Bologna, 1655).
// A small hole high in the far wall lets one sunbeam in; its image lands on the floor as an ELLIPSE, never a round spot, and the
// line is never a clock face. Before noon the image lies west of the line, at noon on it, after noon east of it: the ellipse
// crosses the brass exactly once. Tip: the hole in the wall. Foot: a bronze plate engraved INDEX. The next world is through the hole.
// Chapters are brass ticks let into the line with the hour cut into the marble beside them; the ellipse creeps between them.
import {nav} from './lib/nav.js';
import {mountWorks, WORKS} from './eet-o-alo-works.js';

const N = nav({drv:'.spacer'}), n = N.list.length, reduce = N.reduce;
const wk = mountWorks(); window.__wk = wk; window.__nv = N;
N.on(i => document.body.classList.toggle('at-door', i === n - 1));
N.door(document.getElementById('door'), {verb:'Step through the wall'});

// ---- the floor, seen standing at the foot of the line: eye 1 m up, the line running away up and to the left
const VW = 300, VH = 250, F = 325.8, HY = -61.4, CX = 81, CAM = -0.4, ZN = 1.06, ZW = 3.1;
const P = (x, z, y = 0) => [CX + F * (x - CAM) / z, HY + F * (1 - y) / z];
const f1 = v => (+v).toFixed(1), pt = ([a, b]) => f1(a) + ' ' + f1(b);
const quad = (x0, x1, z0, z1) => `M${pt(P(x0, z0))}L${pt(P(x1, z0))}L${pt(P(x1, z1))}L${pt(P(x0, z1))}Z`;
const ZA = 1.3, ZB = 2.9, zAt = t => 1 / (1 / ZA + t * (1 / ZB - 1 / ZA));   // ticks evenly spaced on screen, first to last
const tz = k => zAt(k / (n - 1));
let seed = 7; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
// text cut into the floor: squashed by depth, sheared along the receding line
const cut = (s, x, z, size, anchor = 'start', cls = 'eng') => { const [sx, sy] = P(x, z), fs = F * size / z;
 return `<text class="${cls}" x="0" y="0" font-size="${f1(fs)}" text-anchor="${anchor}" transform="translate(${f1(sx)} ${f1(sy)}) skewX(${f1(Math.atan(x - CAM) * 57.3)}) scale(1 ${(1 / z).toFixed(3)})">${s}</text>`; };

const el = document.createElement('nav'); el.className = 'mer'; el.id = 'mer'; el.setAttribute('aria-label', 'Chapters');
document.body.appendChild(el);

function draw(){ seed = 7;
 // the wall at the head of the line: handmade brick in shade, running bond, recessed mortar
 const [wl, wt] = P(-1.1, ZW, .36), [wr, wb] = P(.9, ZW, 0); let bricks = '';
 const cm = F / ZW; for (let r = 0; r < 5; r++){ const y0 = wb - (r + 1) * .085 * cm, off = (r % 2) * .125;
  for (let x = -1.1 - off; x < .9; x += .25){ const [bx] = P(x, ZW), l = 64 + rnd() * 38, g = 26 + rnd() * 14;
   bricks += `<rect x="${f1(bx + .6)}" y="${f1(y0 + .6)}" width="${f1(.24 * cm)}" height="${f1(.075 * cm)}" fill="rgb(${Math.round(l + 18)},${Math.round(g + 8)},${Math.round(g - 4)})" opacity="${(.82 + rnd() * .18).toFixed(2)}"/>`; } }
 const [hx, hy] = P(0, ZW, .25);
 // marble veins, meandering in floor space
 let veins = ''; for (let v = 0; v < 7; v++){ let x = -.3 + rnd() * .6, z = ZN + rnd() * 1.6, d = `M${pt(P(x, z))}`;
  for (let s = 0; s < 6; s++){ x = Math.max(-.29, Math.min(.29, x + (rnd() - .45) * .12)); z = Math.min(ZW - .05, z + .08 + rnd() * .16); d += `L${pt(P(x, z))}`; }
  veins += `<path d="${d}" stroke="rgba(92,70,50,${(.16 + rnd() * .2).toFixed(2)})" stroke-width="${(.5 + rnd() * .7).toFixed(2)}" fill="none"/>`; }
 // joints between the marble slabs, the brass line crossing them
 const joints = [1.62, 2.18, 2.7].map(z => `<path d="M${pt(P(-.3, z))}L${pt(P(.3, z))}" stroke="rgba(40,28,20,.55)" stroke-width=".7"/>`).join('');
 // a hairline crack and grit, the marble's age
 const crack = `<path d="M${pt(P(.3, 1.9))}L${pt(P(.21, 1.97))}L${pt(P(.16, 1.96))}L${pt(P(.09, 2.06))}" stroke="rgba(38,26,18,.5)" stroke-width=".55" fill="none"/>`;
 let grit = ''; for (let g = 0; g < 40; g++){ const [gx, gy] = P(-.3 + rnd() * .6, ZN + rnd() * 2); grit += `<circle cx="${f1(gx)}" cy="${f1(gy)}" r="${(.3 + rnd() * .5).toFixed(2)}" fill="rgba(${rnd() < .5 ? '40,28,20' : '230,215,190'},.35)"/>`; }
 // the ticks and what is cut beside them
 let ticks = '', labels = '';
 N.list.forEach((c, k) => { const z = tz(k);
  ticks += `<path class="tk" data-k="${k}" d="${quad(-.055, .055, z - .007, z + .007)}"/>`;
  if (c.n) labels += cut(c.n, .065, z + .012, k < 4 ? .058 : .05);
  else labels += `<path d="M${pt(P(.066, z - .018))}L${pt(P(.12, z - .018))}" stroke="rgba(52,36,24,.6)" stroke-width=".8"/>`; });
 const plate = quad(-.14, .14, 1.075, 1.19);
 return `<svg viewBox="0 0 ${VW} ${VH}" aria-hidden="true"><defs>
  <radialGradient id="mf" cx=".6" cy=".64" r=".52"><stop offset=".42" stop-color="#fff"/><stop offset=".78" stop-color="#555"/><stop offset="1" stop-color="#000"/></radialGradient>
  <mask id="mfm" maskUnits="userSpaceOnUse" x="-40" y="-40" width="${VW + 80}" height="${VH + 80}"><rect x="-40" y="-40" width="${VW + 80}" height="${VH + 80}" fill="url(#mf)"/></mask>
  <linearGradient id="mb" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#b3a38b"/><stop offset=".55" stop-color="#8f7f6a"/><stop offset="1" stop-color="#5e4f41"/></linearGradient>
  <linearGradient id="cb" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#5a4a3d"/><stop offset="1" stop-color="#2e241d"/></linearGradient>
  <linearGradient id="br" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#b8924c"/><stop offset="1" stop-color="#6e5228"/></linearGradient>
  <linearGradient id="pol" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#f0d693" stop-opacity=".75"/><stop offset=".7" stop-color="#e0c07a" stop-opacity=".15"/><stop offset="1" stop-color="#e0c07a" stop-opacity="0"/></linearGradient>
  <linearGradient id="shd" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#140c07" stop-opacity="0"/><stop offset="1" stop-color="#140c07" stop-opacity=".62"/></linearGradient>
  <radialGradient id="sun"><stop offset="0" stop-color="#fff6e2"/><stop offset=".55" stop-color="#ffe0a8" stop-opacity=".92"/><stop offset=".85" stop-color="#ffc682" stop-opacity=".45"/><stop offset="1" stop-color="#ffb870" stop-opacity="0"/></radialGradient>
  <radialGradient id="hal"><stop offset="0" stop-color="#ffb676" stop-opacity=".42"/><stop offset="1" stop-color="#ff9a50" stop-opacity="0"/></radialGradient>
  <linearGradient id="bm" gradientUnits="userSpaceOnUse" x1="${f1(hx)}" y1="${f1(hy)}" x2="${f1(hx)}" y2="${VH}"><stop offset="0" stop-color="#ffe2b0" stop-opacity=".5"/><stop offset="1" stop-color="#ffcf90" stop-opacity=".06"/></linearGradient>
  <filter id="gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .12  0 0 0 0 .08  0 0 0 0 .05  0 0 0 .55 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  <filter id="b1" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.1"/></filter>
  <filter id="b4" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="5"/></filter>
  <filter id="b2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>
  <clipPath id="ec"><path id="ecp" d=""/></clipPath>
 </defs>
 <g mask="url(#mfm)">
  <g class="cem"><path d="${quad(-1.3, 1.1, ZN - .2, ZW)}" fill="url(#cb)"/><path d="${quad(-1.3, 1.1, ZN - .2, ZW)}" filter="url(#gr)" fill="#000"/></g>
  <path d="${quad(-.315, .315, ZN, ZW)}" fill="#22170f"/>
  <path d="${quad(-.3, .3, ZN, ZW)}" fill="url(#mb)"/>${veins}${joints}${crack}${grit}
  <path d="${quad(-.3, .3, ZN, ZW)}" filter="url(#gr)" fill="#000" opacity=".8"/>
  <path d="${quad(-.07, .07, ZN, ZW)}" fill="#fff4e0" opacity=".07"/>
  <path d="${quad(-.3, .3, ZW - .5, ZW)}" fill="url(#shd)"/>
  <rect x="${f1(wl)}" y="${f1(wt)}" width="${f1(wr - wl)}" height="${f1(wb - wt)}" fill="#26140d"/>${bricks}
  <rect x="${f1(wl)}" y="${f1(wt)}" width="${f1(wr - wl)}" height="${f1(wb - wt)}" fill="#1a0e08" opacity=".38"/>
  <path d="M${f1(wl)} ${f1(wb)}H${f1(wr)}" stroke="#120a06" stroke-width="1.4"/>
  <circle cx="${f1(hx)}" cy="${f1(hy)}" r="5.6" fill="#6b522c"/><circle cx="${f1(hx)}" cy="${f1(hy)}" r="5.6" fill="none" stroke="#a7874a" stroke-width=".6" opacity=".7"/>
  <circle class="hglow" cx="${f1(hx)}" cy="${f1(hy)}" r="9" fill="#ffd9a0" opacity=".45" filter="url(#b2)"/>
  <circle cx="${f1(hx)}" cy="${f1(hy)}" r="2.6" fill="#fff4dc"/>
  <path d="${quad(-.0095, .0095, 1.19, ZW)}" fill="url(#br)"/>
  <path d="${quad(-.003, .004, 1.19, ZW)}" fill="url(#pol)"/>
  ${ticks}${labels}
  <path d="${plate}" fill="#5e4726"/><path d="${quad(-.132, .132, 1.082, 1.183)}" fill="none" stroke="#a88a52" stroke-width=".7" opacity=".7"/>
  ${cut('INDEX · 1-15', 0, 1.146, .043, 'middle', 'eng pl')}
  <g class="lit"><path class="beam" d="" fill="url(#bm)" filter="url(#b2)" style="mix-blend-mode:screen"/><g class="dust"></g>
   <path class="halo" d="" fill="url(#hal)" filter="url(#b4)" style="mix-blend-mode:screen"/>
   <path class="img" d="" fill="url(#sun)" filter="url(#b1)" style="mix-blend-mode:screen"/>
   <path class="glint" d="${quad(-.0095, .0095, 1.19, ZW)}" fill="#fff3cf" clip-path="url(#ec)" filter="url(#b1)"/></g>
 </g></svg>`; }

el.innerHTML = draw() + N.list.map((c, k) => { const [x, y] = P(0, tz(k));
 return `<button type="button" class="mk" data-k="${k}" style="left:${(x / VW * 100).toFixed(2)}%;top:${(y / VH * 100).toFixed(2)}%" aria-label="${c.t}"><span>${c.n || ''}</span><i></i></button>`; }).join('')
 + (() => { const [x, y] = P(0, 1.133); return `<button type="button" class="ixp" style="left:${(x / VW * 100).toFixed(2)}%;top:${(y / VH * 100).toFixed(2)}%" aria-label="Open the index">Index · 1–15</button>`; })()
 + `<p class="say" aria-hidden="true"></p>`;
const fitMw = () => { if (innerWidth > 720) document.documentElement.style.setProperty('--mw', (el.offsetHeight + 14) + 'px'); }; fitMw(); addEventListener('resize', fitMw);
const svg = el.querySelector('svg'), beam = svg.querySelector('.beam'), halo = svg.querySelector('.halo'), img = svg.querySelector('.img'), ecp = svg.querySelector('#ecp'),
 hglow = svg.querySelector('.hglow'), dustG = svg.querySelector('.dust'), say = el.querySelector('.say'), ticks = [...svg.querySelectorAll('.tk')], mks = [...el.querySelectorAll('.mk')];
const [hx, hy] = P(0, ZW, .25);
const DUST = Array.from({length:16}, () => ({s:rnd(), u:rnd() * 2 - 1, r:.35 + rnd() * .7, v:.02 + rnd() * .04, ph:rnd() * 6.3}));
dustG.innerHTML = DUST.map(() => '<circle fill="#fff1d6"/>').join(''); const dots = [...dustG.children];

el.addEventListener('click', e => { const m = e.target.closest('.mk'); if (m) N.go(+m.dataset.k); else if (e.target.closest('.ixp')) N.open(); });
let sayT = 0; const speak = k => { const c = N.list[k]; say.innerHTML = (c.n ? `<b>${c.n}</b>` : '') + c.t; say.classList.add('on'); clearTimeout(sayT); sayT = setTimeout(() => say.classList.remove('on'), 2200); };
el.addEventListener('pointerover', e => { const m = e.target.closest('.mk'); if (m){ speak(+m.dataset.k); ticks[+m.dataset.k].classList.add('hov'); } });
el.addEventListener('pointerout', e => { const m = e.target.closest('.mk'); if (m) ticks[+m.dataset.k].classList.remove('hov'); });
el.addEventListener('focusin', e => { const m = e.target.closest('.mk'); if (m) speak(+m.dataset.k); });
let first = true;
N.on(i => { ticks.forEach((t, k) => t.classList.toggle('on', k === i)); mks.forEach((m, k) => m.toggleAttribute('aria-current', k === i)); if (!first) speak(i); first = false; });

// ---- where the ellipse should be: a fractional chapter from the scroll, and the hour, which sets its side of the line
const spacer = document.querySelector('.spacer'), wkEl = document.querySelector('.wk'), stageEl = document.querySelector('.stage'), HOURS = [10.5, 12, 14, 16];
const topOf = c => c.at !== undefined ? c.at * Math.max(0, spacer.offsetHeight - innerHeight) : document.querySelector(c.el).getBoundingClientRect().top + scrollY;
function target(){ const y = scrollY + innerHeight * .35, tops = N.list.map(topOf); let k = 0; tops.forEach((t, j) => { if (t <= y) k = j; });
 const fr = k < n - 1 ? Math.max(0, Math.min(1, (y - tops[k]) / Math.max(1, tops[k + 1] - tops[k]))) : 0, p = Math.min(n - 1, k + fr);
 let h = 16; if (p < 3){ const a = Math.floor(p); h = HOURS[a] + (HOURS[a + 1] - HOURS[a]) * (p - a); }
 else if (k === 4){ const on = document.querySelector('#steps .step.on'); if (on) h = WORKS[+on.dataset.i].hour; }
 return {p, h}; }
let S = null, T = target(), t0 = performance.now();
function frame(now){ const dt = Math.min(.25, (now - t0) / 1000); t0 = now;
 const a = reduce || !S ? 1 : 1 - Math.pow(.02, dt); S = S ? {p:S.p + (T.p - S.p) * a, h:S.h + (T.h - S.h) * a} : {...T};
 const z = zAt(S.p / (n - 1)), dx = Math.max(-.2, Math.min(.21, (S.h - 12) * .045)), A = .078, B = .13;
 const ring = (sa, sb) => { let d = ''; for (let q = 0; q <= 28; q++){ const th = q / 28 * 6.283, xy = P(dx + sa * Math.cos(th), z + sb * Math.sin(th)); d += (q ? 'L' : 'M') + pt(xy); } return d + 'Z'; };
 const e = ring(A, B); img.setAttribute('d', e); ecp.setAttribute('d', ring(A * .8, B * .8)); halo.setAttribute('d', ring(A * 2.6, B * 2.1));
 const L = P(dx - A, z), R = P(dx + A, z), C = P(dx, z);
 beam.setAttribute('d', `M${f1(hx - 1.6)} ${f1(hy)}L${f1(hx + 1.6)} ${f1(hy)}L${pt(R)}L${pt(C)}L${pt(L)}Z`);
 const tt = now / 1000; DUST.forEach((d, j) => { const s = reduce ? d.s : (d.s + tt * d.v) % 1, w = 1 + s * (R[0] - L[0]) * .45,
  x = hx + (C[0] - hx) * s + d.u * w + (reduce ? 0 : Math.sin(tt * .7 + d.ph) * 1.2), y = hy + (C[1] - hy) * s + (reduce ? 0 : Math.cos(tt * .5 + d.ph) * .8);
  dots[j].setAttribute('cx', f1(x)); dots[j].setAttribute('cy', f1(y)); dots[j].setAttribute('r', d.r.toFixed(2)); dots[j].setAttribute('opacity', (.25 + .55 * Math.abs(Math.sin(tt * .9 + d.ph)) * Math.sin(s * 3.14)).toFixed(2)); });
 const door = Math.max(0, Math.min(1, S.p - (n - 2))); hglow.setAttribute('r', f1(9 + door * 14)); hglow.setAttribute('opacity', (.45 + door * .5).toFixed(2));
 if (!reduce || Math.abs(T.p - S.p) > .001) requestAnimationFrame(frame); else running = false; }
let running = true; requestAnimationFrame(frame);
const kick = () => { if (!running){ running = true; t0 = performance.now(); requestAnimationFrame(frame); } };

// ---- where the strip lies: in the opening room it sits bottom right; in the nine buildings it moves onto that room's floor;
// below them it sits back in the corner on the page's own dark ground; on the door it lies on the next world's ground
function place(){ let m = 'room';
 if (N.index === n - 1) m = 'door';
 else if (N.past){ const r = wkEl.getBoundingClientRect(); m = r.top < innerHeight * .5 && r.bottom > innerHeight * .5 ? 'stage' : 'page'; }
 if (el.dataset.mode !== m) el.dataset.mode = m;
 if (m === 'stage') el.style.setProperty('--sr', Math.round(innerWidth - stageEl.getBoundingClientRect().right + 24) + 'px'); }
let tick = false; addEventListener('scroll', () => { if (!tick){ tick = true; requestAnimationFrame(() => { tick = false; T = target(); place(); kick(); }); } }, {passive:true});
addEventListener('resize', () => { T = target(); place(); kick(); });
N.onPast(() => place()); N.on(() => { place(); T = target(); kick(); });
setInterval(() => { const t = target(); if (Math.abs(t.h - T.h) > .01){ T = t; kick(); } }, 400);   // the building changes under a still page
place();
