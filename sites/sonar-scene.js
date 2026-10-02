// The goldsmith's bench in Hatton Garden, from the goldsmith's own eye. Units are centimetres.
// One lamp. A 22 carat band on a steel mandrel. The cursor is the planishing hammer: every strike is drawn into the band's own surface,
// so the facets on it are the visitor's. Four thousand, and the leopard's head goes on last.
import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {BokehPass} from 'three/addons/postprocessing/BokehPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {lux} from './lib/lux.js';

const cv=document.getElementById('gl'),phone=innerWidth<700,DPR=Math.min(devicePixelRatio,phone?1.5:2);
const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});
R.setPixelRatio(DPR);R.shadowMap.enabled=!phone;R.shadowMap.type=THREE.PCFSoftShadowMap;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.05;
const S=new THREE.Scene();S.background=new THREE.Color(0x070504);
let seed=5;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const sm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};
const GOAL=4000;

// ---- what the metal reflects: a dark workshop, the lamp's hot disc, the warm leather below
{const e=new THREE.Scene();e.add(new THREE.Mesh(new THREE.BoxGeometry(60,60,60),new THREE.MeshBasicMaterial({color:new THREE.Color(.045,.032,.02),side:THREE.BackSide})));
 const apron=new THREE.Mesh(new THREE.PlaneGeometry(26,20),new THREE.MeshBasicMaterial({color:new THREE.Color(.55,.44,.32)}));apron.position.set(-14,16,12);apron.lookAt(0,0,0);e.add(apron);
 const lamp=new THREE.Mesh(new THREE.CircleGeometry(3.2,40),new THREE.MeshBasicMaterial({color:new THREE.Color(13,7.8,3.6)}));lamp.position.set(15,25,-9);lamp.lookAt(0,0,0);e.add(lamp);
 const shade=new THREE.Mesh(new THREE.CircleGeometry(9,40),new THREE.MeshBasicMaterial({color:new THREE.Color(1.9,1.15,.5)}));shade.position.set(15.6,26,-9.36);shade.lookAt(0,0,0);e.add(shade);   // the inside of the shade, lit by the bulb
 const soft=new THREE.Mesh(new THREE.PlaneGeometry(70,70),new THREE.MeshBasicMaterial({color:new THREE.Color(.55,.34,.18)}));soft.position.set(0,-29,4);soft.rotation.x=-Math.PI/2;e.add(soft);
 const rim=new THREE.Mesh(new THREE.PlaneGeometry(50,9),new THREE.MeshBasicMaterial({color:new THREE.Color(1.1,.75,.42)}));rim.position.set(0,6,29);rim.rotation.y=Math.PI;e.add(rim);
 // the rest of the workshop, as the metal sees it: panes, shelves, a second lamp, all out of focus and all different, so each facet catches its own piece
 for(let i=0;i<26;i++){const a=rnd()*6.28,el=-.2+rnd()*1.25,k=.12+Math.pow(rnd(),2)*2.4,p=new THREE.Mesh(new THREE.PlaneGeometry(1.2+rnd()*6,.5+rnd()*3.2),new THREE.MeshBasicMaterial({color:new THREE.Color(k,k*.7,k*.42)}));
  p.position.set(Math.cos(a)*Math.cos(el)*27,Math.sin(el)*27,Math.sin(a)*Math.cos(el)*27);p.lookAt(0,0,0);e.add(p)}
 S.environment=new THREE.PMREMGenerator(R).fromScene(e,.03).texture}

// ---- the band's own surface: red = height, green = roughness. Grain to begin with; each strike presses a shallow facet and burnishes it a little more than the last,
//      so one blow leaves a soft dimple and the finish comes up bright only under the visitor's repeated work.
const HW=phone?512:2048,HH=phone?64:256,hc=document.createElement('canvas');hc.width=HW;hc.height=HH;const hg=hc.getContext('2d',{willReadFrequently:true});
hg.fillStyle='rgb(205,70,0)';hg.fillRect(0,0,HW,HH);
for(let i=0;i<HW*HH/6;i++){const v=170+rnd()*70|0,r=58+rnd()*26|0;hg.fillStyle=`rgb(${v},${r},0)`;hg.fillRect(rnd()*HW,rnd()*HH,1+rnd()*1.5,1+rnd()*1.5)}
hg.globalCompositeOperation='source-over';
const hTex=new THREE.CanvasTexture(hc);hTex.wrapS=THREE.RepeatWrapping;hTex.anisotropy=8;
const RO=1.08,RI=.9,W=.62,CIRC=2*Math.PI*RO,PXC=HW/CIRC,ASP=(HH/W)/PXC;               // pixels per centimetre, round the band
function dent(u,v,big){const x=u*HW,y=(1-v)*HH,r=(big?.13:.075+rnd()*.045)*PXC,rot=rnd()*Math.PI,asp=.62+rnd()*.5,dp=145+rnd()*20|0,px=hg.getImageData(Math.min(HW-1,Math.max(0,x|0)),Math.min(HH-1,Math.max(0,y|0)),1,1).data,gC=Math.max(20,px[1]*.72|0),ox=(rnd()-.5)*r*.4,oy=(rnd()-.5)*r*.4;
 for(const dx of[-HW,0,HW]){hg.save();hg.translate(x+dx,y);hg.scale(1,ASP);hg.rotate(rot);hg.scale(1,asp);const g=hg.createRadialGradient(ox,oy,0,0,0,r);
  g.addColorStop(0,`rgba(${dp},${gC},0,1)`);g.addColorStop(.5,`rgba(${dp+10},${gC+2},0,1)`);g.addColorStop(.84,`rgba(${dp+32},${gC+6},0,.94)`);g.addColorStop(1,`rgba(205,${gC+10},0,0)`);
  hg.globalCompositeOperation='source-over';hg.fillStyle=g;hg.beginPath();hg.arc(0,0,r,0,7);hg.fill();hg.restore()}
 hg.globalCompositeOperation='source-over';dirty=true}
let dirty=false;

// the leopard's head, our own drawing: a cartouche and a cat's face, struck last
function hallmark(u,v,rot=0){const x=u*HW,y=(1-v)*HH,s=.2*PXC;hg.save();hg.translate(x,y);hg.scale(1,ASP);hg.rotate(rot);hg.globalCompositeOperation='source-over';
 const P=(c,f)=>{hg.fillStyle=c;hg.beginPath();f();hg.fill()},LO='rgb(138,112,0)',HI='rgb(182,32,0)',CUT='rgb(146,108,0)';
 P(LO,()=>{hg.moveTo(-s,-s*.8);hg.lineTo(s,-s*.8);hg.lineTo(s,s*.3);hg.quadraticCurveTo(s,s,0,s*1.05);hg.quadraticCurveTo(-s,s,-s,s*.3);hg.closePath()});
 // the heraldic leopard's face: round ears set wide, a broad skull, pointed tufts of cheek fur, a heavy muzzle
 for(const sx of[-1,1]){P(HI,()=>hg.arc(sx*s*.42,-s*.42,s*.15,0,7));P(CUT,()=>hg.arc(sx*s*.42,-s*.41,s*.065,0,7))}
 P(HI,()=>{const q=(a,b,c,d)=>hg.quadraticCurveTo(a*s,b*s,c*s,d*s),l=(a,b)=>hg.lineTo(a*s,b*s);hg.moveTo(0,-s*.46);
  q(.36,-.48,.5,-.22);q(.58,-.02,.68,.2);l(.5,.24);l(.62,.44);l(.36,.46);q(.2,.64,0,.64);q(-.2,.64,-.36,.46);l(-.62,.44);l(-.5,.24);l(-.68,.2);q(-.58,-.02,-.5,-.22);q(-.36,-.48,0,-.46);hg.closePath()});
 hg.strokeStyle=CUT;hg.lineCap='round';hg.lineWidth=s*.05;
 for(const sx of[-1,1]){hg.beginPath();hg.moveTo(sx*s*.07,-s*.14);hg.quadraticCurveTo(sx*s*.2,-s*.22,sx*s*.35,-s*.11);hg.stroke();
  P(CUT,()=>hg.ellipse(sx*s*.2,-s*.03,s*.105,s*.06,sx*.5,0,7));P(HI,()=>hg.arc(sx*s*.2,-s*.03,s*.022,0,7))}
 P(CUT,()=>{hg.moveTo(-s*.12,s*.17);hg.lineTo(s*.12,s*.17);hg.lineTo(0,s*.29);hg.closePath()});
 hg.lineWidth=s*.04;hg.beginPath();hg.moveTo(0,s*.29);hg.lineTo(0,s*.37);hg.quadraticCurveTo(-s*.09,s*.47,-s*.19,s*.4);hg.moveTo(0,s*.37);hg.quadraticCurveTo(s*.09,s*.47,s*.19,s*.4);hg.stroke();
 for(const[px,py]of[[0,-.32],[-.13,-.36],[.13,-.36],[-.4,.12],[.4,.12],[-.3,.28],[.3,.28]])P(CUT,()=>hg.arc(s*px,s*py,s*.03,0,7));
 hg.restore();dirty=true}

// ---- the band: a slightly domed outer face carrying the strikes, a plain inside, two edges
const gold=new THREE.MeshPhysicalMaterial({color:new THREE.Color(1,.72,.3),metalness:1,roughness:1,roughnessMap:hTex,bumpMap:hTex,bumpScale:phone?.42:.6,envMapIntensity:1.5});
const ringU={value:[0,1,2,3,4,5,6,7].map(()=>new THREE.Vector4(0,0,99,0))};
gold.onBeforeCompile=sh=>{sh.uniforms.uS=ringU;sh.uniforms.uC={value:CIRC};sh.uniforms.uW={value:W};
 sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nuniform vec4 uS[8];uniform float uC,uW;')
 .replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
 for(int i=0;i<8;i++){vec4 s=uS[i];if(s.z>1.2)continue;vec2 d=vBumpMapUv-s.xy;d.x=d.x-floor(d.x+.5);d*=vec2(uC,uW);
  float l=length(d),rr=.03+s.z*.62;totalEmissiveRadiance+=vec3(1.,.66,.26)*exp(-pow((l-rr)/.011,2.))*pow(1.-s.z/1.2,2.)*.9*s.w;}`)};
const band=new THREE.Group();S.add(band);
const og=new THREE.CylinderGeometry(RO,RO,W,256,14,true);{const p=og.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),l=Math.hypot(x,z),k=(RO+.028*(1-(2*y/W)**2))/l;p.setXYZ(i,x*k,y,z*k)}og.computeVertexNormals()}
const outer=new THREE.Mesh(og,gold);outer.castShadow=true;
const plain=new THREE.MeshPhysicalMaterial({color:new THREE.Color(1,.72,.3),metalness:1,roughness:.22,envMapIntensity:1.3});
const inner=new THREE.Mesh(new THREE.CylinderGeometry(RI+.004,RI+.004,W,128,1,true),new THREE.MeshPhysicalMaterial({color:new THREE.Color(1,.72,.3),metalness:1,roughness:.22,envMapIntensity:1.3,side:THREE.BackSide}));
const e1=new THREE.Mesh(new THREE.RingGeometry(RI,RO+.01,128),plain),e2=e1.clone();e1.position.y=W/2;e1.rotation.x=-Math.PI/2;e2.position.y=-W/2;e2.rotation.x=Math.PI/2;
const bandBody=new THREE.Group();bandBody.add(outer,inner,e1,e2);bandBody.rotation.z=-Math.PI/2;band.add(bandBody);

// ---- the mandrel: tapered steel, scored by years of other rings
const score=(()=>{const c=document.createElement('canvas');c.width=512;c.height=512;const g=c.getContext('2d');g.fillStyle='#b8b8b8';g.fillRect(0,0,512,512);
 for(let i=0;i<260;i++){g.strokeStyle=`rgba(${rnd()<.5?40:255},${rnd()<.5?40:255},${rnd()<.5?40:255},${.05+rnd()*.12})`;g.lineWidth=.6+rnd()*1.6;const y=rnd()*512;g.beginPath();g.moveTo(0,y);g.lineTo(512,y+(rnd()-.5)*6);g.stroke()}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(1,3);return t})();
const steel=new THREE.MeshPhysicalMaterial({color:0x6c7075,metalness:1,roughness:.44,bumpMap:score,bumpScale:1.2,roughnessMap:score,envMapIntensity:1});
const mandrel=new THREE.Mesh(new THREE.CylinderGeometry(RI+.02*14,RI-.02*1.1,15.1,96),steel);mandrel.rotation.z=-Math.PI/2;mandrel.position.x=6.45;
const tip=new THREE.Mesh(new THREE.SphereGeometry(RI-.02*1.1,64,24,0,Math.PI*2,0,Math.PI/2),steel);tip.scale.y=.35;tip.rotation.z=Math.PI/2;tip.position.x=-1.1;tip.castShadow=true;S.add(tip);mandrel.castShadow=mandrel.receiveShadow=true;S.add(mandrel);

// ---- the catch-skin, the bench, the chalk, the cord
const FLOOR=-1.35;
const leather=(()=>{const c=document.createElement('canvas');c.width=c.height=1024;const g=c.getContext('2d');g.fillStyle='#4b2e1a';g.fillRect(0,0,1024,1024);
 for(let i=0;i<9000;i++){const v=rnd();g.fillStyle=`rgba(${v<.5?20:120},${v<.5?10:80},${v<.5?4:50},${.05+rnd()*.1})`;g.fillRect(rnd()*1024,rnd()*1024,2+rnd()*5,1+rnd()*3)}
 g.save();g.translate(640,720);g.rotate(-.06);g.font='600 92px Satoshi';g.letterSpacing='18px';g.fillStyle='rgba(22,12,6,.55)';g.fillText('SONAR',0,0);g.fillStyle='rgba(140,96,60,.22)';g.fillText('SONAR',0,-3);g.restore();
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();
const skin=new THREE.Mesh(new THREE.PlaneGeometry(14,7.6),new THREE.MeshStandardMaterial({map:leather,bumpMap:leather,bumpScale:1.2,roughness:.78,envMapIntensity:.3}));skin.rotation.x=-Math.PI/2;skin.position.set(0,FLOOR,.4);skin.receiveShadow=true;S.add(skin);
const wood=(()=>{const c=document.createElement('canvas');c.width=1024;c.height=512;const g=c.getContext('2d');g.fillStyle='#3a2616';g.fillRect(0,0,1024,512);
 for(let i=0;i<180;i++){g.strokeStyle=`rgba(${rnd()<.5?18:110},${rnd()<.5?10:70},${rnd()<.5?6:40},${.08+rnd()*.14})`;g.lineWidth=1+rnd()*3;const y=rnd()*512;g.beginPath();g.moveTo(0,y);g.bezierCurveTo(300,y+rnd()*14-7,700,y+rnd()*14-7,1024,y+rnd()*10-5);g.stroke()}
 for(let i=0;i<60;i++){g.strokeStyle='rgba(200,170,130,.12)';g.lineWidth=.8;const x=rnd()*1024,y=rnd()*512;g.beginPath();g.moveTo(x,y);g.lineTo(x+rnd()*60-30,y+rnd()*20-10);g.stroke()}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();
const bench=new THREE.Mesh(new THREE.BoxGeometry(24,1,9),new THREE.MeshStandardMaterial({map:wood,roughness:.7,envMapIntensity:.3}));bench.position.set(0,FLOOR-.46,-7.8);bench.receiveShadow=true;S.add(bench);
const chalkC=document.createElement('canvas');chalkC.width=512;chalkC.height=200;const cg=chalkC.getContext('2d');const chalkT=new THREE.CanvasTexture(chalkC);chalkT.colorSpace=THREE.SRGBColorSpace;chalkT.anisotropy=8;
let chalkSeed=1;
function chalk(n){cg.clearRect(0,0,512,200);cg.save();cg.translate(14,150);cg.rotate(-.03);cg.font='700 132px Satoshi';cg.fillStyle='rgba(236,228,214,.8)';cg.fillText(String(n).padStart(4,'0'),0,0);cg.restore();
 cg.globalCompositeOperation='destination-out';chalkSeed=7;const r2=()=>(chalkSeed=(chalkSeed*16807)%2147483647)/2147483647;
 for(let i=0;i<1400;i++){cg.fillStyle=`rgba(0,0,0,${.2+r2()*.6})`;cg.fillRect(r2()*512,r2()*200,1+r2()*3,1+r2()*2)}
 cg.globalCompositeOperation='source-over';cg.font='500 22px Satoshi';cg.fillStyle='rgba(236,228,214,.55)';cg.fillText('/ 4000',396,150);chalkT.needsUpdate=true}
chalk(0);
const chalkM=new THREE.Mesh(new THREE.PlaneGeometry(phone?1.25:1.3,phone?.49:.51),new THREE.MeshStandardMaterial({map:chalkT,transparent:true,roughness:1,depthWrite:false}));chalkM.rotation.x=-Math.PI/2;chalkM.rotation.z=phone?-.83:-1.08;chalkM.position.set(phone?2.61:2.0,FLOOR+.03,phone?-2.15:.95);S.add(chalkM);
const cord=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[-12,.12,-3.55],[-2,.12,-3.62],[2.5,.12,-3.5],[5,.2,-3.7],[7,.6,-5.4]].map(([x,y,z])=>new THREE.Vector3(x,FLOOR+y,z))),120,.12,8),new THREE.MeshStandardMaterial({color:0x0c0b0a,roughness:.5}));cord.castShadow=true;S.add(cord);
const tape=new THREE.Mesh(new THREE.BoxGeometry(.7,.02,.34),new THREE.MeshStandardMaterial({color:0x8a7f6a,roughness:.9}));tape.position.set(1.2,FLOOR+.25,-3.56);tape.rotation.y=.08;S.add(tape);
// gold dust on the leather, catching the lamp
const dustN=phone?140:420,dp=new Float32Array(dustN*3),ds=new Float32Array(dustN);
for(let i=0;i<dustN;i++){const a=rnd()*6.28,r=Math.pow(rnd(),.7)*3.2;dp[i*3]=Math.cos(a)*r*1.4;dp[i*3+1]=FLOOR+.01;dp[i*3+2]=Math.sin(a)*r*.6+.5;ds[i]=rnd()}
const dG=new THREE.BufferGeometry();dG.setAttribute('position',new THREE.BufferAttribute(dp,3));dG.setAttribute('s',new THREE.BufferAttribute(ds,1));
const dU={uT:{value:0},uOn:{value:0},uPx:{value:DPR}};
S.add(new THREE.Points(dG,new THREE.ShaderMaterial({uniforms:dU,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
 vertexShader:`attribute float s;uniform float uT,uPx;varying float vS;void main(){vec4 m=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*m;vS=s;gl_PointSize=(1.+s*2.2)*uPx*(1.+pow(max(0.,sin(uT*1.3+s*40.)),18.)*2.);}`,
 fragmentShader:`uniform float uOn,uT;varying float vS;void main(){float a=smoothstep(.5,0.,length(gl_PointCoord-.5));float tw=.25+pow(max(0.,sin(uT*1.3+vS*40.)),18.)*1.8;gl_FragColor=vec4(vec3(1.,.76,.36)*a*tw*uOn*(.4+vS*.6),1.);}`})));

// ---- the hammer: a planishing face of polished steel on a worn handle, following the hand
const hammer=new THREE.Group();S.add(hammer);
const face=new THREE.Mesh(new THREE.CylinderGeometry(.34,.36,.9,48),new THREE.MeshPhysicalMaterial({color:0xb9bec4,metalness:1,roughness:.07,envMapIntensity:1.4}));face.position.y=.45;
const cheek=new THREE.Mesh(new THREE.CylinderGeometry(.36,.3,1.6,48),new THREE.MeshPhysicalMaterial({color:0x6d7176,metalness:1,roughness:.35}));cheek.position.y=1.7;
const handle=new THREE.Mesh(new THREE.CylinderGeometry(.16,.2,9,24),new THREE.MeshStandardMaterial({color:0x6b4a2c,roughness:.6}));handle.rotation.z=Math.PI/2;handle.position.set(4.6,1.9,0);
face.castShadow=cheek.castShadow=handle.castShadow=true;hammer.add(face,cheek,handle);hammer.visible=false;

// ---- the lamp: 2900 K, close, and nothing else in the world
const lamp=new THREE.SpotLight(0xffb870,0,40,.42,.75,2);lamp.position.set(5.6,10.2,-3.4);lamp.target.position.set(0,0,.2);lamp.castShadow=!phone;lamp.shadow.mapSize.set(2048,2048);lamp.shadow.bias=-.0003;lamp.shadow.normalBias=.02;lamp.shadow.camera.near=4;lamp.shadow.camera.far=30;S.add(lamp,lamp.target);
const fill=new THREE.HemisphereLight(0x3a2a1c,0x000000,0);S.add(fill);

// ---- lens and grade: the goldsmith's eye, shallow focus, strong halation on the highlight
const cam=new THREE.PerspectiveCamera(phone?30:17,1,.5,80);
const comp=new EffectComposer(R);comp.addPass(new RenderPass(S,cam));
const bokeh=phone?null:new BokehPass(S,cam,{focus:9,aperture:.0022,maxblur:.008});if(bokeh)comp.addPass(bokeh);
const film=new ShaderPass({uniforms:{tDiffuse:{value:null},uT:{value:0},uR:{value:new THREE.Vector2()}},
 vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform sampler2D tDiffuse;uniform float uT;uniform vec2 uR;varying vec2 vUv;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;vec2 px=1./uR;vec3 b=vec3(0.);for(int i=0;i<16;i++){float a=float(i)*.3927;b+=texture2D(tDiffuse,vUv+vec2(cos(a),sin(a))*px*(8.+mod(float(i),2.)*10.)).rgb;}b/=16.;
  c+=max(b-.62,0.)*vec3(1.,.62,.28)*.9;vec2 q=vUv-.5;c*=1.-dot(q,q)*1.1;c+=(h(floor(vUv*uR/1.2)+fract(uT)*91.)-.5)*.02;gl_FragColor=vec4(c,1.);}`});
comp.addPass(film);comp.addPass(new OutputPass());
// the render: contact shading where surfaces meet, glow only on true light sources, tuned to this world's scale and light
lux(R,S,cam,comp,{ao:{radius:1.5,thickness:2,protect:[.05,.2]},bloom:{strength:.3,radius:.5,threshold:1.5}});
function size(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);comp.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix();film.uniforms.uR.value.set(w*DPR,h*DPR)}
addEventListener('resize',size);size();

// ---- sound, only if asked: a struck ring, rising as the band thins
let ac=null,snd=false;const sb=document.getElementById('snd');
if(sb)sb.onclick=()=>{snd=!snd;sb.textContent='Sound · '+(snd?'on':'off');if(snd&&!ac)ac=new AudioContext()};
function ring(k){if(!snd||!ac)return;const t=ac.currentTime,up=1+count/GOAL*.35,o=ac.createGain();o.gain.value=.16*k;o.connect(ac.destination);
 [[2210,.6,.9],[3340,.35,.55],[5120,.2,.3],[7630,.1,.18]].forEach(([f,a,d])=>{const s=ac.createOscillator(),g=ac.createGain();s.frequency.value=f*up*(1+(Math.random()-.5)*.01);g.gain.setValueAtTime(a,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(g);g.connect(o);s.start(t);s.stop(t+d)});
 const n=ac.createBufferSource(),b=ac.createBuffer(1,ac.sampleRate*.03,ac.sampleRate),dd=b.getChannelData(0);for(let i=0;i<dd.length;i++)dd[i]=(Math.random()*2-1)*(1-i/dd.length);n.buffer=b;const ng=ac.createGain();ng.gain.value=.5;n.connect(ng);ng.connect(o);n.start(t)}

// ---- the hand: hover shows the hammer over the band; a click strikes; holding keeps the rhythm and turns the band
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2(-9,-9),hitP=new THREE.Vector3(),hitN=new THREE.Vector3();const markP=new THREE.Vector3(0,.5,.6);let doneAt=0,hitUV=null,holding=false,holdT=0,nextStrike=0,count=0,done=false,touched=false;
const cnt=document.getElementById('cnt');
const cDir=new THREE.Vector3();
function centreUV(){ray.set(cam.position,cDir.copy(LOOK).sub(cam.position).normalize());const h=ray.intersectObject(outer,false)[0];return h&&h.uv?h.uv:new THREE.Vector2(.875,.5)}
function aim(){ray.setFromCamera(ndc,cam);const h=ray.intersectObject(outer,false)[0];if(h&&h.uv){hitUV=h.uv.clone();hitP.copy(h.point);hitN.copy(h.face.normal).transformDirection(outer.matrixWorld);return true}hitUV=null;return false}
addEventListener('pointermove',e=>{ndc.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1)});
cv.addEventListener('pointerdown',e=>{ndc.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);if(aim()){holding=true;holdT=0;touched=true;strike(hitUV.x,hitUV.y);nextStrike=.16}});
addEventListener('pointerup',()=>holding=false);
let slot=0,swing=0,jolt=0;
function strike(u,v){if(done)return;count++;dent(u,v,false);ringU.value[slot].set(u,v,0,1);slot=(slot+1)%8;swing=1;jolt=1;ring(1);
 if(count>=GOAL){done=true;const a=Math.atan2(cam.position.z,cam.position.y)+.3,tp=new THREE.Vector3(-.02,Math.cos(a)*RO,Math.sin(a)*RO);ray.set(cam.position,tp.sub(cam.position).normalize());const h=ray.intersectObject(outer,false)[0];if(h&&h.uv){const p=h.point.clone().project(cam);ray.setFromCamera(new THREE.Vector2(p.x,p.y+.03),cam);const h2=ray.intersectObject(outer,false)[0];let rot=0;if(h2&&h2.uv){let du=h2.uv.x-h.uv.x;du-=Math.round(du);const dx=du*HW,dy=-(h2.uv.y-h.uv.y)*HH/ASP;rot=Math.atan2(dx,-dy)}hallmark(h.uv.x,h.uv.y,rot);markP.copy(h.point)}else{const c=centreUV();hallmark(c.x,.5)}ring(1.6);doneAt=performance.now()/1000;document.body.classList.add('done')}
 chalk(count);if(cnt)cnt.textContent=count}

// ---- time: 0-2 s black and a single ring, 2-5 s the pool resolves, at 6 s one strike lands by itself
const P0=phone?new THREE.Vector3(-2.7,6.7,2.7):new THREE.Vector3(-4.3,7.3,3.8),LOOK=new THREE.Vector3(.15,.5,0);
let last=performance.now(),t0=last,turn=0;
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.1,(now-last)/1000);last=now;const t=(now-t0)/1000;
 if(scrollY>innerHeight*3.2)return;
 const on=sm(2,5,t);lamp.intensity=620*on;fill.intensity=.9*on;gold.envMapIntensity=.35+1.15*on;dU.uOn.value=on;dU.uT.value=film.uniforms.uT.value=t;
 if(!touched&&count===0&&t>6){const c=centreUV();strike(c.x,c.y)}
 // scroll turns the band on the mandrel; holding turns it slowly as a goldsmith would
 const sc=scrollY/innerHeight;if(holding){holdT+=dt;turn+=dt*.32}
 band.rotation.x=-(sc*1.15+turn);
 if(holding&&!done){nextStrike-=dt;if(nextStrike<=0&&aim()){const rate=Math.min(40,5+holdT*5.5);strike(hitUV.x+(rnd()-.5)*.012,Math.min(.92,Math.max(.08,hitUV.y+(rnd()-.5)*.25)));nextStrike=1/rate}}
 const over=!phone||holding?aim():false;
 hammer.visible=over&&on>.9&&!done;
 if(hammer.visible){swing=Math.max(0,swing-dt*9);const lift=.55*(1-Math.pow(swing,.35)*(swing>0?1:0))+.05;hammer.position.copy(hitP).addScaledVector(hitN,lift);hammer.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),hitN.clone().negate());}
 if(dirty&&(Math.floor(t*60)%2===0||!holding)){hTex.needsUpdate=true;dirty=false}
 ringU.value.forEach(s=>{if(s.z<99)s.z+=dt*1.6});
 // the camera: over the stake, a jolt with each strike, a millimetre closer every hundred, and to the mark at the end
 jolt=Math.max(0,jolt-dt*8);const close=Math.min(count,GOAL)/100*.04,fin=done?sm(0,1,(now/1000-doneAt)/2.5):0;
 const lk=LOOK.clone().lerp(markP,fin);cam.position.copy(P0).lerp(lk,close/9+fin*.18);cam.position.y-=jolt*.012;cam.position.x+=Math.sin(t*.13)*.08;
 cam.lookAt(lk.x,lk.y-jolt*.01,lk.z);
 if(bokeh)bokeh.uniforms.focus.value=cam.position.distanceTo(lk);
 comp.render()}
(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>{chalk(count);requestAnimationFrame(frame)});
