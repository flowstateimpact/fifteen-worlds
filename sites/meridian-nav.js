// meridian-nav.js · Meridian's chapter control: a strip cut from the ship's deck with the voyage lane painted on it.
// Hatch-cover steel in deck green, the lane in white thermoplastic that has cracked and greyed, port codes stencilled beside it with
// their bridges and overspray. At Felixstowe the strip crosses the ship's side and the yellow quay edge onto the terminal's asphalt,
// where the codes turn yellow and become yard marks (Nazar's anatomy, section 5: block letter and slot numbers painted on the asphalt).
// Your box, a corten forty-footer seen from above, is lifted, moved and set down again at each chapter: tier first, then along.
// Its stow code sits on a riveted aluminium plate; the index is the ship's manifest in a plastic sleeve, zip-tied at one corner.
import {nav} from './lib/nav.js';
const N = nav(), lane = document.getElementById('lane'), n = N.list.length, codes = N.list.map(c => c.n);
const QUAY = codes.indexOf('FXT'), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
lane.innerHTML = `<svg class="deck" aria-hidden="true"></svg><ol></ol><i class="box" aria-hidden="true"></i><button type="button" class="ixb" aria-label="Open the index"></button><p class="sr">Your box is stowed at bay 06, row 05, tier 82</p>`;
const deck = lane.querySelector('.deck'), ol = lane.querySelector('ol'), box = lane.querySelector('.box'), ixb = lane.querySelector('.ixb');
ol.addEventListener('click', e => { const b = e.target.closest('button'); if (b) N.go(+b.dataset.i); });
ixb.addEventListener('click', N.open);
document.body.style.setProperty('--dfg', N.next[5]);
let seed = 11; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647, f1 = v => v.toFixed(1);

// stencil bridges: the ties a cut stencil needs to hold its counters in, as [across the glyph, down the cap height] fractions
const BR = {O:[[.5,0],[.5,1]], '0':[[.5,0],[.5,1]], D:[[.55,0],[.55,1]], Q:[[.5,0]], B:[[.55,0],[.55,.5],[.55,1]], P:[[.55,0],[.55,.5]], R:[[.55,0],[.55,.5]], A:[[.5,0]], '8':[[.5,0],[.5,.5],[.5,1]], '9':[[.5,0]], '6':[[.5,1]]};

// the box from above: corrugated roof ribs across its width, rails along both sides, a cast corner at each end
box.innerHTML = `<svg viewBox="0 0 36 12" preserveAspectRatio="none"><rect width="36" height="12" fill="#8a3a28"/>${Array.from({length:19}, (_, k) => `<rect x="${f1(1.2 + k * 1.8)}" width=".9" height="12" fill="${k % 2 ? 'rgba(0,0,0,.17)' : 'rgba(255,214,190,.13)'}"/>`).join('')}<rect width="36" height="1" fill="rgba(0,0,0,.38)"/><rect y="11" width="36" height="1" fill="rgba(0,0,0,.45)"/><rect width=".8" height="12" fill="rgba(255,220,200,.35)"/><rect x="22" y="4" width="7" height="5" fill="rgba(60,22,12,.25)"/>${[[0,0],[33.6,0],[0,9.6],[33.6,9.6]].map(([x, y]) => `<rect x="${x}" y="${y}" width="2.4" height="2.4" fill="#2a1712"/>`).join('')}</svg>`;

// the manifest: typed sheet, a received stamp half off the paper, in a clear sleeve with water trapped inside and an orange zip tie
function docket(w, h, ph){ seed = 71; const s = ph ? .62 : 1;
 let d = `<svg viewBox="0 0 ${w} ${h}" aria-hidden="true"><g transform="rotate(1.6 ${w / 2} ${h / 2})"><rect x="3" y="4" width="${w - 6}" height="${h - 7}" fill="#ece6d4"/>`;
 d += `<text x="${ph ? 6 : 11}" y="${ph ? 14 : 22}" font-family="JetBrains Mono,monospace" font-weight="700" font-size="${ph ? 7 : 13}" letter-spacing="${ph ? .5 : 1.4}" fill="#23282b">MANIFEST</text>`;
 for (let r = 0; r < (ph ? 2 : 4); r++){ let x = 9 * s + 2; const y = (ph ? 22 : 29) + r * (ph ? 6 : 8.2); while (x < w - 16){ const ww = 4 + rnd() * 18 * s; if (x + ww > w - 12) break; d += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(ww)}" height="${ph ? 1.5 : 2.1}" fill="rgba(35,40,43,.5)"/>`; x += ww + 3 * s; } }
 if (!ph) d += `<circle cx="${w - 22}" cy="${h - 20}" r="12" fill="none" stroke="rgba(184,50,31,.6)" stroke-width="1.4" stroke-dasharray="14 2 30 3"/><text x="${w - 22}" y="${h - 17}" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="7.5" fill="rgba(184,50,31,.62)" transform="rotate(-14 ${w - 22} ${h - 20})">RCVD</text>`;
 d += `</g><rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="3" fill="rgba(226,238,244,.13)" stroke="rgba(255,255,255,.6)" stroke-width=".9"/>`;
 d += `<path d="M4 ${f1(3.5 * s + 2)}H${w - 4}" stroke="rgba(255,255,255,.45)" stroke-width=".8" stroke-dasharray="1.6 1.6"/><path d="M${f1(w * .42)} 1L${f1(w * .62)} 1L${f1(w * .3)} ${h - 1}L${f1(w * .12)} ${h - 1}Z" fill="rgba(255,255,255,.16)"/>`;
 for (let k = 0; k < (ph ? 2 : 4); k++){ const x = w * (.35 + rnd() * .55), y = h * (.55 + rnd() * .35), r = (1 + rnd() * 1.6) * s; d += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(r * .8)}" fill="rgba(255,255,255,.22)" stroke="rgba(20,30,34,.22)" stroke-width=".5"/>`; }
 d += `<circle cx="${f1(6 * s)}" cy="${f1(6 * s)}" r="${f1(2.1 * s)}" fill="none" stroke="rgba(0,0,0,.45)" stroke-width=".8"/><rect x="${f1(-3 * s)}" y="${f1(4.6 * s)}" width="${f1(15 * s)}" height="${f1(2.8 * s)}" rx="1" fill="#e2621b" transform="rotate(-38 ${f1(6 * s)} ${f1(6 * s)})"/><rect x="${f1(-9 * s)}" y="${f1(-1 * s)}" width="${f1(9 * s)}" height="${f1(2 * s)}" rx="1" fill="#c9530f" transform="rotate(-72 0 0)"/></svg>`;
 return d; }

let ys = [], bh = 12, cur = 0;
function build(){ seed = 11;
 const W = lane.clientWidth, H = lane.clientHeight, ph = W < 100, sz = ph ? 11 : 18, L = ph ? 12 : 26, CX = ph ? 22 : 48, lw = ph ? 4 : 7;
 const y0 = ph ? 18 : 108, y1 = H - (ph ? 62 : 104), T = (n - 1) + (QUAY >= 0 ? 1.2 : 0);
 ys = codes.map((_, k) => y0 + (k + (QUAY >= 0 && k > QUAY ? 1.2 : 0)) / T * (y1 - y0));
 const yq = QUAY >= 0 && QUAY < n - 1 ? (ys[QUAY] + ys[QUAY + 1]) / 2 : H + 20, STEEL = '#3c4841', TAR = '#343431';
 let s = `<defs>
  <filter id="mr-mot" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".03 .07" numOctaves="4" seed="5"/><feColorMatrix values="0 0 0 0 .08  0 0 0 0 .1  0 0 0 0 .08  0 0 0 1.3 -.5"/></filter>
  <filter id="mr-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="1" seed="9"/><feColorMatrix values="0 0 0 0 .85  0 0 0 0 .88  0 0 0 0 .84  0 0 0 9 -5.4"/></filter>
  <filter id="mr-agg" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.7" numOctaves="1" seed="12"/><feColorMatrix values="0 0 0 0 .72  0 0 0 0 .71  0 0 0 0 .67  0 0 0 14 -8.7"/></filter>
  <filter id="mr-paint" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${ph ? 1 : 1.6}" xChannelSelector="R" yChannelSelector="G" result="d"/><feTurbulence type="fractalNoise" baseFrequency=".06 .12" numOctaves="3" seed="8" result="w"/><feColorMatrix in="w" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -8 5.6" result="wm"/><feComposite in="d" in2="wm" operator="in"/></filter>
  <filter id="mr-ptxt" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${ph ? .7 : 1}" xChannelSelector="R" yChannelSelector="G" result="d"/><feTurbulence type="fractalNoise" baseFrequency=".09 .16" numOctaves="3" seed="8" result="w"/><feColorMatrix in="w" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -8 6.3" result="wm"/><feComposite in="d" in2="wm" operator="in"/></filter>
  <filter id="mr-soft"><feGaussianBlur stdDeviation="${ph ? .6 : 1}"/></filter><filter id="mr-spray"><feGaussianBlur stdDeviation="${ph ? .8 : 1.3}"/></filter>
  <linearGradient id="mr-rust" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(150,72,34,.6)"/><stop offset="1" stop-color="rgba(150,72,34,0)"/></linearGradient>
  <linearGradient id="mr-al" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#d3d6d3"/><stop offset=".55" stop-color="#b3b7b4"/><stop offset="1" stop-color="#9da19e"/></linearGradient>
  <mask id="mr-br" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/>`;
 // the bridges, one set per glyph, cut out of every code at once
 const adv = sz * .74, capH = sz * .73, stk = sz * .14, gw = Math.max(1, sz * .08), gh = sz * .28;
 codes.forEach((c, k) => { const base = ys[k] + capH / 2; [...c].forEach((ch, j) => { for (const [fx, fy] of BR[ch] || []){ const gx = CX + j * adv + fx * sz * .6, gy = base - capH + stk / 2 + fy * (capH - stk); s += `<rect x="${f1(gx - gw / 2)}" y="${f1(gy - gh / 2)}" width="${f1(gw)}" height="${f1(gh)}" fill="#000"/>`; } }); });
 s += `</mask></defs>`;
 // hatch-cover steel: mottled deck paint, fine grit, two weld seams with rust bled down from them
 const ds = yq - 7;
 s += `<rect width="${W}" height="${f1(ds)}" fill="${STEEL}"/><rect width="${W}" height="${f1(ds)}" filter="url(#mr-mot)"/><rect width="${W}" height="${f1(ds)}" filter="url(#mr-grain)" opacity=".12"/>`;
 for (const sy of [ph ? ds * .3 : 88, ds * (ph ? .72 : .6)]){ s += `<path d="M0 ${f1(sy)}H${W}" stroke="rgba(0,0,0,.5)" stroke-width="1.4"/><path d="M0 ${f1(sy + 1.3)}H${W}" stroke="rgba(220,232,220,.14)" stroke-width=".8"/>`;
  for (let k = 0; k < (ph ? 2 : 4); k++){ const x = 4 + rnd() * (W - 8); s += `<rect x="${f1(x)}" y="${f1(sy + 1)}" width="${f1(1.2 + rnd() * 2.6)}" height="${f1(10 + rnd() * 42)}" fill="url(#mr-rust)" filter="url(#mr-soft)"/>`; } }
 // the ship's side, a dark gap of water, then the quay's concrete coping painted yellow and worn by every lashing crew that crossed it
 if (yq < H){ s += `<rect y="${f1(ds)}" width="${W}" height="5" fill="#0d1215"/><rect y="${f1(yq - 2)}" width="${W}" height="10" fill="#7d7a72"/><rect y="${f1(yq - 2)}" width="${W}" height="9" fill="#c99b2e" filter="url(#mr-paint)"/>`;
  const ay = yq + 8; s += `<rect y="${f1(ay)}" width="${W}" height="${f1(H - ay)}" fill="${TAR}"/><rect y="${f1(ay)}" width="${W}" height="${f1(H - ay)}" filter="url(#mr-agg)" opacity=".38"/><rect y="${f1(ay)}" width="${W}" height="${f1(H - ay)}" filter="url(#mr-mot)" opacity=".7"/>`;
  // a sealed crack in the asphalt, and the arcs straddle carriers leave with their tyres
  let cx = W * .74, cr = `M${f1(cx)} ${f1(ay)}`; for (let y = ay; y < H; y += 5){ cx = Math.max(W * .6, Math.min(W * .9, cx + (rnd() - .5) * 3.2)); cr += ` L${f1(cx)} ${f1(y + 5)}`; } s += `<path d="${cr}" fill="none" stroke="rgba(10,10,9,.5)" stroke-width="${ph ? .9 : 1.3}" stroke-linejoin="round"/>`;
  for (let k = 0; k < 3; k++){ const y = ay + 16 + rnd() * (H - ay - 40); s += `<path d="M-4 ${f1(y)} Q${f1(W / 2)} ${f1(y - 12 - rnd() * 10)} ${W + 4} ${f1(y + 6)}" fill="none" stroke="rgba(10,10,9,.3)" stroke-width="${f1((ph ? 3 : 5) + rnd() * 4)}" filter="url(#mr-soft)"/>`; } }
 // the lane: white thermoplastic, cracked across and chipped at the edges, greyed by grime, broken where the ship ends
 const segs = [[y0 - (ph ? 12 : 22), Math.min(ds - 5, H)]]; if (yq < H) segs.push([yq + 14, H - (ph ? 50 : 90)]);
 for (const [a, b] of segs){ const bg = a > yq ? TAR : STEEL;
  s += `<g filter="url(#mr-paint)"><rect x="${f1(L - lw / 2)}" y="${f1(a)}" width="${lw}" height="${f1(b - a)}" fill="#e3e0d4"/></g><rect x="${f1(L - lw / 2)}" y="${f1(a)}" width="${lw}" height="${f1(b - a)}" fill="rgba(70,66,56,.2)" filter="url(#mr-mot)"/>`;
  for (let y = a + 4; y < b - 4; y += 7 + rnd() * 12){ const j = (rnd() - .5) * 3; s += `<path d="M${f1(L - lw / 2)} ${f1(y)} L${f1(L - lw / 6)} ${f1(y + j)} L${f1(L + lw / 5)} ${f1(y - j * .6)} L${f1(L + lw / 2)} ${f1(y + j * .4)}" fill="none" stroke="rgba(32,36,32,.72)" stroke-width="${ph ? .5 : .7}"/>`;
   if (rnd() < .35){ const side = rnd() < .5 ? -1 : 1, ex = L + side * lw / 2; s += `<path d="M${f1(ex)} ${f1(y - 2)} L${f1(ex - side * (1 + rnd() * 2))} ${f1(y)} L${f1(ex)} ${f1(y + 2 + rnd() * 2)}Z" fill="${bg}"/>`; } } }
 // the codes, sprayed through a stencil: a soft halo of overspray, then the paint itself with its bridges, worn where boots and tyres go
 codes.forEach((c, k) => { const yard = yq < H && ys[k] > yq, col = yard ? '#d8b441' : '#e2dfd3', base = ys[k] + capH / 2;
  const t = [...c].map((ch, j) => `<text x="${f1(CX + j * adv)}" y="${f1(base)}">${ch}</text>`).join('');
  s += `<g font-family="JetBrains Mono,monospace" font-weight="700" font-size="${sz}" fill="${col}"><g opacity=".26" filter="url(#mr-spray)">${t}</g><g mask="url(#mr-br)"><g filter="url(#mr-ptxt)">${t}</g></g></g>`; });
 // the stow plate, bolted to the deck at the head of the lane: stamped letters, brushed grain, one rivet long gone and its hole weeping rust
 if (!ph){ const px = 10, py = 10, pw = W - 20, pH = 66; seed = 41;
  s += `<g transform="rotate(-.7 ${W / 2} 42)"><rect x="${px + 1.5}" y="${py + 2}" width="${pw}" height="${pH}" rx="2.5" fill="rgba(0,0,0,.35)" filter="url(#mr-soft)"/><rect x="${px}" y="${py}" width="${pw}" height="${pH}" rx="2.5" fill="url(#mr-al)" stroke="rgba(0,0,0,.5)" stroke-width=".8"/>`;
  for (let y = py + 1.5; y < py + pH - 1; y += 1.3) s += `<path d="M${px + 1} ${f1(y)}H${px + pw - 1}" stroke="${rnd() < .5 ? `rgba(255,255,255,${(rnd() * .14).toFixed(2)})` : `rgba(0,0,0,${(rnd() * .07).toFixed(2)})`}" stroke-width=".6"/>`;
  s += `<rect x="${px}" y="${py + pH - 16}" width="${pw}" height="16" rx="2" fill="rgba(40,36,28,.14)" filter="url(#mr-mot)"/>`;
  const riv = [[px + 6, py + 6], [px + pw - 6, py + 6], [px + 6, py + pH - 6]]; for (const [x, y] of riv) s += `<circle cx="${x}" cy="${y}" r="2.4" fill="#a0a5a2" stroke="rgba(0,0,0,.45)" stroke-width=".6"/><circle cx="${x - .6}" cy="${y - .7}" r=".9" fill="rgba(255,255,255,.75)"/>`;
  const mx = px + pw - 6, my = py + pH - 6; s += `<rect x="${mx - 1}" y="${my}" width="2.2" height="16" fill="url(#mr-rust)" filter="url(#mr-soft)"/><circle cx="${mx}" cy="${my}" r="2" fill="#16181a"/>`;
  const stamp = (x, y, fs, txt, anchor = 'start', ls = 1.1) => `<text x="${x}" y="${y + .8}" font-size="${fs}" letter-spacing="${ls}" text-anchor="${anchor}" fill="rgba(255,255,255,.6)">${txt}</text><text x="${x}" y="${y}" font-size="${fs}" letter-spacing="${ls}" text-anchor="${anchor}" fill="#34383a">${txt}</text>`;
  const col = [px + 12, px + 12 + 30, px + 12 + 62];
  s += `<g font-family="JetBrains Mono,monospace" font-weight="700">${stamp(px + 12, py + 19, 10.5, 'YOUR BOX')}${stamp(col[0], py + 33, 10.5, 'BAY')}${stamp(col[1], py + 33, 10.5, 'ROW')}${stamp(col[2], py + 33, 10.5, 'TIER')}`;
  s += ['06', '05', '82'].map((v, k) => stamp(col[k] + [11, 11, 13][k], py + 56, 20, v, 'middle', 1)).join('') + `</g></g>`; }
 deck.setAttribute('viewBox', `0 0 ${W} ${H}`); deck.innerHTML = s;
 // one hit row per code, the chapter's name spoken beside the strip
 const gap = ys.length > 1 ? ys[1] - ys[0] : 30, rh = Math.min(ph ? 30 : 36, gap);
 ol.innerHTML = N.list.map((c, k) => `<li><button type="button" data-i="${k}" aria-label="${c.t}" style="top:${f1(ys[k] - rh / 2)}px;height:${f1(rh)}px"><em>${c.t}</em></button></li>`).join('');
 box.style.setProperty('--bx', L + 'px'); bh = ph ? 8 : 12; ixb.innerHTML = docket(ixb.clientWidth, ixb.clientHeight, ph); mark(cur); }

function mark(i){ const bs = ol.querySelectorAll('button'); bs.forEach((b, k) => { b.classList.toggle('on', k === i); b.toggleAttribute('aria-current', k === i); });
 if (ys[i] != null) box.style.setProperty('--y', f1(ys[i] - bh / 2) + 'px'); }

// the port's name and day speak for two seconds as the box lands; below the voyage the page says it, so the strip is quiet
let first = true, quiet = 0, lt = 0;
N.on((i, c) => { if (!first && i !== cur && !reduce){ box.classList.add('lift'); clearTimeout(lt); lt = setTimeout(() => box.classList.remove('lift'), 900); }
 cur = i; mark(i); document.body.classList.toggle('at-door', i === n - 1);
 if (first){ first = false; return; } clearTimeout(quiet); if (c.el){ lane.classList.remove('say'); return; } lane.classList.add('say'); quiet = setTimeout(() => lane.classList.remove('say'), 2200); });
document.fonts.ready.then(build); addEventListener('resize', build); build();
N.door(document.getElementById('door'), {verb:'Lower away'});
