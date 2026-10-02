// badabon-nav.js · the tide staff, drawn from Nazar's read (review/nav/nazar-anatomy.md §3; openchannelflow.com staff-level gauges):
// an enamelled plate, black on yellow, reading UP from the foot in feet with the unit at the head, every foot numbered, tenths as bars;
// chipped where the iron shows, rust bleeding down. It is lashed with jute to a culm of Bambusa balcooa: grey-green, matte, a pale ring
// above each node, internodes lengthening up the culm, the cut top showing the thick wall. The staff does not move; the water does.
// One violet waterline with short ripples; below it the face is dark and scummed and the staff's own reflection wavers; a scum mark stays
// at the highest water reached. The hero's light is dusk from behind and left (badabon-scene.js), so the left edges carry a warm rim.
import {nav} from './lib/nav.js';
const N = nav({drv:'.tide'}), staff = document.getElementById('staff'), n = N.list.length, drv = document.getElementById('tide'), reduce = N.reduce;
window.__nv = N;
document.body.style.setProperty('--dfg', N.next[5]);
const U = 25, Y0 = 380, y = ft => Y0 - ft * U, L = [0, 2, 5, 8, 10, 12, 14];
const VX = -40, VY = -52, VW = 88, VH = 484, f1 = v => (+v).toFixed(1);
const NODES = [382, 340, 293, 241, 183, 119, 49, -22];
const cx = 20, R = 10;
let bars = '', nums = '';
for (let ft = 0; ft < 14; ft++){ for (let t = 0; t < 10; t += 2) bars += `M1 ${f1(y(ft + (t + 1) / 10))}h${t === 4 ? 12.5 : 11}v2.5h-${t === 4 ? 12.5 : 11}z`; }
for (let ft = 0; ft <= 14; ft++) nums += `<text x="-5.6" y="${f1(y(ft) - 2.2)}" text-anchor="middle">${ft}</text>`;
const node = yy => `<path d="M${cx - R - .6} ${yy}h${2 * R + 1.2}" class="nd"/><rect x="${cx - R}" y="${yy - 4.4}" width="${2 * R}" height="4.4" fill="url(#bd-ring)"/><path d="${[...Array(7)].map((_, k) => `M${cx - R + 2 + k * 2.7} ${yy + .8}l.3 2.1`).join('')}" class="hair"/>`;
const lash = (yy, tail) => `<g class="lash"><rect x="-17" y="${yy}" width="${cx + R + 18}" height="9" rx="2.5" fill="url(#bd-jute)"/><path d="${[...Array(12)].map((_, k) => `M${-16 + k * 4} ${yy + .5}l3 8`).join('')}" class="twist"/>${tail ? `<path d="M${cx + R} ${yy + 6}c3 3 4 9 2.6 15" class="tail"/>` : ''}</g>`;
const chips = [[7.6, 148, 1], [-11.2, 262, 1.4], [9.4, 316, .9], [-3, 44, .8]].map(([x, yy, s]) => `<g transform="translate(${x} ${yy}) scale(${s})"><path d="M-1.8 -1.2L.4 -2 2.1 -.6 1.6 1.5 -.9 1.8 -2.2 .4Z" class="chip"/><path d="M-.6 1.6C-.8 5-.2 9 .2 13" class="rust"/></g>`).join('');
staff.innerHTML = `<svg viewBox="${VX} ${VY} ${VW} ${VH}" aria-hidden="true"><defs>
 <linearGradient id="bd-culm" x1="${cx - R}" x2="${cx + R}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#5f6a47"/><stop offset=".22" stop-color="#7d8c5e"/><stop offset=".5" stop-color="#8a9a6a"/><stop offset=".64" stop-color="#a1ad80"/><stop offset=".8" stop-color="#7a8759"/><stop offset="1" stop-color="#4d573a"/></linearGradient>
 <linearGradient id="bd-ring" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#eeeee0" stop-opacity=".7"/><stop offset="1" stop-color="#eeeee0" stop-opacity="0"/></linearGradient>
 <linearGradient id="bd-plate" x1="-15" x2="13" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#c99c14"/><stop offset=".18" stop-color="#e6bf2a"/><stop offset=".6" stop-color="#e1b822"/><stop offset=".86" stop-color="#d4a918"/><stop offset="1" stop-color="#b08a10"/></linearGradient>
 <linearGradient id="bd-culmuw" x1="${cx - R}" x2="${cx + R}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0b0a17" stop-opacity=".92"/><stop offset=".24" stop-color="#1d1b30" stop-opacity=".84"/><stop offset=".52" stop-color="#28263c" stop-opacity=".8"/><stop offset=".66" stop-color="#33314a" stop-opacity=".78"/><stop offset=".82" stop-color="#1a182c" stop-opacity=".86"/><stop offset="1" stop-color="#08070f" stop-opacity=".94"/></linearGradient>
 <linearGradient id="bd-mud" x1="0" y1="392" x2="0" y2="412" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0a0908" stop-opacity=".2"/><stop offset=".35" stop-color="#0a0907" stop-opacity=".92"/><stop offset="1" stop-color="#050607"/></linearGradient>
 <linearGradient id="bd-jute" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b79a62"/><stop offset=".5" stop-color="#9a7e4c"/><stop offset="1" stop-color="#5e4a2a"/></linearGradient>
 <filter id="bd-fibre" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="1.1 .018" numOctaves="2" seed="5"/><feColorMatrix values="0 0 0 0 .2 0 0 0 0 .22 0 0 0 0 .12 0 0 0 .9 -.3"/></filter>
 <filter id="bd-scum" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".09 .16" numOctaves="3" seed="8"/><feColorMatrix values="0 0 0 0 .09 0 0 0 0 .12 0 0 0 0 .05 0 0 0 1.8 -.55"/></filter>
 <filter id="bd-wob" x="-10%" y="0" width="120%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".02 .22" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="5" xChannelSelector="R" yChannelSelector="G"/></filter>
 <clipPath id="bd-cc"><rect x="${cx - R}" y="-60" width="${2 * R}" height="500"/></clipPath>
 <clipPath id="bd-below"><rect class="cb" x="-60" y="${Y0}" width="140" height="700"/></clipPath>
 <linearGradient id="bd-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
 <mask id="bd-refl" maskUnits="userSpaceOnUse" x="-60" y="-60" width="140" height="560"><rect class="cr" x="-60" y="${Y0}" width="140" height="34" fill="url(#bd-fade)"/></mask></defs>
 <g id="bd-staff">
  <g><rect x="${cx - R}" y="-44" width="${2 * R}" height="446" fill="url(#bd-culm)"/><rect x="${cx - R}" y="-44" width="${2 * R}" height="446" filter="url(#bd-fibre)" clip-path="url(#bd-cc)" opacity=".5"/>
   ${NODES.map(node).join('')}<path d="M${cx - R} -44L${cx + R} -49V-44Z" fill="#5a4a2e"/><ellipse cx="${cx}" cy="-46.4" rx="${R}" ry="2.9" transform="rotate(-14 ${cx} -46.4)" class="cut"/><ellipse cx="${cx}" cy="-46.4" rx="${R * .38}" ry="1.2" transform="rotate(-14 ${cx} -46.4)" class="hole"/>
   <path d="M${cx - R + .4} -42V400" class="rimw"/></g>
  <g class="plate"><rect x="-15" y="4" width="28" height="398" rx="1.6" fill="url(#bd-plate)"/><path d="M-15 4v398" class="rimw"/>
   <text x="-1" y="21" text-anchor="middle" class="ft">FT</text><path d="${bars}" class="bar"/><g class="num">${nums}</g>${chips}
   <circle cx="-11" cy="9" r="1.1" class="bolt"/><circle cx="9" cy="9" r="1.1" class="bolt"/><circle cx="-11" cy="397" r="1.1" class="bolt"/><circle cx="9" cy="397" r="1.1" class="bolt"/></g>
  ${lash(34, false)}${lash(206, true)}${lash(352, false)}</g>
 <g clip-path="url(#bd-below)"><rect x="-15" y="4" width="28" height="398" rx="1.6" class="uw"/><rect x="${cx - R}" y="-44" width="${2 * R}" height="446" fill="url(#bd-culmuw)"/><rect x="-15" y="4" width="28" height="398" filter="url(#bd-scum)" opacity=".9"/><rect x="${cx - R}" y="-44" width="${2 * R}" height="446" filter="url(#bd-scum)" opacity=".45"/></g>
 <path d="M-20 394.5c5-2.2 9-.6 14-1.6s8 1.1 13 .2 9-1.4 14 .3 7-.8 11 .4V412H-20Z" fill="url(#bd-mud)"/>
 <g mask="url(#bd-refl)"><use href="#bd-staff" class="refl" transform="translate(0 ${2 * Y0}) scale(1 -1)" filter="url(#bd-wob)"/></g>
 <path class="mark" d=""/>
 <g class="wline" transform="translate(0 ${Y0})"><rect x="-17" y="-5" width="${cx + R + 19}" height="5" class="wet"/><path d="M-17 -.8H${cx + R + 2}" class="men"/>
  <path d="M-19 .2Q7 4.2 ${cx + R + 3} .2" class="ring"/><g class="rip"><path d="M-29 .6q3-1.4 7 0M-38 1.3q2-.9 5 0M${cx + R + 6} .8q3-1.3 7 0M${cx + R + 17} 1.5q2.2-.9 5 0"/></g></g></svg>
 <button type="button" class="knot" aria-label="Open the index"></button><ol class="marks"></ol>`;
const $ = s => staff.querySelector(s), marks = $('.marks'), wline = $('.wline'), cb = $('.cb'), cr = $('.cr'), refl = $('.refl'), mark = $('.mark');
marks.innerHTML = N.list.map((c, k) => `<li style="top:${f1((y(L[k]) - VY) / VH * 100)}%"><button type="button" data-i="${k}" aria-label="${c.t}"><em>${c.n ? c.n + ' · ' : ''}${c.t}</em></button></li>`).join('');
marks.addEventListener('click', e => { const b = e.target.closest('button'); if (b) N.go(+b.dataset.i); });
$('.knot').addEventListener('click', N.open);
let first = true, quiet = 0;
N.on(i => { marks.querySelectorAll('button').forEach((b, k) => { b.classList.toggle('on', k === i); b.toggleAttribute('aria-current', k === i); });
 document.body.classList.toggle('at-door', i === n - 1); document.body.classList.toggle('in-table', N.list[i].el === '#table'); document.body.classList.toggle('in-rooms', N.list[i].el === '#rooms');
 if (first){ first = false; return; } staff.classList.add('say'); clearTimeout(quiet); quiet = setTimeout(() => staff.classList.remove('say'), 2200); });
const top = i => { const c = N.list[Math.min(n - 1, i)]; return c.el ? Math.min(document.documentElement.scrollHeight - innerHeight, document.querySelector(c.el).getBoundingClientRect().top + scrollY) : c.at * (drv.offsetHeight - innerHeight); };
const target = () => { let i = 0; while (i < n - 1 && scrollY >= top(i + 1) - 1) i++; const a = top(i), b = top(i + 1), f = i < n - 1 && b > a ? Math.min(1, Math.max(0, (scrollY - a) / (b - a))) : 0;
 const k = Math.min(n - 1, i), ft = L[k] + (L[Math.min(n - 1, k + 1)] - L[k]) * f; return y(ft); };
let cur = y(0), want = cur, hi = cur, raf = 0;
const draw = wy => { hi = Math.min(hi, wy); wline.setAttribute('transform', `translate(0 ${f1(wy)})`); cb.setAttribute('y', f1(wy)); cr.setAttribute('y', f1(wy));
 refl.setAttribute('transform', `translate(0 ${f1(2 * wy)}) scale(1 -1)`);
 mark.setAttribute('d', hi < wy - 4 ? `M-15 ${f1(hi - 1)}C-6 ${f1(hi - .2)} 4 ${f1(hi - 1.8)} 13 ${f1(hi - .8)}M${cx - R} ${f1(hi - .6)}C${cx - 3} ${f1(hi - 1.6)} ${cx + 4} ${f1(hi)} ${cx + R} ${f1(hi - .9)}` : ''); };
const step = () => { raf = 0; cur += (want - cur) * (reduce ? 1 : .12); draw(cur); if (Math.abs(want - cur) > .05) raf = requestAnimationFrame(step); };
const kick = () => { want = target(); if (!raf) raf = requestAnimationFrame(step); };
addEventListener('scroll', kick, {passive:true}); addEventListener('resize', kick); window.__bd = settle => { if (settle){ want = target(); cur = want; draw(cur); } return {want, cur, hi}; };
want = cur = target(); draw(cur);
N.door(document.getElementById('door'), {verb:'Wait for the ebb'});
