// gate-weave-papers.js · Gate Weave's second act: after the reel has run, the six films come back one at a time, each in the
// place it was shot (its own still, thrown out of focus behind) with one paper from its production lying in a low side light:
// the slate, the camera report, the episode masters, the certificate and ticket, the clock, the river log.
// Read first: a24films.com film pages (credit block, year, synopsis), pulsefilms.com (formats and markets), academyfilms.com (roster).
// All copy provisional until the writing chain runs. Every person, client and number here is fictional.
import {hand, rng} from './lib/hand.js';

const ch = (s, x, y, size, seed, o = {}) => `<g transform="translate(${x} ${y}) rotate(${o.rot || 0})" fill="none" stroke="${o.c || '#efeadd'}" stroke-width="${o.w || 1.5}" stroke-linecap="round" stroke-linejoin="round" opacity="${o.o || .92}"${o.f ? ` filter="url(#${o.f})"` : ''}>${hand(s, {size, seed, slant:o.slant ?? -6, jit:o.jit ?? .45}).svg}</g>`;
const defs = id => `<defs>
 <filter id="${id}g" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${id.length * 7}"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .45  0 0 0 0 .38  0 0 0 .5 -.12"/><feComposite in2="SourceGraphic" operator="in"/><feBlend in="SourceGraphic" mode="multiply"/></filter>
 <filter id="${id}c"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="1.6"/></filter>
 <linearGradient id="${id}l" x1="0" y1=".7" x2="1" y2=".2"><stop offset="0" stop-color="#ffcf96" stop-opacity=".3"/><stop offset=".45" stop-color="#ffcf96" stop-opacity=".04"/><stop offset="1" stop-color="#000" stop-opacity=".42"/></linearGradient></defs>`;
const lit = (id, d, tr = '') => `<g transform="${tr}"><path d="${d}" fill="url(#${id}l)" style="mix-blend-mode:overlay"/><path d="${d}" fill="url(#${id}l)" opacity=".55"/></g>`;
const mono = (s, x, y, size = 7, fill = '#3a342c', extra = '') => `<text x="${x}" y="${y}" font-family="'JetBrains Mono',monospace" font-size="${size}" letter-spacing=".6" fill="${fill}" ${extra}>${s}</text>`;

// 1 · the slate: black acrylic, white paint, chalk; the take before this one half wiped under the number
function slate(){ const id = 'sl'; let bars = '';
 for (let i = 0; i < 9; i++) bars += `<path d="M${-8 + i * 36} 0h18l-14 26h-18z" fill="#efeadd"/>`;
 return `<svg viewBox="0 0 300 262" role="img" aria-label="The slate from Rooftop Pigeons: roll A014, scene 22, take 3">${defs(id)}
 <clipPath id="slk"><rect width="290" height="26" rx="2"/></clipPath>
 <g transform="translate(5 34)"><rect width="290" height="26" rx="2" fill="#141311"/><g clip-path="url(#slk)">${bars}</g></g>
 <g transform="translate(5 30) rotate(-7)"><g transform="translate(0 -26)"><rect width="290" height="26" rx="2" fill="#141311"/><g clip-path="url(#slk)" transform="scale(1 -1) translate(0 -26)">${bars}</g></g><circle cx="7" cy="-2" r="3.2" fill="#8d877a"/></g>
 <rect x="5" y="62" width="290" height="194" rx="3" fill="#161513"/>
 <g stroke="#e9e3d4" stroke-width="1.4" opacity=".8"><path d="M5 108H295M5 168H295M5 212H295M110 108V168M200 108V168M150 212V256"/></g>
 <g font-family="'JetBrains Mono',monospace" font-size="7" letter-spacing="1" fill="#e9e3d4" opacity=".75"><text x="12" y="74">PROD.</text><text x="12" y="120">ROLL</text><text x="117" y="120">SCENE</text><text x="207" y="120">TAKE</text><text x="12" y="180">DIRECTOR</text><text x="12" y="224">CAMERA</text><text x="157" y="224">DATE</text></g>
 <ellipse cx="246" cy="146" rx="34" ry="15" fill="#e9e3d4" opacity=".07" filter="url(#slc)"/>
 ${ch('2', 236, 132, 26, 8, {o:.16, w:3, f:'slc'})}
 ${ch('ROOFTOP PIGEONS', 48, 80, 17, 3, {w:2, f:'slc'})}${ch('A014', 22, 130, 26, 5, {w:2.4, f:'slc'})}${ch('22', 128, 130, 26, 7, {w:2.4, f:'slc'})}${ch('3', 238, 130, 28, 9, {w:2.6, f:'slc'})}
 ${ch('R. HAQUE', 84, 182, 17, 11, {w:2, f:'slc'})}${ch('T. OKAFOR', 20, 232, 14, 13, {w:1.8, f:'slc'})}${ch('14 FEB 25', 164, 232, 14, 15, {w:1.8, f:'slc'})}
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

// 5 · the clock: what goes on the front of every commercial sent to a broadcaster, ten seconds of it, printed from the master
function clock(){ const id = 'ck'; let ticks = '';
 for (let i = 0; i < 60; i++){ const a = i * 6 * Math.PI / 180, r1 = i % 5 ? 49 : 45; ticks += `<path d="M${(Math.sin(a) * r1).toFixed(1)} ${(-Math.cos(a) * r1).toFixed(1)}L${(Math.sin(a) * 53).toFixed(1)} ${(-Math.cos(a) * 53).toFixed(1)}" stroke="#ece5d8" stroke-width="${i % 5 ? .6 : 1.3}"/>`; }
 const w = (s, x, y, size = 8, c = '#ece5d8') => mono(s, x, y, size, c);
 return `<svg viewBox="0 0 320 250" role="img" aria-label="The broadcast clock for Launch: client Nouka Ghat Ferries, sixty seconds">${defs(id)}
 <g transform="rotate(1.6 160 125)"><g filter="url(#ckg)"><rect x="6" y="8" width="308" height="232" fill="#ece6d6"/></g><rect x="20" y="22" width="280" height="180" fill="#0b0b0c"/>
 <g transform="translate(92 112)">${ticks}<circle r="53" fill="none" stroke="#ece5d8" stroke-width=".8"/><path d="M0 0L-15.6 -49.6" stroke="#ece5d8" stroke-width="2.2" stroke-linecap="round"/><circle r="3" fill="#ece5d8"/><path d="M0 -53A53 53 0 0 0 -15.6 -49.6L0 0Z" fill="#ece5d8" opacity=".16"/></g>
 ${w('CLIENT', 168, 62, 5.6, '#8f897c')}${w('NOUKA GHAT FERRIES', 168, 74)}${w('PRODUCT', 168, 94, 5.6, '#8f897c')}${w('SADARGHAT NIGHT LAUNCH', 168, 106, 7.4)}${w('TITLE', 168, 126, 5.6, '#8f897c')}${w('LAUNCH', 168, 138)}${w('DURATION', 168, 158, 5.6, '#8f897c')}${w('60"', 168, 172, 11)}${w('CLOCK NO.', 216, 158, 5.6, '#8f897c')}${w('GWP/LNCH060/010', 216, 172, 6.6)}
 ${ch('FINAL  21 OCT 21', 26, 226, 9, 33, {c:'#2b2620', w:1.2, o:.8})}${ch('1 OF 3', 240, 226, 9, 35, {c:'#a8321f', w:1.2, o:.8})}</g>
 <path d="M124 0L196 4L194 26L122 21Z" fill="#d8caa0" opacity=".78"/><path d="M-4 196L34 176L46 198L8 220Z" fill="#d8caa0" opacity=".7"/>
 ${lit(id, 'M6 8H314V240H6Z', 'rotate(1.6 160 125)')}</svg>`; }

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

const FILMS = [
 {img:'gateweave-roofs', n:'01', t:'Rooftop Pigeons', k:'Short documentary · 2025 · 14 min', r:-3.2, obj:slate, cap:'The slate, roll A014',
  s:'Every afternoon at four, the men of one Old Dhaka lane climb to their roofs and send their pigeons up against the neighbours’. We spent a winter on those roofs.',
  c:[['Director', 'Rumana Haque'], ['Photography', 'Tobi Okafor'], ['Edit', 'Farhan Aziz'], ['Sound', 'Mitu Das'], ['Shown at', 'Sheffield DocFest, Dhaka DocLab']]},
 {img:'gw-loom', n:'02', t:'The Last Jamdani Loom', k:'Brand film · 2024 · 3 min', r:2.4, tall:1, obj:report, cap:'Camera report, roll 7',
  s:'One weaver, one sari, eleven weeks. Shot on 16mm in a tin shed in Rupganj, with the shuttle filmed at 96 frames a second so you can see the thread decide.',
  c:[['Director', 'Shafiq Rahman'], ['Photography', 'Irina Petrova'], ['Edit', 'Farhan Aziz'], ['For', 'Taant, Rupganj'], ['Stock', 'Kodak 250D, 16mm, 9 rolls']]},
 {img:'gw-kitchen', n:'03', t:'Monsoon Kitchen', k:'Series · six episodes · 2023', r:-1.6, obj:masters, cap:'The six masters',
  s:'Six kitchens across Bangladesh, each filmed on the first week of the rains, each cooking the dish that only makes sense when it pours.',
  c:[['Series director', 'Nusrat Karim'], ['Photography', 'Tobi Okafor'], ['Edit', 'Leah Brandt'], ['Running time', '6 × 24 min'], ['For', 'a UK broadcaster, then Chorki']]},
 {img:'gw-bus', n:'04', t:'Night Bus to Sylhet', k:'Feature · 2022 · 94 min', r:1.2, obj:cert, cap:'Certificate and a first-night stub',
  s:'A conductor on the overnight coach finds a schoolgirl travelling alone and decides, somewhere after Bhairab bridge, that she is his problem until morning.',
  c:[['Written and directed by', 'Shafiq Rahman'], ['Starring', 'Aminul Shikder, Raisa Noor'], ['Photography', 'Irina Petrova'], ['Edit', 'Leah Brandt'], ['Release', '35mm, five reels, 41 screens']]},
 {img:'gw-launch', n:'05', t:'Launch', k:'Commercial · 2021 · 60 sec', r:-2.2, obj:clock, cap:'The clock, final master',
  s:'Sixty seconds for a ferry company, filmed in one night at Sadarghat: a deckhand, a rope, and three hundred people who all want to be on the same boat.',
  c:[['Director', 'Rumana Haque'], ['Photography', 'Tobi Okafor'], ['Client', 'Nouka Ghat Ferries'], ['Agency', 'direct to client'], ['Delivered', '60, 30 and 15 second cuts']]},
 {img:'gw-char', n:'06', t:'Eleven Days on the River', k:'Documentary · 2019 · 52 min', r:2.8, tall:1, obj:river, cap:'The recordist’s river log',
  s:'One boat down the Jamuna from Chilmari to Sirajganj, stopping each night on a sand island that may not be there next year, with the families who farm it anyway.',
  c:[['Director', 'Nusrat Karim'], ['Photography', 'Irina Petrova'], ['Sound', 'Mitu Das'], ['Edit', 'Farhan Aziz'], ['Shown at', 'IDFA, Kolkata International']]}];

const host = document.getElementById('papers');
host.innerHTML = FILMS.map((f, i) => `<section class="s pp" id="p${i + 1}" style="--r:${f.r}deg" aria-label="${f.t}">
 <div class="bg" style="background-image:url(../img/${f.img}.webp)"></div><div class="sun"></div>
 <figure class="obj${f.tall ? ' tall' : ''}">${f.obj()}<figcaption>${f.cap}</figcaption></figure>
 <div class="tx"><p class="k">${f.n} / 06 · ${f.k}</p><h2>${f.t}</h2><p class="sy">${f.s}</p>
 <dl>${f.c.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl></div></section>`).join('')
 + `<section class="s pp house" id="house" aria-label="What the house makes">
 <div class="tx"><p class="k">The house</p><h2>Eleven people, two cutting rooms, one projector that still runs.</h2>
 <table><thead><tr><th>We make</th><th>Usually</th><th>Since 2014</th></tr></thead><tbody>
 <tr><td>Commercials and brand films</td><td>15 seconds to 4 minutes</td><td>63</td></tr><tr><td>Documentaries</td><td>14 to 90 minutes</td><td>9</td></tr>
 <tr><td>Series</td><td>six half hours</td><td>2</td></tr><tr><td>Features</td><td>one every few years</td><td>1, and one in the edit</td></tr></tbody></table>
 <div class="units"><div><p class="k">Dhaka unit</p><p>House 14, Road 6, Dhanmondi<br>Camera, sound and the 35mm room</p></div><div><p class="k">London unit</p><p>Third floor, 9 Redchurch Street, E2<br>Edit, grade and the mix</p></div></div></div></section>`;

// each paper lifts a little as its room arrives, as a hand would square it on the bench
const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('in', e.isIntersecting)), {threshold:.45});
host.querySelectorAll('.pp').forEach(s => io.observe(s));
