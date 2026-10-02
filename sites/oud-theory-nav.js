// oud-theory-nav.js · Oud Theory's chapter control: blotter strips (mouillettes) standing fanned in a walnut block (Nazar's anatomy, section 11).
// Uncoated, matte, a little thick, tapered to the tip that was dipped; the wide end held and named in pencil, never ink. A scent is read
// in order, so the strips are dipped in order: the one you are reading is wet, oud wicking amber down from its tip and still spreading;
// the ones before it have dried to a paler stain with a hard tide line; the ones after are clean. The index is the formula card.
import {nav} from './lib/nav.js';
import {hand} from './lib/hand.js';
const N = nav({drv:'main'}), bl = document.getElementById('blot'), n = N.list.length, reduce = N.reduce;
bl.innerHTML = `<svg class="st" aria-hidden="true"></svg><ol></ol><button type="button" class="ixb" aria-label="Open the index"></button><p class="tip" aria-hidden="true"></p>`;
const st = bl.querySelector('.st'), ol = bl.querySelector('ol'), ixb = bl.querySelector('.ixb'), tip = bl.querySelector('.tip');
let seed = 9; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647, f1 = v => (+v).toFixed(1);

// the formula card: a torn index card, pencilled, leaning on the block
const fc = hand('INDEX', {size:12, slant:-5, seed:77}), fn = hand('1-15', {size:9, slant:-4, seed:31});
ixb.innerHTML = `<svg viewBox="0 0 78 54" aria-hidden="true"><path d="M3 6 L74 3 L76 50 L5 52 Z" fill="rgba(0,0,0,.35)" transform="translate(2 3)"/><path d="M3 6 L74 3 L75.5 20 L74.6 24 L76 50 L5 52 Z" fill="#efe8d6"/><path d="M8 15 H70 M8 27 H70 M8 39 H70" stroke="rgba(120,150,190,.35)" stroke-width=".5"/><path d="M8 11 H70" stroke="rgba(200,80,70,.4)" stroke-width=".6"/>
 <g transform="translate(11 18)" fill="none" stroke="#454545" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round" opacity=".85">${fc.svg}</g><g transform="translate(12 34)" fill="none" stroke="#454545" stroke-width="1" stroke-linecap="round" opacity=".7">${fn.svg}</g></svg>`;

let G = {}, stains = [], wet = -1, wetT = 0, cur = 0, raf = 0;
function build(){ seed = 9; const W = bl.clientWidth, H = bl.clientHeight, ph = W < 150;
 const sw = ph ? 9 : 20, gap = sw + (ph ? 2.2 : 3.6), sl = ph ? 176 : 300, tipW = ph ? 4 : 8, bw = n * gap + (ph ? 10 : 18), bh = ph ? 18 : 34, bx = W - bw - (ph ? 2 : 6), by = H - bh - (ph ? 4 : 8), px = bx + bw / 2, py = by + bh * .35, fan = ph ? 2.6 : 3.2;
 G = {W, H, ph, sw, sl, tipW, px, py};
 const sx = k => px + (k - (n - 1) / 2) * gap;   // each strip in its own slot, the fan opening from the block
 let s = `<defs><filter id="ot-fib" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="6"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .38  0 0 0 0 .3  0 0 0 1 -.46"/></filter>
  <filter id="ot-edge" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".09 .45" numOctaves="3" seed="11" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="${ph ? 4 : 9}" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="${ph ? .5 : .9}"/></filter>
  <filter id="ot-soft"><feGaussianBlur stdDeviation="${ph ? 1.5 : 3}"/></filter>
  <linearGradient id="ot-wal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a4a32"/><stop offset=".25" stop-color="#4b3222"/><stop offset="1" stop-color="#2a1b11"/></linearGradient>
  <linearGradient id="ot-pap" x1="0" x2="1"><stop offset="0" stop-color="#f4eee0"/><stop offset=".7" stop-color="#e9e1cf"/><stop offset="1" stop-color="#d6ccb6"/></linearGradient></defs>`;
 // the shadow the whole stand throws on the bench, away from the high window
 s += `<ellipse cx="${f1(px + 14)}" cy="${f1(by + bh + 1)}" rx="${f1(bw * .56)}" ry="${ph ? 3 : 6}" fill="rgba(0,0,0,.55)" filter="url(#ot-soft)"/>`;
 // the strips, back to front: paper, fibre, the stain group (drawn per state), the pencil name on the wide end
 s += `<g class="strips">`;
 N.list.forEach((c, k) => { const a = (k - (n - 1) / 2) * fan, w2 = sw / 2, t2 = tipW / 2, taper = sl * .3;
  const shape = `M${f1(-w2)} 0 V${f1(-sl + taper)} L${f1(-t2)} ${f1(-sl + 5)} Q0 ${f1(-sl - 2)} ${f1(t2)} ${f1(-sl + 5)} L${f1(w2)} ${f1(-sl + taper)} V0 Z`;
  const nm = c.n ? hand(c.n.replace('No. ', 'NO.'), {size:ph ? 6 : 11, slant:-3, seed:101 + k * 7}) : null;
  s += `<g class="sp" data-k="${k}" transform="translate(${f1(sx(k))} ${f1(py)}) rotate(${f1(a)})"><g class="lift"><clipPath id="ot-c${k}"><path d="${shape}"/></clipPath>
   <path d="${shape}" fill="rgba(0,0,0,.28)" transform="translate(${ph ? 1 : 2} 1)" filter="url(#ot-soft)"/><path d="${shape}" fill="url(#ot-pap)"/><rect x="${f1(-w2)}" y="${f1(-sl - 4)}" width="${sw}" height="${sl + 4}" filter="url(#ot-fib)" clip-path="url(#ot-c${k})" opacity=".5"/>
   <g class="stn" clip-path="url(#ot-c${k})"></g>`;
  if (nm) s += `<g transform="translate(${f1(ph ? -2.4 : -5.4)} ${f1(ph ? -22 : -42)}) rotate(-90)" fill="none" stroke="#4d4b48" stroke-width="${ph ? .7 : 1.05}" stroke-linecap="round" stroke-linejoin="round" opacity=".82">${nm.svg}</g>`;
  s += `<path d="${shape}" fill="none" stroke="rgba(90,74,52,.35)" stroke-width=".5"/></g></g>`; });
 s += `</g>`;
 // the walnut block, its slots, and the window catching its top edge
 s += `<rect x="${f1(bx)}" y="${f1(by)}" width="${bw}" height="${bh}" rx="2" fill="url(#ot-wal)"/>`;
 for (let k = 0; k < 16; k++){ const y = by + 3 + rnd() * (bh - 6); s += `<path d="M${f1(bx)} ${f1(y)} C${f1(bx + bw * .3)} ${f1(y - 1.5)} ${f1(bx + bw * .7)} ${f1(y + 1.5)} ${f1(bx + bw)} ${f1(y + (rnd() - .5) * 2)}" fill="none" stroke="rgba(20,10,4,${(.2 + rnd() * .25).toFixed(2)})" stroke-width="${f1(.4 + rnd() * .8)}"/>`; }
 s += `<rect x="${f1(bx)}" y="${f1(by)}" width="${bw}" height="${ph ? 2 : 3}" rx="1" fill="rgba(255,214,160,.35)"/>` + N.list.map((c, k) => `<rect x="${f1(sx(k) - sw / 2 - .5)}" y="${f1(by + .8)}" width="${sw + 1}" height="${ph ? 2 : 3.4}" rx=".8" fill="rgba(10,5,2,.75)"/>`).join('');
 st.setAttribute('viewBox', `0 0 ${W} ${H}`); st.innerHTML = s;
 // hit areas follow each strip's own lean
 ol.innerHTML = N.list.map((c, k) => `<li><button type="button" data-i="${k}" aria-label="${c.n ? c.n + ' · ' : ''}${c.t}" style="left:${f1(sx(k) - sw / 2 - 1.5)}px;top:${f1(py - sl)}px;width:${sw + 3}px;height:${sl}px;transform-origin:50% 100%;transform:rotate(${f1((k - (n - 1) / 2) * fan)}deg)"></button></li>`).join('');
 stains = [...st.querySelectorAll('.stn')]; paint(1); }

// a stain of oud on blotter: amber, translucent, its edge feathered where it met dry fibre, a darker tide line where the alcohol stopped
function stain(k, reach, fresh){ const {sw, sl, ph} = G, w2 = sw / 2 + 2, y0 = -sl - 6, yb = -sl + sl * reach;
 let edge = `M${f1(-w2)} ${f1(y0)} H${f1(w2)} V${f1(yb)}`; for (let x = w2; x >= -w2; x -= sw / 6) edge += ` L${f1(x)} ${f1(yb + Math.sin(x * 1.7 + k) * (ph ? 1.4 : 3))}`; edge += ' Z';
 const body = fresh ? 'rgba(176,112,40,.78)' : 'rgba(201,154,85,.46)', line = fresh ? 'rgba(122,70,20,.55)' : 'rgba(150,96,36,.75)';
 let s = `<g filter="url(#ot-edge)"><path d="${edge}" fill="${body}"/></g>`;
 if (reach > .03){ let tl = ''; for (let x = -w2; x <= w2; x += sw / 6) tl += `${tl ? 'L' : 'M'}${f1(x)} ${f1(yb + Math.sin(x * 1.7 + k) * (ph ? 1.4 : 3))} `; s += `<g filter="url(#ot-edge)"><path d="${tl}" fill="none" stroke="${line}" stroke-width="${ph ? .9 : 1.6}"/></g>`; }
 if (fresh) s += `<path d="M${f1(-sw * .18)} ${f1(y0 + 14)} L${f1(-sw * .1)} ${f1(yb - 6)}" stroke="rgba(255,236,200,.35)" stroke-width="${ph ? .8 : 1.6}" stroke-linecap="round"/>`;
 return s; }
const REACH = .3;
function paint(now){ raf = 0; const t = typeof now === 'number' && now > 1 ? now : performance.now();
 stains.forEach((g, k) => { if (k === n - 1){ g.innerHTML = ''; return; }
  if (k < cur) g.innerHTML = stain(k, REACH * .82, false);
  else if (k === cur){ const q = reduce ? 1 : Math.min(1, (t - wetT) / 1700), e = 1 - Math.pow(1 - q, 3); g.innerHTML = stain(k, .04 + (REACH - .04) * e, true); if (q < 1) raf = requestAnimationFrame(paint); }
  else g.innerHTML = ''; });
 st.querySelectorAll('.sp').forEach(sp => sp.classList.toggle('on', +sp.dataset.k === cur)); }

// the tier and the name, spoken beside the strips for two seconds
let quiet = 0, first = true;
const say = k => { const c = N.list[k]; tip.innerHTML = `${c.n ? `<small>${c.n}</small>` : ''}${c.t}`; bl.classList.add('say'); clearTimeout(quiet); quiet = setTimeout(() => bl.classList.remove('say'), 2200); };
ol.addEventListener('click', e => { const b = e.target.closest('button'); if (b) N.go(+b.dataset.i); });
ol.addEventListener('pointerover', e => { const b = e.target.closest('button'); if (!b) return; say(+b.dataset.i); const sp = st.querySelector(`.sp[data-k="${b.dataset.i}"]`); if (sp && !reduce){ sp.classList.remove('wave'); void sp.getBoundingClientRect(); sp.classList.add('wave'); } });
ol.addEventListener('focusin', e => { const b = e.target.closest('button'); if (b) say(+b.dataset.i); });
ixb.addEventListener('click', N.open);
N.on(i => { ol.querySelectorAll('button').forEach((b, k) => b.toggleAttribute('aria-current', k === i)); if (i !== cur){ cur = i; wetT = performance.now(); } paint(); if (first){ first = false; return; } say(i); });
document.fonts.ready.then(build); addEventListener('resize', build); build();
N.door(document.getElementById('door'), {verb:'Let it settle'});
