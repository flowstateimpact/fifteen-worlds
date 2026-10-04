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
const pin = (x, y) => `<ellipse cx="${x + 9}" cy="${y + 6}" rx="8" ry="3" fill="rgba(0,0,0,.45)"/><circle cx="${x}" cy="${y}" r="5" fill="url(#tn-brass)"/><circle cx="${x - 1.5}" cy="${y - 1.5}" r="1.4" fill="#fff6d8"/>`;
// P45 · the cloth hangs. Six pins: four along the top, two at the bottom corners. Between the pins the top edge sags by its own span,
// the bottom bellies, the two cut ends draw in at the waist, and every edge wavers the way a hand-thrown weft does. Everything on the
// cloth (the gold paar lines, the four woven panels, the tag strings) rides the same sag, so nothing looks pasted on.
const TP = [52, 360, 902, 1148], SG = .04, r1 = v => Math.round(v * 10) / 10;
const top = x => { let s = 0; if (x < TP[0]) s = (TP[0] - x) * .16; else if (x > TP[3]) s = (x - TP[3]) * .16;
  else for (let i = 0; i < 3; i++) if (x >= TP[i] && x <= TP[i + 1]){ const w = TP[i + 1] - TP[i], t = (x - TP[i]) / w; s = w * SG * 4 * t * (1 - t); }
  return 40 + s + .7 * Math.sin(x / 23) + .45 * Math.sin(x / 8.3 + 1); };
const bot = x => { const t = Math.min(1, Math.max(0, (x - 52) / 1096)); return 370 + 11 * 4 * t * (1 - t) + 1.7 * Math.sin(x / 61 + .6) + .8 * Math.sin(x / 17) + (x < 52 ? (52 - x) * .2 : x > 1148 ? (x - 1148) * .2 : 0); };
const lef = y => 40 + 3.4 * Math.sin(Math.PI * (y - 40) / 340) + .7 * Math.sin(y / 11), rig = y => 1160 - 3 * Math.sin(Math.PI * (y - 40) / 340) - .7 * Math.sin(y / 13 + 2);
const dy = (x, y) => { const v = (y - 40) / 330; return (top(x) - 40) * (1 - v) + (bot(x) - 370) * v; };
const xs = [...Array(141)].map((_, i) => 40 + i * 8), ys = [...Array(40)].map((_, i) => 48 + i * 8.4);
const line = (f, o) => 'M' + xs.map(x => `${x} ${r1(f(x) + o)}`).join('L');
const CLOTH = 'M' + [...xs.map(x => [x, top(x)]), ...ys.map(y => [rig(y), y]), ...xs.slice().reverse().map(x => [x, bot(x)]), ...ys.slice().reverse().map(y => [lef(y), y])].map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L') + 'z';
// the warp ends at the two cut edges: loose, uneven, hanging a little under their own weight
const fringe = L => [...Array(54)].map((_, i) => { const y = 44 + i * 6.1, n = 8 + (i * (L ? 7 : 5)) % 9, x = L ? lef(y) : rig(y); return `<path d="M${r1(x)} ${r1(y)}q${L ? -n * .5 : n * .5} .6 ${L ? -n : n} ${r1(1.6 + n * .34)}"/>`; }).join('');
// the selvedge, top and bottom: the weft turns back on itself here, so the edge is a denser, slightly darker cord with a bead of loops along it
const selv = (f, s) => `<path d="${line(f, s * 2.2)}" fill="none" stroke="#cdbf9f" stroke-width="4.4" opacity=".75"/><path d="${line(f, s * 4.8)}" fill="none" stroke="rgba(70,52,20,.3)" stroke-width=".7"/><path d="${line(f, s * .7)}" fill="none" stroke="#fbf6ea" stroke-width="1.5" stroke-dasharray="1.7 1.5"/>`;
// under each sag the slack gathers into shallow swags; from each pin a few pull lines fan down
const swag = TP.slice(0, 3).map((p, i) => { const w = TP[i + 1] - p, s = w * SG; return [[2.1, 13], [3, 30]].map(([k, o]) => { const d = `M${p + 6} 54Q${p + w / 2} ${r1(54 + o + k * s * 2)} ${p + w - 6} 54`; return `<path d="${d}" class="sd"/><path d="${d}" class="sl" transform="translate(-1.5 -2.6)"/>`; }).join(''); }).join('');
const pull = (x, y, dir) => [-.5, -.12, .3, .62].map((a, i) => { const l = 34 + (i * 17) % 23, ex = x + Math.sin(a) * l, ey = y + dir * Math.cos(a) * l; return `<path d="M${x} ${y}L${r1(ex)} ${r1(ey)}" class="sd"/><path d="M${x} ${y}L${r1(ex)} ${r1(ey)}" class="sl" transform="translate(-2 0)"/>`; }).join('');
const strips = k => [...Array(20)].map((_, i) => { const x = PX(k) + 2 + i * 12; return `<rect x="${x}" y="85" width="${i < 19 ? 12.5 : 12}" height="240" fill="url(#tn-p${k})" transform="translate(0 ${r1(dy(x + 6, 205))})"/>`; }).join('');
const svg = `<svg viewBox="0 0 1200 560" role="img" aria-label="The sampler: four jamdani motifs woven into one cloth, each with a tag naming the motif, its weaver, the time it takes and its price"><defs>${T.map(pat).join('')}
 <pattern id="tn-weave" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 .5h3M.5 0v3" stroke="rgba(110,88,50,.2)" stroke-width=".6"/></pattern>
 <radialGradient id="tn-brass" cx=".35" cy=".3"><stop offset="0" stop-color="#f6e2a0"/><stop offset=".6" stop-color="#b08a35"/><stop offset="1" stop-color="#4f3b12"/></radialGradient>
 <linearGradient id="tn-sun" x1="0" y1="0" x2="1" y2=".25"><stop offset="0" stop-color="rgba(255,196,120,.42)"/><stop offset=".45" stop-color="rgba(255,214,160,.08)"/><stop offset="1" stop-color="rgba(20,16,30,.42)"/></linearGradient>
 <linearGradient id="tn-fold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="rgba(0,0,0,0)"/><stop offset=".46" stop-color="rgba(60,40,10,.2)"/><stop offset=".5" stop-color="rgba(255,255,255,.4)"/><stop offset=".56" stop-color="rgba(0,0,0,0)"/></linearGradient>
 <linearGradient id="tn-belly" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(40,28,8,.2)"/><stop offset=".16" stop-color="rgba(40,28,8,0)"/><stop offset=".8" stop-color="rgba(40,28,8,0)"/><stop offset="1" stop-color="rgba(40,28,8,.16)"/></linearGradient>
 <filter id="tn-b" x="-10%" y="-20%" width="120%" height="150%"><feGaussianBlur stdDeviation="9"/></filter><filter id="tn-b2" x="-30%" y="-30%" width="160%" height="170%"><feGaussianBlur stdDeviation="4"/></filter><filter id="tn-b3" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="2.6"/></filter>
 <clipPath id="tn-c"><path d="${CLOTH}"/></clipPath></defs>
 <path d="${CLOTH}" transform="translate(18 22)" fill="rgba(0,0,0,.62)" filter="url(#tn-b)"/>
 <g stroke="#e4dac4" stroke-width=".8" opacity=".85" fill="none">${fringe(1)}${fringe(0)}</g>
 <path d="${CLOTH}" fill="#efe7d6"/><path d="${CLOTH}" fill="url(#tn-weave)"/>
 <g clip-path="url(#tn-c)">
 <path d="${line(top, 7)}${line(top, 11)}${line(bot, -11)}${line(bot, -7)}" fill="none" stroke="#c9a24b" stroke-width="1.6" opacity=".8"/>
 ${TAG.map((_, k) => strips(k)).join('')}
 <rect x="330" y="30" width="60" height="370" fill="url(#tn-fold)"/><rect x="872" y="30" width="60" height="370" fill="url(#tn-fold)"/>
 <g filter="url(#tn-b3)">${swag}${TP.map(p => pull(p, 52, 1)).join('')}${pull(52, 358, -1)}${pull(1148, 358, -1)}</g>
 <rect x="30" y="30" width="1140" height="370" fill="url(#tn-belly)"/>
 ${selv(top, 1)}${selv(bot, -1)}
 <rect x="30" y="30" width="1140" height="370" fill="url(#tn-sun)" style="mix-blend-mode:multiply"/></g>
 ${TP.map(p => pin(p, 52)).join('')}${pin(52, 358)}${pin(1148, 358)}
 ${TAG.map((t, k) => { const x = PX(k) + 30, y = 404, sy = r1(324 + dy(PX(k) + 120, 324)); return `<path d="M${PX(k) + 120} ${sy}C${PX(k) + 128} ${sy + 48} ${x + 96} 380 ${x + 92} ${y + 14}" fill="none" stroke="#d9cfb8" stroke-width="1.2"/>
  <g transform="rotate(${ROT[k]} ${x + 90} ${y})"><rect x="${x + 8}" y="${y + 8}" width="180" height="136" fill="rgba(0,0,0,.6)" filter="url(#tn-b2)"/><path d="M${x + 14} ${y}h152l14 14v122h-180v-122z" fill="#dcc79c"/><circle cx="${x + 90}" cy="${y + 14}" r="4.5" fill="#1b1714" stroke="#a88a52" stroke-width="2"/>
  <text x="${x + 90}" y="${y + 50}" class="tb">${t[0]}</text><text x="${x + 90}" y="${y + 70}" class="te">${t[1]} · ${t[2]}</text><path d="M${x + 14} ${y + 80}h152" stroke="#8a7446" stroke-width=".8" stroke-dasharray="2 3"/>
  <text x="${x + 90}" y="${y + 99}" class="tw">${t[3]} · ${t[4]}</text><text x="${x + 90}" y="${y + 126}" class="tp">${t[5]}</text></g>`; }).join('')}</svg>`;
el.innerHTML = `<div class="sm-h sda"><p class="k">The sampler · on the cutting board</p><h2>What each motif costs, and who carries it.</h2></div>
 <figure class="sm-f sda">${svg}</figure>
 <div class="sm-b sda"><ol><li><b>You choose</b> a motif, a ground (undyed, indigo or madder) and a border.</li><li><b>Half is paid on the first day</b> and goes to the weaver that week.</li><li><b>She sends a photograph</b> when the border is done, and again at every arm's length.</li><li><b>It arrives</b> with her name sewn into the label.</li></ol>
 <div class="tk"><i class="tkp"></i><dl><div><dt>Length</dt><dd>Six yards, with a blouse piece</dd></div><div><dt>Thread</dt><dd>100-count cotton, starched with rice and dried in the sun</dd></div><div><dt>Who weaves</dt><dd>A master and her apprentice, side by side at one loom</dd></div><div><dt>Order</dt><dd><a href="#">Commission a sari · from ৳ 28,000</a></dd></div></dl></div></div>`;
