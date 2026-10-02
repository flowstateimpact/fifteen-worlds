// borsha-calendar.js · the second act: the stall's wall calendar for July 2026, the kind a tea wholesaler gives its customers
// (tin strip crimped along the top, a wire loop, Friday in red, the Bangla date small in each square: 1 July = 17 Asharh, 16 July = 1 Srabon, 1433).
// Every night the owner writes when the rain stopped and he shut. A dash is a dry night. ভোর is dawn: it never stopped.
const BN = '০১২৩৪৫৬৭৮৯', bn = s => String(s).replace(/\d/g, d => BN[d]);
const CLOSE = ['1:40','2:10','dawn','0:30',null,'2:00','3:15','1:05',null,'2:20','dawn','23:40','1:50','2:05',null,'2:30','3:40','dawn','1:10','0:45','2:00',null,'1:30','2:45','dawn','dawn','3:05','1:20',null,'2:15','2:00'];
const DAYS = ['শনি','রবি','সোম','মঙ্গল','বুধ','বৃহঃ','শুক্র'], FIRST = 4; // 1 July 2026 is a Wednesday; the week starts on Saturday
const rnd = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const hand = (t, i) => `<em style="rotate:${(rnd(i,1)*9-6).toFixed(1)}deg;translate:${(rnd(i,2)*8-3).toFixed(1)}px ${(rnd(i,3)*4-2).toFixed(1)}px;font-size:${(17+rnd(i,4)*4).toFixed(1)}px">${t}</em>`;
const NOTE = ['', 'চিনি ৫ কেজি', 'দুধ ২০ লিটার', ''];
const cells = [...Array(FIRST)].map((_, k) => `<li class="e">${NOTE[k] ? `<u style="rotate:${k === 1 ? -8 : -4}deg">${NOTE[k]}</u>` : ''}</li>`);
CLOSE.forEach((c, k) => { const d = k + 1, fri = (FIRST + k) % 7 === 6, bd = d <= 15 ? d + 16 : d - 15;
 let t = c === null ? '—' : c === 'dawn' ? 'ভোর' : bn(c.replace(/^23:/, '11:').replace(/^0:/, '12:'));
 cells.push(`<li class="${fri ? 'f' : ''}${c === 'dawn' ? ' dw' : ''}"><b>${bn(d)}</b><small>${d}</small><i>${bn(bd)}${d === 16 ? '<span> শ্রাবণ</span>' : d === 1 ? '<span> আষাঢ়</span>' : ''}</i>${hand(t, d)}</li>`); });
const wet = CLOSE.filter(c => c !== null).length, dawn = CLOSE.filter(c => c === 'dawn').length;
const el = document.getElementById('cal');
el.innerHTML = `<div class="ct sda"><h2>July, as the kettle kept it.</h2>
 <p>The calendar hangs by the stove. Each night, before the shutter comes down, the hour goes in the square.</p>
 <dl><div><dt>Open</dt><dd>Four in the afternoon, every day of the year</dd></div>
 <div><dt>Close</dt><dd>When the rain stops. On a dry night, ten.</dd></div>
 <div><dt>Last July</dt><dd>${wet} wet nights out of 31. Latest written hour, 3:40. ${dawn} nights it never stopped, and nor did we.</dd></div>
 <div><dt>The room</dt><dd>One bench under a tin roof. Nine can sit. The rest stand, and nobody minds.</dd></div>
 <div><dt>Pay</dt><dd>Cash or bKash. No card machine, no bookings.</dd></div>
 <div><dt>Find it</dt><dd>Lalbagh Road, by the Fort's east wall. Ten minutes on foot from Azimpur bus stand. Look for the fogged glass.</dd></div></dl>
 <p class="key"><span>২:১০</span> the hour we shut <span>—</span> dry night <span>ভোর</span> dawn</p></div>
 <figure class="cw sda" aria-label="The stall's wall calendar for July 2026, with each night's closing hour written in by hand"><i class="nail"></i><div class="cp"><div class="tin"></div>
 <div class="band"><b>রহমান টি হাউস</b><span>চকবাজার, ঢাকা · খুচরা ও পাইকারি চা পাতা</span></div>
 <div class="mo"><b>জুলাই</b><span>July 2026<br>আষাঢ় · শ্রাবণ ১৪৩৩</span></div>
 <ol class="hd">${DAYS.map((d, k) => `<li${k === 6 ? ' class="f"' : ''}>${d}</li>`).join('')}</ol><ol class="gr">${cells.join('')}</ol></div></figure>`;
