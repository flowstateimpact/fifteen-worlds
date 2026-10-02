// Low Frequency: Room A behind the orange gate, Rye Lane. Units are metres; the far wall stands at z -5.2, the floor is y 0.
// The visitor sits on the drum stool. The acoustic panels on the far wall are the sequencer: bare plaster when off, the room's colour when on.
// Every step that fires throws its colour across the wall and up onto the painted name. Leave it alone and the view drifts to the tape machine.
import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {lux} from './lib/lux.js';
await document.fonts.load('800 120px Panchang').catch(()=>{});await document.fonts.load('500 40px Author').catch(()=>{});

// ---- the pattern and the sound: the same engine the room always had
const ROWS=[['KICK',0xff7a3d],['CLAP',0xff4a1c],['HAT',0x7fbf9a],['BASS',0x3a46ff],['STAB',0xffb000]];
const pat=[[0,4,8,12],[4,12],[2,6,10,14,15],[0,3,6,8,11,14],[3,11]];
const BN=[33,33,36,33,31,33,38,36,33,33,36,40,31,33,38,36];
const on=ROWS.map((_,r)=>Array.from({length:16},(_,i)=>pat[r].includes(i)));
let bpm=118;document.getElementById('bpm').oninput=e=>{bpm=+e.target.value;if(dl)dl.delayTime.value=60/bpm*.75};
let ctx,out,dl,an,nb,next=0,step=0;const Q=[];
const mtof=n=>440*Math.pow(2,(n-69)/12);
function init(){ctx=new (window.AudioContext||window.webkitAudioContext)();
 const comp=ctx.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;out=ctx.createGain();out.gain.value=.85;out.connect(comp);comp.connect(ctx.destination);
 an=ctx.createAnalyser();an.fftSize=1024;comp.connect(an);
 dl=ctx.createDelay(1);dl.delayTime.value=60/bpm*.75;const fb=ctx.createGain();fb.gain.value=.34;const lp=ctx.createBiquadFilter();lp.frequency.value=2400;dl.connect(lp);lp.connect(fb);fb.connect(dl);lp.connect(out);
 nb=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
 next=ctx.currentTime+.06;setInterval(sched,25)}
function env(g,t,a,v,dcy){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0008,t+a+dcy)}
function noise(t,dur){const s=ctx.createBufferSource();s.buffer=nb;s.start(t,Math.random()*.5);s.stop(t+dur);return s}
function send(node,amt){const g=ctx.createGain();g.gain.value=amt;node.connect(g);g.connect(dl)}
function hit(r,t,i){
 if(r===0){const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(165,t);o.frequency.exponentialRampToValueAtTime(41,t+.13);env(g,t,.002,1,.46);o.connect(g);g.connect(out);o.start(t);o.stop(t+.5);
  const n=noise(t,.02),ng=ctx.createGain();ng.gain.value=.18;n.connect(ng);ng.connect(out)}
 if(r===1){const n=noise(t,.3),f=ctx.createBiquadFilter(),g=ctx.createGain();f.type='bandpass';f.frequency.value=1500;f.Q.value=.9;
  g.gain.setValueAtTime(0,t);[0,.011,.022].forEach(x=>{g.gain.setValueAtTime(.7,t+x);g.gain.exponentialRampToValueAtTime(.08,t+x+.009)});g.gain.setValueAtTime(.6,t+.03);g.gain.exponentialRampToValueAtTime(.001,t+.24);
  n.connect(f);f.connect(g);g.connect(out);send(g,.25)}
 if(r===2){const n=noise(t,.08),f=ctx.createBiquadFilter(),g=ctx.createGain();f.type='highpass';f.frequency.value=7600;env(g,t,.001,i%2?.22:.34,.05);n.connect(f);f.connect(g);g.connect(out)}
 if(r===3){const o=ctx.createOscillator(),s=ctx.createOscillator(),f=ctx.createBiquadFilter(),g=ctx.createGain(),n=BN[i];o.type='sawtooth';o.frequency.value=mtof(n);s.frequency.value=mtof(n-12);
  f.type='lowpass';f.Q.value=9;f.frequency.setValueAtTime(160,t);f.frequency.exponentialRampToValueAtTime(1100,t+.012);f.frequency.exponentialRampToValueAtTime(190,t+.22);
  env(g,t,.004,.42,.26);o.connect(f);s.connect(f);f.connect(g);g.connect(out);o.start(t);s.start(t);o.stop(t+.32);s.stop(t+.32)}
 if(r===4){const f=ctx.createBiquadFilter(),g=ctx.createGain();f.type='lowpass';f.Q.value=3;f.frequency.setValueAtTime(3200,t);f.frequency.exponentialRampToValueAtTime(500,t+.28);env(g,t,.003,.16,.32);
  [57,60,64,67].forEach((n,k)=>{const o=ctx.createOscillator();o.type='sawtooth';o.frequency.value=mtof(n);o.detune.value=(k-1.5)*7;o.connect(f);o.start(t);o.stop(t+.38)});f.connect(g);g.connect(out);send(g,.55)}}
let vNext=0,vStep=0;function visClock(now){if(ctx&&ctx.state==='running')return;const tt=now/1000;if(!vNext)vNext=tt+.05;while(tt>=vNext){fire(vStep);vNext+=60/bpm/4;vStep=(vStep+1)%16}}
function sched(){while(next<ctx.currentTime+.12){for(let r=0;r<5;r++)if(on[r][step])hit(r,next,step);Q.push([step,next]);next+=60/bpm/4;step=(step+1)%16}}

// ---- the room
const cv=document.getElementById('gl'),phone=innerWidth<700,DPR=Math.min(devicePixelRatio,phone?1.5:2);
const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});
R.setPixelRatio(DPR);R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.15;R.shadowMap.enabled=!phone;R.shadowMap.type=THREE.PCFSoftShadowMap;R.shadowMap.autoUpdate=false;
const S=new THREE.Scene();S.background=new THREE.Color(0x0b0908);
let seed=5;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const sm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};
const X0=-3.5,X1=3.5,ZF=-5.2,ZB=1.9,HT=4.6;
function tex(w,h,draw,rep){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(...rep)}t.anisotropy=8;return t}
// raw plaster, patched and never repainted
const plasterT=tex(512,512,(g,w,h)=>{g.fillStyle='#a79f92';g.fillRect(0,0,w,h);for(let i=0;i<9000;i++){g.fillStyle=`rgba(${rnd()<.5?'60,52,44':'235,228,214'},${.03+rnd()*.07})`;g.beginPath();g.arc(rnd()*w,rnd()*h,.6+rnd()*rnd()*7,0,6.283);g.fill()}for(let i=0;i<60;i++){g.fillStyle=`rgba(70,60,50,${.02+rnd()*.03})`;g.fillRect(rnd()*w,rnd()*h,20+rnd()*90,10+rnd()*60)}},[3,2]);
const plaster=new THREE.MeshStandardMaterial({map:plasterT,roughness:.96});
// parquet, scuffed where stands have stood for twenty years
const parqT=tex(1024,1024,(g,w,h)=>{const pw=256,ph=40;for(let y=0;y<h;y+=ph)for(let x=-((y/ph)%2)*pw/2;x<w;x+=pw){const k=.8+rnd()*.35;g.fillStyle=`rgb(${118*k|0},${84*k|0},${52*k|0})`;g.fillRect(x,y,pw-2,ph-2);
  g.strokeStyle=`rgba(40,26,14,${.12+rnd()*.12})`;g.lineWidth=1;for(let l=0;l<5;l++){g.beginPath();const yy=y+rnd()*ph;g.moveTo(x,yy);g.bezierCurveTo(x+pw*.3,yy+rnd()*6-3,x+pw*.6,yy+rnd()*6-3,x+pw,yy);g.stroke()}}
 g.fillStyle='rgba(20,12,6,.9)';for(let y=0;y<h;y+=ph)g.fillRect(0,y+ph-2,w,2);
 for(let i=0;i<46;i++){g.fillStyle=`rgba(30,20,12,${.12+rnd()*.2})`;g.beginPath();g.ellipse(rnd()*w,rnd()*h,8+rnd()*30,3+rnd()*6,rnd()*3,0,6.283);g.fill()}},[2.2,2.2]);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(X1-X0,ZB-ZF).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({map:parqT,roughness:.38,metalness:0}));floor.position.set(0,0,(ZF+ZB)/2);floor.receiveShadow=true;S.add(floor);
for(const [w,h,x,y,z,ry] of[[X1-X0,HT,0,HT/2,ZF,0],[ZB-ZF,HT,X0,HT/2,(ZF+ZB)/2,Math.PI/2],[ZB-ZF,HT,X1,HT/2,(ZF+ZB)/2,-Math.PI/2],[X1-X0,HT,0,HT/2,ZB,Math.PI]]){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),plaster);m.position.set(x,y,z);m.rotation.y=ry;m.receiveShadow=true;S.add(m)}
{const c=new THREE.Mesh(new THREE.PlaneGeometry(X1-X0,ZB-ZF).rotateX(Math.PI/2),new THREE.MeshStandardMaterial({color:0x201b17,roughness:1}));c.position.set(0,HT,(ZF+ZB)/2);S.add(c)}

// ---- the name, six feet high in house paint, dark until a step lights it
{const W=2048,H=560;const t=tex(W,H,(g)=>{g.clearRect(0,0,W,H);g.fillStyle='#ece6d8';g.textAlign='center';g.textBaseline='alphabetic';
  g.font='800 214px Panchang, sans-serif';let s=W*.94/g.measureText('FREQUENCY').width;g.font=`800 ${214*Math.min(1,s)|0}px Panchang, sans-serif`;
  g.fillText('LOW',W/2,236);g.fillText('FREQUENCY',W/2,512);
  g.globalCompositeOperation='destination-out';for(let i=0;i<9000;i++){g.globalAlpha=.2+rnd()*.8;g.fillRect(rnd()*W,rnd()*H,1+rnd()*3,1+rnd()*2)}
  for(let i=0;i<60;i++){g.globalAlpha=.5;g.fillRect(rnd()*W,rnd()*H,20+rnd()*120,1)}});
 const m=new THREE.Mesh(new THREE.PlaneGeometry(6.3,1.72),new THREE.MeshStandardMaterial({map:t,transparent:true,roughness:.7}));m.position.set(0,phone?3.82:3.52,ZF+.012);if(phone)m.scale.setScalar(.76);m.receiveShadow=true;S.add(m)}

// ---- the sequencer: sixteen columns of five fabric panels, bare plaster when off, the room's colour when on
const PW=.31,PH=phone?.5:.31,PG=.042,P0Y=phone?.65:.98,panels=[],panelMeshes=[];
const pGeo=new THREE.BoxGeometry(PW,PH,.07);
for(let r=0;r<5;r++){panels[r]=[];for(let i=0;i<16;i++){const m=new THREE.Mesh(pGeo,new THREE.MeshStandardMaterial({color:0x6e6a64,roughness:.97}));
 m.position.set((i-7.5)*(PW+PG)+(i>=8?.03:0)-.015,P0Y+(4-r)*(PH+PG),ZF+.05);m.castShadow=m.receiveShadow=true;m.userData={r,i,e:0};S.add(m);panels[r][i]=m;panelMeshes.push(m)}}
// two tones only (Anwar): unlit acoustic foam, and one amber, the colour of a warm bulb behind fabric
const AMB=0xff9338,offC=new THREE.Color(0x6e6a64),rowC=ROWS.map(()=>new THREE.Color(AMB));let lit=false;
function paint(){for(let r=0;r<5;r++)for(let i=0;i<16;i++)panels[r][i].material.color.copy(on[r][i]&&lit?rowC[r]:offC)}paint();
// eight live lights, handed round the panels that fire
const pool=[];for(let k=0;k<8;k++){const l=new THREE.PointLight(0xffffff,0,3.4,2);l.userData={v:0};S.add(l);pool.push(l)}let poolAt=0;
function throwLight(r,i){const l=pool[poolAt++%8],p=panels[r][i].position;l.position.set(p.x,p.y+.08,p.z+.42);l.color.copy(rowC[r]);l.userData.v=1}

// ---- the one lamp: a floor lamp in the corner, a household bulb in a shade browned at the top
const lampP=new THREE.Vector3(-2.55,1.62,-4.55);
{const dark=new THREE.MeshStandardMaterial({color:0x1d1916,roughness:.5,metalness:.6});
 const base=new THREE.Mesh(new THREE.CylinderGeometry(.16,.18,.03,24),dark);base.position.set(lampP.x,.015,lampP.z);S.add(base);
 const pole=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,1.5,8),dark);pole.position.set(lampP.x,.76,lampP.z);S.add(pole);
 const sT=tex(256,128,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#7a5634');gr.addColorStop(.35,'#d9c6a0');gr.addColorStop(1,'#ece0c4');g.fillStyle=gr;g.fillRect(0,0,w,h);for(let i=0;i<400;i++){g.fillStyle='rgba(90,60,30,.05)';g.fillRect(rnd()*w,rnd()*h,1,h)}});
 const shade=new THREE.Mesh(new THREE.CylinderGeometry(.19,.26,.34,32,1,true),new THREE.MeshStandardMaterial({map:sT,emissiveMap:sT,emissive:0xffb46b,emissiveIntensity:.9,side:THREE.DoubleSide,roughness:1}));shade.position.copy(lampP);shade.userData.lamp=true;S.add(shade)}
const lamp=new THREE.PointLight(0xffb46b,0,0,2);lamp.position.copy(lampP).add(new THREE.Vector3(0,-.04,0));S.add(lamp);
if(!phone){lamp.castShadow=true;lamp.shadow.mapSize.set(1024,1024);lamp.shadow.bias=-.004;lamp.shadow.radius=4;lamp.shadow.camera.near=.1;lamp.shadow.camera.far=12}
S.add(new THREE.HemisphereLight(0x26303c,0x0e0a08,.42)); // a cool night fill in the shadows, so the warm light reads as warm
// sodium under the door, far left
const sod=new THREE.PointLight(0xff8a2a,.9,4,2);sod.position.set(X0+.1,.04,-1.1);S.add(sod);
{const g=new THREE.Mesh(new THREE.PlaneGeometry(.95,.012),new THREE.MeshBasicMaterial({color:new THREE.Color(3,1.4,.4)}));g.position.set(X0+.002,.006,-1.1);g.rotation.y=Math.PI/2;S.add(g);
 const door=new THREE.Mesh(new THREE.BoxGeometry(.05,2.1,1),new THREE.MeshStandardMaterial({color:0xc2410f,roughness:.6}));door.position.set(X0+.03,1.06,-1.1);S.add(door)}

// ---- what the metal sees: a small dark room with the lamp, the sodium strip and the panel glow in it
const envS=new THREE.Scene();envS.add(new THREE.Mesh(new THREE.SphereGeometry(10,24,12),new THREE.MeshBasicMaterial({color:0x1a120c,side:THREE.BackSide})));
for(const [c,x,y,z,sx,sy] of[[[6,3.6,2],-3,1.8,-5,.8,.8],[[3,1.2,.3],-4,.1,0,3,.2],[[1.2,.7,.5],0,2,-6,7,2],[[.6,.5,.4],0,5,0,8,.4]]){const m=new THREE.Mesh(new THREE.PlaneGeometry(sx,sy),new THREE.MeshBasicMaterial({color:new THREE.Color(...c),side:THREE.DoubleSide}));m.position.set(x,y,z);m.lookAt(0,1,0);envS.add(m)}
const envT=new THREE.PMREMGenerator(R).fromScene(envS,.04).texture;
// ---- the tape machine, the engineer's chair, the kit: the room's history
const steel=new THREE.MeshPhysicalMaterial({color:0xb9b9b4,metalness:1,roughness:.36,anisotropy:.85,anisotropyRotation:0,envMap:envT,envMapIntensity:1.2});
const machine=new THREE.Group();machine.position.set(2.6,0,-3.0);machine.rotation.y=-.72;S.add(machine);
const reels=[],needles=[];
{const cab=new THREE.Mesh(new THREE.BoxGeometry(.82,.92,.58),new THREE.MeshStandardMaterial({color:0x2a2724,roughness:.55}));cab.position.y=.46;cab.castShadow=cab.receiveShadow=true;machine.add(cab);
 const deck=new THREE.Mesh(new THREE.BoxGeometry(.8,.5,.04),steel);deck.position.set(0,1.18,-.12);deck.rotation.x=-.32;deck.castShadow=true;machine.add(deck);
 const leg=new THREE.Mesh(new THREE.BoxGeometry(.8,.3,.3),new THREE.MeshStandardMaterial({color:0x2a2724,roughness:.55}));leg.position.set(0,1.02,-.2);machine.add(leg);
 const rT=tex(256,256,(g,w)=>{g.fillStyle='#8f8f8a';g.beginPath();g.arc(128,128,126,0,6.283);g.fill();g.fillStyle='#2a1c14';g.beginPath();g.arc(128,128,92,0,6.283);g.fill();
  g.fillStyle='#111';for(let k=0;k<3;k++){g.beginPath();g.arc(128+Math.cos(k*2.094)*60,128+Math.sin(k*2.094)*60,22,0,6.283);g.fill()}g.fillStyle='#bbb';g.beginPath();g.arc(128,128,14,0,6.283);g.fill();
  g.strokeStyle='rgba(120,70,40,.4)';for(let k=40;k<92;k+=3){g.beginPath();g.arc(128,128,k,0,6.283);g.stroke()}});
 for(const x of[-.2,.2]){const rl=new THREE.Mesh(new THREE.CylinderGeometry(.14,.14,.018,40),[new THREE.MeshStandardMaterial({color:0x777,metalness:.8,roughness:.4}),new THREE.MeshStandardMaterial({map:rT,roughness:.5,metalness:.3}),new THREE.MeshStandardMaterial({map:rT})]);
  const hold=new THREE.Group();hold.position.set(x,1.2,-.1);hold.rotation.x=-.32+Math.PI/2;hold.add(rl);machine.add(hold);reels.push(rl)}
 const mT=tex(256,160,(g,w,h)=>{g.fillStyle='#e8dcae';g.fillRect(0,0,w,h);g.strokeStyle='#2b241a';g.lineWidth=2;g.beginPath();g.arc(128,190,140,-2.4,-.74);g.stroke();
  g.fillStyle='#b8321a';g.fillRect(186,40,40,8);g.fillStyle='#2b241a';g.font='600 22px Author, sans-serif';g.fillText('VU',112,132);for(let k=0;k<11;k++){const a=-2.4+k*.166;g.beginPath();g.moveTo(128+Math.cos(a)*140,190+Math.sin(a)*140);g.lineTo(128+Math.cos(a)*124,190+Math.sin(a)*124);g.stroke()}});
 for(const x of[-.2,.2]){const f=new THREE.Mesh(new THREE.PlaneGeometry(.2,.125),new THREE.MeshStandardMaterial({map:mT,emissiveMap:mT,emissive:0xffd78a,emissiveIntensity:1.1,roughness:.4}));f.position.set(x,.74,.291);machine.add(f);
  const nd=new THREE.Mesh(new THREE.BoxGeometry(.003,.1,.002).translate(0,.05,0),new THREE.MeshBasicMaterial({color:0x1b1712}));nd.position.set(x,.672,.294);machine.add(nd);needles.push(nd)}
 const ml=new THREE.PointLight(0xffd08a,.7,2.2,2);ml.position.set(0,.74,.55);machine.add(ml)}
// the engineer's chair, empty, turned toward the room
{const blk=new THREE.MeshStandardMaterial({color:0x151312,roughness:.45}),ch=new THREE.Group();ch.position.set(1.72,0,-2.72);ch.rotation.y=-2.9;S.add(ch);
 const seat=new THREE.Mesh(new THREE.BoxGeometry(.5,.08,.48),blk);seat.position.y=.5;ch.add(seat);const back=new THREE.Mesh(new THREE.BoxGeometry(.46,.56,.06),blk);back.position.set(0,.84,-.22);back.rotation.x=-.12;ch.add(back);
 const post=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.42,8),steel);post.position.y=.26;ch.add(post);
 for(let k=0;k<5;k++){const a=new THREE.Mesh(new THREE.BoxGeometry(.035,.03,.3),blk);a.position.set(Math.sin(k*1.2566)*.15,.05,Math.cos(k*1.2566)*.15);a.rotation.y=k*1.2566;ch.add(a)}
 ch.traverse(o=>{if(o.isMesh)o.castShadow=o.receiveShadow=true})}
// the kit: floor tom and ride at the right hand, the hi-hat at the left, all worn
{const shell=new THREE.MeshStandardMaterial({color:0x5a1f16,roughness:.35,metalness:.1}),head=new THREE.MeshStandardMaterial({color:0xe9e2d0,roughness:.8}),brass=new THREE.MeshStandardMaterial({color:0xb08a3e,metalness:1,roughness:.3,envMap:envT,envMapIntensity:1.4});
 const drum=(x,y,z,r,h)=>{const g=new THREE.Group();g.position.set(x,y,z);S.add(g);const s=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,32,1,true),shell);g.add(s);const t=new THREE.Mesh(new THREE.CircleGeometry(r,32).rotateX(-Math.PI/2),head);t.position.y=h/2;g.add(t);g.traverse(o=>{if(o.isMesh)o.castShadow=o.receiveShadow=true});return g};
 drum(0,.62,-.62,.18,.14);drum(.26,.82,-.95,.15,.2);const k=drum(0,.28,-1.3,.28,.46);k.rotation.x=Math.PI/2;
 const cym=(x,y,z,r,tx,tz)=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(r,r*.98,.006,48),brass);c.position.set(x,y,z);c.rotation.set(tx,0,tz);c.castShadow=true;S.add(c);return c};
 if(!phone){cym(-.72,1.0,-.62,.18,0,0);cym(-.72,1.04,-.62,.18,0,0);cym(-.86,1.42,-.86,.23,.35,-.3)}}
// the whiteboard, prices in marker
{const t=tex(512,340,(g,w,h)=>{g.fillStyle='#f1f0ea';g.fillRect(0,0,w,h);g.fillStyle='rgba(120,130,140,.12)';for(let i=0;i<40;i++)g.fillRect(rnd()*w,rnd()*h,60+rnd()*140,6+rnd()*10);
  g.fillStyle='#1c2a6a';g.font='500 40px Author, sans-serif';g.fillText('ROOM A  £38 / hr',36,90);g.fillText('ROOM B  £22 / hr',36,160);g.fillStyle='#b8321a';g.fillText('open till 3am',36,240)});
 const b=new THREE.Mesh(new THREE.PlaneGeometry(1.1,.73),new THREE.MeshStandardMaterial({map:t,roughness:.3}));b.position.set(X1-.01,1.5,-2.35);b.rotation.y=-Math.PI/2;S.add(b)}

// ---- the camera: seated at the stool, a 32 mm view; idle, it pans to the machine and the empty chair
const cam=new THREE.PerspectiveCamera(phone?90:48,1,.05,40);
const EYE=phone?new THREE.Vector3(0,1.2,1.65):new THREE.Vector3(.12,1.16,-.2),LOOKW=new THREE.Vector3(0,phone?2.45:2.02,ZF),LOOKM=new THREE.Vector3(2.45,.86,-3.05);

// ---- lens and grade: one lamp, two meters; medium grain; halation on the meters and the hot panels
const comp=new EffectComposer(R);comp.addPass(new RenderPass(S,cam));
const film=new ShaderPass({uniforms:{tDiffuse:{value:null},uT:{value:0},uF:{value:0},uR:{value:new THREE.Vector2()}},
 vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform sampler2D tDiffuse;uniform float uT,uF;uniform vec2 uR;varying vec2 vUv;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;vec2 px=1./uR;vec3 b=vec3(0.);for(int i=0;i<16;i++){float a=float(i)*.3927;b+=texture2D(tDiffuse,vUv+vec2(cos(a),sin(a))*px*(8.+mod(float(i),2.)*12.)).rgb;}b/=16.;
  c+=max(b-.84,0.)*vec3(1.,.55,.3)*.5;
  float l=dot(c,vec3(.2126,.7152,.0722));c=mix(c*vec3(.95,.86,.8),c*vec3(1.06,.98,.9),smoothstep(.05,.6,l));
  vec2 q=vUv-.5;c*=1.-dot(q,q)*1.3;c+=(h(floor(vUv*uR/1.6)+fract(uT)*61.)-.5)*.034*(.3+l);gl_FragColor=vec4(c*uF,1.);}`});
comp.addPass(film);comp.addPass(new OutputPass());
// the render: contact shading where surfaces meet, glow only on true light sources, tuned to this world's scale and light
lux(R,S,cam,comp,{hemi:.7,ao:{radius:.5,thickness:1,protect:[.05,.2]},bloom:{strength:.35,radius:.5,threshold:1.3}});
function size(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);comp.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix();film.uniforms.uR.value.set(w*DPR,h*DPR)}
let lastW=innerWidth;addEventListener('resize',()=>{if(!phone||Math.abs(innerWidth-lastW)>innerWidth*.1){lastW=innerWidth;size()}});

// ---- the hand: tap a panel to turn it on or off; drag to paint a run
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();let drag=null,lastInput=performance.now();
function pick(e){ndc.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);ray.setFromCamera(ndc,cam);const h=ray.intersectObjects(panelMeshes,false)[0];return h?h.object.userData:null}
cv.addEventListener('pointerdown',e=>{lastInput=performance.now();const u=pick(e);if(!u)return;drag=!on[u.r][u.i];on[u.r][u.i]=drag;paint();if(ctx&&drag){hit(u.r,ctx.currentTime,u.i);throwLight(u.r,u.i)}});
cv.addEventListener('pointermove',e=>{if(drag===null)return;lastInput=performance.now();const u=pick(e);if(u&&on[u.r][u.i]!==drag){on[u.r][u.i]=drag;paint()}});
addEventListener('pointerup',()=>drag=null);
document.getElementById('clr').onclick=()=>{on.forEach(r=>r.fill(false));paint();lastInput=performance.now()};
document.getElementById('shuf').onclick=()=>{on.forEach((row,r)=>row.forEach((_,i)=>row[i]=Math.random()<[.3,.12,.45,.35,.14][r]||(r===0&&i%4===0)));paint();lastInput=performance.now()};
let opened=-1;const gate=document.getElementById('gate');
gate.addEventListener('click',e=>{init();lit=true;paint();gate.classList.add('up');document.body.classList.add('live');opened=performance.now();lastInput=opened});
if(new URLSearchParams(location.search).has('open')){gate.classList.add('up');opened=performance.now();lastInput=opened;init()}
// a visitor who scrolls past the veil has walked in: the room comes up without sound (a browser allows audio only after a tap)
addEventListener('scroll',function walkIn(){if(opened>=0||scrollY<innerHeight*.08)return;removeEventListener('scroll',walkIn);lit=true;paint();gate.classList.add('up');document.body.classList.add('live');opened=performance.now();lastInput=opened;
 addEventListener('pointerdown',()=>{if(!ctx)init()},{once:true})},{passive:true});

// ---- the frame
function fire(s){cur=s;for(let r=0;r<5;r++)if(on[r][s]){panels[r][s].userData.e=1;throwLight(r,s)}}
const buf=new Uint8Array(1024);let t0=performance.now(),last=t0,cur=-1,yawK=0,lvl=0,idleOverride=new URLSearchParams(location.search).has('idle');
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;const t=(now-t0)/1000,to=opened<0?-1:(now-opened)/1000;
 if(opened>=0)visClock(now);
 if(ctx&&ctx.state==='running'){while(Q.length&&Q[0][1]<=ctx.currentTime){const[s]=Q.shift();fire(s)}
  an.getByteTimeDomainData(buf);let m=0;for(let i=0;i<buf.length;i+=4)m=Math.max(m,Math.abs(buf[i]-128));lvl+=(m/128-lvl)*(m/128>lvl?.5:.06)}
 // panels: the fired ones burn and fall away; the playhead column lifts a little
 for(let r=0;r<5;r++)for(let i=0;i<16;i++){const p=panels[r][i],u=p.userData;u.e*=Math.exp(-dt*7);const ph=i===cur?1:0;
  if(on[r][i]&&lit)p.material.emissive.copy(rowC[r]).multiplyScalar(.1+u.e*1.3+ph*.22);else p.material.emissive.setScalar(ph*.05+u.e*.1)}
 for(const l of pool){l.userData.v*=Math.exp(-dt*5.5);l.intensity=l.userData.v*2.6}
 // the room waits on a dimmer before the gate, then comes up: the lamp first, then the meters
 const up=to<0?0:sm(.4,2.6,to);lamp.intensity=8*(.16+.84*up)*(.985+.015*Math.sin(t*9.1));
 const play=opened>=0?1:0;reels.forEach((rl,k)=>rl.rotation.y-=dt*(1.1+k*.25)*play*up);
 needles.forEach((nd,k)=>{nd.rotation.z=.75-Math.min(1.5,(lvl*2.2+Math.sin(t*1.3+k)*.02)*up)});
 // the camera: breathing at the stool; after twelve quiet seconds it pans to the tape machine and the empty chair
 if(idleOverride)yawK=1;const idle=idleOverride||((now-lastInput)/1000>12&&to>10);yawK+=((idle?1:0)-yawK)*Math.min(1,dt*(idle?.16:1.6));const sp=window.__nv?window.__nv.progress():0,k=Math.max(yawK*yawK*(3-2*yawK),sp*sp*(3-2*sp));
 cam.position.copy(EYE);cam.position.x+=Math.sin(t*.23)*.012*(1-k);cam.position.y+=Math.sin(t*.31)*.006;
 cam.lookAt(LOOKW.clone().lerp(LOOKM,k));
 film.uniforms.uT.value=t;film.uniforms.uF.value=1;
 document.body.classList.toggle('idle',k>.6);
 if(document.body.classList.contains('past'))return;
 comp.render()}
window.__lf={cam,panels,on,get cur(){return cur},get yaw(){return yawK}};
size();R.shadowMap.needsUpdate=true;requestAnimationFrame(frame);
setTimeout(()=>{R.shadowMap.needsUpdate=true},400);
