// taant-sampler.js · the second act: the house sampler. A length of starched cotton pinned to the cutting board, four motifs woven into it
// thread by thread (each drawn here on the same square grid a weaver counts), and a card tag tied to each: the motif, who carries it,
// how long it takes, what it costs. Low sun from the left. Motif names from memory of the craft's own vocabulary; prices invented.
const el = document.getElementById('sampler'), C = 5;
const D5 = ['..#..', '.###.', '##o##', '.###.', '..#..'], D3 = ['.#.', '#o#', '.#.'];
const blank = n => [...Array(n)].map(() => Array(n).fill('.'));
const put = (g, s, x0, y0) => s.forEach((r, y) => [...r].forEach((ch, x) => { if (ch !== '.') g[(y0 + y + g.length) % g.length][(x0 + x + g.length) % g.length] = ch; }));
const T = [
 (() => { const g = blank(16); put(g, D5, 1, 1); put(g, D5, 9, 9); return g; })(),
 (() => { const g = blank(10); g.forEach((r, y) => r.forEach((_, x) => { const k = (x + y) % 10; if (k < 2) r[x] = '#'; else if (k === 5 && x % 2 === 0) r[x] = 'o'; })); return g; })(),
 (() => { const g = blank(14); g.forEach((r, y) => r.forEach((_, x) => { if ((x - y + 14) % 14 === 0 || (x + y) % 14 === 0) r[x] = '#'; })); put(g, D3, 6, -1); put(g, D3, -1, 6); return g; })(),
 (() => { const g = blank(6); put(g, D3, 0, 0); put(g, D3, 3, 3); return g; })()];
const INK = ['#22305e', '#9e2b25', '#22305e', '#9e2b25'];
const pat = (g, k) => `<pattern id="tn-p${k}" width="${g.length * C}" height="${g.length * C}" patternUnits="userSpaceOnUse">${g.map((r, y) => r.map((ch, x) => ch === '.' ? '' : `<rect x="${x * C + .4}" y="${y * C + .7}" width="${C - .8}" height="${C - 1.4}" rx="1" fill="${ch === 'o' ? '#c9a24b' : INK[k]}"/>`).join('')).join('')}</pattern>`;
const TAG = [['বুটিদার', 'Butidar', 'scattered flowers', 'Jahanara', '3 weeks', '৳ 28,000'], ['তেরছা', 'Tercha', 'on the diagonal', 'Sufia', '6 weeks', '৳ 46,000'], ['ঝালর', 'Jhalar', 'the net', 'Momena', '3 months', '৳ 95,000'], ['পান্না হাজার', 'Panna hazar', 'a thousand emeralds', 'Rahima', '5 months', '৳ 1,60,000']];
const PX = k => 78 + k * 270, ROT = [-4, 3, -2, 5];
const pin = (x, y) => `<ellipse cx="${x + 9}" cy="${y + 6}" rx="8" ry="3" fill="rgba(0,0,0,.45)"/><circle cx="${x}" cy="${y}" r="5" fill="url(#tn-brass)"/><circle cx="${x - 1.500}" cy="${y - 1.500}" r="1.400" fill="#fff6d8"/>`;
const fringe = x => [...Array(52)].map((_, i) => `<path d="M${x} ${46 + i * 6}h${x < 600 ? -(8 + (i * 7) % 9) : 8 + (i * 5) % 9}" />`).join('');
const svg = `<svg viewBox="0 0 1200 560" role="img" aria-label="The sampler: four jamdani motifs woven into one cloth, each with a tag naming the motif, its weaver, the time it takes and its price"><defs>${T.map(pat).join('')}
 <pattern id="tn-weave" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 .5h3M.5 0v3" stroke="rgba(110,88,50,.2)" stroke-width=".6"/></pattern>
 <radialGradient id="tn-brass" cx=".35" cy=".3"><stop offset="0" stop-color="#f6e2a0"/><stop offset=".6" stop-color="#b08a35"/><stop offset="1" stop-color="#4f3b12"/></radialGradient>
 <linearGradient id="tn-sun" x1="0" y1="0" x2="1" y2=".25"><stop offset="0" stop-color="rgba(255,196,120,.42)"/><stop offset=".45" stop-color="rgba(255,214,160,.08)"/><stop offset="1" stop-color="rgba(20,16,30,.42)"/></linearGradient>
 <linearGradient id="tn-fold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="rgba(0,0,0,0)"/><stop offset=".46" stop-color="rgba(60,40,10,.2)"/><stop offset=".5" stop-color="rgba(255,255,255,.4)"/><stop offset=".56" stop-color="rgba(0,0,0,0)"/></linearGradient>
 <filter id="tn-b" x="-10%" y="-20%" width="120%" height="150%"><feGaussianBlur stdDeviation="9"/></filter><filter id="tn-b2" x="-30%" y="-30%" width="160%" height="170%"><feGaussianBlur stdDeviation="4"/></filter></defs>
 <rect x="58" y="60" width="1128" height="330" fill="rgba(0,0,0,.6)" filter="url(#tn-b)"/>
 <g stroke="#e4dac4" stroke-width=".8" opacity=".85">${fringe(40)}${fringe(1160)}</g>
 <rect x="40" y="40" width="1120" height="330" fill="#efe7d6"/><rect x="40" y="40" width="1120" height="330" fill="url(#tn-weave)"/>
 <path d="M40 46h1120M40 50h1120M40 360h1120M40 364h1120" stroke="#c9a24b" stroke-width="1.600" opacity=".8"/>
 ${TAG.map((_, k) => `<rect x="${PX(k)}" y="84" width="240" height="240" fill="url(#tn-p${k})"/>`).join('')}
 <rect x="330" y="40" width="60" height="330" fill="url(#tn-fold)"/><rect x="872" y="40" width="60" height="330" fill="url(#tn-fold)"/>
 <rect x="40" y="40" width="1120" height="330" fill="url(#tn-sun)" style="mix-blend-mode:multiply"/>
 ${pin(52, 52)}${pin(1148, 52)}${pin(52, 358)}${pin(1148, 358)}
 ${TAG.map((t, k) => { const x = PX(k) + 30, y = 404; return `<path d="M${PX(k) + 120} 324C${PX(k) + 128} 372 ${x + 96} 380 ${x + 92} ${y + 14}" fill="none" stroke="#d9cfb8" stroke-width="1.200"/>
  <g transform="rotate(${ROT[k]} ${x + 90} ${y})"><rect x="${x + 8}" y="${y + 8}" width="180" height="136" fill="rgba(0,0,0,.6)" filter="url(#tn-b2)"/><path d="M${x + 14} ${y}h152l14 14v122h-180v-122z" fill="#dcc79c"/><circle cx="${x + 90}" cy="${y + 14}" r="4.500" fill="#1b1714" stroke="#a88a52" stroke-width="2"/>
  <text x="${x + 90}" y="${y + 50}" class="tb">${t[0]}</text><text x="${x + 90}" y="${y + 70}" class="te">${t[1]} · ${t[2]}</text><path d="M${x + 14} ${y + 80}h152" stroke="#8a7446" stroke-width=".8" stroke-dasharray="2 3"/>
  <text x="${x + 90}" y="${y + 99}" class="tw">${t[3]} · ${t[4]}</text><text x="${x + 90}" y="${y + 126}" class="tp">${t[5]}</text></g>`; }).join('')}</svg>`;
el.innerHTML = `<div class="sm-h sda"><p class="k">The sampler · on the cutting board</p><h2>What each motif costs, and who carries it.</h2></div>
 <figure class="sm-f sda">${svg}</figure>
 <div class="sm-b sda"><ol><li><b>You choose</b> a motif, a ground (undyed, indigo or madder) and a border.</li><li><b>Half is paid on the first day</b> and goes to the weaver that week.</li><li><b>She sends a photograph</b> when the border is done, and again at every arm's length.</li><li><b>It arrives</b> with her name sewn into the label.</li></ol>
 <dl><div><dt>Length</dt><dd>Six yards, with a blouse piece</dd></div><div><dt>Thread</dt><dd>100-count cotton, starched with rice and dried in the sun</dd></div><div><dt>Who weaves</dt><dd>A master and her apprentice, side by side at one loom</dd></div><div><dt>Order</dt><dd><a href="#">Commission a sari · from ৳ 28,000</a></dd></div></dl></div>`;
