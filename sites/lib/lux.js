// lux.js · the shared lighting kit for the Fifteen Worlds.
// Every world already renders through the same pipe: EffectComposer -> RenderPass(S,cam) -> its own film pass -> OutputPass.
// lux() slots what a renderer adds into that pipe, tuned per world by its options:
//   contact shading where surfaces meet (GTAO), bloom on true light sources only, image light built from the world's own sky,
//   filmic tone (AgX) where it reads better than ACES, the flat hemisphere fill turned down once the image light carries the scene.
// A frame-time check steps the effects down on a slow device, AO first, then bloom. ?lux=full holds them on (test shots), ?lux=off removes them.
import * as THREE from 'three';
import {GTAOPass} from 'three/addons/postprocessing/GTAOPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';

export function skyEnv(R, s){
 const m = new THREE.ShaderMaterial({side:THREE.BackSide, uniforms:{
   uT:{value:new THREE.Color(s.top)}, uH:{value:new THREE.Color(s.horizon)}, uG:{value:new THREE.Color(s.ground)},
   uD:{value:new THREE.Vector3(...(s.sun?.dir || [0,1,0])).normalize()}, uS:{value:new THREE.Color(s.sun?.color ?? 0).multiplyScalar(s.sun?.power ?? 0)}},
  vertexShader:`varying vec3 vD;void main(){vD=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`uniform vec3 uT,uH,uG,uD,uS;varying vec3 vD;void main(){vec3 d=normalize(vD);
   vec3 c=d.y>0.?mix(uH,uT,pow(d.y,.5)):mix(uH,uG,pow(-d.y,.35));float k=max(dot(d,uD),0.);c+=uS*(pow(k,600.)+.03*pow(k,8.));gl_FragColor=vec4(c,1.);}`});
 const es = new THREE.Scene(); es.add(new THREE.Mesh(new THREE.SphereGeometry(10,48,24), m));
 const pm = new THREE.PMREMGenerator(R), t = pm.fromScene(es, 0).texture; pm.dispose(); m.dispose(); return t;
}

export function lux(R, S, cam, comp, o = {}){
 const QS = new URLSearchParams(location.search), mode = QS.get('lux'), tq = QS.get('tone'), phone = innerWidth < 760, st = {ao:null, bloom:null, steps:[], ema:16};
 window.__lux = st;
 if (mode === 'off') return st;
 if (tq === 'agx' || (!tq && o.tone === 'agx')) R.toneMapping = THREE.AgXToneMapping;
 if (tq === 'aces') R.toneMapping = THREE.ACESFilmicToneMapping;
 if (o.exposure != null) R.toneMappingExposure = o.exposure;
 if (o.hemi != null) S.traverse(x => { if (x.isHemisphereLight) x.intensity *= o.hemi; });
 if (o.sky && !S.environment) S.environment = skyEnv(R, o.sky);
 if (o.envMul != null){ const seen = new Set(); S.traverse(x => { const m = x.material; if (m && m.isMeshStandardMaterial && !seen.has(m)){ seen.add(m); m.envMapIntensity *= o.envMul; } }); }

 let at = 1;
 if (o.ao !== false){
  const a = Object.assign({radius:.5, thickness:1, distanceExponent:1, scale:1, distanceFallOff:1, blend:1}, o.ao);
  const ao = new GTAOPass(S, cam, innerWidth, innerHeight);
  ao.updateGtaoMaterial({radius:a.radius, distanceExponent:a.distanceExponent, thickness:a.thickness, scale:a.scale, samples:phone ? 8 : 16, distanceFallOff:a.distanceFallOff, screenSpaceRadius:false});
  ao.updatePdMaterial({lumaPhi:10, depthPhi:2, normalPhi:3, radius:phone ? 4 : 6, radiusExponent:1, rings:2, samples:phone ? 8 : 16});
  ao.blendIntensity = a.blend;
  // contact shading darkens the light that bounces round a room, never a light source: bright pixels (a lit window, a lamp, a bulb) are exempt,
  // fading in between the two luminance values of a.protect, measured on the linear image before tone mapping
  const [lo, hi] = a.protect || [.25, .9], bu = ao.blendMaterial.uniforms;
  bu.tBeauty = {value:null}; bu.uLo = {value:lo}; bu.uHi = {value:hi};
  ao.blendMaterial.fragmentShader = `uniform float intensity,uLo,uHi;uniform sampler2D tDiffuse,tBeauty;varying vec2 vUv;void main(){vec4 t=texture2D(tDiffuse,vUv);
   float l=dot(texture2D(tBeauty,vUv).rgb,vec3(.2126,.7152,.0722));gl_FragColor=vec4(mix(vec3(1.),t.rgb,intensity*(1.-smoothstep(uLo,uHi,l))),t.a);}`;
  ao.blendMaterial.needsUpdate = true;
  // the AO pass re-renders the scene for depth and normals: glass, haze, rain, sprites and lines stay out of it (they would print
  // their outline as a dark halo), and mirrors keep their depth but skip re-rendering their reflection a second time each frame
  const r0 = ao.render.bind(ao);
  ao.render = function(...args){
   const hid = [], fns = [];
   S.traverse(x => { if (!x.visible) return; const m = x.material;
    if (x.isReflector || x.userData.mirror){ fns.push([x, x.onBeforeRender]); x.onBeforeRender = () => {}; return; }
    if (x.isPoints || x.isLine || x.isSprite || x.userData.noAO || (m && !Array.isArray(m) && (m.transparent || m.depthWrite === false))){ x.visible = false; hid.push(x); } });
   bu.tBeauty.value = args[2] ? args[2].texture : null;
   r0(...args); for (const x of hid) x.visible = true; for (const [x, f] of fns) x.onBeforeRender = f;
  };
  comp.insertPass(ao, at++); st.ao = ao;
 }
 if (o.bloom !== false){
  const b = Object.assign({strength:.35, radius:.55, threshold:1}, o.bloom);
  const bl = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), b.strength, b.radius, b.threshold);
  comp.insertPass(bl, at++); st.bloom = bl;
 }

 // the frame-time floor: after the first 3.5 s, a frame averaging slower than the budget steps the heaviest effect down
 const full = mode === 'full', budget = o.budget || 24, cr = comp.render.bind(comp), t0 = performance.now();
 let last = 0, n = 0, level = 0;
 comp.render = function(d){
  const now = performance.now(), dt = now - last; last = now; n++;
  if (dt > 0 && dt < 200) st.ema = st.ema * .94 + dt * .06;
  if (!full && now - t0 > 3500 && n % 30 === 0 && st.ema > budget && level < 2){
   level++; if (level === 1 && st.ao) st.ao.enabled = false; else if (st.bloom) st.bloom.enabled = false;
   st.steps.push([Math.round(now - t0), Math.round(st.ema)]); st.ema = 16;
  }
  cr(d);
 };
 return st;
}
