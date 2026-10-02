// low-frequency-nav.js · Low Frequency's chapter control: the tape machine's autolocator, drawn from Nazar's read of the Studer A800 locator manual
// (review/nav/nazar-anatomy.md §1). Two displays, TAPE-POS and LOCATE ADDRESS; the counter is relative to a zero the engineer set by hand, so the
// page opens at minus four seconds, the default pre-roll. Register keys are square with the legend printed on them, and a pressed key drops flush.
// A strip of masking tape carries the engineer's shorthand for where you are (recall: studios label everything in marker on tape).
import {nav} from './lib/nav.js';
import {hand, loop, rng} from './lib/hand.js';
const N = nav(), loc = document.getElementById('loc'), n = N.list.length, reduce = N.reduce;
window.__nv = N;
document.body.style.setProperty('--dfg', N.next[5]);
const addr = N.list.map(c => c.v);   // each chapter's stored address, in tenths of a second

// seven-segment cells, gas-discharge orange; the unlit segments stay faintly visible, the way a real display shows its ghost 8s
const SEG = {a:[2,0,8,2.2], b:[9.8,1.6,2.2,8.4], c:[9.8,11.8,2.2,8.4], d:[2,19.8,8,2.2], e:[0,11.8,2.2,8.4], f:[0,1.6,2.2,8.4], g:[2,9.9,8,2.2]};
const MAP = {0:'abcdef', 1:'bc', 2:'abdeg', 3:'abcdg', 4:'bcfg', 5:'acdfg', 6:'acdefg', 7:'abc', 8:'abcdefg', 9:'abcdfg', '-':'g', ' ':''};
const cells = x0 => [...Array(6)].map((_, k) => `<g class="cell" transform="translate(${x0 + k * 19} 9) skewX(-7)">${Object.entries(SEG).map(([s, r]) => `<rect data-s="${s}" x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" rx="1.1"/>`).join('')}${k === 2 || k === 4 ? '<circle class="dp" cx="14.6" cy="21" r="1.2"/>' : ''}</g>`).join('');
const disp = (id, label) => `<div class="disp"><span class="lg">${label}</span><svg id="${id}" viewBox="0 0 128 40" aria-hidden="true"><rect class="win" x="0" y="0" width="128" height="40" rx="2"/>${cells(8)}<path class="glare" d="M70 0H96L58 40H32Z"/></svg></div>`;
const fmt = v => { const a = Math.abs(Math.round(v)), mm = Math.floor(a / 600), ss = Math.floor(a / 10) % 60, t = a % 10;
 return (v < 0 ? '-' : ' ') + String(mm).padStart(2, '0') + String(ss).padStart(2, '0') + t; };
const put = (svg, v) => { const s = fmt(v); svg.querySelectorAll('.cell').forEach((c, k) => { const on = MAP[s[k]] || ''; c.querySelectorAll('rect').forEach(r => r.classList.toggle('on', on.includes(r.dataset.s))); }); };

loc.innerHTML = `<i class="scr" style="--r:18deg"></i><i class="scr" style="--r:-40deg"></i><i class="scr" style="--r:71deg"></i><i class="scr" style="--r:4deg"></i>
 <div class="top"><svg class="tape" viewBox="0 0 150 22" aria-hidden="true"><path class="tp" d="M2 3.4L6 2.2L4.6 .8L148 1.6L146.4 3.1L149 4.6L147 20.4L148.6 21.5L3 20.8L4.8 19.2L1.4 17.6Z"/><g class="mk"></g></svg>
  <span class="led"><i></i>LOC ACT</span></div>
 <button type="button" class="dsp" aria-label="Open the index of stored addresses">${disp('pos', 'TAPE-POS')}${disp('adr', 'LOCATE ADDRESS')}</button>
 <div class="keys">${N.list.map((c, k) => `<button type="button" class="key" data-i="${k}" aria-label="${c.t}, ${fmt(c.v).trim().replace(/(\d\d)(\d\d)(\d)$/, '$1.$2.$3')}"><b>${k + 1}</b></button>`).join('')}<button type="button" class="key rcl" aria-label="Recall the index"><b>RCL</b></button></div>`;
const pos = loc.querySelector('#pos'), adr = loc.querySelector('#adr'), mk = loc.querySelector('.mk'), keys = [...loc.querySelectorAll('.key[data-i]')];
loc.querySelector('.dsp').addEventListener('click', N.open); loc.querySelector('.rcl').addEventListener('click', N.open);

// the scribble strip: the engineer's shorthand, rewritten in marker each time the tape reaches a new place
let seed = 40;
const scribble = (s, write) => { const h = hand(s, {size:11, slant:-4, seed:seed++, write}); mk.innerHTML = `<g transform="translate(${(75 - h.w / 2).toFixed(1)} 5)">${h.svg}</g>`;
 mk.classList.toggle('write', !!write && !reduce); };

// a locate: the address is set, the LOC ACT lamp lights, the tape winds; when both displays agree the lamp goes out
let locating = -1, cur = -1, shown = 0;
keys.forEach(b => b.addEventListener('click', () => { const i = +b.dataset.i; if (i === cur) return; locating = i; loc.classList.add('act'); keys.forEach((b, k) => b.classList.toggle('on', k === i)); put(adr, addr[i]); N.go(i); }));
N.on((i, c) => { const was = cur; cur = i;
 const lit = locating >= 0 ? locating : i; keys.forEach((b, k) => { b.classList.toggle('on', k === lit); b.toggleAttribute('aria-current', k === i); });
 if (locating < 0 || locating === i) put(adr, addr[i]);
 document.body.classList.toggle('at-door', i === n - 1);
 scribble(c.s, was >= 0); });

// the tape position runs with the page between the stored addresses, so the tenths roll as you scroll and the counter reads negative before the zero
const drv = document.getElementById('drv');
const topOf = i => { const c = N.list[Math.min(n - 1, i)]; return c.el ? document.querySelector(c.el).getBoundingClientRect().top + scrollY : c.at * (drv.offsetHeight - innerHeight); };
const roll = () => { const i = Math.max(0, N.index), a = addr[i], b = addr[Math.min(n - 1, i + 1)], ya = topOf(i), yb = topOf(i + 1);
 const f = yb > ya ? Math.min(1, Math.max(0, (scrollY - ya) / (yb - ya))) : 0, v = a + (b - a) * f; shown = v; put(pos, v);
 if (locating >= 0 && Math.abs(v - addr[locating]) < 1){ locating = -1; setTimeout(() => loc.classList.remove('act'), 260); keys.forEach((b, k) => b.classList.toggle('on', k === cur)); } };
let tick = false; addEventListener('scroll', () => { if (!tick){ tick = true; requestAnimationFrame(() => { tick = false; roll(); }); } }, {passive:true});
put(adr, addr[0]); roll();

// the tape box, as it really comes: a printed form in one colour, ruled fields filled in by hand, the reel number corrected, tail out ticked
const box = document.getElementById('tapebox');
if (box){ const r = rng(26), w = (t, x, y, o = {}) => { const h = hand(t, {size:o.size || 15, slant:-7, seed:Math.floor(r() * 9e5) + 1, write:true, caps:o.caps}); return {g:`<g class="ink" transform="translate(${x} ${y - (o.size || 15)})">${h.svg}</g>`, w:h.w}; };
 const P = (t, x, y, s = 11, a = 'start') => `<text x="${x}" y="${y}" font-size="${s}" text-anchor="${a}">${t}</text>`;
 let n2 = 0; const seq = g => g.replace(/--n:\d+/g, () => `--n:${n2++}`);
 const reel3 = w('3', 420, 88), reel4 = w('4', 452, 88), tones = w('1K · 10K · 100 @ 0VU = 320', 138, 274), unit = w('nWb/m', 138 + tones.w + 8, 274, {caps:false});
 const ink = [w('ROOM A', 110, 88).g, reel3.g, `<path class="ink strike" pathLength="1" style="--n:0" d="M414 80.5C422 78 431 76.4 440 74.2"/>`, reel4.g, w('STUDER A80', 110, 134).g, w('½"', 420, 134).g,
  `<path class="ink" pathLength="1" style="--n:0" d="${loop(166, 174, 17, 13, 5)}"/>`, `<path class="ink" pathLength="1" style="--n:0" d="${loop(453, 174, 19, 13, 8)}"/>`, `<path class="ink" pathLength="1" style="--n:0" d="${loop(126, 220, 25, 13, 11)}"/>`,
  w('30·9·26', 420, 226).g, tones.g, unit.g, w('PIANO 1962, TUNED TUESDAYS', 28, 327).g, w('KIT: 4 RECORDS, ASK WHICH', 28, 355).g, w('ENGINEER IN THE CHAIR, EVERY HOUR', 28, 383).g,
  `<path class="ink" pathLength="1" style="--n:0" d="M33 414L37.5 419.6L47 405.4"/>`].map(seq).join('');
 box.insertAdjacentHTML('afterbegin', `<svg class="label" viewBox="0 0 600 440" aria-hidden="true">
  <defs><filter id="lf-matte" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .3 0 0 0 0 .26 0 0 0 0 .2 0 0 0 .55 -.2" result="g"/><feComposite in="g" in2="SourceGraphic" operator="in"/></filter>
  <filter id="lf-pen"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="9" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale=".9"/></filter></defs>
  <rect width="600" height="440" fill="#ebe4d3"/><rect width="600" height="440" fill="#000" filter="url(#lf-matte)"/>
  <g class="pr">${P('LOW FREQUENCY', 24, 36, 22)}${P('RYE LANE · PECKHAM SE15 · RECORDING ROOMS', 24, 50, 9)}<rect x="468" y="16" width="110" height="28" class="fill"/><text x="523" y="35" font-size="13" text-anchor="middle" class="rev">MASTER</text>
   <path d="M0 58H600M0 104H600M0 150H600M0 196H600M0 242H600M0 288H600M0 398H600M300 58V242" class="rule"/><path d="M26 330H574M26 358H574M26 386H574" class="rule thin"/>
   ${P('STUDIO', 24, 76, 9)}${P('REEL No.', 316, 76, 9)}${P('MACHINE', 24, 122, 9)}${P('TAPE WIDTH', 316, 122, 9)}
   ${P('SPEED', 24, 168, 9)}${P('7½', 118, 179, 15)}${P('15', 158, 179, 15)}${P('30', 198, 179, 15)}${P('IPS', 232, 179, 11)}${P('EQ', 316, 168, 9)}${P('NAB', 390, 179, 15)}${P('IEC', 440, 179, 15)}
   ${P('NR', 24, 214, 9)}${P('NONE', 106, 225, 14)}${P('DOLBY A', 164, 225, 14)}${P('SR', 246, 225, 14)}${P('RECORDED', 316, 214, 9)}
   ${P('TONES AT HEAD', 24, 260, 9)}${P('NOTES', 24, 302, 9)}
   <rect x="26" y="408" width="16" height="16" class="box"/>${P('TAIL OUT', 50, 421, 12)}<rect x="146" y="408" width="16" height="16" class="box"/>${P('HEAD OUT', 170, 421, 12)}${P('STORE TAIL OUT · UPRIGHT · AWAY FROM SPEAKERS', 574, 421, 8, 'end')}</g>
  <g class="pen" filter="url(#lf-pen)">${ink}</g></svg>`);
 const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting){ box.classList.add('written'); io.disconnect(); } }), {threshold:.35});
 reduce ? box.classList.add('written', 'still') : io.observe(box); }

// the track sheet, taped to the meter bridge: what sits on each of the 24 tracks, printed boxes filled in by hand in marker
// (anatomy read from Larry Crane, "Write It All Down!", jackpotrecording.substack.com, and a studio's printed 24-track log:
// studio, machine, reel, engineer, 24 numbered boxes, comments; the sheet lives in the reel case). Track 1 was reassigned mid-session;
// the vocal went through to Room B; the artist line and the last ten boxes are left for whoever books.
const tsh = document.getElementById('trksheet');
if (tsh){ const r = rng(61), w = (t, x, y, o = {}) => hand(t, {size:o.size || 13, slant:-5, seed:Math.floor(r() * 9e5) + 1, write:true}), at = (h, x, y, s) => `<g class="ink" transform="translate(${x} ${y - s})">${h.svg}</g>`;
 const P = (t, x, y, s = 9, a = 'start') => `<text x="${x}" y="${y}" font-size="${s}" text-anchor="${a}">${t}</text>`;
 let n3 = 0; const seq = g => g.replace(/--n:\d+/g, () => `--n:${n3++}`);
 const T = ['KICK', 'SNARE', 'HAT', 'TOM', 'FLOOR', 'OH L', 'OH R', 'ROOM', 'PIANO L', 'PIANO R', 'BASS', 'GTR', 'GTR', 'VOX'];
 const bx = k => 24 + (k % 8) * 69, by = k => 168 + Math.floor(k / 8) * 72;
 let ink = [at(w('IN THE CHAIR', 0, 0), 30, 142, 13), at(w('1', 0, 0), 262, 142, 13), at(w('+6', 0, 0), 520, 142, 13), at(w('A', 0, 0, {size:18}), 552, 42, 18)];
 T.forEach((s, k) => { const h = w(s, 0, 0, {size:s.length > 6 ? 11 : 13}), x = bx(k) + (69 - h.w) / 2, y = by(k) + (k ? 46 : 58);
  if (!k){ const b = w('BASS', 0, 0, {size:11}); ink.push(at(b, bx(0) + 12, by(0) + 34, 11), `<path class="ink strike" pathLength="1" style="--n:0" d="M${bx(0) + 9} ${by(0) + 29}C${bx(0) + 26} ${by(0) + 27} ${bx(0) + 44} ${by(0) + 30} ${bx(0) + 12 + b.w + 4} ${by(0) + 26}"/>`); }
  ink.push(at(h, x, y, s.length > 6 ? 11 : 13)); });
 const v = w('B', 0, 0, {size:11}); ink.push(at(v, bx(13) + 44, by(13) + 64, 11), `<path class="ink" pathLength="1" style="--n:0" d="${loop(bx(13) + 48.5, by(13) + 58.5, 9, 8, 3)}"/>`);
 ink.push(at(w('62', 0, 0, {size:9}), bx(8) + 44, by(8) + 64, 9));
 const grid = [...Array(24)].map((_, k) => `<rect x="${bx(k)}" y="${by(k)}" width="69" height="72" class="box"/><text x="${bx(k) + 5}" y="${by(k) + 12}" font-size="8">${k + 1}</text>`).join('');
 tsh.insertAdjacentHTML('afterbegin', `<svg class="label" viewBox="0 0 600 430" aria-hidden="true">
  <rect width="600" height="430" fill="#efe9da"/><rect width="600" height="430" fill="#000" filter="url(#lf-matte)" opacity=".7"/>
  <g class="pr">${P('LOW FREQUENCY', 24, 34, 20)}${P('TRACK SHEET · 24 TRACK · 2 INCH', 24, 48, 8)}${P('ROOM', 516, 40, 9)}
   <path d="M0 58H600M0 104H600M0 152H600M300 58V104M200 104V152M300 104V152M450 104V152" class="rule"/>
   ${P('ARTIST', 24, 72, 8)}${P('TITLE', 316, 72, 8)}${P('ENGINEER', 24, 118, 8)}${P('REEL', 216, 118, 8)}${P('DATE', 316, 118, 8)}${P('LEVEL', 466, 118, 8)}
   <g font-size="8">${grid}</g>${P('KEEP THIS SHEET IN THE BOX WITH THE REEL', 576, 416, 7, 'end')}</g>
  <g class="pen">${ink.map(seq).join('')}</g></svg>`);

 // the meter bridge the sheet is taped to: painted console steel, a run of backlit VU meters, each channel's number printed under its window.
 // The needles are live, because the sheet is taped up while the reel plays back.
 const vu = (k, ch, a0, a1, d) => { const x = 22 + k * 96, y = 14, cxm = x + 42, py = y + 76, arc = a => { const t = a * Math.PI / 180; return [cxm + 50 * Math.sin(t), py - 50 * Math.cos(t)]; };
  const tk = [-40, -30, -20, -12, -5, 0, 6, 12, 18, 26, 34].map((a, m) => { const [x1, y1] = arc(a), t = a * Math.PI / 180; return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}l${(-(m % 2 ? 4 : 7) * Math.sin(t)).toFixed(1)} ${((m % 2 ? 4 : 7) * Math.cos(t)).toFixed(1)}" class="${a > 12 ? 'rd' : ''}"/>`; }).join('');
  const [ra, rb] = [arc(12), arc(40)];
  return `<g><rect x="${x}" y="${y}" width="84" height="60" rx="5" class="bz"/><rect x="${x + 3}" y="${y + 3}" width="78" height="54" rx="3" fill="url(#lf-vuf)"/>
   <path d="M${arc(-42).map(v => v.toFixed(1)).join(' ')}A50 50 0 0 1 ${ra.map(v => v.toFixed(1)).join(' ')}" class="sc"/><path d="M${ra.map(v => v.toFixed(1)).join(' ')}A50 50 0 0 1 ${rb.map(v => v.toFixed(1)).join(' ')}" class="sc rd" stroke-width="3"/>
   <g class="tk">${tk}</g><text x="${cxm}" y="${y + 44}" text-anchor="middle" class="vt">VU</text>
   <path d="M${cxm} ${py}V${py - 58}" class="nd" style="--a0:${a0}deg;--a1:${a1}deg;--d:${d}s;transform-origin:${cxm}px ${py}px"/>
   <rect x="${x + 3}" y="${y + 47}" width="78" height="10" class="mk"/><path d="M${x + 8} ${y + 6}L${x + 34} ${y + 6}L${x + 20} ${y + 40}L${x + 6} ${y + 40}Z" class="gl"/>
   <text x="${cxm}" y="${y + 80}" text-anchor="middle" class="ch">${ch}</text></g>`; };
 tsh.insertAdjacentHTML('afterbegin', `<div class="bridge" aria-hidden="true"><svg viewBox="0 0 700 118"><defs><linearGradient id="lf-br" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d2b2f"/><stop offset=".08" stop-color="#232226"/><stop offset="1" stop-color="#141316"/></linearGradient>
  <radialGradient id="lf-vuf" cx=".5" cy=".85" r=".9"><stop offset="0" stop-color="#f6e7ba"/><stop offset=".6" stop-color="#ead39a"/><stop offset="1" stop-color="#c7a666"/></radialGradient></defs>
  <rect width="700" height="118" fill="url(#lf-br)"/><path d="M0 1.5H700" stroke="rgba(255,255,255,.14)"/><rect width="700" height="118" fill="#000" filter="url(#lf-matte)" opacity=".5"/>
  ${[['9', -26, -6, .62], ['10', -30, -11, .81], ['11', -34, -18, .7], ['12', -22, 2, .55], ['13', -36, -20, .9], ['14', -18, 8, .47], ['15', -40, -36, 1.3]].map(([c, a, b, d], k) => vu(k, c, a, b, d)).join('')}
  <circle cx="9" cy="10" r="2.6" class="sw"/><circle cx="691" cy="10" r="2.6" class="sw"/></svg></div>`);
 const io2 = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting){ tsh.classList.add('written'); io2.disconnect(); } }), {threshold:.35});
 reduce ? tsh.classList.add('written', 'still') : io2.observe(tsh); }

// the door: a long-throw fader on the Penny+Giles scale (104 mm stroke, 0 dB at the top, the last 40 dB crushed into the bottom 15 mm), pushed up as the next world rises
const MM = [[0, '0'], [12.5, '5'], [24.4, '10'], [38.9, '15'], [50.6, '20'], [64, '30'], [76.2, '40'], [88.7, '50'], [94.4, '60'], [97.6, ''], [104, '∞']], Y = mm => 65 + mm * 10;
const fader = `<div class="fdr" aria-hidden="true"><svg viewBox="-100 -95 400 1270"><defs><linearGradient id="lf-cap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3c5c9"/><stop offset=".12" stop-color="#9a9ca1"/><stop offset="1" stop-color="#6f7176"/></linearGradient><linearGradient id="lf-dish" x1="0" y1="0" x2="0" y2="1"><stop offset=".08" stop-color="#000" stop-opacity="0"/><stop offset=".38" stop-color="#000" stop-opacity=".22"/><stop offset=".62" stop-color="#fff" stop-opacity=".08"/><stop offset=".92" stop-color="#000" stop-opacity="0"/></linearGradient></defs><rect class="strip" x="-90" y="-85" width="380" height="1250" rx="8"/>
 <rect class="slot" x="148.75" y="${Y(0) - 45}" width="2.5" height="1130"/>
 ${MM.map(([mm, l]) => `<path class="tk" d="M40 ${Y(mm)}H64M236 ${Y(mm)}H260"/>${l ? `<text x="28" y="${Y(mm) + 12}" text-anchor="end">${l}</text>` : ''}`).join('')}
 <text x="28" y="-30" text-anchor="end" class="sm">dB</text><text x="150" y="${Y(104) + 60}" text-anchor="middle" class="sm">PFL</text>
 <g class="knob"><rect x="70" y="-150" width="160" height="300" rx="10" class="sh"/><rect x="70" y="-120" width="160" height="240" rx="8" class="cap"/><rect x="70" y="-120" width="160" height="240" rx="8" class="dish"/><rect x="72" y="-3" width="156" height="6" class="line"/></g></svg></div>`;
N.door(document.getElementById('door'), {verb:'Push the fader up', after:fader});
const door = document.getElementById('door'), knob = door.querySelector('.knob');
const push = () => { const r = +getComputedStyle(door).getPropertyValue('--rise') || 0; knob.setAttribute('transform', `translate(0 ${(Y(104) - r * 1040).toFixed(1)})`); };
new MutationObserver(push).observe(door, {attributes:true, attributeFilter:['style']}); push();
