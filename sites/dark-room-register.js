// dark-room-register.js · Dark Room's second act: the school's accession register, open at the casts. Iron-gall ink gone brown, later hands in
// pencil, a tick beside each cast you passed on the walk. The room is still dark: the page is read by the same torch, which follows the pointer.
// Beside it, the hours and tonight's timed entries: eight torches a slot, so eight people. Every entry here is fictional.
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
host.innerHTML = `<div class="rg-l"><p class="rg-c">The register, page 47. Move the torch across it.</p><div class="pg" id="pg"><div class="dim">${page()}</div><div class="lit" aria-hidden="true">${page().replace(/id="rg/g, 'id="rh').replace(/#rg/g, '#rh')}</div></div></div>
<div class="rg-r"><h2>Twelve casts.<br><i>One torch each.</i></h2>
 <p>Eight people go in every twenty minutes, because there are eight torches. The five you walked past are ticked. The other seven are further in.</p>
 <table><tbody><tr><td>Tuesday, Wednesday</td><td>12:00 to 18:00</td></tr><tr class="late"><td>Thursday, late</td><td>12:00 to 23:00</td></tr><tr><td>Friday to Sunday</td><td>10:00 to 18:00</td></tr><tr><td>Monday</td><td>dark</td></tr></tbody></table>
 <p class="k">This Thursday · torches left</p>
 <ol class="slots">${SLOTS.map(([t, n]) => `<li class="${n ? '' : 'full'}"><a href="#"${n ? '' : ' aria-disabled="true"'}><b>${t}</b><span>${n ? n + ' left' : 'full'}</span><i>${'<u></u>'.repeat(n)}${'<s></s>'.repeat(8 - n)}</i></a></li>`).join('')}</ol></div>`;
const pg = document.getElementById('pg');
const aim = (x, y) => { const b = pg.getBoundingClientRect(); pg.style.setProperty('--mx', ((x - b.left) / b.width * 100).toFixed(1) + '%'); pg.style.setProperty('--my', ((y - b.top) / b.height * 100).toFixed(1) + '%'); };
addEventListener('pointermove', e => aim(e.clientX, e.clientY), {passive:true});
// with no pointer (a phone), the torch walks down the page as you scroll past it
addEventListener('scroll', () => { if (matchMedia('(hover:hover)').matches) return; const b = pg.getBoundingClientRect(), k = Math.max(0, Math.min(1, (innerHeight * .62 - b.top) / (b.height + innerHeight * .2))); pg.style.setProperty('--mx', (28 + 40 * Math.sin(k * 5)).toFixed(1) + '%'); pg.style.setProperty('--my', (k * 100).toFixed(1) + '%'); }, {passive:true});
