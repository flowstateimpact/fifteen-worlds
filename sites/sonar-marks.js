// sonar-marks.js · the second act: the inside of a hammered 22 carat band under the bench lamp (light from the upper left), magnified,
// with its five punched marks. A UK hallmark has three compulsory marks (sponsor, fineness, assay office); the crown and the year letter
// are optional. Each punch is a sunk shield with the device left standing in it, so the upper left wall is in shadow and the lower right catches light.
// P41: a rim of light ran right round every pit, which made each one a framed badge. A pit has two walls that show: the near one dark, the far one lit.
const el = document.getElementById('marks');
let sd = 11; const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
const band = 'M-20 96Q550 58 1120 96V264Q550 226 -20 264Z';
// planishing: the band is closed up with a round-faced hammer, so the surface is a field of shallow dishes that overlap. Each dish is
// drawn only by the lamp: its near slope (upper left) falls away from the light, its far slope (lower right) faces it. Verdict 13: the
// straight-edged planes read as a 3D mesh, so they are gone.
const dm = [...Array(170)].map(() => { const x = -20 + rnd() * 1140, y = 66 + rnd() * 204, r = 14 + rnd() * 18; return `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${r.toFixed(0)}" ry="${(r * (.74 + rnd() * .3)).toFixed(0)}" fill="url(#sn-dm)" opacity="${(.4 + rnd() * .6).toFixed(2)}"/>`; }).join('');
const scr = [...Array(26)].map(() => { const x = rnd() * 1100, y = 90 + rnd() * 160, w = 30 + rnd() * 140; return `<path d="M${x.toFixed(0)} ${y.toFixed(0)}l${w.toFixed(0)} ${(rnd() * 8 - 4).toFixed(1)}" stroke="#fff3cf" stroke-width=".5" opacity="${(.1 + rnd() * .25).toFixed(2)}"/>`; }).join('');
const SH = { rect: 'M-44 -30H44V30H-44Z', oct: 'M-32 -30H32L44 -18V18L32 30H-32L-44 18V-18Z', shield: 'M-36 -32H36V10L0 36L-36 10Z', cut: 'M-26 -32H26L38 -20V14L0 36L-38 14V-20Z', round: 'M-40 -14A14 14 0 0 1 -26 -30H26A14 14 0 0 1 40 -14V14A14 14 0 0 1 26 30H-26A14 14 0 0 1 -40 14Z' };
const G = [
 ['rect', `<text y="11" class="mk">SNR</text>`],
 ['round', `<path class="mg" d="M-24 16V-4L-12 8L0 -16L12 8L24 -4V16ZM-24 20H24V24H-24Z"/><circle class="mg" cx="0" cy="-19" r="3"/><circle class="mg" cx="-24" cy="-8" r="2.600"/><circle class="mg" cx="24" cy="-8" r="2.600"/>`],
 ['oct', `<text y="11" class="mk">916</text>`],
 ['cut', `<path class="mg" fill-rule="evenodd" d="M-11 -15Q0 -17.500 11 -15Q13 -19.500 18 -20.500L23 -19Q23 -12 19.500 -7.500L22.500 -1L18.500 2L21.500 6.500L16.500 8L15.500 11.500Q14 22.500 0 22.500Q-14 22.500 -15.500 11.500L-16.500 8L-21.500 6.500L-18.500 2L-22.500 -1L-19.500 -7.500Q-23 -12 -23 -19L-18 -20.500Q-13 -19.500 -11 -15ZM-16 -8Q-9 -6.500 -3.500 -1.500Q-14 2.500 -16 -8ZM16 -8Q9 -6.500 3.500 -1.500Q14 2.500 16 -8ZM-5.500 4H5.500L1.500 9.500V12.500H8V15.500H-8V12.500H-1.500V9.500Z"/>`],
 ['shield', `<text y="9" class="mk" style="font-style:italic;font-size:36px">b</text>`]];
// a struck mark is a pit: the punch drives a shield-shaped hole into the gold and leaves the device standing at the old surface level.
// Verdict 13: it is one metal, so nothing in it is black and nothing is outlined. The floor is the band's own gold one to two stops down;
// the near (upper left) wall is in its own shade and throws a soft shadow onto the floor; the far (lower right) wall is a thin line that
// catches the lamp, brightest where it faces it squarely; the device is the band's own surface, lit on its near edge, shading the floor behind it.
const mark = (k) => { const x = 110 + k * 220, y = 176 - Math.abs(k - 2) * -4 - 8, [s, g] = G[k];
 return `<g transform="translate(${x} ${y}) rotate(${[-2, 1.500, -.8, 2, -1.200][k]})"><path d="${SH[s]}" fill="url(#sn-sunk)"/>
 <g clip-path="url(#sn-c${k})"><path d="${SH[s]}" fill="none" stroke="#2a1b04" stroke-width="13" transform="translate(3.4 4)" opacity=".5" filter="url(#sn-w)"/>
 <path d="${SH[s]}" fill="none" stroke="url(#sn-near)" stroke-width="3"/><path d="${SH[s]}" fill="none" stroke="url(#sn-far)" stroke-width="3.4"/>
 <g transform="translate(2.2 2.6)" class="msh">${g}</g><g transform="translate(-.8 -.9)" class="dvl">${g}</g><g class="dv">${g}</g></g><text y="-48" class="mn">${k + 1}</text></g>`; };
const svg = `<svg viewBox="0 0 1100 320" role="img" aria-label="The inside of a hammered gold band, magnified, with five punched marks: the maker's mark SNR, a crown, 916, a leopard's head and the letter b"><defs>
 <linearGradient id="sn-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6d2"/><stop offset=".06" stop-color="#f0d07a"/><stop offset=".38" stop-color="#d7ac4a"/><stop offset=".78" stop-color="#99701f"/><stop offset=".95" stop-color="#6d4c10"/><stop offset="1" stop-color="#c79c45"/></linearGradient>
 <linearGradient id="sn-lamp" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="rgba(255,236,190,.5)"/><stop offset=".4" stop-color="rgba(255,220,150,0)"/><stop offset="1" stop-color="rgba(14,8,0,.6)"/></linearGradient>
 <linearGradient id="sn-sunk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#644f1f"/><stop offset=".5" stop-color="#80652a"/><stop offset="1" stop-color="#967833"/></linearGradient>
 <linearGradient id="sn-near" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b1c05" stop-opacity=".9"/><stop offset=".42" stop-color="#2b1c05" stop-opacity=".6"/><stop offset=".58" stop-color="#2b1c05" stop-opacity="0"/></linearGradient>
 <linearGradient id="sn-far" x1="0" y1="0" x2="1" y2="1"><stop offset=".45" stop-color="#ffe7a6" stop-opacity="0"/><stop offset=".7" stop-color="#ffe7a6" stop-opacity=".7"/><stop offset=".86" stop-color="#fff3cf" stop-opacity="1"/><stop offset="1" stop-color="#ffe7a6" stop-opacity=".5"/></linearGradient>
 <linearGradient id="sn-dm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a2504" stop-opacity=".3"/><stop offset=".45" stop-color="#3a2504" stop-opacity="0"/><stop offset=".6" stop-color="#fff3cf" stop-opacity="0"/><stop offset="1" stop-color="#fff3cf" stop-opacity=".36"/></linearGradient>
 <linearGradient id="sn-fg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1100" y2="0"><stop offset=".84" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><mask id="sn-fade"><rect x="-20" y="0" width="1140" height="320" fill="url(#sn-fg)"/></mask>
 <filter id="sn-w" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.2"/></filter><filter id="sn-dmb" x="-5%" y="-20%" width="110%" height="140%"><feGaussianBlur stdDeviation="1.8"/></filter>
 <style>.mk-f .dv .mk,.mk-f .dv .mg{fill:#d9b354}.mk-f .dvl .mk,.mk-f .dvl .mg{fill:#f8e3a0}.mk-f .dvl .md{display:none}.mk-f .msh .mk,.mk-f .msh .mg{fill:#2a1b04;opacity:.6}.mk-f .dv .md{fill:#5a4315}</style>
 <clipPath id="sn-band"><path d="${band}"/></clipPath>${G.map(([s], k) => `<clipPath id="sn-c${k}"><path d="${SH[s]}"/></clipPath>`).join('')}
 <filter id="sn-b" x="-10%" y="-40%" width="120%" height="200%"><feGaussianBlur stdDeviation="14"/></filter></defs>
 <g mask="url(#sn-fade)"><path d="${band}" transform="translate(14 30)" fill="rgba(0,0,0,.8)" filter="url(#sn-b)"/>
 <path d="${band}" fill="url(#sn-gold)"/><g clip-path="url(#sn-band)"><g filter="url(#sn-dmb)">${dm}</g>${scr}<rect x="-20" y="50" width="1140" height="230" fill="url(#sn-lamp)"/>${[0, 1, 2, 3, 4].map(mark).join('')}</g></g></svg>`;
const L = [['Who made it', 'Our own mark, SNR, registered at Goldsmiths\' Hall.'], ['That it is gold', 'The crown. Optional these days. We keep it.'], ['How pure', '916 parts in a thousand, which is 22 carat.'], ['Where it was tested', 'The leopard\'s head means London.'], ['When', 'One letter for the year it was marked.']];
el.innerHTML = `<div class="mk-h sda"><p class="k">Inside the band · under the loupe</p><h2>Five marks, struck into every piece.</h2></div>
 <div class="mk-w sda"><figure class="mk-f">${svg}</figure><ol class="mk-l">${L.map(([a, b]) => `<li><b>${a}</b><span>${b}</span></li>`).join('')}</ol></div>
 <div class="mk-b sda"><div><h3>Your size</h3><p>UK sizes H to Z, and the halves between. We post a set of sizers, free. Wear one for a whole day: a finger is not the same at night as in the morning.</p></div>
 <div><h3>Six weeks</h3><p>One for the drawing and the weighing. Three at the bench. One at the Assay Office, for testing and marking. One to finish.</p></div>
 <div><h3>Your own gold</h3><p>We test it first and melt it by itself, never mixed. What is not used comes back to you, weighed in front of you.</p></div>
 <div><h3>Paying</h3><p>Half to begin, half when you collect. The price is fixed on the day the gold is weighed.</p></div></div>`;
