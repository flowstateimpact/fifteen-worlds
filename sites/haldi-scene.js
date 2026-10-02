// A pillowcase in the morning, seen from 30 cm up. Units are centimetres.
// The oil is clear and gold and bends the weave under it; left alone it soaks in, and the cloth keeps the yellow.
import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {BokehPass} from 'three/addons/postprocessing/BokehPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {lux} from './lib/lux.js';

const hero=document.querySelector('.hero'),cv=document.getElementById('gl'),veil=document.getElementById('veil');
const phone=innerWidth<760,DPR=Math.min(devicePixelRatio,phone?1.5:2);
const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});
R.setPixelRatio(DPR);R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.1;
const S=new THREE.Scene();S.background=new THREE.Color(0xf3ede3);
// what the oil and the glass reflect: a dim room with one bright east window, nothing overhead, so a drop seen from above stays dark and clear
{const e=new THREE.Scene();e.add(new THREE.Mesh(new THREE.BoxGeometry(100,60,100),new THREE.MeshBasicMaterial({color:new THREE.Color(.3,.28,.25),side:THREE.BackSide})));
 const w=new THREE.Mesh(new THREE.PlaneGeometry(34,26),new THREE.MeshBasicMaterial({color:new THREE.Color(7,6.7,6.2)}));w.position.set(49,14,-14);w.rotation.y=-Math.PI/2;e.add(w);
 const f=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.MeshBasicMaterial({color:new THREE.Color(.62,.59,.54)}));f.rotation.x=-Math.PI/2;f.position.y=-29;e.add(f);
 S.environment=new THREE.PMREMGenerator(R).fromScene(e,.02).texture}
let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const sm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};

// ---- where things sit (phones get a narrower, taller frame)
const P=phone?{look:[.9,-.2],bottle:[2.0,-3.4],tag:[1.1,2.7,.12],auto:[-.7,-.4],fov:27}
             :{look:[0,0],bottle:[3.2,-1.3],tag:[4.3,2.5,.24],auto:[-2.4,-1.5],fov:14.2};

// ---- the weave: plain cotton, each thread a little cylinder with its twist, large enough to count
const TP=1024,NT=16,CELL=TP/NT,TILE=2.4;
function weave(){const A=document.createElement('canvas'),H=document.createElement('canvas');A.width=A.height=H.width=H.height=TP;
 const ga=A.getContext('2d'),gh=H.getContext('2d');ga.fillStyle='#d6cdbd';ga.fillRect(0,0,TP,TP);gh.fillStyle='#000';gh.fillRect(0,0,TP,TP);
 const wWarp=[...Array(NT)].map(()=>.74+rnd()*.14),wWeft=[...Array(NT)].map(()=>.7+rnd()*.16);
 const thread=(g,x,y,len,w,vert,al)=>{g.save();g.translate(x,y);if(!vert)g.rotate(Math.PI/2);
  const gr=g.createLinearGradient(-w/2,0,w/2,0);
  if(al){gr.addColorStop(0,'#d3c9b8');gr.addColorStop(.32,'#fbf9f4');gr.addColorStop(.62,'#f5f0e7');gr.addColorStop(1,'#c9bfad')}
  else{gr.addColorStop(0,'#262626');gr.addColorStop(.42,'#ffffff');gr.addColorStop(1,'#262626')}
  g.fillStyle=gr;g.beginPath();g.roundRect(-w/2,-len/2,w,len,w*.46);g.fill();
  const ge=g.createLinearGradient(0,-len/2,0,len/2),d=al?'rgba(80,62,44,.3)':'rgba(0,0,0,.75)';
  ge.addColorStop(0,d);ge.addColorStop(.2,'rgba(0,0,0,0)');ge.addColorStop(.8,'rgba(0,0,0,0)');ge.addColorStop(1,d);g.fillStyle=ge;g.fill();
  g.clip();g.strokeStyle=al?'rgba(110,90,70,.14)':'rgba(0,0,0,.32)';g.lineWidth=1.5;
  for(let k=-len;k<len;k+=w*.3){g.beginPath();g.moveTo(-w/2,k);g.lineTo(w/2,k+w*.6);g.stroke()}
  g.restore()};
 for(let j=0;j<NT;j++)for(let i=0;i<NT;i++){const cx=(i+.5)*CELL,cy=(j+.5)*CELL,up=(i+j)%2===0,slub=.94+rnd()*.12;
  for(const [g,al] of [[ga,true],[gh,false]])up?thread(g,cx,cy,CELL*1.1,CELL*wWarp[i]*slub,true,al):thread(g,cx,cy,CELL*1.1,CELL*wWeft[j]*slub,false,al)}
 const ta=new THREE.CanvasTexture(A),th=new THREE.CanvasTexture(H);ta.colorSpace=THREE.SRGBColorSpace;
 for(const t of[ta,th]){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(40/TILE,40/TILE);t.anisotropy=R.capabilities.getMaxAnisotropy()}
 return[ta,th]}
const [wA,wH]=weave();

// ---- the stain: baked stains live in a canvas; a stain still soaking is drawn live in the cloth's shader
const SR=phone?1024:2048,stC=document.createElement('canvas');stC.width=stC.height=SR;const sg=stC.getContext('2d');sg.fillStyle='#000';sg.fillRect(0,0,SR,SR);
const stT=new THREE.CanvasTexture(stC);
const soakU={value:[0,1,2,3].map(()=>new THREE.Vector4(0,0,0,-1))};
const clothM=new THREE.MeshStandardMaterial({map:wA,bumpMap:wH,bumpScale:1.6,roughness:.93,envMapIntensity:.22});
clothM.onBeforeCompile=sh=>{sh.uniforms.uStain={value:stT};sh.uniforms.uSoak=soakU;
 sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 vS;varying vec3 vPw;')
  .replace('#include <uv_vertex>','#include <uv_vertex>\nvS=uv;vPw=(modelMatrix*vec4(position,1.)).xyz;');
 sh.fragmentShader=sh.fragmentShader.replace('#include <common>',`#include <common>
 varying vec2 vS;varying vec3 vPw;uniform sampler2D uStain;uniform vec4 uSoak[4];
 float hsh(float n){return fract(sin(n*127.1+311.7)*43758.5453);}
 float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);float n=i.x+i.y*57.;return mix(mix(hsh(n),hsh(n+1.),f.x),mix(hsh(n+57.),hsh(n+58.),f.x),f.y);}
 // turmeric on cotton: the oil wicks along the threads, so the edge is ragged and steps with the weave (some threads carry it further);
 // the dye rides the wet front and dries into a darker tide line round a paler middle. rw = how far the tide line has formed.
 float stainV(float r,vec2 p,float rw){vec2 tq=(p+20.)/.15;
  float lobe=(vn(p*.9)-.5)*.16+(vn(p*2.7)-.5)*.06;
  float wick=.07*pow(max(hsh(floor(tq.x)),hsh(floor(tq.y)+91.)),4.)+.03*hsh(floor(tq.x)*1.3+floor(tq.y)*7.1)+(vn(p*9.)-.5)*.03;
  float e=r/(1.+lobe+wick);if(e>=1.)return 0.;
  float body=mix(.56,.7,smoothstep(.1,.88,e)),ring=exp(-pow((e-.925)/.05,2.))*.26*rw;
  return (body+ring)*(1.-smoothstep(.955,1.,e));}
 float soakAt(vec2 p){float a=0.;for(int i=0;i<4;i++){vec4 s=uSoak[i];if(s.w<0.)continue;float g=s.w;
  vec2 d=(p-s.xy)/(s.z*mix(.5,1.,g));d.y/=mix(1.,1.12,g);a=max(a,stainV(length(d),p,g*g)*g);}return a;}`)
  .replace('#include <map_fragment>',`#include <map_fragment>
 float qB=texture2D(uStain,vS).r;float st=max(qB>.004?stainV((1.-qB)*1.25,vPw.xz,1.):0.,soakAt(vPw.xz));
 float th=texture2D(bumpMap,vBumpMapUv).r;
 st=clamp(st*1.3-(1.-th)*.42*(1.-smoothstep(.55,.8,st)),0.,1.);
 vec3 tc=mix(vec3(1.,.72,.19),vec3(.88,.5,.1),smoothstep(.78,1.,st));diffuseColor.rgb*=mix(vec3(1.),tc,st);`)
  .replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,.62,st);')};
const cloth=new THREE.Mesh(new THREE.PlaneGeometry(40,40),clothM);cloth.rotation.x=-Math.PI/2;cloth.receiveShadow=true;S.add(cloth);
// the canvas keeps only the distance from each stain's centre (1 in the middle, 0 at 1.25 radii); the cloth's shader turns that
// into the stain with stainV(), the same function the live soak uses, so a stain never jumps when it is baked
function bake(x,z,r){const k=SR/40,rr=r*1.7*1.25*k;sg.save();sg.translate((x+20)*k,(z+20)*k);sg.scale(1,1.12);
 const gr=sg.createRadialGradient(0,0,0,0,0,rr);gr.addColorStop(0,'rgb(255,0,0)');gr.addColorStop(1,'rgb(0,0,0)');
 sg.globalCompositeOperation='lighten';sg.fillStyle=gr;sg.beginPath();sg.arc(0,0,rr,0,7);sg.fill();sg.restore();stT.needsUpdate=true}
let kept=[];try{kept=JSON.parse(localStorage.getItem('haldi-stains')||'[]').slice(-40)}catch(e){}
kept.forEach(k=>bake(k[0],k[1],k[2]));
function keep(x,z,r){kept.push([+x.toFixed(2),+z.toFixed(2),+r.toFixed(2)]);kept=kept.slice(-40);try{localStorage.setItem('haldi-stains',JSON.stringify(kept))}catch(e){}}

// ---- the bottle: brown flint glass, a mould seam, a black phenolic collar and a dropper bulb
const [bx,bz]=P.bottle,BR=1.62;
const glass=new THREE.MeshPhysicalMaterial({color:0x9c6534,transmission:.82,thickness:.8,ior:1.52,roughness:.035,attenuationColor:new THREE.Color(.36,.16,.04),attenuationDistance:.55,specularIntensity:1,envMapIntensity:1.1});
const prof=[[0,0],[1.44,0],[1.6,.14],[BR,.42],[BR,5.7],[1.52,6.25],[1.14,6.82],[.8,7.08],[.74,7.62],[.6,7.62]].map(([r,y])=>new THREE.Vector2(r,y));
const bottle=new THREE.Group();bottle.position.set(bx,0,bz);S.add(bottle);
const body=new THREE.Mesh(new THREE.LatheGeometry(prof,72),glass);body.castShadow=true;bottle.add(body);
const seam=new THREE.Mesh(new THREE.BoxGeometry(.04,5.2,.04),glass);seam.position.set(-BR-.005,3.05,.25);bottle.add(seam);
const ribs=(()=>{const c=document.createElement('canvas');c.width=256;c.height=8;const g=c.getContext('2d');for(let i=0;i<256;i+=8){g.fillStyle='#fff';g.fillRect(i,0,4,8);g.fillStyle='#555';g.fillRect(i+4,0,4,8)}const t=new THREE.CanvasTexture(c);t.wrapS=THREE.RepeatWrapping;t.repeat.set(6,1);return t})();
const collar=new THREE.Mesh(new THREE.CylinderGeometry(.94,.94,1.3,64),new THREE.MeshStandardMaterial({color:0x1c1714,roughness:.42,bumpMap:ribs,bumpScale:1.5,envMapIntensity:.8}));collar.position.y=8.2;collar.castShadow=true;bottle.add(collar);
const bulb=new THREE.Mesh(new THREE.LatheGeometry([[.001,11.2],[.34,11.12],[.6,10.8],[.66,10.1],[.6,9.3],[.62,8.85]].map(([r,y])=>new THREE.Vector2(r,y)).reverse(),48),new THREE.MeshPhysicalMaterial({color:0x2a211b,roughness:.55,sheen:.4,sheenColor:new THREE.Color(.4,.35,.3)}));bulb.castShadow=true;bottle.add(bulb);

// ---- the tag, lying on the cloth where the string left it: the price, and the admission
const tagC=document.createElement('canvas');tagC.width=1024;tagC.height=600;
function drawTag(){const g=tagC.getContext('2d');seed=29;
 g.fillStyle='#f4ecdd';g.fillRect(0,0,1024,600);for(let i=0;i<5000;i++){g.fillStyle=`rgba(120,90,60,${rnd()*.05})`;g.fillRect(rnd()*1024,rnd()*600,rnd()*6+1,1)}
 g.fillStyle='#e6dac6';g.beginPath();g.arc(70,300,26,0,7);g.fill();g.strokeStyle='#cbb999';g.lineWidth=5;g.stroke();
 g.fillStyle='#2a1608';g.font='600 112px Chillax';g.fillText('Serum No. 1',150,170);
 g.font='400 42px Chillax';g.fillText('30 ml  ·  about three months',156,250);
 g.font='italic 400 38px Gambetta';g.fillText('Wild Bandarban turmeric oil',156,318);
 g.font='500 96px Chillax';g.fillText('£38',156,450);
 g.fillStyle='#b8720c';g.font='italic 400 84px Gambetta';g.fillText('It stains.',470,450)}
drawTag();const tagTex=new THREE.CanvasTexture(tagC);tagTex.colorSpace=THREE.SRGBColorSpace;tagTex.anisotropy=8;
const tagG=new THREE.PlaneGeometry(4.6,2.7,32,6);{const pa=tagG.attributes.position;for(let i=0;i<pa.count;i++){const x=pa.getX(i);pa.setZ(i,.09*Math.pow(Math.max(0,x/2.3),3)+.03*Math.pow(Math.max(0,-x/2.3),4))}tagG.computeVertexNormals()}
const tag=new THREE.Mesh(tagG,new THREE.MeshStandardMaterial({map:tagTex,roughness:.88,envMapIntensity:.3}));
tag.rotation.set(-Math.PI/2,0,P.tag[2]);tag.position.set(P.tag[0],.035,P.tag[1]);tag.castShadow=tag.receiveShadow=true;S.add(tag);
tag.updateMatrixWorld();const hole=new THREE.Vector3(-2.3+.18,.02,0).applyMatrix4(tag.matrixWorld);
const jute=new THREE.MeshStandardMaterial({color:0xb39468,roughness:.95});
const neck=new THREE.Vector3(bx-.72,7.4,bz+.3);
const str=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([neck,new THREE.Vector3(neck.x-.3,5.2,neck.z+1.1),new THREE.Vector3(hole.x-.7,1.2,hole.z-1.1),new THREE.Vector3(hole.x-.35,.05,hole.z-.2),hole]),80,.028,6),jute);str.castShadow=true;S.add(str);
const knot=new THREE.Mesh(new THREE.TorusGeometry(.78,.035,6,40),jute);knot.rotation.x=Math.PI/2;knot.position.set(0,7.42,0);bottle.add(knot);

// ---- a stray fibre lying where the first drop will fall
const [ax,az]=P.auto;
const fibre=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[-.95,.03,-.55],[-.45,.1,-.05],[-.05,.3,.12],[.35,.22,-.12],[.55,.06,.3],[.9,.03,.18]].map(([x,y,z])=>new THREE.Vector3(ax+x,y,az+z))),60,.009,5),new THREE.MeshStandardMaterial({color:0xe4dccd,roughness:.9}));fibre.castShadow=true;S.add(fibre);

// ---- light: one low east window, 5000 K, and the cloth throwing its own light back
const EL=THREE.MathUtils.degToRad(20),AZ=THREE.MathUtils.degToRad(25);
const key=new THREE.DirectionalLight(0xfff2e2,5.2);key.castShadow=true;key.shadow.mapSize.set(phone?1024:2048,phone?1024:2048);
Object.assign(key.shadow.camera,{left:-15,right:15,top:15,bottom:-15,near:1,far:90});key.shadow.bias=-.0005;key.shadow.normalBias=.03;S.add(key,key.target);
const hemi=new THREE.HemisphereLight(0xffffff,0xf0e3cc,1.15);S.add(hemi);
const sd=new THREE.Vector2();
function setKey(az){key.position.set(Math.cos(EL)*Math.cos(az),Math.sin(EL),-Math.cos(EL)*Math.sin(az)).multiplyScalar(45);sd.set(-Math.cos(az),Math.sin(az))}

// ---- the caustic: the oil in the bottle focuses the window into its own shadow, split by the seam; each drop throws a small one
const cU={uB:{value:new THREE.Vector3(bx,bz,BR)},uSd:{value:sd},uT:{value:0},uOn:{value:0},uD:{value:[0,1,2,3,4,5].map(()=>new THREE.Vector4())}};
const caus=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.ShaderMaterial({uniforms:cU,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
 vertexShader:`varying vec2 vP;void main(){vec4 w=modelMatrix*vec4(position,1.);vP=w.xz;gl_Position=projectionMatrix*viewMatrix*w;}`,
 fragmentShader:`uniform vec3 uB;uniform vec2 uSd;uniform float uT,uOn;uniform vec4 uD[6];varying vec2 vP;
 float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
 void main(){vec2 p=vP-uB.xy,pr=vec2(-uSd.y,uSd.x);float al=dot(p,uSd),ac=dot(p,pr),Rb=uB.z,s=al-Rb*1.02;
  float w=Rb*mix(.34,1.05,smoothstep(0.,10.,s));
  float net=.5+.5*abs(sin(n2(vec2(al*1.1,ac*3.4)+uT*.04)*8.+uT*.2));
  float c=smoothstep(0.,.6,s)*exp(-pow(ac/w,2.)*2.4)*exp(-s*.16)*net*smoothstep(.012,.06,abs(ac-.05*Rb))*(Rb*.8/w);
  vec3 col=vec3(1.,.6,.1)*c*.5;
  for(int i=0;i<6;i++){vec4 d=uD[i];if(d.w<=0.)continue;vec2 q=vP-d.xy-uSd*d.z*.95;float r=length(q*vec2(1.,1.))/(d.z*.6);
   col+=vec3(1.,.74,.26)*d.w*(smoothstep(1.,.3,r)*.28+smoothstep(.18,0.,abs(r-.72))*.42);}
  gl_FragColor=vec4(col*uOn,1.);}`}));
caus.rotation.x=-Math.PI/2;caus.position.y=.008;S.add(caus);

// ---- the oil: clear gold, refracting the threads under it
const oil=new THREE.MeshPhysicalMaterial({color:0xffffff,transmission:1,thickness:.38,ior:1.47,roughness:.035,attenuationColor:new THREE.Color(1,.6,.07),attenuationDistance:.72,specularIntensity:1,envMapIntensity:1.3});
const capG=new THREE.SphereGeometry(1,56,24,0,Math.PI*2,0,Math.PI/2);
const drops=[],MAXD=phone?1:5;
function addDrop(x,z,auto){if(drops.length>=MAXD)return;const slot=[0,1,2,3].find(i=>!drops.some(d=>d.slot===i))??-1;
 const r=.95+rnd()*.35,m=new THREE.Mesh(capG,oil);m.position.set(x,6,z);S.add(m);drops.push({x,z,r,y:6,vy:0,ph:'fall',t:0,m,slot,auto})}

// ---- lens and grade: shallow focus on the cloth, fine grain, halation where the caustic burns
const cam=new THREE.PerspectiveCamera(P.fov,1,1,200);
const comp=new EffectComposer(R);comp.addPass(new RenderPass(S,cam));
const bokeh=phone?null:new BokehPass(S,cam,{focus:36,aperture:.0012,maxblur:.006});if(bokeh)comp.addPass(bokeh);
const film=new ShaderPass({uniforms:{tDiffuse:{value:null},uT:{value:0},uR:{value:new THREE.Vector2()}},
 vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform sampler2D tDiffuse;uniform float uT;uniform vec2 uR;varying vec2 vUv;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;vec2 px=1./uR;vec3 b=vec3(0.);for(int i=0;i<12;i++){float a=float(i)*.5236;b+=texture2D(tDiffuse,vUv+vec2(cos(a),sin(a))*px*9.).rgb;}b/=12.;
  c+=max(b-.94,0.)*vec3(1.,.55,.2)*.35;vec2 q=vUv-.5;c*=1.-dot(q,q)*.35;c+=(h(floor(vUv*uR/1.3)+fract(uT)*91.)-.5)*.018;gl_FragColor=vec4(c,1.);}`});
comp.addPass(film);comp.addPass(new OutputPass());
// the render: contact shading where surfaces meet, glow only on true light sources, tuned to this world's scale and light
lux(R,S,cam,comp,{hemi:.7,ao:{radius:2,thickness:3,protect:[.3,1.2]},bloom:{strength:.2,radius:.5,threshold:2}});
function size(){const w=hero.clientWidth,h=hero.clientHeight;R.setSize(w,h,false);comp.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix();film.uniforms.uR.value.set(w*DPR,h*DPR)}
addEventListener('resize',size);size();

// ---- the hand: a tap lets a drop fall where you touched
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),floorP=new THREE.Plane(new THREE.Vector3(0,1,0),0),hit=new THREE.Vector3();let touched=false;
cv.addEventListener('pointerdown',e=>{const r=cv.getBoundingClientRect();ndc.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(ndc,cam);
 if(ray.ray.intersectPlane(floorP,hit)){const dx=hit.x-bx,dz=hit.z-bz;if(dx*dx+dz*dz<(BR+.9)**2)return;touched=true;addDrop(hit.x,hit.z,false)}});

// ---- time: 0-3 s cloth and bottle, 3-5 s the caustic wanders a degree, at 5 s one drop falls by itself
const look=new THREE.Vector3(),want=new THREE.Vector3(),focusP=new THREE.Vector3();let tilt=0,tiltT=0,lookDrop=null,autoDone=false,last=performance.now(),t0=last;
setKey(AZ);
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.1,(now-last)/1000);last=now;const t=(now-t0)/1000;
 if(scrollY>innerHeight*1.05)return;
 veil.classList.add('off');
 setKey(AZ+THREE.MathUtils.degToRad(1)*Math.sin(t*.4)*sm(3,4,t));
 cU.uT.value=film.uniforms.uT.value=t;cU.uOn.value=sm(.6,2.6,t);
 if(!autoDone&&!touched&&t>5){autoDone=true;addDrop(ax,az,true)}
 let focusDrop=null;
 for(let i=drops.length-1;i>=0;i--){const d=drops[i];d.t+=dt;
  if(d.ph==='fall'){d.vy-=260*dt;d.y+=d.vy*dt;const k=.62;d.m.scale.set(d.r*k,d.r*.95,d.r*k);d.m.position.y=Math.max(0,d.y);
   if(d.y<=0){d.ph='sit';d.t=0;lookDrop=d}}
  else if(d.ph==='sit'){const w=Math.exp(-d.t*5)*Math.sin(d.t*28);d.m.position.y=0;d.m.scale.set(d.r*(1-.07*w),d.r*.42*(1+.22*w),d.r*(1-.07*w));focusDrop=d;
   if(d.t>3){d.ph='soak';d.t=0}}
  else{const g=Math.min(1,d.t/2.6),e=g*g*(3-2*g);d.m.scale.set(d.r*(1+.14*e),Math.max(.001,d.r*.42*Math.pow(1-e,1.6)),d.r*(1+.14*e));
   if(d.slot>=0)soakU.value[d.slot].set(d.x,d.z,d.r*1.7,e);
   if(g>=1){bake(d.x,d.z,d.r);keep(d.x,d.z,d.r);if(d.slot>=0)soakU.value[d.slot].w=-1;S.remove(d.m);drops.splice(i,1);if(lookDrop===d)lookDrop=null;continue}}
  const cd=cU.uD.value[i];if(cd)cd.set(d.x,d.z,d.r*(d.ph==='soak'?1-d.t/2.6*.6:1),d.ph==='fall'?0:d.ph==='sit'?Math.min(1,d.t*3):Math.max(0,1-d.t/1.6))}
 for(let i=drops.length;i<6;i++)cU.uD.value[i].w=0;
 // the camera: a slow slider over the cloth, tilting 20 degrees to the edge of a drop that has just landed, and with the scroll
 tiltT=focusDrop?1:0;tilt+=(tiltT-tilt)*Math.min(1,dt*1.6);
 const sc=Math.min(1,scrollY/innerHeight);
 want.set(P.look[0]+Math.sin(t*.05)*.7,0,P.look[1]+Math.cos(t*.043)*.35);
 if(lookDrop)want.lerp(focusP.set(lookDrop.x,0,lookDrop.z),.45*tilt);
 look.lerp(want,t<.1?1:Math.min(1,dt*1.2));
 const a=THREE.MathUtils.degToRad(20)*Math.max(tilt,sc),D=36-4*tilt;
 cam.position.set(look.x,D*Math.cos(a),look.z+D*Math.sin(a));cam.up.set(0,Math.sin(a),-Math.cos(a));cam.lookAt(look);
 if(bokeh)bokeh.uniforms.focus.value=cam.position.distanceTo(look);
 comp.render()}
(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>{drawTag();tagTex.needsUpdate=true;requestAnimationFrame(frame)});
