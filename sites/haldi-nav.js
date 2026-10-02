// haldi-nav.js · the dropper that comes with the bottle, drawn from Nazar's read of real serum droppers (review/nav/nazar-anatomy.md §2;
// optimizingpack.com/glass-packaging-dropper-sourcing): a matte nitrile bulb with its mould seam, a ribbed collar that screws to the neck,
// a straight glass pipette open at the foot, printed in ink at .25, .5, .75 and 1 ml. The oil rises with the page and rests on a line at each
// chapter; its top is a concave meniscus, darker where the column is thicker, and it leaves a film on the glass where it has been.
// Arriving somewhere new, a drop gathers at the tip and falls. Squeeze the bulb for the index.
// It lies on the page in the hero's light (haldi-scene.js: key 20° up from the upper right), so it throws its shadow lower left,
// longest under the bulb and collar, touching at the tip; the oil focuses a warm line into its own shadow, as the bottle does.
import {nav} from './lib/nav.js';
const N = nav({drv:null}), pip = document.getElementById('pip'), n = N.list.length, reduce = N.reduce;
document.body.style.setProperty('--dfg', N.next[5]);
const VX = -64, VY = -4, VW = 86, VH = 350, NECK = 70, TAPER = 278, TIP = 300;
const Y = [296, 268, 212, 156, 100], ML = ['', '.25', '.5', '.75', '1ml'];
const SD = [-.906, .423], K = 1 / Math.tan(20 * Math.PI / 180), off = h => [SD[0] * K * h, SD[1] * K * h];
const hAt = y => 17 - 14.4 * (y - NECK) / (TIP - NECK);
const o1 = off(17), o2 = off(2.6), ob = off(15), f1 = v => v.toFixed(1);
const BULB = 'M-12 50C-13 40-15.5 30-15.5 18C-15.5 6-9 0 0 0S15.5 6 15.5 18C15.5 30 13 40 12 50Z';
const OUT = `M-6.5 ${NECK}V${TAPER}L-2.6 ${TIP}H2.6L6.5 ${TAPER}V${NECK}`, IN = `M-5 ${NECK}V${TAPER}L-1.2 ${TIP}H1.2L5 ${TAPER}V${NECK}Z`;
const ribs = [...Array(16)].map((_, k) => `M${-15 + k * 2} 53.4V67`).join('');
pip.innerHTML = `<svg viewBox="${VX} ${VY} ${VW} ${VH}" aria-hidden="true"><defs>
 <radialGradient id="hd-bulb" cx=".64" cy=".3" r=".78"><stop offset="0" stop-color="#4d301a"/><stop offset=".42" stop-color="#2e1a0c"/><stop offset="1" stop-color="#140a03"/></radialGradient>
 <linearGradient id="hd-col" x1="-17" x2="17" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4a3b20"/><stop offset=".2" stop-color="#8c7447"/><stop offset=".56" stop-color="#b59b64"/><stop offset=".71" stop-color="#dcc591"/><stop offset=".83" stop-color="#a38a58"/><stop offset="1" stop-color="#54442a"/></linearGradient>
 <linearGradient id="hd-oil" x1="-5" x2="5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f0b247"/><stop offset=".2" stop-color="#ffd988"/><stop offset=".32" stop-color="#e39822"/><stop offset=".6" stop-color="#ad5a08"/><stop offset=".86" stop-color="#c7720c"/><stop offset="1" stop-color="#eeae45"/></linearGradient>
 <clipPath id="hd-in"><path d="${IN}"/></clipPath><clipPath id="hd-bc"><path d="${BULB}"/></clipPath>
 <filter id="hd-soft" x="-50%" y="-20%" width="200%" height="140%"><feGaussianBlur stdDeviation="1.7"/></filter><filter id="hd-far" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.4"/></filter>
 <filter id="hd-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 .92 0 0 0 0 .82 0 0 0 .5 -.18"/></filter></defs>
 <g class="shd"><g filter="url(#hd-far)"><path d="${BULB}" transform="translate(${f1(ob[0])} ${f1(ob[1])})"/><rect x="-17" y="50" width="34" height="20" rx="2" transform="translate(${f1(o1[0])} ${f1(o1[1])})"/></g><g filter="url(#hd-soft)">
  <path d="M${f1(-6.5 + o1[0])} ${f1(NECK + o1[1])}L${f1(6.5 + o1[0])} ${f1(NECK + o1[1])}L${f1(2.6 + o2[0])} ${f1(TIP + o2[1])}L${f1(-2.6 + o2[0])} ${f1(TIP + o2[1])}Z"/></g></g>
 <path class="cau" d=""/>
 <g class="tube"><path d="${OUT}Z" class="gl"/><g clip-path="url(#hd-in)"><path class="film" d=""/><path class="oil" d="" fill="url(#hd-oil)"/><path class="men" d=""/></g>
  <path d="M-6.5 ${NECK}V${TAPER}L-2.6 ${TIP}H-1.2L-5 ${TAPER}V${NECK}ZM6.5 ${NECK}V${TAPER}L2.6 ${TIP}H1.2L5 ${TAPER}V${NECK}Z" class="band"/><path d="${OUT}" class="wall"/><path d="M-2.6 ${TIP}H2.6" class="foot"/>
  <g class="ink">${Y.slice(1).map((y, k) => `<path d="M-6.5 ${y}H${k % 2 ? -.8 : -3}"/><text x="${k % 2 ? .2 : -2}" y="${y + 1.7}">${ML[k + 1]}</text>`).join('')}</g>
  <path d="M3.7 ${NECK + 5}V${TAPER - 6}M3.1 ${TAPER + 3}L1.9 ${TIP - 5}" class="spec"/><path d="M-3.9 ${NECK + 12}V${TAPER - 30}" class="spec2"/></g>
 <g class="drop"><path d="M0 0C1.7 2.4 2.9 4.3 2.9 6.2A2.9 2.9 0 0 1-2.9 6.2C-2.9 4.3-1.7 2.4 0 0Z" transform="translate(0 ${TIP})" fill="url(#hd-oil)" stroke="rgba(96,42,0,.5)" stroke-width=".45"/><circle cx="1" cy="${TIP + 5}" r=".7" fill="#fff" opacity=".85"/></g>
 <g class="blb"><rect x="-17" y="50" width="34" height="20" rx="1.6" fill="url(#hd-col)"/><path d="${ribs}" class="rib"/><rect x="-17" y="50" width="34" height="2.2" rx="1" class="bev"/><rect x="-17.4" y="67.2" width="34.8" height="2.8" rx="1" class="lip"/>
  <g class="sq"><path d="${BULB}" fill="url(#hd-bulb)"/><rect x="-16" y="0" width="32" height="50" filter="url(#hd-grain)" clip-path="url(#hd-bc)" opacity=".22"/>
  <path d="M-9.4 3.6C-12.6 14-13.2 32-10.3 48.6" class="seam"/><path d="M-11.6 44.5C-5 46.6 5 46.6 11.6 44.5" class="crease"/><path d="M3 .6C10 1.5 15.5 7 15.5 18C15.5 30 13.2 40 12.2 49" class="rim"/></g></g></svg>
 <button type="button" class="bulb" aria-label="Squeeze the bulb for the index"></button><ol class="grad"></ol>`;
const $ = s => pip.querySelector(s), oil = $('.oil'), men = $('.men'), film = $('.film'), cau = $('.cau'), grad = $('.grad'), bulb = $('.bulb');
grad.innerHTML = N.list.map((c, k) => `<li style="top:${f1((Y[k] - VY) / VH * 100)}%"><button type="button" data-i="${k}" aria-label="${c.t}"><em>${c.n ? c.n + ' · ' : ''}${c.t}</em></button></li>`).join('');
grad.addEventListener('click', e => { const b = e.target.closest('button'); if (b) N.go(+b.dataset.i); });
bulb.addEventListener('pointerdown', () => pip.classList.add('squeeze')); ['pointerup', 'pointerleave', 'blur'].forEach(t => bulb.addEventListener(t, () => pip.classList.remove('squeeze')));
bulb.addEventListener('click', N.open);
let first = true, quiet = 0;
N.on(i => { grad.querySelectorAll('button').forEach((b, k) => { b.classList.toggle('on', k === i); b.toggleAttribute('aria-current', k === i); });
 document.body.classList.toggle('at-door', i === n - 1); document.body.classList.toggle('below', i > 0);
 // the label keeps quiet on the serum page, whose own heading already says its name
 if (first){ first = false; return; } clearTimeout(quiet); if (N.list[i].el === '#serum') pip.classList.remove('say'); else { pip.classList.add('say'); quiet = setTimeout(() => pip.classList.remove('say'), 2200); }
 if (!reduce){ pip.classList.remove('drip'); void pip.offsetWidth; pip.classList.add('drip'); } });

// the level: exactly on a printed line when a chapter sits at the top of the window, between lines while you travel
let tops = [], cur = Y[0], want = Y[0], hi = Y[0], raf = 0;
const measure = () => { const max = document.documentElement.scrollHeight - innerHeight; tops = N.list.map(c => Math.min(max, document.querySelector(c.el).getBoundingClientRect().top + scrollY)); };
const target = () => { const y = scrollY; let k = 0; while (k < n - 2 && y >= tops[k + 1]) k++;
 const f = tops[k + 1] > tops[k] ? Math.min(1, Math.max(0, (y - tops[k]) / (tops[k + 1] - tops[k]))) : 1; return Y[k] + (Y[k + 1] - Y[k]) * f; };
const draw = y => { hi = Math.min(hi, y);
 oil.setAttribute('d', `M-5.4 ${f1(y - 1.8)}Q0 ${f1(y + 2.4)} 5.4 ${f1(y - 1.8)}L5.4 ${TIP + 3}L-5.4 ${TIP + 3}Z`);
 men.setAttribute('d', `M-5.4 ${f1(y - 1.8)}Q0 ${f1(y + 2.4)} 5.4 ${f1(y - 1.8)}`);
 film.setAttribute('d', hi < y - 3 ? `M-4.5 ${f1(hi)}V${f1(y - 2)}M4.5 ${f1(hi)}V${f1(y - 2)}` : '');
 const a = off(hAt(TIP - 4)), b = off(hAt(Math.max(NECK, y + 3)));
 cau.setAttribute('d', y < TIP - 6 ? `M${f1(a[0] - .6)} ${f1(TIP - 4 + a[1])}L${f1(b[0] - .6)} ${f1(y + 3 + b[1])}` : ''); };
const step = () => { raf = 0; cur += (want - cur) * (reduce ? 1 : .16); draw(cur); if (Math.abs(want - cur) > .05) raf = requestAnimationFrame(step); };
window.__hd = () => ({want, cur, tops});
const kick = () => { want = target(); if (!raf) raf = requestAnimationFrame(step); };
addEventListener('scroll', kick, {passive:true}); addEventListener('resize', () => { measure(); kick(); });
measure(); addEventListener('load', () => { measure(); kick(); }); want = cur = target(); draw(cur);
N.door(document.getElementById('door'), {verb:'Squeeze the dropper'});
