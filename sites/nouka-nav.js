// nouka-nav.js · Nouka's chapter control: the ghat at Sadarghat, drawn in perspective from the launch's deck. Anatomy from Nazar's read
// (review/nav/nazar-anatomy.md §6): a run of steps the whole length of the bank, never a staircase; low risers, deep treads; a stone-faced
// embankment with a brick top; Dhaka brick red going to black-brown with soot and moss; a green-black algae band at the usual tide, wider
// than the day's swing. The old bank has settled along its length, so the level river crosses the treads at a slant and three states show
// at once: dry, wet and under. Each chapter the river climbs one step, and the wash leaves a dark wet band above the line.
import {nav} from './lib/nav.js';
const N = nav(), g = document.getElementById('ghat'), svg = g.querySelector('svg'), sr = g.querySelector('.keys'), ixb = g.querySelector('.ixb'), n = N.list.length, reduce = N.reduce;
const T = 12, R = .15, D = .46, Y0 = -.96, LOW = 2, K = .0105, X0 = 4.2, XF = 90, LAND = 2.4, PARA = .8, EYE = 1.7, LF = 20;
const lvl = i => -.6 + i * R + .06, WASH = .75 * R, ALG = [-.36, -.2];
let W, H, F, cx, cy, Zf, Zp, S = [];
const f1 = v => v.toFixed(1), P = (X, Y, Z) => `${f1(cx + F * Z / X)},${f1(cy - F * (Y - EYE) / X)}`;
const sub = X => -K * (X - X0), cut = (c, v) => X0 + (c - v) / K;
const ns = 'http://www.w3.org/2000/svg', el = (tag, at) => { const e = document.createElementNS(ns, tag); for (const k in at) e.setAttribute(k, at[k]); return e; };

// the part of one surface between two heights, over the whole length of the bank; exact, because every edge is a straight line
const pieces = (s, a, b) => { if (s.k === 't'){ const l = Math.max(X0, cut(s.c, b)), r = Math.min(XF, cut(s.c, a)); return r > l ? [[l, r]] : []; }
 const br = [X0, XF, cut(s.lo, a), cut(s.lo, b), cut(s.hi, a), cut(s.hi, b)].filter(x => x >= X0 && x <= XF).sort((p, q) => p - q), out = [];
 for (let i = 0; i < br.length - 1; i++){ const l = br[i], r = br[i + 1], m = (l + r) / 2; if (r - l > 1e-4 && Math.min(s.hi + sub(m), b) > Math.max(s.lo + sub(m), a)) out.push([l, r]); } return out; };
const quad = (s, a, b, l, r) => s.k === 't'
 ? `M${P(l, s.c + sub(l), s.z1)}L${P(r, s.c + sub(r), s.z1)}L${P(r, s.c + sub(r), s.z2)}L${P(l, s.c + sub(l), s.z2)}Z`
 : `M${P(l, Math.max(s.lo + sub(l), a), s.z)}L${P(r, Math.max(s.lo + sub(r), a), s.z)}L${P(r, Math.min(s.hi + sub(r), b), s.z)}L${P(l, Math.min(s.hi + sub(l), b), s.z)}Z`;
const band = (list, a, b) => list.map(s => pieces(s, a, b).map(([l, r]) => quad(s, a, b, l, r)).join('')).join('');

let L = {}, wy = lvl(0), want = wy, raf = 0;
const lay = () => { W = innerWidth; H = innerHeight; const tall = H > W;
 cx = W * (tall ? .74 : .5); cy = H * .47; F = W * (tall ? 1.1 : .8); Zf = (tall ? -2.2 : -3.6) + LOW * D; Zp = Zf - T * D - LAND;
 svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
 S = []; for (let t = T - 1; t >= 0; t--){ S.push({k:'t', t, z1:Zf - t * D, z2:Zf - (t + 1) * D, c:Y0 + (t + 1) * R}); S.push({k:'r', t, z:Zf - t * D, lo:Y0 + t * R, hi:Y0 + (t + 1) * R}); }
 const top = Y0 + T * R, land = {k:'t', t:T, z1:Zf - T * D, z2:Zp, c:top}, wall = {k:'r', t:T, z:Zp, lo:top, hi:top + PARA}, cope = {k:'t', t:T + 1, z1:Zp, z2:Zp - .34, c:top + PARA};
 const all = [cope, wall, land, ...S], dim = (t, a, b) => a.map((v, k) => Math.round(v + (b[k] - v) * (1 - t / T)));
 const colT = t => `rgb(${dim(Math.min(t, T), [168, 112, 88], [104, 56, 44])})`, colR = t => `rgb(${dim(Math.min(t, T), [112, 60, 46], [68, 35, 27])})`;
 // brick: two courses to a riser in stretcher bond, joints every 23 cm, drawn only where the eye can still separate them
 let joints = '', nose = '', lip = '';
 [...S.filter(s => s.k === 'r'), wall].forEach(s => { const h = s.hi - s.lo, co = Math.round(h / .075);
  for (let c = 1; c < co; c++){ const y = s.lo + c * h / co; joints += `M${P(X0, y + sub(X0), s.z)}L${P(34, y + sub(34), s.z)}`; }
  for (let c = 0; c < co; c++) for (let X = X0 + (c % 2) * .115; X < 22; X += .23){ const y1 = s.lo + c * h / co, y2 = y1 + h / co; joints += `M${P(X, y1 + sub(X), s.z)}L${P(X, y2 + sub(X), s.z)}`; } });
 [...S.filter(s => s.k === 't'), land].forEach(s => { nose += `M${P(X0, s.c + sub(X0), s.z1)}L${P(XF, s.c + sub(XF), s.z1)}`; lip += `M${P(X0, s.c - .014 + sub(X0), s.z1)}L${P(XF, s.c - .014 + sub(XF), s.z1)}`; for (let X = X0 + .2; X < 15; X += .23 * (1 + (X - X0) / 6)) joints += `M${P(X, s.c + sub(X), s.z1)}L${P(X, s.c + sub(X), s.z2)}`; });
 const r0 = F * 6 / X0, fs = [[0, 1], [.04, .99], [.08, .91], [.15, .7], [.25, .47], [.5, .19], [1, 0]];
 const sil = `M${P(X0, Y0 + sub(X0) - .1, Zf)}L${P(XF, Y0 + sub(XF) - .1, Zf)}L${P(XF, top + PARA + sub(XF), Zp - .34)}L${P(X0, top + PARA + sub(X0), Zp - .34)}Z`;
 svg.innerHTML = `<defs><radialGradient id="nk-fog" gradientUnits="userSpaceOnUse" cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r0)}">${fs.map(([o, a]) => `<stop offset="${o}" style="stop-color:var(--fogc,#dbcfb3)" stop-opacity="${a}"/>`).join('')}</radialGradient>
  <clipPath id="nk-sil"><path d="${sil}"/></clipPath>
  <filter id="nk-soft" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="5"/></filter>
  <mask id="nk-deep" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><g filter="url(#nk-soft)"><path class="mk1" fill="#fff"/><path class="mk2" fill="#5a5a5a"/></g></mask>
  <filter id="nk-dust" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".9 .5" numOctaves="3" seed="4"/><feColorMatrix values="0 0 0 0 .95 0 0 0 0 .86 0 0 0 0 .72 0 0 0 1.4 -.72"/></filter>
  <filter id="nk-soot" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".04 .22" numOctaves="3" seed="9"/><feColorMatrix values="0 0 0 0 .08 0 0 0 0 .06 0 0 0 0 .05 0 0 0 1.6 -.62"/></filter></defs>
  <g mask="url(#nk-deep)"><g clip-path="url(#nk-sil)">
   ${all.map(s => `<path d="${quad(s, -9, 9, X0, XF)}" fill="${s === cope ? '#b7a58a' : s === wall ? '#8f7f6b' : s.k === 't' ? colT(s.t) : colR(s.t)}"/>`).join('')}
   <path d="${all.filter(s => s.k === 't').map(s => quad(s, -9, 9, X0, XF)).join('')}" filter="url(#nk-dust)" opacity=".55"/>
   <path d="${all.filter(s => s !== cope).map(s => quad(s, -9, 9, X0, XF)).join('')}" filter="url(#nk-soot)" opacity=".7"/>
   <path d="${joints}" fill="none" stroke="rgba(38,20,14,.5)" stroke-width=".7"/><path d="${lip}" fill="none" stroke="rgba(30,14,9,.55)" stroke-width="1.6"/><path d="${nose}" fill="none" stroke="rgba(214,168,140,.55)" stroke-width="1.1"/>
   <path class="alg" fill="#1c2a19" opacity=".84"/><path class="alg2" fill="#2d3a1f" opacity=".5"/>
   <path class="wetr" fill="#34190f" opacity=".7"/><path class="wett" fill="#4b2a20" opacity=".82"/><path class="shn" fill="none" stroke="rgba(232,228,212,.5)" stroke-width="1"/>
   <path class="wat2" fill="#6f7667" opacity=".7"/><path class="wat" fill="#4c5746" opacity=".64"/><path class="wln" fill="none" stroke="#efe9d6" stroke-width="1.4" opacity=".8"/><path class="rip" fill="none" stroke="#efe9d6" stroke-width=".8" opacity=".35"/>
   <rect x="0" y="0" width="${W}" height="${H}" fill="url(#nk-fog)"/></g></g>
  <g class="hits">${N.list.map((c, i) => { const t = S.find(s => s.k === 't' && s.t === i + LOW), r = S.find(s => s.k === 'r' && s.t === i + LOW); return t ? `<path class="hit" data-i="${i}" d="${quad(t, -9, 9, X0, 30)}${quad(r, -9, 9, X0, 30)}"/>` : ''; }).join('')}</g>`;
 L = {alg:svg.querySelector('.alg'), alg2:svg.querySelector('.alg2'), wetr:svg.querySelector('.wetr'), wett:svg.querySelector('.wett'), shn:svg.querySelector('.shn'), wat:svg.querySelector('.wat'), wat2:svg.querySelector('.wat2'), mk1:svg.querySelector('.mk1'), mk2:svg.querySelector('.mk2'), wln:svg.querySelector('.wln'), rip:svg.querySelector('.rip'), all};
 // the fare board leans on the embankment wall, and the chapter's name speaks from the fog above the top step
 const bx = 22, bs = P(bx, top + sub(bx), Zp + .2).split(',').map(Number); g.style.setProperty('--bx', bs[0] + 'px'); g.style.setProperty('--by', bs[1] + 'px');
 const xe = -F * Zp / cx, ly = cy - F * (top + PARA + sub(xe) - EYE) / xe; g.style.setProperty('--ly', f1(Math.max(90, ly - 64)) + 'px');
 // on the painted wall and at the door the ghat drops until only its top steps show along the foot of the page
 g.style.setProperty('--drop', f1(Math.max(0, H - ly - (tall ? 132 : 152))) + 'px');
 draw(wy); };
const draw = y => { if (!L.all) return; const all = L.all, tr = all.filter(s => s.k === 't'), rs = all.filter(s => s.k === 'r');
 L.alg.setAttribute('d', band(all, ALG[0], ALG[1])); L.alg2.setAttribute('d', band(all, ALG[1], ALG[1] + .05));
 const wt = y + WASH; L.wetr.setAttribute('d', band(rs, y, wt)); L.wett.setAttribute('d', band(tr, y, wt));
 L.shn.setAttribute('d', tr.map(s => pieces(s, y, wt).map(([l, r]) => `M${P(l, s.c + sub(l), s.z1)}L${P(r, s.c + sub(r), s.z1)}`).join('')).join(''));
 // the river takes the steps as it deepens: dark and see-through at the line, then gone into the river itself, so the foot is only guessed from the slope
 L.wat.setAttribute('d', band(all, y - .08, y)); L.wat2.setAttribute('d', band(all, y - .3, y - .08));
 L.mk1.setAttribute('d', band(all, y - .07, 9)); L.mk2.setAttribute('d', band(all, y - .26, y - .07));
 let wl = '', rp = '';
 rs.forEach(s => { const l = Math.max(X0, cut(s.lo, y)), r = Math.min(XF, cut(s.hi, y)); if (r > l){ wl += `M${P(l, y, s.z)}L${P(r, y, s.z)}`; rp += `M${P(l + .4, y - .025, s.z)}L${P(Math.min(r, l + 3.4), y - .025, s.z)}`; } });
 tr.forEach(s => { const x = cut(s.c, y); if (x > X0 && x < XF) wl += `M${P(x, y, s.z1)}L${P(x, y, s.z2)}`; });
 L.wln.setAttribute('d', wl); L.rip.setAttribute('d', rp); };
const step = () => { raf = 0; wy += (want - wy) * (reduce ? 1 : .09); draw(wy); if (Math.abs(want - wy) > .0005) raf = requestAnimationFrame(step); };

sr.innerHTML = N.list.map((c, k) => `<li><button type="button" data-i="${k}">${c.t}</button></li>`).join('');
const lab = document.createElement('span'); lab.className = 'lab'; g.appendChild(lab);
g.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) N.go(+b.dataset.i); });
ixb.addEventListener('click', N.open);
document.body.style.setProperty('--dfg', N.next[5]); document.body.style.setProperty('--dbg', N.next[4]);
// the chapter name speaks for two seconds on the river, then the ghat rests; it never speaks over the painted wall or the door, where the page already says it
let first = true, quiet = 0;
N.on((i, c) => { want = lvl(i); if (!raf) raf = requestAnimationFrame(step);
 sr.querySelectorAll('button').forEach((b, k) => b.toggleAttribute('aria-current', k === i)); lab.textContent = c.t;
 const wall = !!c.el; document.body.classList.toggle('on-wall', wall && i < n - 1); document.body.classList.toggle('at-door', i === n - 1);
 if (first){ first = false; wy = want; draw(wy); return; } clearTimeout(quiet); if (wall){ g.classList.remove('say'); return; } g.classList.add('say'); quiet = setTimeout(() => g.classList.remove('say'), 2200); });
// the ghat waits until the opening line has gone, so it never sits on it
const subEl = document.getElementById('sub'), gone = () => !subEl || +getComputedStyle(subEl).opacity < .05;
const up = () => { const past = N.progress() > .1, on = (past && gone()) || scrollY > innerHeight * 6; g.classList.toggle('up', on); if (past && !on) setTimeout(up, 200); };
addEventListener('scroll', () => requestAnimationFrame(up), {passive:true}); addEventListener('resize', lay);
lay(); up(); window.__gh = settle => { if (settle){ wy = want; draw(wy); } return {wy, want}; };
N.door(document.getElementById('door'), {verb:'Cast off'});
