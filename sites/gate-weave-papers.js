// gate-weave-papers.js · Gate Weave's second act: after the reel has run, the six films come back one at a time, each in the
// place it was shot (its own still, thrown out of focus behind) with one paper from its production lying in a low side light:
// the slate, the camera report, the episode masters, the certificate and ticket, the clock, the river log.
// Read first: a24films.com film pages (credit block, year, synopsis), pulsefilms.com (formats and markets), academyfilms.com (roster).
// All copy provisional until the writing chain runs. Every person, client and number here is fictional.
// P45 (Anwar 4, rows 26 and 27): the papers no longer share one layout and no credit sits in a hairline table. The slate's crew are on
// strips of camera tape torn off and stuck by the slate; the masters carry a typed card under a paperclip; the clock carries its own
// credits, as a broadcast clock does; the other three set their credits as an end roll, role to the left of one axis, name to the right.
// The chalk is three passes (dust, stroke, the dab where a stroke lands) broken by the board's tooth; the take cell is grey from wiping.
// The house table is a shelf of cans seen from the side: 63, 9, 2, and 1 with one open in the edit. The numbers are the pile.
import {hand, rng} from './lib/hand.js';

const ch = (s, x, y, size, seed, o = {}) => `<g transform="translate(${x} ${y}) rotate(${o.rot || 0})" fill="none" stroke="${o.c || '#efeadd'}" stroke-width="${o.w || 1.5}" stroke-linecap="round" stroke-linejoin="round" opacity="${o.o || .92}"${o.f ? ` filter="url(#${o.f})"` : ''}>${hand(s, {size, seed, slant:o.slant ?? -6, jit:o.jit ?? .45}).svg}</g>`;
const defs = id => `<defs>
 <filter id="${id}g" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${id.length * 7}"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .45  0 0 0 0 .38  0 0 0 .5 -.12"/><feComposite in2="SourceGraphic" operator="in"/><feBlend in="SourceGraphic" mode="multiply"/></filter>
 <filter id="${id}c"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="1.6"/></filter>
 <linearGradient id="${id}l" x1="0" y1=".7" x2="1" y2=".2"><stop offset="0" stop-color="#ffcf96" stop-opacity=".3"/><stop offset=".45" stop-color="#ffcf96" stop-opacity=".04"/><stop offset="1" stop-color="#000" stop-opacity=".42"/></linearGradient></defs>`;
const lit = (id, d, tr = '') => `<g transform="${tr}"><path d="${d}" fill="url(#${id}l)" style="mix-blend-mode:overlay"/><path d="${d}" fill="url(#${id}l)" opacity=".55"/></g>`;
const mono = (s, x, y, size = 7, fill = '#3a342c', extra = '') => `<text x="${x}" y="${y}" font-family="'JetBrains Mono',monospace" font-size="${size}" letter-spacing=".6" fill="${fill}" ${extra}>${s}</text>`;

// chalk on a painted board. Pressure rises and falls along a word and from letter to letter; a stroke is heaviest where the stick lands;
// either side of it lies a soft band of dust; and the board's tooth breaks all of it, so no stroke is one even line.
const chalk = (s, x, y, size, seed, o = {}) => { const w = o.w || 2.2, r = rng(seed * 131 + 17), ph = r() * 6, g = hand(s, {size, seed, slant:o.slant ?? -5, jit:o.jit ?? .55}).svg; let i = 0;
 const core = g.replace(/<path d="([^"]+)"\/>/g, (m, d) => { const p = (.78 + .3 * Math.sin(i++ * .8 + ph)) * (.8 + r() * .4), q = d.match(/^M([\d.-]+) ([\d.-]+)/);
  return `<path d="${d}" stroke-width="${(w * p).toFixed(2)}" opacity="${Math.min(1, .45 + p * .55).toFixed(2)}"/>` + (q && r() > .3 ? `<circle cx="${q[1]}" cy="${q[2]}" r="${(w * (.5 + r() * .32)).toFixed(2)}" fill="#f4efe3" stroke="none" opacity="${(.35 + r() * .4).toFixed(2)}"/>` : ''); });
 const tr = `transform="translate(${x} ${y}) rotate(${o.rot || 0})" fill="none" stroke="#f1ece0" stroke-linecap="round" stroke-linejoin="round"`;
 const a = o.o || .95;
 return `<g ${tr} stroke-width="${(w * 2.3).toFixed(2)}" opacity="${(.075 * a).toFixed(3)}" filter="url(#slh)">${g}</g><g ${tr} stroke-width="${(w * .78).toFixed(2)}" opacity="${(.36 * a).toFixed(2)}" filter="url(#slc)">${g}</g><g ${tr} opacity="${a}" filter="url(#slk)">${core}</g>`; };
// what falls off the stick: thickest just under the writing, thinning as it drops
const dust = (x0, x1, y, n, seed, fall = 16) => { const r = rng(seed); let s = '';
 for (let i = 0; i < n; i++){ const t = r() * r(); s += `<circle cx="${(x0 + r() * (x1 - x0)).toFixed(1)}" cy="${(y + t * fall).toFixed(1)}" r="${(.22 + r() * .6).toFixed(2)}" opacity="${(.1 + r() * .42 * (1 - t)).toFixed(2)}"/>`; }
 return s; };

// 1 · the slate: black acrylic, white paint, chalk. The title went on a week ago and has been handled; the take is rewritten every few
// minutes, so its cell is grey with old chalk and the last take still shows under the new one.
function slate(){ const id = 'sl'; let bars = '';
 for (let i = 0; i < 9; i++) bars += `<path d="M${-8 + i * 36} 0h18l-14 26h-18z" fill="#efeadd"/>`;
 return `<svg viewBox="0 0 300 262" role="img" aria-label="The slate from Rooftop Pigeons: roll A014, scene 22, take 3">${defs(id)}
 <defs><filter id="slk" x="-8%" y="-25%" width="116%" height="150%"><feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" seed="11" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.5" xChannelSelector="R" yChannelSelector="G" result="d"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.7 -.66" result="tooth"/><feTurbulence type="fractalNoise" baseFrequency=".045 .09" numOctaves="2" seed="5" result="p"/>
  <feColorMatrix in="p" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.5 .08" result="press"/><feComposite in="d" in2="tooth" operator="in" result="a"/><feComposite in="a" in2="press" operator="in"/></filter>
  <filter id="slh" x="-15%" y="-40%" width="130%" height="180%"><feGaussianBlur stdDeviation="1.1"/></filter>
  <filter id="slw" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="3.4"/><feTurbulence type="fractalNoise" baseFrequency=".3 .9" numOctaves="2" seed="9" result="s"/><feColorMatrix in="s" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.2 -.5" result="st"/><feGaussianBlur in="SourceGraphic" stdDeviation="3.4"/><feComposite in2="st" operator="in"/></filter></defs>
 <clipPath id="slcp"><rect width="290" height="26" rx="2"/></clipPath><clipPath id="slbd"><rect x="5" y="62" width="290" height="194" rx="3"/></clipPath>
 <g transform="translate(5 34)"><rect width="290" height="26" rx="2" fill="#141311"/><g clip-path="url(#slcp)">${bars}</g></g>
 <g transform="translate(5 30) rotate(-7)"><g transform="translate(0 -26)"><rect width="290" height="26" rx="2" fill="#141311"/><g clip-path="url(#slcp)" transform="scale(1 -1) translate(0 -26)">${bars}</g></g><circle cx="7" cy="-2" r="3.2" fill="#8d877a"/></g>
 <rect x="5" y="62" width="290" height="194" rx="3" fill="#161513"/>
 <g stroke="#e9e3d4" stroke-width="1.4" opacity=".8"><path d="M5 108H295M5 168H295M5 212H295M110 108V168M200 108V168M150 212V256"/></g>
 <g font-family="'JetBrains Mono',monospace" font-size="7" letter-spacing="1" fill="#e9e3d4" opacity=".75"><text x="12" y="74">PROD.</text><text x="12" y="120">ROLL</text><text x="117" y="120">SCENE</text><text x="207" y="120">TAKE</text><text x="12" y="180">DIRECTOR</text><text x="12" y="224">CAMERA</text><text x="157" y="224">DATE</text></g>
 <g clip-path="url(#slbd)">
  <g fill="none" stroke="#e9e3d4" stroke-linecap="round" filter="url(#slw)"><path d="M210 152q22 -26 44 -12t36 -18" stroke-width="20" opacity=".17"/><path d="M206 138q30 -14 50 2t34 -6" stroke-width="15" opacity=".13"/><path d="M214 162q28 -8 70 -4" stroke-width="10" opacity=".12"/><path d="M118 150q30 -16 72 -6" stroke-width="15" opacity=".1"/><path d="M168 232q50 -10 112 -2" stroke-width="12" opacity=".08"/></g>
  ${chalk('2', 231, 131, 27, 8, {o:.3, w:2.8})}
  ${chalk('ROOFTOP PIGEONS', 48, 80, 17, 3, {w:1.9, o:.74})}${chalk('A014', 22, 130, 26, 5, {w:2.3, o:.88})}${chalk('22', 128, 130, 26, 7, {w:2.5, o:.93})}${chalk('3', 239, 129, 29, 9, {w:3.1, o:1})}
  ${chalk('R. HAQUE', 84, 182, 17, 11, {w:1.9, o:.76})}${chalk('T. OKAFOR', 20, 232, 14, 13, {w:1.8, o:.72})}${chalk('14 FEB 25', 164, 232, 14, 15, {w:1.9, o:.86})}
  <g fill="#efe9dc">${dust(46, 252, 99, 46, 71, 9)}${dust(20, 104, 158, 30, 72, 10)}${dust(124, 190, 158, 34, 73, 10)}${dust(226, 286, 159, 70, 74, 9)}${dust(84, 214, 200, 30, 75, 11)}${dust(18, 144, 247, 26, 76, 8)}${dust(160, 288, 247, 34, 77, 8)}
   ${dust(8, 292, 252.6, 120, 78, 2.6)}${dust(204, 292, 165, 44, 79, 2.2)}${dust(8, 292, 210, 30, 80, 1.6)}</g>
  <g fill="#e9e3d4" filter="url(#slh)"><ellipse cx="22" cy="244" rx="15" ry="9" opacity=".1" transform="rotate(-24 22 244)"/><ellipse cx="284" cy="196" rx="9" ry="16" opacity=".08" transform="rotate(12 284 196)"/></g>
 </g>
 ${lit(id, 'M5 8H295V256H5Z')}</svg>`; }

// 2 · the camera report: a printed carbon form, filled in pencil on the loom shed floor, good takes ringed
function report(){ const id = 'cr', rows = [['1', '1', '40', 'NG  FLARE'], ['1', '2', '38', ''], ['2', '1', '62', 'HANDS  CLOSE'], ['3', '1', '55', ''], ['3', '2', '57', 'SHUTTLE  96 FPS'], ['4', '1', '48', 'END OF ROLL']];
 const p = {c:'#3b3a40', w:1.05, o:.82};
 return `<svg viewBox="0 0 280 350" role="img" aria-label="Camera report for The Last Jamdani Loom, roll 7">${defs(id)}
 <g filter="url(#crg)"><path d="M4 6L274 2L277 346L7 348Z" fill="#e6dcc0"/></g>
 <path d="M150 2L154 348" stroke="#b9ad8c" stroke-width=".6" opacity=".6"/>
 ${mono('GATE WEAVE PICTURES · DHAKA · LONDON', 16, 24, 6.4)}<text x="16" y="46" font-family="'Clash Display',sans-serif" font-weight="600" font-size="19" fill="#2b2620" letter-spacing=".5">CAMERA REPORT</text>${mono('No. 0412', 224, 46, 7, '#a23a2a')}
 <g stroke="#5a5142" stroke-width=".7" fill="none"><path d="M16 56H264M16 80H264M16 104H264M16 128H264M140 56V128"/><path d="M16 144H264V330H16ZM16 162H264M50 144V330M84 144V330M124 144V330"/>${rows.map((_, i) => `<path d="M16 ${190 + i * 28}H264"/>`).join('')}</g>
 ${mono('TITLE', 20, 65, 5.6)}${mono('ROLL', 144, 65, 5.6)}${mono('STOCK', 20, 89, 5.6)}${mono('MAG', 144, 89, 5.6)}${mono('DIRECTOR', 20, 113, 5.6)}${mono('CAMERA', 144, 113, 5.6)}
 ${mono('SC', 26, 156, 5.6)}${mono('TK', 60, 156, 5.6)}${mono('FEET', 92, 156, 5.6)}${mono('REMARKS', 130, 156, 5.6)}
 ${ch('LAST JAMDANI LOOM', 42, 68, 6.2, 21, p)}${ch('7', 176, 66, 11, 22, p)}${ch('7207  250D  16MM', 46, 92, 6.2, 23, p)}${ch('B', 176, 90, 11, 24, p)}${ch('S. RAHMAN', 62, 116, 7, 25, p)}${ch('I. PETROVA', 182, 116, 7, 26, p)}
 ${rows.map((r, i) => ch(r[0], 26, 170 + i * 28, 11, 30 + i, p) + ch(r[1], 60, 170 + i * 28, 11, 40 + i, p) + ch(r[2], 92, 170 + i * 28, 11, 50 + i, p) + ch(r[3], 132, 171 + i * 28, 8.4, 60 + i, p)).join('')}
 ${[1, 2, 4].map((i, q) => `<ellipse cx="${65 + q}" cy="${177 + i * 28}" rx="11" ry="9.5" fill="none" stroke="#3b3a40" stroke-width="1.1" opacity=".8" transform="rotate(${-12 + q * 9} 65 ${177 + i * 28})"/>`).join('')}
 ${ch('TOTAL 300 FT   PRINT RINGED', 22, 334, 7.4, 71, {...p, o:.7})}
 <ellipse cx="226" cy="300" rx="26" ry="24" fill="none" stroke="#6b4a2a" stroke-width="2.2" opacity=".2"/><ellipse cx="226" cy="300" rx="23" ry="21" fill="#6b4a2a" opacity=".05"/>
 ${lit(id, 'M4 6L274 2L277 346L7 348Z')}</svg>`; }

// 3 · the masters: six episode boxes stood on their sides, spines out, one pulled forward
function masters(){ const id = 'ms', eps = [['HILSA, FIRST RAIN', '24:10'], ['KHICHURI WEATHER', '23:48'], ['THE SMOKE HOUSE', '24:31'], ['SEVEN CHUTNEYS', '23:55'], ['TEA AT FOUR', '24:02'], ['WHAT THE FLOOD LEFT', '25:14']], r = rng(9);
 return `<svg viewBox="0 0 320 300" role="img" aria-label="Six master boxes for Monsoon Kitchen, one per episode">${defs(id)}
 ${eps.map((e, i) => { const y = 14 + i * 46, dx = i === 2 ? 26 : (r() - .5) * 9, sh = 22 + i * 3;
  return `<g transform="translate(${10 + dx} ${y}) rotate(${((r() - .5) * 1.6).toFixed(2)})"><rect width="280" height="42" rx="2.5" fill="rgb(${sh},${sh - 2},${sh - 4})"/><rect width="280" height="3" fill="#fff" opacity=".07"/><rect y="39" width="280" height="3" fill="#000" opacity=".5"/>
  <g filter="url(#msg)"><rect x="14" y="7" width="212" height="28" fill="#e9e1cb"/></g><rect x="14" y="7" width="6" height="28" fill="#b5462f"/>
  ${mono('MONSOON KITCHEN', 26, 18, 6)}${mono('EP ' + (i + 1) + ' OF 6', 172, 18, 6, '#a23a2a')}<text x="26" y="30" font-family="'Satoshi',sans-serif" font-weight="500" font-size="9.5" fill="#26211b" letter-spacing=".4">${e[0]}</text>${mono(e[1], 194, 30, 7, '#26211b')}
  ${mono('MASTER', 238, 18, 5.6, '#bdb6a4')}${mono('GWP ' + (2301 + i), 238, 30, 5.6, '#8d877a')}</g>`; }).join('')}
 </svg>`; }
// the card that travels with the masters: an index card typed on the office machine, leaders run out with the full stop key, held by a paperclip
function card3(f){ const r = rng(63), L = 40, rows = f.c.map(([a, b]) => { const A = a.toUpperCase(), B = b.toUpperCase(); return A + ' ' + '.'.repeat(Math.max(3, L - A.length - B.length - 2)) + ' ' + B; });
 const ty = (s, x, y, c = '#221d18', size = 9.4) => `<text x="${x}" y="${y}" xml:space="preserve" font-family="'JetBrains Mono',monospace" font-size="${size}" letter-spacing=".6" fill="${c}" opacity="${(.72 + r() * .26).toFixed(2)}" transform="rotate(${((r() - .5) * .5).toFixed(2)} ${x} ${y})">${s}</text>`;
 return `<svg viewBox="0 0 300 196" role="img" aria-label="A typed card clipped to the masters. ${f.c.map(([a, b]) => a + ': ' + b).join('. ')}">${defs('cd')}
 <g filter="url(#cdg)"><path d="M3 5L296 2L298 192L5 194Z" fill="#ece4cc"/></g>
 <path d="M4 36H297" stroke="#b3402e" stroke-width=".9" opacity=".75"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M4 ${62 + i * 23}H297" stroke="#8fa9bd" stroke-width=".5" opacity=".7"/>`).join('')}
 ${ty('MONSOON KITCHEN', 16, 27, '#8f2a1c', 11)}${ty('SIX MASTERS', 196, 27, '#8f2a1c', 9.4)}
 ${rows.map((s, i) => ty(s, 16, 58 + i * 23)).join('')}
 ${ch('ALL SIX IN', 150, 172, 8.6, 91, {c:'#3b3a40', w:1.1, o:.75, rot:-3})}<path d="M228 180l5 6l11 -15" fill="none" stroke="#3b3a40" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity=".75"/>
 ${lit('cd', 'M3 5L296 2L298 192L5 194Z')}
 <path d="M28 -9v36a6.500 6.500 0 0 0 13 0V-2a4.200 4.200 0 0 0 -8.400 0v26" fill="none" stroke="#000" stroke-width="2.4" stroke-linecap="round" opacity=".35" transform="translate(2.500 2)"/><path d="M28 -9v36a6.500 6.500 0 0 0 13 0V-2a4.200 4.200 0 0 0 -8.400 0v26" fill="none" stroke="#c4c1b8" stroke-width="1.7" stroke-linecap="round"/></svg>`; }

// 4 · the certificate that runs before a feature, and the ticket stub from its first night
function cert(){ const id = 'ce';
 return `<svg viewBox="0 0 310 300" role="img" aria-label="Exhibition certificate for Night Bus to Sylhet, 94 minutes on five reels, and a ticket stub">${defs(id)}
 <g transform="rotate(-2 150 130)"><g filter="url(#ceg)"><rect x="8" y="8" width="270" height="200" fill="#e8dfc6"/></g><rect x="16" y="16" width="254" height="184" fill="none" stroke="#3a342c" stroke-width="1.4"/><rect x="20" y="20" width="246" height="176" fill="none" stroke="#3a342c" stroke-width=".5"/>
 <text x="143" y="46" text-anchor="middle" font-family="'Clash Display',sans-serif" font-weight="600" font-size="13" letter-spacing="3" fill="#2b2620">CERTIFICATE</text>${mono('FOR PUBLIC EXHIBITION', 143, 60, 6.4, '#3a342c', 'text-anchor="middle"')}
 <text x="143" y="92" text-anchor="middle" font-family="'Satoshi',sans-serif" font-weight="500" font-size="17" fill="#1f1b16">NIGHT BUS TO SYLHET</text>
 <path d="M40 104H246" stroke="#3a342c" stroke-width=".6"/>
 ${mono('GAUGE', 40, 122, 6)}${mono('35 MM · COLOUR', 110, 122, 7, '#1f1b16')}${mono('REELS', 40, 138, 6)}${mono('FIVE', 110, 138, 7, '#1f1b16')}${mono('LENGTH', 40, 154, 6)}${mono('8,460 FT', 110, 154, 7, '#1f1b16')}${mono('RUNNING', 40, 170, 6)}${mono('94 MIN', 110, 170, 7, '#1f1b16')}${mono('GATE WEAVE PICTURES · 2022', 40, 188, 6)}
 <g transform="translate(212 150) rotate(-14)" fill="none" stroke="#a8321f" opacity=".72" filter="url(#cec)"><circle r="30" stroke-width="2.4"/><circle r="23" stroke-width="1"/><text y="-4" text-anchor="middle" font-family="'Clash Display',sans-serif" font-weight="600" font-size="12" fill="#a8321f" stroke="none" letter-spacing="1.5">PASSED</text><text y="12" text-anchor="middle" font-family="'Clash Display',sans-serif" font-weight="600" font-size="13" fill="#a8321f" stroke="none">U</text></g></g>
 <g transform="translate(150 200) rotate(9)"><g filter="url(#ceg)"><path d="M0 0H150V80H0Z" fill="#d9a54a"/></g><path d="M104 0V80" stroke="#5a4215" stroke-width="1" stroke-dasharray="2 3"/>
 ${mono('MODHUMITA · MOTIJHEEL', 10, 16, 6, '#3b2b0c')}<text x="10" y="38" font-family="'Clash Display',sans-serif" font-weight="600" font-size="13" fill="#2b1f08">NIGHT SHOW 9.30</text>${mono('ROW H · SEAT 14', 10, 54, 7, '#2b1f08')}${mono('11 NOV 2022 · TK 250', 10, 68, 6, '#3b2b0c')}${mono('No.', 112, 30, 6, '#3b2b0c')}${mono('0731', 112, 46, 9, '#a8321f')}</g>
 ${lit(id, 'M8 8H278V208H8Z', 'rotate(-2 150 130)')}${lit(id, 'M0 0H150V80H0Z', 'translate(150 200) rotate(9)')}</svg>`; }

// 5 · the clock: what goes on the front of every commercial sent to a broadcaster, ten seconds of it, printed from the master.
// A clock is a credit block already (client, agency, product, title, duration, number), so this film's credits are on it and nowhere else.
function clock(){ const id = 'ck'; let ticks = '';
 for (let i = 0; i < 60; i++){ const a = i * 6 * Math.PI / 180, r1 = i % 5 ? 49 : 45; ticks += `<path d="M${(Math.sin(a) * r1).toFixed(1)} ${(-Math.cos(a) * r1).toFixed(1)}L${(Math.sin(a) * 53).toFixed(1)} ${(-Math.cos(a) * 53).toFixed(1)}" stroke="#ece5d8" stroke-width="${i % 5 ? .6 : 1.3}"/>`; }
 const k = (s, x, y) => mono(s, x, y, 6.2, '#8f897c'), v = (s, x, y, size = 8) => mono(s, x, y + 12, size, '#ece5d8'), A = 198, B = 306;
 return `<svg viewBox="0 0 420 280" role="img" aria-label="The broadcast clock for Launch. Client: Nouka Ghat Ferries. Agency: direct to client. Product: Sadarghat night launch. Duration: 60 seconds, also cut to 30 and 15. Director: Rumana Haque. Photography: Tobi Okafor.">${defs(id)}
 <g transform="rotate(1.6 210 140)"><g filter="url(#ckg)"><rect x="6" y="8" width="408" height="262" fill="#ece6d6"/></g><rect x="20" y="22" width="380" height="214" fill="#0b0b0c"/>
 <g transform="translate(108 129) scale(1.3)">${ticks}<circle r="53" fill="none" stroke="#ece5d8" stroke-width=".8"/><path d="M0 0L-15.6 -49.6" stroke="#ece5d8" stroke-width="2.2" stroke-linecap="round"/><circle r="3" fill="#ece5d8"/><path d="M0 -53A53 53 0 0 0 -15.6 -49.6L0 0Z" fill="#ece5d8" opacity=".16"/></g>
 ${k('CLIENT', A, 50)}${v('NOUKA GHAT FERRIES', A, 50)}${k('AGENCY', B, 50)}${v('DIRECT TO CLIENT', B, 50)}
 ${k('PRODUCT', A, 83)}${v('SADARGHAT NIGHT LAUNCH', A, 83)}
 ${k('TITLE', A, 116)}${v('LAUNCH', A, 116)}${k('DURATION', B, 116)}${v('60"', B, 116, 12)}
 ${k('DIRECTOR', A, 149)}${v('RUMANA HAQUE', A, 149)}${k('PHOTOGRAPHY', B, 149)}${v('TOBI OKAFOR', B, 149)}
 ${k('CLOCK NO.', A, 182)}${v('GWP/LNCH060/010', A, 182, 7.4)}${k('ALSO CUT TO', B, 182)}${v('30" AND 15"', B, 182)}
 ${ch('FINAL  21 OCT 21', 28, 248, 10, 33, {c:'#2b2620', w:1.2, o:.8})}${ch('1 OF 3', 330, 248, 10, 35, {c:'#a8321f', w:1.2, o:.8})}</g>
 <path d="M168 0L252 4L250 28L166 22Z" fill="#d8caa0" opacity=".78"/><path d="M-4 224L36 203L49 227L9 249Z" fill="#d8caa0" opacity=".7"/>
 ${lit(id, 'M6 8H414V270H6Z', 'rotate(1.6 210 140)')}</svg>`; }

// 6 · the river log: a page from the sound recordist's notebook, the Jamuna drawn from memory, one tick for each night's mooring
function river(){ const id = 'rv', r = rng(27), p = {c:'#33343c', w:1.05, o:.84}; let d = 'M52 30', pts = [[52, 30]];
 for (let i = 1; i <= 22; i++){ const y = 30 + i * 13, x = 70 + Math.sin(i * .62) * 34 + Math.sin(i * 1.7) * 9 + i * 3.2; d += `L${x.toFixed(1)} ${y}`; pts.push([x, y]); }
 let d2 = 'M70 30' + pts.slice(1).map(([x, y], i) => `L${(x + 16 + Math.sin(i) * 7).toFixed(1)} ${y}`).join(''), days = '';
 for (let k = 0; k < 11; k++){ const [x, y] = pts[1 + k * 2]; days += `<path d="M${(x - 5).toFixed(1)} ${y - 2}l11 ${(3 + r() * 3).toFixed(1)}" stroke="#a8321f" stroke-width="1.5" stroke-linecap="round" opacity=".8"/>` + ch(String(k + 1), x - 26 - (k > 8 ? 8 : 0), y - 7, 9, 80 + k, p); }
 return `<svg viewBox="0 0 280 350" role="img" aria-label="A notebook page: the Jamuna from Chilmari to Sirajganj, eleven moorings marked">${defs(id)}
 <g filter="url(#rvg)"><path d="M10 6L272 4L274 344L8 346Z" fill="#e9e2cd"/></g>
 <g stroke="#9db0c0" stroke-width=".5" opacity=".55">${Array.from({length:19}, (_, i) => `<path d="M10 ${32 + i * 17}H273"/>`).join('')}</g><path d="M40 4V346" stroke="#c97a70" stroke-width=".6" opacity=".6"/>
 ${[40, 120, 200, 280].map(y => `<circle cx="22" cy="${y}" r="5" fill="#0c0a08" opacity=".85"/>`).join('')}
 <path d="${d}" fill="none" stroke="#33343c" stroke-width="1.3" opacity=".8" stroke-linejoin="round"/><path d="${d2}" fill="none" stroke="#33343c" stroke-width="1.1" opacity=".7" stroke-linejoin="round"/>
 <path d="M150 150l14 6l-12 9l15 5" fill="none" stroke="#33343c" stroke-width=".9" opacity=".6"/>
 ${days}${ch('CHILMARI', 96, 14, 9.6, 61, p)}${ch('SIRAJGANJ', 172, 318, 9.6, 62, p)}${ch('JAMUNA', 190, 96, 9, 63, {...p, o:.6, rot:74})}${ch('CHAR', 172, 152, 8, 64, p)}
 ${ch('11 DAYS · 160 KM', 136, 208, 8.4, 65, p)}${ch('1 BOAT · CREW OF 4', 136, 227, 8.4, 66, p)}${ch('WIND NOISE DAY 6', 136, 250, 7.6, 67, {...p, c:'#a8321f'})}
 ${lit(id, 'M10 6L272 4L274 344L8 346Z')}</svg>`; }

// the crew of a small documentary, as a camera assistant keeps them: strips of white camera tape, torn by hand, lettered in marker,
// the role small in red and the name in black, stuck down in a ragged run. No two strips are the same length or sit at the same angle.
function strips(list){ const r = rng(41); let y = 8, out = '', W = 0;
 list.forEach(([a, b], i) => { const A = hand(a, {size:9, seed:90 + i, slant:-4, jit:.4}), B = hand(b, {size:14, seed:120 + i, slant:-7, jit:.5});
  const h = 32, w = 14 + A.w + 12 + B.w + 16, x = 6 + r() * 26 + (i % 2 ? 30 : 0) + (i === 3 ? 44 : 0), rot = (r() - .5) * 3.6, L = [], Rr = [];
  for (let k = 0; k <= 6; k++){ L.push(`${(r() * 5).toFixed(1)} ${(k * h / 6).toFixed(1)}`); Rr.unshift(`${(w - r() * 5).toFixed(1)} ${(k * h / 6).toFixed(1)}`); }
  const d = 'M' + L.concat(Rr).join('L') + 'Z';
  out += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(2)})"><path d="${d}" fill="#000" opacity=".6" transform="translate(5 4)" filter="url(#tpb)"/><path d="${d}" fill="#e8e0c9"/><path d="${d}" fill="url(#tpl)"/>
   <g filter="url(#tpn)" opacity=".5"><path d="${d}" fill="#7a6a4a"/></g>
   <g transform="translate(12 13)" fill="none" stroke="#a8321f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity=".9">${A.svg}</g>
   <g transform="translate(${(12 + A.w + 12).toFixed(1)} 9)" fill="none" stroke="#1b1a1d" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" opacity=".92">${B.svg}</g></g>`;
  W = Math.max(W, x + w + 12); y += h + 4 + r() * 8; });
 return `<svg class="strips" viewBox="0 0 ${Math.ceil(W)} ${Math.ceil(y + 10)}" style="width:${Math.ceil(W * 1.06)}px" aria-hidden="true"><defs><filter id="tpb" x="-10%" y="-40%" width="120%" height="190%"><feGaussianBlur stdDeviation="2.6"/></filter>
  <filter id="tpn"><feTurbulence type="fractalNoise" baseFrequency=".06 .9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .7 -.24"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  <linearGradient id="tpl" x1="0" y1=".8" x2="1" y2=".2"><stop offset="0" stop-color="#ffcf96" stop-opacity=".34"/><stop offset=".4" stop-color="#ffcf96" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></linearGradient></defs>${out}</svg>`; }

// the house, counted: every film since 2014 is a can on the shelf, seen from the side. Sixty-three small cans of commercials in four
// stacks, nine documentaries, two series, one feature, and on top of it the open can of the one still in the edit, its film hanging out.
// The low light comes from the left as it does on the papers, so every stack throws its shadow to the right along the wall.
function shelf(){ const r = rng(2014), Y = 168, PAL = ['#8a8982', '#75746d', '#9b9990', '#84837c', '#6f6e68', '#1d1c1a', '#2a2826', '#8a8982', '#7b7a73', '#b98f30', '#6a4a36', '#93918a']; let wall = '', cans = '';
 const stack = (x0, w, h, n, lean, pal = PAL) => { let y = Y, out = '', lo = 1e9, hi = -1e9;
  for (let i = 0; i < n; i++){ y -= h; const x = x0 + Math.sin(i * .5 + x0) * lean + (r() - .5) * lean * 1.6, c = pal[Math.floor(r() * pal.length)], lid = h * .42; lo = Math.min(lo, x - 1.4); hi = Math.max(hi, x + w + 1.4);
   out += `<rect x="${x.toFixed(1)}" y="${(y + lid - .3).toFixed(1)}" width="${w}" height="${(h - lid + .3).toFixed(1)}" rx="1.6" fill="${c}"/><rect x="${(x - 1.4).toFixed(1)}" y="${y.toFixed(1)}" width="${w + 2.8}" height="${lid.toFixed(1)}" rx="1.5" fill="${c}"/>`;
   if (r() > .66){ const lw = w * (.16 + r() * .22), lx = x + w * .1 + r() * (w * .8 - lw); out += `<rect x="${lx.toFixed(1)}" y="${(y + lid + .4).toFixed(1)}" width="${lw.toFixed(1)}" height="${(h - lid - 1.2).toFixed(1)}" fill="#e6dec6" opacity=".88"/>`; }
   out += `<rect x="${(x - 1.4).toFixed(1)}" y="${y.toFixed(1)}" width="${w + 2.8}" height="${h}" fill="url(#shl)"/><rect x="${(x - 1.4).toFixed(1)}" y="${y.toFixed(1)}" width="${w + 2.8}" height=".7" fill="#ffe9cc" opacity=".3"/><rect x="${x.toFixed(1)}" y="${(y + h - 1).toFixed(1)}" width="${w}" height="1" fill="#000" opacity=".45"/>`; }
  wall += `<path d="M${(lo + 16).toFixed(1)} ${Y}V${(y + 5).toFixed(1)}H${(hi + 12 + (Y - y) * .34).toFixed(1)}L${(hi + 20 + (Y - y) * .5).toFixed(1)} ${Y}Z" fill="#000" opacity=".66" filter="url(#shb)"/>`; cans += out; return y; };
 [10, 88, 166, 244].forEach((x, i) => stack(x, 66, 8.2, i === 3 ? 15 : 16, 2.2));
 stack(352, 98, 11, 8, 2.6); stack(592, 122, 13, 2, 1.6, ['#75746d', '#282623']); const ft = stack(790, 150, 16, 1, 0, ['#8a8982']);
 // the one in the edit: an open can on the finished feature, its lid stood against the wall, the roll proud of the rim and a length of film let down over the shelf
 const face = (cx, R, tilt, sq, c, label) => `<g transform="translate(${cx} ${Y - R}) rotate(${tilt} 0 ${R})"><ellipse cx="${(9 * sq + 9).toFixed(1)}" cy="5" rx="${(R * sq).toFixed(1)}" ry="${R}" fill="#000" opacity=".6" filter="url(#shb)"/><ellipse rx="${(R * sq).toFixed(1)}" ry="${R}" fill="${c}"/><ellipse rx="${(R * sq).toFixed(1)}" ry="${R}" fill="url(#shf)"/>
   ${[.93, .8, .3].map((k, i) => `<ellipse rx="${(R * sq * k).toFixed(1)}" ry="${(R * k).toFixed(1)}" fill="none" stroke="${i ? '#000' : '#ffe9cc'}" stroke-width="${i ? .9 : 1.1}" opacity="${i ? .3 : .34}"/>`).join('')}${label}</g>`;
 // the ninth documentary is stood on its rim against the other eight, face to the room, so the eye knows what the stacks are made of
 const ninth = face(487, 31, 7, 1, '#84837c', `<g transform="rotate(-11)"><rect x="-17" y="-8" width="34" height="16" fill="#e6dec6"/><rect x="-17" y="-8" width="34" height="3.400" fill="#a8321f"/><path d="M-13 1h20M-13 4.600h14" stroke="#3a342c" stroke-width="1" opacity=".7"/></g>`);
 const open = ninth + face(962, 76, 7, .26, '#7b7a73', '') + `
  <rect x="806" y="${ft - 9}" width="118" height="9" rx="1" fill="#16100c"/>${[0, 1, 2, 3].map(i => `<rect x="806" y="${(ft - 7.6 + i * 2).toFixed(1)}" width="118" height=".5" fill="#5a4636" opacity=".7"/>`).join('')}<rect x="806" y="${ft - 9}" width="118" height="9" fill="url(#shl)"/>
  <rect x="794" y="${ft - 5}" width="142" height="5" rx=".8" fill="#9b9990"/><rect x="794" y="${ft - 5}" width="142" height="5" fill="url(#shl)"/>
  <path d="M922 ${ft - 6}c20 -22 34 -6 30 18s-22 30 -16 ${Y - ft + 42}" fill="none" stroke="#17110d" stroke-width="6"/><path d="M922 ${ft - 6}c20 -22 34 -6 30 18s-22 30 -16 ${Y - ft + 42}" fill="none" stroke="#e9d9b8" stroke-width="3.600" stroke-dasharray="1.400 2.600" opacity=".4"/>`;
 const tag = hand('SINCE 2014', {size:11, seed:44, slant:-5, jit:.4});
 return `<svg viewBox="0 0 1000 214" aria-hidden="true"><defs><filter id="shb" x="-30%" y="-30%" width="170%" height="170%"><feGaussianBlur stdDeviation="7"/></filter>
  <linearGradient id="shl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffcf96" stop-opacity=".62"/><stop offset=".1" stop-color="#ffcf96" stop-opacity=".14"/><stop offset=".5" stop-color="#000" stop-opacity=".06"/><stop offset="1" stop-color="#000" stop-opacity=".66"/></linearGradient>
  <radialGradient id="shw" gradientUnits="userSpaceOnUse" cx="-90" cy="236" r="780"><stop offset="0" stop-color="#ffa858" stop-opacity=".36"/><stop offset=".4" stop-color="#ff9646" stop-opacity=".11"/><stop offset=".78" stop-color="#ff9646" stop-opacity="0"/></radialGradient><linearGradient id="shf" x1="0" y1=".7" x2="1" y2=".3"><stop offset="0" stop-color="#ffcf96" stop-opacity=".5"/><stop offset=".4" stop-color="#ffcf96" stop-opacity=".04"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></linearGradient>
  <linearGradient id="shp" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a5e3e"/><stop offset=".45" stop-color="#4a3724"/><stop offset="1" stop-color="#1e160e"/></linearGradient>
  <linearGradient id="shu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".7"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs>
  <rect x="-700" y="-560" width="2300" height="${Y + 560}" fill="url(#shw)"/>${wall}${cans}${open}
  <rect x="-40" y="${Y}" width="1080" height="20" fill="url(#shp)"/><rect x="-40" y="${Y}" width="1080" height="1" fill="#ffe2bd" opacity=".34"/><rect x="-40" y="${Y + 20}" width="1080" height="26" fill="url(#shu)"/>
  <g transform="translate(22 ${Y + 1.500}) rotate(-1.200)"><path d="M0 1L3 0L${(tag.w + 22).toFixed(1)} .6L${(tag.w + 24).toFixed(1)} 22L1.500 22.500Z" fill="#e8e0c9"/><g transform="translate(11 5.400)" fill="none" stroke="#1b1a1d" stroke-width="1.600" stroke-linecap="round" stroke-linejoin="round">${tag.svg}</g></g></svg>`; }

const FILMS = [
 {img:'gateweave-roofs', n:'01', t:'Rooftop Pigeons', k:'Short documentary · 2025 · 14 min', r:2.6, lay:'a', obj:slate, cap:'The slate, roll A014',
  s:'Every afternoon at four, the men of one Old Dhaka lane climb to their roofs and send their pigeons up against the neighbours’. We spent a winter on those roofs.',
  c:[['Director', 'Rumana Haque'], ['Photography', 'Tobi Okafor'], ['Edit', 'Farhan Aziz'], ['Sound', 'Mitu Das'], ['Shown at', 'Sheffield DocFest, Dhaka DocLab']]},
 {img:'gw-loom', n:'02', t:'The Last Jamdani Loom', k:'Brand film · 2024 · 3 min', r:2.4, tall:1, obj:report, cap:'Camera report, roll 7',
  s:'One weaver, one sari, eleven weeks. Shot on 16mm in a tin shed in Rupganj, with the shuttle filmed at 96 frames a second so you can see the thread decide.',
  c:[['Director', 'Shafiq Rahman'], ['Photography', 'Irina Petrova'], ['Edit', 'Farhan Aziz'], ['For', 'Taant, Rupganj'], ['Stock', 'Kodak 250D, 16mm, 9 rolls']]},
 {img:'gw-kitchen', n:'03', t:'Monsoon Kitchen', k:'Series · six episodes · 2023', r:-1.6, lay:'b', obj:masters, cap:'The six masters, and the card that travels with them',
  s:'Six kitchens across Bangladesh, each filmed on the first week of the rains, each cooking the dish that only makes sense when it pours.',
  c:[['Series director', 'Nusrat Karim'], ['Photography', 'Tobi Okafor'], ['Edit', 'Leah Brandt'], ['Running time', '6 × 24 min'], ['For', 'a UK broadcaster, then Chorki']]},
 {img:'gw-bus', n:'04', t:'Night Bus to Sylhet', k:'Feature · 2022 · 94 min', r:1.2, obj:cert, cap:'Certificate and a first-night stub',
  s:'A conductor on the overnight coach finds a schoolgirl travelling alone and decides, somewhere after Bhairab bridge, that she is his problem until morning.',
  c:[['Written and directed by', 'Shafiq Rahman'], ['Starring', 'Aminul Shikder, Raisa Noor'], ['Photography', 'Irina Petrova'], ['Edit', 'Leah Brandt'], ['Release', '35mm, five reels, 41 screens']]},
 {img:'gw-launch', n:'05', t:'Launch', k:'Commercial · 2021 · 60 sec', r:-1.4, lay:'c', obj:clock, cap:'The clock, final master',
  s:'Sixty seconds for a ferry company, filmed in one night at Sadarghat: a deckhand, a rope, and three hundred people who all want to be on the same boat.',
  c:[['Director', 'Rumana Haque'], ['Photography', 'Tobi Okafor'], ['Client', 'Nouka Ghat Ferries'], ['Agency', 'direct to client'], ['Delivered', '60, 30 and 15 second cuts']]},
 {img:'gw-char', n:'06', t:'Eleven Days on the River', k:'Documentary · 2019 · 52 min', r:2.8, tall:1, obj:river, cap:'The recordist’s river log',
  s:'One boat down the Jamuna from Chilmari to Sirajganj, stopping each night on a sand island that may not be there next year, with the families who farm it anyway.',
  c:[['Director', 'Nusrat Karim'], ['Photography', 'Irina Petrova'], ['Sound', 'Mitu Das'], ['Edit', 'Farhan Aziz'], ['Shown at', 'IDFA, Kolkata International']]}];

// the credits as an end roll; "ph" keeps a roll for readers and for phones where the object's own lettering is too small to read
const roll = (c, cls = '') => `<dl class="roll${cls ? ' ' + cls : ''}">${c.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl>`;
const head = f => `<p class="k">${f.n} / 06 · ${f.k}</p><h2>${f.t}</h2>`;
const fig = f => `<figure class="obj${f.tall ? ' tall' : ''}">${f.obj()}<figcaption>${f.cap}</figcaption></figure>`;
const LAY = {
 base: f => `${fig(f)}<div class="tx">${head(f)}<p class="sy">${f.s}</p>${roll(f.c)}</div>`,
 a: f => `<div class="tx">${head(f)}<p class="sy">${f.s}</p>${strips(f.c)}${roll(f.c, 'sr')}</div>${fig(f)}`,
 b: f => `<div class="tx hd">${head(f)}</div><p class="sy">${f.s}</p><div class="cluster">${fig(f)}<figure class="card">${card3(f)}</figure></div>${roll(f.c, 'ph')}`,
 c: f => `<div class="tx hd">${head(f)}</div>${fig(f)}<p class="sy">${f.s}</p>${roll(f.c, 'ph')}`};
const MAKE = [['Commercials and brand films', '15 seconds to 4 minutes', '63', ''], ['Documentaries', '14 to 90 minutes', '9', ''], ['Series', 'six half hours', '2', ''], ['Features', 'one every few years', '1', ', and one in the edit']];

const host = document.getElementById('papers');
host.innerHTML = FILMS.map((f, i) => `<section class="s pp${f.lay ? ' l' + f.lay : ''}" id="p${i + 1}" style="--r:${f.r}deg" aria-label="${f.t}">
 <div class="bg" style="background-image:url(../img/${f.img}.webp)"></div><div class="sun"></div>${LAY[f.lay || 'base'](f)}</section>`).join('')
 + `<section class="s pp house" id="house" aria-label="What the house makes">
 <div class="tx"><p class="k">The house</p><h2>Eleven people, two cutting rooms, one projector that still runs.</h2>
 <figure class="shelf" aria-hidden="true">${shelf()}<div class="caps">${MAKE.map(([a, b, n, x]) => `<p><b>${n}${x ? `<small>${x}</small>` : ''}</b><span>${a}</span><i>${b}</i></p>`).join('')}</div></figure>
 <table class="sr"><thead><tr><th>We make</th><th>Usually</th><th>Since 2014</th></tr></thead><tbody>${MAKE.map(([a, b, n, x]) => `<tr><td>${a}</td><td>${b}</td><td>${n}${x}</td></tr>`).join('')}</tbody></table>
 <div class="units"><div><p class="k">Dhaka unit</p><p>House 14, Road 6, Dhanmondi<br>Camera, sound and the 35mm room</p></div><div><p class="k">London unit</p><p>Third floor, 9 Redchurch Street, E2<br>Edit, grade and the mix</p></div></div></div></section>`;

// each paper lifts a little as its room arrives, as a hand would square it on the bench
const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('in', e.isIntersecting)), {threshold:.3});
host.querySelectorAll('.pp').forEach(s => io.observe(s));
