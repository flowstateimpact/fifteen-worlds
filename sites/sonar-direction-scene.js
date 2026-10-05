// sonar-direction-scene.js · the strike scene, redrawn. Direction copy of sonar-scene.js; the interaction is the same, the picture is not.
// The old scene was a lit render and lost to the photograph above it. This one is an ENGRAVING, the goldsmith's own way of drawing:
// ink lines cut on the cream page that swell where the form turns from the light, and one flat gold ink for the band. Nothing glows.
// Steel is drawn in rings (it was turned on a lathe), wood in lines along the grain, and gold is left flat until it is struck:
// every strike draws one facet into the band, so the hammered surface is the visitor's own work. Four thousand, and the leopard's head goes on last.
// Units are centimetres. Three drawn views, taken in turn by scroll: at the bench, from above, and down the stick.
import * as THREE from 'three';

const cv=document.getElementById('gl'),phone=innerWidth<700,DPR=Math.min(devicePixelRatio,2);
const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});
R.setPixelRatio(DPR);R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;R.toneMapping=THREE.NoToneMapping;
const PAPER=new THREE.Color('#efe6d4'),INK=new THREE.Color('#0b0908'),GOLD=new THREE.Color('#e6c066');
const S=new THREE.Scene();S.background=PAPER;
let seed=5;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const sm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};
const GOAL=4000;
// the bench lies under the printed first screen. TOP is how far down it starts; the drawing waits for the sheet to lift.
const drvEl=document.getElementById('drv');let TOP=drvEl?drvEl.offsetTop:0,woke=false,warm=0;addEventListener('resize',()=>{TOP=drvEl?drvEl.offsetTop:0});const SY=()=>Math.max(0,scrollY-TOP);

// ---- the band's own surface, as a drawing: red = ink strokes (soft-edged, so the line can swell in the shade), green = where a facet has flattened the metal
const HW=phone?1024:2048,HH=phone?128:256,hc=document.createElement('canvas');hc.width=HW;hc.height=HH;const hg=hc.getContext('2d');
hg.fillStyle='rgb(0,0,0)';hg.fillRect(0,0,HW,HH);
const hTex=new THREE.CanvasTexture(hc);hTex.wrapS=THREE.RepeatWrapping;hTex.anisotropy=8;
const RO=1.08,RI=.9,W=.62,CIRC=2*Math.PI*RO,PXC=HW/CIRC,ASP=(HH/W)/PXC;               // pixels per centimetre, round the band
let dirty=false;
// one blow of the planishing hammer: a shallow facet. It wipes whatever was drawn under it, then gets its own rim, open on one side, and a few strokes of shade.
function dent(u,v,big){const x=u*HW,y=(1-v)*HH,r=(big?.13:.075+rnd()*.045)*PXC,rot=rnd()*Math.PI,asp=.62+rnd()*.5,a0=rnd()*6.28,arc=3.3+rnd()*1.8,n=2+(rnd()*3|0),hr=rnd()*Math.PI,LW=phone?1.5:2.2;
 for(const dx of[-HW,0,HW]){hg.save();hg.translate(x+dx,y);hg.scale(1,ASP);hg.rotate(rot);hg.scale(1,asp);
  hg.globalCompositeOperation='source-over';hg.fillStyle='rgb(0,255,0)';hg.beginPath();hg.arc(0,0,r,0,7);hg.fill();
  hg.globalCompositeOperation='lighter';hg.lineCap='round';
  for(const[w,c]of[[LW*2.5,'rgb(105,0,0)'],[LW,'rgb(255,0,0)']]){hg.lineWidth=w;hg.strokeStyle=c;
   hg.beginPath();hg.arc(0,0,r-LW*1.3,a0,a0+arc);hg.stroke();
   hg.save();hg.beginPath();hg.arc(0,0,r-LW*2.8,0,7);hg.clip();hg.rotate(hr);
   for(let k=0;k<n;k++){const o=-r*.2-k*r*.3;hg.beginPath();hg.moveTo(-r,o);hg.lineTo(r,o);hg.stroke()}
   hg.restore()}
  hg.restore()}
 hg.globalCompositeOperation='source-over';dirty=true}

// the leopard's head, our own drawing: a cartouche and a cat's face, struck last
function hallmark(u,v,rot=0){const x=u*HW,y=(1-v)*HH,s=.2*PXC;hg.save();hg.translate(x,y);hg.scale(1,ASP);hg.rotate(rot);hg.globalCompositeOperation='source-over';
 const P=(c,f)=>{hg.fillStyle=c;hg.beginPath();f();hg.fill()},LO='rgb(255,255,0)',HI='rgb(0,255,0)',CUT='rgb(255,255,0)';   // the cartouche is sunk, so it is ink; the face stands in gold
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

// ---- the engraver's hand, as a material. Light decides only how heavy the line is. a and b are two sets of parallel lines in the surface's own
//      coordinates (b is the cross-hatch, cut only in deep shade); edge draws the outline where a round form turns away from the eye.
const SCREEN=phone?.55:1;   // the line screen: about twenty lines to the centimetre on a desk, coarser on a phone so a line stays a line
const uDraw={value:0},ringU={value:[0,1,2,3,4,5,6,7].map(()=>new THREE.Vector4(0,0,99,0))};
function engrave(o={}){const m=new THREE.MeshLambertMaterial({color:0xffffff,side:o.side||THREE.FrontSide});
 const U={uFill:{value:o.fill||PAPER},uInk:{value:INK},uDraw,uA:{value:new THREE.Vector2(...(o.a||[0,0]))},uB:{value:new THREE.Vector2(...(o.b||[0,0]))},
  uT:{value:new THREE.Vector4(o.lo??.22,o.hi??.95,o.max??.6,o.cross??.82)},uEdge:{value:(o.edge??4)*DPR}};
 U.uA.value.multiplyScalar(SCREEN);U.uB.value.multiplyScalar(SCREEN);
 if(o.marks){U.uMarks={value:o.marks};U.uS=ringU;U.uCW={value:new THREE.Vector2(CIRC,W)}}
 m.onBeforeCompile=sh=>{Object.assign(sh.uniforms,U);
  sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 vQ;').replace('#include <begin_vertex>','#include <begin_vertex>\nvQ=uv;');
  sh.fragmentShader=sh.fragmentShader.replace('#include <common>',`#include <common>
varying vec2 vQ;uniform vec3 uFill,uInk;uniform float uDraw,uEdge;uniform vec2 uA,uB;uniform vec4 uT;${o.marks?'uniform sampler2D uMarks;uniform vec4 uS[8];uniform vec2 uCW;':''}
float lineSet(vec2 dir,float d){float f=dot(vQ,dir),tri=abs(fract(f)-.5)*2.,aa=fwidth(f)*2.+1e-4;float k=(1.-smoothstep(d-aa,d+aa,tri))*smoothstep(0.,.05,d);return mix(k,d,clamp(aa*1.4-.5,0.,1.));}`)
  .replace('#include <opaque_fragment>',`float lum=clamp(dot(outgoingLight,vec3(.3333)),0.,1.),dk=1.-lum,ink=0.;
if(dot(uA,uA)>0.)ink=lineSet(uA,smoothstep(uT.x,uT.y,dk)*uT.z*uDraw);
if(dot(uB,uB)>0.)ink=max(ink,lineSet(uB,smoothstep(uT.w,1.,dk)*uT.z*.8*uDraw));
${o.marks?`vec4 mk=texture2D(uMarks,vQ);ink*=1.-mk.g*.92;
float th=mix(.78,.3,smoothstep(.1,.9,dk)),mw=fwidth(mk.r)*.8+.02;ink=max(ink,smoothstep(th-mw,th+mw,mk.r)*uDraw);
for(int i=0;i<8;i++){vec4 s=uS[i];if(s.z>1.2)continue;vec2 q=vQ-s.xy;q.x-=floor(q.x+.5);q*=uCW;float l=length(q),rr=.03+s.z*.5,w=.008*(1.-s.z/1.2);ink=max(ink,(1.-smoothstep(w,w+fwidth(l)*1.5,abs(l-rr)))*s.w);}`:''}
if(uEdge>0.){float nv=abs(dot(normalize(normal),normalize(vViewPosition))),e=nv/(fwidth(nv)+1e-5);ink=max(ink,(1.-smoothstep(uEdge-.9,uEdge+.5,e))*uDraw);}
gl_FragColor=vec4(mix(uFill,uInk,clamp(ink,0.,1.)),1.);`)};
 m.customProgramCacheKey=()=>'engrave'+(o.marks?'-marks':'');
 return m}
const inkLine=new THREE.MeshBasicMaterial({color:INK});
const crease=(r,t=.0055)=>{const g=new THREE.Mesh(new THREE.TorusGeometry(r,t,6,160),inkLine);g.rotation.x=Math.PI/2;return g};   // a drawn edge where two faces meet

// ---- the band: one flat gold, a few lines of shade round it, and the strikes
const band=new THREE.Group();S.add(band);
const og=new THREE.CylinderGeometry(RO,RO,W,256,14,true);{const p=og.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),l=Math.hypot(x,z),k=(RO+.028*(1-(2*y/W)**2))/l;p.setXYZ(i,x*k,y,z*k)}og.computeVertexNormals()}
const outer=new THREE.Mesh(og,engrave({fill:GOLD,a:[0,13],marks:hTex,lo:.32,max:.44,cross:2}));outer.castShadow=outer.receiveShadow=true;
const inner=new THREE.Mesh(new THREE.CylinderGeometry(RI+.004,RI+.004,W,128,1,true),engrave({fill:GOLD,a:[0,13],side:THREE.BackSide,lo:.15,max:.5,cross:2,edge:0}));
const flat=engrave({fill:GOLD,edge:0});
const e1=new THREE.Mesh(new THREE.RingGeometry(RI,RO+.01,128),flat),e2=e1.clone();e1.position.y=W/2;e1.rotation.x=-Math.PI/2;e2.position.y=-W/2;e2.rotation.x=Math.PI/2;
const bandBody=new THREE.Group();bandBody.add(outer,inner,e1,e2);
for(const y of[W/2,-W/2])for(const r of[RO+.012,RI]){const c=crease(r);c.position.y=y;bandBody.add(c)}
bandBody.rotation.z=-Math.PI/2;band.add(bandBody);

// ---- the mandrel: tapered steel, drawn in the rings a lathe leaves
const steel=engrave({a:[0,300],b:[126,0],max:.5});
const mandrel=new THREE.Mesh(new THREE.CylinderGeometry(RI+.02*14,RI-.02*1.1,15.1,96),[steel,engrave({edge:0}),engrave({edge:0})]);mandrel.rotation.z=-Math.PI/2;mandrel.position.x=6.45;mandrel.castShadow=mandrel.receiveShadow=true;S.add(mandrel);
const tip=new THREE.Mesh(new THREE.SphereGeometry(RI-.02*1.1,64,24,0,Math.PI*2,0,Math.PI/2),engrave({a:[0,20],max:.42}));tip.scale.y=.35;tip.rotation.z=Math.PI/2;tip.position.x=-1.1;tip.castShadow=true;S.add(tip);
{const c=crease(RI-.02*1.1,.0065);c.rotation.set(0,Math.PI/2,0);c.position.x=-1.1;S.add(c)}

// ---- the paper under it: blank, except where the stick and the band keep the light off it. The shadow is hatched, never tinted.
const FLOOR=-1.35;
const ground=new THREE.Mesh(new THREE.PlaneGeometry(90,90),engrave({a:[1470,1040],lo:.45,hi:.8,max:.36,cross:2,edge:0}));ground.rotation.x=-Math.PI/2;ground.position.set(4,FLOOR,0);ground.receiveShadow=true;S.add(ground);

// ---- the hammer: a planishing face of steel on a wooden handle, following the hand
const hammer=new THREE.Group();S.add(hammer);
const face=new THREE.Mesh(new THREE.CylinderGeometry(.34,.36,.9,48),[engrave({a:[0,18],max:.46}),engrave({edge:0}),engrave({edge:0})]);face.position.y=.45;
const cheek=new THREE.Mesh(new THREE.CylinderGeometry(.36,.3,1.6,48),[engrave({a:[0,32],b:[42,0],max:.5}),engrave({edge:0}),engrave({edge:0})]);cheek.position.y=1.7;
const handle=new THREE.Mesh(new THREE.CylinderGeometry(.16,.2,9,24),[engrave({a:[22,0],lo:.05,max:.42,cross:2}),engrave({edge:0}),engrave({edge:0})]);handle.rotation.z=Math.PI/2;handle.position.set(4.6,1.9,0);
face.castShadow=cheek.castShadow=handle.castShadow=true;hammer.add(face,cheek,handle);
for(const[r,y]of[[.36,0],[.34,.9],[.3,2.5]]){const c=crease(r,.005);c.position.y=y;hammer.add(c)}
hammer.visible=false;

// ---- one light, from the upper right, and it does nothing but weigh the lines
const lamp=new THREE.DirectionalLight(0xffffff,Math.PI);lamp.position.set(1.8,11.5,-3.6);lamp.target.position.set(0,0,.2);lamp.castShadow=true;lamp.shadow.mapSize.set(phone?1024:2048,phone?1024:2048);
{const c=lamp.shadow.camera;c.left=-9;c.right=16;c.top=9;c.bottom=-9;c.near=1;c.far=40;c.updateProjectionMatrix()}lamp.shadow.bias=-.0004;lamp.shadow.normalBias=.03;lamp.shadow.radius=3;S.add(lamp,lamp.target);

const cam=new THREE.PerspectiveCamera(phone?30:17,1,.5,120);
function size(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
addEventListener('resize',size);size();

// ---- sound, only if asked: a struck ring, rising as the band thins
let ac=null,snd=false;const sb=document.getElementById('snd');
if(sb)sb.onclick=()=>{snd=!snd;sb.textContent='Sound · '+(snd?'on':'off');sb.setAttribute('aria-pressed',snd);if(snd&&!ac)ac=new AudioContext()};
function ring(k){if(!snd||!ac)return;const t=ac.currentTime,up=1+count/GOAL*.35,o=ac.createGain();o.gain.value=.16*k;o.connect(ac.destination);
 [[2210,.6,.9],[3340,.35,.55],[5120,.2,.3],[7630,.1,.18]].forEach(([f,a,d])=>{const s=ac.createOscillator(),g=ac.createGain();s.frequency.value=f*up*(1+(Math.random()-.5)*.01);g.gain.setValueAtTime(a,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(g);g.connect(o);s.start(t);s.stop(t+d)});
 const n=ac.createBufferSource(),b=ac.createBuffer(1,ac.sampleRate*.03,ac.sampleRate),dd=b.getChannelData(0);for(let i=0;i<dd.length;i++)dd[i]=(Math.random()*2-1)*(1-i/dd.length);n.buffer=b;const ng=ac.createGain();ng.gain.value=.5;n.connect(ng);ng.connect(o);n.start(t)}

// ---- the tally, set in type on the page (it was chalk on the leather): every strike lands on it too
const tal=document.getElementById('tal'),still=matchMedia('(prefers-reduced-motion: reduce)').matches;
function tally(n,hit){if(!tal)return;tal.textContent=String(n).padStart(4,'0');if(hit&&!still&&tal.animate)tal.animate([{transform:'translateY(3px)'},{transform:'none'}],{duration:150,easing:'cubic-bezier(.2,.7,.1,1)'})}
tally(0);

// ---- the hand: hover shows the hammer over the band; a click strikes; holding keeps the rhythm and turns the band
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2(-9,-9),hitP=new THREE.Vector3(),hitN=new THREE.Vector3();const markP=new THREE.Vector3(0,.5,.6);let doneAt=0,hitUV=null,holding=false,holdT=0,nextStrike=0,count=0,done=false,touched=false;
const cnt=document.getElementById('cnt');
const cDir=new THREE.Vector3();
function centreUV(){ray.set(cam.position,cDir.copy(LOOK).sub(cam.position).normalize());const h=ray.intersectObject(outer,false)[0];return h&&h.uv?h.uv:new THREE.Vector2(.875,.5)}
function aim(){ray.setFromCamera(ndc,cam);const h=ray.intersectObject(outer,false)[0];if(h&&h.uv){hitUV=h.uv.clone();hitP.copy(h.point);hitN.copy(h.face.normal).transformDirection(outer.matrixWorld);return true}hitUV=null;return false}
addEventListener('pointermove',e=>{ndc.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1)});
cv.addEventListener('pointerdown',e=>{ndc.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);if(aim()){holding=true;holdT=0;touched=true;strike(hitUV.x,hitUV.y);nextStrike=.16}});
addEventListener('pointerup',()=>holding=false);addEventListener('pointercancel',()=>holding=false);
let slot=0,swing=0,jolt=0;
function strike(u,v){if(done)return;count++;dent(u,v,false);ringU.value[slot].set(u,v,0,1);slot=(slot+1)%8;swing=1;jolt=1;ring(1);
 if(count>=GOAL){done=true;const a=Math.atan2(cam.position.z,cam.position.y)+.3,tp=new THREE.Vector3(-.02,Math.cos(a)*RO,Math.sin(a)*RO);ray.set(cam.position,tp.sub(cam.position).normalize());const h=ray.intersectObject(outer,false)[0];if(h&&h.uv){const p=h.point.clone().project(cam);ray.setFromCamera(new THREE.Vector2(p.x,p.y+.03),cam);const h2=ray.intersectObject(outer,false)[0];let rot=0;if(h2&&h2.uv){let du=h2.uv.x-h.uv.x;du-=Math.round(du);const dx=du*HW,dy=-(h2.uv.y-h.uv.y)*HH/ASP;rot=Math.atan2(dx,-dy)}hallmark(h.uv.x,h.uv.y,rot);markP.copy(h.point)}else{const c=centreUV();hallmark(c.x,.5)}ring(1.6);doneAt=performance.now()/1000;document.body.classList.add('done')}
 tally(count,true);if(cnt)cnt.textContent=count}

// ---- three drawn views, one to a caption: at the bench, from above, and down the stick
const VIEWS=phone?[[[-4.84,11.35,4.73],[.15,.5,0],[0,.17]],[[.9,20.5,1.5],[.9,0,.2],[0,.14]],[[-13,4,4.6],[.2,.5,0],[0,.2]]]
 :[[[-5.64,9.34,4.94],[.15,.5,0],[.15,.03]],[[1.5,21,2.1],[1.5,0,.25],[.02,.13]],[[-9.6,3.2,3.6],[.4,.5,0],[.17,.03]]];
const P0=new THREE.Vector3(),LOOK=new THREE.Vector3(.15,.5,0),va=new THREE.Vector3(),vb=new THREE.Vector3();let offX=0,offY=0;
function view(sc){const i=Math.min(1,Math.floor(sc)),k=sm(.12,.88,Math.min(1,Math.max(0,sc-i)));
 P0.copy(va.fromArray(VIEWS[i][0])).lerp(vb.fromArray(VIEWS[i+1][0]),k);LOOK.copy(va.fromArray(VIEWS[i][1])).lerp(vb.fromArray(VIEWS[i+1][1]),k);
 offX=VIEWS[i][2][0]+(VIEWS[i+1][2][0]-VIEWS[i][2][0])*k;offY=VIEWS[i][2][1]+(VIEWS[i+1][2][1]-VIEWS[i][2][1])*k}
view(0);

// ---- time: the drawing is cut in as the sheet lifts, and about four seconds later one strike lands by itself
let last=performance.now(),t0=last,turn=0;
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.1,(now-last)/1000);last=now;
 if(!woke){if(TOP>0&&scrollY<2){if(warm++>8)return;t0=now}else{woke=true;t0=TOP>0?now-2000:t0}}   // covered: draw a few frames so nothing stutters later, then rest
 const t=(now-t0)/1000;
 if(SY()>innerHeight*3.2||(TOP>0&&scrollY<1))return;   // nothing is drawn while the sheet covers the bench, or once the page has moved on
 uDraw.value=still?1:sm(2,3.1,t);
 if(!touched&&count===0&&t>6){const c=centreUV();strike(c.x,c.y)}
 // scroll turns the band on the mandrel and moves the eye; holding turns it slowly as a goldsmith would
 const sc=SY()/innerHeight;if(holding){holdT+=dt;turn+=dt*.32}
 band.rotation.x=-(sc*1.15+turn);view(Math.min(2,sc));
 if(holding&&!done){nextStrike-=dt;if(nextStrike<=0&&aim()){const rate=Math.min(40,5+holdT*5.5);strike(hitUV.x+(rnd()-.5)*.012,Math.min(.92,Math.max(.08,hitUV.y+(rnd()-.5)*.25)));nextStrike=1/rate}}
 const over=!phone||holding?aim():false;
 hammer.visible=over&&uDraw.value>.9&&!done;
 if(hammer.visible){swing=Math.max(0,swing-dt*9);const lift=.55*(1-Math.pow(swing,.35)*(swing>0?1:0))+.05;hammer.position.copy(hitP).addScaledVector(hitN,lift);hammer.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),hitN.clone().negate());}
 if(dirty&&(Math.floor(t*60)%2===0||!holding)){hTex.needsUpdate=true;dirty=false}
 ringU.value.forEach(s=>{if(s.z<99)s.z+=dt*1.6});
 // the eye: a jolt with each strike, a millimetre closer every hundred, and to the mark at the end
 jolt=Math.max(0,jolt-dt*8);const close=Math.min(count,GOAL)/100*.04,fin=done?sm(0,1,(now/1000-doneAt)/2.5):0;
 const lk=LOOK.clone().lerp(markP,fin);cam.position.copy(P0).lerp(lk,close/9+fin*.18);cam.position.y-=jolt*.012;if(!still)cam.position.x+=Math.sin(t*.13)*.05;
 cam.lookAt(lk.x,lk.y-jolt*.01,lk.z);cam.setViewOffset(innerWidth,innerHeight,-offX*innerWidth,offY*innerHeight,innerWidth,innerHeight);
 R.render(S,cam)}
(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>requestAnimationFrame(frame));
