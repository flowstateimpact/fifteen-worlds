// Eleven's chapters: a lift panel. The display shows the chapter you are on, with the lift's arrow for the way you are moving; the round buttons
// take you to a chapter. Below the journey, the twenty-two homes drawn as the crescent's elevation: tap a home to light it and the lake copies it.
import {nav} from './lib/nav.js';
const N = nav(), lift = document.getElementById('lift'), disp = lift.querySelector('.ld b'), arr = lift.querySelector('.ld i'), btns = lift.querySelector('.lb');
btns.innerHTML = N.list.map((c, k) => `<li><button type="button" data-i="${k}" aria-label="${c.t}"><span>${k + 1}</span><em>${c.t}</em></button></li>`).join('');
btns.addEventListener('click', e => { const b = e.target.closest('button'); if (b) N.go(+b.dataset.i); });
lift.querySelector('.ld').addEventListener('click', N.open);
N.on(i => { disp.textContent = String(i + 1).padStart(2, '0'); btns.querySelectorAll('button').forEach((b, k) => b.classList.toggle('on', k === i)); });
let lastY = scrollY, still;
addEventListener('scroll', () => { const d = scrollY - lastY; lastY = scrollY; if (Math.abs(d) < 2) return; arr.textContent = d > 0 ? '▼' : '▲'; arr.classList.add('mv');
 clearTimeout(still); still = setTimeout(() => arr.classList.remove('mv'), 700); }, {passive:true});

// the elevation: the crescent seen from the lake in perspective. Its ends swing toward you, so they draw taller and the floor lines bow;
// eleven floors, two homes a floor, three rooms to a home
const svg = document.getElementById('elev'), NS = 'http://www.w3.org/2000/svg', W = 640, T = .84, FH = 29, YM = 40 + 5.5 * FH, WL = 40 + 11 * FH + 26;
const K = t => 1 + .26 * (1 - Math.cos(t)) / (1 - Math.cos(T)), P = (t, v) => [W / 2 + 292 * Math.sin(t) / Math.sin(T) * (.86 + .14 * K(t)), YM + (v - 5.5) * FH * K(t)];
const el = (n, a) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); return e; };
const arc = (v, t0, t1) => { let d = ''; for (let i = 0; i <= 40; i++){ const [x, y] = P(t0 + (t1 - t0) * i / 40, v); d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); } return d; };
const quad = (a, b, v0, v1) => { const q = [P(a, v0), P(b, v0), P(b, v1), P(a, v1)]; return q.map(p => p.map(n => n.toFixed(1)).join(',')).join(' '); };
const house = el('g', {class:'house'}), water = el('g', {class:'water', filter:'url(#rip)', transform:`translate(0 ${2 * WL}) scale(1 -1)`});
const homes = [];
for (let v = 0; v <= 11; v++) house.appendChild(el('path', {d:arc(v, -T - .02, T + .02), class:'slab'}));
for (let f = 0; f < 11; f++){
 const v0 = 10 - f + .12, v1 = 11 - f - .16;
 for (const side of [-1, 1]){
  const g = el('g', {class:'home', tabindex:0, role:'button', 'data-f':f + 1, 'data-s':side < 0 ? 'west' : 'east', 'aria-label':`Floor ${f + 1}, ${side < 0 ? 'west' : 'east'} home`});
  for (const t of [.14, .42, .7]){ const a = side * t - .12, b = side * t + .12; g.appendChild(el('polygon', {points:quad(Math.min(a, b), Math.max(a, b), v0, v1)})); }
  if (f === 6 && side < 0) g.classList.add('yours');
  house.appendChild(g); homes.push(g);
 }
}
for (const t of [-T, 0, T]){ const [x0, y0] = P(t, 0), [x1, y1] = P(t, 11); house.appendChild(el('line', {x1:x0, x2:x1, y1:y0, y2:y1, class:'fin'})); }
water.appendChild(house.cloneNode(true));water.setAttribute('aria-hidden','true');water.querySelectorAll('[tabindex]').forEach(e=>{e.removeAttribute('tabindex');e.removeAttribute('role')});
svg.append(house, el('line', {x1:0, x2:W, y1:WL, y2:WL, class:'wl'}), water);
const mirror = [...water.querySelectorAll('.home')], out = document.getElementById('hread'), cnt = document.getElementById('hlit');
let lit = 0;
// which homes are left: the same register drives the elevation and the key board in the lobby (all numbers fictional)
const HELD = ['4E', '6W', '11W'], OPEN = ['2W', '3E', '5W', '5E', '7W', '8E', '9W', '10E', '11E'];
const BANDS = [[1, 3, 4.2], [4, 6, 4.5], [7, 9, 4.9], [10, 11, 5.6]], price = f => BANDS.find(b => f >= b[0] && f <= b[1])[2];
const code = (f, s) => f + (s === 'west' ? 'W' : 'E'), state = c => OPEN.includes(c) ? 'for sale' : HELD.includes(c) ? 'reserved' : 'sold';
homes.forEach(g => { const st = state(code(g.dataset.f, g.dataset.s)); g.classList.toggle('sold', st === 'sold'); g.classList.toggle('held', st === 'reserved'); });
mirror.forEach((m, i) => { m.classList.toggle('sold', homes[i].classList.contains('sold')); m.classList.toggle('held', homes[i].classList.contains('held')); });
const show = g => { const st = state(code(g.dataset.f, g.dataset.s)); out.textContent = `Floor ${g.dataset.f} · ${g.dataset.s} home · 2,450 sq ft · balcony 3.2 m · ${st === 'sold' ? 'sold' : '৳ ' + price(+g.dataset.f) + ' crore, ' + st}${g.classList.contains('yours') ? ' · you stood here' : ''}`; };
const toggle = g => { const i = homes.indexOf(g), on = !g.classList.contains('lit'); g.classList.toggle('lit', on); mirror[i].classList.toggle('lit', on); lit += on ? 1 : -1; cnt.textContent = `${lit} of 22 lit`; show(g); };
homes.forEach(g => { g.addEventListener('click', () => toggle(g)); g.addEventListener('mouseenter', () => show(g)); g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(g); } }); });
// ---- the key board: walnut, a brass rail of hooks for each side of the crescent, floor eleven at the top. A key and its fibre tag hang
// where a home is for sale; a reserved home's key is turned to the wall with a paper slip on it; a sold home leaves a bare hook and the ring it wore.
{ const kb = document.getElementById('kboard'), kr = document.getElementById('kread'); let sd = 23; const rn = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
 let s = `<defs><linearGradient id="kw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a2f1c"/><stop offset=".5" stop-color="#3a2415"/><stop offset="1" stop-color="#22140b"/></linearGradient>
 <linearGradient id="kl" x1="0" y1=".8" x2="1" y2=".2"><stop offset="0" stop-color="#ffcf96" stop-opacity=".34"/><stop offset=".5" stop-color="#ffcf96" stop-opacity=".03"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient>
 <radialGradient id="kbr" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#f6dc9c"/><stop offset=".55" stop-color="#b98b3c"/><stop offset="1" stop-color="#5a3f16"/></radialGradient>
 <filter id="kgr"><feTurbulence type="fractalNoise" baseFrequency=".012 .5" numOctaves="3" seed="6"/><feColorMatrix values="0 0 0 0 .1  0 0 0 0 .05  0 0 0 0 .02  0 0 0 .55 -.14"/><feComposite in2="SourceGraphic" operator="in"/></filter>
 <linearGradient id="kpl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9cd86"/><stop offset=".5" stop-color="#b98b3c"/><stop offset="1" stop-color="#8a6524"/></linearGradient>
 <filter id="ksh" x="-60%" y="-20%" width="260%" height="160%"><feGaussianBlur stdDeviation="2.6"/></filter></defs>
 <rect x="6" y="6" width="408" height="682" rx="5" fill="url(#kw)"/><rect x="6" y="6" width="408" height="682" rx="5" fill="#000" filter="url(#kgr)"/>
 <rect x="14" y="14" width="392" height="666" rx="3" fill="none" stroke="#b98b3c" stroke-width="1.6" opacity=".7"/>
 <text x="210" y="52" text-anchor="middle" font-family="'Bespoke Serif',serif" font-weight="300" font-size="27" letter-spacing="9" fill="#e9cf96">ELEVEN</text>
 <g font-family="'General Sans',sans-serif" font-size="10" letter-spacing="3" fill="#e9cf96" opacity=".75"><text x="132" y="76" text-anchor="middle">WEST</text><text x="288" y="76" text-anchor="middle">EAST</text></g>`;
 for (let f = 11; f >= 1; f--){ const y = 96 + (11 - f) * 44;
  s += `<text x="210" y="${y + 26}" text-anchor="middle" font-family="'Bespoke Serif',serif" font-size="15" fill="#e9cf96" opacity=".8">${f}</text><path d="M56 ${y - 7}H190M230 ${y - 7}H364" stroke="#000" stroke-width="1" opacity=".3"/>`;
  for (const [sx, sn] of [[132, 'W'], [288, 'E']]){ const c = f + sn, st = state(c), a = ((rn() - .5) * 7).toFixed(1);
   s += `<circle cx="${sx}" cy="${y}" r="3.6" fill="url(#kbr)"/><path d="M${sx} ${y + 2}v5a3 3 0 0 0 6 0" fill="none" stroke="url(#kbr)" stroke-width="2.2" stroke-linecap="round"/>`;
   if (st === 'sold') s += `<circle cx="${sx + 3}" cy="${y + 16}" r="8.5" fill="none" stroke="#000" stroke-width="2.4" opacity=".16"/><circle cx="${sx + 3}" cy="${y + 16}" r="8.5" fill="none" stroke="#f0d9a8" stroke-width=".5" opacity=".1"/>`;
   else s += `<g class="kt" tabindex="0" role="button" data-c="${c}" aria-label="Floor ${f} ${sn === 'W' ? 'west' : 'east'}, ${st}"><g class="sw" style="transform:rotate(${a}deg)">
    ${st === 'reserved' ? `<g transform="translate(8 6)" opacity=".5" filter="url(#ksh)"><rect x="${sx - 9}" y="${y + 16}" width="24" height="15"/></g>` : `<g transform="translate(9 6)" opacity=".55" filter="url(#ksh)"><rect x="${sx - 21}" y="${y + 14}" width="50" height="21"/><rect x="${sx + 22}" y="${y + 6}" width="30" height="6"/></g>
    <circle cx="${sx + 3}" cy="${y + 11}" r="4.6" fill="none" stroke="url(#kbr)" stroke-width="1.4"/>
    <g transform="rotate(-74 ${sx + 3} ${y + 12})"><circle cx="${sx + 3}" cy="${y + 19}" r="6.2" fill="none" stroke="#d6cfbe" stroke-width="3"/><path d="M${sx + 3} ${y + 25}v24m0 -4h6m-6 -6h4.5m-4.5 -6h3" stroke="#d6cfbe" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${sx + 2} ${y + 26}v22" stroke="#fff" stroke-width=".7" opacity=".5"/></g>`}
    ${st === 'reserved' ? `<rect x="${sx - 9}" y="${y + 16}" width="24" height="15" fill="#e8dfc8" transform="rotate(-5 ${sx} ${y + 22})"/><text x="${sx + 3}" y="${y + 27}" text-anchor="middle" font-family="'General Sans',sans-serif" font-size="7" letter-spacing="1" fill="#a8321f" transform="rotate(-5 ${sx} ${y + 22})">HELD</text>`
     : `<path class="tag" d="M${sx - 17} ${y + 13}H${sx + 23}a4 4 0 0 1 4 4V${y + 30}a4 4 0 0 1 -4 4H${sx - 17}a4 4 0 0 1 -4 -4V${y + 17}a4 4 0 0 1 4 -4Z" fill="#b4472b"/><path d="M${sx - 17} ${y + 13}H${sx + 23}a4 4 0 0 1 4 4V${y + 30}a4 4 0 0 1 -4 4H${sx - 17}a4 4 0 0 1 -4 -4V${y + 17}a4 4 0 0 1 4 -4Z" fill="none" stroke="#6e2412" stroke-width="1"/><path d="M${sx - 18} ${y + 15.5}H${sx + 24}" stroke="#e58a68" stroke-width=".7" opacity=".6"/><circle cx="${sx + 3}" cy="${y + 16.5}" r="1.6" fill="#22140b"/>
      <text x="${sx - 15}" y="${y + 29}" font-family="'General Sans',sans-serif" font-weight="600" font-size="9.5" fill="#f6e6c8">${c}</text><text x="${sx + 23}" y="${y + 29}" text-anchor="end" font-family="'JetBrains Mono',monospace" font-weight="700" font-size="9" fill="#ffd9a0">${price(f).toFixed(1)}</text>`}
   </g></g>`; } }
 // the terms are on the board too: an engraved brass plate screwed to its foot, the way a lobby states its hours
 s += `<g transform="translate(40 606)"><rect x="3" y="4" width="340" height="66" rx="2" fill="#000" opacity=".5" filter="url(#ksh)"/><rect width="340" height="66" rx="2" fill="url(#kpl)"/><rect x=".8" y=".8" width="338.4" height="64.4" rx="2" fill="none" stroke="#fff3cf" stroke-width=".6" opacity=".5"/>
  ${[[9, 9], [331, 9], [9, 57], [331, 57]].map(([a, b], i) => `<circle cx="${a}" cy="${b}" r="3" fill="url(#kbr)" stroke="#3a2a0c" stroke-width=".5"/><path d="M${a - 2} ${b}h4" stroke="#3a2a0c" stroke-width=".8" transform="rotate(${[20, -40, 75, 5][i]} ${a} ${b})"/>`).join('')}
  <g font-family="'General Sans',sans-serif" font-weight="500" fill="#2e2108" text-anchor="middle" letter-spacing=".8"><text x="170" y="19" font-size="6.2">EACH TAG · HOME AND PRICE IN CRORE TAKA</text><text x="170" y="32" font-size="6.2">EVERY HOME 2,450 SQ FT · THREE BEDROOMS · HANDOVER DECEMBER 2027</text><text x="170" y="45" font-size="6.2">20% TO RESERVE · 60% ACROSS THE BUILD · 20% AT THE KEYS</text><text x="170" y="58" font-size="6.2">SHOW FLAT · FLOOR 2 EAST · ROAD 71, GULSHAN 2 · TEN TO SEVEN</text></g></g>
 <rect x="6" y="6" width="408" height="682" rx="5" fill="url(#kl)" style="mix-blend-mode:overlay" pointer-events="none"/><rect x="6" y="6" width="408" height="682" rx="5" fill="url(#kl)" opacity=".5" pointer-events="none"/>`;
 kb.innerHTML = s;
 const num = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];
 document.getElementById('kleft').textContent = num[OPEN.length] || OPEN.length;
 const kbEl = document.getElementById('kbands'); if (kbEl) kbEl.innerHTML = BANDS.map(([a, b, p]) => `<tr><td>${a} to ${b}</td><td>2,450 sq ft · 3 bed · 3.2 m balcony</td><td>৳ ${p} crore</td><td>${OPEN.filter(c => { const f = parseInt(c); return f >= a && f <= b; }).length} of ${(b - a + 1) * 2}</td></tr>`).join('');
 const tell = g => { const c = g.dataset.c, f = parseInt(c), side = c.endsWith('W') ? 'west' : 'east', st = state(c); kb.querySelectorAll('.kt').forEach(k => k.classList.toggle('pick', k === g));
  kr.textContent = `Floor ${f}, ${side}. 2,450 sq ft, three bedrooms, a 3.2 metre balcony on the lake. ${st === 'reserved' ? 'Reserved since last week; ask to be told if it comes back.' : '৳ ' + price(f) + ' crore, and the key is here.'}`; };
 kb.querySelectorAll('.kt').forEach(g => { g.addEventListener('click', () => tell(g)); g.addEventListener('mouseenter', () => tell(g)); g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); tell(g); } }); }); }
N.door(document.getElementById('door'));
const drvEl=document.getElementById('drv');addEventListener('scroll',()=>document.body.classList.toggle('past',scrollY>drvEl.offsetHeight-innerHeight*.5),{passive:true});
window.__nv = N;
