// dark-room-nav.js · Dark Room's chapter control: the accession tags. Anatomy from Nazar's read (review/nav/nazar-anatomy.md §4):
// acid-free card tied loosely with cotton tape, the number only, year.number in 2B pencil, no slash; it hangs, and swings once when its drawer opens.
// The strip lives in the letterbox bar and is dark like the room: the torch's own spot is the only light on it, and your hand aims it here too.
import {nav} from './lib/nav.js';
const N = nav({drv:'.walk'}), tags = document.getElementById('tags'), ol = tags.querySelector('ol'), line = tags.querySelector('.line'), say = document.getElementById('say');
const phone = matchMedia('(max-width:760px)'), reduce = N.reduce, n = N.list.length;

// a pencil hand: single strokes in a 10 by 14 box, never a typeface. Each numeral is drawn fresh, so no two 8s are the same
const G = {'0':'M5.2 1.1C2.2 1 1 4.6 1.1 7.6C1.2 10.9 2.6 13 5 13C7.6 13 8.9 10.6 8.9 7.2C8.9 3.8 7.7 1.2 5 1.3',
 '1':'M2.9 3.6C4 2.8 5 1.9 5.7 1L5.4 13', '2':'M1.6 4.1C1.9 1.8 3.6 1 5.2 1C7.2 1 8.5 2.3 8.3 4.2C8.1 6.8 4.2 9.2 1.2 12.9L9.2 12.7',
 '3':'M1.6 2.6C3.4 1 7.8 .6 8 3.6C8.2 5.9 5.4 6.6 3.9 6.8C6.8 6.6 9.1 8.2 8.8 10.5C8.4 13.4 3.2 13.8 1.2 11.7', '4':'M6.9 13.1L7 1L1.1 9.3L9.4 9.1',
 '5':'M8.4 1.2L2.4 1.4L1.9 6.4C4.3 5.2 8.5 5.5 8.8 8.9C9.1 12.6 4.1 14 1.4 11.9',
 '6':'M7.6 1.4C4.2 1.6 1.2 4.9 1.2 9.2C1.2 11.9 2.9 13.1 5 13C7.4 12.9 8.7 11.2 8.6 9.3C8.5 7.3 6.9 6.1 5.1 6.2C3.2 6.3 1.8 7.4 1.3 8.9',
 '7':'M1.2 1.7C3.5 1.3 6.6 1.2 9 1.3C7 5 5.4 8.8 4.3 13.1', '8':'M5.1 7C2 6.2 1.9 1.1 5 1.1C8.1 1.1 8.2 6 5.1 7C1.2 8 1.3 13 5 13C8.9 13 8.9 8 5.1 7',
 '9':'M8.5 5.2C8.3 2.6 6.9 1.1 5 1.1C2.8 1.1 1.4 2.8 1.5 4.9C1.6 6.9 3.3 7.9 5 7.8C7 7.7 8.4 6.5 8.5 5.2C8.7 8.6 8 11 6.8 13.1', '.':'M4.5 12.5l.4.4'};
let seed = 1881; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647, j = a => (rnd() - .5) * 2 * a;
const SG = .62;
const hand = s => { let x = 0; const gl = [...s].map(ch => { const w = ch === '.' ? 5 : 10, g = {ch, x:x + j(.35), y:j(.45), r:j(4), k:1 + j(.05)}; x += w + j(.4); return g; });
 const tot = x * SG, x0 = (56 - tot) / 2, sl = j(1.6) - .6;
 const one = cls => `<g transform="translate(${x0.toFixed(2)} 17.6) rotate(${sl.toFixed(2)} ${tot / 2} 4)">${gl.map(g => `<g transform="translate(${(g.x * SG).toFixed(2)} ${(g.y * SG).toFixed(2)}) scale(${(SG * g.k).toFixed(3)}) rotate(${g.r.toFixed(1)} 5 7)"><path d="${G[g.ch]}"/>${cls ? '' : `<path d="${G[g.ch]}" pathLength="1" stroke-dasharray=".2 2" stroke-width="1.95"/>`}</g>`).join('')}</g>`;
 return {graphite:one(0), sheen:one(1)}; };

// the card: clipped top corners, a reinforced eyelet, a foot that curls a little differently on each tag
const AMB = .72, LOOP = 'M25.7 6.2C23 1.5 24.3 -5.2 28 -5.6C31.7 -5.2 33 1.5 30.3 6.2';
const tagSVG = (a, k, lit) => { const c = 1.2 + rnd() * 1.6, sh = `M7 0H49L56 7V40Q28 ${(40 + c * 1.6).toFixed(1)} 0 ${(40 - c * .4).toFixed(1)}V7Z`, h = a ? hand(a) : null;
 return `<svg viewBox="0 0 56 42" aria-hidden="true"><defs>
  <linearGradient id="dr-f${k}" x1="0" y1="0" x2="0" y2="1"><stop offset=".74" stop-color="#2a2014" stop-opacity="0"/><stop offset="1" stop-color="#2a2014" stop-opacity=".26"/></linearGradient>
  <mask id="dr-m${k}" maskUnits="userSpaceOnUse" x="-20" y="-10" width="96" height="60"><rect class="band" x="18" y="-10" width="20" height="60" fill="url(#dr-band)"/></mask>
  ${lit ? '' : `<radialGradient id="dr-s${k}" class="gs" gradientUnits="userSpaceOnUse" cx="-400" cy="20" r="64"><stop offset="0" stop-opacity="0"/><stop offset=".3" stop-opacity=".06"/><stop offset=".4" stop-opacity="0"/><stop offset=".48" stop-opacity=".2"/><stop offset=".78" stop-opacity="${AMB}"/><stop offset="1" stop-opacity="${AMB}"/></radialGradient>
  <radialGradient id="dr-w${k}" class="gs" gradientUnits="userSpaceOnUse" cx="-400" cy="20" r="64"><stop offset="0" stop-color="#ffe2bd"/><stop offset=".6" stop-color="#f5c894"/><stop offset="1" stop-color="#fff"/></radialGradient>`}</defs>
  <path d="${sh}" fill="#e6dfcd"/><path d="${sh}" fill="#000" opacity=".55" filter="url(#dr-paper)"/><path d="${sh}" fill="url(#dr-f${k})"/>
  <path class="tl" d="${sh}" fill="url(#dr-tilt)" opacity="0"/><path d="${sh}" fill="none" stroke="#b3a88f" stroke-width=".55"/>
  <circle cx="28" cy="7" r="4.3" fill="#d4cab4"/><circle cx="28" cy="7" r="4.3" fill="none" stroke="#bdb198" stroke-width=".4"/><circle cx="28" cy="7" r="2" fill="#050505"/>
  ${h ? `<g class="pn" fill="none" stroke="#333332" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#dr-graph)">${h.graphite}</g>
  <g class="pn" fill="none" stroke="#c4c3bd" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" mask="url(#dr-m${k})" filter="url(#dr-graph)">${h.sheen}</g>` : ''}
  <path d="M25.7 6.2C23 1.5 24.3 -5.2 28 -5.6C31.7 -5.2 33 1.5 30.3 6.2" fill="none" stroke="#dcd3c0" stroke-width="2.3" stroke-linecap="round"/>
  <path d="M25.7 6.2C23 1.5 24.3 -5.2 28 -5.6" fill="none" stroke="#f1ebdf" stroke-width=".6" stroke-linecap="round" opacity=".7"/>
  <ellipse cx="28" cy="-5.4" rx="2.3" ry="1.5" fill="#cfc5b0"/>
  ${lit ? `<circle cx="28" cy="-6" r="1.7" fill="#7d6238"/><circle cx="27.5" cy="-6.5" r=".55" fill="#d9b77a"/>` : `<path d="${sh}" fill="url(#dr-w${k})" style="mix-blend-mode:multiply"/>
  <g fill="url(#dr-s${k})"><path d="${sh}"/><ellipse cx="28" cy="-5.4" rx="2.4" ry="1.6"/></g><path d="${LOOP}" fill="none" stroke="url(#dr-s${k})" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M.6 7.4L7.3 .5H48.7L55.4 7.4" fill="none" stroke="#eadcc0" stroke-width=".6" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/><path d="M25.7 6.2C23 1.5 24.3 -5.2 28 -5.6" fill="none" stroke="#eadcc0" stroke-width=".5" opacity=".4"/>`}</svg>`; };

// shared filters: graphite drags on the tooth of the card and breaks up; the card itself has a faint grain
document.body.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
 <filter id="dr-graph" x="-20%" y="-40%" width="140%" height="180%"><feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" seed="7" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1.7 1.5" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter>
 <filter id="dr-paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="2" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .3 0 0 0 0 .25 0 0 0 0 .18 0 0 0 .8 -.28" result="g"/><feComposite in="g" in2="SourceGraphic" operator="in"/></filter>
 <linearGradient id="dr-band" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
 <linearGradient id="dr-tilt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset=".7" stop-color="#000" stop-opacity="0"/></linearGradient></defs></svg>`);

// one tag per numbered chapter, plus a blank one for the visit: the only card in the room not yet numbered
const T = [];
N.list.forEach((c, i) => { if (c.a === undefined) return; const k = T.length;
 T.push({i, base:j(2.6), a:0, v:0, ph:rnd() * 6.28, w:1.1 + rnd() * .7});
 ol.insertAdjacentHTML('beforeend', `<li><button type="button" class="tg" data-i="${i}" aria-label="${c.n} · ${c.t}">${tagSVG(c.a, k)}</button></li>`); });
const btn = [...ol.querySelectorAll('.tg')];
T.forEach((t, k) => { t.el = btn[k]; t.tl = btn[k].querySelector('.tl'); t.band = btn[k].querySelector('.band'); t.gs = [...btn[k].querySelectorAll('.gs')]; t.a = t.base; });
ol.addEventListener('click', e => { const b = e.target.closest('.tg'); if (b) N.go(+b.dataset.i); });
// the index is the end of a card-catalogue drawer: dark oak, a brass frame holding a typed card, a brass cup pull below it.
// Only the room's own low light reaches it, catching the brass edges and the drawer's top; pull it and the drawer slides out a little.
const ixb = tags.querySelector('.ixb');
function drawer(){ const ph = matchMedia('(max-width:760px)').matches, w = ph ? 70 : 150, h = ph ? 42 : 88, f = v => v.toFixed(1);
 let s = `<svg viewBox="0 0 ${w} ${h}" aria-hidden="true"><defs><linearGradient id="dr-oak" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3220"/><stop offset=".12" stop-color="#342214"/><stop offset="1" stop-color="#1d130b"/></linearGradient>
  <linearGradient id="dr-br" x1="0" y1="0" x2=".2" y2="1"><stop offset="0" stop-color="#d9b56c"/><stop offset=".45" stop-color="#8d672c"/><stop offset=".7" stop-color="#5e4219"/><stop offset="1" stop-color="#b48d4a"/></linearGradient>
  <radialGradient id="dr-cup" cx=".5" cy=".1" r=".9"><stop offset="0" stop-color="#1a1208"/><stop offset=".7" stop-color="#3b2a12"/><stop offset="1" stop-color="#9c7a3c"/></radialGradient></defs>`;
 s += `<rect width="${w}" height="${h}" rx="1.5" fill="url(#dr-oak)"/>`;
 // the oak's grain, running the drawer's length, and the pale wear on its top edge where hands have pulled it for a century
 let sd = 5; const r = () => (sd = sd * 16807 % 2147483647) / 2147483647;
 for (let k = 0; k < (ph ? 7 : 14); k++){ const y = 3 + r() * (h - 6), a = 1 + r() * 2.4; s += `<path d="M0 ${f(y)} C${f(w * .3)} ${f(y - a)} ${f(w * .6)} ${f(y + a)} ${w} ${f(y + (r() - .5) * 2)}" fill="none" stroke="${k % 3 ? 'rgba(0,0,0,.28)' : 'rgba(255,214,160,.06)'}" stroke-width="${f(.5 + r() * .8)}"/>`; }
 s += `<rect width="${w}" height="1.4" fill="rgba(255,220,170,.22)"/><rect y="${h - 1.2}" width="${w}" height="1.2" fill="rgba(0,0,0,.6)"/>`;
 // the brass frame and its card; the card typed, a little off-square in its slot, the ribbon's ink uneven
 const fw = ph ? 50 : 96, fh = ph ? 20 : 34, fx = (w - fw) / 2, fy = ph ? 5 : 11;
 s += `<rect x="${f(fx)}" y="${f(fy)}" width="${fw}" height="${fh}" rx="1" fill="url(#dr-br)"/><rect x="${f(fx + 2.5)}" y="${f(fy + 3.5)}" width="${fw - 5}" height="${fh - 5}" fill="#e3d6b8"/>`;
 s += `<g transform="rotate(-1.2 ${f(w / 2)} ${f(fy + fh / 2)})"><text x="${f(w / 2)}" y="${f(fy + fh * (ph ? .72 : .6))}" text-anchor="middle" font-family="'Courier New',Courier,monospace" font-weight="700" font-size="${ph ? 9.5 : 15}" letter-spacing="${ph ? 1 : 2.4}" fill="#1f1b16" opacity=".86">INDEX</text>`;
 if (!ph) s += `<text x="${f(w / 2)}" y="${f(fy + fh * .88)}" text-anchor="middle" font-family="'Courier New',Courier,monospace" font-weight="700" font-size="8.5" letter-spacing="1.2" fill="#1f1b16" opacity=".62">WORLDS 1 - 15</text>`;
 s += `</g><path d="M${f(fx + 2.5)} ${f(fy + 3.5)}h${fw - 5}" stroke="rgba(0,0,0,.35)" stroke-width="1.2"/>`;
 for (const x of [fx - (ph ? 3 : 5), fx + fw + (ph ? 3 : 5)]){ const cy = fy + fh / 2, rr = ph ? 1.8 : 2.6; s += `<circle cx="${f(x)}" cy="${f(cy)}" r="${rr}" fill="url(#dr-br)" stroke="rgba(0,0,0,.5)" stroke-width=".5"/><path d="M${f(x - rr * .7)} ${f(cy + rr * .3)}L${f(x + rr * .7)} ${f(cy - rr * .3)}" stroke="rgba(30,20,8,.8)" stroke-width="${ph ? .5 : .7}"/>`; }
 // the cup pull: a brass half-moon, dark inside where fingers go, its lip worn bright
 if (!ph){ const cx = w / 2, cy = fy + fh + 16, cw = 30; s += `<path d="M${f(cx - cw / 2)} ${f(cy - 5)} Q${f(cx)} ${f(cy + 22)} ${f(cx + cw / 2)} ${f(cy - 5)} Z" fill="url(#dr-br)" stroke="rgba(0,0,0,.55)" stroke-width=".6"/><path d="M${f(cx - cw / 2 + 3)} ${f(cy - 3.5)} Q${f(cx)} ${f(cy + 15)} ${f(cx + cw / 2 - 3)} ${f(cy - 3.5)} Z" fill="url(#dr-cup)"/><path d="M${f(cx - cw / 2)} ${f(cy - 5)} H${f(cx + cw / 2)}" stroke="rgba(255,230,170,.7)" stroke-width="1"/>`;
  for (const x of [cx - cw / 2 - 3.5, cx + cw / 2 + 3.5]) s += `<circle cx="${f(x)}" cy="${f(cy - 4)}" r="2" fill="url(#dr-br)" stroke="rgba(0,0,0,.5)" stroke-width=".5"/>`; }
 // the room is dark: everything but the brass lip and the top edge sinks back
 s += `<rect width="${w}" height="${h}" fill="rgba(0,0,0,.32)"/><rect width="${w}" height="${f(h * .45)}" fill="rgba(255,200,140,.04)"/></svg>`;
 ixb.innerHTML = s; }
drawer(); addEventListener('resize', drawer);
ixb.setAttribute('aria-label', 'Open the index');
ixb.addEventListener('click', N.open);

// the tape: pinned at the left, sagging between ties, and the far end left long, hanging off its pin with a frayed tip
let ties = [], pinX = 0, sc = 1, SY = 36, SH = 46;
const lay = () => { const s = (btn[0]?.offsetWidth || 56) / 56, tb = tags.getBoundingClientRect(), cs = getComputedStyle(tags);
 sc = s; SY = parseFloat(cs.getPropertyValue('--sy')) || 36; SH = parseFloat(cs.getPropertyValue('--sh')) || 46;
 ties = T.map(t => { const r = t.el.parentElement.getBoundingClientRect(), top = r.top - tb.top + t.el.offsetTop; return [r.left - tb.left + 28 * s, top - 5.6 * s, r.left - tb.left + 28 * s, top]; });
 if (!ties.length) return; const y = ties[0][1], x0 = Math.max(6, ties[0][0] - 30 * s), xe = ties[ties.length - 1][0] + 30 * s; pinX = x0;
 let d = `M${x0} ${y - .6}`, px = x0;
 [...ties.map(t => t[0]), xe].forEach(x => { d += `Q${(px + x) / 2} ${y + 2.6 * s + (x - px) * .012} ${x} ${y}`; px = x; });
 const tail = `M${xe} ${y}C${xe + 3} ${y + 5} ${xe + 1} ${y + 11 * s} ${xe + 4} ${y + 17 * s}`;
 line.innerHTML = `<path d="${d}" fill="none" stroke="#d6cdb9" stroke-width="${2.4 * s}"/><path d="${d}" fill="none" stroke="#efe8da" stroke-width="${.6 * s}" transform="translate(0 -.7)" opacity=".7"/>
  <path d="${tail}" fill="none" stroke="#d6cdb9" stroke-width="${2.2 * s}" stroke-linecap="butt"/>
  <path d="M${xe + 4} ${y + 17 * s}l-1.2 2.6M${xe + 4} ${y + 17 * s}l.3 2.9M${xe + 4} ${y + 17 * s}l1.4 2.3" stroke="#cfc6b2" stroke-width=".5"/>
  ${[x0, xe].map(x => `<circle cx="${x}" cy="${y - .4}" r="${1.9 * s}" fill="#7d6238"/><circle cx="${x - .5}" cy="${y - 1}" r="${.6 * s}" fill="#d9b77a"/>`).join('')}`; };

// the spot: the same torch as the room, warm at its core with the faint ring of its reflector; it rests on the current tag, follows your hand here
let cur = 0, spot = -200, target = -200, spotW = 64, hover = null, quiet = 0, first = true;
const tagOf = i => T.findIndex(t => t.i === i);
const aimAt = () => { const k = hover !== null ? hover : tagOf(cur); target = k >= 0 && ties[k] ? ties[k][2] : (cur >= n - 1 ? (ties.at(-1)?.[2] || 0) + 120 * sc : pinX + 4);
 spotW = (k >= 0 ? 64 : 40) * sc; };
tags.addEventListener('pointermove', e => { if (phone.matches || e.pointerType === 'touch') return; const x = e.clientX - tags.getBoundingClientRect().left;
 let best = null, bd = 60 * sc; ties.forEach((t, k) => { const d = Math.abs(t[2] - x); if (d < bd){ bd = d; best = k; } }); hover = best; aimAt(); if (best === null){ target = x; } });
tags.addEventListener('pointerleave', () => { hover = null; aimAt(); });
ol.addEventListener('focusin', e => { const b = e.target.closest('.tg'); if (b){ hover = btn.indexOf(b); aimAt(); } });
ol.addEventListener('focusout', () => { hover = null; aimAt(); });

N.on((i, c) => { cur = i; const k = tagOf(i);
 btn.forEach((b, m) => b.toggleAttribute('aria-current', m === k)); document.body.classList.toggle('at-door', i === n - 1); aimAt();
 // its drawer opens: the found tag swings once and settles, and the tape nudges the tags beside it
 if (!reduce && k >= 0 && !first){ T[k].v += (rnd() > .5 ? 1 : -1) * 44; [k - 1, k + 1].forEach(m => { if (T[m]) T[m].v += j(9); }); }
 if (first){ first = false; spot = target; return; }
 clearTimeout(quiet); if (k < 0){ say.classList.remove('on'); return; }
 say.textContent = c.a ? `${c.n} · ${c.t}` : c.t; say.classList.add('on'); quiet = setTimeout(() => say.classList.remove('on'), 2200); });

let last = performance.now();
const frame = now => { requestAnimationFrame(frame); if (document.body.classList.contains('at-door')) return;
 const dt = Math.min(.05, (now - last) / 1000), t = now / 1000; last = now;
 spot = reduce ? target : spot + (target - spot) * Math.min(1, dt * 7);
 tags.style.setProperty('--sx', spot.toFixed(1) + 'px'); tags.style.setProperty('--sw', spotW.toFixed(0) + 'px');
 T.forEach((g, k) => { const rest = g.base + (reduce ? 0 : .35 * Math.sin(t * g.w + g.ph));
  if (!reduce){ g.v += (-31 * (g.a - rest) - 1.3 * g.v) * dt; g.a += g.v * dt; } else g.a = rest;
  g.el.style.setProperty('--rot', g.a.toFixed(2) + 'deg');
  // a card turning under a torch: the side turned away from the beam darkens
  const tilt = g.a - g.base; g.tl.setAttribute('opacity', Math.min(.6, Math.abs(tilt) * .06).toFixed(3));
  g.tl.setAttribute('transform', tilt > 0 ? 'translate(56 0) scale(-1 1)' : '');
  // the graphite glints where the beam rakes it, and the glint runs against the light
  if (g.band && ties[k]) g.band.setAttribute('x', (18 - Math.max(-34, Math.min(34, (spot - ties[k][2]) * .45 / sc))).toFixed(1));
  // the card is lit where the torch actually is: the same beam as the rail, in the card's own units, never darker than the room's own light
  if (ties[k]){ const u = ((spot - ties[k][2]) / sc + 28).toFixed(2), v = ((SY - ties[k][3]) / sc).toFixed(2), r = (spotW / sc).toFixed(2), tf = `translate(${u} ${v}) scale(1 ${(SH / spotW).toFixed(3)}) translate(${-u} ${-v})`;
   g.gs.forEach(G => { G.setAttribute('cx', u); G.setAttribute('cy', v); G.setAttribute('r', r); G.setAttribute('gradientTransform', tf); }); } }); };

const relay = () => { lay(); aimAt(); spot = target; };
addEventListener('resize', relay); phone.addEventListener('change', relay);
document.fonts.ready.then(relay); relay(); requestAnimationFrame(frame);

// the visit is read by torch: the beam follows your hand across the wall; hold still for two seconds and the torch is put down
const visit = document.getElementById('visit'), parts = [...visit.children]; let still;
const beam = (x, y) => { const v = visit.getBoundingClientRect(); visit.style.setProperty('--vx', (x - v.left) + 'px'); visit.style.setProperty('--vy', (y - v.top) + 'px');
 parts.forEach(el => { const r = el.getBoundingClientRect(); el.style.setProperty('--mx', (x - r.left) + 'px'); el.style.setProperty('--my', (y - r.top) + 'px'); }); };
const rest = ms => { clearTimeout(still); still = setTimeout(() => visit.classList.add('wide'), ms); };
visit.addEventListener('pointermove', e => { beam(e.clientX, e.clientY); visit.classList.remove('wide'); rest(2000); });
visit.addEventListener('pointerleave', () => visit.classList.add('wide'));
visit.addEventListener('focusin', () => visit.classList.add('wide'));
N.on((i, c) => { if (c.el !== '#visit' || visit.classList.contains('wide')) return; const h = visit.querySelector('h2').getBoundingClientRect(); beam(h.left + h.width * .3, h.top + h.height * .35); rest(2600); });

document.documentElement.style.setProperty('--door-fg', N.next[5]);
const door = document.getElementById('door');
N.door(door, {verb:'Pull the next tag'});
const no = +(door.querySelector('.door-k')?.textContent.match(/\d+/)?.[0] || 0);
door.insertAdjacentHTML('afterbegin', `<a class="dtag" href="${N.next[0]}.html" tabindex="-1" aria-hidden="true">${tagSVG('1881.' + no, 'd', 1)}</a>`);
window.__nv = N;
