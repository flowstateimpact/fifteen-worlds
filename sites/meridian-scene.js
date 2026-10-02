// Meridian: a direct container line, Chattogram to Felixstowe. You stand on the gangway under a wall of container doors.
// Units are metres. The hatch-cover top is y=0, the bow points to -z, the port side is -x, the sea is y=-9.
// Scroll and a sideways drag are one timeline: the last boxes land, the ship sails the lane, the camera cranes up the stack,
// then a long telephoto look down the ship at Felixstowe. The horizon is real coastline, computed from Natural Earth points.
import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {lux} from './lib/lux.js';
const [LL]=await Promise.all([fetch('meridian-land.json').then(r=>r.json()).then(j=>j.ll).catch(()=>[]),document.fonts.load("700 80px 'JetBrains Mono'").catch(()=>{}),document.fonts.load("400 20px 'JetBrains Mono'").catch(()=>{})]);

const cv=document.getElementById('gl'),phone=innerWidth<720,DPR=Math.min(devicePixelRatio,phone?1.5:2),QS=new URLSearchParams(location.search);
const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});
R.setPixelRatio(DPR);R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1;
const S=new THREE.Scene();const FOG=new THREE.Color(),ZEN=new THREE.Color(),SEA=-9;S.fog=new THREE.FogExp2(FOG,.0026);
let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const sm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)},lerp=(a,b,t)=>a+(b-a)*t;
const cnv=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c};
const tex=(c,srgb=true,rep)=>{const t=new THREE.CanvasTexture(c);if(srgb)t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping}return t};

// ---- the weather along the lane: Bay of Bengal overcast, Red Sea haze, Mediterranean, North Sea grey with a low sun
const WX=[[0,[.64,.67,.68],[.5,.54,.57]],[.35,[.73,.7,.64],[.55,.59,.62]],[.62,[.67,.71,.74],[.46,.54,.62]],[1,[.6,.64,.67],[.44,.5,.55]]];
function weather(f){let k=1;while(k<WX.length-1&&WX[k][0]<f)k++;const a=WX[k-1],b=WX[k],t=sm(a[0],b[0],f);FOG.setRGB(...a[1].map((v,i)=>lerp(v,b[1][i],t)));ZEN.setRGB(...a[2].map((v,i)=>lerp(v,b[2][i],t)))}
weather(0);
const SUN=new THREE.Vector3(.1,.03,-.99).normalize();
const sky=new THREE.Mesh(new THREE.SphereGeometry(5000,48,24),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{uH:{value:FOG},uZ:{value:ZEN},uS:{value:SUN},uA:{value:0}},
 vertexShader:`varying vec3 vW;void main(){vW=position;vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_Position=p.xyww;}`,
 fragmentShader:`uniform vec3 uH,uZ,uS;uniform float uA;varying vec3 vW;void main(){vec3 d=normalize(vW);float y=max(d.y,0.);vec3 c=mix(uH,uZ,pow(y,.5));
  float s=max(dot(d,uS),0.);c+=vec3(1.,.72,.46)*uA*(pow(s,8.)*.35+pow(s,90.)*.8)+vec3(1.,.8,.6)*uA*smoothstep(.99995,.99998,s)*2.4;
  c*=1.+.035*sin(d.x*7.+d.z*5.)*sin(d.y*19.)*y;gl_FragColor=vec4(c,1.);}`}));
sky.frustumCulled=false;S.add(sky);
const hemi=new THREE.HemisphereLight(0xffffff,0x2b3438,1.5);S.add(hemi);
const key=new THREE.DirectionalLight(0xffffff,1.1);key.position.set(-30,80,40);S.add(key);
const low=new THREE.DirectionalLight(new THREE.Color().setRGB(1,.74,.52),0);low.position.copy(SUN).multiplyScalar(100);S.add(low);

// ---- the vessel: everything that rolls with the ship, the camera included
const V=new THREE.Group();S.add(V);
const box=new THREE.BoxGeometry(1,1,1),M4=new THREE.Matrix4(),Q=new THREE.Quaternion(),P3=new THREE.Vector3(),SC=new THREE.Vector3(),C=new THREE.Color();
function slab(parent,x,y,z,sx,sy,sz,mat){const m=new THREE.Mesh(box,mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m}
const hullM=new THREE.MeshStandardMaterial({color:0x35424a,roughness:.7,metalness:.2}),deckM=new THREE.MeshStandardMaterial({color:0x4a5550,roughness:.85}),
 hatchM=new THREE.MeshStandardMaterial({color:0x596066,roughness:.7,metalness:.2}),steelM=new THREE.MeshStandardMaterial({color:0x8b9296,roughness:.6,metalness:.4});
slab(V,0,-6.625,-6,25.6,10.75,152,hullM);
{const sh=new THREE.Shape();sh.moveTo(-12.8,0);sh.quadraticCurveTo(-11,-12,0,-20);sh.quadraticCurveTo(11,-12,12.8,0);sh.lineTo(-12.8,0);
 const g=new THREE.ExtrudeGeometry(sh,{depth:12.6,bevelEnabled:false});g.rotateX(Math.PI/2);const bw=new THREE.Mesh(g,hullM);bw.position.set(0,.6,-82);V.add(bw)}
slab(V,0,-1.25,-6,25.2,.1,150,deckM);
for(let k=0;k<11;k++)slab(V,0,-.6,47.8-k*12.8,24.8,1.2,12.5,hatchM);
for(let k=1;k<=11;k++){const z=54.4-k*12.8;slab(V,0,2.6,z,25,.28,.45,steelM);slab(V,0,5.2,z,25,.28,.45,steelM);for(const x of[-12.4,-4.2,4.2,12.4])slab(V,x,2.6,z,.3,5.2,.4,steelM)}
// the rail along the port side, salt dried white on it; stanchions every two metres
const saltT=tex(cnv(256,32,(g,w,h)=>{g.fillStyle='#7e8a8f';g.fillRect(0,0,w,h);for(let i=0;i<500;i++){g.fillStyle=`rgba(236,236,228,${rnd()*.55})`;g.fillRect(rnd()*w,rnd()*h,1+rnd()*5,1+rnd()*2)}}),true,true);saltT.repeat.set(30,1);
const railM=new THREE.MeshStandardMaterial({map:saltT,roughness:.45,metalness:.5});
for(const x of[-12.75,12.75]){const r=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,138,8),railM);r.rotation.x=Math.PI/2;r.position.set(x,-.15,-12);V.add(r);
 const st=new THREE.InstancedMesh(new THREE.CylinderGeometry(.025,.025,1.1,6),railM,69);for(let i=0;i<69;i++)st.setMatrixAt(i,M4.makeTranslation(x,-.7,57-i*2));V.add(st)}

// ---- the accommodation and bridge, aft of the last bay; the port bridge wing is where the long look is taken from
const winT=tex(cnv(256,512,(g,w,h)=>{g.fillStyle='#dcdad3';g.fillRect(0,0,w,h);for(let r=0;r<8;r++){for(let c=0;c<6;c++){g.fillStyle=rnd()<.15?'#c9b98f':'#2b3136';g.fillRect(14+c*40,24+r*62,22,26)}g.fillStyle='rgba(40,46,50,.25)';g.fillRect(0,r*64,w,3)}
 for(let i=0;i<60;i++){g.fillStyle=`rgba(120,80,50,${rnd()*.12})`;g.fillRect(rnd()*w,rnd()*h,2,8+rnd()*40)}}));
const accM=new THREE.MeshStandardMaterial({map:winT,roughness:.75});
slab(V,0,10.8,67,20,24,14,accM);
slab(V,0,24.2,65.5,20,2.8,6,new THREE.MeshStandardMaterial({color:0xd6d4cd,roughness:.7}));
slab(V,0,24.4,62.45,20,1.4,.1,new THREE.MeshStandardMaterial({color:0x1d2429,roughness:.2,metalness:.3}));
slab(V,0,22.9,63.8,29.4,.2,2.6,steelM);for(const x of[-14.7,14.7])slab(V,x,23.45,63.8,.06,1.1,2.6,steelM);
{const fn=new THREE.Mesh(new THREE.CylinderGeometry(2.4,2.8,9,20),new THREE.MeshStandardMaterial({color:0x2c3338,roughness:.6}));fn.position.set(0,29.5,70);V.add(fn);
 const band=new THREE.Mesh(new THREE.CylinderGeometry(2.46,2.5,1.4,20),new THREE.MeshStandardMaterial({color:0x8c3b2a,roughness:.6}));band.position.set(0,31.4,70);V.add(band);
 slab(V,0,31,64,.25,12,.25,steelM)}

// ---- the gangway down to the quay: steel grating, wet from the morning's spray
const gridT=tex(cnv(128,128,(g,w,h)=>{g.fillStyle='#1c2226';g.fillRect(0,0,w,h);g.strokeStyle='#5d666a';g.lineWidth=3;for(let i=0;i<=w;i+=16){g.beginPath();g.moveTo(i,0);g.lineTo(i,h);g.stroke()}g.lineWidth=1.4;for(let i=0;i<=h;i+=6){g.beginPath();g.moveTo(0,i);g.lineTo(w,i);g.stroke()}
 for(let i=0;i<50;i++){g.fillStyle=`rgba(210,220,225,${rnd()*.35})`;g.beginPath();g.arc(rnd()*w,rnd()*h,.8+rnd()*1.6,0,7);g.fill()}}),true,true);
const gw=new THREE.Group();V.add(gw);gw.position.set(-13.95,-1.25,58.2);
{const len=11,ang=Math.atan2(3.8,len);const tr=new THREE.Mesh(new THREE.PlaneGeometry(1.1,len/Math.cos(ang)),new THREE.MeshStandardMaterial({map:gridT,roughness:.3,metalness:.6}));
 gridT.repeat.set(1,9);tr.rotation.x=-Math.PI/2+ang;tr.position.set(0,-1.9,len/2+1.3);gw.add(tr);slab(gw,0,-.02,.6,1.4,.06,1.4,new THREE.MeshStandardMaterial({map:gridT,roughness:.3,metalness:.6}));
 for(const x of[-.6,.6]){const h=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,len/Math.cos(ang)+1.4,6),railM);h.rotation.x=Math.PI/2+ang;h.position.set(x,-.9,len/2+.8);gw.add(h)}}

// ---- the boxes: 22 bays of ten rows, six tiers, doors facing aft; eighty top slots left empty over the middle bays, 1,240 in all
const sideT=tex(cnv(512,128,(g,w,h)=>{for(let i=0;i<w;i++){const s=.5+.5*Math.sin(i/w*44*Math.PI*2);g.fillStyle=`rgb(${210+s*45|0},${210+s*45|0},${210+s*45|0})`;g.fillRect(i,0,1,h)}
 g.fillStyle='rgba(40,34,30,.55)';g.fillRect(0,0,w,7);g.fillRect(0,h-8,w,8);g.fillRect(0,0,9,h);g.fillRect(w-9,0,9,h);
 for(let i=0;i<34;i++){const x=rnd()*w,l=10+rnd()*70;const gr=g.createLinearGradient(0,6,0,6+l);gr.addColorStop(0,'rgba(92,44,22,.55)');gr.addColorStop(1,'rgba(92,44,22,0)');g.fillStyle=gr;g.fillRect(x,6,2+rnd()*4,l)}
 for(const x of[0,w-9]){const gr=g.createLinearGradient(0,0,0,60);gr.addColorStop(0,'rgba(110,52,24,.8)');gr.addColorStop(1,'rgba(110,52,24,0)');g.fillStyle=gr;g.fillRect(x,0,9,60)}}),true);
const doorT=tex(cnv(256,256,(g,w,h)=>{for(let i=0;i<w;i++){const s=.5+.5*Math.sin(i/w*14*Math.PI*2);g.fillStyle=`rgb(${205+s*40|0},${205+s*40|0},${205+s*40|0})`;g.fillRect(i,0,1,h)}
 g.fillStyle='rgba(30,26,24,.7)';g.fillRect(0,0,w,10);g.fillRect(0,h-12,w,12);g.fillRect(0,0,10,h);g.fillRect(w-10,0,10,h);g.fillRect(w/2-2,0,4,h);
 for(const x of[40,92,164,216]){g.fillStyle='rgba(38,34,32,.85)';g.fillRect(x-3,12,6,h-24);for(const y of[30,h-40])g.fillRect(x-7,y,14,9);g.fillRect(x-2,h*.55,26*(x<128?1:-1)+2,6)}
 for(let i=0;i<22;i++){const x=rnd()*w,l=10+rnd()*60;const gr=g.createLinearGradient(0,10,0,10+l);gr.addColorStop(0,'rgba(96,46,22,.5)');gr.addColorStop(1,'rgba(96,46,22,0)');g.fillStyle=gr;g.fillRect(x,10,2+rnd()*3,l)}}),true);
const roofT=tex(cnv(128,256,(g,w,h)=>{g.fillStyle='#cfcfcf';g.fillRect(0,0,w,h);for(let i=0;i<h;i+=18){g.fillStyle='rgba(60,60,60,.18)';g.fillRect(0,i,w,3)}for(let i=0;i<40;i++){g.fillStyle=`rgba(90,50,30,${rnd()*.25})`;g.fillRect(rnd()*w,rnd()*h,4+rnd()*20,4+rnd()*20)}}),true);
const mSide=new THREE.MeshStandardMaterial({map:sideT,bumpMap:sideT,bumpScale:1.2,roughness:.78,metalness:.25}),mDoor=new THREE.MeshStandardMaterial({map:doorT,bumpMap:doorT,bumpScale:1,roughness:.75,metalness:.25}),
 mRoof=new THREE.MeshStandardMaterial({map:roofT,roughness:.85,metalness:.2}),mDark=new THREE.MeshStandardMaterial({color:0x2a2a2a,roughness:.9});
const cg=new THREE.BoxGeometry(2.44,2.59,6.06);
const BAYS=22,BZ=k=>51-k*6.4,RX=r=>-10.98+r*2.44,TY=t=>1.295+t*2.59;
const slots=[];for(let k=BAYS-1;k>=0;k--)for(let t=0;t<6;t++)for(let r=0;r<10;r++)if(!(t===5&&k>=6&&k<=13))slots.push([k,r,t]);
const PAL=[0x8c3b2a,0x9a4631,0x7d3526,0x8c3b2a,0x6f7a80,0x8a949a,0x2f4f6f,0x36577a,0x3e6045,0xd9d6cf,0x5d2a2a,0xb0602e,0x4f6d6f,0x8c3b2a,0x6f7a80];
const PH_FAR=phone?7:0;const live=slots.filter(([k])=>!phone||k<PH_FAR),far=phone?slots.filter(([k])=>k>=PH_FAR):[];
const cm=new THREE.InstancedMesh(cg,[mSide,mSide,mRoof,mDark,mDoor,mDark],live.length);cm.frustumCulled=false;V.add(cm);
live.forEach(([k,r,t],i)=>{cm.setMatrixAt(i,M4.makeTranslation(RX(r),TY(t),BZ(k)));const h=PAL[(k*7+r*3+t*5+(rnd()*4|0))%PAL.length];cm.setColorAt(i,C.setHex(h).multiplyScalar(.85+rnd()*.3))});
if(phone){const gT=tex(cnv(320,192,(g,w,h)=>{g.fillStyle='#222';g.fillRect(0,0,w,h);for(let r=0;r<6;r++)for(let c=0;c<10;c++){g.fillStyle='#'+PAL[(r*3+c*7)%PAL.length].toString(16).padStart(6,'0');g.fillRect(c*32+1,r*32+1,30,30)}}));
 const fm=new THREE.InstancedMesh(box,new THREE.MeshStandardMaterial({map:gT,roughness:.8}),BAYS-PH_FAR);let i=0;for(let k=PH_FAR;k<BAYS;k++){const tiers=k>=6&&k<=13?5:6;fm.setMatrixAt(i++,M4.compose(P3.set(0,tiers*2.59/2,BZ(k)),Q.identity(),SC.set(24.4,tiers*2.59,6.06)))}V.add(fm)}
const N0=live.length-40;let shown=N0,landing=[];
// the day, stencilled on the nearest door and repainted at every port; a numbered bolt seal on the handle
const dc=document.createElement('canvas');dc.width=dc.height=512;const doorDay=new THREE.CanvasTexture(dc);doorDay.colorSpace=THREE.SRGBColorSpace;doorDay.anisotropy=8;
function paintDay(d){const g=dc.getContext('2d');g.clearRect(0,0,512,512);g.fillStyle='rgba(240,238,230,.93)';g.font="700 40px 'JetBrains Mono'";g.textAlign='left';g.fillText('MRDU 214'+String(d).padStart(3,'0')+' 4',40,66);
 g.font="700 22px 'JetBrains Mono'";g.fillText('22G1 · MAX GROSS 30,480 KG',40,98);g.font="700 64px 'JetBrains Mono'";g.fillText('DAY',60,300);g.font="700 190px 'JetBrains Mono'";g.fillText(String(d).padStart(2,'0'),52,455);
 g.fillStyle='#e0b320';g.fillRect(300,262,26,46);g.fillStyle='#1d2a3a';g.font="700 13px 'JetBrains Mono'";g.save();g.translate(318,305);g.rotate(-Math.PI/2);g.fillText('MF 004417',0,0);g.restore();doorDay.needsUpdate=true}
paintDay(0);let dayPainted=0;
const dayM=new THREE.Mesh(new THREE.PlaneGeometry(2.3,2.3),new THREE.MeshStandardMaterial({map:doorDay,transparent:true,roughness:.7,polygonOffset:true,polygonOffsetFactor:-2}));dayM.position.set(RX(0),TY(1)+.05,BZ(0)+3.045);V.add(dayM);

// ---- the quay at Chattogram and the crane loading the last bay; it slides away into the haze as the ship leaves
const quay=new THREE.Group();S.add(quay);
const qM=new THREE.MeshStandardMaterial({color:0x8a8a82,roughness:.95}),crM=new THREE.MeshStandardMaterial({color:0xb9bcbc,roughness:.6,metalness:.3}),crD=new THREE.MeshStandardMaterial({color:0x6d7275,roughness:.6,metalness:.3});
slab(quay,-50,SEA+2,0,70,4,420,qM);
function crane(parent,z,sx=1){for(const x of[-18,-44])for(const dz of[-8,8])slab(parent,x*sx,SEA+26,z+dz,1.4,48,1.4,crM);for(const dz of[-8,8]){slab(parent,-31*sx,SEA+22,z+dz,26,1.3,1.3,crD);slab(parent,-31*sx,SEA+48,z+dz,27,1.4,1.4,crM)}
 slab(parent,-18*sx,SEA+50,z,2.4,2.6,18,crM);slab(parent,-44*sx,SEA+50,z,2.4,2.6,18,crM);const bm=slab(parent,-12*sx,SEA+52,z,96,2.4,3,crM);slab(parent,-40*sx,SEA+54,z,8,4,7,crD);
 const a=slab(parent,-36*sx,SEA+62,z,1.2,20,1.2,crM);a.rotation.z=.35*sx;return bm}
crane(quay,46);crane(quay,-14);crane(quay,-74);
const spread=new THREE.Group();quay.add(spread);slab(spread,0,0,0,2.5,.5,6.2,new THREE.MeshStandardMaterial({color:0xc8a23a,roughness:.6,metalness:.3}));
const cab=[];for(const[dx,dz]of[[-.8,-2.4],[.8,-2.4],[-.8,2.4],[.8,2.4]]){const c=slab(spread,dx,20,dz,.09,40,.09,crD);cab.push(c)}spread.visible=false;
// Felixstowe, ahead in the grey at the end: a quay of cranes
const fx=new THREE.Group();S.add(fx);slab(fx,0,SEA+2,-490,700,4,80,qM);for(let i=0;i<7;i++){const g=new THREE.Group();g.rotation.y=-Math.PI/2;g.position.set(-230+i*62+rnd()*10,0,-470);crane(g,0,1);fx.add(g)}fx.visible=false;
// seen through the long lens against the low sun: silhouettes, part-way into the haze, never fully lost in it
const fxM=new THREE.MeshBasicMaterial({fog:false}),FXC=new THREE.Color().setRGB(.24,.28,.3);fx.traverse(o=>{if(o.isMesh)o.material=fxM});

// ---- the sea: long grey swell, the ship's own wash along the hull, and the haze
const WU={uT:{value:0},uFlow:{value:0},uH:{value:FOG},uZ:{value:ZEN},uCam:{value:new THREE.Vector3()},uFD:{value:.0026},uWake:{value:0},uS:{value:SUN},uA:{value:0}};
const sea=new THREE.Mesh(new THREE.PlaneGeometry(9000,9000),new THREE.ShaderMaterial({uniforms:WU,fog:false,
 vertexShader:`varying vec3 vW;void main(){vW=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vW,1.);}`,
 fragmentShader:`uniform float uT,uFlow,uFD,uWake,uA;uniform vec3 uH,uZ,uCam,uS;varying vec3 vW;
 float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hs(i),hs(i+vec2(1,0)),f.x),mix(hs(i+vec2(0,1)),hs(i+vec2(1,1)),f.x),f.y);}
 void main(){vec2 p=vW.xz+vec2(0.,uFlow);float d=length(uCam-vW);vec2 g=vec2(0.);
  for(int i=0;i<6;i++){float fi=float(i),a=fi*1.3+.4;vec2 k=vec2(cos(a),sin(a))*(.06+fi*.09);g+=k*cos(dot(p,k)+uT*(.5+fi*.3)+fi)*(1.3/(1.+fi*1.4));}
  g*=1./(1.+d*.004);vec3 N=normalize(vec3(-g.x,1.,-g.y)),V=normalize(vW-uCam);float F=.03+.97*pow(1.-max(dot(-V,N),0.),5.);
  vec3 R=reflect(V,N);vec3 sk=mix(uH,uZ,pow(max(R.y,0.),.5));vec3 deep=vec3(.13,.17,.19)+uH*.12;vec3 c=mix(deep,sk,min(F*1.2,.92));
  c+=vec3(1.,.75,.5)*uA*pow(max(dot(R,uS),0.),200.)*2.;
  float ax=abs(vW.x),hull=smoothstep(34.,12.8,ax)*step(vW.z,78.)*smoothstep(-110.,-80.,vW.z);float fo=vn(vec2(vW.x*.5,p.y*.08))*vn(vec2(vW.x*1.7,p.y*.3));
  c=mix(c,vec3(.86,.88,.87),uWake*hull*smoothstep(.25,.6,fo)*smoothstep(34.,13.,ax)*.8);
  c=mix(c,uH,1.-exp(-pow(d*uFD,2.)));gl_FragColor=vec4(c,1.);}`}));
sea.rotation.x=-Math.PI/2;sea.position.y=SEA;S.add(sea);

// ---- the horizon: every Natural Earth coast point within 150 km becomes a bearing and a height above the sea, curvature and all
const HB=512,hData=new Uint8Array(HB*4),hTex=new THREE.DataTexture(hData,HB,1,THREE.RGBAFormat);hTex.wrapS=THREE.RepeatWrapping;hTex.magFilter=hTex.minFilter=THREE.LinearFilter;
const RAD=2600,hU={uH:{value:hTex},uFogC:{value:FOG},uSea:{value:SEA},uK:{value:1}};
const ring=new THREE.Mesh(new THREE.CylinderGeometry(RAD,RAD,700,256,1,true),new THREE.ShaderMaterial({side:THREE.DoubleSide,fog:false,uniforms:hU,
 vertexShader:`varying vec3 vL;void main(){vL=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform sampler2D uH;uniform vec3 uFogC;uniform float uSea,uK;varying vec3 vL;void main(){float u=fract(atan(vL.x,-vL.z)/6.28318);vec4 h=texture2D(uH,vec2(u,.5));
  float top=tan(h.r*.1047*uK)*${RAD}.;float y=vL.y;if(y>top||h.r<.004)discard;vec3 land=vec3(.24,.27,.27);gl_FragColor=vec4(mix(land,uFogC,.22+.55*h.g)*(.96+.04*(y/max(top,1.))),1.);}`}));
ring.position.y=SEA;S.add(ring);
const LANE=[[91.8,22.3],[91.4,20.6],[89.6,16.5],[85.5,10.5],[82,6.1],[79.85,6.93],[76,7.4],[70,9.8],[60,12.6],[52,12.9],[45,12.3],[43.4,12.6],[41.6,15],[38.6,20],[35.5,25.5],[33.8,27.6],[32.55,29.95],[32.3,31.25],[28,33.3],[20,35],[12,37.3],[5,37.6],[-1,36.4],[-5.6,35.95],[-9.6,37],[-10.2,42],[-6.4,46.5],[-5.4,48.6],[-1,50],[1.4,51],[1.35,51.95]];
const KM=(a,b)=>{const la=(a[1]+b[1])/2*Math.PI/180;return Math.hypot((b[0]-a[0])*Math.cos(la)*111.32,(b[1]-a[1])*110.57)};
const cum=[0];for(let i=1;i<LANE.length;i++)cum.push(cum[i-1]+KM(LANE[i-1],LANE[i]));const TOT=cum[cum.length-1];
function laneAt(f){const d=f*TOT;let i=1;while(i<cum.length-1&&cum[i]<d)i++;const t=Math.min(1,(d-cum[i-1])/(cum[i]-cum[i-1]||1)),a=LANE[i-1],b=LANE[i];
 const la=(a[1]+b[1])/2*Math.PI/180;return{lon:a[0]+(b[0]-a[0])*t,lat:a[1]+(b[1]-a[1])*t,hd:Math.atan2((b[0]-a[0])*Math.cos(la),b[1]-a[1]),seg:i-1+t}}
const eB=new Float32Array(HB),dB=new Float32Array(HB);let lastF=-1;
function horizon(f){const L=laneAt(f),cl=Math.cos(L.lat*Math.PI/180);eB.fill(0);dB.fill(1);
 const bin=(dx,dy)=>{let d=Math.hypot(dx,dy);if(d>150)return;d=Math.max(d,2.5);const H=Math.min(420,12+d*9),hE=H-d*d*1e6/(2*6371000)*.87;if(hE<=0)return;const e=Math.atan(hE/(d*1000));
  const rel=Math.atan2(dx,dy)-L.hd,b=((Math.floor((rel/(Math.PI*2))*HB)%HB)+HB)%HB;if(e>eB[b]){eB[b]=e;dB[b]=d/150}};
 let px=null,py=null;for(let i=0;i<LL.length;i+=2){const dx=(LL[i]-L.lon)*cl*111.32,dy=(LL[i+1]-L.lat)*110.57;
  if(px!==null&&Math.abs(dx)<170&&Math.abs(dy)<170){const sl=Math.hypot(dx-px,dy-py);if(sl<80){const n=Math.min(60,Math.ceil(sl/1.5));for(let k=1;k<=n;k++)bin(px+(dx-px)*k/n,py+(dy-py)*k/n)}}
  else if(Math.abs(dx)<170&&Math.abs(dy)<170)bin(dx,dy);px=dx;py=dy}
 // land between coast points is still land: widen each bin by its neighbours, then soften the ridge line
 const dl=new Float32Array(HB);for(let b=0;b<HB;b++){let m=0;for(let o=-3;o<=3;o++)m=Math.max(m,eB[(b+o+HB)%HB]*(1-Math.abs(o)*.08));dl[b]=m}
 for(let b=0;b<HB;b++){let e=0;for(let o=-2;o<=2;o++)e+=dl[(b+o+HB)%HB]*[.1,.2,.4,.2,.1][o+2];hData[b*4]=Math.min(255,e/.1047*255*3);hData[b*4+1]=dB[b]*255;hData[b*4+3]=255}hTex.needsUpdate=true;return L}

// ---- the camera: on the gangway looking up at the doors, a crane up the aft face of the stack, then the port bridge wing with a long lens
const cam=new THREE.PerspectiveCamera(phone?68:52,innerWidth/innerHeight,.1,12000);V.add(cam);
const KEYS=[[0,[-13.9,.45,58.6],[-5,10.5,47],phone?68:52],[.14,[-13.9,.5,58.7],[-5,10.8,46],phone?68:52],[.34,[-18.5,9.5,62],[-7,11,36],phone?68:52],[.6,[-8,20.6,60],[-2,13.4,0],phone?66:50],[.93,[-14.3,24.4,63.6],[-1.5,20,-85],phone?19:10.5]];
const cp=new THREE.Vector3(),ct=new THREE.Vector3();
function camAt(sp){let k=1;while(k<KEYS.length-1&&KEYS[k][0]<sp)k++;const a=KEYS[k-1],b=KEYS[k],t=sm(a[0],b[0],sp);cp.set(...a[1]).lerp(P3.set(...b[1]),t);ct.set(...a[2]).lerp(P3.set(...b[2]),t);
 const fov=Math.exp(lerp(Math.log(a[3]),Math.log(b[3]),t));return fov}

// ---- the lens: overcast steel, medium grain, no halation
const comp=new EffectComposer(R);comp.addPass(new RenderPass(S,cam));
const film=new ShaderPass({uniforms:{tDiffuse:{value:null},uT:{value:0},uF:{value:0},uR:{value:new THREE.Vector2()}},
 vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform sampler2D tDiffuse;uniform float uT,uF;uniform vec2 uR;varying vec2 vUv;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;float l=dot(c,vec3(.2126,.7152,.0722));c=mix(c,vec3(l),.12);c=mix(c*vec3(.93,.99,1.04),c,smoothstep(.1,.8,l));c+=vec3(.2,.25,.28)*(1.-smoothstep(0.,.35,l))*.06;
  vec2 q=vUv-.5;c*=1.-dot(q,q)*.55;c+=(h(floor(vUv*uR/1.6)+fract(uT)*71.)-.5)*.04*(.35+l);gl_FragColor=vec4(c*uF,1.);}`});
comp.addPass(film);comp.addPass(new OutputPass());
// the render: contact shading where surfaces meet, glow only on true light sources, tuned to this world's scale and light
lux(R,S,cam,comp,{hemi:.75,ao:{radius:3,thickness:4,protect:[.25,.9]},bloom:{strength:.2,radius:.5,threshold:2}});
function size(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);comp.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix();film.uniforms.uR.value.set(w*DPR,h*DPR)}
let lastW=innerWidth;addEventListener('resize',()=>{if(!phone||Math.abs(innerWidth-lastW)>innerWidth*.1){lastW=innerWidth;size()}});size();

// ---- sound, opt-in: the engine under everything, gulls only at Felixstowe
let ac=null,master=null,sndOn=false,eng=null;const sndB=document.getElementById('snd');
sndB.onclick=()=>{if(!ac){try{ac=new AudioContext();master=ac.createGain();master.connect(ac.destination);eng=ac.createGain();eng.gain.value=0;const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=160;lp.connect(eng);eng.connect(master);
  for(const[fr,ty]of[[38,'sawtooth'],[57,'triangle'],[76.4,'sine']]){const o=ac.createOscillator();o.type=ty;o.frequency.value=fr;const g=ac.createGain();g.gain.value=ty==='sawtooth'?.35:.25;o.connect(g);g.connect(lp);o.start()}}catch(e){return}}
 sndOn=!sndOn;ac.resume();master.gain.value=sndOn?1:0;sndB.textContent='Sound · '+(sndOn?'on':'off')};
function gull(){if(!sndOn)return;const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.setValueAtTime(1500+Math.random()*500,t);o.frequency.exponentialRampToValueAtTime(900,t+.35);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05,t+.04);g.gain.exponentialRampToValueAtTime(.001,t+.4);o.connect(g);g.connect(master);o.start(t);o.stop(t+.45)}
function thud(){if(!sndOn)return;const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.setValueAtTime(70,t);o.frequency.exponentialRampToValueAtTime(34,t+.3);g.gain.setValueAtTime(.4,t);g.gain.exponentialRampToValueAtTime(.001,t+.5);o.connect(g);g.connect(master);o.start(t);o.stop(t+.55)}

// ---- the hand: a sideways drag is the same timeline as the scroll; the ship goes where you pull it
const drv=document.getElementById('drv');let dragX=null;
cv.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){dragX=e.clientX;cv.setPointerCapture(e.pointerId)}});
cv.addEventListener('pointermove',e=>{if(dragX===null)return;const dx=e.clientX-dragX;dragX=e.clientX;scrollBy(0,dx*(drv.offsetHeight-innerHeight)/(innerWidth*2.2))});
cv.addEventListener('pointerup',()=>dragX=null);cv.addEventListener('pointercancel',()=>dragX=null);

// ---- the frame
const WP=[[0,0,'Chattogram','Day 0 · the last boxes','Port of loading: Chattogram. Port of discharge: Felixstowe. Transhipment: none.'],
 [4,3,'Dondra Head','Day 3 · south of Sri Lanka','Before 2022 a Chattogram box waited in Colombo for a second ship. Yours has no second ship.'],
 [11,8,'Bab-el-Mandeb','Day 8 · into the Red Sea','The box has been in the same slot for eight days.'],
 [16,12,'Suez','Day 12 · the canal','A hundred and ninety-three kilometres of canal, one pilot at a time.'],
 [23,17,'Gibraltar','Day 17 · into the Atlantic','The customs entry goes in now, four days before the box does.'],
 [30,21,'Felixstowe','Day 21 · alongside','The first lift since Chattogram.']];
function dayAt(seg){for(let k=1;k<WP.length;k++)if(seg<=WP[k][0]){const[a,da]=WP[k-1],[b,db]=WP[k];return da+(db-da)*(seg-a)/(b-a)}return 21}
const ov=document.querySelector('.ov'),cn=document.getElementById('cn'),cl=document.getElementById('cl'),intro=document.getElementById('intro'),card=document.getElementById('card'),hint=document.getElementById('hint'),end=document.getElementById('end'),scrim=document.getElementById('scrim');
const SPQ=QS.has('sp')?+QS.get('sp'):null,DROP=QS.has('drop')?+QS.get('drop'):null;let lastCard=-2,autoBox=false,sp=0;const t0=performance.now();let last=t0;
window.__md={cam,V,get n(){return shown},horizon,laneAt,hData};
function setCount(n){n=Math.max(0,Math.min(live.length,n));if(n>shown){for(let i=shown;i<n;i++)landing.push([i,(landing.length?Math.max(landing[landing.length-1][1]+.14,now()):now())])}else if(n<shown){landing=landing.filter(([i])=>i<n);for(let i=n;i<shown;i++)cm.setMatrixAt(i,M4.makeTranslation(...slotPos(i)))}
 shown=n;cm.count=n;cm.instanceMatrix.needsUpdate=true}
const now=()=>(performance.now()-t0)/1000;const slotPos=i=>{const[k,r,t]=live[i];return[RX(r),TY(t),BZ(k)]};
setCount(N0);landing=[];
function frame(nowMs){requestAnimationFrame(frame);if(document.body.classList.contains('past')){last=nowMs;return}const dt=Math.min(.05,(nowMs-last)/1000);last=nowMs;const t=(nowMs-t0)/1000;
 sp=Math.max(0,Math.min(1,scrollY/Math.max(1,drv.offsetHeight-innerHeight)));if(SPQ!==null)sp=SPQ;
 // loading: one box lands by itself at three seconds, the scroll lands the rest; boxes drop from the crane in turn
 if(t>3&&!autoBox){autoBox=true}const want=N0+(autoBox?1:0)+Math.round(sm(.015,.14,sp)*39);if(SPQ!==null&&landing.length===0&&shown!==want){setCount(want);landing=[]}else if(want!==shown)setCount(want);
 let top=null;landing=landing.filter(([i,tl])=>{const e=DROP!==null&&i===shown-1?DROP:Math.min(1,Math.max(0,(t-tl)/1.2)),[x,y,z]=slotPos(i),o=Math.pow(1-e,3)*22;cm.setMatrixAt(i,M4.makeTranslation(x,y+o,z));if(e<1)top=[x,y+o,z];else thud();return e<1});
 if(landing.length||top)cm.instanceMatrix.needsUpdate=true;
 const dep=sm(.15,.3,sp);quay.position.x=-dep*320;quay.visible=dep<.999;
 spread.visible=!!top&&dep<.01;if(top){spread.position.set(top[0],top[1]+1.55,top[2]);for(const c of cab)c.scale.y=40;}
 // sailing: the lane, the days, the weather and the coast on the horizon
 const f=Math.min(1,Math.max(0,(sp-.16)/.8));const L=Math.abs(f-lastF)>.0004?(lastF=f,horizon(f)):laneAt(f);weather(f);const day=f<=0?0:dayAt(L.seg);
 const port=WP.reduce((a,w,k)=>L.seg>=w[0]-.02?k:a,0),pday=WP[port][1];if(pday!==dayPainted&&f>0){dayPainted=pday;paintDay(pday)}else if(f<=0&&dayPainted!==0){dayPainted=0;paintDay(0)}
 const arr=sm(.84,.97,sp);sky.material.uniforms.uA.value=arr;WU.uA.value=arr;low.intensity=arr*1.6;key.intensity=1.1-arr*.3;hemi.color.copy(ZEN).lerp(FOG,.5);hemi.intensity=1.5;
 fx.visible=sp>.9;hU.uK.value=1-sm(.9,.97,sp);fxM.color.copy(FXC).lerp(FOG,.38);S.fog.density=lerp(.0026,.0019,arr);WU.uFD.value=S.fog.density;
 const sail=sm(.16,.24,sp)*(1-sm(.93,.99,sp));WU.uFlow.value+=dt*8.6*sail;WU.uWake.value=sail;WU.uT.value=t;if(eng)eng.gain.value=.25+sail*.4;if(arr>.5&&Math.random()<dt*.5)gull();
 V.rotation.z=Math.sin(t*.62)*.02*sail;V.rotation.x=Math.sin(t*.41+1)*.004*sail;V.position.y=Math.sin(t*.53)*.25*sail;
 // the camera is looked-at in the ship's own frame, so the horizon takes the roll
 const fov=camAt(sp);cam.position.copy(cp);M4.lookAt(cp,ct,P3.set(0,1,0));cam.quaternion.setFromRotationMatrix(M4);if(cam.fov!==fov){cam.fov=fov;cam.updateProjectionMatrix()}
 cam.updateMatrixWorld();cam.getWorldPosition(WU.uCam.value);
 // the words
 const loading=sp<.16;cn.textContent=loading?(shown+(phone?830:0)).toLocaleString('en-GB'):String(Math.floor(day)).padStart(2,'0');
 cl.textContent=loading?'boxes aboard of 1,240':'days at sea of 21';
 ov.classList.toggle('lt',sp>.1&&sp<.38);intro.style.opacity=sp<.035?1:0;hint.style.opacity=sp<.05?1:0;scrim.style.opacity=sp>.985?0:1;
 let w=-1;if(sp>=.045&&sp<.16)w=0;else if(f>0)WP.forEach(([i],k)=>{if(k>0&&L.seg>=i-1.4&&L.seg<=i+1.6)w=k});
 if(w!==lastCard){lastCard=w;if(w<0)card.classList.add('hide');else{document.getElementById('ci').textContent=WP[w][3];document.getElementById('ch').textContent=WP[w][2];document.getElementById('cp').textContent=WP[w][4];card.classList.remove('hide')}}
 film.uniforms.uT.value=t;film.uniforms.uF.value=sm(0,1.4,t);comp.render()}
requestAnimationFrame(frame);
