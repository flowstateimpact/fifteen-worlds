// Nouka: an electric nouka crossing the Buriganga from Sadarghat to Keraniganj, low sun in the haze behind the launches.
// Units are metres; the river surface is y=0, Sadarghat is the north bank (+z), Keraniganj the south (-z), upriver is west (-x).
// The camera sits in the boat a hand's width above the water. Scroll is the crossing; a line drawn on the water is the route the boat takes.
import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {lux} from './lib/lux.js';
await Promise.all([document.fonts.load("400 60px 'Tanker'"),document.fonts.load("400 40px 'Tiro Bangla'"),document.fonts.load("700 40px 'Supreme'")]).catch(()=>{});

const cv=document.getElementById('gl'),phone=innerWidth<700,DPR=Math.min(devicePixelRatio,phone?1.5:2),QS=new URLSearchParams(location.search);
const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});
R.setPixelRatio(DPR);R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=.95;
const S=new THREE.Scene();const HAZE=new THREE.Color().setRGB(.86,.81,.7);S.fog=new THREE.FogExp2(HAZE,.0046);
let seed=5;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const sm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};
const f=v=>`(${v.toFixed(4)})`;
const SUN=new THREE.Vector3(-.852,.074,.522).normalize();

// ---- sky: haze, warm toward the low sun behind Sadarghat's launches
const sky=new THREE.Mesh(new THREE.SphereGeometry(2400,48,24),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{uSun:{value:SUN}},
 vertexShader:`varying vec3 vW;void main(){vW=position;vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_Position=p.xyww;}`,
 fragmentShader:`uniform vec3 uSun;varying vec3 vW;void main(){vec3 d=normalize(vW);float y=max(d.y,0.);
  vec3 c=mix(vec3(.9,.83,.69),vec3(.42,.5,.58),pow(y,.42));float s=max(dot(d,uSun),0.);
  c+=vec3(1.,.64,.34)*(pow(s,2.)*.14+pow(s,6.)*.32+pow(s,60.)*.7)+vec3(1.,.82,.58)*smoothstep(.99987,.99993,s)*16.;
  gl_FragColor=vec4(c,1.);}`}));
sky.frustumCulled=false;S.add(sky);
const hemi=new THREE.HemisphereLight(new THREE.Color().setRGB(.8,.76,.66),new THREE.Color().setRGB(.16,.15,.1),.5);S.add(hemi);
const sun=new THREE.DirectionalLight(new THREE.Color().setRGB(1,.7,.44),3);sun.position.copy(SUN).multiplyScalar(100);S.add(sun);

// ---- the banks: launches moored bow-in along Sadarghat at three depths, the terminal behind them, Keraniganj's low line across the water
const box=new THREE.BoxGeometry(1,1,1),parts=[],lights=[],lparts=[];
function part(x,y,z,sx,sy,sz,c,ry=0){parts.push([x,y,z,sx,sy,sz,c,ry])}
function launch(x,z,len,c,ry=0,out=lparts,lit=false){const L=len,cy=Math.cos(ry),sy=Math.sin(ry),P=(lx,ly,lz,a,b,d,col)=>out.push([x+lx*cy+lz*sy,ly,z-lx*sy+lz*cy,a,b,d,col,ry]);
 P(0,1.4,0,11,4.2,L,c);P(0,4.4,-.02*L,10.8,2.4,L*.9,0xe9e4d6);P(0,6.9,-.05*L,10.8,2.4,L*.78,0xe4ddcb);P(0,9.3,-.18*L,10.4,2.3,L*.45,0xd9d2c0);
 P(0,3.45,-.02*L,11.1,.3,L*.9,0x2a2923);P(0,5.95,-.05*L,11.1,.3,L*.78,0x2a2923);P(0,8.35,-.18*L,10.7,.3,L*.45,0x2a2923);
 P(0,4.55,-.47*L-.06,10.2,1.5,.2,0x34332c);P(0,4,-.47*L-.14,10.2,.08,.1,0xe6e0d0);P(0,7.05,-.44*L-.06,10.2,1.5,.2,0x34332c);P(0,6.5,-.44*L-.14,10.2,.08,.1,0xe6e0d0);P(0,9.4,-.405*L-.06,9.8,1.4,.2,0x34332c);
 P(0,11.5,-.34*L,6.5,2.2,7,0xf0ece2);P(-2,13.4,.12*L,1.3,5,1.3,0x2b2a26);P(2,13.4,.12*L,1.3,5,1.3,0x2b2a26);
 // only the nearest launch is lit, one unbroken string along its middle deck (Anwar): a silhouette with lights is a launch
 for(let k=0;k<3;k++)for(let w=0;w<9;w++){const q=rnd()<.18;if(lit&&k===1)for(const h of[0,.046]){const lz=-L*.42+w*L*.0925+h*L;lights.push([x+5.35*cy+lz*sy,4.4+k*2.5,z-5.35*sy+lz*cy,ry])}}}
const HULLS=[0xd8d3c6,0x9d3b2e,0x2f4d6e,0x3e6b4c,0xc9b28a,0xe6e1d4];
for(let i=0;i<16;i++)launch(-72-i*17.5,126,52+rnd()*14,HULLS[i%6],0,lparts,i===0);
for(let i=0;i<14;i++)launch(-430-i*21,132,56,HULLS[(i+3)%6]);
for(let i=0;i<10;i++)launch(-900-i*26,136,60,HULLS[(i+1)%6]);
for(let i=0;i<9;i++)launch(70+i*19,128,50+rnd()*10,HULLS[(i+2)%6]);
part(-300,7,178,1100,14,22,0xb8ab94);part(-300,1,158,1400,2,16,0x6f6552);
const bparts=[];for(let i=0;i<60;i++){const x=-760+i*22+rnd()*8,h=5+rnd()*11;bparts.push([x,h/2+1.2,-212-rnd()*30,12+rnd()*10,h,12+rnd()*8,[0xc9a98f,0xd6c7a4,0x9fa3a0,0xb88c73,0xe0d8c6,0x7f8a86][i%6],0])}
part(-60,.6,-200,1600,2.4,56,0x5e5645);
// the start ghat at Sadarghat: steps into the water, green where the tide sits, a bamboo pole, a shed with solar on its roof
function steps(x0,x1,zw,dir,top){for(let k=0;k<11;k++){const y=-.4+k*.24,z=zw+dir*(k*.75+.375);part((x0+x1)/2,y-.6+.12,z,x1-x0,1.2+.24,.75,y>-.3&&y<.5?0x55613e:0xa8a293)}
 part((x0+x1)/2,top/2-.3,zw+dir*(11*.75+5),x1-x0+12,top+.6,10,0xb1ab9c)}
steps(-30,-8,101,1,2.4);steps(-74,-46,-166,-1,2.4);
part(-44,3.9,117,16,3,8,0xa9a18f);part(-44,5.5,117,17,.25,9,0x2d3440);
part(-60,4.3,-181,26,4.6,.6,0xe7e2d6);
const PM=new THREE.MeshStandardMaterial({roughness:.85});
const pm=new THREE.InstancedMesh(box,PM,parts.length);const M4=new THREE.Matrix4(),Q=new THREE.Quaternion(),V3=new THREE.Vector3(),SC=new THREE.Vector3(),C=new THREE.Color();
parts.forEach((p,i)=>{pm.setMatrixAt(i,M4.compose(V3.set(p[0],p[1],p[2]),Q.setFromAxisAngle(V3.clone().set(0,1,0),p[7]),SC.set(p[3],p[4],p[5])));pm.setColorAt(i,C.setHex(p[6]))});S.add(pm)
// the launches stand two stops deeper in the haze than the rest of the river (Anwar): soft silhouettes against the low sun, no hard edges
const LM=PM.clone();LM.onBeforeCompile=sh=>{sh.fragmentShader=sh.fragmentShader.replace('#include <fog_fragment>',`#ifdef USE_FOG
 float lf=clamp(.6+.4*(1.-exp(-pow(fogDensity*vFogDepth*1.8,2.))),0.,.97);gl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor*.93,lf);
#endif`)};
const lmesh=new THREE.InstancedMesh(box,LM,lparts.length);lparts.forEach((p,i)=>{lmesh.setMatrixAt(i,M4.compose(V3.set(p[0],p[1],p[2]),Q.setFromAxisAngle(new THREE.Vector3(0,1,0),p[7]),SC.set(p[3],p[4],p[5])));lmesh.setColorAt(i,C.setHex(p[6]))});S.add(lmesh);;
// Keraniganj's walls: one window grid painted once, stretched per building, soft enough in the haze
const wc=document.createElement('canvas');wc.width=wc.height=256;{const g=wc.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,256,256);for(let r=0;r<6;r++)for(let c=0;c<5;c++)if(rnd()<.8){g.fillStyle=`rgba(40,38,32,${.5+rnd()*.3})`;g.fillRect(14+c*48,18+r*40,26,20)}g.fillStyle='rgba(40,38,32,.35)';g.fillRect(0,0,256,8)}
const wT=new THREE.CanvasTexture(wc);wT.colorSpace=THREE.SRGBColorSpace;const bm=new THREE.InstancedMesh(box,new THREE.MeshStandardMaterial({map:wT,roughness:.9}),bparts.length);
bparts.forEach((p,i)=>{bm.setMatrixAt(i,M4.compose(V3.set(p[0],p[1],p[2]),Q.identity(),SC.set(p[3],p[4],p[5])));bm.setColorAt(i,C.setHex(p[6]))});S.add(bm);
const lm=new THREE.InstancedMesh(box,new THREE.MeshBasicMaterial({color:0xffffff}),lights.length);
lights.forEach((l,i)=>{lm.setMatrixAt(i,M4.compose(V3.set(l[0],l[1],l[2]),Q.setFromAxisAngle(new THREE.Vector3(0,1,0),l[3]),SC.set(.2,.9,1.6)));lm.setColorAt(i,C.setRGB(2.2,1.45,.7))});S.add(lm);
// the solar roof tilts to the sun; bamboo poles at both ghats; wooden noukas moored at Keraniganj
const solar=new THREE.Mesh(new THREE.BoxGeometry(16,.12,8.4),new THREE.MeshStandardMaterial({color:0x1d2632,roughness:.25,metalness:.4}));solar.position.set(-44,5.8,117);solar.rotation.z=.18;S.add(solar);
const bam=new THREE.MeshStandardMaterial({color:0x8a7a52,roughness:.7});
for(const[x,z,h,l]of[[-6,99.5,5.2,.05],[-33,100,4.4,-.08],[-40,-163.5,4.8,.06],[-80,-162.5,5,-.05]]){const b=new THREE.Mesh(new THREE.CylinderGeometry(.045,.06,h,10),bam);b.position.set(x,h/2-.8,z);b.rotation.z=l;S.add(b)}
const wood=new THREE.MeshStandardMaterial({color:0x3a2c1e,roughness:.8});
for(const[x,z,r]of[[-86,-160,.2],[-96,-158,-.1],[-36,-160.5,.05]]){const g=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,9,16,1,false,0,Math.PI),wood);g.rotation.set(0,r,Math.PI/2);g.scale.set(1,1,.45);g.position.set(x,.25,z);S.add(g)}
// the drifter: one launch that pulls out while you watch, and sounds its horn
const dparts=[],l0=lights.length;launch(0,0,58,0x9d3b2e,Math.PI/2,dparts,true);const dl=lights.splice(l0);const drift=new THREE.InstancedMesh(box,LM,dparts.length);
dparts.forEach((p,i)=>{drift.setMatrixAt(i,M4.compose(V3.set(p[0],p[1],p[2]),Q.setFromAxisAngle(new THREE.Vector3(0,1,0),p[7]),SC.set(p[3],p[4],p[5])));drift.setColorAt(i,C.setHex(p[6]))});S.add(drift);drift.position.set(-230,0,70);
// the drifter is the launch in view, so it carries the one string of lit windows, fixed to it as it pulls out
const dlm=new THREE.InstancedMesh(box,lm.material,dl.length);dl.forEach((l,i)=>{dlm.setMatrixAt(i,M4.compose(V3.set(l[0],l[1],l[2]),Q.setFromAxisAngle(new THREE.Vector3(0,1,0),l[3]),SC.set(.2,.9,1.6)));dlm.setColorAt(i,C.setRGB(2.2,1.45,.7))});drift.add(dlm);
// the timetable painted on the Keraniganj ghat wall, Bangla above English
const tw=document.createElement('canvas');tw.width=2048;tw.height=380;{const g=tw.getContext('2d');g.fillStyle='#ece7da';g.fillRect(0,0,2048,380);
 for(let i=0;i<900;i++){g.fillStyle=`rgba(90,80,60,${rnd()*.06})`;g.fillRect(rnd()*2048,rnd()*380,rnd()*40,rnd()*6)}
 g.fillStyle='#1f3d7a';g.font="400 92px 'Tiro Bangla'";g.fillText('সদরঘাট ⇄ কেরানীগঞ্জ · প্রতি ১২ মিনিট · ৳ ২০',70,130);
 g.font="700 58px 'Supreme'";g.fillText('Sadarghat ⇄ Keraniganj · every 12 minutes · 05:30 to 23:30 · ৳ 20',74,235);
 g.fillStyle='#9d2e22';g.font="400 70px 'Tanker'";g.fillText('NOUKA',74,330);g.fillStyle='rgba(60,70,40,.35)';g.fillRect(0,340,2048,40)}
const wallT=new THREE.CanvasTexture(tw);wallT.colorSpace=THREE.SRGBColorSpace;wallT.anisotropy=8;
const wall=new THREE.Mesh(new THREE.PlaneGeometry(24,24*380/2048),new THREE.MeshStandardMaterial({map:wallT,roughness:.95}));wall.position.set(-60,4.4,-180.6);S.add(wall);

// ---- our boat: white painted wood, the camera sitting low by the left gunwale, the bow off to the right, the fare board on the rail
const boat=new THREE.Group();S.add(boat);
const paint=new THREE.MeshStandardMaterial({color:0xf2efe7,roughness:.55,side:THREE.DoubleSide});
function rail(pts){const c=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p)));return new THREE.Mesh(new THREE.TubeGeometry(c,40,.035,8,false),paint)}
const LR=[[-.78,.34,1.4],[-.74,.34,.3],[-.52,.34,-.9],[0,.36,-2.05]],RR=LR.map(([x,y,z])=>[-x,y,z]);boat.add(rail(LR),rail(RR));
function skin(pts,side){const g=new THREE.BufferGeometry(),c=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p))),v=[],N=30;
 const uv=[];for(let i=0;i<=N;i++){const p=c.getPoint(i/N);v.push(p.x,p.y,p.z,p.x*.82,.02,p.z*.96);uv.push(i/N,1,i/N,0)}const idx=[];for(let i=0;i<N;i++){const a=i*2;side>0?idx.push(a,a+1,a+2,a+1,a+3,a+2):idx.push(a,a+2,a+1,a+1,a+2,a+3)}
 g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return new THREE.Mesh(g,plankM)}
// the planks: white paint over five strakes, the bilge worn back to brown wood where feet and water sit
const pk=document.createElement('canvas');pk.width=512;pk.height=128;{const g=pk.getContext('2d');g.fillStyle='#ebe5d7';g.fillRect(0,0,512,128);const bg=g.createLinearGradient(0,128,0,70);bg.addColorStop(0,'rgba(110,88,60,.95)');bg.addColorStop(1,'rgba(110,88,60,0)');g.fillStyle=bg;g.fillRect(0,70,512,58);
 for(let k=1;k<5;k++){g.fillStyle='rgba(70,60,44,.3)';g.fillRect(0,k*25.6-1,512,2)}for(let i=0;i<140;i++){g.fillStyle=`rgba(90,72,48,${rnd()*.18})`;g.fillRect(rnd()*512,60+rnd()*68,3+rnd()*22,1+rnd()*3)}}
const plankT=new THREE.CanvasTexture(pk);plankT.colorSpace=THREE.SRGBColorSpace;const plankM=new THREE.MeshStandardMaterial({map:plankT,roughness:.75,side:THREE.DoubleSide});
boat.add(skin(LR,-1),skin(RR,1));
const thw=new THREE.MeshStandardMaterial({color:0x6e5a40,roughness:.85});for(const[z,w]of[[.85,1.28]]){const b=new THREE.Mesh(new THREE.BoxGeometry(w,.035,.2),thw);b.position.set(0,.27,z);boat.add(b)}
{const sh=new THREE.Shape();const o=[...LR.map(([x,,z])=>[x*.8,z]),...RR.slice().reverse().map(([x,,z])=>[x*.8,z])];o.forEach(([x,z],i)=>i?sh.lineTo(x,-z):sh.moveTo(x,-z));
 const dk=new THREE.Mesh(new THREE.ShapeGeometry(sh),new THREE.MeshStandardMaterial({color:0x6b5a44,roughness:.9,side:THREE.DoubleSide}));dk.rotation.x=-Math.PI/2;dk.position.y=.06;boat.add(dk)}
const stem=document.createElement('canvas');stem.width=64;stem.height=256;{const g=stem.getContext('2d');g.fillStyle='#f2efe7';g.fillRect(0,0,64,256);g.fillStyle='#6b5536';for(let i=0;i<40;i++){const y=170+rnd()*86;g.fillRect(rnd()*64,y,4+rnd()*14,2+rnd()*5)}g.fillStyle='#2f6f66';g.fillRect(0,34,64,5)}
const stemT=new THREE.CanvasTexture(stem);stemT.colorSpace=THREE.SRGBColorSpace;
const stemM=new THREE.Mesh(new THREE.BoxGeometry(.06,.5,.06),new THREE.MeshStandardMaterial({map:stemT,roughness:.6}));stemM.position.set(0,.13,-2.07);boat.add(stemM);
const fb=document.createElement('canvas');fb.width=512;fb.height=300;{const g=fb.getContext('2d');g.fillStyle='#24476e';g.fillRect(0,0,512,300);g.strokeStyle='#e9e2cf';g.lineWidth=8;g.strokeRect(14,14,484,272);
 g.fillStyle='#f3ecd9';g.font="400 104px 'Tiro Bangla'";g.textAlign='center';g.fillText('নৌকা ৪',256,120);g.font="400 58px 'Tiro Bangla'";g.fillText('ভাড়া ২০ টাকা',256,200);g.font="700 34px 'Supreme'";g.fillText('FARE ৳ 20',256,258)}
const fbT=new THREE.CanvasTexture(fb);fbT.colorSpace=THREE.SRGBColorSpace;fbT.anisotropy=8;
const board=new THREE.Mesh(new THREE.PlaneGeometry(.24,.141),new THREE.MeshStandardMaterial({map:fbT,roughness:.7}));board.position.set(-.3,.4,1.3);board.rotation.set(-.12,Math.PI+.2,0);boat.add(board);
const cam=new THREE.PerspectiveCamera(phone?60:40,innerWidth/innerHeight,.05,5000);const EYE=new THREE.Vector3(phone?-.5:-.58,.5,.15),YAW=phone?.52:.42,YAW1=phone?-.03:-.04,PITCH=-.03;boat.add(cam);

// ---- the route: a spline over the water; scroll moves the boat along it, a drawn line replaces what lies ahead
const START=new THREE.Vector3(0,0,95),END=new THREE.Vector3(-60,0,-162);
const DEF=[[0,95],[-18,90],[-40,62],[-55,10],[-62,-60],[-62,-120],[-60,-162]];
let route={c:new THREE.CatmullRomCurve3(DEF.map(([x,z])=>new THREE.Vector3(x,0,z)),false,'centripetal'),s0:0,auto:0,autoEnd:0};route.len=route.c.getLength();
let u=0,heading=(()=>{const d=route.c.getTangentAt(1e-4);return Math.atan2(-d.x,-d.z)})();
const P=new THREE.Vector3(),T=new THREE.Vector3();
function place(uu,dt,t,sp){route.c.getPointAt(Math.min(1,Math.max(0,uu)),P);route.c.getTangentAt(Math.min(1,Math.max(1e-4,uu)),T);
 const want=Math.atan2(-T.x,-T.z);let dh=want-heading;dh=Math.atan2(Math.sin(dh),Math.cos(dh));heading+=dh*Math.min(1,dt*1.6);
 boat.position.set(P.x,Math.sin(t*1.3)*.025,P.z);boat.rotation.set(Math.sin(t*1.1)*.012,heading,Math.sin(t*.9+1)*.018);
 const yb=YAW+(YAW1-YAW)*sm(.6,.88,sp),tb=sm(.9,1,sp);cam.position.copy(EYE);cam.rotation.set(PITCH+tb*.05,yb+tb*((phone?3.2:3)-yb),0,'YXZ')}
place(0,1,0,0);boat.updateMatrixWorld(true);
const PV0=new THREE.Matrix4().multiplyMatrices(cam.projectionMatrix,cam.matrixWorldInverse);

// ---- the name, a hand below the surface: laid out flat on the screen as you arrive, then left there in the water for the boat to cross
const nc=document.createElement('canvas');nc.width=1600;nc.height=Math.round(1600/cam.aspect);{const g=nc.getContext('2d'),W=nc.width,H=nc.height;g.fillStyle='#000';g.fillRect(0,0,W,H);
 g.fillStyle='#fff';g.textAlign='center';g.textBaseline='alphabetic';let fs=W*(phone?.3:.2);g.font=`400 ${fs}px 'Tanker'`;const w=g.measureText('NOUKA').width,k=W*(phone?.84:.4)/w;fs*=k;g.font=`400 ${fs}px 'Tanker'`;
 g.filter='blur(3px)';g.fillText('NOUKA',W*(phone?.5:.44),H*(phone?.62:.7))}
const nameT=new THREE.CanvasTexture(nc);

// ---- the river: brown-green Buriganga, a planar reflection of everything above it, the current's chop,
// and a wake built from twelve impulses dropped at the bow, each a ring that spreads and dies in about four seconds
const refRT=new THREE.WebGLRenderTarget(8,8,{type:THREE.HalfFloatType});const mcam=new THREE.PerspectiveCamera();
const slots=[...Array(12)].map(()=>new THREE.Vector4(0,0,-99,0));let slotI=0;
const WU={uRef:{value:refRT.texture},uName:{value:nameT},uR:{value:new THREE.Vector2()},uCam:{value:new THREE.Vector3()},uSun:{value:SUN},uFog:{value:HAZE},uT:{value:0},uNA:{value:0},uFD:{value:.0046},uPV0:{value:PV0},uS:{value:slots},uOil:{value:new THREE.Vector2(-19,100.5)}};
const water=new THREE.Mesh(new THREE.PlaneGeometry(4000,4000),new THREE.ShaderMaterial({uniforms:WU,fog:false,
 vertexShader:`varying vec3 vW;void main(){vW=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vW,1.);}`,
 fragmentShader:`uniform sampler2D uRef,uName;uniform vec2 uR,uOil;uniform vec3 uCam,uSun,uFog;uniform float uT,uNA,uFD;uniform mat4 uPV0;uniform vec4 uS[12];varying vec3 vW;
 float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hs(i),hs(i+vec2(1,0)),f.x),mix(hs(i+vec2(0,1)),hs(i+vec2(1,1)),f.x),f.y);}
 float wk(vec2 p){float h=0.;for(int i=0;i<12;i++){vec4 s=uS[i];float a=uT-s.z;if(a<0.||a>5.)continue;float r=length(p-s.xy),x=r-1.6*a-.3;h+=s.w*exp(-a*.75)*sin(x*3.6)*exp(-x*x*.9)/(1.+r*.35);}return h;}
 float fm(vec2 p){float q=0.;for(int i=0;i<12;i++){vec4 s=uS[i];float a=uT-s.z;if(a<0.||a>4.)continue;float r=length(p-s.xy);q+=s.w*(1.-a/4.)*(exp(-pow(r-1.6*a-.3,2.)*5.)*.6+exp(-r*r*.8)*(1.-a/1.5)*step(a,1.5));}return q;}
 void main(){vec2 p=vW.xz;float d=length(uCam-vW);
  vec2 g=vec2(0.);for(int i=0;i<5;i++){float fi=float(i),a=fi*1.9+.3;vec2 k=vec2(cos(a),sin(a))*(1.3+fi*1.1);g+=k*cos(dot(p,k)+uT*(1.1+fi*.55)+fi*2.)*(.028/(1.+fi*.7));}
  g*=1./(1.+d*.035);float e=.06,h0=wk(p);g+=vec2(wk(p+vec2(e,0.))-h0,wk(p+vec2(0.,e))-h0)/e;
  vec3 N=normalize(vec3(-g.x,1.,-g.y)),V=normalize(vW-uCam);float F=.02+.98*pow(1.-max(dot(-V,N),0.),5.);
  vec2 su=gl_FragCoord.xy/uR;vec3 ref=texture2D(uRef,vec2(su.x,1.-su.y)+vec2(N.x,N.z)*.07/(1.+d*.03)).rgb;
  vec3 Tr=refract(V,normalize(vec3(-g.x*.35,1.,-g.y*.35)),.75);vec3 q=vW+Tr*(-.3/min(Tr.y,-.08));vec4 c0=uPV0*vec4(q,1.);vec2 nu=c0.xy/c0.w*.5+.5;float nm=0.;
  if(c0.w>0.&&nu.x>0.&&nu.x<1.&&nu.y>0.&&nu.y<1.)nm=texture2D(uName,nu).r;
  vec3 body=vec3(.095,.092,.05)+vec3(.06,.052,.028)*smoothstep(0.,.3,dot(-V,uSun));
  body=mix(body,vec3(.93,.88,.74),nm*uNA*.8);
  vec3 col=mix(body,ref,F*(1.-nm*uNA*.75));
  vec3 H=normalize(uSun-V);col+=vec3(1.,.7,.42)*pow(max(dot(N,H),0.),420.)*16.;
  col+=vec3(.9,.88,.8)*min(fm(p),1.)*.6;
  float oil=smoothstep(9.,2.,length(p-uOil))*smoothstep(.5,.8,vn(p*.3+uT*.03));col+=col*oil*.25*(.5+.5*cos(6.2832*(vn(p*1.4)*2.+vec3(0.,.33,.67))));
  col=mix(col,uFog,1.-exp(-pow(d*uFD,2.)));gl_FragColor=vec4(col,1.);}`}));
water.rotation.x=-Math.PI/2;S.add(water);

// ---- the lens: haze on brown water. Fine grain, halation on the sun and its path
const comp=new EffectComposer(R);comp.addPass(new RenderPass(S,cam));
const _sd=new THREE.Vector3(),_sp=new THREE.Vector3();
const film=new ShaderPass({uniforms:{tDiffuse:{value:null},uT:{value:0},uF:{value:0},uR:{value:new THREE.Vector2()},uSS:{value:new THREE.Vector3(.5,.5,0)}},
 vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform sampler2D tDiffuse;uniform float uT,uF;uniform vec2 uR;uniform vec3 uSS;varying vec2 vUv;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;vec2 px=1./uR;vec3 b=vec3(0.);for(int i=0;i<16;i++){float a=float(i)*.3927;b+=texture2D(tDiffuse,vUv+vec2(cos(a),sin(a))*px*(9.+mod(float(i),2.)*14.)).rgb;}b/=16.;
  c+=max(b-.9,0.)*vec3(1.,.6,.32)*.6;
  // fog is not one colour: it glows warm toward the low sun and falls cool and deeper away from it
  vec2 sd=(vUv-uSS.xy)*vec2(uR.x/uR.y,1.);float sg=exp(-dot(sd,sd)*1.5)*uSS.z,far=1.-exp(-dot(sd,sd)*.55);
  c*=mix(vec3(1.),vec3(.84,.86,.9),far*.7);c+=vec3(1.,.6,.3)*sg*.34;
  float l=dot(c,vec3(.2126,.7152,.0722));c=mix(c*vec3(.98,.97,.8),c*vec3(1.02,1.01,.97),smoothstep(.05,.7,l));
  vec2 q=vUv-.5;c*=1.-dot(q,q)*.9;c+=(h(floor(vUv*uR/1.4)+fract(uT)*61.)-.5)*.026*(.3+l);gl_FragColor=vec4(c*uF,1.);}`});
comp.addPass(film);comp.addPass(new OutputPass());
// the render: contact shading where surfaces meet, glow only on true light sources, tuned to this world's scale and light
lux(R,S,cam,comp,{hemi:.7,ao:{radius:1.2,thickness:2,protect:[.15,.6]},bloom:{strength:.3,radius:.55,threshold:1.6}});
function size(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);comp.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix();film.uniforms.uR.value.set(w*DPR,h*DPR);WU.uR.value.set(w*DPR,h*DPR);refRT.setSize(Math.round(w*DPR*.5),Math.round(h*DPR*.5))}
let lastW=innerWidth;addEventListener('resize',()=>{if(!phone||Math.abs(innerWidth-lastW)>innerWidth*.1){lastW=innerWidth;size()}});size();
const clip=[new THREE.Plane(new THREE.Vector3(0,1,0),.02)],U=new THREE.Vector3(),Fw=new THREE.Vector3(),Cp=new THREE.Vector3();
function reflect(){cam.getWorldPosition(Cp);cam.getWorldDirection(Fw);U.set(0,1,0).applyQuaternion(cam.getWorldQuaternion(new THREE.Quaternion()));
 mcam.position.set(Cp.x,-Cp.y,Cp.z);mcam.up.set(-U.x,U.y,-U.z);mcam.lookAt(Cp.x+Fw.x,-(Cp.y+Fw.y),Cp.z+Fw.z);mcam.projectionMatrix.copy(cam.projectionMatrix);mcam.projectionMatrixInverse.copy(cam.projectionMatrixInverse);
 water.visible=false;R.clippingPlanes=clip;R.setRenderTarget(refRT);R.render(S,mcam);R.setRenderTarget(null);R.clippingPlanes=[];water.visible=true}

// ---- sound, opt-in: water against the hull and nothing else; the launch's horn once
let ac=null,master=null,sndOn=false,lap=null;const sndB=document.getElementById('snd');
sndB.onclick=()=>{if(!ac){try{ac=new AudioContext();master=ac.createGain();master.connect(ac.destination);const b=ac.createBuffer(1,ac.sampleRate*4,ac.sampleRate),d=b.getChannelData(0);let y=0;for(let i=0;i<d.length;i++){y=y*.97+(Math.random()*2-1)*.03;d[i]=y*3}
 const s=ac.createBufferSource();s.buffer=b;s.loop=true;const bp=ac.createBiquadFilter();bp.type='bandpass';bp.frequency.value=520;bp.Q.value=.8;lap=ac.createGain();lap.gain.value=.25;s.connect(bp);bp.connect(lap);lap.connect(master);s.start()}catch(e){return}}
 sndOn=!sndOn;ac.resume();master.gain.value=sndOn?1:0;sndB.textContent='Sound · '+(sndOn?'on':'off')};
function horn(){if(!sndOn)return;const t=ac.currentTime,g=ac.createGain(),lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=700;g.connect(master);lp.connect(g);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.16,t+.25);g.gain.setValueAtTime(.16,t+1.9);g.gain.linearRampToValueAtTime(0,t+2.6);
 for(const fr of[98,123.5,196]){const o=ac.createOscillator();o.type='sawtooth';o.frequency.value=fr;o.connect(lp);o.start(t);o.stop(t+2.7)}}

// ---- the hand: drag a line on the water; on release the boat takes it, and cruises along it by itself
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),wp=new THREE.Plane(new THREE.Vector3(0,1,0),0),hit=new THREE.Vector3();
const lineG=new THREE.BufferGeometry(),lineM=new THREE.LineBasicMaterial({color:0xf5f1ea,transparent:true,opacity:0,fog:true}),line=new THREE.Line(lineG,lineM);S.add(line);
let drawing=null,lineFade=0;const hint=document.getElementById('hint');
function onWater(e){ndc.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);ray.setFromCamera(ndc,cam);if(!ray.ray.intersectPlane(wp,hit))return null;if(hit.distanceTo(boat.position)>160)return null;return hit.clone().setY(0)}
cv.addEventListener('pointerdown',e=>{const p=onWater(e);if(!p)return;drawing=[boat.position.clone().setY(0),p];cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointermove',e=>{if(!drawing)return;const p=onWater(e);if(p&&p.distanceTo(drawing[drawing.length-1])>2.5){drawing.push(p);lineG.setFromPoints(drawing.map(v=>v.clone().setY(.04)));lineM.opacity=.85}});
cv.addEventListener('pointerup',()=>{if(drawing&&drawing.length>=3&&sp<.9){const o=drawing[0].clone();let md=0;for(const v of drawing)md=Math.max(md,v.distanceTo(o));const k=Math.max(1,Math.min(12,70/Math.max(md,.1)));
  // from a hand's width above the water a stroke only covers the nearest few metres, so it is stretched out across the river
  const pts=drawing.map(v=>{v.sub(o).multiplyScalar(k).add(o);v.z=Math.max(-150,Math.min(v.x<-50?78:92,v.z));return v});lineG.setFromPoints(pts.map(v=>v.clone().setY(.04)));const c=new THREE.CatmullRomCurve3([...pts,END],false,'centripetal');
  const len=c.getLength(),lens=c.getLengths(200),dl=new THREE.CatmullRomCurve3(pts,false,'centripetal').getLength();route={c,len,s0:sp,auto:0,autoEnd:Math.min(.9,dl/len)};u=0;lineFade=1;hint.style.opacity=0}
 drawing=null});
cv.addEventListener('pointercancel',()=>drawing=null);

// ---- the frame
const drv=document.getElementById('drv'),ov=document.getElementById('ov'),sub=document.getElementById('sub'),scrim=document.getElementById('scrim'),beats=[...document.querySelectorAll('.beat')];
const bow=new THREE.Vector3(),lastBow=new THREE.Vector3(1e9,0,0);let sp=0,horned=false,rippled=false;const t0=performance.now();let last=t0;
window.__nk={cam,boat,route:()=>route,slots,WU,get u(){return u}};const SPQ=QS.has('sp')?+QS.get('sp'):null;
function emit(x,z,t,w){slots[slotI].set(x,z,t,w);slotI=(slotI+1)%12}
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;const t=(now-t0)/1000;
 sp=Math.max(0,Math.min(1,scrollY/Math.max(1,drv.offsetHeight-innerHeight)));if(SPQ!==null)sp=SPQ;if(scrollY>drv.offsetHeight+innerHeight*.2)return;
 const us=Math.max(0,Math.min(1,(sp-route.s0)/Math.max(.001,1-route.s0)));if(route.auto<route.autoEnd)route.auto=Math.min(route.autoEnd,route.auto+dt*2.6/route.len);
 const tgt=Math.max(us,route.auto),maxStep=dt*14/route.len;u+=Math.max(-maxStep,Math.min(maxStep,(tgt-u)*Math.min(1,dt*1.8)));if(SPQ!==null)u=us;
 place(u,dt,t,sp);
 bow.set(0,0,-2.05).applyMatrix4(boat.matrixWorld);bow.y=0;const mv=bow.distanceTo(lastBow);if(mv>.4){if(mv<5)emit(bow.x,bow.z,t,Math.min(1,mv/dt/3.5)*.9);lastBow.copy(bow)}
 if(t>6&&!rippled){rippled=true;const c=new THREE.Vector3(-1.9,0,-2.2).applyMatrix4(boat.matrixWorld);emit(c.x,c.z,t,.4)}
 WU.uNA.value=sm(6,9.5,t);WU.uT.value=t;cam.getWorldPosition(WU.uCam.value);
 const dx=sm(3,26,t);drift.position.set(-230+dx*95,Math.sin(t*.4)*.1,70-dx*8);if(t>3.4&&!horned){horned=true;horn()}
 if(lap&&sndOn)lap.gain.value=.18+.12*Math.sin(t*1.3);
 lineFade=Math.max(0,lineFade-dt/6);if(!drawing)lineM.opacity=.85*lineFade;
 film.uniforms.uT.value=t;film.uniforms.uF.value=sm(0,1.6,t);{const d=_sd.set(0,0,-1).applyQuaternion(cam.quaternion).dot(SUN),u=film.uniforms.uSS.value;_sp.copy(SUN).multiplyScalar(1e3).add(cam.position).project(cam);if(d>.02){u.x=_sp.x*.5+.5;u.y=_sp.y*.5+.5}else{const r=_sd.set(1,0,0).applyQuaternion(cam.quaternion).dot(SUN);u.x=r>0?1.7:-.7;u.y=.55}u.z=sm(-.5,.4,d)}
 sub.style.opacity=scrim.style.opacity=1-sm(.04,.1,sp);for(const b of beats)b.classList.toggle('on',sp>+b.dataset.a&&sp<+b.dataset.b);ov.classList.toggle('off',sp>.985);
 boat.updateMatrixWorld(true);reflect();comp.render()}
requestAnimationFrame(frame);
