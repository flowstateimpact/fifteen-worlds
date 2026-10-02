// Eleven: twenty-two homes in a shallow crescent standing in Gulshan Lake, at 18:50, held.
// Units are metres. The lake is y=0. The crescent's centre of curvature C sits out in the water at (0,0,-30); the glass line runs round it at r=30,
// the balconies reach in to r=26.8. You stand on the seventh-floor balcony near the west end. Scroll pans along the façade, then tilts into the lake;
// a tap lights a window, or its double. At the end the camera turns to your own glass door, which lights last.
import * as THREE from 'three';
import {Reflector} from 'three/addons/objects/Reflector.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {lux} from './lib/lux.js';
import {RoundedBoxGeometry as RB} from 'three/addons/geometries/RoundedBoxGeometry.js';
await Promise.all([document.fonts.load("300 60px 'Bespoke Serif'"),document.fonts.load("500 20px 'General Sans'")]).catch(()=>{});

const cv=document.getElementById('gl'),phone=innerWidth<760,DPR=Math.min(devicePixelRatio,phone?1.5:2),QS=new URLSearchParams(location.search);
const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});
R.setPixelRatio(DPR);R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.05;
const S=new THREE.Scene();const HAZE=new THREE.Color().setRGB(.12,.16,.26);S.fog=new THREE.FogExp2(HAZE,.0017);
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const sm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)},lerp=(a,b,t)=>a+(b-a)*t;
const cnv=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c};
const tex=(c,srgb=true,rep)=>{const t=new THREE.CanvasTexture(c);if(srgb)t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;if(rep)t.wrapS=t.wrapT=THREE.RepeatWrapping;return t};
const C=new THREE.Vector3(0,0,-30),GLR=30,T0=-.84,T1=.84,FL=f=>3+f*3.4;
const pt=(th,r,y)=>new THREE.Vector3(C.x+r*Math.sin(th),y,C.z+r*Math.cos(th));

// ---- blue hour: 9000 K sky, the last warmth low in the west, and a sky-only environment for the glass and brass
const skyM=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{uH:{value:new THREE.Color().setRGB(.27,.36,.56)},uZ:{value:new THREE.Color().setRGB(.04,.07,.16)}},
 vertexShader:`varying vec3 vW;void main(){vW=position;vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_Position=p.xyww;}`,
 fragmentShader:`uniform vec3 uH,uZ;varying vec3 vW;float hn(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hn(i),hn(i+vec2(1.,0.)),f.x),mix(hn(i+vec2(0.,1.)),hn(i+1.),f.x),f.y);}
  float fb(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*vn(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}void main(){vec3 d=normalize(vW);float y=max(d.y,0.);vec3 c=mix(uH,uZ,pow(y,.45));
  float wg=pow(max(dot(normalize(d.xz),normalize(vec2(-1.,-.35))),0.),3.);c+=vec3(.42,.24,.16)*wg*pow(1.-y,10.)*.55;
  vec2 cp=d.xz/(d.y+.1);float cl=smoothstep(.52,.86,fb(cp*.55+vec2(3.,1.)))*smoothstep(.02,.14,d.y)*(1.-smoothstep(.45,.85,d.y));
  vec3 cc=mix(uZ*.8+vec3(.02,.02,.03),vec3(.5,.3,.27),wg*(1.-y)*.9);c=mix(c,cc,cl*.8);gl_FragColor=vec4(c,1.);}`});
const sky=new THREE.Mesh(new THREE.SphereGeometry(4000,48,24),skyM);sky.frustumCulled=false;S.add(sky);
{const es=new THREE.Scene();es.add(new THREE.Mesh(new THREE.SphereGeometry(100,32,16),skyM));const pm=new THREE.PMREMGenerator(R);S.environment=pm.fromScene(es,.02).texture;pm.dispose()}
S.add(new THREE.HemisphereLight(new THREE.Color().setRGB(.3,.38,.6),new THREE.Color().setRGB(.02,.02,.03),.55));

// ---- the crescent: warm concrete with shutter-board lines, glass between the slabs, teak rails, glass balustrades
const conT=tex(cnv(512,512,(g,w,h)=>{g.fillStyle='#8a8176';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=32){g.fillStyle='rgba(40,34,28,.28)';g.fillRect(0,y,w,2);for(let i=0;i<14;i++){g.fillStyle=`rgba(${rnd()<.5?60:150},${rnd()<.5?52:140},44,.06)`;g.fillRect(rnd()*w,y+2+rnd()*28,40+rnd()*160,1+rnd()*2)}}
 for(let x=24;x<w;x+=128)for(let y=16;y<h;y+=64){g.fillStyle='rgba(30,26,22,.45)';g.beginPath();g.arc(x,y,2.5,0,7);g.fill()}}),true,true);conT.repeat.set(.22,.22);
const conM=new THREE.MeshStandardMaterial({map:conT,bumpMap:conT,bumpScale:1.4,roughness:.9,envMapIntensity:.72});
const teakT=tex(cnv(256,32,(g,w,h)=>{g.fillStyle='#6b4527';g.fillRect(0,0,w,h);for(let i=0;i<60;i++){g.strokeStyle=`rgba(${rnd()<.5?40:130},${rnd()<.5?24:80},14,${.25+rnd()*.3})`;g.lineWidth=.6+rnd()*1.2;g.beginPath();const y=rnd()*h;g.moveTo(0,y);for(let x=0;x<=w;x+=16)g.lineTo(x,y+Math.sin(x*.05+i)*2);g.stroke()}}),true,true);teakT.repeat.set(40,1);
const teakM=new THREE.MeshStandardMaterial({map:teakT,roughness:.58,envMapIntensity:.45});
const glassM=new THREE.MeshStandardMaterial({color:0x0a0e16,roughness:.06,metalness:.92,side:THREE.DoubleSide,envMapIntensity:1.1});
const balM=new THREE.MeshStandardMaterial({color:0x33434d,roughness:.05,metalness:.4,transparent:true,opacity:.2,depthWrite:false,side:THREE.DoubleSide});
function sector(r0,r1,t0,t1,d){const sh=new THREE.Shape(),N=48;for(let i=0;i<=N;i++){const t=t0+(t1-t0)*i/N;const x=r1*Math.sin(t),y=30-r1*Math.cos(t);i?sh.lineTo(x,y):sh.moveTo(x,y)}
 for(let i=N;i>=0;i--){const t=t0+(t1-t0)*i/N;sh.lineTo(r0*Math.sin(t),30-r0*Math.cos(t))}const g=new THREE.ExtrudeGeometry(sh,{depth:d,bevelEnabled:false});g.rotateX(-Math.PI/2);return g}
const slabG=sector(26.8,30.8,T0-.02,T1+.02,.32);
for(let f=0;f<=11;f++){const m=new THREE.Mesh(slabG,conM);m.position.y=FL(f)-.32;S.add(m)}
{const pl=new THREE.Mesh(new THREE.CylinderGeometry(30.6,30.6,3.4,96,1,true,T0,T1-T0),conM);pl.position.set(C.x,1.3,C.z);pl.material.side=THREE.DoubleSide;S.add(pl)}
const DA=-.618,DB=-.502;for(let f=0;f<11;f++)for(const[a,b]of f===6?[[T0,DA],[DB,T1]]:[[T0,T1]]){const g=new THREE.Mesh(new THREE.CylinderGeometry(GLR,GLR,3.08,96,1,true,a,b-a),glassM);g.position.set(C.x,FL(f)+1.54,C.z);S.add(g)}
const railPts=[];for(let i=0;i<=40;i++)railPts.push(pt(T0+(T1-T0)*i/40,27,0));const railG=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(railPts),120,.045,6,false);
const balG=new THREE.CylinderGeometry(27.02,27.02,1,96,1,true,T0,T1-T0);
for(let f=1;f<=10;f++){const r=new THREE.Mesh(railG,teakM);r.position.y=FL(f)+1.08;S.add(r);const b=new THREE.Mesh(balG,balM);b.position.set(C.x,FL(f)+.55,C.z);S.add(b)}
// party walls between the two homes and at the ends, and the mullions
const finG=new THREE.BoxGeometry(.24,3.08,3.9),fins=new THREE.InstancedMesh(finG,conM,33),M4=new THREE.Matrix4(),Q=new THREE.Quaternion(),P3=new THREE.Vector3(),SC=new THREE.Vector3(),YA=new THREE.Vector3(0,1,0);
let k=0;for(let f=0;f<11;f++)for(const t of[T0,0,T1])fins.setMatrixAt(k++,M4.compose(pt(t,28.8,FL(f)+1.54),Q.setFromAxisAngle(YA,t),SC.set(1,1,1)));S.add(fins);
const mulM=new THREE.MeshStandardMaterial({color:0x1b1f24,roughness:.5,metalness:.6}),muls=new THREE.InstancedMesh(new THREE.BoxGeometry(.09,3.08,.14),mulM,11*7);k=0;
for(let f=0;f<11;f++)for(let j=0;j<7;j++){if(f===6&&j===1)continue;const t=T0+(T1-T0)*j/6;muls.setMatrixAt(k++,M4.compose(pt(t,29.95,FL(f)+1.54),Q.setFromAxisAngle(YA,t),SC.set(1,1,1)))}muls.count=k;S.add(muls);
// the jambs of your own door, the only break in your glass
for(const t of[DA,DB]){const j=new THREE.Mesh(new THREE.BoxGeometry(.12,3.08,.18),mulM);j.position.copy(pt(t,29.95,FL(6)+1.54));j.rotation.y=t;S.add(j)}

// ---- the windows: six rooms a floor face the lake. A lit window is a room you look INTO: the shader casts the view ray into a box behind
// the glass (interior mapping) and finds the back wall, side walls, floor or ceiling at the room's true depth, lit by its own lamp by distance;
// furniture and a turning ceiling fan in silhouette, a sheer curtain across one side. Each room differs by its number: depth, lime-wash colour,
// terrazzo or dark wood, a warm lamp or a cool tube light on the back wall. The lake's mirror camera sees the same rooms from below.
const WIN=[];for(let f=0;f<11;f++)for(const t of[-.7,-.42,-.14,.14,.42,.7])if(!(f===6&&t<0))WIN.push({f,t,lit:0,on:false,c:pt(t,29.9,FL(f)+1.45)});
const winM=new THREE.ShaderMaterial({side:THREE.DoubleSide,uniforms:{uT:{value:0},uB:{value:1.3}},
 vertexShader:`varying vec3 vW,vC,vT,vN,vK;varying float vI;void main(){mat4 m=modelMatrix*instanceMatrix;vec4 w=m*vec4(position,1.);vW=w.xyz;vC=(m*vec4(0.,0.,29.9,1.)).xyz;
  vN=normalize((m*vec4(0.,0.,1.,0.)).xyz+1e-6);vT=normalize((m*vec4(1.,0.,0.,0.)).xyz+1e-6);vK=instanceColor;vI=float(gl_InstanceID);gl_Position=projectionMatrix*viewMatrix*w;}`,
 fragmentShader:`uniform float uT,uB;varying vec3 vW,vC,vT,vN,vK;varying float vI;float h(float n){return fract(sin(n*91.345+7.13)*43758.5453);}
 void main(){vec3 V=normalize(vW-cameraPosition),q=vW-vC;float u=dot(q,vT),v=q.y,w=dot(q,vN),du=dot(V,vT),dv=V.y,dw=max(dot(V,vN),1e-3);
  float r1=h(vI+1.),r2=h(vI+2.),r3=h(vI+3.),r4=h(vI+4.),D=4.2+h(vI)*2.8,W=3.9,F=-1.45,Cc=1.62;
  float tB=(D-w)/dw,tS=abs(du)>1e-4?((du>0.?W:-W)-u)/du:1e9,tF=dv<-1e-4?(F-v)/dv:1e9,tC=dv>1e-4?(Cc-v)/dv:1e9,t=min(min(tB,tS),min(tF,tC));
  vec3 p=vec3(u,v,w)+vec3(du,dv,dw)*t,n,a;
  vec3 wall=r1<.4?vec3(.78,.68,.52):r1<.6?vec3(.5,.62,.48):r1<.8?vec3(.52,.6,.7):vec3(.74,.54,.5),flo=r2<.6?vec3(.42,.38,.33):vec3(.2,.12,.07);
  if(t==tB){n=vec3(0.,0.,-1.);a=wall;}else if(t==tS){n=vec3(-sign(du),0.,0.);a=wall*.9;}
  else if(t==tF){n=vec3(0.,1.,0.);a=flo*(r2<.6?mix(1.,.86,step(.5,fract(p.x*1.4))*step(.5,fract(p.z*1.4))):.9+.1*sin(p.x*9.));}else{n=vec3(0.,-1.,0.);a=vec3(.8,.78,.74);}
  bool tube=r3<.33;vec3 L=tube?vec3((r4-.5)*3.,1.25,D-.06):vec3((r4-.5)*5.,.15+r3*.7,D*(.35+.4*r2)),lc=tube?vec3(.82,.95,1.):vec3(1.,.64,.34);
  vec3 dL=L-p;float d2=dot(dL,dL);vec3 c=a*lc*(max(dot(n,normalize(dL)),0.)*8./(1.+d2*.45)+(tube?.5:.28));
  if(tube){if(t==tB)c+=lc*7.*smoothstep(.07,.0,abs(p.y-1.25))*smoothstep(.62,.55,abs(p.x-L.x));}else c+=lc*3.*exp(-dot(p-L,p-L)*7.);
  float wc=D*(.45+.25*r1),tK=(wc-w)/dw;if(tK>0.&&tK<t){vec2 k=vec2(u,v)+vec2(du,dv)*tK;float s=step(abs(k.x-(r2-.5)*3.),1.3)*step(k.y,F+.82)+step(abs(k.x+(r2-.5)*4.),.45)*step(k.y,F+1.9)*step(r4,.5)+step(abs(k.x-(r1-.5)*4.),.55)*step(k.y,F+.55);
   if(s>0.)c=vec3(.025,.02,.016)+lc*.03;}
  float tFn=dv>1e-4?(Cc-.32-v)/dv:1e9;if(tFn<t&&r2>.2){vec3 f=vec3(u,v,w)+vec3(du,dv,dw)*tFn;vec2 o=vec2(f.x-(r1-.5)*2.,f.z-D*.5);float rr=length(o),an=atan(o.y,o.x)+uT*(3.+r4*3.)*step(.35,r3);
   float bl=(smoothstep(.22,.1,abs(sin(an*1.5)))*step(rr,.72)+step(rr,.1))*step(.02,rr);c=mix(c,vec3(.035,.03,.025),min(bl,1.)*.85);}
  float tCu=(.14-w)/dw;if(tCu>0.){float uc=u+du*tCu,sd=r4<.5?-1.:1.;if(uc*sd>W-(.7+r1*1.5)){float fo=.84+.16*sin(uc*7.+r2*6.);c=mix(c,vec3(1.,.9,.74)*(c.r+c.g+.2)*.7*fo,.42);}}
  c=c*vK*uB+vec3(.03,.05,.1)*pow(1.-dw,4.);gl_FragColor=vec4(c,1.);}`}),wins=new THREE.InstancedMesh(new THREE.CylinderGeometry(29.9,29.9,2.7,10,1,true,-.13,.26),winM,WIN.length);wins.frustumCulled=false;
WIN.forEach((w,i)=>{w.k=.9+rnd()*1.6;w.tv=rnd()<.12;wins.setMatrixAt(i,M4.compose(P3.set(C.x,FL(w.f)+1.45,C.z),Q.setFromAxisAngle(YA,w.t),SC.set(0,0,0)));wins.setColorAt(i,new THREE.Color(0,0,0))});S.add(wins);
// a lit room warms the underside of the balcony above it; from below, and so in the lake, those glowing ceilings are what you see
const sofS=new THREE.Shape(),SN=16;for(let i=0;i<=SN;i++){const t=-.13+.26*i/SN;i?sofS.lineTo(26.8*Math.sin(t),26.8*Math.cos(t)):sofS.moveTo(26.8*Math.sin(t),26.8*Math.cos(t))}for(let i=SN;i>=0;i--){const t=-.13+.26*i/SN;sofS.lineTo(29.95*Math.sin(t),29.95*Math.cos(t))}
const sofG=new THREE.ShapeGeometry(sofS,SN);sofG.rotateX(Math.PI/2);
const sofM=new THREE.ShaderMaterial({side:THREE.DoubleSide,vertexShader:`varying vec3 vC;varying float vR,vA;void main(){vec4 l=instanceMatrix*vec4(position,1.);vR=length(position.xz);vA=atan(position.x,position.z);vC=instanceColor;gl_Position=projectionMatrix*modelViewMatrix*l;}`,
 fragmentShader:`varying vec3 vC;varying float vR,vA;void main(){float f=pow(smoothstep(26.6,29.95,vR),1.6)*(1.-smoothstep(.08,.13,abs(vA)));gl_FragColor=vec4(vC*(.03+f),1.);}`});
const sofs=new THREE.InstancedMesh(sofG,sofM,WIN.length);sofs.frustumCulled=false;
WIN.forEach((w,i)=>{sofs.setMatrixAt(i,M4.compose(P3.set(C.x,FL(w.f+1)-.325,C.z),Q.setFromAxisAngle(YA,w.t),SC.set(1,1,1)));sofs.setColorAt(i,new THREE.Color(0,0,0))});S.add(sofs);
const pool=[...Array(6)].map(()=>{const l=new THREE.PointLight(new THREE.Color().setRGB(1,.72,.42),0,9,2);S.add(l);return l});let poolI=0;

// ---- your own balcony: the brass plate on the rail, your glass door, the room behind it, a curtain, a moth
const EYE=pt(-.56,29,FL(6)+1.55);
const brassT=tex(cnv(512,96,(g,w,h)=>{g.fillStyle='#b08a48';g.fillRect(0,0,w,h);for(let i=0;i<300;i++){g.fillStyle=`rgba(255,235,190,${rnd()*.12})`;g.fillRect(rnd()*w,rnd()*h,20+rnd()*60,1)}
 g.fillStyle='rgba(58,40,16,.85)';g.font="500 34px 'General Sans'";g.textAlign='center';g.fillText('3.2 M  ·  22 HOMES  ·  ৳ 4.2 CRORE',w/2,60)}),true);
const plate=new THREE.Mesh(new THREE.PlaneGeometry(.42,.08),new THREE.MeshStandardMaterial({map:brassT,metalness:.85,roughness:.32}));plate.position.copy(pt(-.535,27,FL(6)+1.128));plate.rotation.set(-Math.PI/2,0,0);plate.rotateZ(-.535);S.add(plate);
const DY=FL(6)+1.45,doorC=pt(-.56,29.88,DY),inC=new THREE.Vector3(C.x,DY,C.z);
const door=new Reflector(new THREE.PlaneGeometry(3.3,3.08),{textureWidth:phone?384:768,textureHeight:phone?320:640,clipBias:.003,shader:{
 uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null},uOn:{value:0}},
 vertexShader:`uniform mat4 textureMatrix;varying vec4 vUv;void main(){vUv=textureMatrix*vec4(position,1.);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform sampler2D tDiffuse;uniform float uOn;varying vec4 vUv;void main(){vec3 r=texture2DProj(tDiffuse,vUv).rgb;gl_FragColor=vec4(r*.6+vec3(.008,.01,.016),1.-uOn*.9);}`}});
door.material.transparent=true;door.position.copy(doorC).setY(FL(6)+1.54);door.lookAt(inC.clone().setY(FL(6)+1.54));door.visible=false;S.add(door);
// your room is built, not painted: plaster walls, a sofa, a low table, a rug, a print, and a floor lamp whose bulb is the room's only light,
// casting real soft shadows once it comes on (the shadow map renders only while it is on)
const rm=(c,r=.85)=>new THREE.MeshStandardMaterial({color:c,roughness:r,envMapIntensity:.3}),room=new THREE.Group();S.add(room);
const put=(g,m,t,r,y,rot=0)=>{const o=new THREE.Mesh(g,m);o.position.copy(pt(t,r,y));o.rotation.y=t+rot;o.castShadow=o.receiveShadow=true;room.add(o);return o};
{const wm=rm(0xd9ccb4,.92),bw=new THREE.Mesh(new THREE.CylinderGeometry(33.7,33.7,3.06,24,1,true,-.68,.24),wm);bw.material.side=THREE.BackSide;bw.position.set(C.x,FL(6)+1.53,C.z);bw.receiveShadow=true;room.add(bw);
 for(const t of[-.68,-.44])put(new THREE.BoxGeometry(.12,3.06,3.8),wm,t,31.8,FL(6)+1.53);
 const fab=rm(0x2f4a4c,.95),wood=rm(0x3a2416,.55);
 put(new RB(2.3,.42,.9,3,.08),fab,-.56,33.1,FL(6)+.21);put(new RB(2.3,.55,.24,3,.09),fab,-.56,33.5,FL(6)+.66);for(const o of[-.018,.016])put(new RB(.5,.42,.16,3,.07),rm(o<0?0xc9923e:0xe8d6b0,.95),-.56+o,33.3,FL(6)+.6,.1);
 for(const s of[-1,1])put(new RB(.22,.62,.9,3,.08),fab,-.56+s*.037,33.1,FL(6)+.3);
 put(new RB(1.1,.36,.6,2,.03),wood,-.56,31.9,FL(6)+.18);
 const rug=put(new THREE.PlaneGeometry(2.8,1.9),new THREE.MeshStandardMaterial({map:tex(cnv(256,176,(g,w,h)=>{g.fillStyle='#7a2a1e';g.fillRect(0,0,w,h);g.strokeStyle='#e8d6b0';g.lineWidth=5;g.strokeRect(12,12,w-24,h-24);
  for(let i=0;i<9;i++){g.strokeStyle=i%2?'#c9923e':'#e8d6b0';g.lineWidth=2;g.strokeRect(30+i*4,30+i*4,w-60-i*8,h-60-i*8)}})),roughness:.95,envMapIntensity:.3}),-.56,32.1,FL(6)+.012);rug.rotation.set(-Math.PI/2,0,-.56);
 const pr=put(new THREE.PlaneGeometry(.9,.62),new THREE.MeshStandardMaterial({map:tex(cnv(180,124,(g,w,h)=>{g.fillStyle='#efe6d4';g.fillRect(0,0,w,h);g.fillStyle='#b8452c';g.beginPath();g.arc(w*.4,h*.55,26,0,7);g.fill();
  g.fillStyle='#22305e';g.fillRect(w*.55,h*.25,34,56);g.strokeStyle='#3a2616';g.lineWidth=8;g.strokeRect(0,0,w,h)})),roughness:.7}),-.56,33.64,FL(6)+1.75,Math.PI);
 put(new THREE.CylinderGeometry(.018,.018,1.55,8),wood,-.495,33.0,FL(6)+.78);}
const shadeM=new THREE.MeshStandardMaterial({color:0xf2e2c2,emissive:new THREE.Color(1,.72,.42),emissiveIntensity:0,roughness:.9,side:THREE.DoubleSide});
{const sh=new THREE.Mesh(new THREE.CylinderGeometry(.16,.24,.3,20,1,true),shadeM);sh.position.copy(pt(-.495,33.0,FL(6)+1.62));room.add(sh)}
// the room's own floor and ceiling, so the door never shows the sky through it
const rFloor=new THREE.Mesh(sector(30,33.8,-.68,-.44,.02),new THREE.MeshStandardMaterial({color:0x6a4a30,roughness:.62}));rFloor.position.y=FL(6)-.02;S.add(rFloor);
const rCeil=new THREE.Mesh(sector(30,33.8,-.68,-.44,.02),new THREE.MeshStandardMaterial({color:0xd8cdbb,roughness:.9,side:THREE.DoubleSide}));rCeil.position.y=FL(7)-.34;S.add(rCeil);
const curT=tex(cnv(128,256,(g,w,h)=>{for(let x=0;x<w;x++){const v=.75+.25*Math.sin(x*.35)*Math.sin(x*.07);g.fillStyle=`rgba(${250*v|0},${240*v|0},${222*v|0},.78)`;g.fillRect(x,0,1,h)}}),true);
const curtain=new THREE.Mesh(new THREE.PlaneGeometry(1.1,2.6,8,1),new THREE.MeshBasicMaterial({map:curT,transparent:true,color:0x000000,side:THREE.DoubleSide,depthWrite:false}));curtain.position.copy(pt(-.605,30.3,DY));curtain.lookAt(inC);S.add(curtain);
const lamp=new THREE.PointLight(new THREE.Color().setRGB(1,.7,.4),0,0,2);lamp.position.copy(pt(-.495,32.96,FL(6)+1.56));lamp.castShadow=true;lamp.shadow.mapSize.set(512,512);lamp.shadow.radius=6;lamp.shadow.bias=-.002;S.add(lamp);
R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;R.shadowMap.autoUpdate=false;
const moth=new THREE.Mesh(new THREE.PlaneGeometry(.045,.03),new THREE.MeshBasicMaterial({color:0x2a2218,side:THREE.DoubleSide}));moth.visible=false;S.add(moth);

// ---- the lake: a black mirror; the doubles shake with the surface; the moored boat breaks them
const boatP=pt(-.12,24.6,0);
const lake=new Reflector(new THREE.PlaneGeometry(3000,3000),{textureWidth:Math.round(innerWidth*DPR*(phone?.4:.6)),textureHeight:Math.round(innerHeight*DPR*(phone?.4:.6)),clipBias:.003,shader:{
 uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null},uT:{value:0},uCam:{value:new THREE.Vector3()},uHz:{value:HAZE},uFD:{value:.0017},uAmp:{value:1},uBoat:{value:new THREE.Vector2(boatP.x,boatP.z)}},
 vertexShader:`uniform mat4 textureMatrix;varying vec4 vUv;varying vec3 vW;void main(){vUv=textureMatrix*vec4(position,1.);vW=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform sampler2D tDiffuse;uniform vec3 uCam,uHz;uniform float uT,uFD,uAmp;uniform vec2 uBoat;varying vec4 vUv;varying vec3 vW;
 void main(){vec2 p=vW.xz;float d=length(uCam-vW);vec2 g=vec2(0.);for(int i=0;i<5;i++){float fi=float(i),a=fi*2.1+.7;vec2 k=vec2(cos(a),sin(a))*(.9+fi*.8);g+=k*cos(dot(p,k)+uT*(.7+fi*.4)+fi*1.7)*(.012/(1.+fi*.6));}
  vec2 bq=p-uBoat;float br=length(bq);g+=normalize(bq+1e-4)*sin(br*5.-uT*2.2)*.03*exp(-br*.35);
  g*=uAmp/(1.+d*.01);vec3 N=normalize(vec3(-g.x,1.,-g.y)),V=normalize(vW-uCam);float F=.02+.98*pow(1.-max(dot(-V,N),0.),5.);
  vec2 uv=vUv.xy/vUv.w+vec2(N.x,N.z)*.2/(1.+d*.02);vec3 r=texture2D(tDiffuse,uv).rgb;
  vec3 c=vec3(.006,.009,.016)+r*(.2+.8*F);c=mix(c,uHz*.55,1.-exp(-pow(d*uFD,2.)));gl_FragColor=vec4(c,1.);}`}});
lake.rotation.x=-Math.PI/2;S.add(lake);
{const b=new THREE.Group();const hm=new THREE.MeshStandardMaterial({color:0x1d1712,roughness:.8});const h=new THREE.Mesh(new THREE.CylinderGeometry(.75,.75,5.2,12,1,false,0,Math.PI),hm);h.rotation.set(0,0,Math.PI/2);h.scale.set(1,1,.5);h.rotation.y=.4;b.add(h);
 const tarp=new THREE.Mesh(new THREE.BoxGeometry(3,.25,1.1),new THREE.MeshStandardMaterial({color:0x27343a,roughness:.9}));tarp.position.y=.15;tarp.rotation.y=.4;b.add(tarp);b.position.set(boatP.x,.12,boatP.z);S.add(b)}

// ---- the far shore, two hundred and sixty metres off: trees, a street of other people's evenings, and the one generated plate
const inPlate=(x,z)=>x>-2&&x<82&&z<-230;
const trees=new THREE.InstancedMesh(new THREE.SphereGeometry(1,10,8),new THREE.MeshStandardMaterial({color:0x06090a,roughness:1}),260);k=0;
for(let i=0;i<260;i++){const a=-1.8+3.6*i/259+rnd()*.01,r=248+rnd()*16,x=r*Math.sin(a),z=-10-r*Math.cos(a),s=5+rnd()*6;if(inPlate(x,z)&&rnd()<.8)continue;trees.setMatrixAt(k++,M4.compose(P3.set(x,s*.7,z),Q.identity(),SC.set(s*1.2,s,s)))}trees.count=k;S.add(trees);
// the Gulshan shore at night: blocks of uneven height with setbacks, windows drawn floor by floor in metres (3.1 m storeys, 3.3 m bays), a third lit,
// most warm, some tube-white; lit shopfronts and sodium glow at street level; black water tanks and stair housings on the roofs against the sky
const fbM=new THREE.ShaderMaterial({uniforms:{uHz:{value:HAZE},uFD:{value:.0017}},
 vertexShader:`varying vec3 vL,vNl,vW,vS;varying float vI;void main(){vS=vec3(length(instanceMatrix[0].xyz),length(instanceMatrix[1].xyz),length(instanceMatrix[2].xyz));vL=position*vS;vNl=normal;vI=float(gl_InstanceID);
  vec4 w=modelMatrix*instanceMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
 fragmentShader:`uniform vec3 uHz;uniform float uFD;varying vec3 vL,vNl,vW,vS;varying float vI;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 void main(){float y=vL.y+vS.y*.5;vec3 c=vec3(.011,.012,.016);
  if(abs(vNl.y)<.5){float s=abs(vNl.x)>.5?vL.z:vL.x;vec2 g=vec2(s/3.3,y/3.1),id=floor(g)+vec2(vI*17.,vI*5.),f=fract(g);float r=h(id),r2=h(id+.5),b=h(vec2(vI,3.));
   float win=step(.16,f.x)*step(f.x,.84)*step(.26,f.y)*step(f.y,.86);vec3 lit=r2<.8?vec3(1.,.58,.26)*(.5+r*1.6):vec3(.6,.8,1.)*(.6+r);
   c=mix(vec3(.017,.019,.027),mix(vec3(.008,.01,.016),lit,step(r,.22+.2*b)),win);
   if(y<4.2){float sh=step(.45,h(vec2(floor(s/5.),vI))),q=fract(s/5.);c=mix(vec3(.015),vec3(1.,.52,.2)*1.3,sh*step(.9,y)*step(y,3.3)*step(.08,q)*step(q,.92));}
   c+=vec3(1.,.42,.12)*.07*exp(-y*.3);if(vS.y-y<.8)c=vec3(.011,.012,.016);}
  float d=length(vW-cameraPosition);c=mix(c,uHz*.55,1.-exp(-pow(d*uFD,2.)));gl_FragColor=vec4(c,1.);}`});
const AV=[],fb=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),fbM,100),roofM=new THREE.MeshStandardMaterial({color:0x0b0c0f,roughness:.55,envMapIntensity:.8});
const tanks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.85,.85,1.6,12),roofM,160),mumty=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),roofM,60);k=0;let kt=0,km=0;
for(let i=0;i<48;i++){const a=-1.75+3.5*i/47+rnd()*.03,r=272+rnd()*18,x=r*Math.sin(a),z=-10-r*Math.cos(a),h=14+rnd()*30,w=20+rnd()*14;if(inPlate(x,z))continue;
 const ux=Math.cos(a),uz=-Math.sin(a);Q.setFromAxisAngle(YA,a);fb.setMatrixAt(k++,M4.compose(P3.set(x,h/2,z),Q,SC.set(w,h,14)));let top=h,tw=w,tx=x,tz=z;
 if(rnd()<.42){const h2=5+rnd()*11,w2=w*(.35+rnd()*.3),o=(rnd()-.5)*w*.4;tx=x+ux*o;tz=z+uz*o;fb.setMatrixAt(k++,M4.compose(P3.set(tx,h+h2/2,tz),Q,SC.set(w2,h2,9)));top=h+h2;tw=w2}
 const nT=1+Math.floor(rnd()*3);for(let j=0;j<nT&&kt<160;j++){const o=(rnd()-.5)*tw*.8;tanks.setMatrixAt(kt++,M4.compose(P3.set(tx+ux*o,top+.8,tz+uz*o),Q,SC.set(1,1,1)))}
 if(rnd()<.6&&km<60){const o=(rnd()-.5)*tw*.5;mumty.setMatrixAt(km++,M4.compose(P3.set(tx+ux*o,top+1.3,tz+uz*o),Q,SC.set(3,2.6,3)))}}
for(let i=0;i<34&&k<100;i++){const a=-1.7+3.4*i/33+rnd()*.04,r=300+rnd()*25,x=r*Math.sin(a),z=-10-r*Math.cos(a),h=rnd()<.18?55+rnd()*35:10+rnd()*22;if(inPlate(x,z))continue;
 fb.setMatrixAt(k++,M4.compose(P3.set(x,h/2,z),Q.setFromAxisAngle(YA,a+(rnd()-.5)*.3),SC.set(16+rnd()*14,h,12)));if(h>50)AV.push(new THREE.Vector3(x,h+1.2,z))}
fb.count=k;tanks.count=kt;mumty.count=km;S.add(fb,tanks,mumty);
const avM=new THREE.MeshBasicMaterial({color:new THREE.Color(6,.25,.12)}),avs=AV.map(p=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.45,8,6),avM);m.position.copy(p);S.add(m);return m});
new THREE.TextureLoader().load('../img/eleven-tower.webp',t=>{t.colorSpace=THREE.SRGBColorSpace;const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uI:{value:t},uHz:{value:HAZE}},
 vertexShader:`varying vec2 vU;void main(){vU=vec2(uv.x,mix(.14,1.,uv.y));gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform sampler2D uI;uniform vec3 uHz;varying vec2 vU;void main(){vec3 c=texture2D(uI,vU).rgb;float sky=smoothstep(1.7,2.5,c.b/(c.r+.004))*smoothstep(.36,.56,vU.y);
  gl_FragColor=vec4(mix(c*.85,uHz*.5,.2),1.-sky);}`});
 const pl=new THREE.Mesh(new THREE.PlaneGeometry(77,37.3),m);pl.position.set(40,18.65,-262);S.add(pl)});

// ---- the camera: at the rail; out over the lake, a pan along the other home's façade, the tilt into the reflection, then round to your own door
const cam=new THREE.PerspectiveCamera(30,innerWidth/innerHeight,.05,5000);
const LEAN=pt(-.56,26.45,FL(6)+1.35);
const KEYS=[[0,EYE,EYE.clone().add(new THREE.Vector3(50,-5.5,-4.4)),phone?54:36],[.26,EYE,pt(.36,29,19),phone?46:30],[.52,EYE,pt(.74,29,21),phone?44:28],[.66,pt(-.56,27.6,FL(6)+1.45),pt(.55,29,12),phone?48:32],[.8,LEAN,LEAN.clone().add(new THREE.Vector3(20,-27.5,1.6)),phone?46:30],[.9,LEAN,LEAN.clone().add(new THREE.Vector3(20,-32,1.4)),phone?44:30],[1,pt(-.56,27.25,FL(6)+1.5),doorC,phone?60:46]];
const KA=KEYS.map(([s,p,t,f])=>{const d=t.clone().sub(p);return[s,p,Math.atan2(-d.x,-d.z),Math.atan2(d.y,Math.hypot(d.x,d.z)),f]});
function camAt(sp){let i=1;while(i<KA.length-1&&KA[i][0]<sp)i++;const a=KA[i-1],b=KA[i],t=sm(a[0],b[0],sp);let dy=b[2]-a[2];dy=Math.atan2(Math.sin(dy),Math.cos(dy));
 cam.position.copy(a[1]).lerp(b[1],t);cam.rotation.set(lerp(a[3],b[3],t),a[2]+dy*t,0,'YXZ');const f=lerp(a[4],b[4],t);if(cam.fov!==f){cam.fov=f;cam.updateProjectionMatrix()}}

// ---- the lens: blue hour, one window; halation on the lit glass, fine grain
const comp=new EffectComposer(R);comp.addPass(new RenderPass(S,cam));
const film=new ShaderPass({uniforms:{tDiffuse:{value:null},uT:{value:0},uF:{value:0},uR:{value:new THREE.Vector2()}},
 vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform sampler2D tDiffuse;uniform float uT,uF;uniform vec2 uR;varying vec2 vUv;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;vec2 px=1./uR;vec3 b=vec3(0.);for(int i=0;i<16;i++){float a=float(i)*.3927;b+=texture2D(tDiffuse,vUv+vec2(cos(a),sin(a))*px*(7.+mod(float(i),2.)*11.)).rgb;}b/=16.;
  c+=max(b-.72,0.)*vec3(1.,.55,.26)*.4;float l=dot(c,vec3(.2126,.7152,.0722));c=mix(c*vec3(.9,.97,1.12),c*vec3(1.04,1.,.92),smoothstep(.25,.8,l));
  vec2 q=vUv-.5;c*=1.-dot(q,q)*.7;c+=(h(floor(vUv*uR/1.3)+fract(uT)*53.)-.5)*.022*(.4+l);gl_FragColor=vec4(c*uF,1.);}`});
comp.addPass(film);comp.addPass(new OutputPass());
// the render: contact shading where slab meets glass and fin meets rail, bloom only on lamps and lit rooms, the flat sky fill halved
lux(R,S,cam,comp,{hemi:.3,exposure:.92,ao:{radius:1.2,thickness:2,distanceFallOff:1,blend:1,protect:[.035,.14]},bloom:{strength:.42,radius:.5,threshold:1.45}});
function size(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);comp.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix();film.uniforms.uR.value.set(w*DPR,h*DPR);lake.getRenderTarget().setSize(Math.round(w*DPR*(phone?.4:.6)),Math.round(h*DPR*(phone?.4:.6)))}
let lastW=innerWidth;addEventListener('resize',()=>{if(!phone||Math.abs(innerWidth-lastW)>innerWidth*.1){lastW=innerWidth;size()}});size();

// ---- sound, opt-in: generators starting far off, one by one, as the windows come on
let ac=null,master=null,sndOn=false,gens=0;const sndB=document.getElementById('snd');
sndB.onclick=()=>{if(!ac){try{ac=new AudioContext();master=ac.createGain();master.connect(ac.destination)}catch(e){return}}sndOn=!sndOn;ac.resume();master.gain.value=sndOn?1:0;sndB.textContent='Sound · '+(sndOn?'on':'off')};
function gen(){if(!ac||!sndOn||gens>=10)return;gens++;const t=ac.currentTime,o=ac.createOscillator(),lp=ac.createBiquadFilter(),g=ac.createGain(),pn=ac.createStereoPanner();o.type='sawtooth';o.frequency.value=48+Math.random()*16;
 lp.type='lowpass';lp.frequency.value=110;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.018,t+2.5);pn.pan.value=Math.random()*1.6-.8;o.connect(lp);lp.connect(g);g.connect(pn);pn.connect(master);o.start(t)}

// ---- the hand: a tap lights the window nearest the line of sight, or the window whose double lies nearest it in the lake
let lit=0,minutes=0;const clk=document.getElementById('clk'),hint=document.getElementById('hint');
function light(i,byHand){const w=WIN[i];if(w.on)return;w.on=true;w.t0=performance.now()/1000;lit++;minutes++;if(byHand)hint.style.opacity=0;
 const l=pool[poolI];poolI=(poolI+1)%pool.length;l.position.copy(pt(w.t,28.3,FL(w.f)+1.9));l.intensity=7;gen()}
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),Dv=new THREE.Vector3();let downAt=null;
cv.addEventListener('pointerdown',e=>downAt=[e.clientX,e.clientY]);
cv.addEventListener('pointerup',e=>{if(!downAt||Math.hypot(e.clientX-downAt[0],e.clientY-downAt[1])>10)return;downAt=null;ndc.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);ray.setFromCamera(ndc,cam);
 let best=-1,bd=.14;WIN.forEach((w,i)=>{if(w.on)return;for(const c of[w.c,P3.set(w.c.x,-w.c.y,w.c.z)]){const a=Dv.copy(c).sub(ray.ray.origin).normalize().angleTo(ray.ray.direction);if(a<bd){bd=a;best=i}}});if(best>=0)light(best,true)});

// ---- the frame
const drv=document.getElementById('drv'),hud=document.getElementById('hud'),beats=[...document.querySelectorAll('.beat')];
// the party wall at the crescent's middle hides the rooms just past it, so the far rooms of the other home light first: those are the ones you can see
const FIRST=WIN.findIndex(w=>w.f===6&&w.t===.42),band=w=>w.t>.3?0:w.t>0?1:2;
const ORDER=WIN.map((_,i)=>i).filter(i=>i!==FIRST).map(i=>[band(WIN[i]),rnd(),i]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]).map(a=>a[2]);
const SPQ=QS.has('sp')?+QS.get('sp'):null;let sp=0,first=false,ownT=null;const t0=performance.now();let last=t0;const WC=new THREE.Color();
window.__el={cam,WIN,light,lake,door,winM};
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;const t=(now-t0)/1000;
 sp=Math.max(0,Math.min(1,scrollY/Math.max(1,drv.offsetHeight-innerHeight)));if(SPQ!==null)sp=SPQ;if(scrollY>drv.offsetHeight+innerHeight*.1)return;
 // 3 to 5 s: the window next door comes on by itself; the scroll brings on a street of evenings; yours waits for the end
 if(t>3.8&&!first){first=true;light(FIRST)}const want=Math.round(sm(.14,.82,sp)*40);for(let n=0;n<want;n++)light(ORDER[n]);
 const own=sm(.93,.985,sp);if(own>.02&&ownT===null)ownT=t;
 WIN.forEach((w,i)=>{if(!w.on)return;const a=Math.min(1,(now/1000-w.t0)/1.6),fl=a<1?(Math.sin(a*40)>.2?1:.35)*a:1;
  wins.setMatrixAt(i,M4.compose(P3.set(C.x,FL(w.f)+1.45,C.z),Q.setFromAxisAngle(YA,w.t),SC.set(1,1,1)));wins.setColorAt(i,w.tv?WC.setRGB(.9,1.1,1.6).multiplyScalar(fl*.9):WC.setRGB(1.25,1.08,.9).multiplyScalar(fl*w.k));sofs.setColorAt(i,WC.setRGB(1,.62,.32).multiplyScalar(fl*(w.tv?.8:1.5*w.k)))});
 wins.instanceMatrix.needsUpdate=true;if(wins.instanceColor)wins.instanceColor.needsUpdate=true;sofs.instanceColor.needsUpdate=true;
 for(const l of pool)l.intensity=Math.max(0,l.intensity-dt*.02);
 door.visible=sp>.84;door.material.uniforms.uOn.value=own;curtain.material.color.setScalar(.02+own*.5);lamp.intensity=own*4.5;shadeM.emissiveIntensity=own*1.1;R.shadowMap.needsUpdate=own>.01;avM.visible=(t%1.6)<.8;winM.uniforms.uT.value=t;
 curtain.rotation.y=curtain.rotation.y*.9+(Math.sin(t*.8)*.08)*.1;moth.visible=own>.6;if(moth.visible){moth.position.copy(pt(-.52+Math.sin(t*9)*.004,29.7,DY+.65+Math.sin(t*13)*.03));moth.lookAt(cam.position)}
 camAt(sp);cam.updateMatrixWorld();lake.material.uniforms.uCam.value.copy(cam.position);lake.material.uniforms.uT.value=t;lake.material.uniforms.uAmp.value=1+sm(.6,.8,sp)*.4;
 const mm=50+minutes+(own>.5?1:0);clk.textContent=(18+Math.floor(mm/60))+':'+String(mm%60).padStart(2,'0');
 for(const b of beats)b.classList.toggle('on',sp>+b.dataset.a&&sp<+b.dataset.b);hint.style.opacity=sp>.3?0:hint.style.opacity;hud.classList.toggle('off',scrollY>drv.offsetHeight-innerHeight*.6);
 film.uniforms.uT.value=t;film.uniforms.uF.value=sm(0,1.6,t);comp.render()}
requestAnimationFrame(frame);
