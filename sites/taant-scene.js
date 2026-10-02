// Taant: the weaver's bench at a jamdani pit loom in Rupganj. Units are metres; the breast beam is at the origin.
// The visitor sits where the weaver sits and looks down the warp toward the north window. Scroll is the shuttle:
// every throw lays one row at the fell, the reed beats it home, and the pattern that was only in her head comes out into the cloth.
import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {lux} from './lib/lux.js';
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';
await document.fonts.load('italic 400 40px Erode').catch(()=>{});

const cv=document.getElementById('gl'),phone=innerWidth<700,DPR=Math.min(devicePixelRatio,phone?1.5:2);
const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});
R.setPixelRatio(DPR);R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.05;
RectAreaLightUniformsLib.init();
const S=new THREE.Scene();S.background=new THREE.Color(0x0d0b09);S.fog=new THREE.FogExp2(0x100d0a,.1);
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const sm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};

// ---- the loom's own geometry: the warp runs from the breast beam up and away to the back beam at a shallow rise
const A=.3,DIR=new THREE.Vector3(0,Math.sin(A),-Math.cos(A)),NRM=new THREE.Vector3(0,Math.cos(A),Math.sin(A)),B0=new THREE.Vector3(0,0,-.25);
const at=(s,h=0,x=0)=>B0.clone().addScaledVector(DIR,s).addScaledVector(NRM,h).add(new THREE.Vector3(x,0,0));
const LW=1.9,WC=1.15,CELL=.0036,SF=.5,FLOOR=-.16,WZ=-3.05,WIN={x0:-.72,x1:.72,y0:.04,y1:.84};
const COLS=Math.ceil(WC/CELL),ROWS=200,R_ARRIVE=43,N_THROWS=phone?72:90;

// ---- the pattern, held as a grid of floats: the paar in zari first, then scattered buti in half-drop, each a stepped eight-petal flower
const pat=new Uint8Array(COLS*ROWS*4);
function put(c,r,v){if(c<0||c>=COLS||r<0||r>=ROWS)return;pat[(r*COLS+c)*4]=v*120}
for(let c=0;c<COLS;c++){for(const r of[6,7,8,20,21,22])put(c,r,2);
 const k=((c%12)+12)%12,d=Math.abs(k-6);for(let r=10;r<=18;r++){const y=Math.abs(r-14);if(d+y===4||(d+y<2))put(c,r,2)}}
// the buti: four rounded petals on the axes, four leaves on the diagonals, a heart of zari inside a clear ring; a small star between each pair
for(let br=0,r0=34;r0<ROWS-10;r0+=28,br++)for(let c0=15+(br%2)*15;c0<COLS-9;c0+=30){
 for(let dy=-10;dy<=10;dy++)for(let dx=-10;dx<=10;dx++){const ax=Math.abs(dx),ay=Math.abs(dy),r=Math.hypot(dx,dy);let v=0;
  const al=Math.max(ax,ay),ac=Math.min(ax,ay),u=(ax+ay)/1.4142-7.4,w=(ax-ay)/1.4142;
  if(r<=1.7)v=2;
  else if(r>=2.6&&((al-5.2)/3.6)**2+(ac/2.5)**2<=1)v=(ac<.5&&al>3.4&&al<7.4)?2:1;
  else if((u/2.1)**2+(w/1.05)**2<=1)v=1;
  if(v)put(c0+dx,r0+dy,v)}
 for(const [dx,dy,v] of[[0,0,2],[0,2,1],[0,-2,1],[2,0,1],[-2,0,1],[1,1,1],[-1,-1,1],[1,-1,1],[-1,1,1]])put(c0+15+dx,r0+dy,v)}
const patT=new THREE.DataTexture(pat,COLS,ROWS);patT.magFilter=patT.minFilter=THREE.NearestFilter;patT.needsUpdate=true;

const WW=WIN.x1-WIN.x0,BEHIND=`float behind(vec3 p,vec3 d){
  float tw=(${WZ.toFixed(2)}-p.z)/min(d.z,-1e-4);vec3 q=p+d*tw;
  float tf=d.y<0.?(${FLOOR.toFixed(2)}-p.y)/d.y:1e9;
  if(tw>0.&&tw<tf){float m=smoothstep(${WIN.x0.toFixed(2)},${(WIN.x0+.06).toFixed(2)},q.x)*smoothstep(${WIN.x1.toFixed(2)},${(WIN.x1-.06).toFixed(2)},q.x)*smoothstep(${WIN.y0.toFixed(2)},${(WIN.y0+.05).toFixed(2)},q.y)*smoothstep(${WIN.y1.toFixed(2)},${(WIN.y1-.06).toFixed(2)},q.y);
   float bd=abs(fract((q.x-(${WIN.x0.toFixed(2)}))/${(WW/3).toFixed(3)}+.5)-.5)*${(WW/3).toFixed(3)};float bars=1.-.6*(1.-smoothstep(.01,.03,bd))*step(abs(q.x),${(WW/2-.06).toFixed(3)});
   bars*=1.-.6*(1.-smoothstep(.008,.025,abs(q.y-${(WIN.y0+(WIN.y1-WIN.y0)*.55).toFixed(3)})));return m*1.9*bars;}
  vec3 f=p+d*tf;return exp(-max(0.,f.z-(${WZ.toFixed(2)}))/1.5)*smoothstep(1.5,.5,abs(f.x))*.75;}`;
// ---- the warp sheet: muslin woven below the fell, bare warp above it, both drawn thread by thread and lit by what lies behind them
const clothU={uPat:{value:patT},uRows:{value:R_ARRIVE},uSh:{value:1},uCam:{value:new THREE.Vector3()},uT:{value:0},uHair:{value:0}};
const cloth=new THREE.Mesh(new THREE.PlaneGeometry(WC,LW),new THREE.ShaderMaterial({uniforms:clothU,transparent:true,depthWrite:false,side:THREE.DoubleSide,
 vertexShader:`varying vec2 vUv;varying vec3 vW;void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
 fragmentShader:`uniform sampler2D uPat;uniform float uRows,uSh,uT;uniform vec3 uCam;varying vec2 vUv;varying vec3 vW;
 float h1(float n){return fract(sin(n*127.1)*43758.5453);}
 float thread(float f,float w){float fw=fwidth(f);float d=abs(fract(f)-.5);float c=1.-smoothstep(w*.5-fw*.6,w*.5+fw*.6,d);return mix(c,w,smoothstep(.35,.9,fw));}
 ${BEHIND}
 void main(){
  float s=vUv.y*${LW.toFixed(2)},x=(vUv.x-.5)*${WC.toFixed(2)},sw=${SF.toFixed(3)}-s;
  vec3 V=normalize(vW-uCam);float B=behind(vW,V);
  float fx=x/.00046;float hx=h1(floor(fx));float warp=thread(fx,.24+.2*hx);
  float amb=.16;vec3 cot=vec3(.95,.92,.86)*(.9+.14*hx);vec3 col;float a;
  vec3 L=normalize(vec3(0.,.75,${WZ.toFixed(2)})-vW),N=vec3(0.,${Math.cos(A).toFixed(4)},${Math.sin(A).toFixed(4)});if(dot(N,V)>0.)N=-N;
  vec3 Hh=normalize(L-V);float rake=pow(max(dot(N,Hh),0.),24.);
  if(sw<0.){
   float kn=step(abs(x-.217),.0009)*smoothstep(.006,.0,abs(s-1.31))*1.5;
   a=warp*(.62+.2*hx)+kn*.5;col=cot*(amb+B*(.62+.25*hx)+rake*.35);
  }else{
   float rf=sw/${CELL}-(1.-uSh);float ri=uRows-1.-floor(rf);float cy=fract(rf);
   float fy=sw/.00046;float weft=thread(fy,.3+.2*h1(floor(fy)+71.));
   float gd=1.-(1.-warp)*(1.-weft*.92);
   a=.26+.44*gd;col=cot*(amb*1.4+B*.55*(1.-gd*.35)+rake*.5);
   if(ri>=uRows){a=warp*.7;col=cot*(amb+B*.6);}
   else if(ri>=0.){float c=floor(x/${CELL}+${(COLS/2).toFixed(1)}+(h1(ri)-.5)*.3);vec4 P=texture2D(uPat,vec2((c+.5)/${COLS}.,(ri+.5)/${ROWS}.));
    float fl=smoothstep(.02,.1,cy)*smoothstep(.98,.9,cy);float fb=fwidth(rf);fl=mix(fl,.75,smoothstep(.3,.9,fb));
    float fib=(.86+.14*smoothstep(.1,.45,abs(fract(cy*4.+h1(ri+c*.37)*.5)-.5)*2.))*(.92+.1*h1(c*13.1+ri*7.7));
    if(P.r>.3&&P.r<.7){a=mix(a,.96,fl);col=mix(col,cot*(amb*3.2+B*.16+rake*1.1)*fib,fl);}
    else if(P.r>=.7){vec3 z=vec3(.8,.6,.27);float gl=pow(fract(sin(dot(floor(vec2(x,sw)*2400.),vec2(12.9898,78.233)))*43758.5453),30.)*(.4+.6*sin(uT*1.7+x*40.));
     a=mix(a,.98,fl);col=mix(col,z*(amb*2.6+B*.07+rake*2.2)+vec3(1.,.8,.45)*gl*rake*6.+z*gl*.25,fl);}}
   a+=smoothstep(.0025,0.,sw)*.25;
  }
  a=min(1.,a+step(${(WC/2-.005).toFixed(3)},abs(x))*.3);
  gl_FragColor=vec4(col,clamp(a,0.,1.));}`}));
cloth.position.copy(at(LW/2));
{const q=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(1,0,0),DIR,NRM));cloth.quaternion.copy(q)}
cloth.renderOrder=2;S.add(cloth);

// a field of fine parallel strings or teeth, drawn in the shader so they never alias; lit by what is behind them
function lineMat(perM,w,c,op,off=0,bamboo=false){return new THREE.ShaderMaterial({uniforms:{uCam:clothU.uCam},transparent:true,depthWrite:false,side:THREE.DoubleSide,
 vertexShader:`varying vec2 vUv;varying vec3 vW;void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
 fragmentShader:`uniform vec3 uCam;varying vec2 vUv;varying vec3 vW;${BEHIND}
 void main(){float f=vUv.x*${(0).toFixed(1)}+vUv.x*${'${PER}'}+${'${OFF}'};float fw=fwidth(f);float d=abs(fract(f)-.5);float cv=1.-smoothstep(${'${W}'}*.5-fw*.6,${'${W}'}*.5+fw*.6,d);cv=mix(cv,${'${W}'},smoothstep(.35,.9,fw));
  float B=behind(vW,normalize(vW-uCam));vec3 c=vec3(${'${C}'});vec3 col=${'${BAM}'}?c*(.28+B*.08)+vec3(1.,.86,.62)*pow(1.-d*2.,8.)*.12*(1.-smoothstep(.2,.6,fw)):c*(.12+B*.55);
  float eye=${'${BAM}'}?0.:smoothstep(.06,.0,abs(vUv.y-.5))*.6;gl_FragColor=vec4(col,clamp(cv*${'${OP}'}+eye*cv,0.,1.));}`
 .replace(/\$\{PER\}/g,perM.toFixed(3)).replace(/\$\{OFF\}/g,off.toFixed(2)).replace(/\$\{W\}/g,w.toFixed(3)).replace(/\$\{C\}/g,c.map(v=>v.toFixed(3)).join(',')).replace(/\$\{OP\}/g,op.toFixed(2)).replace(/\$\{BAM\}/g,bamboo?'true':'false')})}
// ---- wood and bamboo: the frame is plain, lit only by the window behind it and a little warm bounce off the floor
const wood=new THREE.MeshStandardMaterial({color:0x5a3e27,roughness:.72}),bam=new THREE.MeshStandardMaterial({color:0x9b7b4c,roughness:.42}),dark=new THREE.MeshStandardMaterial({color:0x2d2119,roughness:.85});
const along=(geo,s,h,x,mat)=>{const m=new THREE.Mesh(geo,mat);m.position.copy(at(s,h,x));m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(1,0,0),DIR,NRM));S.add(m);return m};
along(new THREE.CylinderGeometry(.045,.045,1.5,20).rotateZ(Math.PI/2),-.03,-.02,0,wood);
along(new THREE.CylinderGeometry(.06,.06,1.6,20).rotateZ(Math.PI/2),LW-.02,-.04,0,wood);
for(const sx of[-.72,.72])along(new THREE.BoxGeometry(.055,LW+.2,.07),LW/2,-.05,sx,dark);
for(const [x,z] of[[-.82,-1.3],[.82,-1.3],[-.82,-2.1],[.82,-2.1]]){const p=new THREE.Mesh(new THREE.BoxGeometry(.075,1.9,.075),dark);p.position.set(x,FLOOR+.95,z);S.add(p)}
for(const z of[-1.3,-2.1]){const b=new THREE.Mesh(new THREE.BoxGeometry(1.8,.07,.07),dark);b.position.set(0,1.62,z);S.add(b)}
// heddles: two shafts, each a pair of bars with a curtain of string eyes the warp runs through
const hedN=phone?110:170;
for(const [s,off] of[[1.1,0],[1.19,.5]]){for(const h of[.11,-.1])along(new THREE.BoxGeometry(1.34,.008,.012),s,h,0,bam);
 const hg=new THREE.Mesh(new THREE.PlaneGeometry(WC+.06,.21),lineMat(hedN,.16,[.62,.56,.46],.9,off));hg.position.copy(at(s,0,0));hg.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(1,0,0),NRM,DIR.clone().negate()));hg.renderOrder=3;S.add(hg);
 for(const x of[-.45,.45]){const top=at(s,.11,x),len=1.62-top.y;const c=new THREE.Mesh(new THREE.CylinderGeometry(.002,.002,len,4),dark);c.position.set(x,top.y+len/2,top.z);S.add(c)}}

// the beater: a heavy batten with the reed's bamboo teeth, hung on two swords; it waits back while the shuttle passes, then beats the row home
const beater=new THREE.Group();S.add(beater);const bQ=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(1,0,0),NRM,DIR.clone().negate()));
{const top=new THREE.Mesh(new THREE.BoxGeometry(1.42,.05,.04),wood);top.position.set(0,.14,0);beater.add(top);
 const bot=new THREE.Mesh(new THREE.CylinderGeometry(.017,.017,1.36,14).rotateZ(Math.PI/2),bam);bot.position.set(0,-.1,0);beater.add(bot);
 const up=new THREE.Mesh(new THREE.CylinderGeometry(.014,.014,1.36,14).rotateZ(Math.PI/2),bam);up.position.set(0,.105,0);beater.add(up);
 const dents=new THREE.Mesh(new THREE.PlaneGeometry(1.24,.2),lineMat(1.24/.0032,.4,[.36,.27,.17],.95,0,true));dents.renderOrder=4;beater.add(dents);
 for(const x of[-.68,.68]){const sw=new THREE.Mesh(new THREE.BoxGeometry(.03,1.6,.03),dark);sw.position.set(x,.95,0);beater.add(sw)}
 // her name and years, chalked on the batten where she sees it every row
 const c=document.createElement('canvas');c.width=1024;c.height=96;const g=c.getContext('2d');g.fillStyle='rgba(238,232,220,.92)';g.font='italic 400 58px Erode, Georgia, serif';g.textBaseline='middle';
 let x=40;for(const ch of 'Rahima  ·  31 years'){g.save();g.translate(x,50+(rnd()-.5)*6);g.rotate((rnd()-.5)*.06);g.fillText(ch,0,0);g.restore();x+=g.measureText(ch).width+1.5}
 g.globalCompositeOperation='destination-out';for(let i=0;i<5200;i++){g.globalAlpha=.3+rnd()*.7;g.fillRect(rnd()*1024,rnd()*96,1+rnd()*2.5,1+rnd()*1.2)}
 const ch=new THREE.Mesh(new THREE.PlaneGeometry(.42,.04),(()=>{const tx=new THREE.CanvasTexture(c);return new THREE.MeshStandardMaterial({map:tx,emissiveMap:tx,emissive:0xbcb4a6,emissiveIntensity:.45,transparent:true,roughness:1})})());ch.position.set(-.3,.14,.0205);beater.add(ch)}
beater.quaternion.copy(bQ);
// the shuttle, and the pick of weft it trails back to the selvedge
const shuttle=new THREE.Mesh(new THREE.SphereGeometry(1,20,10),new THREE.MeshStandardMaterial({color:0x7a5230,roughness:.38}));shuttle.scale.set(.13,.016,.026);S.add(shuttle);
const weftL=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]),new THREE.LineBasicMaterial({color:0xe9e2d2,transparent:true,opacity:.8}));S.add(weftL);
// one zari thread left loose at the fell, catching the window as a single hair
const hairC=new THREE.CatmullRomCurve3([at(SF+.002,.001,.09),at(SF+.03,.03,.1),at(SF+.07,.05,.13),at(SF+.1,.035,.17)]);
const hair=new THREE.Mesh(new THREE.TubeGeometry(hairC,40,.00045,4,false),new THREE.MeshStandardMaterial({color:0xd9a84a,metalness:1,roughness:.25,emissive:0x6b4a12,emissiveIntensity:.4}));S.add(hair);
// the price tag, tied to the warp with cotton string: paid by the motif
const tag=new THREE.Group();S.add(tag);
{const c=document.createElement('canvas');c.width=256;c.height=360;const g=c.getContext('2d');g.fillStyle='#efe6d2';g.fillRect(0,0,256,360);
 g.fillStyle='rgba(120,95,60,.12)';for(let i=0;i<900;i++)g.fillRect(rnd()*256,rnd()*360,1,1+rnd()*3);
 g.fillStyle='#1d1812';g.textAlign='center';g.font='italic 400 44px Erode, Georgia, serif';g.fillText('Paid by',128,150);g.fillText('the motif',128,200);
 g.beginPath();g.arc(128,48,13,0,6.283);g.fillStyle='#0d0b09';g.fill();
 const card=new THREE.Mesh(new THREE.PlaneGeometry(.05,.07),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(c),roughness:.95,emissive:0xfff4e0,emissiveIntensity:.08,side:THREE.DoubleSide}));card.position.y=-.075;tag.add(card);
 const str=new THREE.Mesh(new THREE.CylinderGeometry(.0006,.0006,.05,4),new THREE.MeshStandardMaterial({color:0xe6dcc8}));str.position.y=-.025;tag.add(str)}
tag.position.copy(at(1.34,-.002,.36));

// ---- the shed: earth floor, a mud wall, and the north window, soft bars and banana leaves beyond the glass
const floor=new THREE.Mesh(new THREE.PlaneGeometry(8,8).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({color:0x4a3d30,roughness:.96}));floor.position.set(0,FLOOR,-1.5);S.add(floor);
const wallM=new THREE.MeshStandardMaterial({color:0x3a3027,roughness:1});
for(const [w,h,x,y] of[[3.3,4.6,WIN.x0-1.65,1.2],[3.3,4.6,WIN.x1+1.65,1.2],[WW,3,0,WIN.y1+1.5],[WW,.5,0,WIN.y0-.25]]){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,.18),wallM);m.position.set(x,y,WZ-.09);S.add(m)}
{const c=document.createElement('canvas');c.width=640;c.height=460;const g=c.getContext('2d');
 const gr=g.createLinearGradient(0,0,0,460);gr.addColorStop(0,'#dde3ea');gr.addColorStop(.6,'#ecebe4');gr.addColorStop(1,'#dcdccc');g.fillStyle=gr;g.fillRect(0,0,640,460);
 g.filter='blur(14px)';g.fillStyle='rgba(70,92,58,.55)';for(let i=0;i<9;i++){g.save();g.translate(rnd()<.5?rnd()*120:520+rnd()*120,300+rnd()*180);g.rotate(-1+rnd()*2);g.beginPath();g.ellipse(0,0,120+rnd()*80,34+rnd()*20,0,0,6.283);g.fill();g.restore()}
 g.filter='blur(7px)';g.fillStyle='rgba(40,32,26,.85)';for(let i=1;i<3;i++)g.fillRect(i*213-6,0,12,460);g.fillRect(0,Math.round(460*.45)-5,640,10);
 const win=new THREE.Mesh(new THREE.PlaneGeometry(WIN.x1-WIN.x0,WIN.y1-WIN.y0),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),color:new THREE.Color(1.9,1.9,1.85),fog:false}));
 win.material.map.colorSpace=THREE.SRGBColorSpace;win.position.set(0,(WIN.y0+WIN.y1)/2,WZ);S.add(win)}
const north=new THREE.RectAreaLight(0xe6edff,7,WW,WIN.y1-WIN.y0);north.position.set(0,(WIN.y0+WIN.y1)/2,WZ+.02);north.lookAt(0,.3,0);S.add(north);
S.add(new THREE.HemisphereLight(0x8a7254,0x2a1d12,.9));const fill=new THREE.DirectionalLight(0xffcf9a,.75);fill.position.set(-1.2,2.2,2.4);S.add(fill);

// ---- dust in the window light
const mN=phone?60:150,mG=new THREE.BufferGeometry(),mP=new Float32Array(mN*3);for(let i=0;i<mN;i++)mP.set([(rnd()*2-1)*.95,.05+rnd()*1.4,WZ+.15+rnd()*1.9],i*3);
mG.setAttribute('position',new THREE.BufferAttribute(mP,3));const mU={uT:{value:0},uPx:{value:1}};
S.add(new THREE.Points(mG,new THREE.ShaderMaterial({uniforms:mU,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
 vertexShader:`uniform float uT,uPx;varying float vA;void main(){vec3 p=position;p.x+=sin(uT*.13+p.y*3.)*.05;p.y+=sin(uT*.09+p.z*2.)*.04;vec4 mv=modelViewMatrix*vec4(p,1.);vA=.5+.5*sin(uT*.7+p.x*9.);gl_PointSize=uPx*.0022/-mv.z;gl_Position=projectionMatrix*mv;}`,
 fragmentShader:`varying float vA;void main(){float d=length(gl_PointCoord-.5);gl_FragColor=vec4(vec3(1.,.97,.9)*vA*.5,smoothstep(.5,0.,d)*vA);}`})));

// ---- the camera: the weaver's eye, a 40 mm view at the bench, pushing in row by row
const cam=new THREE.PerspectiveCamera(phone?50:34,1,.02,60);
const P0=phone?new THREE.Vector3(0,.72,.62):new THREE.Vector3(0,.6,.5),L0=phone?new THREE.Vector3(0,.16,-2.38):new THREE.Vector3(0,-.02,-2.5);
const P1=phone?new THREE.Vector3(0,.26,-.3):new THREE.Vector3(0,.25,-.4),L1=at(SF,0,.02);
const P2=phone?new THREE.Vector3(0,1.08,.3):new THREE.Vector3(0,.96,.12),L2=at(SF-.2,0,0);

// ---- lens and grade: north window through muslin, fine grain, halation where the window burns through the weave
const comp=new EffectComposer(R);comp.addPass(new RenderPass(S,cam));
const film=new ShaderPass({uniforms:{tDiffuse:{value:null},uT:{value:0},uF:{value:0},uR:{value:new THREE.Vector2()}},
 vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform sampler2D tDiffuse;uniform float uT,uF;uniform vec2 uR;varying vec2 vUv;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;vec2 px=1./uR;vec3 b=vec3(0.);for(int i=0;i<16;i++){float a=float(i)*.3927;b+=texture2D(tDiffuse,vUv+vec2(cos(a),sin(a))*px*(8.+mod(float(i),2.)*10.)).rgb;}b/=16.;
  c+=max(b-.82,0.)*vec3(1.,.9,.76)*.6;
  float l=dot(c,vec3(.2126,.7152,.0722));c=mix(c*vec3(.95,.94,.93),c*vec3(1.05,1.,.9),smoothstep(.08,.65,l));c=mix(vec3(l),c,.94);
  vec2 q=vUv-.5;c*=1.-dot(q,q)*1.1;c+=(h(floor(vUv*uR/1.2)+fract(uT)*77.)-.5)*.018*(.35+l);gl_FragColor=vec4(c*uF,1.);}`});
comp.addPass(film);comp.addPass(new OutputPass());
// the render: contact shading where surfaces meet, glow only on true light sources, tuned to this world's scale and light
lux(R,S,cam,comp,{hemi:.75,ao:{radius:.15,thickness:.25,protect:[.2,.8]},bloom:{strength:.2,radius:.5,threshold:2}});

function size(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);comp.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix();film.uniforms.uR.value.set(w*DPR,h*DPR);mU.uPx.value=h*DPR/(2*Math.tan(THREE.MathUtils.degToRad(cam.fov/2)))}
let lastW=innerWidth;addEventListener('resize',()=>{if(!phone||Math.abs(innerWidth-lastW)>innerWidth*.1){lastW=innerWidth;size()}});

// ---- the hand, the scroll, the film layer
const scrim=document.getElementById('scrim'),loom=document.getElementById('loom'),ov=document.getElementById('ov'),cnt=document.getElementById('cnt'),bn=document.getElementById('bn'),lead=document.getElementById('lead'),beats=[...document.querySelectorAll('.beat')];
let mx=0,my=0,pmx=0,pmy=0;addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5}});
let ac=null,lastK=-1,lastBeat=-1;const snd=document.getElementById('snd');
function whoosh(){if(!ac||ac.state!=='running')return;const t=ac.currentTime,n=ac.createBufferSource(),b=ac.createBuffer(1,ac.sampleRate*.5,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.sin(Math.PI*i/d.length);
 n.buffer=b;const f=ac.createBiquadFilter();f.type='bandpass';f.frequency.setValueAtTime(900,t);f.frequency.linearRampToValueAtTime(2400,t+.45);f.Q.value=1.2;const g=ac.createGain();g.gain.value=.05;n.connect(f).connect(g).connect(ac.destination);n.start(t)}
function thud(){if(!ac||ac.state!=='running')return;const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(60,t+.12);g.gain.setValueAtTime(.18,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);o.connect(g).connect(ac.destination);o.start(t);o.stop(t+.2);
 const n=ac.createBufferSource(),b=ac.createBuffer(1,ac.sampleRate*.05,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);n.buffer=b;const hg=ac.createGain();hg.gain.value=.06;n.connect(hg).connect(ac.destination);n.start(t)}
snd.addEventListener('click',()=>{if(!ac){ac=new AudioContext();snd.textContent='Sound · on'}else if(ac.state==='running'){ac.suspend();snd.textContent='Sound · off'}else{ac.resume();snd.textContent='Sound · on'}});

let t0=performance.now(),last=t0,pS=0;
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;const t=(now-t0)/1000;
 const max=Math.max(1,loom.offsetHeight-innerHeight),tg=Math.max(0,Math.min(1,scrollY/max));pS+=(tg-pS)*Math.min(1,dt*3);const p=pS;
 // the rows: the border is on the loom when you arrive; one throw goes by itself; after that every throw is yours
 const Rw=R_ARRIVE+sm(3,6,t)+sm(.03,.8,p)*N_THROWS,k=Math.floor(Rw),f=Rw-k;
 const done=k+(f>.72?1:0);clothU.uRows.value=done;clothU.uSh.value=f>.72?sm(.72,.82,f):1;clothU.uT.value=mU.uT.value=film.uniforms.uT.value=t;
 const dir=k%2?-1:1,sx=f<.6?dir*(-.78+1.56*sm(0,.6,f)):dir*.78;
 shuttle.position.copy(at(SF+.055,.018,sx));shuttle.quaternion.copy(bQ);shuttle.visible=true;
 const bs=f<.6?SF+.2:f<.72?SF+.2-(.2-.014)*sm(.6,.72,f):SF+.014+(.2-.014)*sm(.76,1,f);beater.position.copy(at(bs,0,0));
 const wp=weftL.geometry.attributes.position;const a0=at(SF+.004,.001,-dir*WC/2),a1=at(SF+.05,.012,Math.max(-WC/2,Math.min(WC/2,sx)));wp.setXYZ(0,a0.x,a0.y,a0.z);wp.setXYZ(1,a1.x,a1.y,a1.z);wp.needsUpdate=true;weftL.visible=f<.72&&Math.abs(sx)<WC/2+.2;
 if(k!==lastK&&f<.3){lastK=k;whoosh()}if(done!==lastBeat){if(lastBeat>=0)thud();lastBeat=done}
 tag.rotation.z=Math.sin(t*.9)*.05;tag.rotation.x=Math.sin(t*.6)*.04;
 // the camera: arrive on the window through the warp, push in to the fell, then lift to see the length she has made
 pmx+=(mx-pmx)*Math.min(1,dt*2);pmy+=(my-pmy)*Math.min(1,dt*2);
 const a=sm(0,.82,p),b=sm(.84,1,p);const pos=P0.clone().lerp(P1,a).lerp(P2,b),look=L0.clone().lerp(L1,a).lerp(L2,b);
 pos.x+=pmx*.05*(1-a*.7);pos.y-=pmy*.03*(1-a*.7);pos.y+=Math.sin(t*.4)*.0015;cam.position.copy(pos);cam.lookAt(look);clothU.uCam.value.copy(pos);
 film.uniforms.uF.value=sm(.3,2.6,t);
 // film layer
 cnt.textContent='Rahima · 31 years at the loom · row '+(done+1);
 bn.style.opacity=lead.style.opacity=scrim.style.opacity=p<.04?1:0;beats.forEach(e=>e.classList.toggle('on',p>+e.dataset.a&&p<+e.dataset.b));
 ov.classList.toggle('off',scrollY>max+innerHeight*.2);
 comp.render()}
window.__tt={cam,clothU,get p(){return pS}};
document.fonts.load('italic 400 40px Erode').catch(()=>{}).then(()=>{size();requestAnimationFrame(frame)});
