// meridian-box.js · Meridian's second act: one box. The door end of a 40 ft high-cube in the line's oxide red, with what is really
// stencilled on one (owner code and number with its check digit, ISO type 45G1, the weights panel, the CSC plate, a bolt seal),
// a tracker that checks the number the way a terminal does (ISO 6346), and the rate card with the three cut-offs.
// Reference: recalled, not read this session (carrier schedule pages need a browser): ISO 6346 marking, standard 40HC weights. All rates fictional.
// P45: the act is the ship's office table under one lamp, upper left. The door is the gate photograph; the tracker, the voyage, the freight
// and the cut-offs are carried on the box's bill of lading. Looked at this session (Wikimedia Commons): "Bill of lading (50116721023)", an
// Australia and New Zealand steam trade bill, form printed in red on buff, purple rubber stamps, the freight sums down the left margin;
// "Bill of Lading - Southern Railway Company front"; "ISO Container Seal", a yellow bolt seal through the lock rod's hasp.
const el = document.getElementById('onebox');
const VAL = (() => { const v = {}; let n = 10; for (const c of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'){ if (n % 11 === 0) n++; v[c] = n++; } return v; })();
const check = s => [...s].reduce((t, c, i) => t + (VAL[c] ?? +c) * 2 ** i, 0) % 11 % 10;
let sd = 61; const r = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
const st = (s, x, y, size = 13, o = .92) => `<text x="${x}" y="${y}" font-family="'JetBrains Mono',monospace" font-weight="700" font-size="${size}" fill="#efe8d8" opacity="${o}" filter="url(#bst)">${s}</text>`;
function door(){
 let ribs = '', rods = '', hinges = '', rust = '';
 for (const x0 of [26, 204]) for (let i = 0; i < 5; i++){ const y = 64 + i * 72; ribs += `<rect x="${x0 + 6}" y="${y}" width="158" height="46" fill="#000" opacity=".12"/><rect x="${x0 + 6}" y="${y}" width="158" height="3" fill="#fff" opacity=".1"/><rect x="${x0 + 6}" y="${y + 43}" width="158" height="3" fill="#000" opacity=".25"/>`; }
 for (const x of [68, 150, 246, 328]){ rods += `<rect x="${x + 2}" y="22" width="6" height="400" rx="3" fill="#000" opacity=".28"/><rect x="${x - 3}" y="20" width="6" height="400" rx="3" fill="#b9b4a8"/><rect x="${x - 3}" y="20" width="2" height="400" fill="#fff" opacity=".35"/><rect x="${x + 1}" y="20" width="2" height="400" fill="#000" opacity=".3"/>
  <rect x="${x - 9}" y="18" width="18" height="12" rx="2" fill="#8f8a7e"/><rect x="${x - 9}" y="410" width="18" height="12" rx="2" fill="#8f8a7e"/>
  <rect x="${x - 7}" y="96" width="14" height="9" rx="2" fill="#6f6a60"/><rect x="${x - 7}" y="330" width="14" height="9" rx="2" fill="#6f6a60"/>
  <rect x="${x < 200 ? x - 4 : x - 42}" y="258" width="46" height="7" rx="3" fill="#b9b4a8"/><rect x="${x < 200 ? x + 30 : x - 44}" y="252" width="14" height="19" rx="2" fill="#6f6a60"/>`; }
 for (const x of [22, 372]) for (let i = 0; i < 4; i++){ const y = 50 + i * 108; hinges += `<rect x="${x}" y="${y}" width="10" height="26" rx="2" fill="#5c241a"/><circle cx="${x + 5}" cy="${y + 13}" r="2" fill="#2c120c"/>`;
  rust += `<path d="M${x + 5} ${y + 26}q${(r() * 6 - 3).toFixed(1)} ${(30 + r() * 50).toFixed(0)} ${(r() * 4 - 2).toFixed(1)} ${(60 + r() * 70).toFixed(0)}" stroke="#4a2010" stroke-width="${(1.5 + r() * 3).toFixed(1)}" opacity=".35" fill="none" filter="url(#bbl)"/>`; }
 return `<svg viewBox="0 0 400 440" role="img" aria-label="The door end of container MRDU 482913 2, a forty foot high-cube, sealed">
 <defs><filter id="bst"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" result="n"/><feColorMatrix in="n" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 1.35" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter>
 <filter id="bbl"><feGaussianBlur stdDeviation="1.6"/></filter>
 <filter id="bgr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".035 .5" numOctaves="3" seed="12"/><feColorMatrix values="0 0 0 0 .12  0 0 0 0 .05  0 0 0 0 .02  0 0 0 .7 -.22"/><feComposite in2="SourceGraphic" operator="in"/></filter>
 <linearGradient id="bli" x1="0" y1=".1" x2="1" y2=".9"><stop offset="0" stop-color="#ffd3a0" stop-opacity=".42"/><stop offset=".45" stop-color="#ffd3a0" stop-opacity=".04"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient></defs>
 <rect x="4" y="4" width="392" height="432" rx="3" fill="#7a3122"/>
 <rect x="20" y="20" width="176" height="400" fill="#8c3b2a"/><rect x="204" y="20" width="176" height="400" fill="#8c3b2a"/>${ribs}
 <rect x="4" y="4" width="392" height="432" fill="#000" filter="url(#bgr)"/>
 <rect x="196" y="20" width="8" height="400" fill="#141414"/>
 ${[[4, 4], [372, 4], [4, 412], [372, 412]].map(([x, y]) => `<rect x="${x}" y="${y}" width="24" height="24" rx="2" fill="#5c241a"/><ellipse cx="${x + 12}" cy="${y + 12}" rx="5" ry="8" fill="#170a06"/>`).join('')}
 ${hinges}${rust}${rods}
 ${st('MRDU 482913', 222, 58, 15)}<rect x="346" y="44" width="18" height="18" fill="none" stroke="#efe8d8" stroke-width="1.6" opacity=".9"/>${st('2', 350, 58, 15)}${st('45G1', 318, 80, 13)}
 ${st('MAX GROSS', 216, 128, 8, .85)}${st('32,500 KG', 300, 128, 8, .85)}${st('71,650 LB', 300, 139, 8, .85)}
 ${st('TARE', 216, 156, 8, .85)}${st('3,880 KG', 300, 156, 8, .85)}${st('8,550 LB', 300, 167, 8, .85)}
 ${st('NET', 216, 184, 8, .85)}${st('28,620 KG', 300, 184, 8, .85)}${st('63,100 LB', 300, 195, 8, .85)}
 ${st('CU. CAP.', 216, 212, 8, .85)}${st('76.4 CU.M', 300, 212, 8, .85)}${st('2,700 CU.FT', 300, 223, 8, .85)}
 <g transform="translate(40 60)"><text font-family="'JetBrains Mono',monospace" font-weight="700" font-size="24" fill="#efe8d8" letter-spacing="2" filter="url(#bst)">MERIDIAN</text>${st('CHATTOGRAM ⇄ FELIXSTOWE', 1, 16, 7.4, .8)}</g>
 <g transform="translate(38 300)"><rect x="2.5" y="3" width="74" height="52" rx="2" fill="#000" opacity=".35"/><rect width="74" height="52" rx="2" fill="#b9b4a8"/><rect width="74" height="52" rx="2" fill="none" stroke="#4d4a43" stroke-width=".8"/><g font-family="'JetBrains Mono',monospace" font-size="4.4" fill="#2a2925"><text x="5" y="10" font-weight="700">CSC SAFETY APPROVAL</text><text x="5" y="19">BD/DNV/0417/2019</text><text x="5" y="27">DATE MANUFACTURED 03/2019</text><text x="5" y="35">MAX GROSS 32,500 KG</text><text x="5" y="43">STACKING 216,000 KG</text></g>${[[4, 4], [70, 4], [4, 48], [70, 48]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#5d5a52"/>`).join('')}</g>
 <g transform="translate(232 276) rotate(8)"><rect x="-3" y="-8" width="18" height="34" rx="3" fill="#000" opacity=".32" filter="url(#bbl)"/><rect x="-3" y="-12" width="6" height="16" rx="2" fill="#d8d4c8"/><rect x="-8" y="2" width="16" height="30" rx="3" fill="#e2b93a"/><rect x="-8" y="2" width="5" height="30" rx="2" fill="#fff" opacity=".25"/><text x="0" y="14" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-weight="700" font-size="4.2" fill="#3a2c05" transform="rotate(90 0 16)">MF 0041729</text></g>
 <path d="M250 372l44 -6l-3 12l-40 5z" fill="#efe8d8" opacity=".12"/><path d="M96 190q30 10 52 -4" stroke="#000" stroke-width="5" opacity=".14" fill="none" filter="url(#bbl)"/>
 <rect x="4" y="4" width="392" height="432" rx="3" fill="url(#bli)" style="mix-blend-mode:overlay"/><rect x="4" y="4" width="392" height="432" rx="3" fill="url(#bli)" opacity=".45"/></svg>`; }

// a port's rubber stamp: two rings and the port's code, worn where the pad ran dry. A leg not yet sailed has only the ring it will be struck in.
const stamp = (code, state) => state === 'wait'
 ? `<svg class="stp wait" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="1.5 4" stroke-linecap="round"/></svg>`
 : `<svg class="stp ${state}" viewBox="0 0 44 44" aria-hidden="true" style="rotate:${(r() * 18 - 9).toFixed(1)}deg;translate:${(r() * 4 - 2).toFixed(1)}px ${(r() * 3 - 1.5).toFixed(1)}px"><g fill="none" stroke="currentColor" filter="url(#bst)"><circle cx="22" cy="22" r="19.6" stroke-width="2.1"/><circle cx="22" cy="22" r="15.4" stroke-width=".8"/><path d="M7.6 15.6H36.4M7.6 28.6H36.4" stroke-width=".8"/></g><text x="22" y="25.7" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-weight="700" font-size="9.6" fill="currentColor">${code}</text></svg>`;
// the chart table's own tool, laid across the corner to hold the paper down: brass dividers, steel points
const dividers = `<svg class="dv" viewBox="0 0 224 60" aria-hidden="true"><defs><linearGradient id="dvb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6dc96"/><stop offset=".45" stop-color="#bb9140"/><stop offset="1" stop-color="#6a4e1e"/></linearGradient>
 <linearGradient id="dvs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1f4f6"/><stop offset=".5" stop-color="#9ba3a9"/><stop offset="1" stop-color="#50575d"/></linearGradient></defs>
 ${[-8, 9].map(a => `<g transform="rotate(${a} 26 30)"><path d="M26 25.2L122 27L122 33L26 34.8Z" fill="url(#dvb)"/><path d="M122 27.3L216 30L122 32.7Z" fill="url(#dvs)"/><path d="M40 26.2L118 27.6" stroke="#fff" stroke-width=".8" opacity=".5"/></g>`).join('')}
 <rect x="1" y="26.2" width="18" height="7.6" rx="3.6" fill="url(#dvb)"/><path d="M4 26.4V33.6M7 26.2V33.8M10 26.2V33.8M13 26.2V33.8" stroke="#5d4518" stroke-width=".7" opacity=".7"/>
 <circle cx="26" cy="30" r="9.4" fill="url(#dvb)"/><circle cx="26" cy="30" r="9.4" fill="none" stroke="#5d4518" stroke-width=".7"/><circle cx="26" cy="30" r="3.3" fill="#4c3812"/><path d="M23.9 29.2L28.1 30.8" stroke="#d9be7c" stroke-width=".9"/><circle cx="22.6" cy="26" r="1.5" fill="#fff" opacity=".7"/></svg>`;

const LEGS = [[-2, 'Sun', 'Through the gate at Chattogram, weighed and sealed', 'CGP'], [0, 'Tue', 'Loaded: bay 14, row 03, tier 82. Sailed 06:00', 'CGP'], [3, 'Fri', 'Dondra Head, Sri Lanka, turning west', 'DDH'], [8, 'Wed', 'Bab-el-Mandeb, into the Red Sea', 'BEM'],
 [12, 'Sun', 'Suez, northbound convoy', 'SUZ'], [17, 'Fri', 'Gibraltar, into the Atlantic', 'GIB'], [21, 'Tue', 'Alongside Felixstowe, lifted off by 14:00', 'FXT'], [22, 'Wed', 'Out of the gate on a lorry', 'FXT']];
el.innerHTML = `<figure class="prt sda">${door()}<figcaption>${'MRDU 482913 2 · 40 ft high-cube · sealed MF 0041729'.split(' · ').map((t, k, a) => `<span>${t}${k < a.length - 1 ? ' ·' : ''}</span>`).join(' ')}</figcaption></figure>
<div class="tx"><p class="k">One box</p><h2>Follow one<br>all the way.</h2>
 <div class="bol">
  <header><b>Meridian Freight</b><span>Bill of lading</span></header>
  <form id="trk"><label for="bn">Box number</label><div><input id="bn" value="MRDU 482913 2" autocomplete="off" spellcheck="false" aria-describedby="bmsg"><button type="submit">Find it</button></div><p id="bmsg">On the water, day 8 of 21.</p></form>
  <div class="bd">
   <div class="frt"><table><thead><tr><th>Quay to quay, all in</th><th>Per box</th></tr></thead><tbody><tr><td>20 ft</td><td>$1,480</td></tr><tr><td>40 ft</td><td>$2,350</td></tr><tr><td>40 ft high-cube</td><td>$2,420</td></tr><tr><td>40 ft refrigerated</td><td>$4,100</td></tr></tbody></table>
    <p class="cut"><span><b>Papers</b> Friday 17:00</span><span><b>Gate closes</b> Sunday 22:00</span><span><b>Sails</b> Tuesday 06:00</span></p></div>
   <ol class="legs">${LEGS.map(([d, w, t, c]) => `<li class="${d < 8 ? 'done' : d === 8 ? 'now' : ''}"${d === 8 ? ' aria-current="step"' : ''}>${stamp(c, d < 8 ? 'done' : d === 8 ? 'now' : 'wait')}<b>${d < 0 ? 'Day −' + -d : 'Day ' + d}</b><i>${w}</i><span>${t}</span></li>`).join('')}</ol>
  </div>${dividers}
 </div></div>`;
// the tracker checks the number as a terminal gate does: four letters, six digits, and a tenth that must agree with the other ten
const msg = el.querySelector('#bmsg'), inp = el.querySelector('#bn'), legs = el.querySelector('.legs');
el.querySelector('#trk').addEventListener('submit', e => { e.preventDefault(); const s = inp.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
 if (!/^[A-Z]{4}\d{7}$/.test(s)){ msg.textContent = 'A box number is four letters and seven digits, like MRDU 482913 2.'; legs.classList.add('off'); return; }
 if (check(s.slice(0, 10)) !== +s[10]){ msg.textContent = `That last digit should be ${check(s.slice(0, 10))}. One wrong character and the check digit catches it.`; legs.classList.add('off'); return; }
 if (s !== 'MRDU4829132'){ msg.textContent = 'A real number, but not one of ours on this sailing.'; legs.classList.add('off'); return; }
 msg.textContent = 'On the water, day 8 of 21.'; legs.classList.remove('off'); });
