// gate-weave-nav.js · Gate Weave's chapter control: a length of the 35mm release print, pulled out of its can across the seats
// (Nazar's anatomy, section 10; Sprocket School on cues; SMPTE 301 and the universal leader).
// Drawn to the millimetre: 35 mm wide, 4 perforations to a 19 mm frame, KS perfs; on the sound side the digital blocks between
// the perfs, the timecode dashes and the cyan dye analogue track; the picture lies ACROSS the film, so held flat it reads on its side.
// Three frames per film, a tape splice between reels (the tape punched through at the perfs, the reel number in grease pencil),
// a ring cue on each reel's last frame, top right of the picture. After the last film: black tail leader. The door is the next
// reel's head leader, the SMPTE countdown in seconds, 8 down to 2, never 10 to 0. The can's paper label opens the index.
import {nav} from './lib/nav.js';
import {hand, rng} from './lib/hand.js';

const N = nav({drv:'main'}), n = N.list.length, reduce = N.reduce;
N.on(i => document.body.classList.toggle('at-door', i === n - 1));
N.on(i => document.body.classList.toggle('at-papers', i === n - 2));
N.door(document.getElementById('door'), {verb:'Thread the next reel'});
window.__nv = N;

const FILMS = ['gateweave-roofs', 'gw-loom', 'gw-kitchen', 'gw-bus', 'gw-launch', 'gw-char'];
const FW = 35, FP = 19, PP = 4.75, PL = 2.794, PH = 1.98, PIC = [8.6, 29.6], PH2 = 15.2;   // film width, frame pitch, perf pitch, perf size, picture band, picture height along the film
const LEAD = 10, TAIL = 3, CD = 7, NF = LEAD + FILMS.length * 3 + TAIL + CD + 12, LEN = NF * FP;
const centre = k => k < FILMS.length ? LEAD + 3 * k + 1 : k === FILMS.length ? LEAD + 18 + 1 : LEAD + 18 + TAIL;   // film, tail, head leader "8"
const r = rng(41), f2 = v => (+v).toFixed(2);

function strip(){
 let holes = '', srd = '', dts = '', pics = '', lines = '', tape = '', dust = '', lead = '';
 for (let x = .98; x < LEN; x += PP){
  holes += `<rect x="${f2(x)}" y="2.01" width="${PL}" height="${PH}" rx=".52"/><rect x="${f2(x)}" y="${f2(FW - 2.01 - PH)}" width="${PL}" height="${PH}" rx=".52"/>`;
  srd += `<rect x="${f2(x + PL + .28)}" y="2.2" width="1.4" height="1.6" fill="url(#srd)"/>`; }
 for (let x = 0; x < LEN;){ const w = .25 + r() * .9; dts += `<rect x="${f2(x)}" y="4.35" width="${f2(w)}" height=".42"/>`; x += w + .2 + r() * .5; }
 // the analogue track: two channels of variable area, clear cyan on black, mirrored about each channel's centre
 const track = c0 => { let top = '', bot = '', a = .3, v = 0;
  for (let x = 0; x <= LEN; x += .3){ v += (r() - .5) * .5; v *= .9; a = Math.max(.08, Math.min(.58, .32 + v + Math.sin(x * 1.9) * .08 * (r() + .4)));
   top += (x ? 'L' : 'M') + f2(x) + ' ' + f2(c0 - a); bot = 'L' + f2(x) + ' ' + f2(c0 + a) + bot; }
  return top + bot.replace(/^L/, 'L') + 'Z'; };
 const at = k => LEAD + 3 * k;
 FILMS.forEach((f, k) => { for (let j = 0; j < 3; j++){ const x0 = (at(k) + j) * FP + (FP - PH2) / 2, g = .82 + r() * .16;
  pics += `<g transform="translate(${f2(x0)} ${PIC[1]}) rotate(-90)" opacity="${f2(g)}"><image href="../img/${f}.webp" x="0" y="0" width="21" height="${f2(PH2)}" preserveAspectRatio="xMidYMid slice"/></g>`;
  if (j === 2){ const cx = x0 + .12 * PH2, cy = PIC[0] + .08 * 21;   // the changeover cue: top right of the picture, which lies at the upper left when the print is flat
   pics += `<circle cx="${f2(cx)}" cy="${f2(cy)}" r=".62" fill="none" stroke="#fffaf0" stroke-width=".2" opacity=".85" filter="url(#soft)"/>`; } } });
 // head leader out of the can, and the tail after the last film: opaque black, grease pencil on it
 const gp = (s, x, y, size, seed) => { const h = hand(s, {size, slant:-8, seed}); return `<g transform="translate(${f2(x)} ${f2(y)}) rotate(-90)" fill="none" stroke="#f4eee2" stroke-width=".32" stroke-linecap="round" stroke-linejoin="round" opacity=".82">${h.svg}</g>`; };
 lead += gp('HEAD 1', (LEAD - 1.6) * FP, 26, 3.2, 5) + gp('GW', (LEAD - 2.5) * FP, 22, 3.4, 9) + gp('PICTURE START', (LEAD - 5.2) * FP, 30, 2.6, 17);
 const t0 = (LEAD + 18) * FP; lead += gp('TAIL 6', t0 + 1.3 * FP, 27, 3.2, 12) + gp('END', t0 + 2.3 * FP, 24, 3.4, 15);
 // the next reel's head leader: SMPTE universal, one frame per second, counting 8 to 2, the arm sweeping clockwise from twelve
 const c0 = LEAD + 18 + TAIL;
 for (let s = 0; s < CD; s++){ const num = 8 - s, x0 = (c0 + s) * FP + (FP - PH2) / 2, cx = x0 + PH2 / 2, cy = (PIC[0] + PIC[1]) / 2, R1 = 4.6, R2 = 3.8, sw = .12 + s * .11;
  const ang = sw * 6.283, ax = cx - Math.cos(ang) * R1 * 1.6, ay = cy - Math.sin(ang) * R1 * 1.6, big = sw > .5 ? 1 : 0;
  lead += `<g class="cdf"><rect x="${f2(x0)}" y="${PIC[0]}" width="${f2(PH2)}" height="21" fill="#8d8a84"/>
   <path d="M${f2(cx)} ${f2(cy)}L${f2(cx - R1 * 1.6)} ${f2(cy)}A${f2(R1 * 1.6)} ${f2(R1 * 1.6)} 0 ${big} 1 ${f2(ax)} ${f2(ay)}Z" fill="#5b5955" clip-path="url(#cf${s})"/>
   <clipPath id="cf${s}"><rect x="${f2(x0)}" y="${PIC[0]}" width="${f2(PH2)}" height="21"/></clipPath>
   <circle cx="${f2(cx)}" cy="${f2(cy)}" r="${R1}" fill="none" stroke="#f2efe8" stroke-width=".28"/><circle cx="${f2(cx)}" cy="${f2(cy)}" r="${R2}" fill="none" stroke="#1b1a18" stroke-width=".22"/>
   <path d="M${f2(x0)} ${f2(cy)}H${f2(x0 + PH2)}M${f2(cx)} ${PIC[0]}V${PIC[1]}" stroke="#1b1a18" stroke-width=".16"/>
   <text x="0" y="0" transform="translate(${f2(cx + 1.9)} ${f2(cy)}) rotate(-90)" text-anchor="middle" font-size="5.6" font-family="'Clash Display',sans-serif" font-weight="600" fill="#141311">${num}</text></g>`; }
 // a tape splice at every reel join: clear tape across the frame line, punched through at the perfs, the next reel's number on it
 const joins = FILMS.map((_, k) => at(k) * FP).slice(1).concat([(LEAD + 18) * FP, c0 * FP]);
 joins.forEach((x, j) => { const w = FP * .42 + r() * 1.5;
  tape += `<rect x="${f2(x - w / 2)}" y=".25" width="${f2(w)}" height="34.5" fill="#efe6cc" opacity=".11" mask="url(#perfm)"/><path d="M${f2(x - w / 2)} .25V34.75M${f2(x + w / 2)} .25V34.75" stroke="#fff6de" stroke-width=".12" opacity=".45"/>`
   + (j < 5 ? gp('R' + (j + 2), x - 1.2, 30.4, 2.4, 20 + j) : ''); });
 for (let d = 0; d < 90; d++) dust += `<circle cx="${f2(r() * LEN)}" cy="${f2(PIC[0] + r() * 21)}" r="${f2(.05 + r() * .12)}" fill="#fff" opacity="${f2(.25 + r() * .5)}"/>`;
 for (let s = 0; s < 7; s++){ const y = PIC[0] + 1 + r() * 19, x = r() * LEN * .8; lines += `<path d="M${f2(x)} ${f2(y)}H${f2(x + 30 + r() * 110)}" stroke="#f3efe6" stroke-width="${f2(.04 + r() * .05)}" opacity="${f2(.18 + r() * .25)}"/>`; }
 const frameLines = Array.from({length:NF + 1}, (_, k) => `<path d="M${f2(k * FP)} ${PIC[0]}V${PIC[1]}" stroke="#000" stroke-width=".35"/>`).join('');
 return `<defs>
  <pattern id="srd" width="1.4" height="1.6" patternUnits="userSpaceOnUse">${Array.from({length:56}, (_, q) => `<rect x="${f2((q % 7) * .2)}" y="${f2(Math.floor(q / 7) * .2)}" width=".2" height=".2" fill="${r() < .5 ? '#6fd4dc' : '#0d1a1c'}" opacity=".75"/>`).join('')}</pattern>
  <mask id="perfm" maskUnits="userSpaceOnUse" x="0" y="0" width="${f2(LEN)}" height="${FW}"><rect width="${f2(LEN)}" height="${FW}" fill="#fff"/><g fill="#000">${holes}</g></mask>
  <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation=".12"/></filter>
  <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="3.2" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 .96  0 0 0 0 .9  0 0 0 .045 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd6a0" stop-opacity=".55"/><stop offset=".06" stop-color="#ffd6a0" stop-opacity="0"/></linearGradient>
 </defs>
 <g mask="url(#perfm)">
  <rect width="${f2(LEN)}" height="${FW}" fill="#0a0908"/>
  <rect y="0" width="${f2(LEN)}" height="1.2" fill="#2a3032" opacity=".7"/><rect y="${FW - 1.2}" width="${f2(LEN)}" height="1.2" fill="#2a3032" opacity=".7"/>
  <g fill="#8fe3ea" opacity=".55">${dts}</g>${srd}
  <path d="${track(5.95)}" fill="#6fcfda" opacity=".42"/><path d="${track(7.35)}" fill="#6fcfda" opacity=".42"/>
  ${pics}${frameLines}${lead}${lines}${dust}
  <rect width="${f2(LEN)}" height="${FW}" fill="#000" filter="url(#grain)"/>
  <rect width="${f2(LEN)}" height="${FW}" fill="url(#rim)"/>
 </g>${tape}`; }

// ---- the object on the page
const box = document.createElement('nav'); box.className = 'reel'; box.id = 'reel'; box.setAttribute('aria-label', 'Chapters');
const canLab = hand('INDEX', {size:10.5, slant:-4, seed:33}), canN = hand('1-15', {size:8.5, slant:-3, seed:8});
box.innerHTML = `<div class="lamp" aria-hidden="true"></div><div class="track"><svg class="film" aria-hidden="true" viewBox="0 0 ${f2(LEN)} ${FW}" preserveAspectRatio="none"><filter id="mb" x="-5%" y="0" width="110%" height="100%"><feGaussianBlur id="mbg" stdDeviation="0 0"/></filter><g filter="url(#mb)">${strip()}</g></svg>${
 N.list.map((c, k) => `<button type="button" class="fr" data-k="${k}" aria-label="${c.t}"></button>`).join('')}</div>
 <button type="button" class="can" aria-label="Open the index"><svg viewBox="-60 -60 120 120" aria-hidden="true">
  <defs><radialGradient id="cn" cx=".38" cy=".3" r=".9"><stop offset="0" stop-color="#b9b6ae"/><stop offset=".55" stop-color="#6f6c66"/><stop offset="1" stop-color="#2d2b28"/></radialGradient></defs>
  <ellipse cx="4" cy="7" rx="54" ry="52" fill="rgba(0,0,0,.55)" filter="blur(4px)"/>
  <circle r="55" fill="url(#cn)"/><circle r="51.5" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="1"/><circle r="47" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="2.4"/>
  <circle r="44" fill="#141210"/><circle r="44" fill="none" stroke="#050404" stroke-width="3"/>${Array.from({length:14}, (_, q) => `<circle r="${43 - q * 1.6}" fill="none" stroke="rgba(255,240,220,${q % 3 ? .035 : .07})" stroke-width=".5"/>`).join('')}
  <circle r="19" fill="#24211d"/><circle r="6" fill="#0b0a09"/><rect x="-2.5" y="-9" width="5" height="4" fill="#0b0a09"/>
  <path d="M-44 -26 L18 -35 L22 -7 L-40 1 Z" fill="#e9e1cc"/><path d="M-44 -26 L18 -35 L22 -7 L-40 1 Z" fill="none" stroke="rgba(120,100,70,.4)" stroke-width=".6"/><path d="M-44 -26 L18 -35 L22 -7 L-40 1 Z" fill="none" stroke="rgba(180,40,30,.35)" stroke-width="1.4" stroke-dasharray="0 6 50 200"/>
  <g transform="translate(-36 -15) rotate(-8)" fill="none" stroke="#2c2620" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${canLab.svg}</g>
  <g transform="translate(-33 -3) rotate(-8)" fill="none" stroke="#2c2620" stroke-width="1.2" stroke-linecap="round" opacity=".85">${canN.svg}</g>
  <path d="M20 40 Q34 34 44 22" stroke="rgba(255,255,255,.2)" stroke-width="1.4" fill="none"/></svg></button>`;
document.body.appendChild(box);
const track = box.querySelector('.track'), film = box.querySelector('.film'), mbg = box.querySelector('#mbg'), frs = [...box.querySelectorAll('.fr')];
box.addEventListener('click', e => { const b = e.target.closest('.fr'); if (b) N.go(+b.dataset.k); else if (e.target.closest('.can')) N.open(); });

// ---- size: the strip fills the band between the caption and the hint; everything below is in millimetres times px per mm
let ppm = 3.77, H = 132;
const cap = document.getElementById('cap'), hint = document.getElementById('hint');
function size(){ const cb = cap.getBoundingClientRect().bottom, ht = hint.getBoundingClientRect().top, ph = innerWidth < 760;
 const top = N.index >= n - 2 ? (ph ? 96 : 70) : (cb > 40 ? cb : innerHeight * .64) + (ph ? 12 : 22); H = Math.max(84, Math.min(ph ? 104 : 132, (ht > top ? ht : innerHeight - 90) - top - (ph ? 8 : 14))); ppm = H / FW;
 box.style.top = Math.round(top - 14) + 'px'; box.style.height = Math.round(H + 28) + 'px'; track.style.height = H + 'px'; box.style.setProperty('--canw', Math.round(H * (ph ? 1.02 : 1.06)) + 'px');
 film.style.width = (LEN * ppm).toFixed(1) + 'px'; film.style.height = H + 'px';
 frs.forEach((b, k) => { const d = k === n - 1; b.style.left = ((d ? centre(k) : centre(k) - 1) * FP * ppm).toFixed(1) + 'px'; b.style.width = (FP * ppm * (d ? CD : 3)).toFixed(1) + 'px'; }); }

// ---- where the strip is: the frame under the screen's light is the chapter the page is on, eased, blurred by speed
const main = document.querySelector('main'), els = N.list.map(c => document.querySelector(c.el));
function target(){ const y = scrollY + 2; let k = 0; const tops = els.map(e => e.getBoundingClientRect().top + scrollY); tops.forEach((t, j) => { if (t <= y) k = j; });
 const fr = k < n - 1 ? Math.max(0, Math.min(1, (y - tops[k]) / Math.max(1, tops[k + 1] - tops[k]))) : 0;
 return k < n - 1 ? centre(k) + (centre(k + 1) - centre(k)) * fr : centre(n - 1); }
let X = null, V = 0, lt = 0, cd = 0, cdOn = false, cdT = 0, running = true;
function frame(now){ const dt = Math.min(.25, lt ? (now - lt) / 1000 : .016); lt = now;
 if (cdOn){ cd = Math.max(0, Math.min(CD - 1, (now - cdT) / 1000)); if (cd >= CD - 1) cdOn = false; }
 const T = target() + (N.index === n - 1 ? Math.floor(cd) : 0), a = reduce || X === null ? 1 : 1 - Math.pow(.004, dt), x0 = X;
 X = X === null ? T : X + (T - X) * a; V = x0 === null ? 0 : (X - x0) / dt;
 track.style.transform = `translate3d(${(innerWidth / 2 - (X + .5) * FP * ppm).toFixed(1)}px,0,0)`;
 const b = reduce ? 0 : Math.min(3.2, Math.abs(V) * .25); mbg.setAttribute('stdDeviation', b < .06 ? '0 0' : b.toFixed(2) + ' 0');
 if (Math.abs(T - X) > .002 || Math.abs(V) > .02 || cdOn) requestAnimationFrame(frame); else { mbg.setAttribute('stdDeviation', '0 0'); running = false; } }
const kick = () => { if (!running){ running = true; lt = 0; requestAnimationFrame(frame); } };
size(); requestAnimationFrame(frame);
addEventListener('resize', () => { size(); kick(); });
addEventListener('scroll', kick, {passive:true});
N.on(i => { frs.forEach((b, k) => b.toggleAttribute('aria-current', k === i)); if (i === n - 1){ cd = 0; cdT = performance.now() + 700; cdOn = true; } else { cdOn = false; cd = 0; } size(); kick(); });
setTimeout(() => { size(); kick(); }, 900);   // the caption is placed by the scene once the screen is measured
