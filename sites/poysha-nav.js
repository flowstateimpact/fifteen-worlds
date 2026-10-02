// poysha-nav.js · Poysha's chapter control: five-taka coins stacked on a shop counter, and the shopkeeper's pencil tally beside them.
// Anatomy from Nazar's read (review/nav/nazar-anatomy.md §8; Wikipedia, "Bangladeshi 5 Taka Coin"): twelve-sided, plain edge, stainless steel,
// satin grey and never gold, 2 mm thick on 27 mm. Steel slides, so the stack leans and no coin lines its corners up with the one below; the
// corners show staggered up the side. One coin lands per chapter with a wobble that dies away; the lamp is overhead, so the shadow falls straight down.
// The instrument counts chapters, never money: the taka saved while you read belongs to the jar and the ledger, and only there.
import {nav} from './lib/nav.js';
const N = nav(), stk = document.getElementById('stk'), ol = stk.querySelector('ol'), chit = stk.querySelector('.ixb'), rtot = document.getElementById('rtot'), sum = document.getElementById('sum'), n = N.list.length;
const phone = matchMedia('(max-width:760px)');
let seed = 1993; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647, j = a => (rnd() - .5) * 2 * a;
const DM = 136, Q = .34, TH = DM * 2 / 27, VW = DM + 16, VH = DM * Q + TH + 10, cx = VW / 2, cy = DM * Q / 2 + 4, r = DM / 2;
const mixc = (a, b, t) => '#' + a.map((v, k) => Math.round(v + (b[k] - v) * t).toString(16).padStart(2, '0')).join('');
const DARK = [62, 66, 71], LITE = [196, 199, 203];
const coin = (k, top) => { const ph = k * 0.47 + j(.2), V = [...Array(12)].map((_, m) => { const a = ph + m * Math.PI / 6; return [cx + r * Math.cos(a), cy + r * Q * Math.sin(a), a]; });
 const pt = p => p[0].toFixed(1) + ',' + p[1].toFixed(1);
 // the flats of the edge that face you, each lit by its own angle to the lamp and the room: that is where the twelve corners read
 let edge = '';
 for (let m = 0; m < 12; m++){ const a = V[m], b = V[(m + 1) % 12], mid = ph + (m + .5) * Math.PI / 6; if (Math.sin(mid) <= -.02) continue;
  const lit = .5 + .42 * Math.cos(mid - 2.3) + .08 * Math.sin(mid); edge += `<path d="M${pt(a)}L${pt(b)}L${b[0].toFixed(1)},${(b[1] + TH).toFixed(1)}L${a[0].toFixed(1)},${(a[1] + TH).toFixed(1)}Z" fill="${mixc(DARK, LITE, Math.max(0, Math.min(1, lit)))}"/>`;
  edge += `<path d="M${a[0].toFixed(1)},${(a[1] + .3).toFixed(1)}V${(a[1] + TH - .3).toFixed(1)}" stroke="rgba(255,255,255,${(.25 + .4 * Math.max(0, Math.cos(mid - 2.3))).toFixed(2)})" stroke-width=".7"/>`; }
 const face = V.map(pt).join(' ');
 return `<svg viewBox="0 0 ${VW.toFixed(1)} ${VH.toFixed(1)}" aria-hidden="true"><defs>
  <linearGradient id="py-f${k}" x1="0" y1="0" x2="1" y2=".6"><stop offset="0" stop-color="#aeb2b6"/><stop offset=".34" stop-color="#8d9196"/><stop offset=".55" stop-color="#c2c5c9"/><stop offset=".7" stop-color="#9a9ea3"/><stop offset="1" stop-color="#777b80"/></linearGradient></defs>
  <g class="hitp">${edge}<polygon points="${face}" fill="url(#py-f${k})"/></g>
  <polygon points="${face}" fill="none" stroke="rgba(70,74,78,.55)" stroke-width=".6"/>
  <polygon points="${face}" filter="url(#py-scuff)" opacity=".32" fill="#000"/><polygon points="${face}" filter="url(#py-dull)" opacity=".4" fill="#000"/>
  ${top ? `<g class="emb"><ellipse cx="${cx}" cy="${cy}" rx="${r * .74}" ry="${r * .74 * Q}" fill="none" stroke="rgba(255,255,255,.4)" stroke-width=".8"/><ellipse cx="${cx}" cy="${cy + .6}" rx="${r * .74}" ry="${r * .74 * Q}" fill="none" stroke="rgba(60,64,68,.35)" stroke-width=".8"/>
   <text x="${cx}" y="${cy + 5}" text-anchor="middle" transform="translate(0 ${cy}) scale(1 ${Q * 1.7}) translate(0 ${-cy})" class="nm">৫</text></g>
   <path class="spk" d="M${V[3][0].toFixed(1)},${(V[3][1] - 3.4).toFixed(1)}l.7 2.7 2.7 .7-2.7 .7-.7 2.7-.7-2.7-2.7-.7 2.7-.7z" fill="#fff"/>` : ''}</svg>`; };
document.body.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
 <filter id="py-scuff" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="2.2 .35" numOctaves="2" seed="12"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1.5 -1"/><feComposite in2="SourceGraphic" operator="in"/></filter>
 <filter id="py-dull" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".06 .09" numOctaves="3" seed="21"/><feColorMatrix values="0 0 0 0 .18 0 0 0 0 .19 0 0 0 0 .2 0 0 0 1.3 -.5"/><feComposite in2="SourceGraphic" operator="in"/></filter>
 <filter id="py-graph" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="3" result="n"/><feColorMatrix in="n" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1.6 1.45" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter></defs></svg>`);

// each coin a millimetre off the one below, the stack drifting as steel does
let lean = 0;
ol.innerHTML = N.list.map((c, k) => { lean += 1.1 + j(1.4); return `<li style="--k:${k};--mx:${lean.toFixed(1)}px"><button type="button" data-i="${k}" aria-label="${c.n} · ${c.t}">${coin(k, true)}</button></li>`; }).join('');
const btn = [...ol.querySelectorAll('button')];
ol.addEventListener('click', e => { const b = e.target.closest('button'); if (b) N.go(+b.dataset.i); });
chit.addEventListener('click', N.open);

// the tally: four strokes and a fifth struck through them, in pencil on a torn slip, one stroke for each coin on the stack
const strokes = [...Array(n)].map((_, m) => { const g5 = Math.floor(m / 5), p = m % 5, x0 = 14 + g5 * 34;
 return p < 4 ? `M${(x0 + p * 6.4 + j(.8)).toFixed(1)} ${(21 + j(1.2)).toFixed(1)}l${j(1.4).toFixed(1)} ${(21 + j(1.6)).toFixed(1)}` : `M${(x0 - 4 + j(1)).toFixed(1)} ${(36 + j(1)).toFixed(1)}L${(x0 + 24 + j(1)).toFixed(1)} ${(26 + j(1.4)).toFixed(1)}`; });
chit.innerHTML = `<svg viewBox="0 0 96 62" aria-hidden="true"><path d="M2 5l6-2.2 5 1.6 7-2 6 1.8 8-1.6 5 1.2 7-2.1 6 1.9 7-1.5 6 1.7 8-2 5 1.4 8-1.1 4 .9V58L91 59.5 70 58.6 49 60 27 58.8 5 60 2 59Z" fill="#efe7d3"/><path d="M4 13H93" stroke="rgba(120,140,170,.35)" stroke-width=".6"/><path d="M4 47H93" stroke="rgba(120,140,170,.25)" stroke-width=".6"/><path d="M16 4V60" stroke="rgba(190,90,90,.25)" stroke-width=".6"/>
 <g fill="none" stroke="#3b3a37" stroke-width="1.7" stroke-linecap="round" filter="url(#py-graph)">${strokes.map((d, m) => `<path class="ty" data-m="${m}" d="${d}" pathLength="1"/>`).join('')}</g></svg><span class="sr">Open the index</span>`;
const ty = [...chit.querySelectorAll('.ty')];
const lab = document.createElement('span'); lab.className = 'lab'; stk.appendChild(lab);
document.body.style.setProperty('--dfg', N.next[5]);

// the coin's name speaks for two seconds as it lands, then the stack rests; below the jar the page says it, so the stack stays quiet there
let first = true, quiet = 0, had = -1;
N.on((i, c) => { btn.forEach((b, k) => { b.classList.toggle('in', k <= i); b.classList.toggle('on', k === i); b.toggleAttribute('aria-current', k === i); });
 // only the top coin shows its face: the rest are covered by the coin that landed on them
 ol.querySelectorAll('li').forEach((li, k) => li.classList.toggle('top', k === i));
 ty.forEach((p, m) => { p.classList.toggle('in', m <= i); p.classList.toggle('new', m === i && i > had && !first); }); had = i;
 lab.textContent = `${c.n} · ${c.t}`; document.body.classList.toggle('at-door', i === n - 1);
 if (first){ first = false; return; } clearTimeout(quiet); if (c.el){ stk.classList.remove('say'); return; } stk.classList.add('say'); quiet = setTimeout(() => stk.classList.remove('say'), 2200); });
// the scene writes "Saved while you were reading: N taka" into #sum; the ledger's total reads that number and nothing else does
const read = () => { const m = sum.textContent.match(/(\d[\d,]*)/); if (m && rtot) rtot.textContent = '৳ ' + m[1]; };
new MutationObserver(read).observe(sum, {childList:true, characterData:true, subtree:true}); read();
N.door(document.getElementById('door'), {verb:'Drop a coin'});
