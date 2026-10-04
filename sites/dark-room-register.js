// dark-room-register.js · Dark Room's second act: the school's accession register, open at the casts. Iron-gall ink gone brown, later hands in
// pencil, a tick beside each cast you passed on the walk. The room is still dark: the page is read by the same torch, which follows the pointer.
// Beside it, the hours and tonight's timed entries: eight torches a slot, so eight people. Every entry here is fictional.
// P45: the register lies on the porter's desk and the desk takes the torch too. The hours are the printed notice card tucked under the book;
// each entry time is a strip from the ticket roll, counterfoil first, one ticket per torch still on the hook, so the strip's length is the count.
// Shadows fall away from wherever the torch is. Looked at this session (Wikimedia Commons): "LMS Saltley to Birmingham New Street third class
// cheap day railway ticket" (dashed perforation between ticket and counterfoil, serial set at both ends), "Boletos Edmondson Tren Mitre"
// (buff and orange card, laid touching and a little out of square), "Bilhetes BUC" (tickets fanned over each other).
const host = document.getElementById('register');
const ROWS = [['1881.7', 'Acanthus capital', 'Temple of Mars Ultor, Rome', '£1 4s', 'leaf chipped, 1934', 1], ['1881.14', 'Head of a horse', 'Parthenon, east pediment', '£3', 'called Sunday', 1],
 ['1881.22', 'Memnon, bust', 'Thebes, via Bloomsbury', '£2 10s', 'nose rubbed dark by hands', 1], ['1881.31', 'A raised hand', 'from life', 'gift', 'whose, not recorded', 1], ['1881.40', 'A right foot', 'from the antique', '9s', '', 1],
 ['1884.3', 'River god, torso', 'Parthenon, west pediment', '£4', 'too heavy for the stairs'], ['1890.11', 'Discobolus, reduced', 'Rome', '£1 15s', 'left arm remade, 1951'], ['1902.5', 'Death mask', 'unknown man', 'found', 'in the kiln room'],
 ['1911.2', 'Saint George, head', 'Florence', '£1', ''], ['1926.8', 'Flayed figure', 'after Houdon', '£6', 'anatomy class, Tuesdays'], ['1947.1', 'A lion’s paw', 'Nineveh', 'exchange', 'for two easels'], ['1962.4', 'A hand', 'the caretaker’s', 'made here', 'by the last class']];
const COLS = [[18, 'No.'], [92, 'Object'], [252, 'Cast from'], [430, 'Paid'], [492, 'Remarks']];
const page = () => `<svg viewBox="0 0 680 470" role="img" aria-label="A page of the accession register listing twelve plaster casts, 1881 to 1962">
 <defs><filter id="rgp" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" seed="8"/><feColorMatrix values="0 0 0 0 .42  0 0 0 0 .33  0 0 0 0 .2  0 0 0 .5 -.14"/><feComposite in2="SourceGraphic" operator="in"/></filter>
 <filter id="rgi"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.1"/></filter>
 <linearGradient id="rgg" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset=".06" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".08"/></linearGradient></defs>
 <path d="M2 4Q340 -3 678 5L676 466Q340 472 3 465Z" fill="#e4d8ba"/><path d="M2 4Q340 -3 678 5L676 466Q340 472 3 465Z" fill="#000" filter="url(#rgp)"/><path d="M2 4Q340 -3 678 5L676 466Q340 472 3 465Z" fill="url(#rgg)"/>
 <ellipse cx="560" cy="400" rx="46" ry="30" fill="#8a6a3a" opacity=".08"/><path d="M640 0L680 0L680 44Z" fill="#000" opacity=".1"/>
 <text x="340" y="34" text-anchor="middle" font-family="'Sentient',serif" font-size="15" letter-spacing="4" fill="#3a2c1a">REGISTER OF CASTS</text><text x="340" y="50" text-anchor="middle" font-family="'Sentient',serif" font-style="italic" font-size="10" fill="#5a4630">the property of the School, entered as received</text>
 <g stroke="#a2413a" stroke-width=".7" opacity=".7"><path d="M12 64H668M12 86H668"/>${COLS.slice(1).map(c => `<path d="M${c[0] - 8} 64V452"/>`).join('')}<path d="M640 64V452"/></g>
 <g stroke="#6f86a0" stroke-width=".45" opacity=".55">${ROWS.map((_, i) => `<path d="M12 ${116 + i * 28}H668"/>`).join('')}</g>
 <g font-family="'Switzer',sans-serif" font-size="8.4" letter-spacing="1.6" fill="#4a3a26">${COLS.map(c => `<text x="${c[0]}" y="79">${c[1].toUpperCase()}</text>`).join('')}<text x="646" y="79">✓</text></g>
 <g font-family="'Sentient',serif" font-style="italic" filter="url(#rgi)">${ROWS.map((r, i) => { const y = 108 + i * 28, late = i > 8, ink = late ? '#3d3d44' : i > 5 ? '#4a3626' : '#5b3d22', o = late ? .78 : .9, dx = (i * 37 % 5) - 2;
  return `<g fill="${ink}" opacity="${o}" transform="translate(${dx} ${(i * 13 % 3) - 1}) rotate(${((i * 7 % 5) - 2) * .18} 340 ${y})"><text x="18" y="${y}" font-size="13" font-style="normal">${r[0]}</text><text x="92" y="${y}" font-size="14.5">${r[1]}</text><text x="252" y="${y}" font-size="11.6">${r[2]}</text><text x="430" y="${y}" font-size="12.5">${r[3]}</text><text x="492" y="${y}" font-size="11.5" opacity=".85">${r[4]}</text></g>`
   + (r[5] ? `<path d="M645 ${y - 6}l4 6l9 -13" fill="none" stroke="#3d3d44" stroke-width="1.5" stroke-linecap="round" opacity=".75"/>` : ''); }).join('')}</g>
 <text x="652" y="462" text-anchor="end" font-family="'Sentient',serif" font-size="10" fill="#5a4630">47</text></svg>`;
const SLOTS = [['18:00', 0], ['18:20', 3], ['18:40', 8], ['19:00', 5], ['19:20', 8], ['19:40', 1], ['20:00', 0], ['20:20', 6], ['20:40', 8], ['21:00', 8], ['21:20', 4], ['21:40', 7]];
let sd = 47; const rr = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
// the end a strip was torn at: the perforation's teeth
const TORN = `polygon(0 0,${Array.from({length:13}, (_, k) => `${k % 2 ? 'calc(100% - 2.6px)' : '100%'} ${(k / 12 * 100).toFixed(1)}%`).join(',')},0 100%)`;
const strip = ([t, n]) => `<li class="${n ? '' : 'full'}" style="--rot:${(rr() * 2.4 - 1.2).toFixed(2)}deg;--ox:${(rr() * 14 - 6).toFixed(0)}px"><a class="cs" data-lift="2.4" href="#"${n ? '' : ' aria-disabled="true"'}><span class="stub"><b>${t}</b><span>${n ? n + ' left' : 'full'}</span></span><i aria-hidden="true">${Array.from({length:n}, (_, k) => `<u>${k + 1}</u>`).join('')}</i></a></li>`;
host.innerHTML = `<div class="rg-l"><p class="rg-c">The register, page 47. Move the torch across it.</p><div class="pg cs" id="pg" data-lift="7"><div class="dim">${page()}</div><div class="lit" aria-hidden="true">${page().replace(/id="rg/g, 'id="rh').replace(/#rg/g, '#rh')}</div></div>
 <div class="hrs cs" data-lift="3"><table><tbody><tr><td>Tuesday, Wednesday</td><td>12:00 to 18:00</td></tr><tr class="late"><td>Thursday, late</td><td>12:00 to 23:00</td></tr><tr><td>Friday to Sunday</td><td>10:00 to 18:00</td></tr><tr><td>Monday</td><td>dark</td></tr></tbody></table></div></div>
<div class="rg-r"><h2>Twelve casts.<br><i>One torch each.</i></h2>
 <p>Eight people go in every twenty minutes, because there are eight torches. The five you walked past are ticked. The other seven are further in.</p>
 <p class="k">This Thursday · torches left</p>
 <ol class="slots" style="--torn:${TORN}">${SLOTS.map(strip).join('')}</ol></div>`;
// one torch for the whole desk: where it points, the page, the card and the tickets are lit, and every shadow falls away from it,
// longer the further the thing lies from the beam
const pg = document.getElementById('pg'), cs = [...host.querySelectorAll('.cs')]; let lx = 0, ly = 0, held = false, raf = 0;
const light = () => { raf = 0; const b = pg.getBoundingClientRect(), s = host.getBoundingClientRect();
 if (!held){ lx = b.left + b.width * .36; ly = b.top + b.height * .32; }
 pg.style.setProperty('--mx', ((lx - b.left) / b.width * 100).toFixed(1) + '%'); pg.style.setProperty('--my', ((ly - b.top) / b.height * 100).toFixed(1) + '%');
 host.style.setProperty('--tx', (lx - s.left).toFixed(0) + 'px'); host.style.setProperty('--ty', (ly - s.top).toFixed(0) + 'px');
 for (const o of cs){ const q = o.getBoundingClientRect(), dx = q.left + q.width / 2 - lx, dy = q.top + q.height / 2 - ly, d = Math.hypot(dx, dy) || 1, len = +o.dataset.lift * Math.min(3, .3 + d / 240);
  o.style.setProperty('--dx', (dx / d * len).toFixed(1)); o.style.setProperty('--dy', (dy / d * len).toFixed(1)); o.style.setProperty('--bl', (1 + len * .5).toFixed(1)); } };
const aim = () => { if (!raf) raf = requestAnimationFrame(light); };
const hover = matchMedia('(hover:hover)');
addEventListener('pointermove', e => { if (e.pointerType === 'touch') return; held = true; lx = e.clientX; ly = e.clientY; aim(); }, {passive:true});
// with no pointer (a phone), the torch is held at the middle of the screen and swings a little as you scroll, so it walks down the desk
addEventListener('scroll', () => { const s = host.getBoundingClientRect(); if (s.bottom < 0 || s.top > innerHeight) return;
 if (!hover.matches){ held = true; lx = innerWidth * (.5 + .24 * Math.sin(scrollY / 170)); ly = innerHeight * .44; } aim(); }, {passive:true});
addEventListener('resize', aim); document.fonts.ready.then(aim); aim();
