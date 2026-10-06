// TRIAL COPY of sites/borsha-scene.js for sites/lift-trial/borsha.html (P71 fix round two). The original is untouched.
// Four changes: the frame no longer stops below the first screen; the page writes the price (wr.page); the fog, oil and drops can ride with the page (ox, shift); the four sodium discs are gone, one bulb and one flame remain. Also: a running drop leaves fewer, uneven beads behind it, not a chain.
// Borsha: a tea stall in Lalbagh, July, night. You sit on the bench; at arm's length the display glass is fogged, the bulb behind it a soft disc.
// Units are metres. You at (0,1.05,0) looking down -z. The pane stands at z -.5. Behind it the back counter, the kettle on a kerosene stove,
// the jars, the bulb, the man with the kettle (his back to you, always), and past the open back of the stall the street in the rain.
// The world renders into a target with depth; the pane is a real plane in front of the lens that reads that target: fog, drops, paint, focus.
import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
await document.fonts.load("400 80px 'Tiro Bangla'").catch(()=>{});

const cv=document.getElementById('gl'),phone=innerWidth<760,DPR=Math.min(devicePixelRatio,phone?1.5:1.75),QS=new URLSearchParams(location.search);
const R=new THREE.WebGLRenderer({canvas:cv,antialias:false,powerPreference:'high-performance'});
R.setPixelRatio(DPR);R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1;
const S=new THREE.Scene();S.background=new THREE.Color().setRGB(.006,.006,.008);
let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647,Rn=(a,b)=>a+Math.random()*(b-a);
const sm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};
const cnv=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c};
const tex=(c,srgb=true)=>{const t=new THREE.CanvasTexture(c);if(srgb)t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t};

// ---- light: one bare bulb at 2700 K behind the glass, the sodium street at 2000 K through the rain
const BULB=new THREE.Vector3(-.1,1.52,-1.55);
const bulbL=new THREE.PointLight(new THREE.Color().setRGB(1,.6,.28),0,6,2);bulbL.position.copy(BULB);bulbL.castShadow=false;S.add(bulbL);
const bulbM=new THREE.MeshBasicMaterial({color:new THREE.Color(0,0,0)});const bulb=new THREE.Mesh(new THREE.SphereGeometry(.03,16,12),bulbM);bulb.position.copy(BULB);S.add(bulb);
{const w=new THREE.Mesh(new THREE.CylinderGeometry(.003,.003,.6,4),new THREE.MeshBasicMaterial({color:0x080706}));w.position.set(BULB.x,BULB.y+.33,BULB.z);S.add(w);
 const h=new THREE.Mesh(new THREE.CylinderGeometry(.014,.014,.035,10),new THREE.MeshStandardMaterial({color:0x2a2622,roughness:.6}));h.position.set(BULB.x,BULB.y+.04,BULB.z);S.add(h)}
const sod=new THREE.DirectionalLight(new THREE.Color().setRGB(1,.5,.16),.5);sod.position.set(-3,5,-12);S.add(sod);
S.add(new THREE.HemisphereLight(new THREE.Color().setRGB(.16,.19,.24),new THREE.Color().setRGB(.03,.02,.015),.35));
{const es=new THREE.Scene();es.background=new THREE.Color().setRGB(.01,.01,.012);const b=new THREE.Mesh(new THREE.SphereGeometry(.4,16,8),new THREE.MeshBasicMaterial({color:new THREE.Color().setRGB(9,5,2)}));b.position.set(-.3,1.4,-.6);es.add(b);
 const s=new THREE.Mesh(new THREE.PlaneGeometry(8,3),new THREE.MeshBasicMaterial({color:new THREE.Color().setRGB(.5,.25,.08),side:THREE.DoubleSide}));s.position.set(0,1,-6);es.add(s);
 const pm=new THREE.PMREMGenerator(R);S.environment=pm.fromScene(es,.03).texture;pm.dispose()}

// ---- the stall behind the glass: back counter, stove and kettle, jars, cups, posts, the man
const woodT=tex(cnv(512,128,(g,w,h)=>{g.fillStyle='#3a2616';g.fillRect(0,0,w,h);for(let i=0;i<70;i++){g.strokeStyle=`rgba(${rnd()<.5?20:110},${rnd()<.5?12:70},8,${.2+rnd()*.3})`;g.lineWidth=.5+rnd()*1.5;g.beginPath();const y=rnd()*h;g.moveTo(0,y);for(let x=0;x<=w;x+=20)g.lineTo(x,y+Math.sin(x*.03+i)*3);g.stroke()}
 for(let i=0;i<9;i++){g.fillStyle=`rgba(230,190,140,${.05+rnd()*.06})`;g.beginPath();g.ellipse(rnd()*w,rnd()*h,20+rnd()*40,6+rnd()*10,0,0,7);g.fill()}}));
const counter=new THREE.Mesh(new THREE.BoxGeometry(2.2,.06,.8),new THREE.MeshStandardMaterial({map:woodT,roughness:.42}));counter.position.set(0,.77,-1.7);S.add(counter);
const front=new THREE.Mesh(new THREE.BoxGeometry(2.2,.8,.03),new THREE.MeshStandardMaterial({color:0x1a120b,roughness:.8}));front.position.set(0,.37,-1.31);S.add(front);
const alu=new THREE.MeshStandardMaterial({color:0xd2d0cb,metalness:.62,roughness:.3,envMapIntensity:1.6});
const stove=new THREE.Group();{const b=new THREE.Mesh(new THREE.CylinderGeometry(.11,.13,.1,20),new THREE.MeshStandardMaterial({color:0x1d1b19,metalness:.6,roughness:.55}));b.position.y=.05;stove.add(b);
 const flame=new THREE.Mesh(new THREE.TorusGeometry(.06,.008,6,24),new THREE.MeshBasicMaterial({color:new THREE.Color().setRGB(.25,.45,1.6)}));flame.rotation.x=Math.PI/2;flame.position.y=.105;stove.add(flame);stove.userData.flame=flame}
stove.position.set(.28,.8,-1.55);S.add(stove);
const kettle=new THREE.Group();{const P=[[0,0],[.1,0],[.118,.02],[.122,.08],[.112,.14],[.085,.175],[.05,.19],[.03,.2],[0,.2]].map(([x,y])=>new THREE.Vector2(x,y));
 const body=new THREE.Mesh(new THREE.LatheGeometry(P,40),alu);kettle.add(body);
 const lid=new THREE.Mesh(new THREE.SphereGeometry(.014,10,8),new THREE.MeshStandardMaterial({color:0x151311,roughness:.5}));lid.position.y=.21;kettle.add(lid);
 const sp=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-.1,.05,0),new THREE.Vector3(-.17,.1,0),new THREE.Vector3(-.21,.17,0)]),12,.013,8),alu);kettle.add(sp);
 const hd=new THREE.Mesh(new THREE.TorusGeometry(.085,.007,6,24,Math.PI),new THREE.MeshStandardMaterial({color:0x1a1715,roughness:.6}));hd.position.y=.2;hd.rotation.y=Math.PI/2;kettle.add(hd)}
kettle.position.set(.28,.9,-1.55);kettle.rotation.y=-.35;S.add(kettle);
const SPOUT=new THREE.Vector3();
const jarM=new THREE.MeshStandardMaterial({color:0xcfd8d4,roughness:.08,metalness:0,transparent:true,opacity:.22,depthWrite:false});
const lidT=tex(cnv(128,32,(g,w,h)=>{g.fillStyle='#a3281c';g.fillRect(0,0,w,h);g.fillStyle='#e9e2d2';g.beginPath();g.ellipse(34,14,9,6,.4,0,7);g.fill();g.fillStyle='#2a1c14';g.beginPath();g.ellipse(35,14,5,3,.4,0,7);g.fill()}));
const biscT=tex(cnv(128,128,(g,w,h)=>{g.fillStyle='#6b3f1a';g.fillRect(0,0,w,h);for(let i=0;i<60;i++){g.fillStyle=`rgb(${190+rnd()*40|0},${130+rnd()*40|0},${60+rnd()*30|0})`;g.beginPath();g.ellipse(rnd()*w,rnd()*h,10,6,rnd()*3,0,7);g.fill()}}));
[[-.42,-1.45,.16],[-.6,-1.55,.2],[-.78,-1.44,.14]].forEach(([x,z,hh],i)=>{const j=new THREE.Group();const fill=new THREE.Mesh(new THREE.CylinderGeometry(.068,.068,hh*.7,20),new THREE.MeshStandardMaterial({map:biscT,roughness:.8}));fill.position.y=hh*.35;j.add(fill);
 const gl=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,hh,20,1,true),jarM);gl.position.y=hh/2;j.add(gl);
 const ld=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.025,20),[new THREE.MeshStandardMaterial({map:lidT,roughness:.3}),new THREE.MeshStandardMaterial({color:0xa3281c,roughness:.3}),new THREE.MeshStandardMaterial({color:0xa3281c,roughness:.3})]);ld.position.y=hh+.012;j.add(ld);
 j.position.set(x,.8,z);S.add(j)});
const teaM=new THREE.MeshStandardMaterial({color:0xc79a64,roughness:.35}),cupM=new THREE.MeshStandardMaterial({color:0xeef2ee,roughness:.05,transparent:true,opacity:.28,depthWrite:false});
[-.12,-.02,.08].forEach((x,i)=>{const t=new THREE.Mesh(new THREE.CylinderGeometry(.027,.022,.06,14),teaM);t.position.set(x,.83,-1.38-i*.01);S.add(t);const c=new THREE.Mesh(new THREE.CylinderGeometry(.031,.025,.085,14,1,true),cupM);c.position.set(x,.842,-1.38-i*.01);S.add(c)});
const postM=new THREE.MeshStandardMaterial({color:0x2b2118,roughness:.8});
for(const x of[-1.05,1.05]){const p=new THREE.Mesh(new THREE.CylinderGeometry(.035,.04,2.6,8),postM);p.position.set(x,1.3,-2.6);S.add(p)}
{const beam=new THREE.Mesh(new THREE.BoxGeometry(2.4,.08,.08),postM);beam.position.set(0,2.05,-2.6);S.add(beam)}
// the man with the kettle: a white vest, a checked lungi, his back to you; he never turns
const man=new THREE.Group();{const skin=new THREE.MeshStandardMaterial({color:0x4a3324,roughness:.7}),vest=new THREE.MeshStandardMaterial({color:0xa8a296,roughness:.9});
 const lungiT=tex(cnv(128,128,(g,w,h)=>{g.fillStyle='#1f3b5c';g.fillRect(0,0,w,h);g.fillStyle='rgba(180,40,40,.55)';for(let x=0;x<w;x+=32)g.fillRect(x,0,8,h);for(let y=0;y<h;y+=32)g.fillRect(0,y,w,8);g.fillStyle='rgba(230,230,210,.3)';for(let x=12;x<w;x+=32)g.fillRect(x,0,2,h)}));lungiT.wrapS=lungiT.wrapT=THREE.RepeatWrapping;lungiT.repeat.set(3,2);
 const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.155,.34,6,16),vest);torso.scale.set(1.25,1,.68);torso.position.y=1.27;man.add(torso);
 const neck=new THREE.Mesh(new THREE.CylinderGeometry(.05,.06,.1,10),skin);neck.position.y=1.6;man.add(neck);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.105,20,14),new THREE.MeshStandardMaterial({color:0x14100d,roughness:.7}));head.scale.set(1,1.12,1.05);head.position.y=1.74;man.add(head);
 for(const s of[-1,1]){const a=new THREE.Mesh(new THREE.CapsuleGeometry(.038,.42,4,10),skin);a.position.set(s*.25,1.2,.02);a.rotation.z=s*.08;man.add(a)}
 const lungi=new THREE.Mesh(new THREE.CylinderGeometry(.2,.24,.9,20),new THREE.MeshStandardMaterial({map:lungiT,roughness:.9}));lungi.position.y=.6;man.add(lungi)}
man.position.set(.7,0,-2.35);man.rotation.y=.12;S.add(man);
// steam off the spout, lit by the bulb
const puffT=tex(cnv(64,64,(g,w,h)=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,.55)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,w,h)}));
const puffs=[...Array(phone?18:32)].map(()=>{const m=new THREE.Sprite(new THREE.SpriteMaterial({map:puffT,color:new THREE.Color().setRGB(.55,.45,.36),transparent:true,depthWrite:false,opacity:0}));S.add(m);return{m,a:Math.random()*3}});

// ---- the street past the open back of the stall: the one generated plate, sodium lamps, and rain crossing their light
new THREE.TextureLoader().load('../img/borsha-stall.webp',t=>{t.colorSpace=THREE.SRGBColorSpace;t.repeat.set(.44,.8);t.offset.set(0,.2);
 const p=new THREE.Mesh(new THREE.PlaneGeometry(11,10),new THREE.MeshBasicMaterial({map:t,color:new THREE.Color().setRGB(.55,.5,.46),fog:false}));p.position.set(-.6,3.2,-12);S.add(p)});
const glowT=tex(cnv(64,64,(g,w,h)=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.25,'rgba(255,255,255,.35)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,w,h)}));
[].forEach(([x,y,z],i)=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowT,color:new THREE.Color().setRGB(3.2,1.6,.5),blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));s.position.set(x,y,z);s.scale.setScalar(1.6-i*.15);S.add(s)});
const RN=phone?220:620,rain=new THREE.InstancedMesh(new THREE.PlaneGeometry(.005,.32),new THREE.MeshBasicMaterial({color:new THREE.Color().setRGB(.9,.55,.25),transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false,opacity:.3}),RN);
const RD=[...Array(RN)].map(()=>({x:Rn(-4,4),y:Rn(0,5),z:Rn(-9,-3.1),v:Rn(7,9)}));rain.frustumCulled=false;S.add(rain);
const M4=new THREE.Matrix4(),QI=new THREE.Quaternion(),V=new THREE.Vector3(),ONE=new THREE.Vector3(1,1,1);

// ---- the camera: seated at bench height, 50 mm, a slow handheld breath
const cam=new THREE.PerspectiveCamera(phone?64:40,innerWidth/innerHeight,.05,60);cam.rotation.order='YXZ';const PITCH=.07;

// ---- the pane: a real plane at arm's length, sized to the frame; fog, finger oil, drops and paint live in its own coordinates
const PZ=-.5;let PW=1,PH=1;
const pane=new THREE.Mesh(new THREE.PlaneGeometry(1,1),null);const P=new THREE.Scene();P.add(pane);
const rt=new THREE.WebGLRenderTarget(4,4,{type:THREE.HalfFloatType,generateMipmaps:true,minFilter:THREE.LinearMipmapLinearFilter,depthTexture:new THREE.DepthTexture(4,4)});
const mc=document.createElement('canvas'),mx=mc.getContext('2d'),oc=document.createElement('canvas'),ox=oc.getContext('2d'),dc=document.createElement('canvas'),dx=dc.getContext('2d',{alpha:false});
const mT=new THREE.CanvasTexture(mc),oT=new THREE.CanvasTexture(oc),dT=new THREE.CanvasTexture(dc);
// the name, painted by the owner on his side of the glass, so from the bench it reads backwards
const nameC=document.createElement('canvas');
function drawName(){nameC.width=1024;nameC.height=Math.round(1024*H/W);const g=nameC.getContext('2d'),w=nameC.width,h=nameC.height,fs=Math.min(w*.22,h*.2),cx=w*(phone?.62:.78),cy=h*(phone?.8:.86);seed=11;
 g.clearRect(0,0,w,h);g.save();g.translate(cx,0);g.scale(-1,1);g.translate(-cx,0);g.font=`400 ${fs}px 'Tiro Bangla'`;g.textAlign='center';g.lineJoin='round';g.lineWidth=fs*.06;g.strokeStyle='#f1e4c8';g.strokeText('বর্ষা',cx,cy);g.fillStyle='#d9892b';g.fillText('বর্ষা',cx,cy);g.restore();
 g.globalCompositeOperation='destination-out';for(let i=0;i<500;i++){g.fillStyle=`rgba(0,0,0,${.3+rnd()*.7})`;g.fillRect(cx-fs*1.4+rnd()*fs*2.8,cy-fs*1.1+rnd()*fs*1.4,1+rnd()*4,1+rnd()*2)}g.globalCompositeOperation='source-over';if(typeof nT!=='undefined'){nT.dispose();nT.needsUpdate=true}}
const nT=tex(nameC);nT.generateMipmaps=false;nT.minFilter=THREE.LinearFilter;
const paneM=new THREE.ShaderMaterial({depthTest:false,depthWrite:false,uniforms:{tS:{value:rt.texture},tD:{value:rt.depthTexture},tM:{value:mT},tO:{value:oT},tDr:{value:dT},tN:{value:nT},uRes:{value:new THREE.Vector2()},uB:{value:new THREE.Vector2(.5,.7)},uWarm:{value:0},uT:{value:0},uNF:{value:new THREE.Vector2(cam.near,cam.far)},uAsp:{value:1}},
 vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform sampler2D tS,tD,tM,tO,tDr,tN;uniform vec2 uRes,uB,uNF;uniform float uWarm,uT,uAsp;varying vec2 vUv;
 float lin(float d){return uNF.x*uNF.y/(uNF.y-d*(uNF.y-uNF.x));}
 float hh(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 vec3 tap(vec2 uv,float lod){float r=exp2(lod)*1.25/uRes.y,a0=hh(gl_FragCoord.xy)*6.2832;vec3 c=textureLod(tS,uv,lod).rgb*.08;float wsum=.08;
  for(int i=0;i<12;i++){float fi=float(i)+.5,a=a0+fi*2.39996,rr=sqrt(fi/12.);vec2 o=vec2(cos(a),sin(a))*rr*r*2.2;c+=textureLod(tS,uv+o*vec2(1./uAsp,1.),max(0.,lod-.8)).rgb;wsum+=1.;}return c/wsum;}
 void main(){vec2 s=gl_FragCoord.xy/uRes;
  float clr=smoothstep(.04,.8,texture2D(tM,vUv).r),oil=texture2D(tO,vUv).r;
  vec4 dm=texture2D(tDr,vUv);float cov=dm.b;vec2 n=(dm.rg-.502)*2.;n.y=-n.y;
  float f=(1.-clr)*(1.-.42*oil);
  float z=lin(texture2D(tD,s).r),zf=mix(1.2,9.,clr);float coc=clamp(abs(1./z-1./zf)*1.9,0.,4.2);
  vec2 off=n*.045*cov;
  vec3 sharp=tap(s+off,coc*.9);vec3 foggy=tap(s+off*.5,5.2);
  float bd=length((s-uB)*vec2(uAsp,1.));float halo=exp(-bd*bd*9.)*uWarm,core=exp(-bd*bd*140.)*uWarm;
  vec3 veil=vec3(.62,.44,.28)*(.035+.5*halo+1.4*core)+vec3(.12,.13,.14)*.12;
  vec4 pn=texture2D(tN,vUv);vec3 paint=pn.rgb*(.06+.9*halo+.25)*vec3(1.,.9,.8);
  vec3 clear=mix(sharp,paint,pn.a*.92);
  vec3 fogged=mix(foggy*.5,paint*.3,pn.a*.12)+veil;
  vec3 c=mix(clear,fogged,f);
  vec3 N3=normalize(vec3(n,sqrt(max(.03,1.-dot(n,n)))));vec3 lens=mix(tap(s-n*vec2(.03/uAsp,.03),1.2)*1.25,foggy*.6+veil,f*.45);lens*=1.-.35*smoothstep(.6,1.,length(n));
  vec2 ld=normalize(vec2(uB.x-s.x,uB.y-s.y)+1e-4);lens+=vec3(1.,.8,.55)*pow(max(dot(N3,normalize(vec3(ld*.7,.6))),0.),28.)*(.4+uWarm);
  c=mix(c,lens,cov*(.55+.45*f));
  float top=smoothstep(.93,.985,vUv.y+.012*sin(vUv.x*9.+1.3)+.01*sin(vUv.x*23.));c=mix(c,vec3(.01,.012,.016),top*.96);
  gl_FragColor=vec4(c,1.);}`});
pane.material=paneM;pane.renderOrder=1;

// ---- the lens: "sodium through rain": amber highs, blue-grey mids, warm black; halation on the bulb; medium grain
const comp=new EffectComposer(R);comp.addPass(new RenderPass(P,cam));
const film=new ShaderPass({uniforms:{tDiffuse:{value:null},uT:{value:0},uF:{value:0},uR:{value:new THREE.Vector2()}},
 vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform sampler2D tDiffuse;uniform float uT,uF;uniform vec2 uR;varying vec2 vUv;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;vec2 px=1./uR;vec3 b=vec3(0.);for(int i=0;i<16;i++){float a=float(i)*.3927;b+=texture2D(tDiffuse,vUv+vec2(cos(a),sin(a))*px*(9.+mod(float(i),3.)*10.)).rgb;}b/=16.;
  c+=max(b-.6,0.)*vec3(1.,.5,.2)*.8;float l=dot(c,vec3(.2126,.7152,.0722));
  c=mix(c*vec3(.9,.98,1.08),c*vec3(1.1,.98,.78),smoothstep(.18,.75,l));c=max(c,vec3(.0105,.0098,.0085));
  vec2 q=vUv-.5;c*=1.-dot(q,q)*.8;c+=(h(floor(vUv*uR/1.6)+fract(uT)*61.)-.5)*.034*(.35+l);gl_FragColor=vec4(c*uF,1.);}`});
comp.addPass(film);comp.addPass(new OutputPass());

// ---- the glass simulation, in screen pixels mapped onto the pane: fog cleared by a finger, the oil it leaves, drops that grow, run and merge
let W=1,H=1,Kc=1,Sd=.5,drops=[],fogFill,seededW=0;
const SPR=cnv(64,64,(g)=>{const d=g.createImageData(64,64);for(let y=0;y<64;y++)for(let x=0;x<64;x++){const X=(x+.5-32)/31,Y=(y+.5-32)/31,r=Math.hypot(X,Y),i=(y*64+x)*4;if(r>1)continue;d.data[i]=128+127*X;d.data[i+1]=128+127*Y;d.data[i+2]=255;d.data[i+3]=255*Math.min(1,(1-r)*7)}g.putImageData(d,0,0)});
function add(x,y,r,big,vy=0){drops.push({x,y,r,big,vy,st:Rn(.3,1),last:y})}
function seedDrops(){drops=[];const k=phone?.5:1;for(let i=0,n=W*H/2600*k;i<n;i++)add(Rn(0,W),Rn(0,H),Rn(1.2,3.4),false);for(let i=0,n=W*H/40000*k;i<n;i++)add(Rn(0,W),Rn(0,H*.8),Rn(6,11),true)}
function size(){W=innerWidth;H=innerHeight;R.setSize(W,H,false);comp.setSize(W,H);cam.aspect=W/H;cam.updateProjectionMatrix();
 rt.setSize(Math.round(W*DPR),Math.round(H*DPR));film.uniforms.uR.value.set(W*DPR,H*DPR);paneM.uniforms.uRes.value.set(W*DPR,H*DPR);paneM.uniforms.uAsp.value=W/H;
 const d=-PZ;PH=2*d*Math.tan(cam.fov*Math.PI/360);PW=PH*cam.aspect;pane.scale.set(PW,PH,1);
 const fresh=Math.abs(W-seededW)>W*.1;
 if(fresh){mc.width=oc.width=512;mc.height=oc.height=Math.round(512*H/W);mx.fillStyle='#000';mx.fillRect(0,0,mc.width,mc.height);ox.fillStyle='#000';ox.fillRect(0,0,oc.width,oc.height)}
 Kc=mc.width/W;Sd=Math.min(.7,1000/W);dc.width=Math.round(W*Sd);dc.height=Math.round(H*Sd);
 // the fog comes back in steps big enough that an 8-bit canvas cannot round them away; fastest on the kettle side
 fogFill=mx.createLinearGradient(0,0,mc.width,0);fogFill.addColorStop(0,'rgba(0,0,0,.02)');fogFill.addColorStop(.5,'rgba(0,0,0,.032)');fogFill.addColorStop(1,'rgba(0,0,0,.065)');
 drawName();for(const t of[mT,oT,dT])t.dispose();
 if(fresh){seededW=W;seedDrops();wr.t0=null;wr.done=false;wr.anchor=null;wr.dist=0}}
// the pane rides with the lens and fills the frame exactly, so a screen pixel is a pane pixel

// ---- the wipe writes: your first stroke leaves tonight's price in Bangla numerals; if you wait, a finger writes it anyway
const wr={t0:null,done:false,anchor:null,dist:0,txt:'চা ১৫/-'};
function glyphs(x0,y0,fs,p,alpha,into){into.save();into.font=`400 ${fs}px 'Tiro Bangla'`;const tw=into.measureText(wr.txt).width;into.beginPath();into.rect(x0-12,0,(tw+24)*p,into.canvas.height);into.clip();
 into.globalAlpha=alpha;into.fillStyle=into.strokeStyle='#fff';into.lineWidth=fs*.045;into.lineJoin='round';into.shadowColor='#fff';into.shadowBlur=fs*.02;into.fillText(wr.txt,x0,y0);into.strokeText(wr.txt,x0,y0);into.restore();return tw}
function writing(t){if(wr.page)return;let p;
 if(wr.anchor){p=Math.min(1,wr.dist/(W*(phone?.9:.45)))}else{if(t<7)return;if(wr.t0===null)wr.t0=t;p=Math.min(1,(t-wr.t0)/2.6)}
 if(p<=0||wr.done&&p>=1&&wr.fin)return;
 const fs=mc.width*(phone?.19:.1),a=wr.anchor||[.14,phone?.36:.42],x0=Math.min(a[0],phone?.2:.55)*mc.width,y0=Math.max(a[1]*mc.height,fs*1.05);
 const tw=glyphs(x0,y0,fs,p,.5,mx);glyphs(x0,y0,fs,p,.08,ox);
 if(p>=1&&!wr.done){wr.done=true;wr.fin=true;for(let i=0;i<4;i++)add((x0+Rn(.05,.95)*tw)/Kc,y0/Kc+Rn(0,fs*.15)/Kc,Rn(4.5,6.5),true,30)}}
let last=null,strokes=0;
function brush(cx,cy){const X=cx*Kc,Y=cy*Kc,rad=Math.min(80,Math.max(30,W*.055))*Kc;
 if(!wr.anchor&&!wr.done&&wr.t0===null&&strokes===0){wr.anchor=[cx/W,cy/H]}
 if(last)wr.dist+=Math.hypot(X-last[0],Y-last[1])/Kc;strokes++;
 const n=last?Math.ceil(Math.hypot(X-last[0],Y-last[1])/3)+1:1;
 for(let i=0;i<n;i++){const qx=last?last[0]+(X-last[0])*i/n:X,qy=last?last[1]+(Y-last[1])*i/n:Y;const g=mx.createRadialGradient(qx,qy,0,qx,qy,rad);g.addColorStop(0,'rgba(255,255,255,.85)');g.addColorStop(1,'rgba(255,255,255,0)');mx.fillStyle=g;mx.fillRect(qx-rad,qy-rad,rad*2,rad*2);
  ox.fillStyle='rgba(255,255,255,.012)';ox.beginPath();ox.arc(qx,qy,rad*.55,0,7);ox.fill()}
 last=[X,Y];const cut=rad/Kc*.75;for(const d of drops)if(Math.hypot(d.x-cx,d.y-cy)<cut)d.dead=true}
cv.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'||e.buttons)brush(e.clientX,e.clientY)});cv.addEventListener('pointerdown',e=>{last=null;brush(e.clientX,e.clientY)});
cv.addEventListener('pointerleave',()=>last=null);cv.addEventListener('pointerup',()=>last=null);
function step(dt){const area=W*H,k=phone?.5:1;if(Math.random()<area/320000*dt*k)add(Rn(0,W),Rn(-20,H*.2),Rn(5,9),true);
 for(let n=area/50000*dt*k;n>0;n--)if(Math.random()<n)add(Rn(0,W),Rn(0,H),Rn(1.3,3.8),false);
 mx.strokeStyle='rgba(255,255,255,.28)';mx.lineCap='round';
 for(const d of drops){if(!d.big||d.dead)continue;
  if(d.vy===0){d.r+=dt*Rn(0,.3);if(d.r>10&&Math.random()<dt*d.st*1.4)d.vy=16;continue}
  const y0=d.y,x0=d.x;d.vy=Math.min(d.vy+dt*d.r*55,d.r*24);d.y+=d.vy*dt;d.x+=Math.sin(d.y*.045+d.st*9)*dt*14;
  mx.lineWidth=d.r*1.2*Kc;mx.beginPath();mx.moveTo(x0*Kc,y0*Kc);mx.lineTo(d.x*Kc,d.y*Kc);mx.stroke();
  if(d.y-d.last>d.r*1.7){d.last=d.y;if(Math.random()<.42){add(d.x+Rn(-2.6,2.6),d.y-d.r*Rn(1.1,2.2),Math.max(.8,d.r*Rn(.07,.3)),false);d.r=Math.max(3.5,d.r*.985)}}
  for(const e of drops){if(e===d||e.dead||e.y<d.y-d.r*.2)continue;if(Math.hypot(e.x-d.x,e.y-d.y)<d.r+e.r*.7){d.r=Math.min(18,Math.hypot(d.r,e.r));e.dead=true}}
  if(d.y>H+d.r*3)d.dead=true}
 drops=drops.filter(d=>!d.dead);let small=0;for(const d of drops)if(!d.big)small++;if(small>area/1000*k)drops.splice(drops.findIndex(d=>!d.big),1)}
function drawDrops(){dx.fillStyle='#808000';dx.fillRect(0,0,dc.width,dc.height);for(const d of drops){const r=d.r*Sd,st=d.vy>0?1+Math.min(.45,d.vy/420):1.08;dx.drawImage(SPR,d.x*Sd-r,d.y*Sd-r*st*.92,2*r,2*r*st)}}
addEventListener('resize',()=>{if(!phone||Math.abs(innerWidth-W)>innerWidth*.1)size()});size();

// ---- sound, opt-in: rain on the tarpaulin, and the kettle at a rolling boil
let ac=null,rg=null;const sndB=document.getElementById('snd');
sndB.onclick=()=>{if(!ac){try{ac=new AudioContext()}catch(e){return}const noise=(sec,fn)=>{const b=ac.createBuffer(1,ac.sampleRate*sec,ac.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<d.length;i++){l=fn(l,i);d[i]=l}const s=ac.createBufferSource();s.buffer=b;s.loop=true;s.start();return s};
 rg=ac.createGain();rg.gain.value=0;rg.connect(ac.destination);
 const rs=noise(2,(l)=>(l+.02*(Math.random()*2-1))/1.02*1+(Math.random()<.0008?(Math.random()*2-1)*.6:0)),hp=ac.createBiquadFilter();hp.type='highpass';hp.frequency.value=240;const lp=ac.createBiquadFilter();lp.frequency.value=2800;const g1=ac.createGain();g1.gain.value=3;rs.connect(hp);hp.connect(lp);lp.connect(g1);g1.connect(rg);
 const ks=noise(3,(l,i)=>Math.random()<.004?(Math.random()*2-1):l*.94),bp=ac.createBiquadFilter();bp.type='bandpass';bp.frequency.value=900;bp.Q.value=1.2;const g2=ac.createGain();g2.gain.value=.5;const pn=ac.createStereoPanner();pn.pan.value=.35;ks.connect(bp);bp.connect(g2);g2.connect(pn);pn.connect(rg)}
 const on=rg.gain.value<.1;ac.resume();rg.gain.setTargetAtTime(on?.5:0,ac.currentTime,.4);sndB.textContent='Rain and kettle · '+(on?'on':'off')};

// ---- the frame
window.__bs={cam,mx,ox,wr,brush,drops,shift(dy){const k=phone?.5:1,a=Math.min(H,Math.abs(dy));for(const d of drops){d.y-=dy;d.last-=dy;if(d.y<-80||d.y>H+80)d.dead=true}for(let n=W*a/2600*k;n>0;n--)if(Math.random()<n)add(Rn(0,W),dy>0?H-Rn(0,a):Rn(0,a),Rn(1.2,3.4),false)}};
if(QS.has('write'))wr.t0=-99;
const CLEAR=QS.has('clear'),FOGX=QS.has('late')?40:1;let fogAcc=0;let frames=0,steps=0;window.__bs.st=()=>({fogAcc,FOGX,frames,steps});
const t0=performance.now();let lastT=t0;const BP=new THREE.Vector3();
function frame(now){requestAnimationFrame(frame);frames++;const B=window.__bs;
 // P71 trial: the street keeps drawing behind the whole pane. Below the first screen it idles at a third of the frame rate, full rate while the page moves, and stops where the wall covers it.
 if(B.off||scrollY>innerHeight*1.05&&frames%3&&now-(B.mv||0)>320)return;const dt=Math.min(.05,(now-lastT)/1000);lastT=now;const t=(now-t0)/1000;
 cam.position.set(Math.sin(t*.53)*.0016,1.05+Math.sin(t*.9+1)*.0013,0);cam.rotation.set(PITCH+Math.sin(t*.41)*.0012,Math.sin(t*.33)*.0015,0);cam.updateMatrixWorld();
 pane.position.copy(cam.position).add(V.set(0,0,PZ).applyQuaternion(cam.quaternion));pane.quaternion.copy(cam.quaternion);
 const warm=sm(2.6,7,t)*(1+Math.sin(t*23)*.012*Math.sin(t*1.7));bulbL.intensity=2.4*warm;bulbM.color.setRGB(40*warm,24*warm,9*warm);paneM.uniforms.uWarm.value=warm;
 stove.userData.flame.scale.setScalar(1+Math.sin(t*31)*.04);
 kettle.updateMatrixWorld(true);SPOUT.set(-.21,.17,0).applyMatrix4(kettle.matrixWorld);
 for(const p of puffs){p.a+=dt*.45;if(p.a>1){p.a=0}const a=p.a;p.m.position.set(SPOUT.x-a*.06+Math.sin(a*6+p.m.id)*.02,SPOUT.y+a*.42,SPOUT.z+a*.05);p.m.scale.setScalar(.04+a*.22);p.m.material.opacity=Math.sin(a*Math.PI)*.35*(.4+.6*warm)}
 for(let i=0;i<RN;i++){const d=RD[i];d.y-=d.v*dt;if(d.y<0)d.y+=5;rain.setMatrixAt(i,M4.compose(V.set(d.x,d.y,d.z),QI,ONE))}rain.instanceMatrix.needsUpdate=true;
 BP.copy(BULB).project(cam);paneM.uniforms.uB.value.set(BP.x*.5+.5,BP.y*.5+.5);paneM.uniforms.uT.value=t;
 if(CLEAR){mx.fillStyle='#fff';mx.fillRect(0,0,mc.width,mc.height)}else{fogAcc+=dt*FOGX;while(fogAcc>=.25){fogAcc-=.25;steps++;mx.fillStyle=fogFill;mx.fillRect(0,0,mc.width,mc.height)}}writing(t);step(dt);drawDrops();mT.needsUpdate=oT.needsUpdate=dT.needsUpdate=true;
 R.setRenderTarget(rt);R.render(S,cam);R.setRenderTarget(null);
 film.uniforms.uT.value=t;film.uniforms.uF.value=sm(0,1.4,t);comp.render()}
requestAnimationFrame(frame);
