// low-frequency-locker.js · the second act: the microphone drawer in Room A, seen from above under the desk lamp (light from the upper left).
// Charcoal foam with a cut-out per microphone, embossed label tape under each, one cut-out empty because that microphone is up in Room B,
// a silica gel sachet in the corner.
// P45 (Anwar 4, rows 8, 47, 49): no rate card. Each price is an embossed label under the thing it is charged for: the two room keys
// (the hour, and Room A's day), the padlock (the lock-out), the orange drive (stems and recalls), the boxed reel (tape by the reel).
// Blue tape is a price, black tape is a name, red tape is something gone: the old hourly rate, the microphone that is out.
// The microphones are drawn at one scale (1.1 px to the millimetre) in their real finishes: the 57 is die-cast charcoal, 157 mm by 32,
// a handle that barely narrows, a black slotted collar and a small steel mesh cap (Wikimedia, "Shure SM57 microphone.jpg"); the 4038 is
// a dark punched horseshoe, bronze showing where it is handled (the BBC microphones at The Beatles Story); the RE20 is fawn paint.
// Nothing here is chrome. One lamp, upper left: every object's shadow falls away from it, longer the further the object lies from it.
import {hand, rng} from './lib/hand.js';
const el = document.getElementById('locker');
const W = 990, H = 560, LX = 30, LY = -50;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const tilt = (a, cx, cy, s) => `<g transform="rotate(${a} ${cx} ${cy})">${s}</g>`;
const flip = (cx, s) => `<g transform="translate(${2 * cx} 0) scale(-1 1)">${s}</g>`;
// the cast: the object's own outline thrown down the line from the lamp through it, soft and long, and a tight dark one where it touches the foam
const cast = (s, cx, cy, k = 1) => { const dx = cx - LX, dy = cy - LY, d = Math.hypot(dx, dy), len = (8 + d / 52) * k, ox = dx / d * len, oy = dy / d * len;
 return `<g transform="translate(${ox.toFixed(1)} ${oy.toFixed(1)})" filter="url(#lf-cs)" opacity=".9">${s}</g><g transform="translate(${(ox * .26).toFixed(1)} ${(oy * .26).toFixed(1)})" filter="url(#lf-ct)" opacity=".9">${s}</g>${s}`; };
// a cut-out: the two walls nearest the lamp are in their own shade and throw it on the floor; the two far walls catch the light on their lip
const cut = (x, y, w, h, rx = 14) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="#2a2620"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" filter="url(#lf-foam)" opacity=".28"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="url(#lf-in)"/>
 <path d="M${x + rx} ${y + h - .5}H${x + w - rx}a${rx} ${rx} 0 0 0 ${rx - .5} ${-rx}V${y + rx}" fill="none" stroke="rgba(255,204,150,.3)" stroke-width="1.4" stroke-linecap="round"/>
 <path d="M${x + .8} ${y + h - rx}V${y + rx}a${rx} ${rx} 0 0 1 ${rx} ${-rx + .8}H${x + w - rx}" fill="none" stroke="#000" stroke-width="1.8" opacity=".8"/></g>`;
// embossing tape: glossy, the letters pushed up white and never quite level or evenly spaced, a hard little shadow on the foam
const dymo = (x, y, t, r = 0, c = '#141414') => { const w = t.length * 9.4 + 16, q = rng(t.length * 97 + Math.round(x * 3 + y)); let L = '';
 [...t].forEach((k, i) => { if (k === ' ') return; const px = (8 + i * 9.4 + (q() - .5) * 1.1).toFixed(1), py = (12.6 + (q() - .5) * 1.3).toFixed(1);
  L += `<text x="${px}" y="${py}" class="dy" transform="translate(.6 .7)" style="fill:rgba(0,0,0,.5)">${esc(k)}</text><text x="${px}" y="${py}" class="dy" opacity="${(.76 + q() * .24).toFixed(2)}">${esc(k)}</text>`; });
 return `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="1.800" y="2" width="${w}" height="17" rx="1.200" fill="rgba(0,0,0,.6)"/><rect width="${w}" height="17" rx="1.200" fill="${c}"/><rect width="${w}" height="6" rx="1.200" fill="rgba(255,255,255,.14)"/><rect y="13" width="${w}" height="4" rx="1.200" fill="rgba(0,0,0,.28)"/>${L}</g>`; };
const BLUE = '#1c3a66', RED = '#8c1d18';
const pen = (s, size, seed, c, w = 1.6) => { const g = hand(s, {size, seed, slant:-6, jit:.45}); return {w:g.w, svg:`<g fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${g.svg}</g>`}; };
const rnd = d => `<path d="${d}" fill="url(#lf-rnd)"/>`;

// ---- the microphones, each lying on its side, head to the right. No shadow of their own: cast() throws it.
// Shure SM57 · 173 by 35. Charcoal die-cast, a handle that only just narrows to the plug, the black slotted collar, the steel mesh cap.
// The four on the kit are 1 to 4, so the two left in the drawer are 5 and 6: a ring of white tape on each, numbered in marker.
const s57 = (x, y, n, back) => { const c = y + 17.5, cap = `M${x + 156} ${c - 13.5}h7.500a9.500 13.500 0 0 1 0 27h-7.500z`, num = pen(n, 11, 7 + +n, '#17161a', 1.9);
 const body = `<g filter="url(#lf-mat)"><rect x="${x}" y="${c - 12.5}" width="9" height="25" rx="3" fill="url(#lf-mg)"/><path d="M${x + 6} ${c - 12.5}L${x + 84} ${c - 14.5}V${c + 14.5}L${x + 6} ${c + 12.5}Z" fill="url(#lf-mg)"/>
  <rect x="${x + 84}" y="${c - 15.5}" width="42" height="31" rx="1.500" fill="url(#lf-mg)"/><rect x="${x + 124}" y="${c - 16}" width="11" height="32" rx="1" fill="url(#lf-blk)"/><rect x="${x + 134}" y="${c - 17.5}" width="23" height="35" rx="2.500" fill="url(#lf-blk)"/></g>
  ${[0, 1, 2, 3, 4].map(i => `<rect x="${x + 137 + i * 4}" y="${c - 15.5}" width="1.800" height="31" rx=".9" fill="#000" opacity=".85"/><rect x="${x + 139 + i * 4}" y="${c - 12}" width=".7" height="9" fill="#fff" opacity=".13"/>`).join('')}
  <path d="${cap}" fill="url(#lf-mesh)"/>${rnd(cap)}<rect x="${x + 155}" y="${c - 14}" width="3" height="28" fill="url(#lf-ring)"/>
  <path d="M${x + 84} ${c - 15}v30" stroke="#000" stroke-width="1" opacity=".55"/><path d="M${x + 129.5} ${c - 7}v14" stroke="rgba(236,232,222,.5)" stroke-width="1.200" stroke-dasharray="1.800 1.300"/>
  <path d="M${x + 85} ${c - 15.5}l3.400 .2l-1.200 2.400zM${x + 58} ${c + 13.3}l5 -.2l-2.600 1.500zM${x + 2} ${c - 11}l2.200 -1.400l.6 3z" fill="#8f8c84" opacity=".8"/>
  <rect x="${x + 24}" y="${c - 13.2}" width="13" height="26.400" fill="#e4dcc6"/><rect x="${x + 24}" y="${c - 13.2}" width="13" height="26.400" fill="url(#lf-rnd)"/>`;
 const mark = `<g transform="translate(${x + 30.5} ${c}) rotate(${back ? -90 : 90}) translate(${(-num.w / 2).toFixed(1)} -6.500)">${num.svg}</g>`;
 return [body, mark]; };
// Neumann U 47 fet · 176 by 69. Satin nickel, never mirror: a broad soft light along the top of the barrel, a wire basket a third of its length.
const fet = (x, y) => { const h = 69, bk = `M${x + 114} ${y}h40a22 34.500 0 0 1 0 ${h}h-40z`;
 return `<g filter="url(#lf-mat)"><rect x="${x}" y="${y}" width="118" height="${h}" rx="6" fill="url(#lf-sat)"/><rect x="${x}" y="${y}" width="9" height="${h}" rx="4" fill="url(#lf-ring)"/></g>
  <path d="${bk}" fill="url(#lf-mesh)"/>${rnd(bk)}<rect x="${x + 114}" y="${y + h / 2 - 2}" width="61" height="4" fill="#85827a"/><rect x="${x + 110}" y="${y - 1}" width="8" height="${h + 2}" rx="1.500" fill="url(#lf-ring)"/>
  <path d="M${x + 58} ${y + 27}l5.500 7.500l-5.500 7.500l-5.500 -7.500z" fill="#4a2a72" stroke="#cfc8b6" stroke-width=".8"/><rect x="${x + 24}" y="${y + 29}" width="9" height="4" rx="1" fill="#2a2926"/><rect x="${x + 24}" y="${y + 37}" width="9" height="4" rx="1" fill="#2a2926"/>
  <path d="M${x + 12} ${y + 60}l14 -1M${x + 70} ${y + 9}l22 1.500" stroke="#55534d" stroke-width=".7" opacity=".6"/>`; };
// Electro-Voice RE20 · 239 by 59. Fawn paint on steel, chipped at the shoulders; the row of ports down its side; the long mesh nose.
const re20 = (x, y) => { const h = 59, nose = `M${x + 170} ${y}h51a18 29.500 0 0 1 0 ${h}h-51z`;
 return `<g filter="url(#lf-mat)"><rect x="${x}" y="${y + 13}" width="30" height="33" rx="4" fill="url(#lf-fawn)"/><rect x="${x + 24}" y="${y}" width="150" height="${h}" rx="5" fill="url(#lf-fawn)"/></g>
  ${[...Array(7)].map((_, k) => `<rect x="${x + 46 + k * 17}" y="${y + 22}" width="11" height="15" rx="2" fill="url(#lf-mesh)"/><rect x="${x + 46 + k * 17}" y="${y + 22}" width="11" height="15" rx="2" fill="#000" opacity=".5"/><path d="M${x + 46.5 + k * 17} ${y + 36.5}h10" stroke="#e2d8bd" stroke-width=".7" opacity=".5"/>`).join('')}
  <path d="${nose}" fill="url(#lf-mesh)"/>${rnd(nose)}<rect x="${x + 167}" y="${y - 1}" width="6" height="${h + 2}" rx="1.500" fill="url(#lf-fawn)"/><rect x="${x + 197}" y="${y}" width="4" height="${h}" fill="url(#lf-fawn)"/>
  <path d="M${x + 25} ${y + 2}l5 -1.500l1 3zM${x + 160} ${y + 57}l6 -.5l-3 2zM${x + 26} ${y + 52}l3 3l-4 .5z" fill="#55514a" opacity=".85"/>`; };
// AKG D12 · 170 by 77. A grey hammer-finish box on a stem, a square grille with one bar across it.
const d12 = (x, y) => { const h = 77, c = y + h / 2, gr = `M${x + 78} ${y + 9}h76a6 6 0 0 1 6 6v${h - 30}a6 6 0 0 1 -6 6h-76a6 6 0 0 1 -6 -6v${-(h - 30)}a6 6 0 0 1 6 -6z`;
 return `<g filter="url(#lf-mat)"><rect x="${x}" y="${c - 14}" width="74" height="28" rx="4" fill="url(#lf-sat)"/><rect x="${x + 62}" y="${y}" width="108" height="${h}" rx="12" fill="url(#lf-gry)"/></g>
  <path d="${gr}" fill="url(#lf-mesh)"/>${rnd(gr)}<path d="${gr}" fill="none" stroke="#2c2b28" stroke-width="1.600"/><rect x="${x + 72}" y="${c - 2.5}" width="88" height="5" fill="#716f68"/>
  <rect x="${x + 104}" y="${c - 6.5}" width="24" height="13" rx="2" fill="#1c1b19"/><rect x="${x + 107}" y="${c - 1}" width="18" height="2" fill="#b3261a"/><rect x="${x + 40}" y="${c - 14.5}" width="6" height="29" fill="url(#lf-ring)"/>`; };
// Coles 4038 · 200 by 96. The broad face up: a punched black shell, flat where it meets the stem, bronze worn through along the rim the lamp finds.
const coles = (x, y) => { const h = 96, c = y + h / 2, hd = `M${x + 72} ${y}H${x + 152}a48 48 0 0 1 0 ${h}H${x + 72}a10 10 0 0 1 -10 -10V${y + 10}a10 10 0 0 1 10 -10z`;
 return `<g filter="url(#lf-mat)"><rect x="${x}" y="${c - 14}" width="60" height="28" rx="4" fill="url(#lf-blk)"/><rect x="${x + 50}" y="${c - 23}" width="16" height="46" rx="3" fill="url(#lf-blk)"/></g><rect x="${x + 34}" y="${c - 14.5}" width="7" height="29" fill="url(#lf-ring)"/>
  <path d="${hd}" fill="url(#lf-perf)"/><path d="${hd}" fill="url(#lf-dia)"/><path d="${hd}" fill="none" stroke="#0b0a09" stroke-width="3.400"/><path d="${hd}" fill="none" stroke="rgba(196,154,104,.5)" stroke-width="1" stroke-dasharray="46 9 80 14 30 60" transform="translate(-.8 -1)"/>
  <rect x="${x + 98}" y="${c - 5.5}" width="36" height="11" rx="1.500" fill="#15130f" stroke="rgba(196,154,104,.4)" stroke-width=".6"/><path d="M${x + 103} ${c - 1.5}h26M${x + 103} ${c + 1.8}h18" stroke="rgba(196,154,104,.45)" stroke-width=".7"/>`; };

// ---- what the prices belong to
// a room key on its fibre tag: the letter stamped in, a split ring, a dull brass Yale blank
const key = (cx, cy, c, letter) => `<circle cx="${cx - 34}" cy="${cy + 6}" r="19" fill="${c}"/><circle cx="${cx - 34}" cy="${cy + 6}" r="19" fill="url(#lf-dia)"/><circle cx="${cx - 34}" cy="${cy + 6}" r="18" fill="none" stroke="rgba(0,0,0,.3)" stroke-width="1"/><circle cx="${cx - 34}" cy="${cy - 7.5}" r="2.700" fill="#0b0a09"/>
 <text x="${cx - 34}" y="${cy + 16}" text-anchor="middle" font-family="'Clash Grotesk',sans-serif" font-weight="600" font-size="22" fill="#f1ead9" opacity=".94">${letter}</text>
 <circle cx="${cx - 22}" cy="${cy - 13}" r="9.500" fill="none" stroke="#a09d94" stroke-width="1.700"/><circle cx="${cx - 22}" cy="${cy - 13}" r="9.500" fill="none" stroke="#3a3833" stroke-width=".6" transform="translate(.8 1)"/>
 <circle cx="${cx}" cy="${cy - 14}" r="10.500" fill="url(#lf-brs)"/><circle cx="${cx - 4}" cy="${cy - 15}" r="3" fill="#0b0a09"/><path d="M${cx + 8} ${cy - 17.5}h40l4 3.500l-4 3.500h-6l-3 3.400h-5l-3 -3.400h-5l-3 3.400h-5l-3 -3.400h-7z" fill="url(#lf-brs)"/><path d="M${cx + 12} ${cy - 14.5}h34" stroke="#3c2e10" stroke-width="1" opacity=".7"/>`;
const padlock = (cx, cy) => `<path d="M${cx - 12} ${cy - 14}v-13a12 12 0 0 1 24 0v13" fill="none" stroke="#3a3833" stroke-width="7.500" stroke-linecap="round"/><path d="M${cx - 12} ${cy - 14}v-13a12 12 0 0 1 24 0v13" fill="none" stroke="#a9a69d" stroke-width="5" stroke-linecap="round"/><path d="M${cx - 13.2} ${cy - 16}v-11a13 13 0 0 1 9 -12.200" fill="none" stroke="#e6e2d6" stroke-width="1.300" opacity=".6"/>
 <g filter="url(#lf-mat)"><rect x="${cx - 24}" y="${cy - 17}" width="48" height="39" rx="5" fill="url(#lf-brs)"/></g><rect x="${cx - 24}" y="${cy - 17}" width="48" height="39" rx="5" fill="url(#lf-dia)"/>
 <circle cx="${cx}" cy="${cy - 1}" r="3.600" fill="#17120a"/><rect x="${cx - 1.5}" y="${cy - 1}" width="3" height="10" fill="#17120a"/><path d="M${cx - 17} ${cy + 15}h34" stroke="#3c2e10" stroke-width=".8" opacity=".6"/>`;
// the drive the stems leave on: the orange rubber bumper every studio knows, the one loud thing in the drawer
const drive = (cx, cy) => `<g filter="url(#lf-mat)"><rect x="${cx - 52}" y="${cy - 33}" width="104" height="66" rx="11" fill="#e0731f"/></g><rect x="${cx - 52}" y="${cy - 33}" width="104" height="66" rx="11" fill="url(#lf-dia)"/>
 <g filter="url(#lf-mat)"><rect x="${cx - 42}" y="${cy - 23}" width="84" height="46" rx="3" fill="url(#lf-sat)"/></g><rect x="${cx - 42}" y="${cy - 23}" width="84" height="46" rx="3" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="1"/>
 <circle cx="${cx + 33}" cy="${cy + 15}" r="1.800" fill="#2a66ff" opacity=".8"/><rect x="${cx - 60}" y="${cy - 7}" width="10" height="14" rx="2" fill="#1c1b19"/><path d="M${cx - 60} ${cy}c-16 -2 -18 20 -4 26s40 2 52 12" fill="none" stroke="#1c1b19" stroke-width="3.400" stroke-linecap="round"/>`;
// a boxed reel of half inch, on its edge: only the spine shows, as on the shelf
const spine = (x, y) => { const m = pen('BLANK', 9, 51, '#1f2a5c', 1.5);
 return `<g filter="url(#lf-mat)"><rect x="${x}" y="${y}" width="308" height="27" rx="2" fill="#2d2a26"/></g><rect x="${x}" y="${y}" width="308" height="27" rx="2" fill="url(#lf-rnd)"/><rect x="${x + 12}" y="${y + 4}" width="262" height="19" fill="#e7dfc8"/><rect x="${x + 12}" y="${y + 4}" width="262" height="4.500" fill="#a3301f"/>
  <text x="${x + 18}" y="${y + 19}" font-family="'General Sans',sans-serif" font-weight="600" font-size="8.500" letter-spacing="1.300" fill="#a3301f">LOW FREQUENCY · HALF INCH</text><g transform="translate(${x + 212} ${y + 9.8})">${m.svg}</g><path d="M${x + 290} ${y}v27" stroke="#000" stroke-width="1" opacity=".4"/>`; };
// masking tape and a marker, the studio's own stationery: who is in the chair
const mtape = (x, y, rot, t, c, h = 25) => { const w = t.w + 26, d = `M2 1.500L${w} 0L${w - 2.5} ${h}L0 ${h - 1.2}Z`;
 return `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="${d}" fill="rgba(0,0,0,.55)" transform="translate(2 2.300)"/><path d="${d}" fill="${c}"/><path d="${d}" fill="url(#lf-card)"/><g transform="translate(12 ${(h - 14) / 2 + 1})">${t.svg}</g></g>`; };

const grad = (id, st) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${st.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
const m5 = s57(66, 348, '5'), m6 = s57(398, 350, '6', 1);
const svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="The drawer under the desk in Room A. Microphones: a Coles 4038 ribbon from 1971, a FET 47, an RE20, a D12 for the kick, two of the six SM57s, and one empty cut-out whose microphone is in Room B. Beside them, each with its price on a label: the keys to Room A and Room B, a padlock for the lock-out, the drive for stems and recalls, and a boxed reel of half-inch tape."><defs>
 ${grad('lf-mg', [[0, '#141415'], [.2, '#444547'], [.34, '#4d4e50'], [.64, '#2a2a2c'], [1, '#0b0b0c']])}${grad('lf-blk', [[0, '#090909'], [.22, '#343230'], [.4, '#282725'], [1, '#060606']])}
 ${grad('lf-sat', [[0, '#46443f'], [.18, '#a09c92'], [.34, '#b8b4a9'], [.62, '#84817a'], [1, '#3a3834']])}${grad('lf-gry', [[0, '#3c3b38'], [.2, '#7d7b74'], [.36, '#8a8880'], [.66, '#62605a'], [1, '#2c2b28']])}
 ${grad('lf-fawn', [[0, '#5a5241'], [.18, '#b0a589'], [.34, '#c3b89b'], [.64, '#93886e'], [1, '#473f31']])}${grad('lf-ring', [[0, '#4e4c47'], [.26, '#c6c2b7'], [.58, '#8b887f'], [1, '#353330']])}
 ${grad('lf-brs', [[0, '#4a3a16'], [.26, '#b3954e'], [.5, '#977b38'], [1, '#382b0e']])}
 ${grad('lf-rnd', [[0, 'rgba(0,0,0,.6)'], [.24, 'rgba(255,240,214,.14)'], [.4, 'rgba(0,0,0,0)'], [.7, 'rgba(0,0,0,.22)'], [1, 'rgba(0,0,0,.66)']])}
 <linearGradient id="lf-dia" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="rgba(255,214,160,.22)"/><stop offset=".42" stop-color="rgba(0,0,0,0)"/><stop offset="1" stop-color="rgba(0,0,0,.55)"/></linearGradient>
 <linearGradient id="lf-in" x1="0" y1="0" x2=".42" y2="1"><stop offset="0" stop-color="rgba(0,0,0,.96)"/><stop offset=".16" stop-color="rgba(0,0,0,.7)"/><stop offset=".4" stop-color="rgba(0,0,0,.3)"/><stop offset="1" stop-color="rgba(0,0,0,.12)"/></linearGradient>
 <pattern id="lf-mesh" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#6e6b63"/><circle cx="2" cy="2" r="1.350" fill="#1a1917"/><circle cx="1.500" cy="1.500" r=".4" fill="#e9e2d0" opacity=".42"/></pattern>
 <pattern id="lf-perf" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#2b2723"/><circle cx="2.900" cy="2.900" r="2.300" fill="#63584a"/><circle cx="2.250" cy="2.250" r="2.300" fill="#070706"/><circle cx="7.400" cy="7.400" r="2.300" fill="#63584a"/><circle cx="6.750" cy="6.750" r="2.300" fill="#070706"/></pattern>
 <filter id="lf-b" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="5"/></filter>
 <filter id="lf-cs" x="-30%" y="-60%" width="170%" height="240%"><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/><feGaussianBlur stdDeviation="3.600"/></filter>
 <filter id="lf-ct" x="-20%" y="-40%" width="140%" height="180%"><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/><feGaussianBlur stdDeviation="1.100"/></filter>
 <filter id="lf-mat" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.200" numOctaves="2" seed="8" result="n"/><feColorMatrix in="n" values="0 0 0 0 1  0 0 0 0 .96  0 0 0 0 .9  0 0 0 .2 -.07" result="g"/><feComposite in="g" in2="SourceAlpha" operator="in" result="gi"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="gi"/></feMerge></filter>
 <filter id="lf-foam" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.300" numOctaves="2" seed="5"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 .95 0 0 0 0 .88 0 0 0 .9 -.42"/></filter>
 <radialGradient id="lf-lamp" cx=".06" cy="0" r="1.050"><stop offset="0" stop-color="rgba(255,190,110,.52)"/><stop offset=".45" stop-color="rgba(255,160,80,.14)"/><stop offset="1" stop-color="rgba(0,0,0,0)"/></radialGradient>
 <linearGradient id="lf-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="rgba(255,246,222,.35)"/><stop offset="1" stop-color="rgba(90,70,40,.22)"/></linearGradient>
 <linearGradient id="lf-ply" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6a5234"/><stop offset=".5" stop-color="#8a6c45"/><stop offset="1" stop-color="#4c3a24"/></linearGradient>
 <clipPath id="lf-fc"><rect x="18" y="18" width="${W - 36}" height="${H - 36}" rx="3"/></clipPath></defs>
 <rect width="${W}" height="${H}" rx="6" fill="url(#lf-ply)"/><rect x="5" y="5" width="${W - 10}" height="${H - 10}" rx="4" fill="none" stroke="#b9b5aa" stroke-width="3" opacity=".7"/>
 <rect x="18" y="18" width="${W - 36}" height="${H - 36}" rx="3" fill="#201e1c"/><rect x="18" y="18" width="${W - 36}" height="${H - 36}" filter="url(#lf-foam)" opacity=".5"/>
 <g clip-path="url(#lf-fc)"><path d="M12 ${H}V12H${W}" fill="none" stroke="#000" stroke-width="30" opacity=".62" filter="url(#lf-b)"/></g><path d="M19 ${H - 18.5}H${W - 18.5}V19" fill="none" stroke="rgba(255,204,150,.3)" stroke-width="1.400"/>
 ${cut(38, 40, 272, 116)}${cut(330, 40, 272, 116)}${cut(38, 196, 272, 96)}${cut(330, 196, 272, 96)}${cut(38, 332, 272, 68)}${cut(330, 332, 272, 68)}${cut(38, 440, 272, 68)}
 ${cut(626, 40, 326, 100)}${cut(626, 214, 150, 86)}${cut(790, 214, 162, 86)}${cut(626, 382, 326, 42, 8)}
 ${cast(tilt(-3, 168, 98, coles(58, 49)), 168, 98, 1.25)}${cast(tilt(2.2, 460, 98, fet(366, 62)), 460, 98, 1.15)}${cast(tilt(1.2, 172, 244, re20(50, 213)), 172, 244)}${cast(tilt(-3.6, 470, 244, d12(388, 205)), 470, 244, 1.2)}
 ${cast(tilt(-5, 152, 366, m5[0]), 152, 366, .8)}${tilt(-5, 152, 366, m5[1])}${cast(tilt(3.4, 466, 366, flip(484.5, m6[0])), 466, 366, .8)}${tilt(3.4, 466, 366, flip(484.5, `<g transform="translate(${2 * 428.5} 0) scale(-1 1)">${m6[1]}</g>`))}
 ${cast(tilt(-13, 712, 92, key(712, 92, '#c1621c', 'A')), 712, 92, .5)}${cast(tilt(9, 872, 94, key(872, 94, '#3d5a76', 'B')), 872, 94, .5)}
 ${cast(tilt(-17, 700, 258, padlock(700, 261)), 700, 258, .8)}${cast(tilt(5, 874, 257, drive(876, 257)), 874, 257, .7)}${cast(spine(635, 389), 790, 402, .5)}
 ${dymo(46, 160, '4038 RIBBON 1971', -1.2)}${dymo(338, 161, 'FET 47  VOX+BASS', .8)}${dymo(46, 297, 'RE20', -.6)}${dymo(338, 296, 'D12  KICK ONLY', 1.1)}${dymo(46, 405, '57 x6', .5)}${dymo(338, 404, '4 LIVE ON THE KIT', -1)}${dymo(46, 513, 'OUT > ROOM B  KM84', -.8, RED)}
 ${dymo(650, 20.5, 'RATES IN POUNDS  FROM JANUARY', .3)}
 ${dymo(650, 163, 'WAS 35', -4, RED)}<path d="M655 177l64 -8" stroke="#e8e2d2" stroke-width="1.300" opacity=".85"/>${dymo(632, 144, 'A  38 AN HOUR', -.8, BLUE)}${dymo(804, 145, 'B  22 AN HOUR', 1, BLUE)}${dymo(786, 166, 'ENGINEER INCLUDED', -.6)}${dymo(740, 189, 'A  TEN HOURS  320', .7, BLUE)}
 ${dymo(630, 304, 'LOCK-OUT  520', -1, BLUE)}${dymo(634, 325, '24 HOURS', .9)}${dymo(628, 346, 'KIT LEFT STANDING', -.5)}${dymo(796, 304, 'STEMS + RECALLS', .8)}${dymo(812, 325, '20 AN HOUR', -1.1, BLUE)}
 ${dymo(632, 428, 'HALF INCH  90 A REEL', -.7, BLUE)}${dymo(724, 449, 'OR BRING YOUR OWN', .9)}
 ${mtape(636, 478, -1.6, pen('MAYA BY DAY · KOFI 7 UNTIL 3', 10.5, 21, '#17161a', 1.7), '#dccfa6')}${mtape(652, 509, 1.1, pen('BRING YOUR OWN ENGINEER. OURS STAYS TOO.', 7.4, 23, '#2a377a', 1.4), '#d6c89c', 21)}
 <g transform="translate(372 452) rotate(-9)"><rect x="5" y="6" width="92" height="50" rx="2" fill="rgba(0,0,0,.6)" filter="url(#lf-b)"/><rect width="92" height="50" rx="2" fill="#e9e5da"/><rect width="92" height="50" rx="2" fill="url(#lf-dia)"/><path d="M0 5h92M0 45h92" stroke="#bdb8aa" stroke-width="1" stroke-dasharray="2 2"/><text x="46" y="21" class="sg">SILICA GEL</text><text x="46" y="35" class="sg" style="fill:#b3261a">DO NOT EAT</text></g>
 <rect width="${W}" height="${H}" fill="url(#lf-lamp)" style="mix-blend-mode:screen" pointer-events="none"/></svg>`;
el.innerHTML = `<div class="lk-h sda"><p class="k">Room A · the drawer under the desk</p><h2>What is in the drawer, and what a day costs.</h2></div>
 <figure class="lk-d sda">${svg}</figure>
 <dl class="lk-sr"><div><dt>Hour</dt><dd>Room A £38, Room B £22. The engineer is included.</dd></div><div><dt>Day</dt><dd>Ten hours in Room A, £320.</dd></div><div><dt>Lock-out</dt><dd>The room for 24 hours, kit left standing, £520.</dd></div><div><dt>Tape</dt><dd>£90 a reel of half inch, or bring your own.</dd></div><div><dt>After</dt><dd>Stems and recalls, £20 an hour.</dd></div><div><dt>In the chair</dt><dd>Maya by day, Kofi from seven until three. Bring your own engineer if you like; ours stays to keep the machine lined up.</dd></div></dl>`;
