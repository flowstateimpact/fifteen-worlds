// nav.js · the shared mechanics of chapters, the index and the doors between worlds. Mechanics only: each world draws its own chapter control
// from what this returns (Eleven's is a lift panel), restyles the index through CSS variables, and names its own chapters, so no two worlds share a look.
// A world declares its chapters in <script type="application/json" id="chapters">, e.g. [{"n":"18:50","t":"The lake","at":0},{"t":"The plan","el":"#plan"}]:
// "at" is a point along the 3D journey (0 to 1 of the #drv scroll), "el" a section below it. Keys: 1 to 9 jump to a chapter, I opens the index, Esc closes it.
export const WORLDS = [
 ['borsha','Borsha','Tea house · Dhaka','Wipe the rain off the glass.','#0c1a1c','#f3e7cf',"400 1em 'Supreme'"],
 ['meridian','Meridian','Freight line · Chattogram to Felixstowe','Sail thirty days across a hand-drawn sea chart.','#efe8d8','#1d2a3a',"700 1em 'JetBrains Mono'"],
 ['oud-theory','Oud Theory','Perfumer · London','A glass bottle made entirely of maths.','#2a0b13','#f1e6d2',"italic 400 1em 'Boska'"],
 ['nouka','Nouka','Electric ferries · Buriganga','The boat is silent. You only see its wake.','#0f2a24','#f5f1ea',"400 1em 'Tanker'"],
 ['folio','Folio','Literary quarterly','Pages you actually turn.','#d93a26','#f1ece2',"600 1em 'Gambetta'"],
 ['dark-room','Dark Room','Gallery · Shoreditch','You hold the only light in the room.','#050505','#ece7de',"300 1em 'Sentient'"],
 ['poysha','Poysha','Savings app · Dhaka','Coins with real weight. Throw one.','#f3ede1','#e2401c',"800 1em 'Cabinet Grotesk'"],
 ['badabon','Badabon','Forest lodge · Sundarbans','Something in the roots is watching you.','#070b10','#ece6d6',"400 1em 'Stardom'"],
 ['low-frequency','Low Frequency','Recording rooms · Peckham','The whole page is an instrument.','#0b0908','#ff9338',"700 1em 'Clash Grotesk'"],
 ['eleven','Eleven','Residences · Gulshan Lake','Twenty-two homes. Not one of them faces the road.','#0b1220','#f2ede4',"300 1em 'Bespoke Serif'"],
 ['taant','Taant','Jamdani weaving · Rupganj','Scroll is the shuttle. The cloth weaves itself.','#efe7d6','#22305e',"400 1em 'Erode'"],
 ['sonar','Sonar','Goldsmith · Hatton Garden','Sixteen thousand grains of gold, and your hand.','#0b0908','#e6c066',"400 1em 'Zodiak'"],
 ['eet-o-alo','Eet o Alo','Architects · Dhaka','Walk through a brick wall while the sun crosses a day.','#b5553a','#f3e4d6',"800 1em 'Panchang'"],
 ['haldi','Haldi','Skincare · London','A serum you can touch and pour.','#e8900c','#2a1608',"600 1em 'Chillax'"],
 ['gate-weave','Gate Weave','Film house · Dhaka and London','The page is a projector. Scroll to crank it.','#060505','#efe6d6',"600 1em 'Clash Display'"]];
const pad = i => String(i + 1).padStart(2, '0');

export function nav(opts = {}){
 const drv = opts.drv === undefined ? document.getElementById('drv') : typeof opts.drv === 'string' ? document.querySelector(opts.drv) : opts.drv;
 const list = JSON.parse(document.getElementById('chapters').textContent);
 const slug = location.pathname.split('/').pop().replace('.html', ''), wi = WORLDS.findIndex(w => w[0] === slug);
 const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, subs = [], pastSubs = [];
 const span = () => drv ? Math.max(0, drv.offsetHeight - innerHeight) : 0;
 const topOf = c => c.el ? document.querySelector(c.el).getBoundingClientRect().top + scrollY : c.at !== undefined ? c.at * span() : 0;

 // snap points along the journey: a slow scroll settles on a composed frame; proximity snapping lets a fast scroll run straight through
 const anchors = !drv ? [] : list.filter(c => c.at !== undefined).map(c => { const a = document.createElement('i'); a.className = 'snap-at'; a.setAttribute('aria-hidden', 'true'); drv.appendChild(a); return [a, c]; });
 const place = () => anchors.forEach(([a, c]) => a.style.top = Math.round(c.at * span()) + 'px');
 place(); addEventListener('resize', place);

 // a chapter with "k" is a custom index (Folio's leaves): opts.pos() reads where the visitor is, opts.jump() takes them there
 // Anwar rule 15: over a reading section the credit gets its own reserved band in that section's colours, so it never overprints a line
 const READ = '.use,.cal,.tkt,.locker,.smp,.marks,.pbk,.kitc,.sizes,#keys,#onebox,#register,#papers', tag = document.querySelector('.fsi-tag'); let bandEl = null;
 const solid = el => { for (let e = el; e; e = e.parentElement){ const c = getComputedStyle(e).backgroundColor; if (c && !/rgba\(.*, 0\)|transparent/.test(c)) return c; } return '#0b0b0b'; };
 // and the same band wherever else a line of text would sit under the credit, whatever its section is called (P39: Sonar's collection
 // and ring sizes were not on the list above and the credit printed across them). The credit's own resting place is measured while the
 // band is off; every text node on the page is tried against it, by geometry, so words laid over a canvas with pointer-events off count too.
 let nat = null;
 const SKIP = 'script,style,noscript,button,nav,.ix,.sr,.hint,#snd,.snd,[aria-label="Chapters"],[aria-hidden="true"]';
 const shown = el => { let o = 1; for (let e = el; e; e = e.parentElement){ const s = getComputedStyle(e); if (s.visibility === 'hidden' || s.display === 'none') return false; o *= parseFloat(s.opacity); } return o > .25; };
 // a fixed clock or name bar that sat under the credit kept the band on for a whole page; those are moved clear in the page's own styles
 const under = () => { if (!shown(tag)) return null; if (!document.body.classList.contains('cred-band')) nat = tag.getBoundingClientRect(); if (!nat || !nat.width) return null;
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), rg = document.createRange(); let n;
  while ((n = w.nextNode())){ const p = n.parentElement; if (!p || !n.data.trim() || tag.contains(p)) continue;
   rg.selectNodeContents(n);                                        // the text's own box, not its parent's: rotated and overflowing labels sit outside theirs
   const b = rg.getBoundingClientRect(); if (b.bottom < nat.top + 2 || b.top > nat.bottom - 2 || b.right < nat.left || b.left > nat.right || p.closest(SKIP)) continue;
   for (const r of rg.getClientRects()) if (r.width > 1 && r.right > nat.left && r.left < nat.right && r.bottom > nat.top + 2 && r.top < nat.bottom - 2 && shown(p)) return p; }
  return null; };
 addEventListener('resize', () => { if (bandEl){ bandEl = null; document.body.classList.remove('cred-band'); } nat = null; band(); });
 const band = () => { if (!tag) return; const y = innerHeight - 20; let hit = null;
  document.querySelectorAll(READ).forEach(s => { const r = s.getBoundingClientRect(); if (r.height > 40 && r.top < y - 24 && r.bottom > y + 12) hit = s; });
  if (!hit) hit = under();
  if (hit !== bandEl){ bandEl = hit; document.body.classList.toggle('cred-band', !!hit);
   if (hit){ tag.style.setProperty('--cb-bg', solid(hit)); tag.style.setProperty('--cb-fg', getComputedStyle(hit).color); } } };
 let cur = -1, past = false;
 const check = () => { let i = 0;
  if (opts.pos) i = opts.pos(); else { const y = scrollY + innerHeight * .35; list.forEach((c, k) => { if (c.k === undefined && topOf(c) <= y) i = k; }); }
  if (i !== cur){ cur = i; subs.forEach(f => f(i, list[i])); }
  band();
  const p = drv ? scrollY > drv.offsetHeight - innerHeight * .5 : false;
  if (p !== past){ past = p; document.body.classList.toggle('past', p); pastSubs.forEach(f => f(p)); } };
 let tick = false, late = 0; addEventListener('scroll', () => { if (!tick){ tick = true; requestAnimationFrame(() => { tick = false; check(); }); }
  clearTimeout(late); late = setTimeout(() => { band(); setTimeout(band, 650); }, 300); }, {passive:true});   // and twice more once the page is still: text that fades in after the scroll stops is under the credit too
 const go = i => { i = Math.max(0, Math.min(list.length - 1, i)); const c = list[i];
  if (c.k !== undefined && opts.jump){ opts.jump(c, i); return; }
  scrollTo({top:topOf(c), behavior:reduce ? 'auto' : 'smooth'}); };

 // the index: this world's chapters, then all fifteen worlds, with the neighbours marked
 const ix = document.createElement('div'); ix.className = 'ix'; ix.id = 'ix'; ix.hidden = true;
 ix.setAttribute('role', 'dialog'); ix.setAttribute('aria-modal', 'true'); ix.setAttribute('aria-label', 'Index');
 ix.innerHTML = `<div class="ix-in"><div class="ix-ch"><p class="ix-k">${WORLDS[wi][1]} · chapters</p><ol>${list.map((c, k) => `<li><button type="button" data-i="${k}"><b>${c.n || pad(k)}</b><span>${c.t}</span></button></li>`).join('')}</ol></div>
  <div class="ix-w"><p class="ix-k">Fifteen worlds</p><ol>${WORLDS.map((w, k) => `<li${k === wi ? ' class="here"' : ''}><a href="${w[0]}.html" style="--wb:${w[4]};--wf:${w[5]}"><b>${pad(k)}</b><span>${w[1]}</span><small>${w[2]}</small></a></li>`).join('')}</ol></div>
  <button type="button" class="ix-x">Close</button></div>`;
 document.body.appendChild(ix);
 let back = null;
 const open = () => { back = document.activeElement; ix.hidden = false; requestAnimationFrame(() => ix.classList.add('on')); ix.querySelector('button').focus(); };
 const close = () => { ix.classList.remove('on'); setTimeout(() => ix.hidden = true, reduce ? 0 : 450); if (back) back.focus(); };
 ix.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b){ close(); go(+b.dataset.i); } else if (e.target.closest('.ix-x') || e.target === ix) close(); });
 addEventListener('keydown', e => { if (e.metaKey || e.ctrlKey || e.altKey || /input|textarea/i.test(document.activeElement.tagName)) return;
  if (e.key === 'Escape' && !ix.hidden) close(); else if (e.key === 'i' || e.key === 'I') ix.hidden ? open() : close();
  else if (/^[1-9]$/.test(e.key) && +e.key <= list.length) go(+e.key - 1);
  else if (e.key === 'n') go(cur + 1); else if (e.key === 'b') go(cur - 1); });

 // the door to the next world: its own colour and its own name, rising from the foot of the last chapter
 const next = WORLDS[(wi + 1) % WORLDS.length], prev = WORLDS[(wi + WORLDS.length - 1) % WORLDS.length];
 const door = (el, extra = {}) => { if (!el) return; el.innerHTML = `${extra.before || ''}<a class="door-a" href="${next[0]}.html" style="--nb:${next[4]};--nf:${next[5]};--nfont:${next[6]}">
   <span class="door-k">Next world · ${pad((wi + 1) % WORLDS.length)}</span><span class="door-n">${next[1]}</span><span class="door-l">${next[3]}</span><span class="door-s">${next[2]}</span>${extra.verb ? `<span class="door-v">${extra.verb}</span>` : ''}</a>
   <a class="door-p" href="${prev[0]}.html">Previous world · ${prev[1]}</a>${extra.after || ''}`;
  const io = new IntersectionObserver(es => es.forEach(x => el.style.setProperty('--rise', x.intersectionRatio.toFixed(3))), {threshold:[...Array(21)].map((_, k) => k / 20)}); io.observe(el); };

 // sections below the journey reveal their lines as they arrive; reduced motion shows them at once
 const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) x.target.classList.add('in'); }), {threshold:.25});
 document.querySelectorAll('.reveal').forEach(el => reduce ? el.classList.add('in') : io.observe(el));

 requestAnimationFrame(check);
 return {list, go, open, close, door, next, prev, world:WORLDS[wi], reduce, check, progress:() => span() ? Math.min(1, Math.max(0, scrollY / span())) : 0,
  get past(){ return past; }, onPast:f => { pastSubs.push(f); f(past); }, on:f => { subs.push(f); if (cur >= 0) f(cur, list[cur]); }, get index(){ return cur; }};
}
