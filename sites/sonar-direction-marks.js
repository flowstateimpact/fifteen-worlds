// sonar-direction-marks.js · direction copy of sonar-marks.js. Same words, same five marks, redrawn.
// The old plate painted lit metal with gradients and a blurred shadow. This one is printed in the page's two inks, the way an assay office
// prints its own guide: the band is one flat gold, every punch is a sunk shield in ink, and the device is the gold left standing inside it.
// The dishes of the planishing hammer are ink crescents, the same marks the visitor's own strikes leave on the band above.
// A UK hallmark has three compulsory marks (sponsor, fineness, assay office); the crown and the year letter are optional.
const el = document.getElementById('marks');
let sd = 11; const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
const INK = '#0b0908', GOLD = '#e6c066';
const band = 'M-20 96Q550 58 1120 96V264Q550 226 -20 264Z';
const dm = [...Array(96)].map(() => { const x = -20 + rnd() * 1140, y = 78 + rnd() * 180, r = 13 + rnd() * 17, ry = r * (.7 + rnd() * .3), per = Math.PI * 2 * Math.sqrt((r * r + ry * ry) / 2), on = per * (.34 + rnd() * .34);
 return `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${r.toFixed(0)}" ry="${ry.toFixed(0)}" fill="none" stroke="${INK}" stroke-width="${(.8 + rnd() * .9).toFixed(2)}" stroke-linecap="round" stroke-dasharray="${on.toFixed(0)} ${per.toFixed(0)}" transform="rotate(${(rnd() * 360).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`; }).join('');
const SH = { rect: 'M-44 -30H44V30H-44Z', oct: 'M-32 -30H32L44 -18V18L32 30H-32L-44 18V-18Z', shield: 'M-36 -32H36V10L0 36L-36 10Z', cut: 'M-26 -32H26L38 -20V14L0 36L-38 14V-20Z', round: 'M-40 -14A14 14 0 0 1 -26 -30H26A14 14 0 0 1 40 -14V14A14 14 0 0 1 26 30H-26A14 14 0 0 1 -40 14Z' };
const G = [
 ['rect', `<text y="11" class="mk">SNR</text>`],
 ['round', `<path class="mg" d="M-24 16V-4L-12 8L0 -16L12 8L24 -4V16ZM-24 20H24V24H-24Z"/><circle class="mg" cx="0" cy="-19" r="3"/><circle class="mg" cx="-24" cy="-8" r="2.600"/><circle class="mg" cx="24" cy="-8" r="2.600"/>`],
 ['oct', `<text y="11" class="mk">916</text>`],
 ['cut', `<path class="mg" fill-rule="evenodd" d="M-11 -15Q0 -17.500 11 -15Q13 -19.500 18 -20.500L23 -19Q23 -12 19.500 -7.500L22.500 -1L18.500 2L21.500 6.500L16.500 8L15.500 11.500Q14 22.500 0 22.500Q-14 22.500 -15.500 11.500L-16.500 8L-21.500 6.500L-18.500 2L-22.500 -1L-19.500 -7.500Q-23 -12 -23 -19L-18 -20.500Q-13 -19.500 -11 -15ZM-16 -8Q-9 -6.500 -3.500 -1.500Q-14 2.500 -16 -8ZM16 -8Q9 -6.500 3.500 -1.500Q14 2.500 16 -8ZM-5.500 4H5.500L1.500 9.500V12.500H8V15.500H-8V12.500H-1.500V9.500Z"/>`],
 ['shield', `<text y="9" class="mk" style="font-style:italic;font-size:36px">b</text>`]];
// a struck mark is a pit with the device left standing in it: the pit is ink, the device is the band's own gold. Each is a fraction off true, as a hand strikes it.
const mark = (k) => { const x = 110 + k * 220, y = 176 - Math.abs(k - 2) * -4 - 8, [s, g] = G[k];
 return `<g transform="translate(${x} ${y}) rotate(${[-2, 1.500, -.8, 2, -1.200][k]})"><path d="${SH[s]}" fill="${GOLD}" stroke="${GOLD}" stroke-width="9" stroke-linejoin="round"/><path d="${SH[s]}" fill="${INK}"/><g class="dv">${g}</g><text y="-50" class="mn" stroke="${GOLD}" stroke-width="9" stroke-linejoin="round" paint-order="stroke">${k + 1}</text></g>`; };
const svg = `<svg viewBox="0 0 1100 320" role="img" aria-label="The inside of a hammered gold band, magnified, with five punched marks: the maker's mark SNR, a crown, 916, a leopard's head and the letter b"><defs><clipPath id="sn-band"><path d="${band}"/></clipPath></defs>
 <path d="${band}" fill="${GOLD}"/><g clip-path="url(#sn-band)">${dm}</g><path d="${band}" fill="none" stroke="${INK}" stroke-width="1.6"/>${[0, 1, 2, 3, 4].map(mark).join('')}</svg>`;
const L = [['Who made it', 'Our own mark, SNR, registered at Goldsmiths\' Hall.'], ['That it is gold', 'The crown. Optional these days. We keep it.'], ['How pure', '916 parts in a thousand, which is 22 carat.'], ['Where it was tested', 'The leopard\'s head means London.'], ['When', 'One letter for the year it was marked.']];
el.innerHTML = `<div class="mk-h sda"><p class="k">Inside the band · under the loupe</p><h2>Five marks, struck into every piece.</h2></div>
 <div class="mk-w sda"><figure class="mk-f">${svg}</figure><ol class="mk-l">${L.map(([a, b]) => `<li><b>${a}</b><span>${b}</span></li>`).join('')}</ol></div>
 <div class="mk-b sda"><div><h3>Your size</h3><p>UK sizes H to Z, and the halves between. We post a set of sizers, free. Wear one for a whole day: a finger is not the same at night as in the morning.</p></div>
 <div><h3>Six weeks</h3><p>One for the drawing and the weighing. Three at the bench. One at the Assay Office, for testing and marking. One to finish.</p></div>
 <div><h3>Your own gold</h3><p>We test it first and melt it by itself, never mixed. What is not used comes back to you, weighed in front of you.</p></div>
 <div><h3>Paying</h3><p>Half to begin, half when you collect. The price is fixed on the day the gold is weighed.</p></div></div>`;
