// eet-o-alo-works.js · the practice's work: nine buildings, each shown first as its room at eye level, lit by Dhaka's real sun
// at the hour its light was designed for, then as its plan at that hour and its facts, on paper.
// One small stage re-cuts its brick screen for every building: random round holes, a diamond lattice of bricks on edge, or tall
// slots. The wall is two faces 240 mm apart, so a high or slanting sun is narrowed by the brick's own depth, as a real jaali is.
// The plan is computed from the same holes, the same sun and the same depth, so the drawing and the room always agree.
// Every temperature here is modelled, never measured: these are the buildings of a fictional practice.
import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {lux} from './lib/lux.js';

const D2R = Math.PI / 180, T = .24;   // T: one brick, the wall's depth in metres
export const WORKS = [
 {n:'01', name:'Char school', place:'Kurigram', lat:25.8, year:2025, use:'School', status:'Built', hour:16.5, doy:125, date:'5 May', screen:'round', wall:'W', room:[9, 7, 3.6], furn:'desks', seed:11,
  note:'Twelve classrooms around a yard on a river island. In the flood season the yard is water, and the brick piers keep the school open.',
  facts:[['Floor', '1,140 m², twelve classrooms'], ['Raised', '1.8 m on brick piers, above the 2019 flood'], ['Bricks', '41,000, fired four kilometres away'], ['Screen', '2,300 round holes'], ['Modelled', '30.1° inside at 2 pm, 35.4° outside']]},
 {n:'02', name:'Rooftop prayer hall', place:'Uttara', lat:23.87, year:2023, use:'Worship', status:'Built', hour:15.75, doy:80, date:'21 March', screen:'round', wall:'W', room:[10, 10, 4.2], furn:'carpet', seed:23,
  note:'The qibla wall faces west, so the afternoon prayer faces the sun. The wall lets the light in pieces, never in the eyes.',
  facts:[['Floor', '100 m² on a sixth-floor roof'], ['Qibla', '277°, the screen wall itself'], ['Screen', '1,140 round holes'], ['At Asr', 'the pattern crosses the carpet row by row']]},
 {n:'03', name:'Weaving shed', place:'Rupganj', lat:23.79, year:2022, use:'Workshop', status:'Built', hour:12, doy:355, date:'21 December', screen:'slot', wall:'S', room:[18, 10, 4.8], furn:'looms', seed:31, for:['taant', 'Taant'],
  note:'The south wall is for air. The light the looms need comes from the north, even and without shadow.',
  facts:[['Looms', '24 pit looms'], ['Light', 'north roof lights over every loom'], ['Screen', 'slots 60 mm wide, for the breeze'], ['June noon', 'no sun reaches the floor'], ['Modelled', '11° cooler at noon than the tin shed it replaced']]},
 {n:'04', name:'Tea house', place:'Dhanmondi', lat:23.75, year:2021, use:'Tea house', status:'Built', hour:16.75, doy:196, date:'15 July', screen:'lattice', wall:'W', room:[8, 6, 3.4], furn:'tables', seed:41, for:['borsha', 'Borsha'],
  note:'The tea house opens at four. The west wall was built so that four o’clock is when the room lights up.',
  facts:[['Seats', '34'], ['Opens', 'at four; by a quarter to five the west screen draws on the floor'], ['Walls', 'one of glass to the lake, one of brick to the sun'], ['Rain', 'bricks on edge with a 5° fall shed it outward']]},
 {n:'05', name:'Ferry shelter', place:'Wiseghat', lat:23.71, year:2024, use:'Public', status:'Built', hour:16, doy:305, date:'1 November', screen:'round', wall:'W', room:[14, 5, 3.2], furn:'benches', seed:53, for:['nouka', 'Nouka'],
  note:'A shelter on the Buriganga for the electric ferries. You wait in the shade and watch the water through the wall.',
  facts:[['Benches', 'brick, one for each boat'], ['Boats', 'every twelve minutes'], ['Screen', '460 holes, wide enough to see the river'], ['Roof', 'a thin slab on eight brick columns']]},
 {n:'06', name:'House for two sisters', place:'Lalmatia', lat:23.76, year:2020, use:'House', status:'Built', hour:16, doy:80, date:'21 March', screen:'round', wall:'W', room:[11, 7, 3.3], furn:'house', seed:61,
  note:'Two sisters, one kitchen, and one west room they share in the afternoon.',
  facts:[['Floor', '210 m² on three floors'], ['Rooms', 'a shared west room, two private rooms to the east'], ['Screen', '820 round holes'], ['Modelled', '3.6° cooler at four than the street']]},
 {n:'07', name:'Kiln workers’ clinic', place:'Savar', lat:23.85, year:2026, use:'Health', status:'On site', hour:16.5, doy:80, date:'21 March', screen:'lattice', wall:'W', room:[12, 8, 3.6], furn:'beds', seed:71,
  note:'A clinic for the families who fire the bricks, built from the bricks they fire.',
  facts:[['Beds', '8, and a veranda where 40 can wait'], ['Bricks', 'from the kilns its patients work at'], ['Opens', 'December 2026']]},
 {n:'08', name:'Library that floods', place:'Sirajganj', lat:24.45, year:2027, use:'Library', status:'Drawing', hour:15.5, doy:355, date:'21 December', screen:'round', wall:'W', room:[16, 9, 4.4], furn:'shelves', seed:83,
  note:'The reading floor is allowed to go under water. The books are not.',
  facts:[['Books', 'kept above 2.4 m, the highest flood mark'], ['Floor', 'can stand in water for ten days'], ['Stage', 'drawings, for 2027']]},
 {n:'09', name:'Garment workers’ canteen', place:'Ashulia', lat:23.9, year:2026, use:'Canteen', status:'On site', hour:12, doy:355, date:'21 December', screen:'slot', wall:'S', room:[15, 9, 3.8], furn:'tables', seed:97,
  note:'Lunch for 600 in three sittings, in a room that stays cool without a fan running at noon.',
  facts:[['Sittings', 'three, of 200 each'], ['Screen', 'tall south slots over the serving counter'], ['Opens', 'March 2027']]}];

// the sun over the site: altitude and azimuth (from north, clockwise) for a latitude, a day of the year and a local solar hour
export function sunPos(lat, doy, hour){
 const d = 23.44 * Math.sin(2 * Math.PI * (284 + doy) / 365) * D2R, H = (hour - 12) * 15 * D2R, p = lat * D2R;
 const sa = Math.sin(p) * Math.sin(d) + Math.cos(p) * Math.cos(d) * Math.cos(H), alt = Math.asin(sa);
 let az = Math.acos(Math.max(-1, Math.min(1, (Math.sin(d) - sa * Math.sin(p)) / (Math.cos(alt) * Math.cos(p))))); if (H > 0) az = 2 * Math.PI - az;
 return {alt, az}; }
// the same sun in the stage's frame: the screen wall is the plane z = 0, the room lies toward +z, the wall's outside toward -z
function stageSun(w){ const {alt, az} = sunPos(w.lat, w.doy, w.hour), E = Math.sin(az) * Math.cos(alt), N = Math.cos(az) * Math.cos(alt), U = Math.sin(alt);
 return w.wall === 'W' ? new THREE.Vector3(N, U, E) : new THREE.Vector3(-E, U, N); }   // W: +x north, +z east · S: +x west, +z north

// the holes of each screen, in metres along the wall (x from the left, y up), seeded so the room and the plan share them
function holes(w){ let s = w.seed; const r = () => (s = s * 16807 % 2147483647) / 2147483647, [W, , H] = w.room, out = [];
 if (w.screen === 'round'){ for (let k = 0; k < 4000 && out.length < 150; k++){ const rad = .05 + r() * .065, x = .35 + r() * (W - .7), y = .5 + r() * (H - .9);
   if (out.every(o => Math.hypot(o.x - x, o.y - y) > o.r + rad + .07)) out.push({x, y, r:rad, k:'o'}); } }
 else if (w.screen === 'lattice'){ for (let y = .62; y < H - .35; y += .15) for (let x = .3 + ((Math.round(y / .15)) % 2) * .115; x < W - .3; x += .23) out.push({x, y, r:.052, k:'d'}); }
 else { for (const y0 of [.7, 2.0]) for (let x = .5; x < W - .5; x += .38) out.push({x, y:y0 + .45, r:.03, h:.9, k:'s'}); }
 return out; }

// ---- the plan at the hour, drawn as the studio draws it: ink on paper, the light as a wash, the wall's depth doing its work
export function plan(w){
 const [W, D] = w.room, holesL = holes(w), L = stageSun(w), sp = sunPos(w.lat, w.doy, w.hour);
 const scale = [20, 25, 50, 75, 100, 125, 150, 200].find(s => W * 1000 / s <= 190 && D * 1000 / s <= 130) || 250, k = 1000 / scale;
 const ox = 22, oy = 40, f = v => v.toFixed(1), X = x => ox + x * k, Y = z => oy + z * k;   // wall along the top edge, room below
 const u = new THREE.Vector2(-L.x, -L.z).normalize(), cosg = Math.abs(u.y), tang = Math.sqrt(1 - cosg * cosg) / Math.max(cosg, .05), tanA = Math.tan(sp.alt);
 let wash = '';
 for (const h of holesL){ const hw = h.k === 's' ? h.r : h.r, hh = h.k === 's' ? h.h / 2 : h.r;
  const hh2 = h.k === 'd' ? h.r * 1.25 : hh, we = 2 * hw - T * tang, he = 2 * hh2 - T * tanA / Math.max(cosg, .05); if (we <= 0 || he <= 0) continue;   // the brick swallows it
  const t = h.y / L.y, px = h.x - L.x * t, pz = -L.z * t; if (pz <= 0 || pz > D || px < 0 || px > W) continue;
  const a = he / 2 / tanA, b = we / 2, ang = Math.atan2(u.y, u.x) / D2R;
  wash += `<ellipse cx="${f(X(px))}" cy="${f(Y(pz))}" rx="${f(Math.max(.35, a * k))}" ry="${f(Math.max(.3, b * k))}" transform="rotate(${f(ang)} ${f(X(px))} ${f(Y(pz))})"/>`; }
 const tw = T * k, fz = furnPlan(w, X, Y, k);
 const north = w.wall === 'W' ? 90 : 180, sunAng = Math.atan2(u.y, u.x) / D2R;   // drawing angle the sun comes from
 const cx = X(W / 2), cy = oy - tw - 9;
 let screen = ''; for (const h of holesL) if (h.y > .9 && h.y < 1.25) screen += `<circle cx="${f(X(h.x))}" cy="${f(oy - tw / 2)}" r="${f(Math.max(.25, (h.k === 's' ? h.r : h.r) * k))}" fill="#efe6d6"/>`;
 const sb = [0, 1, 2, 5, 10].filter(m => m * k < 60), tx = X(W) + tw + 16, VW = Math.round(tx + 78), VH = Math.round(Math.max(Y(D) + tw + 28, 118));
 return `<svg viewBox="0 0 ${VW} ${VH}" class="pl" role="img" aria-label="Plan of the ${w.name.toLowerCase()} at ${clock(w.hour)} on ${w.date}, with the sun's pattern on the floor">
 <defs><pattern id="h${w.n}" width="1.6" height="1.6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V1.6" stroke="#6b2f1f" stroke-width=".35"/></pattern>
  <filter id="wf${w.n}" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${w.seed}"/><feDisplacementMap in="SourceGraphic" scale=".7"/></filter></defs>
 <g fill="#d9962e" fill-opacity=".78" filter="url(#wf${w.n})" style="mix-blend-mode:multiply">${wash}</g>
 <g stroke="#2b211a" fill="none" stroke-width=".22">${fz}</g>
 <rect x="${f(X(0) - tw)}" y="${f(oy - tw)}" width="${f(W * k + 2 * tw)}" height="${f(tw)}" fill="url(#h${w.n})" stroke="#2b211a" stroke-width=".5"/>${screen}
 <path d="M${f(X(0) - tw)} ${f(oy - tw)} V${f(Y(D) + tw)} H${f(X(W) + tw)} V${f(oy - tw)} M${f(X(0))} ${f(oy)} V${f(Y(D))} H${f(X(W))} V${f(oy)}" stroke="#2b211a" stroke-width=".7" fill="none"/>
 <path d="M${f(X(0) - tw)} ${f(oy - tw)} h${f(tw)} V${f(Y(D))} h${f(-tw)} Z M${f(X(W))} ${f(oy - tw)} h${f(tw)} V${f(Y(D) + tw)} h${f(-tw)} Z M${f(X(0) - tw)} ${f(Y(D))} H${f(X(W * .44))} v${f(tw)} H${f(X(0) - tw)} Z M${f(X(W * .44 + 1.1))} ${f(Y(D))} H${f(X(W) + tw)} v${f(tw)} H${f(X(W * .44 + 1.1))} Z" fill="#3a2a20"/>
 <path d="M${f(X(W * .44))} ${f(Y(D))} a${f(1.1 * k)} ${f(1.1 * k)} 0 0 0 ${f(1.1 * k)} ${f(-1.1 * k)}" stroke="#2b211a" stroke-width=".18" stroke-dasharray=".8 .6" fill="none"/>
 <g stroke="#2b211a" stroke-width=".18" fill="none"><path d="M${f(X(0))} ${f(Y(D) + tw + 6)} H${f(X(W))} M${f(X(0))} ${f(Y(D) + tw + 4)} v4 M${f(X(W))} ${f(Y(D) + tw + 4)} v4"/><path d="M${f(X(W) + tw + 6)} ${f(oy)} V${f(Y(D))} M${f(X(W) + tw + 4)} ${f(oy)} h4 M${f(X(W) + tw + 4)} ${f(Y(D))} h4"/></g>
 <g font-family="Switzer, sans-serif" fill="#2b211a"><text x="${f(X(W / 2))}" y="${f(Y(D) + tw + 5)}" font-size="2.6" text-anchor="middle">${(W * 1000).toLocaleString('en-GB')}</text>
  <text transform="translate(${f(X(W) + tw + 5)} ${f(Y(D / 2))}) rotate(90)" font-size="2.6" text-anchor="middle">${(D * 1000).toLocaleString('en-GB')}</text></g>
 <g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(sunAng)})" stroke="#9c5a1c" fill="none" stroke-width=".35"><path d="M-9 0H-2 M-4.4 -1.6 L-2 0 L-4.4 1.6"/><circle cx="-11.5" r="2.4"/></g>
 <text x="${f(cx + 6)}" y="${f(cy - 3)}" font-family="Switzer, sans-serif" font-size="2.6" fill="#9c5a1c">Sun ${Math.round(sp.alt / D2R)}° up, from ${Math.round(sp.az / D2R)}°</text>
 <g transform="translate(${f(tx + 58)} 26)"><circle r="7" fill="none" stroke="#2b211a" stroke-width=".25"/><path d="M0 -6 L2.2 3 L0 1.4 L-2.2 3 Z" fill="#2b211a" transform="rotate(${north})"/><text y="12.5" font-size="2.6" text-anchor="middle" font-family="Switzer, sans-serif" fill="#2b211a">N</text></g>
 <g transform="translate(${ox} ${VH - 8})" font-family="Switzer, sans-serif" font-size="2.3" fill="#2b211a">${sb.map((m, i) => `<rect x="${f(m * k)}" y="-1.6" width="${f(((sb[i + 1] ?? m) - m) * k)}" height="1.6" fill="${i % 2 ? '#efe6d6' : '#2b211a'}" stroke="#2b211a" stroke-width=".2"/><text x="${f(m * k)}" y="3.4" text-anchor="middle">${m}</text>`).join('')}<text x="${f(sb[sb.length - 1] * k + 4)}" y="0">m</text></g>
 <g transform="translate(${f(tx)} ${VH - 38})" font-family="Switzer, sans-serif" fill="#2b211a"><path d="M0 0H74V30H0Z M0 10H74 M0 20H74 M44 0V30" stroke="#2b211a" stroke-width=".3" fill="none"/>
  <text x="2.4" y="6.6" font-size="3.1" font-weight="600">${esc(w.name)}</text><text x="46.4" y="6.6" font-size="2.6">Drawing ${w.n}.4</text>
  <text x="2.4" y="16.6" font-size="2.6">Plan at ${clock(w.hour)}, ${w.date}</text><text x="46.4" y="16.6" font-size="2.6">1:${scale}</text>
  <text x="2.4" y="26.6" font-size="2.3">Eet o Alo · Dhaka</text><text x="46.4" y="26.6" font-size="2.3">sun modelled</text></g>
</svg>`; }

function furnPlan(w, X, Y, k){ const [W, D] = w.room, r = (x, z, a, b) => `<rect x="${(X(x)).toFixed(1)}" y="${(Y(z)).toFixed(1)}" width="${(a * k).toFixed(1)}" height="${(b * k).toFixed(1)}"/>`; let s = '';
 if (w.furn === 'desks') for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) s += r(1.6 + i * 1.7, 1.8 + j * 1.5, 1.2, .5);
 if (w.furn === 'carpet') for (let j = 0; j < 7; j++) s += `<path d="M${X(.8)} ${Y(1.4 + j * 1.2)}H${X(W - .8)}" stroke-dasharray="1.2 .8"/>`;
 if (w.furn === 'looms') for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) s += r(1.2 + i * 2.8, 2 + j * 2.6, 1.4, 1.8);
 if (w.furn === 'tables') for (let i = 0; i < Math.floor(W / 2.2); i++) for (let j = 0; j < Math.floor(D / 2.2); j++) s += `<circle cx="${X(1.3 + i * 2.2)}" cy="${Y(1.4 + j * 2.2)}" r="${.45 * k}"/>`;
 if (w.furn === 'benches') for (let i = 0; i < 4; i++) s += r(1.2 + i * 3.2, 2.2, 2.4, .45);
 if (w.furn === 'house') s += r(W * .55, 1.2, 2.4, .9) + r(W * .55, 2.6, 2.4, .9) + `<path d="M${X(W * .52)} ${Y(0)}V${Y(D * .62)}H${X(W)}" stroke-dasharray="1.2 .8"/>`;
 if (w.furn === 'beds') for (let i = 0; i < 4; i++) s += r(1.4 + i * 2.6, D - 2.6, .9, 2) + r(1.4 + i * 2.6, 1.6, .9, 2);
 if (w.furn === 'shelves') for (let i = 0; i < 5; i++) s += r(1.4 + i * 3, D - 1.2, 2.2, .4);
 return s; }
const clock = h => { const hh = Math.floor(h), mm = Math.round((h - hh) * 60), am = hh < 12; return hh === 12 && !mm ? 'noon' : `${((hh + 11) % 12) + 1}${mm ? ':' + String(mm).padStart(2, '0') : ''} ${am ? 'am' : 'pm'}`; };
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// ---- the stage: one room, re-cut and re-lit for each building
export function stage(canvas){
 const mob = innerWidth < 760, DPR = Math.min(devicePixelRatio, mob ? 1.5 : 2);
 const R = new THREE.WebGLRenderer({canvas, antialias:true, powerPreference:'high-performance'}); R.setPixelRatio(DPR);
 R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.3;
 const S = new THREE.Scene(); S.background = new THREE.Color(0x0c0806);
 const cam = new THREE.PerspectiveCamera(48, 1, .05, 80);
 const sun = new THREE.DirectionalLight(0xffffff, 0); sun.castShadow = true; sun.shadow.mapSize.set(mob ? 2048 : 4096, mob ? 2048 : 4096); sun.shadow.bias = -.0003; sun.shadow.normalBias = .01; S.add(sun, sun.target);
 const hemi = new THREE.HemisphereLight(0xe8d6c0, 0x2a1810, .22); S.add(hemi);
 const bounce = new THREE.PointLight(0xffb070, 0, 12, 1.2); S.add(bounce);   // the sunlit floor lighting the room from below
 const outside = new THREE.Mesh(new THREE.PlaneGeometry(80, 30), new THREE.MeshBasicMaterial({color:new THREE.Color(3, 2.7, 2.2)})); S.add(outside);
 const cement = new THREE.MeshStandardMaterial({map:cementTex(), roughness:.44, envMapIntensity:.35}), shellM = new THREE.MeshStandardMaterial({color:0x5b463a, roughness:.95}), slabM = new THREE.MeshStandardMaterial({color:0x40362f, roughness:.95});
 const woodM = new THREE.MeshStandardMaterial({color:0x4a2e1c, roughness:.7}), clothM = new THREE.MeshStandardMaterial({color:0x7a2a22, roughness:1}), paleM = new THREE.MeshStandardMaterial({color:0xcfc6b8, roughness:.9});
 const env = new THREE.Scene(); env.add(new THREE.Mesh(new THREE.BoxGeometry(12, 8, 12), new THREE.MeshBasicMaterial({color:0x3a2a20, side:THREE.BackSide})));
 const ep = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), new THREE.MeshBasicMaterial({color:new THREE.Color(2.2, 1.9, 1.5)})); ep.position.set(0, 2, -5.9); env.add(ep);
 S.environment = new THREE.PMREMGenerator(R).fromScene(env, .04).texture;
 let room = new THREE.Group(); S.add(room);
 // dust in the shafts: march through the room and ask this wall's mask whether the sun reaches each point
 const volU = {uMask:{value:null}, uL:{value:new THREE.Vector3()}, uCol:{value:new THREE.Color()}, uI:{value:0}, uT:{value:0}, uW:{value:1}, uH:{value:1}, uD:{value:1}};
 const vol = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.ShaderMaterial({uniforms:volU, side:THREE.BackSide, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
  vertexShader:`varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
  fragmentShader:`uniform sampler2D uMask;uniform vec3 uL,uCol;uniform float uI,uT,uW,uH,uD;varying vec3 vW;
  float h(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}
  float vn(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+1.),f.x),f.y),f.z);}
  void main(){vec3 ro=cameraPosition,rd=normalize(vW-ro);vec3 bmin=vec3(-uW*.5,0.,.01),bmax=vec3(uW*.5,uH,uD);
   vec3 t1=(bmin-ro)/rd,t2=(bmax-ro)/rd;vec3 tn=min(t1,t2),tf=max(t1,t2);float a=max(max(tn.x,tn.y),max(tn.z,0.)),b=min(min(tf.x,tf.y),tf.z);if(b<=a)discard;
   const int N=${mob ? 28 : 64};float dt=(b-a)/float(N),acc=0.,j=fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(.06711056,.00583715))))*dt;
   for(int i=0;i<N;i++){vec3 p=ro+rd*(a+j+dt*float(i));float k=-p.z/uL.z;vec3 q=p+uL*k;
    if(q.y>0.&&q.y<uH&&abs(q.x)<uW*.5){float m=1.-texture2D(uMask,vec2(q.x/uW+.5,q.y/uH)).r;acc+=m*(.3+.9*vn(p*3.+vec3(0.,uT*.05,uT*.03)))*smoothstep(0.,.5,p.y);}}
   gl_FragColor=vec4(uCol*acc*dt*uI,1.);}`}));
 vol.frustumCulled = false; S.add(vol);

 const comp = new EffectComposer(R,new THREE.WebGLRenderTarget(innerWidth*R.getPixelRatio(),innerHeight*R.getPixelRatio(),{type:THREE.HalfFloatType,samples:innerWidth<760?0:4})); comp.addPass(new RenderPass(S, cam));
 // The Wall's finish: highlights bleed warm into the dark, blacks stay umber, a coarse grain, highlights roll off before white
 const film = new ShaderPass({uniforms:{tDiffuse:{value:null}, uT:{value:0}, uR:{value:new THREE.Vector2(1, 1)}},
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`uniform sampler2D tDiffuse;uniform float uT;uniform vec2 uR;varying vec2 vUv;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
  void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;vec2 px=1./uR;vec3 b=vec3(0.);for(int i=0;i<12;i++){float a=float(i)*.5236;b+=texture2D(tDiffuse,vUv+vec2(cos(a),sin(a))*px*12.).rgb;}b/=12.;
   c+=max(b-.72,0.)*vec3(1.,.42,.22)*.42;c=c*.955+vec3(.022,.015,.01);c=min(c,vec3(.965));vec2 q=vUv-.5;c*=1.-dot(q,q)*.55;
   c+=(h(floor(vUv*uR)+fract(uT)*91.)-.5)*.012*(.35+c.g);gl_FragColor=vec4(c,1.);}`});
 comp.addPass(film); comp.addPass(new OutputPass());
 lux(R, S, cam, comp, {hemi:.8, ao:{radius:.5, thickness:1, protect:[.3, 1.2]}, bloom:{strength:.18, radius:.5, threshold:2.2}});
 function size(){ const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return; R.setSize(w, h, false); comp.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix(); film.uniforms.uR.value.set(w * DPR, h * DPR); }
 addEventListener('resize', size); size();

 function build(w){
  S.remove(room); room.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material && o.material.userData.own) { o.material.map?.dispose(); o.material.alphaMap?.dispose(); o.material.dispose(); } });
  room = new THREE.Group(); S.add(room);
  const [W, D, H] = w.room, x0 = -W / 2, add = (g, m, x, y, z) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; room.add(o); return o; };
  // the screen: brick texture and hole mask drawn together, so every hole cuts through a brick as a mason would cut it
  const pxm = Math.min(170, 2048 / W), MW = Math.round(W * pxm), MH = Math.round(H * pxm);
  const bc = document.createElement('canvas'), mc = document.createElement('canvas'); bc.width = mc.width = MW; bc.height = mc.height = MH;
  const bg = bc.getContext('2d'), mg = mc.getContext('2d'); let s = w.seed * 7; const rn = () => (s = s * 16807 % 2147483647) / 2147483647;
  bg.fillStyle = '#6e4a3a'; bg.fillRect(0, 0, MW, MH); const bw = .24 * pxm, bh = .07 * pxm, mj = .012 * pxm;
  for (let r = 0, y = MH; y > -bh; r++, y -= bh + mj) for (let x = -((r % 2) * bw / 2); x < MW; x += bw + mj){ const bloom = rn() < .012;
   bg.fillStyle = bloom ? `hsl(24,20%,${46 + rn() * 5}%)` : `hsl(${12 + rn() * 5},${50 + rn() * 8}%,${31 + rn() * 5 - (rn() < .05 ? 4 : 0)}%)`; bg.fillRect(x, y - bh, bw, bh);
   bg.fillStyle = 'rgba(0,0,0,.12)'; bg.fillRect(x, y - bh * .18, bw, bh * .18); }
  mg.fillStyle = '#fff'; mg.fillRect(0, 0, MW, MH); mg.fillStyle = '#000'; bg.fillStyle = '#1a100a';
  for (const h of holes(w)){ const cx = h.x * pxm, cy = MH - h.y * pxm, rr = h.r * pxm;
   for (const g of [mg, bg]){ g.beginPath(); if (h.k === 'o') g.arc(cx, cy, rr, 0, 7); else if (h.k === 'd') { g.moveTo(cx, cy - rr * 1.25); g.lineTo(cx + rr, cy); g.lineTo(cx, cy + rr * 1.25); g.lineTo(cx - rr, cy); } else g.rect(cx - rr, cy - h.h / 2 * pxm, rr * 2, h.h * pxm); g.fill(); } }
  const map = new THREE.CanvasTexture(bc), alpha = new THREE.CanvasTexture(mc); map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 16;
  for (const z of [0, -T]){ const m = new THREE.MeshStandardMaterial({map, alphaMap:alpha, alphaTest:.5, roughness:.9, side:THREE.DoubleSide, shadowSide:THREE.DoubleSide}); m.userData.own = true;
   const wall = add(new THREE.PlaneGeometry(W, H), m, 0, H / 2, z); }
  add(new THREE.BoxGeometry(W + .5, .22, D + .6), slabM, 0, H + .11, D / 2);
  for (const sx of [-1, 1]) add(new THREE.BoxGeometry(.24, H + .2, D + .6), shellM, sx * (W / 2 + .12), (H + .2) / 2, D / 2);
  add(new THREE.BoxGeometry(W + .5, H + .2, .24), shellM, 0, (H + .2) / 2, D + .3);
  const fl = add(new THREE.PlaneGeometry(W, D + .6), cement, 0, 0, D / 2); fl.rotation.x = -Math.PI / 2; fl.castShadow = false;
  furn3(w, add, {woodM, clothM, paleM, cement});
  outside.position.set(0, 4, -5);
  // the sun at this building's hour: warm and low late, whiter and higher at noon
  const L = stageSun(w), alt = Math.asin(L.y); sun.position.set(0, 0, D / 2).addScaledVector(L, 30); sun.target.position.set(0, 0, D / 2);
  sun.color.set(0xfff0dc).lerp(new THREE.Color(0xffa860), Math.max(0, 1 - alt / (55 * D2R))); sun.intensity = 4.6;
  const sc = sun.shadow.camera, e = Math.max(W, D) * .75 + 2; Object.assign(sc, {left:-e, right:e, top:e, bottom:-e, near:1, far:70}); sc.updateProjectionMatrix();
  vol.scale.set(W, H, D); vol.position.set(0, H / 2, D / 2 + .005); volU.uMask.value = alpha; volU.uW.value = W; volU.uH.value = H; volU.uD.value = D;
  volU.uL.value.copy(L); volU.uCol.value.copy(sun.color); volU.uI.value = mob ? .5 : .42;
  let bx = 0, bz = 0, bn = 0; for (const hh of holes(w)){ const t = hh.y / L.y, px = hh.x - W / 2 - L.x * t, pz = -L.z * t; if (pz > 0 && pz < D && Math.abs(px) < W / 2){ bx += px; bz += pz; bn++; } }
  bounce.position.set(bn ? bx / bn : 0, -.4, bn ? bz / bn : D * .4); bounce.color.copy(sun.color); bounce.intensity = Math.min(4, .8 + bn * .025);   // just under the floor: it lifts undersides and walls, never a hot spot
  // eye level, standing in the back corner, the screen and its light on the floor both in the frame
  cam.position.set(W * .36, 1.55, D * .95); cam.lookAt(-W * .08, mob ? .6 : .45, D * .32); cam.fov = mob ? 62 : 50; cam.updateProjectionMatrix(); }

 let raf = 0, on = false; const loop = now => { raf = on ? requestAnimationFrame(loop) : 0; film.uniforms.uT.value = volU.uT.value = now / 1000; comp.render(); };
 new IntersectionObserver(es => { on = es[0].isIntersecting; if (on && !raf) raf = requestAnimationFrame(loop); }).observe(canvas);
 return {build, size, R}; }

function furn3(w, add, M){ const [W, D] = w.room, x0 = -W / 2, B = (a, b, c) => new THREE.BoxGeometry(a, b, c);
 if (w.furn === 'desks') for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++){ add(B(1.2, .05, .5), M.woodM, x0 + 2.2 + i * 1.7, .72, 2.05 + j * 1.5); add(B(1.1, .45, .04), M.woodM, x0 + 2.2 + i * 1.7, .45, 2.3 + j * 1.5); }
 if (w.furn === 'carpet') for (let j = 0; j < 7; j++) add(B(W - 1.6, .012, 1.1), j % 2 ? M.clothM : M.paleM, 0, .006, 1.4 + j * 1.2 + .55);
 if (w.furn === 'looms') for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++){ const x = x0 + 1.9 + i * 2.8, z = 2.9 + j * 2.6; add(B(1.4, .08, .08), M.woodM, x, .9, z - .9); add(B(1.4, .08, .08), M.woodM, x, 1.2, z + .9); add(B(.06, 1.2, .06), M.woodM, x - .7, .6, z + .9); add(B(.06, 1.2, .06), M.woodM, x + .7, .6, z + .9); add(B(1.3, .005, 1.8), M.paleM, x, 1.04, z); }
 if (w.furn === 'tables') for (let i = 0; i < Math.floor(W / 2.2); i++) for (let j = 0; j < Math.floor(D / 2.2); j++){ const x = x0 + 1.3 + i * 2.2, z = 1.4 + j * 2.2; const t = add(new THREE.CylinderGeometry(.45, .45, .04, 24), M.woodM, x, .74, z); add(new THREE.CylinderGeometry(.04, .05, .72, 8), M.woodM, x, .36, z); }
 if (w.furn === 'benches') for (let i = 0; i < 4; i++) add(B(2.4, .45, .45), M.cement, x0 + 2.4 + i * 3.2, .225, 2.4);
 if (w.furn === 'house'){ add(B(2.4, .42, .9), M.clothM, x0 + W * .55 + 1.2, .21, 1.65); add(B(2.4, .42, .9), M.clothM, x0 + W * .55 + 1.2, .21, 3.05); add(B(1.2, .42, 1.2), M.woodM, x0 + W * .3, .21, 2.4); }
 if (w.furn === 'beds') for (let i = 0; i < 4; i++) for (const z of [2.6, D - 1.6]) add(B(.9, .55, 2), M.paleM, x0 + 1.85 + i * 2.6, .275, z);
 if (w.furn === 'shelves') for (let i = 0; i < 5; i++) add(B(2.2, 2.2, .4), M.woodM, x0 + 2.5 + i * 3, 3.5, D - 1);   // the books ride above the flood mark
}

function cementTex(){ const c = document.createElement('canvas'); c.width = c.height = 1024; const g = c.getContext('2d'); let s = 5; const r = () => (s = s * 16807 % 2147483647) / 2147483647;
 g.fillStyle = '#a79c8e'; g.fillRect(0, 0, 1024, 1024);
 for (let i = 0; i < 60; i++){ const x = r() * 1024, y = r() * 1024, rr = 80 + r() * 260, gr = g.createRadialGradient(x, y, 0, x, y, rr), v = r() < .5; gr.addColorStop(0, v ? 'rgba(255,245,230,.07)' : 'rgba(40,30,20,.07)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 1024, 1024); }
 for (let i = 0; i < 220; i++){ const x = r() * 1024, y = r() * 1024, rr = 60 + r() * 140, a = r() * 6.28; g.strokeStyle = `rgba(${r() < .5 ? '255,250,240' : '50,40,30'},${.03 + r() * .05})`; g.lineWidth = 1 + r() * 3; g.beginPath(); g.arc(x, y, rr, a, a + .6 + r() * .8); g.stroke(); }
 const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3); t.anisotropy = 16; return t; }

// ---- the page: the register of all nine, then one step per building beside the stage
export function mountWorks(){
 const reg = document.getElementById('register'), steps = document.getElementById('steps'), cv = document.getElementById('wkc'), cap = document.getElementById('wkcap');
 reg.innerHTML = WORKS.map(w => `<li><a href="#w${w.n}"><b>${w.n}</b><span class="nm">${esc(w.name)}</span><span>${w.place}</span><span>${w.year}</span><span>${w.use}</span><span class="st st-${w.status.replace(' ', '').toLowerCase()}">${w.status}</span></a></li>`).join('');
 steps.innerHTML = WORKS.map((w, i) => `<li class="step" id="w${w.n}" data-i="${i}"><p class="no">${w.n}<span>${w.status}</span></p><h3>${esc(w.name)}</h3>
  <p class="meta">${w.place} · ${w.year} · ${w.use}${w.for ? ` · for <a href="${w.for[0]}.html">${w.for[1]}</a>` : ''}</p><p class="note">${esc(w.note)}</p>
  <dl class="facts">${w.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  <figure class="sheet">${plan(w)}<figcaption>Plan at ${clock(w.hour)}, ${w.date}. The pattern is Dhaka's sun at that hour through this wall, modelled.</figcaption></figure></li>`).join('');
 const st = stage(cv); let cur = -1, first = true;
 const show = i => { if (i === cur) return; cur = i; const w = WORKS[i], sp = sunPos(w.lat, w.doy, w.hour);
  cv.classList.add('cut'); setTimeout(() => { st.build(w); cv.classList.remove('cut'); }, first ? 0 : 220); first = false;
  cap.innerHTML = `<b>${w.n} · ${esc(w.name)}</b>${clock(w.hour)}, ${w.date} · the sun ${Math.round(sp.alt / D2R)}° up, from ${Math.round(sp.az / D2R)}°`;
  steps.querySelectorAll('.step').forEach((s, k) => s.classList.toggle('on', k === i)); };
 show(0);
 const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) show(+x.target.dataset.i); }), {rootMargin:'-45% 0px -45% 0px'});
 steps.querySelectorAll('.step').forEach(el => io.observe(el));
 return {show, stage:st}; }
