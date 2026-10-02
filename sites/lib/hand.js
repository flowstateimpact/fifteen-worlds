// hand.js · an engineer's capitals, drawn as single strokes in a 10 by 14 box (cap top 1, baseline 13), never a typeface.
// Every glyph is placed with its own small wobble, so a word written twice never comes out the same. Used for marker, ballpoint and pencil.
export const GLYPHS = {
 A:'M1 13L5 1L9 13M2.6 8.6L7.4 8.6', B:'M1.5 13L1.5 1L6 1C9 1 9 6.6 6 6.8L1.5 6.8M6 6.8C9.6 7 9.6 13 6 13L1.5 13', C:'M9 3C7.5 .6 1 .4 1 7C1 13.6 7.6 13.4 9 11',
 D:'M1.5 1L1.5 13L5 13C9.5 13 9.5 1 5 1Z', E:'M9 1L1.5 1L1.5 13L9 13M1.5 7L7 7', F:'M9 1L1.5 1L1.5 13M1.5 7L7 7', G:'M9 3C7.5 .6 1 .4 1 7C1 13.6 8.8 13.6 9 8.4L5.6 8.4',
 H:'M1.5 1L1.5 13M8.5 1L8.5 13M1.5 7L8.5 7', I:'M5 1L5 13M2.5 1L7.5 1M2.5 13L7.5 13', J:'M8 1L8 9.6C8 13.8 2 13.8 1.6 10', K:'M1.5 1L1.5 13M8.8 1L1.5 8.4M4 6.2L9 13',
 L:'M1.5 1L1.5 13L9 13', M:'M1 13L1.6 1L5 9L8.4 1L9 13', N:'M1.5 13L1.5 1L8.5 13L8.5 1', O:'M5 1C.6 1 .6 13 5 13C9.4 13 9.4 1 5 1', P:'M1.5 13L1.5 1L6 1C9.6 1 9.6 7.4 6 7.4L1.5 7.4',
 Q:'M5 1C.6 1 .6 13 5 13C9.4 13 9.4 1 5 1M6 9.6L9.4 13.6', R:'M1.5 13L1.5 1L6 1C9.6 1 9.6 7.4 6 7.4L1.5 7.4M5 7.4L9 13', S:'M8.8 2.6C7 .4 1.4 .6 1.6 3.8C1.8 7 8.6 6.4 8.6 10C8.6 13.6 2 13.8 1 11',
 T:'M1 1L9 1M5 1L5 13', U:'M1.5 1L1.5 9C1.5 13.6 8.5 13.6 8.5 9L8.5 1', V:'M1 1L5 13L9 1', W:'M.6 1L2.6 13L5 5L7.4 13L9.4 1', X:'M1 1L9 13M9 1L1 13', Y:'M1 1L5 7L9 1M5 7L5 13', Z:'M1 1L9 1L1 13L9 13',
 0:'M5.2 1.1C2.2 1 1 4.6 1.1 7.6C1.2 10.9 2.6 13 5 13C7.6 13 8.9 10.6 8.9 7.2C8.9 3.8 7.7 1.2 5 1.3', 1:'M2.9 3.6C4 2.8 5 1.9 5.7 1L5.4 13',
 2:'M1.6 4.1C1.9 1.8 3.6 1 5.2 1C7.2 1 8.5 2.3 8.3 4.2C8.1 6.8 4.2 9.2 1.2 12.9L9.2 12.7', 3:'M1.6 2.6C3.4 1 7.8 .6 8 3.6C8.2 5.9 5.4 6.6 3.9 6.8C6.8 6.6 9.1 8.2 8.8 10.5C8.4 13.4 3.2 13.8 1.2 11.7',
 4:'M6.9 13.1L7 1L1.1 9.3L9.4 9.1', 5:'M8.4 1.2L2.4 1.4L1.9 6.4C4.3 5.2 8.5 5.5 8.8 8.9C9.1 12.6 4.1 14 1.4 11.9',
 6:'M7.6 1.4C4.2 1.6 1.2 4.9 1.2 9.2C1.2 11.9 2.9 13.1 5 13C7.4 12.9 8.7 11.2 8.6 9.3C8.5 7.3 6.9 6.1 5.1 6.2C3.2 6.3 1.8 7.4 1.3 8.9', 7:'M1.2 1.7C3.5 1.3 6.6 1.2 9 1.3C7 5 5.4 8.8 4.3 13.1',
 8:'M5.1 7C2 6.2 1.9 1.1 5 1.1C8.1 1.1 8.2 6 5.1 7C1.2 8 1.3 13 5 13C8.9 13 8.9 8 5.1 7', 9:'M8.5 5.2C8.3 2.6 6.9 1.1 5 1.1C2.8 1.1 1.4 2.8 1.5 4.9C1.6 6.9 3.3 7.9 5 7.8C7 7.7 8.4 6.5 8.5 5.2C8.7 8.6 8 11 6.8 13.1',
 '.':'M4.5 12.5l.4.4', '·':'M4.6 7l.4.4', ',':'M5 12.2L4 15', ':':'M4.6 4.6l.4.4M4.6 11.6l.4.4', "'":'M5 1L4.6 4', '"':'M3.5 1L3.2 4M6.5 1L6.2 4', '/':'M8 1L2 13', '-':'M2 7L8 7',
 n:'M1.5 5L1.5 13M1.5 7.5C2.5 4.6 8.4 4.2 8.4 8.2L8.4 13', b:'M1.5 1L1.5 13M1.5 9C1.5 4.6 8.6 4.6 8.6 9C8.6 13.4 1.5 13.4 1.5 9', m:'M1 5L1 13M1 7.4C1.6 4.6 5 4.6 5 7.4L5 13M5 7.4C5.6 4.6 9 4.6 9 7.4L9 13',
 '=':'M1.5 5.5L8.5 5.5M1.5 8.5L8.5 8.5', '+':'M5 3.5L5 10.5M1.5 7L8.5 7', '½':'M1.5 3L3 1.5L3 6.5M8 1.5L2 12.5M6 9C6.4 7.2 9.4 7.4 9 9.2C8.6 10.8 6.4 12 6 13L9.4 13', '&':'M8.6 13L2.4 4.6C1.4 2.6 3 .8 4.6 1C6.4 1.2 6.8 3.6 4.4 5.4C1.6 7.6 .8 9.6 2 11.8C3.4 14 6.6 13.2 8.8 8.6'};
const ADV = {n:9, b:9, m:10, I:7, M:12, W:12, '.':5, '·':5, ',':5, ':':5, "'":5, '"':7, ' ':6, 1:8};

export function rng(seed){ let s = seed % 2147483647 || 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

// hand(text, {size: cap height in the caller's units, slant: degrees, jit: wobble, seed, write: pathLength for a write-on})
// returns {svg, w}: markup of one <g> per glyph, and the written width in the caller's units
export function hand(text, o = {}){
 const size = o.size || 12, k = size / 12, r = rng(o.seed || 1881), j = a => (r() - .5) * 2 * a, jit = o.jit ?? .35;
 let x = 0, n = 0; const parts = [];
 for (const ch of (o.caps === false ? String(text) : String(text).toUpperCase())){
  const d = GLYPHS[ch], adv = (ADV[ch] ?? 11) + j(.5) + (o.track || 0);
  if (d) parts.push(`<g transform="translate(${((x + j(jit)) * k).toFixed(2)} ${(j(jit * 1.2) * k - k).toFixed(2)}) scale(${(k * (1 + j(.04))).toFixed(3)}) skewX(${(o.slant ?? -6).toFixed(1)}) rotate(${j(3.5).toFixed(1)} 5 7)"><path d="${d}"${o.write ? ` pathLength="1" style="--n:${n++}"` : ''}/></g>`);
  x += adv;
 }
 return {svg:parts.join(''), w:x * k};
}

// a hand-drawn loop round a printed option: an ellipse that overshoots where it began
export function loop(cx, cy, rx, ry, seed = 3){ const r = rng(seed), j = a => (r() - .5) * 2 * a, t0 = -2.3 + j(.3);
 let d = ''; for (let s = 0; s <= 40; s++){ const t = t0 + s / 40 * (Math.PI * 2 + .55), q = 1 + .05 * Math.sin(t * 2 + j(1)); d += `${s ? 'L' : 'M'}${(cx + Math.cos(t) * rx * q).toFixed(1)} ${(cy + Math.sin(t) * ry * q * (1 + s / 400)).toFixed(1)}`; }
 return d; }
