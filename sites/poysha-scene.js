// Poysha: the bottom of a green glass jar on a tea-stall counter in Dhaka, looking up. Units are metres; the jar's inner floor is y=0.
// Coins fall from the mouth toward the lens and settle on the glass above it. The number etched into the base climbs whether or not you touch anything.
// Coin faces are drawn from catalogue descriptions of real Bangladeshi steel coins (Numista N# 3165, 1972, 9355): the national emblem on one side,
// the family of four (1 taka, 1992), the two children reading (2 taka, 2004-08) and the Jamuna bridge (5 taka, 2005-08) on the other.
import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {lux} from './lib/lux.js';
await Promise.all([document.fonts.load("400 40px 'Tiro Bangla'"),document.fonts.load("600 40px 'Switzer'")]).catch(()=>{});

const cv=document.getElementById('gl'),phone=innerWidth<700,DPR=Math.min(devicePixelRatio,phone?1.5:2),QS=new URLSearchParams(location.search);
const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});
R.setPixelRatio(DPR);R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1;R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
const S=new THREE.Scene();
let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const sm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};
const bn=n=>String(n).replace(/\d/g,d=>'০১২৩৪৫৬৭৮৯'[d]);
const f=v=>`(${v.toFixed(4)})`;

// ---- the lens sits under the jar's base, 20 mm equivalent, looking up the jar to the mouth
const EYE=-.06,BASE=-.012,RIN=.062,MOUTH=.0442,TOP=.21;
const cam=new THREE.PerspectiveCamera(phone?80:64,innerWidth/innerHeight,.002,8);
const CX=phone?-.008:-.021,CZ=phone?.014:.011;
cam.up.set(0,0,1);cam.position.set(CX,EYE,CZ);const LOOK=new THREE.Vector3(CX*.6,1,CZ*.6-.02);cam.lookAt(LOOK);

// ---- what lies outside the jar: bright sky over the stall, the tin awning's corrugated edge, a bunch of bananas on a string; all out of focus
const OUTSIDE=`vec3 outside(vec3 d){
 vec2 p=d.xz/max(d.y,.08)-vec2(${f(-CX/.26)},${f(-CZ/.26)});
 vec3 sky=mix(vec3(.74,.84,.92),vec3(1.2,1.12,.98),smoothstep(.2,0.,length(p-vec2(-.03,-.06))))*1.15;
 float cor=sin(p.x*58.);float aw=smoothstep(-.02,.02,p.y-.045+.008*cor);
 sky=mix(sky,vec3(.09,.075,.06)+vec3(.035)*cor,aw*.97);
 vec2 b=(p-vec2(-.045,.02))*.8;float bb=0.;
 for(int i=0;i<8;i++){float fi=float(i-(i/4)*4)-1.5,row=float(i/4);vec2 q=b-vec2(fi*.016,-.022-row*.02-.006*abs(fi));float c=cos(fi*.3),s=sin(fi*.3);q=mat2(c,-s,s,c)*q;bb=max(bb,smoothstep(.016,.005,length(q*vec2(1.,.4))));}
 bb=max(bb,smoothstep(.006,.002,abs(b.x+.002))*step(-.01,b.y)*step(b.y,.05));
 sky=mix(sky,vec3(.36,.26,.05),bb*.94);
 float post=smoothstep(.06,0.,abs(fract(atan(d.x,d.z)*.48+.2)-.5)-.44)*.5;vec3 side=mix(vec3(.5,.45,.36),vec3(1.05,.98,.84),smoothstep(-.2,-.9,d.x))*(1.-.3*post);
 return mix(side,sky,smoothstep(.45,.8,d.y));}`;
const sky=new THREE.Mesh(new THREE.SphereGeometry(4,48,24),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{uDay:{value:1}},
 vertexShader:`varying vec3 vW;void main(){vW=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vW,1.);}`,
 fragmentShader:`uniform float uDay;varying vec3 vW;${OUTSIDE}void main(){gl_FragColor=vec4(outside(normalize(vW))*uDay,1.);}`}));
S.add(sky);

// ---- the jar: green soda glass, 4 mm walls, a shoulder into a short neck and a rolled lip. Seen from inside, reflecting its own green dark,
// passing the stall through, and carrying the back of its paper label, reversed and lit from behind
const lab=document.createElement('canvas');lab.width=1024;lab.height=300;{const g=lab.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,1024,300);g.fillStyle='#000';
 g.font="400 168px 'Tiro Bangla'";g.textBaseline='alphabetic';g.fillText('পয়সা',56,205);g.font="600 46px 'Switzer'";g.fillText('Keep the change.',560,142);
 g.font="600 26px 'Switzer'";g.fillText('ROUND-UP SAVINGS · DHAKA',562,192);g.fillRect(562,214,400,3);g.fillRect(0,0,1024,10);g.fillRect(0,290,1024,10)}
const labT=new THREE.CanvasTexture(lab);labT.anisotropy=8;
const LY0=phone?.115:.128,LH=phone?.036:.032,LA=.95;
const prof=[[.062,-.001],[.062,.15],[.0605,.163],[.056,.173],[.05,.181],[.0455,.188],[MOUTH,.194],[MOUTH,.206],[.0462,.2095],[.0495,.2105],[.0515,.207]].map(([r,y])=>new THREE.Vector2(r,y));
const wallU={uCam:{value:cam.position},uDay:{value:1},uLab:{value:labT}};
const wall=new THREE.Mesh(new THREE.LatheGeometry(prof,phone?72:144),new THREE.ShaderMaterial({uniforms:wallU,side:THREE.DoubleSide,
 vertexShader:`varying vec3 vW;void main(){vW=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vW,1.);}`,
 fragmentShader:`uniform vec3 uCam;uniform float uDay;uniform sampler2D uLab;varying vec3 vW;${OUTSIDE}
 void main(){vec3 V=normalize(vW-uCam);vec3 n=normalize(vec3(vW.x,0.,vW.z));
  float c=max(abs(dot(V,n)),.07),F=.03+.97*pow(1.-c,5.);
  vec3 T=exp(-(.0042/c)*vec3(40.,9.,27.));
  vec3 o=outside(normalize(n*.9+V*.35))*T*uDay*(.55+.75*smoothstep(.05,.55,c));
  float a2=atan(vW.x,-vW.z);vec2 lu=vec2((${f(LA)}-a2)/${f(2*LA)},(vW.y-${f(LY0)})/${f(LH)});
  float inL=step(0.,lu.x)*step(lu.x,1.)*step(0.,lu.y)*step(lu.y,1.);
  float ink=texture2D(uLab,lu).r;
  o=mix(o,vec3(1.,.9,.72)*(.25+.75*ink)*.8*T*uDay,inL);
  vec3 rf=vec3(.03,.055,.04)+vec3(.8,1.,.85)*smoothstep(.19,.21,vW.y)*uDay*.7;
  vec3 col=o*(1.-F)+rf*F+vec3(.5,.75,.58)*smoothstep(.185,.212,vW.y)*.4*uDay;
  gl_FragColor=vec4(col,1.);}`}));
S.add(wall);

// ---- light: daylight through the mouth (a cone the size of the neck), green light that came through the walls,
// and the glow the thick base pipes up into the undersides of the coins
const hemi=new THREE.HemisphereLight(0xe2e3de,0x403f3b,.5);S.add(hemi);
const sun=new THREE.SpotLight(0xfff3e4,3.2,0,Math.atan(.056/.9),.35,2);sun.position.set(.004,.9,.012);sun.target.position.set(0,0,0);S.add(sun,sun.target);
sun.castShadow=true;sun.shadow.mapSize.set(phone?1024:2048,phone?1024:2048);sun.shadow.camera.near=.6;sun.shadow.camera.far=1.;sun.shadow.bias=-.0004;sun.shadow.normalBias=.0002;
const glow=new THREE.DirectionalLight(0xe4e3dc,1.15);glow.position.set(-.55,-.4,.2);S.add(glow);
const glow2=new THREE.DirectionalLight(0xe8d9b4,.35);glow2.position.set(.5,-.3,-.35);S.add(glow2);
// the steel reflects this: a bright disc overhead, green walls, and underneath the glowing base, brighter toward the street side
const envS=new THREE.Scene();envS.add(new THREE.Mesh(new THREE.SphereGeometry(1,64,32),new THREE.ShaderMaterial({side:THREE.BackSide,
 vertexShader:`varying vec3 vW;void main(){vW=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`varying vec3 vW;void main(){vec3 d=normalize(vW);vec3 c;
  if(d.y>0.)c=vec3(.08,.09,.085)+vec3(.26,.29,.27)*smoothstep(0.,.7,d.y)+vec3(3.,2.9,2.6)*smoothstep(.975,.99,d.y);
  else c=mix(vec3(.055,.058,.056),vec3(.97,.98,.95),smoothstep(-.3,.8,-d.x*.8+d.z*.3))*(.5+.5*smoothstep(0.,-.9,d.y))+vec3(.2,.16,.1)*smoothstep(.6,.9,d.z)*smoothstep(0.,-.3,d.y);
  gl_FragColor=vec4(c,1.);}`})));
const pm=new THREE.PMREMGenerator(R);S.environment=pm.fromScene(envS,0,.1,10).texture;

// ---- the coins. Real sizes where the catalogue gives them (1 taka 25 mm); 26 and 27 mm for the 2 and 5 are recalled, not read
const TY=[{v:1,r:.0125,t:.0017},{v:2,r:.013,t:.0018},{v:5,r:.0135,t:.002}];
const FACE=phone?256:512,s=FACE/2;
const FIELD='rgb(96,96,96)',HI='rgb(200,200,200)',TXT='rgb(208,208,208)',SEP='rgb(140,140,140)';
function arcText(g,txt,Rr,px,font,bottom){const o=document.createElement('canvas'),q=o.getContext('2d'),F=font.replace('#',px+'px');q.font=F;
 const w=Math.ceil(q.measureText(txt).width)+4,h=Math.ceil(px*1.7);o.width=w;o.height=h;q.font=F;q.fillStyle=TXT;q.textBaseline='middle';q.fillText(txt,2,h*.55);
 const st=Math.max(1,Math.round(px/14));for(let x=0;x<w;x+=st){const a=(x-w/2)/Rr;g.save();g.rotate(bottom?-a:a);g.drawImage(o,x,0,st,h,-st/2,bottom?Rr-h/2:-Rr-h/2,st+.6,h);g.restore()}}
function txt(g,t,x,y,px,font){g.save();g.font=font.replace('#',px+'px');g.fillStyle=TXT;g.textAlign='center';g.textBaseline='middle';g.fillText(t,x,y);g.restore()}
function blob(g,pts,fill=HI,sep=SEP,lw=s*.012){g.fillStyle=fill;g.strokeStyle=sep;g.lineWidth=lw;g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x*s,y*s):g.moveTo(x*s,y*s));g.closePath();g.fill();g.stroke()}
function petal(g,x,y,a,len,wid){g.save();g.translate(x*s,y*s);g.rotate(a);g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(wid*s,-len*s*.55,0,-len*s);g.quadraticCurveTo(-wid*s,-len*s*.55,0,0);g.fillStyle=HI;g.fill();g.strokeStyle=SEP;g.lineWidth=s*.012;g.stroke();g.restore()}
function star(g,x,y,r){g.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,rr=i%2?r*.42:r;g.lineTo((x+Math.cos(a)*rr)*s,(y+Math.sin(a)*rr)*s)}g.closePath();g.fillStyle=HI;g.fill()}
function disc(g,x,y,r,c=HI){g.beginPath();g.arc(x*s,y*s,r*s,0,7);g.fillStyle=c;g.fill()}
// the national emblem: a water lily on water between two rice sheaves, three leaves above, two stars on each side of them
function emblem(g,k){g.strokeStyle=HI;g.lineCap='round';g.lineWidth=s*.03;
 for(let i=0;i<3;i++){const y=.2+i*.085,w=.3-i*.06;g.beginPath();for(let j=0;j<=28;j++){const x=-w+2*w*j/28;g.lineTo(x*s,(y+Math.sin(j/28*Math.PI*4)*.016)*s)}g.stroke()}
 for(const sx of[-1,1]){g.strokeStyle=HI;g.lineWidth=s*.022;g.beginPath();const P=t=>[sx*(.1+.52*Math.sin(t*1.3)),.46-.78*t];
  for(let j=0;j<=20;j++){const[x,y]=P(j/20);g.lineTo(x*s,y*s)}g.stroke();
  for(let j=2;j<=17;j++){const t=j/20,[x,y]=P(t),[x2,y2]=P(t+.01),ta=Math.atan2(y2-y,x2-x);for(const side of[-1,1]){g.save();g.translate((x+Math.cos(ta+side*1.57)*.035)*s,(y+Math.sin(ta+side*1.57)*.035)*s);g.rotate(ta+side*.5);g.beginPath();g.ellipse(0,0,.036*s,.017*s,0,0,7);g.fillStyle=HI;g.fill();g.strokeStyle=SEP;g.lineWidth=s*.008;g.stroke();g.restore()}}}
 for(const[a,len,wid]of[[-1.25,.17,.06],[1.25,.17,.06],[-.85,.24,.075],[.85,.24,.075],[-.42,.29,.085],[.42,.29,.085],[0,.33,.09]])petal(g,0,.16,a,len,wid);
 for(const a of[-.62,0,.62])petal(g,0,-.4,a,.19,.06);
 g.strokeStyle=HI;g.lineWidth=s*.02;g.beginPath();g.moveTo(0,-.4*s);g.lineTo(0,-.33*s);g.stroke();
 for(const sx of[-1,1]){star(g,sx*.2,-.47,.042);star(g,sx*.33,-.4,.042)}
 if(k===1)arcText(g,'TWO  2  TAKA',s*.72,Math.round(s*.1),"600 # 'Switzer'",true);
 if(k===2)arcText(g,'বাংলাদেশ ব্যাংক',s*.72,Math.round(s*.11),"400 # 'Tiro Bangla'",true);
 if(k===1){const w=g.createRadialGradient(0,-.02*s,0,0,-.02*s,.3*s);w.addColorStop(0,'rgba(120,120,120,.55)');w.addColorStop(1,'rgba(120,120,120,0)');g.fillStyle=w;g.fillRect(-s,-s,2*s,2*s)}}
function figure(g,x,feet,h,sari){const hr=h*.13;disc(g,x,feet-h+hr,hr);
 if(sari)blob(g,[[x-h*.09,feet-h*.74],[x+h*.09,feet-h*.74],[x+h*.2,feet],[x-h*.2,feet]]);
 else{blob(g,[[x-h*.15,feet-h*.74],[x+h*.15,feet-h*.74],[x+h*.11,feet-h*.4],[x-h*.11,feet-h*.4]]);blob(g,[[x-h*.1,feet-h*.42],[x-h*.01,feet-h*.42],[x-h*.02,feet],[x-h*.09,feet]]);blob(g,[[x+h*.01,feet-h*.42],[x+h*.1,feet-h*.42],[x+h*.09,feet],[x+h*.02,feet]])}}
function reverse(g,k){
 if(k===0){figure(g,-.26,.3,.52,false);figure(g,-.06,.3,.47,true);figure(g,.13,.3,.33,false);figure(g,.28,.3,.3,true);
  arcText(g,'বাংলাদেশ',s*.72,Math.round(s*.12),"400 # 'Tiro Bangla'",false);txt(g,'এক ১ টাকা',0,.42*s,Math.round(s*.11),"400 # 'Tiro Bangla'");
  txt(g,'১৯৯২',-.5*s,-.1*s,Math.round(s*.08),"400 # 'Tiro Bangla'");arcText(g,'পরিকল্পিত পরিবার - সবার জন্য খাদ্য',s*.74,Math.round(s*.085),"400 # 'Tiro Bangla'",true)}
 if(k===1){blob(g,[[-.3,-.02],[-.01,.06],[-.01,.26],[-.3,.18]]);blob(g,[[.01,.06],[.3,-.02],[.3,.18],[.01,.26]]);
  txt(g,'ক অ',-.15*s,.1*s,Math.round(s*.1),"400 # 'Tiro Bangla'");g.fillStyle=SEP;txt(g,'১',.16*s,.1*s,Math.round(s*.11),"400 # 'Tiro Bangla'");
  for(const sx of[-1,1]){disc(g,sx*.4,-.2,.075);blob(g,[[sx*.46,-.1],[sx*.3,-.1],[sx*.22,.12],[sx*.28,.34],[sx*.5,.34],[sx*.5,.05]]);g.strokeStyle=HI;g.lineWidth=s*.035;g.beginPath();g.moveTo(sx*.36*s,-.02*s);g.lineTo(sx*.29*s,.1*s);g.stroke()}
  arcText(g,'২০০৮ ইং বাংলাদেশ সবার জন্য শিক্ষা',s*.74,Math.round(s*.085),"400 # 'Tiro Bangla'",false);txt(g,'দুই ২ টাকা',0,.5*s,Math.round(s*.1),"400 # 'Tiro Bangla'")}
 if(k===2){for(const[cx,cy,cr]of[[-.35,-.36,.08],[-.25,-.4,.1],[-.14,-.35,.07],[.2,-.4,.07],[.3,-.44,.09],[.39,-.38,.065]])disc(g,cx,cy,cr,'rgb(150,150,150)');
  g.strokeStyle=HI;g.lineWidth=s*.022;for(let i=0;i<3;i++){const y=.2+i*.075;g.beginPath();for(let j=0;j<=30;j++){const x=-.62+1.24*j/30;g.lineTo(x*s,(y+Math.sin(j*1.3+i)*.01)*s)}g.stroke()}
  for(let i=0;i<12;i++){const x=-.6+i*.11,y=.02-.1*(x+.6)/1.2;blob(g,[[x-.014,y],[x+.014,y],[x+.02,.18],[x-.02,.18]])}
  blob(g,[[-.66,.03],[.66,-.1],[.66,-.05],[-.66,.08]]);
  arcText(g,'যমুনা বহুমুখী সেতু',s*.72,Math.round(s*.11),"400 # 'Tiro Bangla'",false);txt(g,'২০০৮',0,-.2*s,Math.round(s*.09),"400 # 'Tiro Bangla'");
  arcText(g,'FIVE TAKA  ৫  পাঁচ টাকা',s*.73,Math.round(s*.09),"600 # 'Switzer'",true)}}
function faceMaps(k,side){const c=document.createElement('canvas');c.width=c.height=FACE;const g=c.getContext('2d');g.fillStyle='#000';g.fillRect(0,0,FACE,FACE);g.translate(s,s);
 g.fillStyle=FIELD;g.beginPath();g.arc(0,0,s,0,7);g.fill();
 g.lineWidth=s*.075;g.strokeStyle='rgb(236,236,236)';g.beginPath();g.arc(0,0,s*.955,0,7);g.stroke();g.lineWidth=s*.012;g.strokeStyle='rgb(160,160,160)';g.beginPath();g.arc(0,0,s*.855,0,7);g.stroke();
 side?reverse(g,k):emblem(g,k);
 g.setTransform(1,0,0,1,0,0);
 const sc=document.createElement('canvas');sc.width=sc.height=FACE;const sg=sc.getContext('2d');sg.strokeStyle='rgba(255,255,255,.55)';sg.lineWidth=Math.max(1,FACE/512);
 for(let i=0;i<70;i++){const x=rnd()*FACE,y=rnd()*FACE,a=rnd()*6.28,l=FACE*(.03+rnd()*.25);sg.beginPath();sg.moveTo(x,y);sg.quadraticCurveTo(x+Math.cos(a+.2)*l*.5,y+Math.sin(a+.2)*l*.5,x+Math.cos(a)*l,y+Math.sin(a)*l);sg.stroke()}
 const blur=(px)=>{const b=document.createElement('canvas');b.width=b.height=FACE;const bg=b.getContext('2d');bg.filter=`blur(${px}px)`;bg.drawImage(c,0,0);return bg.getImageData(0,0,FACE,FACE).data};
 const H=blur(FACE/420+.4),W=blur(FACE/36),SC=sg.getImageData(0,0,FACE,FACE).data;
 const mk=()=>{const o=document.createElement('canvas');o.width=o.height=FACE;return o};const nc=mk(),ac=mk(),rc=mk();
 const nI=nc.getContext('2d').createImageData(FACE,FACE),aI=ac.getContext('2d').createImageData(FACE,FACE),rI=rc.getContext('2d').createImageData(FACE,FACE);
 const K=3.2*FACE/512,N=FACE;
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=(y*N+x)*4,h=H[i]/255,hl=H[(y*N+Math.max(0,x-1))*4]/255,hr=H[(y*N+Math.min(N-1,x+1))*4]/255,hu=H[(Math.max(0,y-1)*N+x)*4]/255,hd=H[(Math.min(N-1,y+1)*N+x)*4]/255;
  let nx=-(hr-hl)*K,ny=(hd-hu)*K,nz=1;const L=Math.hypot(nx,ny,nz);nI.data[i]=(nx/L*.5+.5)*255;nI.data[i+1]=(ny/L*.5+.5)*255;nI.data[i+2]=(nz/L*.5+.5)*255;nI.data[i+3]=255;
  const cu=h-W[i]/255,scr=SC[i+3]/255*(h<.5?1:.35);
  const al=Math.min(.92,Math.max(.28,.64+cu*1.5-scr*.06-(h<.45?.05:0)));aI.data[i]=al*255;aI.data[i+1]=al*252;aI.data[i+2]=al*246;aI.data[i+3]=255;
  const ro=Math.min(.75,Math.max(.14,.44-cu*1.3+scr*.22+(h>.75?-.12:0)));rI.data[i]=rI.data[i+1]=rI.data[i+2]=ro*255;rI.data[i+3]=255}
 nc.getContext('2d').putImageData(nI,0,0);ac.getContext('2d').putImageData(aI,0,0);rc.getContext('2d').putImageData(rI,0,0);
 const T=cvs=>{const t=new THREE.CanvasTexture(cvs);t.anisotropy=8;return t};const alb=T(ac);alb.colorSpace=THREE.SRGBColorSpace;
 return new THREE.MeshStandardMaterial({map:alb,normalMap:T(nc),normalScale:new THREE.Vector2(1.5,1.5),roughnessMap:T(rc),roughness:1,metalness:1,envMapIntensity:1.15})}
const MAX=phone?120:200,POUR=phone?70:90;
const meshes=TY.map((T,k)=>{const geo=new THREE.CylinderGeometry(T.r,T.r,T.t,phone?40:72,1);
 const side=new THREE.MeshStandardMaterial({color:0xc4c4bf,metalness:1,roughness:.3,envMapIntensity:1.2});
 const m=new THREE.InstancedMesh(geo,[side,faceMaps(k,0),faceMaps(k,1)],MAX);m.count=0;m.castShadow=m.receiveShadow=true;m.frustumCulled=false;S.add(m);return m});
const slots=[[],[],[]],coins=[];

// ---- settling: our own step. A coin comes to rest on whatever it lands on by finding the lowest pose that clears every surface under it;
// on a slope too steep to hold, it slides downhill and tries again
function supportAt(x,z,skip){let h=0;for(const c of coins){if(c.st<1||c===skip)continue;const dx=x-c.px,dz=z-c.pz;if(dx*dx+dz*dz<c.r*c.r){const y=c.py+c.t*.5-(c.n.x*dx+c.n.z*dz)/c.n.y;if(y>h)h=y}}return h}
const RIM=[...Array(12)].map((_,i)=>[Math.cos(i/12*6.2832)*.93,Math.sin(i/12*6.2832)*.93]).concat([[0,0],[.5,0],[-.5,0],[0,.5],[0,-.5]]);
function settle(x,z,r,self){let gx=0,gz=0,y0=0;
 for(let it=0;it<5;it++){const d=Math.hypot(x,z),lim=RIN-r-.0005;if(d>lim){x*=lim/d;z*=lim/d}
  const H=RIM.map(([u,v])=>supportAt(x+u*r,z+v*r,self));let best=1e9;
  for(let i=-6;i<=6;i++)for(let j=-6;j<=6;j++){const ax=i*.09,az=j*.09;if(ax*ax+az*az>.3)continue;let m=-1e9;for(let q=0;q<RIM.length;q++)m=Math.max(m,H[q]-(ax*RIM[q][0]+az*RIM[q][1])*r);if(m<best-1e-7){best=m;gx=ax;gz=az}}
  y0=best;const sl=Math.hypot(gx,gz);if(sl>.46&&it<4){x-=gx/sl*r*.4;z-=gz/sl*r*.4;continue}break}
 return{x,z,y0,n:new THREE.Vector3(-gx,1,-gz).normalize()}}
const UP=new THREE.Vector3(0,1,0),X=new THREE.Vector3(1,0,0),M4=new THREE.Matrix4(),V1=new THREE.Vector3(),Q1=new THREE.Quaternion(),Q2=new THREE.Quaternion(),ONE=new THREE.Vector3(1,1,1);
function restPose(c,st){c.px=st.x;c.pz=st.z;c.n=st.n;c.py=st.y0+c.t*.5/st.n.y;
 c.rq=new THREE.Quaternion().setFromUnitVectors(UP,st.n).multiply(Q1.setFromAxisAngle(UP,c.yaw)).multiply(Q2.setFromAxisAngle(X,c.flip?Math.PI:0))}
function put(c){meshes[c.k].setMatrixAt(c.i,M4.compose(V1.set(c.x,c.y,c.z),c.q,ONE));meshes[c.k].instanceMatrix.needsUpdate=true}
function newCoin(k){if(coins.length>=MAX){let top=null;for(const c of coins)if(c.st===2&&(!top||c.py>top.py))top=c;if(!top)return null;coins.splice(coins.indexOf(top),1);k=top.k;const c={k,i:top.i};coins.push(c);return c}
 const c={k,i:slots[k].length};slots[k].push(c);meshes[k].count=slots[k].length;coins.push(c);return c}

// ---- sound, opt-in: the ring of steel coins, the clink of the jar's glass base, a coin running down on its rim
let ac=null,master=null,sndOn=false;const sndB=document.getElementById('snd');
sndB.onclick=()=>{if(!ac){try{ac=new AudioContext();master=ac.createGain();master.connect(ac.destination)}catch(e){return}}sndOn=!sndOn;ac.resume();master.gain.value=sndOn?1:0;sndB.textContent='Sound · '+(sndOn?'on':'off')};
function tone(fr,amp,dur,parts){if(!sndOn)return;const t=ac.currentTime,g=ac.createGain();g.connect(master);g.gain.setValueAtTime(amp,t);g.gain.exponentialRampToValueAtTime(.0003,t+dur);
 for(const[m,a]of parts){const o=ac.createOscillator(),og=ac.createGain();o.frequency.value=fr*m;og.gain.value=a;o.connect(og);og.connect(g);o.start(t);o.stop(t+dur)}}
function click(amp,hp=3000){if(!sndOn)return;const t=ac.currentTime,b=ac.createBuffer(1,ac.sampleRate*.03,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/(ac.sampleRate*.004));
 const s0=ac.createBufferSource(),fl=ac.createBiquadFilter(),g=ac.createGain();s0.buffer=b;fl.type='highpass';fl.frequency.value=hp;g.gain.value=amp;s0.connect(fl);fl.connect(g);g.connect(master);s0.start(t)}
const ring=(k,v)=>tone([3350,3020,2760][k]*(.97+rnd()*.06),Math.min(.18,v*.6),.9,[[1,1],[2.71,.45],[5.18,.25],[8.6,.12]]);
const clink=v=>tone(1850+rnd()*300,Math.min(.2,v*.7),1.4,[[1,1],[2.32,.6],[4.25,.3]]);

// ---- dropping: a coin enters through the mouth and falls toward the lens, tumbling and flashing in the daylight.
// The fall runs at about half speed, so the eye can follow it growing to the size of the screen
const G=2.3;let total=0,landed=0;
function drop(k,x,z,vx=0,vz=0,spin=1){const c=newCoin(k);if(!c)return;const T=TY[c.k];Object.assign(c,{r:T.r,t:T.t,v:T.v,x,y:TOP+.05,z,vx,vy:-.15,vz,st:0,flip:rnd()<.5,yaw:rnd()*6.28,
 q:new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd()*6,rnd()*6,rnd()*6)),w:new THREE.Vector3(rnd()-.5,0,rnd()-.5).normalize().multiplyScalar(7+rnd()*9)});put(c)}
const sumEl=document.getElementById('sum');let etchDirty=true;
function land(c){const st=settle(c.x,c.z,c.r,c);restPose(c,st);c.st=1;c.tw=0;c.sx=c.x;c.sz=c.z;c.edge=rnd()<.16;c.a0=c.edge?1.22:.1+.38*rnd();c.ph=rnd()*6.28;c.lastPh=0;
 const v=Math.min(1,-c.vy/1.1);if(sndOn){st.y0<.0005?(clink(v),ring(c.k,v*.7)):(click(v*.35),ring(c.k,v*.5))}
 total+=c.v;landed++;etchDirty=true;sumEl.textContent='Saved while you were reading: '+total+' taka'}
function preload(n){for(let j=0;j<n;j++){const k=[0,1,1,2,2][Math.floor(rnd()*5)],c=newCoin(k);if(!c)break;const T=TY[c.k];Object.assign(c,{r:T.r,t:T.t,v:T.v,flip:rnd()<.5,yaw:rnd()*6.28,st:2});
 const a=rnd()*6.28,d=Math.sqrt(rnd())*(RIN-c.r),st=settle(Math.cos(a)*d,Math.sin(a)*d,c.r,c);restPose(c,st);c.x=c.px;c.y=c.py;c.z=c.pz;c.q=c.rq.clone();put(c);total+=c.v;landed++}}
if(QS.has('fill'))preload(+QS.get('fill')||120);

// ---- the base: 12 mm of green glass between the lens and everything. It carries the etched number, a mould seam that doubles what sits on it,
// one seed bubble, and the faint glow of daylight piped through its edge
const D=BASE-EYE,hH=D*Math.tan(cam.fov*Math.PI/360),hW=hH*cam.aspect,EX=hW*1.08,EZ=hH*1.12;
const etch=document.createElement('canvas');etch.width=1024;etch.height=Math.round(1024*EZ/EX);const eg=etch.getContext('2d'),etchT=new THREE.CanvasTexture(etch);
function drawEtch(){const W=etch.width,H=etch.height,u=W/(2*EX);eg.fillStyle='#000';eg.fillRect(0,0,W,H);eg.fillStyle='#fff';eg.textAlign='center';eg.textBaseline='alphabetic';
 const cy=H*(phone?.8:.86),big=(phone?.0105:.0112)*u;eg.font=`400 ${big}px 'Tiro Bangla'`;eg.fillText('৳ '+bn(total),W/2,cy);
 eg.font=`600 ${(phone?.0016:.0019)*u}px 'Switzer'`;if('letterSpacing' in eg)eg.letterSpacing=`${.0003*u}px`;
 if(phone){eg.fillText('SAVED WHILE YOU',W/2,cy-big*1.2);eg.fillText('WERE READING',W/2,cy-big*.95)}else eg.fillText('SAVED WHILE YOU WERE READING',W/2,cy-big*.98);etchT.needsUpdate=true;etchDirty=false}
const BUB=new THREE.Vector2(CX+(phone?.0045:.017),CZ+(phone?.012:.006));
const baseU={tDiffuse:{value:null},uIP:{value:cam.projectionMatrixInverse},uCW:{value:cam.matrixWorld},uE:{value:etchT},uEA:{value:0},uGlow:{value:1},uR:{value:new THREE.Vector2()},uT:{value:0}};
const basePass=new ShaderPass({uniforms:baseU,vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform sampler2D tDiffuse,uE;uniform mat4 uIP,uCW;uniform float uEA,uGlow,uT;uniform vec2 uR;varying vec2 vUv;
 float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hs(i),hs(i+vec2(1,0)),f.x),mix(hs(i+vec2(0,1)),hs(i+vec2(1,1)),f.x),f.y);}
 vec3 sc(vec2 u){return texture2D(tDiffuse,clamp(u,.001,.999)).rgb;}
 void main(){vec4 v=uIP*vec4(vUv*2.-1.,1.,1.);v/=v.w;vec3 d=normalize((uCW*vec4(v.xyz,0.)).xyz);vec3 o=(uCW*vec4(0,0,0,1)).xyz;
  vec2 p=(o+d*((${f(BASE)}-o.y)/d.y)).xz;
  vec2 w=vec2(vn(p*160.)-.5,vn(p*160.+17.)-.5)+.35*vec2(vn(p*700.)-.5,vn(p*700.+9.)-.5);
  vec2 uv=vUv+w*.0012;
  vec3 c=sc(uv);
  vec2 nS=normalize(vec2(.94,.34));float sd=dot(p-vec2(${f(CX+.024)},${f(CZ)}),nS);float seam=1.-smoothstep(.00045,.0011,abs(sd));
  vec2 sh=nS*vec2(uR.y/uR.x,1.)*.018;c=mix(c,.5*(sc(uv+sh)+sc(uv-sh)),seam);c+=vec3(.5,.62,.52)*(smoothstep(.0011,.0008,abs(sd))-smoothstep(.0008,.0005,abs(sd)))*.04;
  vec2 bq=(p-vec2(${f(BUB.x)},${f(BUB.y)}))/vec2(.0012,.00065);float bl=length(bq);
  if(bl<1.){c=sc(uv-bq*.012*vec2(.6,1.))*.85;c+=vec3(.9,1.,.92)*smoothstep(.7,.93,bl)*.55;c*=1.-smoothstep(.93,1.,bl)*.6;c+=vec3(1.)*smoothstep(.25,0.,length(bq-vec2(-.35,.35)))*.8;}
  vec2 eu=vec2((p.x-${f(CX)}+${f(EX)})/${f(2*EX)},(p.y-${f(CZ)}+${f(EZ)})/${f(2*EZ)});float fr=texture2D(uE,eu).r*uEA;
  vec2 ex=vec2(1.6/uR.x,1.6/uR.y)*${f(2*EX)}/${f(2*EX)};float nb=0.;for(int i=0;i<6;i++){float a=float(i)*1.047;nb=max(nb,texture2D(uE,eu+vec2(cos(a),sin(a))*vec2(.0034,.0034*${f(EX/EZ)})).r);}
  c*=1.-clamp(nb*uEA-fr,0.,1.)*.9;
  if(fr>.001){vec3 b=vec3(0.);for(int i=0;i<8;i++){float a=float(i)*.785;b+=sc(uv+vec2(cos(a),sin(a))*7./uR);}b/=8.;
   c=mix(c,b*.12+vec3(.95,.955,.94)*(.8+.25*uGlow),fr);}
  vec2 p0=(o+d*(-o.y/d.y)).xz;float rr=length(p0),hl=smoothstep(${f(RIN-.011)},${f(RIN-.001)},rr);
  if(hl>0.){vec2 dir=p0/max(rr,1e-5);vec3 hc=sc(vUv-dir*vec2(uR.y/uR.x,1.)*hl*.06)*vec3(.35,.6,.42);c=mix(c,hc,hl);c+=vec3(.3,.45,.34)*smoothstep(${f(RIN-.0025)},${f(RIN-.001)},rr)*smoothstep(${f(RIN+.001)},${f(RIN-.001)},rr);}
  c=mix(c,vec3(.016,.02,.017),smoothstep(${f(RIN-.0005)},${f(RIN+.0025)},rr));
  c*=vec3(.96,.985,.965);c+=vec3(.03,.034,.03)*uGlow*(1.-hl); // thin soda glass tints faintly; only the thick heel is truly green
  gl_FragColor=vec4(c,1.);}`});

// ---- the lens and grade: daylight, the glass tinting it only faintly (Anwar: no green wash; the coins are steel). Fine grain; halation where coin edges cut the sky
const comp=new EffectComposer(R);comp.addPass(new RenderPass(S,cam));comp.addPass(basePass);
const BU=basePass.uniforms;BU.uE.value=etchT;BU.uIP.value=cam.projectionMatrixInverse;BU.uCW.value=cam.matrixWorld;
const film=new ShaderPass({uniforms:{tDiffuse:{value:null},uT:{value:0},uF:{value:0},uR:{value:new THREE.Vector2()}},
 vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform sampler2D tDiffuse;uniform float uT,uF;uniform vec2 uR;varying vec2 vUv;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;vec2 px=1./uR;vec3 b=vec3(0.);for(int i=0;i<16;i++){float a=float(i)*.3927;b+=texture2D(tDiffuse,vUv+vec2(cos(a),sin(a))*px*(7.+mod(float(i),2.)*11.)).rgb;}b/=16.;
  c+=max(b-.8,0.)*vec3(1.,.66,.36)*.55;
  float l=dot(c,vec3(.2126,.7152,.0722));c=mix(c*vec3(.95,.975,1.),c*vec3(1.06,1.,.9),smoothstep(.04,.8,l));
  vec2 q=vUv-.5;c*=1.-dot(q,q)*1.2;c+=(h(floor(vUv*uR/1.4)+fract(uT)*61.)-.5)*.028*(.3+l);gl_FragColor=vec4(c*uF,1.);}`});
comp.addPass(film);comp.addPass(new OutputPass());
// the render: contact shading where surfaces meet, glow only on true light sources, tuned to this world's scale and light
lux(R,S,cam,comp,{hemi:.75,ao:{radius:.012,thickness:.02,protect:[.2,.8]},bloom:{strength:.2,radius:.5,threshold:2}});
function size(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);comp.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix();film.uniforms.uR.value.set(w*DPR,h*DPR);BU.uR.value.set(w*DPR,h*DPR)}
let lastW=innerWidth;addEventListener('resize',()=>{if(!phone||Math.abs(innerWidth-lastW)>innerWidth*.1){lastW=innerWidth;size()}});size();

// ---- the hand: a tap drops a coin toward the spot you touched; a sideways drag throws one against the glass
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,-1,0),.004),hitP=new THREE.Vector3();
function floorAt(cx,cy){ndc.set(cx/innerWidth*2-1,-(cy/innerHeight)*2+1);ray.setFromCamera(ndc,cam);if(!ray.ray.intersectPlane(plane,hitP))return[0,0];const d=Math.hypot(hitP.x,hitP.z),L=RIN-.014;return d>L?[hitP.x*L/d,hitP.z*L/d]:[hitP.x,hitP.z]}
const pick=()=>{const u=rnd();return u<.3?0:u<.62?1:2};
let down=null,lastInput=0;
cv.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,t:performance.now()};lastInput=performance.now()});
cv.addEventListener('pointerup',e=>{if(!down)return;const dx=e.clientX-down.x,dy=e.clientY-down.y,dt=Math.max(.05,(performance.now()-down.t)/1000);
 const[x,z]=floorAt(e.clientX,e.clientY),a=rnd()*6.28,r0=rnd()*.02;
 if(Math.hypot(dx,dy)<10){const T=.36;drop(pick(),Math.cos(a)*r0,Math.sin(a)*r0,(x-Math.cos(a)*r0)/T,(z-Math.sin(a)*r0)/T)}
 else{const k=.00025/dt;drop(pick(),Math.cos(a)*r0,Math.sin(a)*r0,Math.max(-.6,Math.min(.6,dx*k)),Math.max(-.6,Math.min(.6,-dy*k)))}
 down=null;hint.style.opacity=0});
cv.addEventListener('pointercancel',()=>down=null);

// ---- by itself: the change from the day's payments, rounded up and dropped in. The first seven taka arrive in the first ten seconds
const EV=[['Tea stall, Shyamoli',[2,1]],['Pharmacy',[1,0]],['Rickshaw',[2,2]]],EVV=[7,3,10];
let evI=0,nextEv=+(QS.get('first')||2.4),ticks=[];const tick=document.getElementById('tick'),hint=document.getElementById('hint');
function event(t){const [lab,ks]=EV[evI%3],sum=EVV[evI%3],first=evI===0;
 ks.forEach((k,j)=>ticks.push([t+(first?j*3.8:j*.75),()=>{if(first&&j===0){const tx=CX+TY[k].r*.95,tz=CZ-TY[k].r*.45;drop(k,0,0,tx/.4,tz/.4);return}
  const a=rnd()*6.28,r0=rnd()*.02,b=rnd()*6.28,v=.03+rnd()*.09;drop(k,Math.cos(a)*r0,Math.sin(a)*r0,Math.cos(b)*v,Math.sin(b)*v)}]));
 ticks.push([t+(first?1.6:0),()=>{tick.innerHTML=`${lab} <span>+ ৳ ${bn(sum)}</span>`;tick.classList.add('on')}],[t+(first?7.5:5),()=>tick.classList.remove('on')]);
 evI++;nextEv=t+(first?11:9+rnd()*4)}

// ---- scroll pours: the months go by in the time it takes to read three lines
const drv=document.getElementById('drv'),ov=document.getElementById('ov'),bnEl=document.getElementById('bn'),lead=document.getElementById('lead'),beats=[...document.querySelectorAll('.beat')],scrim=document.getElementById('scrim');
let poured=0,pourT=0;
const nrm=new THREE.Vector3(),t0=performance.now();let last=t0;
window.__py={coins,cam,BU,S,get total(){return total},drop,preload,meshes};
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;const t=(now-t0)/1000;
 const FZ=QS.has('fally')&&coins.some(c=>c.st===0&&c.y<+QS.get('fally'));
 const sp=Math.max(0,Math.min(1,scrollY/Math.max(1,drv.offsetHeight-innerHeight)));
 if(scrollY>drv.offsetHeight+innerHeight*.2)return;
 while(t>=nextEv)event(nextEv);
 ticks=ticks.filter(([tt,fn])=>{if(t>=tt){fn();return false}return true});
 const want=Math.floor(sp*POUR);pourT-=dt;while(poured<want&&pourT<=0){const a=rnd()*6.28,r0=rnd()*.03;drop(pick(),Math.cos(a)*r0,Math.sin(a)*r0,(rnd()-.5)*.14,(rnd()-.5)*.14);poured++;pourT+=.05}
 for(const c of coins){if(c.st===2||FZ)continue;
  if(c.st===0){c.vy-=G*dt;c.x+=c.vx*dt;c.y+=c.vy*dt;c.z+=c.vz*dt;c.w.multiplyScalar(Math.exp(-dt*.25));const wl=c.w.length();c.q.premultiply(Q1.setFromAxisAngle(V1.copy(c.w).divideScalar(wl||1),wl*dt));
   const lim=(c.y>.19?MOUTH:RIN)-c.r*.8,dd=Math.hypot(c.x,c.z);if(dd>lim){const nx=c.x/dd,nz=c.z/dd,vn=c.vx*nx+c.vz*nz;if(vn>0){c.vx-=1.55*vn*nx;c.vz-=1.55*vn*nz;if(sndOn)click(Math.min(.25,vn*.6),2400)}c.x=nx*lim;c.z=nz*lim}
   nrm.set(0,1,0).applyQuaternion(c.q);const low=c.y-(c.r*Math.sqrt(Math.max(0,1-nrm.y*nrm.y))+c.t*.5*Math.abs(nrm.y));
   if(c.vy<0&&low<=supportAt(c.x,c.z,c))land(c)}
  if(c.st===1){c.tw+=dt;const Tw=c.edge?1.55:.55+c.a0*1.6;let a=c.edge?(c.tw<.6?c.a0-.06*Math.sin(c.tw*11):c.a0*Math.exp(-(c.tw-.6)*5)):c.a0*Math.exp(-c.tw*3.4);a*=1-sm(Tw*.75,Tw,c.tw);
   c.ph+=dt*(c.edge&&c.tw<.6?1.5:9+34*(1-a/c.a0));if(sndOn&&Math.floor(c.ph/Math.PI)!==c.lastPh&&a>.02){c.lastPh=Math.floor(c.ph/Math.PI);click(.03+a*.1,4000)}
   const sl=sm(0,.14,c.tw);c.x=c.sx+(c.px-c.sx)*sl;c.z=c.sz+(c.pz-c.sz)*sl;c.y=c.py+c.r*Math.sin(a)*.92;
   c.q.copy(c.rq).premultiply(Q1.setFromAxisAngle(V1.set(Math.cos(c.ph),0,Math.sin(c.ph)),a));
   if(c.tw>=Tw){c.st=2;c.x=c.px;c.y=c.py;c.z=c.pz;c.q.copy(c.rq)}}
  put(c)}
 if(etchDirty)drawEtch();
 const fill=sm(0,1,landed/(POUR*.9));
 BU.uEA.value=sm(4,5.2,t)*(1-.25*fill);BU.uGlow.value=1-.55*fill;BU.uT.value=t;
 const day=1-.45*fill;sky.material.uniforms.uDay.value=day;wallU.uDay.value=day;sun.intensity=3.2*(1-.2*fill);glow.intensity=1.25*(1-.5*fill);hemi.intensity=.55*(1-.4*fill);
 const br=Math.sin(t*.9)*.0004;cam.position.set(CX+br*.5,EYE+br,CZ);cam.lookAt(LOOK);
 film.uniforms.uT.value=t;film.uniforms.uF.value=sm(0,1.4,t);
 scrim.style.opacity=bnEl.style.opacity=lead.style.opacity=1-sm(.03,.09,sp);
 for(const b of beats)b.classList.toggle('on',sp>+b.dataset.a&&sp<+b.dataset.b);
 hint.style.opacity=sp>.05?0:hint.style.opacity;
 ov.classList.toggle('off',sp>.97);
 comp.render()}
drawEtch();requestAnimationFrame(frame);
