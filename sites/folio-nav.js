// folio-nav.js · Folio's chapter control: the thumb index cut into the magazine's fore-edge (Nazar's anatomy, section 9).
// Half-moon notches step down the page edge, one per division, each cutting only through the leaves above it, so the deeper the
// division the thicker the wall of cut paper. The label is a half-moon of red book cloth pasted on the division page, stamped with
// its folio, seen INSIDE the notch, never sticking out. The reader's own bookmark, a Barishal launch ticket, is tucked in at the
// division they are reading; the index is a slip paper-clipped to the head. On a phone only the fore-edge shows, until you reach for it.
import {nav} from './lib/nav.js';
const H = document.documentElement, F = () => window.__fo || {k:0, n:5, turn(){}}, isDesk = () => H.classList.contains('is-desk');
let timer = 0;
// leaves turn one after another, each with its own bend; a desk scrolled below the book is put away first
const jump = c => { clearInterval(timer); if (isDesk() && scrollY > 0) scrollTo({top:0, behavior:'auto'});
 const step = () => { const f = F(); if (f.k === c.k){ clearInterval(timer); return; } f.turn(f.k < c.k ? 1 : -1); };
 if (N.reduce){ for (let g = 0; g < 9 && F().k !== c.k; g++) step(); } else { step(); timer = setInterval(step, 420); } };
const pos = () => { const L = N.list;
 if (isDesk() && scrollY > innerHeight * .4){ let i = L.findIndex(c => c.el); L.forEach((c, k) => { if (c.el && document.querySelector(c.el).getBoundingClientRect().top <= innerHeight * .35) i = k; }); return i; }
 let i = 0; L.forEach((c, k) => { if (c.k !== undefined && c.k <= F().k) i = k; }); return i; };
const N = nav({drv:null, jump, pos}), fe = document.getElementById('fedge'), book = N.list.map((c, i) => ({...c, i})).filter(c => c.k !== undefined);
fe.innerHTML = `<svg class="sl" aria-hidden="true"></svg><button type="button" class="grip" aria-label="Show the thumb index" aria-expanded="false"></button><div class="full"><svg class="ed" aria-hidden="true"></svg><ol></ol><button type="button" class="ixb" aria-label="Open the index"></button></div>`;
const sl = fe.querySelector('.sl'), ed = fe.querySelector('.ed'), ol = fe.querySelector('ol'), ixb = fe.querySelector('.ixb'), grip = fe.querySelector('.grip');
const say = document.createElement('p'); say.className = 'fsay'; say.setAttribute('aria-hidden', 'true'); document.body.appendChild(say);
let seed = 3; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647, f1 = v => (+v).toFixed(1);

// the index slip: a cream card, the quarterly's own italic, held to the head of the page block by a steel gem clip
ixb.innerHTML = `<svg viewBox="0 0 112 60" aria-hidden="true"><g transform="rotate(-2.6 50 32)"><rect x="6" y="12" width="96" height="42" fill="rgba(40,28,14,.28)" transform="translate(2 3)" filter="url(#fo-sb)"/><rect x="6" y="12" width="96" height="42" fill="#f5f0e5"/><rect x="6" y="12" width="96" height="42" fill="none" stroke="rgba(120,100,70,.25)" stroke-width=".6"/>
 <text x="15" y="36" font-family="Gambetta,Georgia,serif" font-style="italic" font-size="19" fill="#1a1612">Index</text><text x="15" y="48.5" font-family="Gambetta,Georgia,serif" font-size="11" fill="#6f685c">of the fifteen worlds</text></g>
 <path d="M80 36 V9 a4.2 4.2 0 0 1 8.4 0 V40 a6 6 0 0 1 -12 0 V15 a3 3 0 0 1 6 0 V35" fill="none" stroke="#8e969a" stroke-width="1.5" stroke-linecap="round"/><path d="M80.6 34 V10 a3.6 3.6 0 0 1 3.4 -3.5" fill="none" stroke="rgba(255,255,255,.75)" stroke-width=".6" stroke-linecap="round"/></svg>`;

let ys = [], BX = 116, R = 23, T1 = 0, cur = 0;
function strip(SW, SH){ seed = 3; BX = SW - 34; const T0 = 46; T1 = SH - 12; const nb = book.length;
 ys = book.map((c, j) => T0 + 30 + (j + .5) * (T1 - T0 - 38) / nb);
 let pg = `M-4 ${T0} H${BX}`; ys.forEach(y => pg += ` V${f1(y - R)} A${R} ${R} 0 0 0 ${BX} ${f1(y + R)}`); pg += ` V${T1} H-4 Z`;
 let s = `<defs><linearGradient id="fo-fade" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".24" stop-color="#fff"/></linearGradient><mask id="fo-m"><rect x="-4" width="${SW + 8}" height="${SH}" fill="url(#fo-fade)"/></mask>
  <pattern id="fo-lin" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#cdc4b1"/><path d="M0 .5H3M.5 0V3" stroke="rgba(90,78,60,.17)" stroke-width=".7"/></pattern>
  <pattern id="fo-cloth" width="2.2" height="2.2" patternUnits="userSpaceOnUse"><rect width="2.2" height="2.2" fill="#b02b1d"/><path d="M0 .6H2.2" stroke="rgba(255,196,176,.15)" stroke-width=".7"/><path d="M.6 0V2.2" stroke="rgba(50,0,0,.2)" stroke-width=".6"/></pattern>
  <filter id="fo-fib" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .42  0 0 0 0 .36  0 0 0 0 .28  0 0 0 1 -.42"/></filter>
  <filter id="fo-sb"><feGaussianBlur stdDeviation="2.4"/></filter><clipPath id="fo-pg"><path d="${pg}"/></clipPath>
  <linearGradient id="fo-lit" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="rgba(40,24,12,.42)"/><stop offset=".5" stop-color="rgba(40,24,12,0)"/></linearGradient></defs><g>`;
 // the linen the book lies on, and the shadow the block throws away from the window
 s += `<rect x="-4" width="${SW + 8}" height="${SH}" fill="url(#fo-lin)"/><rect x="${BX + 6}" y="${T0 + 6}" width="12" height="${T1 - T0}" fill="rgba(46,34,20,.5)" filter="url(#fo-sb)"/><rect x="-4" y="${T1 + 2}" width="${BX + 10}" height="7" fill="rgba(46,34,20,.45)" filter="url(#fo-sb)"/>`;
 // the fore-edge face: the stack of leaves seen edge-on, turned from the window so a shade darker, a red line where each label lies
 s += `<rect x="${BX}" y="${T0}" width="9" height="${T1 - T0}" fill="#d8cfbd"/>`;
 for (let y = T0 + .6; y < T1; y += 1.1 + rnd() * .5) s += `<path d="M${BX} ${f1(y)}h9" stroke="rgba(92,76,56,${(.08 + rnd() * .18).toFixed(2)})" stroke-width=".55"/>`;
 ys.forEach(y => { s += `<rect x="${BX}" y="${f1(y - R)}" width="10" height="${2 * R}" fill="url(#fo-lin)"/><rect x="${BX}" y="${f1(y - R)}" width="10" height="${2 * R}" fill="rgba(46,34,20,.22)"/>`; });   // where the notch cuts the edge, the linen shows through
 // the bookmark, tucked in between the leaves: its end out over the edge and onto the linen, the rest under the top leaf
 s += `<g class="tkg" style="transform:translate(0px,${f1(tky(cur))}px)"><g transform="rotate(4 ${BX + 10} 0)"><rect x="${BX - 30}" y="-8" width="62" height="17" fill="rgba(40,26,14,.3)" transform="translate(1.5 2)" filter="url(#fo-sb)"/>
  <path d="M${BX - 30} -8 H${BX + 30} l1.6 2.1 -1.6 2.1 1.6 2.1 -1.6 2.1 1.6 2.1 -1.6 2.1 1.6 2.1 -1.6 2.1 H${BX - 30} Z" fill="#e8c8bd"/><rect x="${BX - 28}" y="-6" width="58" height="13" fill="none" stroke="rgba(170,40,30,.55)" stroke-width=".6"/>
  <text x="${BX + 2}" y="-.6" font-family="'JetBrains Mono',monospace" font-weight="700" font-size="5.6" fill="rgba(40,20,16,.8)">MV SUNDARBAN</text><text x="${BX + 2}" y="5.2" font-family="'JetBrains Mono',monospace" font-size="5.2" fill="rgba(40,20,16,.75)">DECK · No 0419</text></g></g>`;
 // the division pages seen down each notch: the red cloth label with its folio stamped in, then the wall of cut leaves above it
 book.forEach((c, j) => { const y = ys[j], wd = 1.6 + j * 1.15, lab = `M${BX} ${f1(y - R)} A${R} ${R} 0 0 0 ${BX} ${f1(y + R)} Z`;
  s += `<path d="${lab}" fill="#e3dac8"/><path d="M${BX} ${f1(y - R + wd)} A${f1(R - wd)} ${f1(R - wd)} 0 0 0 ${BX} ${f1(y + R - wd)} Z" fill="url(#fo-cloth)"/>`;
  s += `<text x="${f1(BX - R * .47)}" y="${f1(y + 5.4)}" text-anchor="middle" font-family="Gambetta,Georgia,serif" font-weight="600" font-size="15" fill="rgba(60,8,4,.55)" dy=".6">${c.n}</text><text x="${f1(BX - R * .47)}" y="${f1(y + 5.4)}" text-anchor="middle" font-family="Gambetta,Georgia,serif" font-weight="600" font-size="15" fill="#f2e7cf">${c.n}</text>`;
  // the far wall of the cut, the only one the eye sees from the reader's side: the leaves above the division, edge-on, fine lines in shade
  for (let r = R - .3; r > R - wd; r -= .5) s += `<path d="M${BX} ${f1(y - r)} A${f1(r)} ${f1(r)} 0 0 0 ${f1(BX - r * .98)} ${f1(y - r * .2)}" fill="none" stroke="${Math.round((R - r) / .5) % 2 ? 'rgba(236,228,210,.9)' : 'rgba(120,100,76,.55)'}" stroke-width=".45"/>`;
  s += `<path d="${lab}" fill="url(#fo-lit)"/>`; });
 // the top leaf, its margin: uncoated paper with its fibre, and the head's edge catching the window
 s += `<path d="${pg}" fill="#efe9dc"/><rect x="-4" y="${T0}" width="${BX + 4}" height="${T1 - T0}" filter="url(#fo-fib)" clip-path="url(#fo-pg)" opacity=".55"/><path d="M-4 ${T0 + .5}H${BX}" stroke="rgba(255,255,255,.8)" stroke-width="1"/>`;
 ys.forEach(y => s += `<path d="M${BX} ${f1(y - R)} A${R} ${R} 0 0 0 ${BX} ${f1(y + R)}" fill="none" stroke="rgba(70,52,34,.35)" stroke-width=".6"/>`);
 return s + `</g>`; }
function tky(i){ const j = book.findIndex(c => c.i === i); return j >= 0 ? ys[j] + R + 12 : T1 - 6; }

// on a phone: the fore-edge alone, the stack's edge with a red line at each division and the ticket's pink end
function sliver(SH){ const T0 = 8, T1 = SH - 8, nb = book.length, yy = book.map((c, j) => T0 + (j + .5) * (T1 - T0) / nb); seed = 5;
 let s = `<rect x="0" y="${T0}" width="8" height="${T1 - T0}" fill="#d8cfbd"/>`;
 for (let y = T0 + .6; y < T1; y += 1.2 + rnd() * .5) s += `<path d="M0 ${f1(y)}h8" stroke="rgba(92,76,56,${(.08 + rnd() * .16).toFixed(2)})" stroke-width=".5"/>`;
 yy.forEach(y => s += `<path d="M0 ${f1(y)}h8" stroke="#a52a1c" stroke-width="2"/>`);
 const j = Math.max(0, book.findIndex(c => c.i === cur)), ty = book.some(c => c.i === cur) ? yy[j] + 9 : T1 - 6;
 return s + `<rect x="2" y="${f1(ty)}" width="14" height="6" fill="#e8c8bd"/><rect x="8" y="${T0}" width="8" height="${T1 - T0}" fill="rgba(46,34,20,.28)"/>`; }

function build(){ const full = fe.querySelector('.full'), SW = full.clientWidth, SH = full.clientHeight;
 ed.setAttribute('viewBox', `0 0 ${SW} ${SH}`); ed.innerHTML = strip(SW, SH);
 const sh = sl.clientHeight; if (sh){ sl.setAttribute('viewBox', `0 0 16 ${sh}`); sl.innerHTML = sliver(sh); }
 ol.innerHTML = book.map((c, j) => `<li><button type="button" data-i="${c.i}" aria-label="${c.t}, page ${c.n}" style="left:${f1(BX - R - 8)}px;top:${f1(ys[j] - R - 4)}px;height:${2 * R + 8}px"></button></li>`).join('');
 mark(cur); }
function mark(i){ ol.querySelectorAll('button').forEach(b => { const on = +b.dataset.i === i; b.classList.toggle('on', on); b.toggleAttribute('aria-current', on); });
 const g = ed.querySelector('.tkg'); if (g) g.style.transform = `translate(${book.some(c => c.i === i) ? 0 : 10}px,${f1(tky(i))}px)`;
 const sh = sl.clientHeight; if (sh) sl.innerHTML = sliver(sh); }

// the name of a division, spoken for two seconds on the linen above the book, never over a printed page
let quiet = 0, first = true;
const speak = c => { say.textContent = c.n ? `${c.n} · ${c.t}` : c.t; say.classList.add('on'); clearTimeout(quiet); quiet = setTimeout(() => say.classList.remove('on'), 2200); };
ol.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; N.go(+b.dataset.i); fe.classList.remove('open'); grip.setAttribute('aria-expanded', 'false'); });
ol.addEventListener('pointerover', e => { const b = e.target.closest('button'); if (b) speak(N.list[+b.dataset.i]); });
ol.addEventListener('focusin', e => { const b = e.target.closest('button'); if (b) speak(N.list[+b.dataset.i]); });
ixb.addEventListener('click', () => { fe.classList.remove('open'); N.open(); });
let shut = 0; grip.addEventListener('click', () => { const o = fe.classList.toggle('open'); grip.setAttribute('aria-expanded', String(o)); clearTimeout(shut); if (o){ build(); shut = setTimeout(() => { fe.classList.remove('open'); grip.setAttribute('aria-expanded', 'false'); }, 6000); } });
N.on((i, c) => { cur = i; mark(i); if (first){ first = false; return; } if (!isDesk() || scrollY < innerHeight * .4) speak(c); });

// the desk: when the last division is open, the page below the magazine can be scrolled to (the colophon, the card, the next world)
const desk = on => H.classList.toggle('is-desk', on);
addEventListener('scroll', () => H.classList.toggle('scrolled', scrollY > innerHeight * .4), {passive:true});
setInterval(() => { const f = F(); if (f.k >= f.n - 1) desk(true); else if (scrollY < 4) desk(false); N.check(); }, 250);
document.fonts.ready.then(build); addEventListener('resize', build); build();
N.door(document.getElementById('door'), {verb:'Turn the page'});
