// sonar-nav.js · Sonar's chapter control: the jeweller's ring stick. Size letters are chapters; the gold band slides down the taper to where it fits.
import {nav} from './sonar-direction-navlib.js';
const N = nav(), st = document.getElementById('stick'), ol = st.querySelector('ol'), band = st.querySelector('.band'), n = N.list.length;
ol.innerHTML = N.list.map((c, k) => `<li style="--at:${(.06 + .88 * k / (n - 1)).toFixed(3)}"><button type="button" data-i="${k}" aria-label="Size ${c.n} · ${c.t}"></button></li>`).join('');
const size = document.createElement('div'); size.className = 'size'; st.appendChild(size);
ol.addEventListener('click', e => { const b = e.target.closest('button'); if (b) N.go(+b.dataset.i); });
st.querySelector('.ixb').addEventListener('click', N.open);
const show = k => { const c = N.list[k], f = .06 + .88 * k / (n - 1), rod = st.querySelector('.rod'), y = rod.offsetTop + f * rod.offsetHeight;
 band.style.setProperty('--y', (f * rod.offsetHeight) + 'px'); band.style.setProperty('--f', f.toFixed(3)); size.style.setProperty('--y', y + 'px'); size.innerHTML = `<b>${c.n}</b><span>${c.t}</span>`; };
// the chapter name speaks for two seconds on a change, then the stick rests with its band and its size letter; it never speaks inside the collection table or on the door
let first = true, quiet = 0;
document.body.style.setProperty('--dfg', N.next[5]);
N.on((i, c) => { ol.querySelectorAll('button').forEach((b, k) => b.toggleAttribute('aria-current', k === i)); show(i);
 document.body.classList.toggle('at-door', i === n - 1); document.body.classList.toggle('in-table', c.el === '#coll');
 if (first){ first = false; return; } st.classList.add('say'); clearTimeout(quiet); quiet = setTimeout(() => st.classList.remove('say'), 2200); });
ol.addEventListener('focusin', e => { const b = e.target.closest('button'); if (b) size.innerHTML = `<b>${N.list[+b.dataset.i].n}</b><span>${N.list[+b.dataset.i].t}</span>`; });
ol.addEventListener('focusout', () => show(N.index));
N.door(document.getElementById('door'), {verb:'Strike'});

// direction copy: the name bar flips to paper colour only while the first screen's velvet can pass under it,
// and steps out while a reading section (the order book, the hallmark plate) is passing under it
const sheet = document.getElementById('first'), reads = [...document.querySelectorAll('.coll,.marks')];
const onSheet = () => { document.body.classList.toggle('on-sheet', sheet.getBoundingClientRect().bottom > 44);
 document.body.classList.toggle('bar-out', reads.some(s => { const r = s.getBoundingClientRect(); return r.top < 52 && r.bottom > 8; })); };
addEventListener('scroll', onSheet, {passive:true}); addEventListener('resize', onSheet); onSheet();
