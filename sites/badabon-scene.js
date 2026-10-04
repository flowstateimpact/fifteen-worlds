// Badabon: the veranda of a stilt room, four metres above a Sundarbans creek, at dusk. Units are metres; the mud under the lodge is y 0.
// The camera never moves. Scroll raises the tide. The three headlines lie on the mud, projected from the visitor's own eye so they read flat,
// and the water climbs over them in reading order. Hold to raise the lantern: the light reaches further, and now and then two eyes give it back.
import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {lux} from './lib/lux.js';

const cv=document.getElementById('gl'),phone=innerWidth<700,DPR=Math.min(devicePixelRatio,phone?1.5:2);
const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});
R.setPixelRatio(DPR);R.shadowMap.enabled=!phone;R.shadowMap.type=THREE.PCFSoftShadowMap;R.shadowMap.autoUpdate=false;
R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.3;
const S=new THREE.Scene();S.fog=new THREE.FogExp2(0x2a2238,.026);
let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const sm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};
const EYE=5.55,KERO=new THREE.Color(1,.6,.28);
const U={uL:{value:-2.35},uT:{value:0},uLamp:{value:new THREE.Vector3()},uLampI:{value:0}};

// ---- the ground: a mud ramp from under the lodge down into the creek mouth; the creek runs away down the view, banks either side.
// The same function runs on the GPU, so the water always knows how deep it is.
const CX=z=>.8*Math.sin(z*.045)+.018*Math.max(0,-z-40)**2,CW=z=>4.6+.08*Math.max(0,-z-27)+.6*Math.sin(z*.17+1.3);
const H=(x,z)=>{const cx=CX(z),w=CW(z),d=Math.abs(x-cx)-w;
 const chan=-2.6+1.7*sm(-3,6,d),near=.25+.08*z+.5*sm(0,6,Math.abs(x)-(9+.45*(-z))),f=sm(-34,-26,z+2.2*Math.sin(x*.33+.7)+1.1*Math.sin(x*.81+2.1));
 const g=chan+(near-chan)*f;
 return g+.02*Math.sin(x*1.3+z*.9)*Math.sin(z*1.1-x*.5)+.008*Math.sin(x*3.7+z*2.9)};
const bankX=(z,side)=>CX(z)+side*CW(z);
const HGL=`float CX(float z){float b=max(0.,-z-40.);return .8*sin(z*.045)+.018*b*b;}float CW(float z){return 4.6+.08*max(0.,-z-27.)+.6*sin(z*.17+1.3);}
float H(vec2 p){float x=p.x,z=p.y;float cx=CX(z),w=CW(z),d=abs(x-cx)-w;
 float chan=-2.6+1.7*smoothstep(-3.,6.,d),near=.25+.08*z+.5*smoothstep(0.,6.,abs(x)-(9.+.45*(-z))),f=smoothstep(-34.,-26.,z+2.2*sin(x*.33+.7)+1.1*sin(x*.81+2.1));
 float g=chan+(near-chan)*f;
 return g+.02*sin(x*1.3+z*.9)*sin(z*1.1-x*.5)+.008*sin(x*3.7+z*2.9);}`;
// the sky's last violet, with the last warmth low at the far end of the creek
const SKY=`vec3 SKY(vec3 d){float y=d.y;vec3 zen=vec3(.03,.03,.055),vio=vec3(.2,.15,.32);
 vec3 c=mix(vio,zen,smoothstep(0.,.5,y));
 c+=vec3(.95,.56,.26)*exp(-max(y,0.)*11.)*pow(max(0.,-d.z),8.)*.24;
 return mix(c,vec3(.015,.018,.014),smoothstep(0.,-.12,y));}`;

// ---- the camera, fixed at the rail; it breathes by two pixels and nothing else
const cam=new THREE.PerspectiveCamera(phone?64:50,1,.05,400);cam.position.set(0,EYE,.25);
const PITCH=phone?-.47:-.41;const rest=cam.clone();
function pose(c,yaw,pitch){c.rotation.set(0,0,0);c.rotation.order='YXZ';c.rotation.y=yaw;c.rotation.x=PITCH+pitch;c.updateMatrixWorld(true)}

// ---- the words on the mud: laid out in the visitor's own screen space, then projected down onto the mud from the resting eye
const src=document.getElementById('src'),blocks=[...src.querySelectorAll('.blk')].map(b=>({h:b.querySelector('h2').textContent,p:b.querySelector('p')?.textContent||'',r:b.classList.contains('r')}));
const txC=document.createElement('canvas'),txG=txC.getContext('2d');const txT=new THREE.CanvasTexture(txC);txT.colorSpace=THREE.NoColorSpace;
const uPV={value:new THREE.Matrix4()},uText={value:txT};let rows=[],inkData=null;
function wrap(t,maxW){const out=[];let cur='';for(const w of t.split(' ')){const s=cur?cur+' '+w:w;if(cur&&txG.measureText(s).width>maxW){out.push(cur);cur=w}else cur=s}if(cur)out.push(cur);return out}
// Anwar: the words were projected from the eye, so they read as if pasted on the glass. Now they are written into the mud's own plane:
// the canvas maps world x,z straight onto the mud (tops of the letters point away from you), letters drawn 2x long along the ground,
// the way road markings are, so they still read from a low eye; far block first, each nearer block written on its own beat
const TX={x0:-14,x1:14,zN:-2.5,zF:-26},uRev={value:new THREE.Vector3()},uRx0={value:new THREE.Vector3()},uRx1={value:new THREE.Vector3(1,1,1)};
function halfW(z){const y=H(0,z),a=new THREE.Vector3(0,y,z).project(rest),b=new THREE.Vector3(1,y,z).project(rest);return (.84-Math.abs(a.x))/Math.max(1e-4,b.x-a.x)}
function layout(){pose(rest,0,0);const ST=2.7,pxm=phone?60:80,W=Math.round((TX.x1-TX.x0)*pxm),Hh=Math.round((TX.zN-TX.zF)*pxm/ST);txC.width=W;txC.height=Hh;txG.clearRect(0,0,W,Hh);rows=[];
 const hx=(TX.x1-TX.x0)/2,cxW=(TX.x0+TX.x1)/2,hz=(TX.zN-TX.zF)/2,czW=(TX.zN+TX.zF)/2;
 uPV.value.set(1/hx,0,0,-cxW/hx, 0,0,-1/hz,czW/hz, 0,0,0,0, 0,0,0,1);
 const px=x=>(x-TX.x0)*pxm,pz=z=>(z-TX.zF)/(TX.zN-TX.zF)*Hh;
 const B=phone?[[-16.5,.72],[-12.2,.6],[-9.6,.52]]:[[-17.4,.9],[-12.6,.74],[-8.6,.6]];let zPrev=-1e9;
 txG.textBaseline='alphabetic';
 blocks.forEach((b,i)=>{const sk=phone?1:[1.35,1,1][i],em=B[i][1],z0=Math.max(B[i][0],zPrev+em*ST*sk*.74+.6),fs=em*pxm,rowZ=em*ST*sk*1.02,hw=halfW(z0+1.4)*.86,maxW=(phone?2*hw:(i?1.75:1.3)*hw)*pxm;
  txG.font=`400 ${fs}px Stardom, Georgia, serif`;txG.fillStyle=['#f00','#0f0','#00f'][i];const ls=wrap(b.h,maxW);let z=z0,x0=1e9,x1=-1e9;
  ls.forEach(l=>{const w=txG.measureText(l).width,x=phone?px(-hw):(b.r?px(hw)-w:px(i===0?-.12*hw:-hw));txG.save();txG.translate(x,pz(z));txG.scale(1,sk);txG.fillText(l,0,0);txG.restore();x0=Math.min(x0,x);x1=Math.max(x1,x+w);z+=rowZ});
  uRx0.value.setComponent(i,x0/W);uRx1.value.setComponent(i,x1/W);
  zPrev=z-rowZ+em*.3;rows.push({zF:z0-em*ST*sk*.74,zN:zPrev,xc:TX.x0+(x0+x1)/2/pxm})});
 // written into silt by a stick, not printed: the edges break up
 txG.globalCompositeOperation='destination-out';for(let i=0;i<W*Hh/260;i++){txG.globalAlpha=.25+rnd()*.6;txG.beginPath();txG.arc(rnd()*W,rnd()*Hh,.5+rnd()*1.7,0,6.283);txG.fill()}
 txG.globalCompositeOperation='source-over';txG.globalAlpha=1;txT.needsUpdate=true;inkData=txG.getImageData(0,0,W,Hh)}
function groundY(nx,ny){const v=new THREE.Vector3(nx,ny,.5).unproject(rest).sub(rest.position).normalize();const p=new THREE.Vector3();
 for(let t=.5;t<140;t+=.06){p.copy(rest.position).addScaledVector(v,t);if(p.y<=H(p.x,p.z))return p.y}return -2.6}
// the tide's timetable, worked out from where each headline actually lies: each block goes under from its far edge to its near edge
let tideK=[];function schedule(){const hs=rows.map(r=>({t:H(r.xc,r.zF),b:H(r.xc,r.zN)}));
 const L0=Math.min(-2.35,hs[0].t-.35),LM=Math.min(.35,hs[2].b+.55);
 const k=[[0,L0],[.1,hs[0].t-.03],[.25,hs[0].b+.07],[.35,hs[1].t-.03],[.5,hs[1].b+.07],[.6,hs[2].t-.03],[.76,hs[2].b+.07],[.92,LM],[1,LM]];
 for(let i=1;i<k.length;i++)k[i][1]=Math.max(k[i][1],k[i-1][1]+.004);tideK=k}
const tideAt=s=>{for(let i=1;i<tideK.length;i++)if(s<=tideK[i][0]){const a=tideK[i-1],b=tideK[i],f=(s-a[0])/(b[0]-a[0]);return a[1]+(b[1]-a[1])*(f*f*(3-2*f))}return tideK[tideK.length-1][1]};

// ---- mud
const vW=`vec4 wp_=vec4(transformed,1.);
#ifdef USE_INSTANCING
wp_=instanceMatrix*wp_;
#endif
vW=(modelMatrix*wp_).xyz;`;
const mudG=new THREE.PlaneGeometry(64,70,phone?150:300,phone?160:320);mudG.rotateX(-Math.PI/2);mudG.translate(0,0,-29);
{const p=mudG.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,H(p.getX(i),p.getZ(i)));mudG.computeVertexNormals()}
const mudM=new THREE.MeshStandardMaterial({color:0x3b3329,roughness:.93});
mudM.onBeforeCompile=sh=>{Object.assign(sh.uniforms,U,{uPV,uText,uRev,uRx0,uRx1});
 sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vW;').replace('#include <project_vertex>','#include <project_vertex>\n'+vW);
 sh.fragmentShader=sh.fragmentShader.replace('#include <common>',`#include <common>
varying vec3 vW;uniform mat4 uPV;uniform sampler2D uText;uniform vec3 uRev,uRx0,uRx1;uniform float uL,uT,uLampI;uniform vec3 uLamp;
float caus(vec2 p,float t){p*=2.1;float v=0.;for(int i=0;i<3;i++){float k=float(i+1);vec2 q=p*k*1.3+vec2(t*.35*k,-t*.27*k);v+=abs(sin(q.x+sin(q.y*1.3))*sin(q.y+sin(q.x*.9)));}return pow(max(1.-v/2.2,0.),5.)*2.5;}`)
 .replace('#include <color_fragment>',`#include <color_fragment>
  vec4 pc_=uPV*vec4(vW,1.);vec2 su_=pc_.xy/pc_.w*.5+.5;
  vec4 tx_=(pc_.w>0.&&su_.x>0.&&su_.x<1.&&su_.y>0.&&su_.y<1.)?texture2D(uText,su_):vec4(0.);float ink=tx_.a;
  float sw_=dot(step(vec3(.5),tx_.rgb),mix(uRx0-.03,uRx1+.03,uRev));float swm_=smoothstep(su_.x-.012,su_.x+.012,sw_);ink*=swm_;
  float inkF=texture2D(uText,su_+vec2(0.,.0035)).a*swm_,lip_=clamp(inkF-ink,0.,1.);float lit_=clamp(texture2D(uText,su_-vec2(0.,.0035)).a*swm_-ink,0.,1.); // the stick throws up a lip on one side of each stroke: its shadow is what says pressed, not printed
  float dep=uL-vW.y,wn_=fract(sin(dot(floor(vW.xz*9.),vec2(12.9898,78.233)))*43758.5453),wet=smoothstep(-.3-.15*wn_,.02,dep);
  float n_=sin(vW.x*1.7+sin(vW.z*1.3))*sin(vW.z*2.1+sin(vW.x*.8))*.5+.5;
  diffuseColor.rgb*=.82+.36*n_;
  ink*=1.-smoothstep(0.,.1,uL-vW.y); // once the tide is over a line it is gone, no ghost under the water
  diffuseColor.rgb*=1.-.62*ink;diffuseColor.rgb*=1.-.5*lip_;diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.78,.7,.58),lit_*.9);
  diffuseColor.rgb*=mix(1.,.6,wet*(1.-ink*.4));`)
 .replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\n roughnessFactor=mix(roughnessFactor,.66,smoothstep(-.28,0.,dep)*(1.-smoothstep(0.,.04,dep))*(.45+.55*wn_))+ink*.04;')
 .replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
  totalEmissiveRadiance+=vec3(.92,.8,.7)*(ink*.05+lit_*.62)*(1.-smoothstep(-.02,.3,dep)); // wet silt in a fresh scratch catches the dusk sky
  {float far_=smoothstep(-4.,-30.,vW.z),rip_=.5+.5*sin(vW.x*1.7+sin(vW.z*1.3))*sin(vW.z*2.1+sin(vW.x*.8));float sheen=(.25+.75*wet)*far_*(.35+.65*rip_)*(1.-smoothstep(0.,.05,dep));
   totalEmissiveRadiance+=vec3(.36,.27,.5)*sheen*.085;} // the flat is wet: at a low angle it returns the violet sky, strongest far off and at the water's edge
  if(dep>0.){vec3 dl_=vW-uLamp;float att=uLampI/(1.+dot(dl_,dl_)*.35);totalEmissiveRadiance+=vec3(1.,.6,.28)*caus(vW.xz,uT)*att*.012*smoothstep(0.,.2,dep)*exp(-dep*1.4);}`)};
const mud=new THREE.Mesh(mudG,mudM);mud.receiveShadow=true;S.add(mud);

// ---- everything with bark on it carries the tide on it: stained below the old high-water mark, a band of leaf litter caught at the line
function tidal(m){m.onBeforeCompile=sh=>{Object.assign(sh.uniforms,U);
 sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vW;').replace('#include <project_vertex>','#include <project_vertex>\n'+vW);
 sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vW;uniform float uL;')
 .replace('#include <color_fragment>',`#include <color_fragment>
  diffuseColor.rgb*=mix(1.,.5,smoothstep(.66,.5,vW.y));
  float sp_=fract(sin(dot(floor(vW.xz*55.+vW.y*38.),vec2(12.9898,78.233)))*43758.5453);
  diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.3,.21,.11)*(.6+.7*sp_),smoothstep(.07,0.,abs(vW.y-.6))*.85);
  diffuseColor.rgb*=mix(1.,.68,step(vW.y,uL));`)
 .replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\n roughnessFactor=mix(roughnessFactor,.35,step(vW.y,uL));')};return m}
const bark=tidal(new THREE.MeshStandardMaterial({color:0x3a2e24,roughness:.9}));

// ---- pneumatophores: the mangrove's breathing roots, thousands of pencils standing out of the mud. Kept off the letters, mostly.
const pnN=phone?600:2000,pn=new THREE.InstancedMesh(new THREE.ConeGeometry(.018,1,5,1).translate(0,.5,0),tidal(new THREE.MeshStandardMaterial({color:0x2f271f,roughness:.85})),pnN);
function placePn(){const m=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),v=new THREE.Vector4();let n=0;
 for(let tries=0;n<pnN&&tries<pnN*8;tries++){const z=-2-Math.pow(rnd(),1.2)*52,x=(rnd()*2-1)*(9+(-z)*.55),y=H(x,z);if(y<-2.45)continue;
  v.set(x,y,z,1).applyMatrix4(uPV.value);const su=v.x/v.w*.5+.5,sv=1-(v.y/v.w*.5+.5);
  if(inkData&&su>0&&su<1&&sv>0&&sv<1){const a=inkData.data[(Math.floor(sv*inkData.height)*inkData.width+Math.floor(su*inkData.width))*4+3];if(a>40&&rnd()>.06)continue}
  const h=.06+rnd()*.2;e.set((rnd()-.5)*.25,0,(rnd()-.5)*.25);q.setFromEuler(e);m.compose(new THREE.Vector3(x,y-.02,z),q,new THREE.Vector3(1+rnd(),h,1+rnd()));pn.setMatrixAt(n++,m)}
 pn.count=n;pn.instanceMatrix.needsUpdate=true}
pn.castShadow=pn.receiveShadow=true;S.add(pn);

// ---- the trees: trunks on arching stilt roots, taller than the frame near the lodge, a dark wall down both banks
const arch=new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[0,1,0],[.3,.97,0],[.66,.72,0],[.9,.32,0],[1,0,0],[1.04,-.14,0]].map(a=>new THREE.Vector3(...a))),18,.03,6,false);
const trees=[];trees.push({x:-6.4,z:-5.6,s:1.8},{x:7.2,z:-7.8,s:1.7});
for(let i=0;i<(phone?26:70);i++){const side=i%2?1:-1;if(i<16){const z=-4-rnd()*24,x=side*(.74*(-z+.3)*(phone?.55:1)+1.2+rnd()*5);trees.push({x,z,s:.8+rnd()*.7})}else{const z=-29-rnd()*30,x=bankX(z,side)+side*(.8+rnd()*10);trees.push({x,z,s:.8+rnd()*.7})}}
for(let i=0;i<(phone?12:30);i++){const z=-47-rnd()*15,x=(rnd()*2-1)*34;if(Math.abs(x-CX(z))<CW(z)+.6){i--;continue}trees.push({x,z,s:.9+rnd()*.7})}
for(let x=-24;x<34;x+=(phone?3.6:2.4)+rnd()*1.2)trees.push({x,z:-60.5-rnd()*3,s:.95+rnd()*.6});
const rootN=trees.length*12,roots=new THREE.InstancedMesh(arch,bark,rootN),trunks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.55,.8,1,9),bark,trees.length);
const leafG=new THREE.IcosahedronGeometry(1,2);{const p=leafG.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),k=1+.28*Math.sin(x*4.1+y*2.7)*Math.sin(z*3.3-x*1.9);p.setXYZ(i,x*k,y*k*.7,z*k)}leafG.computeVertexNormals()}
const leaves=new THREE.InstancedMesh(leafG,new THREE.MeshStandardMaterial({color:0x0f1a11,roughness:1}),trees.length*4);
{const m=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler();let r=0,l=0;
 trees.forEach((t,i)=>{const g=H(t.x,t.z),th=(6+rnd()*5)*t.s,tr=(.12+rnd()*.1)*t.s,rh=(1.4+rnd()*1.2)*t.s;
  m.compose(new THREE.Vector3(t.x,g+rh+th/2-.3,t.z),q.identity(),new THREE.Vector3(tr,th,tr));trunks.setMatrixAt(i,m);
  const out=t.x>(t.z<-28?bankX(t.z,0):0)?0:Math.PI;
  for(let k=0;k<12;k++){const a=out+(k/11-.5)*2.9+(rnd()-.5)*.3,rr=(.8+rnd()*.9)*t.s,hh=rh*(.7+rnd()*.5);e.set(0,-a,0);q.setFromEuler(e);
   m.compose(new THREE.Vector3(t.x,g-.05,t.z),q,new THREE.Vector3(rr,hh,(rr+hh)*.5*(.8+rnd()*.5)));roots.setMatrixAt(r++,m)}
  for(let k=0;k<4;k++){const s=(1.6+rnd()*1.8)*t.s;e.set(rnd(),rnd()*6,rnd());q.setFromEuler(e);
   m.compose(new THREE.Vector3(t.x+(rnd()-.5)*2.5*t.s,g+rh+th-.5+(rnd()-.3)*1.8*t.s,t.z+(rnd()-.5)*2.5*t.s),q,new THREE.Vector3(s,s,s));leaves.setMatrixAt(l++,m)}})}
[roots,trunks,leaves].forEach(o=>{o.castShadow=o.receiveShadow=true;S.add(o)});

// ---- one of the other five rooms, down the right bank: stilts in the creek and a window with somebody's lamp in it
{const g=new THREE.Group(),x=bankX(-36,1)+1.2,z=-36,y0=H(x,z);g.position.set(x,0,z);g.rotation.y=-.5;S.add(g);
 const wood=tidal(new THREE.MeshStandardMaterial({color:0x2c2119,roughness:.85}));
 for(const [sx,sz] of[[-1.4,-1],[1.4,-1],[-1.4,1],[1.4,1]]){const s=new THREE.Mesh(new THREE.CylinderGeometry(.09,.1,4.4,8),wood);s.position.set(sx,y0+2.1,sz);g.add(s)}
 const fl=new THREE.Mesh(new THREE.BoxGeometry(3.4,.14,2.6),wood);fl.position.y=y0+4.3;g.add(fl);
 const wall=new THREE.Mesh(new THREE.BoxGeometry(3,2.1,2.3),wood);wall.position.y=y0+5.4;g.add(wall);
 const roof=new THREE.Mesh(new THREE.ConeGeometry(2.6,1.7,4,1),new THREE.MeshStandardMaterial({color:0x3a2e1f,roughness:1}));roof.rotation.y=Math.PI/4;roof.scale.set(1.25,1,1);roof.position.y=y0+7.3;g.add(roof);
 const win=new THREE.Mesh(new THREE.PlaneGeometry(.34,.4),new THREE.MeshBasicMaterial({color:new THREE.Color(1.2,.68,.28)}));win.position.set(.5,y0+5.5,1.16);g.add(win);
 g.traverse(o=>{if(o.isMesh&&o!==win){o.castShadow=o.receiveShadow=true}})}

// ---- our own veranda: the rail under the hands, with the name cut into it, and the golpata thatch hanging overhead
const railY=EYE-.69,railZ=phone?-.08:-.28;
{const rail=new THREE.Mesh(new THREE.BoxGeometry(7,.1,.17),new THREE.MeshStandardMaterial({color:0x4b3727,roughness:.5}));rail.position.set(0,railY-.05,railZ);rail.receiveShadow=true;S.add(rail);
 const c=document.createElement('canvas');c.width=640;c.height=96;const g=c.getContext('2d');g.fillStyle='#000';g.font='400 70px Stardom, Georgia, serif';g.textBaseline='middle';
 let x=24;for(const ch of 'BADABON'){g.save();g.translate(x,50+(rnd()-.5)*5);g.rotate((rnd()-.5)*.07);g.fillText(ch,0,0);g.restore();x+=g.measureText(ch).width+10+rnd()*4}
 const t=new THREE.CanvasTexture(c);const cut=new THREE.Mesh(new THREE.PlaneGeometry(.5,.075),new THREE.MeshStandardMaterial({color:0x160f09,roughness:.95,alphaMap:t,transparent:true,opacity:.85}));
 cut.rotation.x=-Math.PI/2;cut.position.set(-.62,railY+.002,railZ+.01)}
{const n=phone?420:1100,lg=new THREE.PlaneGeometry(.036,1,1,4).translate(0,-.5,0);{const p=lg.attributes.position;for(let i=0;i<p.count;i++){const v=-p.getY(i);p.setX(i,p.getX(i)*(1-.85*v*v));p.setZ(i,.05*v*v)}lg.computeVertexNormals()}
 const th=new THREE.InstancedMesh(lg,new THREE.MeshStandardMaterial({color:0x19120b,roughness:1,side:THREE.DoubleSide}),n);
 const m=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler();
 for(let i=0;i<n;i++){const x=-3.6+7.2*rnd(),r=rnd();e.set((rnd()-.5)*.3,(rnd()-.5)*.7,(rnd()-.5)*.35);q.setFromEuler(e);m.compose(new THREE.Vector3(x,EYE+.16+rnd()*.04,-.98-rnd()*.26),q,new THREE.Vector3(.8+rnd()*.6,.1+r*r*.2,1));th.setMatrixAt(i,m)}
 th.receiveShadow=true;// built, not added: in frame it read as sticks, then as teeth; the treetops frame the top better
 const eave=new THREE.Mesh(new THREE.BoxGeometry(7.6,.07,.6),new THREE.MeshStandardMaterial({color:0x120d08,roughness:1}));eave.position.set(0,EYE+.21,-1.05)}

// ---- the lantern, hung out over the rail: kerosene, 2400 K, a soot crescent on the glass. Hold, and the arm lifts it.
const lant=new THREE.Group();S.add(lant);const LB=phone?new THREE.Vector3(.15,EYE-1.25,-.35):new THREE.Vector3(.55,EYE-1.34,-.7),LUP=phone?new THREE.Vector3(.78,EYE-.26,-.8):new THREE.Vector3(1.75,EYE-.26,-.95);
{const metal=new THREE.MeshStandardMaterial({color:0x3a2c1d,metalness:.3,roughness:.62});
 const base=new THREE.Mesh(new THREE.CylinderGeometry(.075,.085,.06,20),metal);base.position.y=-.1;lant.add(base);
 const sc=document.createElement('canvas');sc.width=sc.height=128;const g=sc.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,128,128);
 const gr=g.createLinearGradient(0,0,0,50);g.strokeStyle='rgba(40,28,16,.55)';g.lineWidth=9;g.lineCap='round';g.beginPath();g.arc(40,-6,34,.3,1.4);g.stroke();
 {const gg=g.createLinearGradient(0,0,0,128);gg.addColorStop(0,'rgba(255,255,255,.35)');gg.addColorStop(.55,'rgba(255,255,255,1)');gg.addColorStop(1,'rgba(255,255,255,.6)');g.globalCompositeOperation='multiply';g.fillStyle=gg;g.fillRect(0,0,128,128);g.globalCompositeOperation='source-over'}
 const glass=new THREE.Mesh(new THREE.SphereGeometry(.07,24,18),new THREE.MeshStandardMaterial({color:0xfff1da,emissive:0xffa85a,emissiveIntensity:1.6,emissiveMap:new THREE.CanvasTexture(sc),roughness:.1,transparent:true,opacity:.75}));
 glass.scale.set(1,1.3,1);lant.add(glass);
 const flame=new THREE.Mesh(new THREE.SphereGeometry(.014,10,8),new THREE.MeshBasicMaterial({color:new THREE.Color(9,4.6,1.5)}));flame.scale.set(1,2.4,1);flame.position.y=-.01;lant.add(flame);
 const cap=new THREE.Mesh(new THREE.CylinderGeometry(.045,.07,.05,20),metal);cap.position.y=.115;lant.add(cap);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(.06,.004,6,24,Math.PI),metal);ring.position.y=.14;lant.add(ring);
 for(let i=0;i<2;i++){const w=new THREE.Mesh(new THREE.TorusGeometry(.079,.0025,4,28),metal);w.rotation.x=Math.PI/2;w.position.y=i?.05:-.045;lant.add(w)}
 const hc=document.createElement('canvas');hc.width=hc.height=64;const hg=hc.getContext('2d');const rg=hg.createRadialGradient(32,32,0,32,32,32);rg.addColorStop(0,'rgba(255,190,110,.9)');rg.addColorStop(.35,'rgba(255,150,70,.25)');rg.addColorStop(1,'rgba(255,140,60,0)');hg.fillStyle=rg;hg.fillRect(0,0,64,64);
 const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(hc),blending:THREE.AdditiveBlending,depthWrite:false,fog:false,opacity:.45}));halo.scale.set(.95,.95,1);lant.add(halo)}
const lamp=new THREE.PointLight(KERO,1,0,2);lant.add(lamp);
if(!phone){lamp.castShadow=true;lamp.shadow.mapSize.set(1024,1024);lamp.shadow.camera.near=.12;lamp.shadow.camera.far=45;lamp.shadow.bias=-.002;lamp.shadow.radius=3}
S.add(new THREE.HemisphereLight(0x7d6aa8,0x14120e,1.55));
const dusk=new THREE.DirectionalLight(0xffb070,.7);dusk.position.set(-8,5,-60);S.add(dusk);

// ---- sky
S.add(new THREE.Mesh(new THREE.SphereGeometry(300,32,16),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,
 vertexShader:`varying vec3 vD;void main(){vD=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`varying vec3 vD;${SKY}void main(){gl_FragColor=vec4(SKY(normalize(vD)),1.);}`})));

// ---- the water: one moving surface. It bends what lies under it, browns it with silt as it deepens, and gives back the sky and the lantern.
const rt=new THREE.WebGLRenderTarget(4,4,{type:THREE.HalfFloatType});
const wU={tRef:{value:rt.texture},uRes:{value:new THREE.Vector2()},uCam:{value:cam.position},uFogC:{value:S.fog.color},uFogD:{value:S.fog.density}};
const water=new THREE.Mesh(new THREE.PlaneGeometry(64,70).rotateX(-Math.PI/2).translate(0,0,-29),new THREE.ShaderMaterial({uniforms:Object.assign(wU,U),
 vertexShader:`varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
 fragmentShader:`uniform sampler2D tRef;uniform vec2 uRes;uniform float uT,uL,uLampI,uFogD;uniform vec3 uLamp,uCam,uFogC;varying vec3 vW;
 ${HGL}${SKY}
 vec2 wav(vec2 p,float t){vec2 g=vec2(0.);
  g+=vec2(.8,.6)*cos(dot(p,vec2(.8,.6))*1.7-t*1.1)*.012;
  g+=vec2(-.5,.86)*cos(dot(p,vec2(-.5,.86))*2.9-t*1.6)*.01;
  g+=vec2(.97,-.24)*cos(dot(p,vec2(.97,-.24))*6.3+sin(p.y*.7)*1.3-t*2.3)*.008;
  g+=vec2(.31,.95)*cos(dot(p,vec2(.31,.95))*11.1+sin(p.x*1.1)*1.7-t*3.3)*.006;
  g+=vec2(-.87,.49)*cos(dot(p,vec2(-.87,.49))*17.3-t*4.1)*.004;return g;}
 void main(){
  vec2 g=wav(vW.xz,uT)*mix(1.,.35,smoothstep(8.,30.,length(uCam.xz-vW.xz)));vec3 n=normalize(vec3(-g.x,1.,-g.y));
  float dep=max(uL-H(vW.xz),0.);
  vec2 su=gl_FragCoord.xy/uRes;vec2 ru=su+vec2(n.x,-n.z)*.05*clamp(dep,0.,1.);
  vec3 below=texture2D(tRef,ru).rgb;
  vec3 ab=exp(-dep*vec3(2.6,3.1,3.8));
  vec3 col=below*ab+vec3(.045,.036,.024)*(1.-ab);
  vec3 V=normalize(uCam-vW);vec3 Rf=reflect(-V,n);Rf.y=abs(Rf.y);
  float fr=.02+.98*pow(1.-max(dot(n,V),0.),5.);
  vec3 Ld=uLamp-vW;float dl=length(Ld);Ld/=dl;vec3 Hh=normalize(Ld+V);
  float spec=pow(max(dot(n,Hh),0.),500.)*uLampI*.12/(1.+dl*dl*.06);
  vec3 rs=SKY(Rf)*.85;
   float hw=mix(.74*max(-vW.z,0.)+3.,CW(vW.z)+1.5,smoothstep(-26.,-34.,vW.z)),cxz=mix(0.,CX(vW.z),smoothstep(-26.,-34.,vW.z));
   float dxb=Rf.x>0.?(cxz+hw-vW.x):(vW.x-(cxz-hw)),tb=max(dxb,.3)/max(abs(Rf.x),1e-3),tz=max(vW.z+58.,.5)/max(-Rf.z,1e-3);
   float tt=min(tb,tz),zb=vW.z+Rf.z*tt,xb=vW.x+Rf.x*tt;
   float hTop=Rf.y*tt-(8.5+1.3*sin(zb*.83+xb*.4)+.7*sin(zb*2.1+1.)+.35*sin(xb*3.3+zb*1.7));
   rs=mix(vec3(.011,.012,.016),rs,smoothstep(-1.4,1.4,hTop));
  col=mix(col,rs,fr*smoothstep(0.,.06,dep))+vec3(1.,.6,.28)*spec*smoothstep(0.,.04,dep);
  float fd=length(uCam-vW);col=mix(col,uFogC,1.-exp(-uFogD*uFogD*fd*fd));
  gl_FragColor=vec4(col,1.);}`}));
S.add(water);

// ---- fireflies in the roots, slowly falling into step with each other
const ffN=phone?50:140,ffG=new THREE.BufferGeometry(),ffP=new Float32Array(ffN*3),ffA=new Float32Array(ffN);
for(let i=0;i<ffN;i++){const side=rnd()<.5?-1:1,z=-5-rnd()*40,x=z<-29?bankX(z,side)+side*(.5+rnd()*5):side*(.7*(-z)*(phone?.5:1)+rnd()*4);ffP.set([x,H(x,z)+.4+rnd()*2.4,z],i*3);ffA[i]=rnd()*6.283}
ffG.setAttribute('position',new THREE.BufferAttribute(ffP,3));ffG.setAttribute('ph',new THREE.BufferAttribute(ffA,1));
const ffU={uT:{value:0},uOn:{value:0},uSync:{value:0},uPx:{value:1}};
S.add(new THREE.Points(ffG,new THREE.ShaderMaterial({uniforms:ffU,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
 vertexShader:`attribute float ph;uniform float uT,uOn,uSync,uPx;varying float vB;void main(){vec3 p=position+vec3(sin(uT*.3+ph)*.25,sin(uT*.41+ph*2.)*.15,cos(uT*.27+ph)*.25);
  float f=sin(uT*2.4+ph*(1.-uSync));vB=pow(max(f,0.),14.)*uOn*step(fract(ph*7.13),.35+.65*uOn);vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=uPx*(.05+vB*.08)/-mv.z;gl_Position=projectionMatrix*mv;}`,
 fragmentShader:`varying float vB;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,0.,d);gl_FragColor=vec4(vec3(.8,1.,.42)*vB*a*3.,a*vB);}`})));

// ---- the far bank, when the light reaches it
const eyeM=new THREE.MeshBasicMaterial({color:new THREE.Color(1.6,1.9,.55),fog:false}),eyes=new THREE.Group();
for(const x of[-.15,.15]){const e=new THREE.Mesh(new THREE.SphereGeometry(.1,10,8),eyeM);e.position.x=x;e.scale.set(1.3,.8,1);eyes.add(e)}
eyes.visible=false;S.add(eyes);
let eyeSpots=[];function findEyeSpots(){const rc=new THREE.Raycaster(),out=[];
 for(let z=-29;z>-44&&out.length<4;z-=1.3)for(const side of[1,-1]){const x=bankX(z,side)+side*(.4+rnd()*1.2),y=H(x,z)+.55,p=new THREE.Vector3(x,y,z);
  const ndc=p.clone().project(rest);if(Math.abs(ndc.x)>.8||ndc.y>.9||ndc.y<-.2)continue;
  const d=p.clone().sub(rest.position),L=d.length();rc.set(rest.position,d.normalize());rc.far=L-.3;if(rc.intersectObjects([roots,trunks,leaves,mud],false).length)continue;out.push([x,z])}
 eyeSpots=out.length?out:[[bankX(-33,-1)-.6,-33]]}

// ---- post: kerosene and violet, fine grain, halation that only the hot things earn, and the black-to-dusk opening
const comp=new EffectComposer(R);comp.addPass(new RenderPass(S,cam));
const film=new ShaderPass({uniforms:{tDiffuse:{value:null},uT:{value:0},uF:{value:0},uR:{value:new THREE.Vector2()},uG:{value:new THREE.Vector2(2,2)},uGI:{value:0}},
 vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform sampler2D tDiffuse;uniform float uT,uF,uGI;uniform vec2 uR,uG;varying vec2 vUv;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;vec2 px=1./uR;vec3 b=vec3(0.);for(int i=0;i<16;i++){float a=float(i)*.3927;b+=texture2D(tDiffuse,vUv+vec2(cos(a),sin(a))*px*(7.+mod(float(i),2.)*9.)).rgb;}b/=16.;
  c+=max(b-.9,0.)*vec3(1.,.6,.3)*.7;
   vec2 gd=(vUv-uG)*vec2(uR.x/uR.y,1.);c+=vec3(1.,.55,.22)*uGI*(exp(-dot(gd,gd)/.16)*.42+exp(-dot(gd,gd)/.9)*.06);
  float l=dot(c,vec3(.2126,.7152,.0722));c=mix(c*vec3(.9,.88,1.14),c*vec3(1.1,.97,.8),smoothstep(.04,.5,l));
  vec2 q=vUv-.5;c*=1.-dot(q,q)*1.25;c+=(h(floor(vUv*uR/1.3)+fract(uT)*91.)-.5)*.02*(.4+l);gl_FragColor=vec4(c*uF,1.);}`});
comp.addPass(film);comp.addPass(new OutputPass());
// the render: contact shading where surfaces meet, glow only on true light sources, tuned to this world's scale and light
lux(R,S,cam,comp,{hemi:.6,ao:{radius:1,thickness:1.5,protect:[.04,.18]},bloom:{strength:.4,radius:.5,threshold:1.2}});

function size(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);comp.setSize(w,h);cam.aspect=rest.aspect=w/h;cam.updateProjectionMatrix();rest.updateProjectionMatrix();
 pose(rest,0,0);
 const k=phone?.5:1;rt.setSize(Math.round(w*DPR*k),Math.round(h*DPR*k));wU.uRes.value.set(w*DPR,h*DPR);
 film.uniforms.uR.value.set(w*DPR,h*DPR);ffU.uPx.value=h*DPR/(2*Math.tan(THREE.MathUtils.degToRad(cam.fov/2)));layout();schedule();findEyeSpots()}

// ---- the hand, the scroll, the words in the film layer
const FORCE=new URLSearchParams(location.search).has('raise'),EYES=new URLSearchParams(location.search).has('eyes');let hold=FORCE,pd=null,raise=0,firstRaise=false,sL=0,lastW=innerWidth;
cv.addEventListener('pointerdown',e=>{pd={y:e.clientY,t:performance.now()};if(e.pointerType==='mouse')hold=true});
addEventListener('pointermove',e=>{if(pd&&e.pointerType!=='mouse'&&Math.abs(e.clientY-pd.y)>12){pd=null;hold=false}});
const up=()=>{pd=null;hold=FORCE};addEventListener('pointerup',up);addEventListener('pointercancel',up);
addEventListener('keydown',e=>{if(e.key===' '&&document.activeElement===document.body){e.preventDefault();hold=true}});addEventListener('keyup',e=>{if(e.key===' ')hold=false});
const nameEl=document.getElementById('name'),capEl=document.getElementById('cap'),endEl=document.getElementById('book'),hintEl=document.getElementById('hint');let capI=-2;
addEventListener('resize',()=>{if(Math.abs(innerWidth-lastW)>innerWidth*.1||!phone){lastW=innerWidth;size()}});

// ---- sound, opt-in: the creek lapping, the lantern's hiss, one nightjar
let ac=null;const snd=document.getElementById('snd');
snd.addEventListener('click',()=>{if(!ac){ac=new AudioContext();const nb=ac.createBuffer(1,ac.sampleRate*4,ac.sampleRate),d=nb.getChannelData(0);let b=0;for(let i=0;i<d.length;i++){b=(b+.02*(Math.random()*2-1))/1.02;d[i]=b*3.5}
  const lap=ac.createBufferSource();lap.buffer=nb;lap.loop=true;const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=520;const lg=ac.createGain();lg.gain.value=.5;
  const lfo=ac.createOscillator();lfo.frequency.value=.23;const lfg=ac.createGain();lfg.gain.value=.3;lfo.connect(lfg).connect(lg.gain);lap.connect(lp).connect(lg).connect(ac.destination);lap.start();lfo.start();
  const wb=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate),wd=wb.getChannelData(0);for(let i=0;i<wd.length;i++)wd[i]=Math.random()*2-1;
  const hs=ac.createBufferSource();hs.buffer=wb;hs.loop=true;const hp=ac.createBiquadFilter();hp.type='highpass';hp.frequency.value=4200;const hg=ac.createGain();hg.gain.value=.012;hs.connect(hp).connect(hg).connect(ac.destination);hs.start();
  const jar=()=>{const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain(),am=ac.createOscillator(),ag=ac.createGain();o.frequency.value=1150;am.frequency.value=34;ag.gain.value=.5;am.connect(ag).connect(g.gain);
   g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.035,t+.3);g.gain.setValueAtTime(.035,t+2.4);g.gain.linearRampToValueAtTime(0,t+2.9);o.connect(g).connect(ac.destination);o.start(t);am.start(t);o.stop(t+3);am.stop(t+3);setTimeout(jar,11000+Math.random()*9000)};setTimeout(jar,3500);
  snd.textContent='Sound · on'}else if(ac.state==='running'){ac.suspend();snd.textContent='Sound · off'}else{ac.resume();snd.textContent='Sound · on'}});

// ---- the frame
let t0=performance.now(),last=t0,eyeT=-99,eyeNext=0,heldFor=0,eyeAt=0;
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;const t=(now-t0)/1000;
 const doc=document.getElementById('tide').offsetHeight-innerHeight,s=doc>0?Math.min(1,Math.max(0,scrollY/doc)):0;sL+=(s-sL)*Math.min(1,dt*2);
 U.uL.value=tideAt(sL);uRev.value.set(sm(1.2,4.2,t),sm(.2,.31,sL),sm(.45,.56,sL));water.position.y=U.uL.value;U.uT.value=ffU.uT.value=film.uniforms.uT.value=t;
 if(pd&&!hold&&performance.now()-pd.t>240)hold=true;
 raise+=((hold?1:0)-raise)*Math.min(1,dt*(hold?1.5:1.1));if(hold&&!firstRaise){firstRaise=true}
 heldFor=hold?heldFor+dt:0;
 // the arm: lifted, the lantern swings out past the rail and settles, and the light reaches the far bank
 lant.position.lerpVectors(LB,LUP,raise*raise*(3-2*raise));lant.position.x+=Math.sin(t*.8)*.012;lant.rotation.z=Math.sin(t*1.1)*.03;
 const fl=.93+.05*Math.sin(t*23)+.03*Math.sin(t*7.7)+.02*Math.sin(t*41);lamp.intensity=(70+160*raise*raise)*fl*sm(1.5,4.5,t);lamp.getWorldPosition(U.uLamp.value);U.uLampI.value=lamp.intensity;
 {const v=U.uLamp.value.clone().applyMatrix4(cam.matrixWorldInverse);const inF=v.z<0;v.applyMatrix4(cam.projectionMatrix);film.uniforms.uG.value.set(v.x*.5+.5,v.y*.5+.5);film.uniforms.uGI.value=inF?raise*fl*sm(1.5,4.5,t):0}
 // the eyes come only to a lantern held up, and they go out; they never fade
 if((heldFor>1.4||(EYES&&eyeT<0))&&t>eyeNext&&t-eyeT>2){eyeT=t;eyeNext=t+10+rnd()*12;const sp=eyeSpots[eyeAt++%eyeSpots.length];eyes.position.set(sp[0],H(sp[0],sp[1])+.55,sp[1]);eyes.lookAt(cam.position)}
 const eOn=(t-eyeT<1.35||EYES)&&raise>.55;eyes.visible=eOn;eyeM.color.setRGB(1.9*raise,1.5*raise,.3*raise);
 ffU.uOn.value=sm(6,10,t);ffU.uSync.value=Math.min(1,t/90);
 pose(cam,Math.sin(t*.21)*.0011,Math.sin(t*.33)*.0009);
 film.uniforms.uF.value=sm(2,6,t);
 // film layer
 nameEl.style.opacity=1-sm(.015,.06,sL);
 const ci=sL<.035?-1:sL<.26?0:sL<.51?1:-1;if(ci!==capI){capI=ci;capEl.classList.remove('on');setTimeout(()=>{if(capI>=0&&blocks[capI].p){capEl.textContent=blocks[capI].p;capEl.classList.add('on')}},500)}
 hintEl.style.opacity=(t>6&&!firstRaise&&sL<.78)?1:0;
 // two passes: the world without its water, then the water bending it
 if(document.body.classList.contains('past'))return;
 R.shadowMap.needsUpdate=true;water.visible=false;R.setRenderTarget(rt);R.render(S,cam);R.setRenderTarget(null);water.visible=true;comp.render()}
window.__bd={U,lamp,lant,eyes,cam,get raise(){return raise},get k(){return tideK},get rows(){return rows},get sL(){return sL}};
document.fonts.load('400 80px Stardom').catch(()=>{}).then(()=>{size();placePn();requestAnimationFrame(frame)});
