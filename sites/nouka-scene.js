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
// e is the end that faces the river: 0 for the far launches, which stay plain slabs in the haze; -1 or 1 for the near ones, built the way a Sadarghat launch is
// (looked at: the Commons photographs "Sadarghat Launch 1 to 4"): every deck ends in a rounded gallery, the top deck is an awning on stanchions with the haze
// showing through, the wheelhouse sits forward under its own oversailing roof, one funnel aft carries the owner's band, and a mast with a yard stands over it.
const lcyl=[];
function launch(x,z,len,c,ry=0,out=lparts,lit=false,e=0,rout=lcyl){const L=len,cy=Math.cos(ry),sy=Math.sin(ry),P=(lx,ly,lz,a,b,d,col)=>out.push([x+lx*cy+lz*sy,ly,z-lx*sy+lz*cy,a,b,d,col,ry]),
  RD=(ly,lz,a,b,d,col)=>rout.push([x+lz*sy,ly,z+lz*cy,a,b,d,col,ry+(e<0?Math.PI:0)]);
 P(0,1.4,0,11,4.2,L,c);P(0,4.4,-.02*L,10.8,2.4,L*.9,0xe9e4d6);P(0,6.9,-.05*L,10.8,2.4,L*.78,0xe4ddcb);
 P(0,3.45,-.02*L,11.1,.3,L*.9,0x2a2923);P(0,5.95,-.05*L,11.1,.3,L*.78,0x2a2923);P(0,8.35,-.18*L,10.7,.3,L*.45,0x2a2923);
 P(0,4.55,-.47*L-.06,10.2,1.5,.2,0x34332c);P(0,4,-.47*L-.14,10.2,.08,.1,0xe6e0d0);P(0,7.05,-.44*L-.06,10.2,1.5,.2,0x34332c);P(0,6.5,-.44*L-.14,10.2,.08,.1,0xe6e0d0);
 if(!e){P(0,9.3,-.18*L,10.4,2.3,L*.45,0xd9d2c0);P(0,9.4,-.405*L-.06,9.8,1.4,.2,0x34332c);P(0,11.5,-.34*L,6.5,2.2,7,0xf0ece2);P(-2,13.4,.12*L,1.3,5,1.3,0x2b2a26);P(2,13.4,.12*L,1.3,5,1.3,0x2b2a26)}
 else{const zc=-.18*L,hl=.225*L,zw=zc+hl*.5,zf=zc-hl*.62;
  P(0,9.2,zc-.04*L,7,1.9,L*.22,0xd9d2c0);P(0,10.55,zc,10.9,.16,L*.47,0xe4ddcb);
  for(let k=0;k<7;k++)for(const sx of[-5.15,5.15])P(sx,9.5,zc-hl+.5+k*(2*hl-1)/6,.14,2,.14,0xd9d2c0);
  for(const sx of[-5.15,5.15])P(sx,9.05,zc,.08,.08,2*hl,0xd9d2c0);P(0,9.05,zc-e*hl,10.3,.08,.08,0xd9d2c0);
  P(0,11.72,zw,5,2.1,4.6,0xf0ece2);P(0,12.84,zw,6.1,.14,5.9,0xd9d2c0);P(0,11.9,zw+2.33,4.2,.85,.06,0x34332c);
  P(0,14.6,zw,.13,3.5,.13,0x2b2a26);P(0,15.35,zw,1.9,.08,.08,0x2b2a26);
  P(0,12.4,zf,1.7,3.6,2.3,0x2b2a26);P(0,13.35,zf,1.78,.7,2.38,c);
  P(0,.32,0,11.08,.75,L+.06,0x2a2923);
  RD(1.4,e*L*.5,11,4.2,7.4,c);RD(.32,e*L*.5,11.08,.75,7.5,0x2a2923);
  RD(4.4,-.02*L+e*.45*L,10.8,2.4,5.8,0xe9e4d6);RD(3.45,-.02*L+e*.45*L,11.1,.3,6.2,0x2a2923);
  RD(6.9,-.05*L+e*.39*L,10.8,2.4,5,0xe4ddcb);RD(5.95,-.05*L+e*.39*L,11.1,.3,5.4,0x2a2923);
  RD(8.35,zc+e*hl,10.7,.3,4.6,0x2a2923);RD(10.55,zc+e*hl,10.9,.16,4.8,0xe4ddcb)}
 // only the nearest launch is lit, one string along its middle deck (Anwar): a silhouette with lights is a launch. The string is cabins, not a ruler:
 // some are dark, a door stands taller than a window, a saloon is wider, and one cabin has a tube light where the rest have bulbs.
 for(let k=0;k<3;k++)for(let w=0;w<9;w++){const q=rnd()<.18;if(lit&&k===1)for(const h of[0,.046]){const hv=Math.abs(Math.sin(w*12.9898+h*913.7+L)*43758.5453)%1;if(hv<.3)continue;
  const lz=-L*.42+w*L*.0925+h*L;lights.push([x+5.35*cy+lz*sy,4.4+k*2.5-(hv>.86?.28:0),z-5.35*sy+lz*cy,ry,hv>.6?1.1+hv*1.3:.8+hv,hv>.86?1.5:.7+hv*.35,hv>.72&&hv<.8?1:0])}}}
const HULLS=[0xd8d3c6,0x9d3b2e,0x2f4d6e,0x3e6b4c,0xc9b28a,0xe6e1d4];
for(let i=0;i<16;i++)launch(-72-i*17.5,126,52+rnd()*14,HULLS[i%6],0,lparts,i===0,i<3?-1:0);
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
// the ghat terminal, where a box shed stood. Looked at before building: the Commons photographs "Sadarghat Launch Terminal, Dhaka" and "Port of Dhaka, Sadarghat
// Launch Terminal". What the real one does: it grew in pieces of unequal height, tin verandahs on thin posts stand in front of it, and it sits on a piled deck.
// So: a hall, a lower wing added later, a ticket office pushed out toward the steps (its east edge where the shed's was, so the low sun still slips past it),
// a tin verandah with a gap in the rail for the gangway, the name on a board standing on the cornice, a black water tank, a pennant, and the solar rack on its own legs.
part(-52,1.5,116,34,1.8,13,0x8f8877);for(const px of[-67.4,-62,-56.3,-51.2,-45.6,-41,-37.2])part(px,.2,110.1,.5,2.8,.5,0x3f3a30);
part(-50,4.9,118,20,5,8,0xb9ab86);part(-64,4.1,118.6,8,3.4,6.8,0xaaa48e);part(-38,4.6,116.8,4,4.4,10.4,0xc0b490);
part(-50,7.55,114.1,20.5,.34,.6,0xa59a7c);part(-38,6.9,116.6,4.9,.2,11.3,0x5f594c);part(-64,5.9,118.5,8.7,.18,7.5,0x5f594c);
for(const px of[-60.2,-55.9,-50.1,-45.7,-41.3])part(px,3.42,109.95,.15,2.05,.15,0x2c2a25);
part(-53.65,3.3,109.95,13.3,.07,.07,0x2c2a25);part(-53.65,2.9,109.95,13.3,.05,.05,0x2c2a25);part(-42.8,3.3,109.95,3,.07,.07,0x2c2a25);
part(-37.3,8.6,112.4,.07,3.3,.07,0x2c2a25);part(-36.92,9.95,112.4,.7,.42,.03,0x9e2b25);part(-65,6.2,119.6,1.5,.42,1.5,0x8d8672);
for(const[lx,lz,lh]of[[-41.8,115.3,3.1],[-41.8,121.5,3.1],[-50,115.3,1.6],[-50,121.5,1.6]])part(lx,7.4+lh/2,lz,.13,lh,.13,0x2c2a25);
part(-54,8,113.95,.12,.5,.12,0x2c2a25);part(-46,8,113.95,.12,.5,.12,0x2c2a25);
part(-60,4.3,-181,26,4.6,.6,0xe7e2d6);
const PM=new THREE.MeshStandardMaterial({roughness:.85});
const pm=new THREE.InstancedMesh(box,PM,parts.length);const M4=new THREE.Matrix4(),Q=new THREE.Quaternion(),V3=new THREE.Vector3(),SC=new THREE.Vector3(),C=new THREE.Color();
parts.forEach((p,i)=>{pm.setMatrixAt(i,M4.compose(V3.set(p[0],p[1],p[2]),Q.setFromAxisAngle(V3.clone().set(0,1,0),p[7]),SC.set(p[3],p[4],p[5])));pm.setColorAt(i,C.setHex(p[6]))});S.add(pm)
// the launches stand two stops deeper in the haze than the rest of the river (Anwar): soft silhouettes against the low sun, no hard edges
const LM=PM.clone();LM.onBeforeCompile=sh=>{sh.fragmentShader=sh.fragmentShader.replace('#include <fog_fragment>',`#ifdef USE_FOG
 float lf=clamp(.6+.4*(1.-exp(-pow(fogDensity*vFogDepth*1.8,2.))),0.,.97);gl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor*.93,lf);
#endif`)};
const lmesh=new THREE.InstancedMesh(box,LM,lparts.length);lparts.forEach((p,i)=>{lmesh.setMatrixAt(i,M4.compose(V3.set(p[0],p[1],p[2]),Q.setFromAxisAngle(new THREE.Vector3(0,1,0),p[7]),SC.set(p[3],p[4],p[5])));lmesh.setColorAt(i,C.setHex(p[6]))});S.add(lmesh);
const hcyl=new THREE.CylinderGeometry(.5,.5,1,20,1,false,-Math.PI/2,Math.PI),YA=new THREE.Vector3(0,1,0);
const rounds=list=>{const m=new THREE.InstancedMesh(hcyl,LM,list.length);list.forEach((p,i)=>{m.setMatrixAt(i,M4.compose(V3.set(p[0],p[1],p[2]),Q.setFromAxisAngle(YA,p[7]),SC.set(p[3],p[4],p[5])));m.setColorAt(i,C.setHex(p[6]))});return m};
S.add(rounds(lcyl));
// Keraniganj's walls: one window grid painted once, stretched per building, soft enough in the haze
const wc=document.createElement('canvas');wc.width=wc.height=256;{const g=wc.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,256,256);for(let r=0;r<6;r++)for(let c=0;c<5;c++)if(rnd()<.8){g.fillStyle=`rgba(40,38,32,${.5+rnd()*.3})`;g.fillRect(14+c*48,18+r*40,26,20)}g.fillStyle='rgba(40,38,32,.35)';g.fillRect(0,0,256,8)}
const wT=new THREE.CanvasTexture(wc);wT.colorSpace=THREE.SRGBColorSpace;const bm=new THREE.InstancedMesh(box,new THREE.MeshStandardMaterial({map:wT,roughness:.9}),bparts.length);
bparts.forEach((p,i)=>{bm.setMatrixAt(i,M4.compose(V3.set(p[0],p[1],p[2]),Q.identity(),SC.set(p[3],p[4],p[5])));bm.setColorAt(i,C.setHex(p[6]))});S.add(bm);
const lm=new THREE.InstancedMesh(box,new THREE.MeshBasicMaterial({color:0xffffff}),lights.length);
lights.forEach((l,i)=>{lm.setMatrixAt(i,M4.compose(V3.set(l[0],l[1],l[2]),Q.setFromAxisAngle(new THREE.Vector3(0,1,0),l[3]),SC.set(.2,l[5],l[4])));lm.setColorAt(i,l[6]?C.setRGB(1.5,1.8,1.55):C.setRGB(2.2,1.45,.7))});S.add(lm);
// the solar roof tilts to the sun; bamboo poles at both ghats; wooden noukas moored at Keraniganj
const solar=new THREE.Mesh(new THREE.BoxGeometry(18.4,.12,7),new THREE.MeshStandardMaterial({color:0x1d2632,roughness:.25,metalness:.4}));solar.position.set(-50,9.05,118.4);solar.rotation.z=.18;S.add(solar);
// the terminal's faces are painted once each. The east wall is the one the steps arrive at, and it is the wall of the second act seen from the river:
// the fare list in its red line, the ticket window with a clerk in it, the green dado. Soot runs down from every roof line and damp climbs from the deck.
{let s2=91;const rn=()=>(s2=(s2*16807)%2147483647)/2147483647;
 const wallTex=(Wm,Hm,p,paint)=>{const c=document.createElement('canvas'),W=c.width=Math.round(Wm*p),H=c.height=Math.round(Hm*p),g=c.getContext('2d'),Y=m=>H-m*p;
  g.fillStyle='#cdbf9b';g.fillRect(0,0,W,H);for(let i=0;i<Wm*Hm*4;i++){g.fillStyle=`rgba(${rn()<.5?'96,84,60':'238,230,208'},${rn()*.08})`;g.fillRect(rn()*W-40,rn()*H,20+rn()*170,6+rn()*44)}
  g.fillStyle='#27493c';g.fillRect(0,Y(1.05),W,1.05*p);g.fillStyle='#8f2a23';g.fillRect(0,Y(1.16),W,.07*p);for(let i=0;i<Wm*9;i++){g.fillStyle=`rgba(205,191,155,${.25+rn()*.5})`;g.fillRect(rn()*W,Y(1.05)+rn()*1.05*p,3+rn()*16,2+rn()*8)}
  paint(g,p,Y,W,H);
  for(let i=0;i<Wm*4.5;i++){const x=rn()*W,l=(.3+rn()*rn()*2.8)*p,gr=g.createLinearGradient(0,0,0,l);gr.addColorStop(0,`rgba(28,30,22,${.22+rn()*.34})`);gr.addColorStop(1,'rgba(28,30,22,0)');g.fillStyle=gr;g.fillRect(x,0,2+rn()*10,l)}
  const dg=g.createLinearGradient(0,H,0,Y(.75));dg.addColorStop(0,'rgba(16,20,12,.78)');dg.addColorStop(1,'rgba(16,20,12,0)');g.fillStyle=dg;g.fillRect(0,Y(.75),W,.75*p);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t};
 const face=(t,w,hh,x,y,z,ry)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,hh),new THREE.MeshStandardMaterial({map:t,roughness:.92,emissive:0xffffff,emissiveMap:t,emissiveIntensity:.17}));m.position.set(x,y,z);m.rotation.y=ry;S.add(m)};
 const door=(g,p,Y,x,w,hh,col)=>{g.fillStyle='#b5a987';g.fillRect((x-.08)*p,Y(hh+.12),(w+.16)*p,.12*p);g.fillStyle=col;g.fillRect(x*p,Y(hh),w*p,hh*p);g.fillStyle='rgba(0,0,0,.34)';for(let k=1;k<w/.19;k++)g.fillRect((x+k*.19)*p,Y(hh),2,hh*p)};
 const shut=(g,p,Y,x,y,w,hh,open)=>{g.fillStyle='#17140f';g.fillRect(x*p,Y(y+hh),w*p,hh*p);g.fillStyle='#355f4e';g.fillRect(x*p,Y(y+hh),w*p*(open?.5:1),hh*p);g.fillStyle='rgba(0,0,0,.3)';for(let k=1;k<hh/.11;k++)g.fillRect(x*p,Y(y+k*.11),w*p*(open?.5:1),1.5);g.fillStyle='#b5a987';g.fillRect((x-.06)*p,Y(y),(w+.12)*p,.07*p)};
 // east wall: door from the steps, the fare list, a handbill, the ticket window under its tin hood, a meter box and its conduit, brick where the plaster has gone
 face(wallTex(10.4,4.4,100,(g,p,Y,W)=>{door(g,p,Y,.95,1.05,2.2,'#2f5a49');g.fillStyle='#16130e';g.fillRect(1.82*p,Y(2.2),.18*p,2.2*p);
  const fx=2.8*p,fy=Y(3.4),fw=2.5*p,fh=2.05*p;g.fillStyle='#efe8d6';g.fillRect(fx,fy,fw,fh);g.strokeStyle='#9e2b25';g.lineWidth=7;g.strokeRect(fx+9,fy+9,fw-18,fh-18);g.strokeStyle='#0f2a24';g.lineWidth=1.5;g.strokeRect(fx+19,fy+19,fw-38,fh-38);
  g.fillStyle='#0f2a24';g.font="400 46px 'Tanker'";g.fillText('FARES',fx+30,fy+68);g.fillStyle='#9e2b25';g.font="400 26px 'Tiro Bangla'";g.fillText('ভাড়ার তালিকা',fx+32,fy+100);
  for(let k=0;k<4;k++){g.fillStyle='#0f2a24';g.fillRect(fx+32,fy+126+k*18,62+((k*37)%52),7);g.fillStyle='#9e2b25';g.fillRect(fx+fw-76,fy+125+k*18,38,9)}
  g.fillStyle='#9e2b25';g.beginPath();g.arc(fx+fw-62,fy+70,30,0,7);g.fill();g.fillStyle='#efe8d6';g.font="400 26px 'Tanker'";g.fillText('20',fx+fw-76,fy+80);
  g.save();g.translate(5.5*p,Y(2.15));g.rotate(.03);g.fillStyle='#e6cf8c';g.fillRect(0,0,.42*p,.6*p);g.fillStyle='rgba(40,30,10,.5)';for(let k=0;k<6;k++)g.fillRect(5,8+k*8,30-k%3*6,2);g.restore();
  g.fillStyle='#b5a987';g.fillRect(6.12*p,Y(1.16),1.76*p,.1*p);g.fillStyle='#14110c';g.fillRect(6.2*p,Y(2.4),1.6*p,1.24*p);
  g.fillStyle='#4a514c';g.beginPath();g.moveTo(6.02*p,Y(2.52));g.lineTo(7.98*p,Y(2.52));g.lineTo(7.9*p,Y(2.86));g.lineTo(6.1*p,Y(2.86));g.fill();g.fillStyle='rgba(122,58,26,.6)';for(let k=0;k<7;k++)g.fillRect((6.1+rn()*1.8)*p,Y(2.86),2+rn()*4,(.1+rn()*.24)*p);
  g.fillStyle='#9e2b25';g.font="400 30px 'Tiro Bangla'";g.fillText('টিকিট',6.62*p,Y(3.0));
  g.fillStyle='#2b2f2c';g.fillRect(8.5*p,Y(2.5),.36*p,.5*p);g.fillRect(8.66*p,Y(4.4),.04*p,1.9*p);
  g.fillStyle='#7a4630';g.fillRect(9.1*p,Y(1.9),1.3*p,.85*p);g.fillStyle='rgba(40,22,14,.55)';for(let k=0;k<9;k++){g.fillRect(9.1*p,Y(1.9)+k*.094*p,1.3*p,1.5);for(let b=0;b<6;b++)g.fillRect((9.1+b*.23+(k%2)*.115)*p,Y(1.9)+k*.094*p,1.5,.094*p)}
 }),10.4,4.4,-35.97,4.6,116.8,Math.PI/2);
 // the river face of the hall, under the verandah: no two openings alike
 face(wallTex(20,5,64,(g,p,Y)=>{g.fillStyle='#14110c';g.fillRect(.8*p,Y(2.9),2.8*p,2.9*p);g.fillStyle='#6f736b';g.fillRect(.8*p,Y(2.9),2.8*p,1.3*p);g.fillStyle='rgba(0,0,0,.3)';for(let k=0;k<13;k++)g.fillRect(.8*p,Y(2.9)+k*.1*p,2.8*p,1.5);
  shut(g,p,Y,5,1,1.1,1.3,true);g.fillStyle='#14110c';g.beginPath();g.moveTo(7.4*p,Y(0));g.lineTo(7.4*p,Y(2.2));g.arc(8.5*p,Y(2.2),1.1*p,Math.PI,0);g.lineTo(9.6*p,Y(0));g.fill();
  shut(g,p,Y,11,1,1.15,1.3,false);g.fillStyle='#14110c';g.fillRect(13.5*p,Y(2.7),3.5*p,2.7*p);for(let k=0;k<9;k++){g.fillStyle=k%2?'#d9d0b6':'#9e2b25';g.fillRect((13.4+k*.41)*p,Y(3.25),.41*p,.55*p)}
  g.fillStyle='#2b2f2c';g.fillRect(18.2*p,Y(3.6),1*p,.5*p);g.fillStyle='rgba(205,191,155,.7)';for(let k=1;k<5;k++)g.fillRect(18.2*p,Y(3.6)+k*.1*p,1*p,1.5)}),20,5,-50,4.9,113.97,Math.PI);
 // the ticket office's river face: a grilled window and the lifebuoy every ghat hangs up; the wing: two doors that were never the same width
 face(wallTex(4,4.4,64,(g,p,Y)=>{shut(g,p,Y,.5,1.2,1.2,1.2,false);g.lineWidth=.13*p;g.strokeStyle='#e9e2cf';g.beginPath();g.arc(2.95*p,Y(1.9),.36*p,0,7);g.stroke();g.strokeStyle='#b3261a';for(let k=0;k<4;k++){g.beginPath();g.arc(2.95*p,Y(1.9),.36*p,k*1.571+.2,k*1.571+.75);g.stroke()}}),4,4.4,-38,4.6,111.57,Math.PI);
 face(wallTex(8,3.4,64,(g,p,Y)=>{door(g,p,Y,1,1.4,2.2,'#5b3a28');door(g,p,Y,4.6,.9,2.05,'#2f5a49');shut(g,p,Y,6.3,1.2,.9,.9,false)}),8,3.4,-64,4.1,115.17,Math.PI);
 // the name board: enamel blue and cream, the same blue as the fare board on our rail, rust weeping from its bolts
 const sc=document.createElement('canvas');sc.width=1040;sc.height=136;{const g=sc.getContext('2d');g.fillStyle='#234a78';g.fillRect(0,0,1040,136);g.strokeStyle='#e9e2cf';g.lineWidth=5;g.strokeRect(9,9,1022,118);
  g.fillStyle='#f1ead6';g.textBaseline='middle';g.font="400 90px 'Tiro Bangla'";g.fillText('সদরঘাট',40,72);g.font="400 86px 'Tanker'";g.fillText('NOUKA',408,74);g.font="700 23px 'Supreme'";g.fillText('SADARGHAT · KERANIGANJ',668,72);
  for(let i=0;i<16;i++){const x=rn()*1040,l=20+rn()*90,gr=g.createLinearGradient(0,0,0,l);gr.addColorStop(0,`rgba(122,58,26,${.3+rn()*.4})`);gr.addColorStop(1,'rgba(122,58,26,0)');g.fillStyle=gr;g.fillRect(x,0,2+rn()*5,l)}}
 const st=new THREE.CanvasTexture(sc);st.colorSpace=THREE.SRGBColorSpace;st.anisotropy=8;
 const sign=new THREE.Mesh(new THREE.PlaneGeometry(13,1.7),new THREE.MeshStandardMaterial({map:st,roughness:.5,emissive:0xffffff,emissiveMap:st,emissiveIntensity:.2,side:THREE.DoubleSide}));sign.position.set(-50,9.1,113.95);sign.rotation.y=Math.PI;S.add(sign);
 // the tin verandah, the water tank, and the ticket window: one bulb inside, the clerk against it, bars across
 const tin=new THREE.Mesh(new THREE.BoxGeometry(21,.1,4.5),new THREE.MeshStandardMaterial({color:0x39403d,roughness:.55,metalness:.3}));tin.position.set(-50.6,5.05,111.85);tin.rotation.x=.25;S.add(tin);
 const tank=new THREE.Mesh(new THREE.CylinderGeometry(.78,.78,1.55,16),new THREE.MeshStandardMaterial({color:0x15161a,roughness:.5}));tank.position.set(-65,7.19,119.6);S.add(tank);
 const kc=document.createElement('canvas');kc.width=160;kc.height=124;{const g=kc.getContext('2d'),gr=g.createRadialGradient(104,30,4,90,60,120);gr.addColorStop(0,'#ffe2a6');gr.addColorStop(.3,'#f0a850');gr.addColorStop(1,'#6a3c16');g.fillStyle=gr;g.fillRect(0,0,160,124);
  g.fillStyle='#1b140c';g.beginPath();g.arc(58,66,17,0,7);g.fill();g.beginPath();g.ellipse(58,128,36,50,0,0,7);g.fill();g.fillStyle='#17140f';for(let k=1;k<8;k++)g.fillRect(k*20-2,0,4,124);g.fillRect(0,58,160,4)}
 const kt=new THREE.CanvasTexture(kc);kt.colorSpace=THREE.SRGBColorSpace;const tw0=new THREE.Mesh(new THREE.PlaneGeometry(1.6,1.24),new THREE.MeshBasicMaterial({map:kt,color:new THREE.Color().setRGB(1.3,1.1,.9)}));tw0.position.set(-35.95,4.18,115);tw0.rotation.y=Math.PI/2;S.add(tw0)}
const bam=new THREE.MeshStandardMaterial({color:0x8a7a52,roughness:.7});
for(const[x,z,h,l]of[[-6,99.5,5.2,.05],[-33,100,4.4,-.08],[-40,-163.5,4.8,.06],[-80,-162.5,5,-.05]]){const b=new THREE.Mesh(new THREE.CylinderGeometry(.045,.06,h,10),bam);b.position.set(x,h/2-.8,z);b.rotation.z=l;S.add(b)}
const wood=new THREE.MeshStandardMaterial({color:0x3a2c1e,roughness:.8});
for(const[x,z,r]of[[-86,-160,.2],[-96,-158,-.1],[-36,-160.5,.05]]){const g=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,9,16,1,false,0,Math.PI),wood);g.rotation.set(0,r,Math.PI/2);g.scale.set(1,1,.45);g.position.set(x,.25,z);S.add(g)}
// the drifter: one launch that pulls out while you watch, and sounds its horn
const dparts=[],dcyl=[],l0=lights.length;launch(0,0,58,0x9d3b2e,Math.PI/2,dparts,true,1,dcyl);const dl=lights.splice(l0);const drift=new THREE.InstancedMesh(box,LM,dparts.length);
dparts.forEach((p,i)=>{drift.setMatrixAt(i,M4.compose(V3.set(p[0],p[1],p[2]),Q.setFromAxisAngle(new THREE.Vector3(0,1,0),p[7]),SC.set(p[3],p[4],p[5])));drift.setColorAt(i,C.setHex(p[6]))});S.add(drift);drift.position.set(-230,0,70);
// the drifter is the launch in view, so it carries the one string of lit windows, fixed to it as it pulls out
const dlm=new THREE.InstancedMesh(box,lm.material,dl.length);dl.forEach((l,i)=>{dlm.setMatrixAt(i,M4.compose(V3.set(l[0],l[1],l[2]),Q.setFromAxisAngle(new THREE.Vector3(0,1,0),l[3]),SC.set(.2,l[5],l[4])));dlm.setColorAt(i,l[6]?C.setRGB(1.5,1.8,1.55):C.setRGB(2.2,1.45,.7))});drift.add(dlm);drift.add(rounds(dcyl));
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
// P45, after looking at the Commons photographs "Buriganga and waves" and "Boat on the Buriganga": the river is matte and full of silt, its surface a short wind chop
// with no two crests alike, and nothing reflects in it as a picture, only as a smear dragged toward you. So the swell is halved, the chop is three octaves of noise
// (each faded out before a crest gets smaller than a pixel, and what fades is kept as roughness), the mirror is read seven times along the smear, and the body is silt.
const water=new THREE.Mesh(new THREE.PlaneGeometry(4000,4000),new THREE.ShaderMaterial({uniforms:WU,fog:false,extensions:{derivatives:true},
 vertexShader:`varying vec3 vW;void main(){vW=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vW,1.);}`,
 fragmentShader:`uniform sampler2D uRef,uName;uniform vec2 uR,uOil;uniform vec3 uCam,uSun,uFog;uniform float uT,uNA,uFD;uniform mat4 uPV0;uniform vec4 uS[12];varying vec3 vW;
 float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hs(i),hs(i+vec2(1,0)),f.x),mix(hs(i+vec2(0,1)),hs(i+vec2(1,1)),f.x),f.y);}
 vec3 vnd(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f),du=6.*f*(1.-f);float a=hs(i),b=hs(i+vec2(1,0)),c=hs(i+vec2(0,1)),e=hs(i+vec2(1,1));return vec3(a+(b-a)*u.x+(c-a)*u.y+(a-b-c+e)*u.x*u.y,du*(vec2(b-a,c-a)+(a-b-c+e)*u.yx));}
 float wk(vec2 p){float h=0.;for(int i=0;i<12;i++){vec4 s=uS[i];float a=uT-s.z;if(a<0.||a>5.)continue;float r=length(p-s.xy),x=r-1.6*a-.3;h+=s.w*.42*exp(-a*.75)*sin(x*6.4)*exp(-x*x*1.5)/(1.+r*.35);}return h;}
 float fm(vec2 p){float q=0.;for(int i=0;i<12;i++){vec4 s=uS[i];float a=uT-s.z;if(a<0.||a>4.)continue;float r=length(p-s.xy);q+=s.w*(1.-a/4.)*(exp(-pow(r-1.6*a-.3,2.)*5.)*.6+exp(-r*r*.8)*(1.-a/1.5)*step(a,1.5));}return q;}
 void main(){vec2 p=vW.xz;float d=length(uCam-vW);
  vec2 g=vec2(0.);for(int i=0;i<5;i++){float fi=float(i),a=fi*1.9+.3;vec2 k=vec2(cos(a),sin(a))*(1.3+fi*1.1);g+=k*cos(dot(p,k)+uT*(1.1+fi*.55)+fi*2.)*(.013/(1.+fi*.7));}
  g*=1./(1.+d*.035);float e=.04,h0=wk(p);g+=vec2(wk(p+vec2(e,0.))-h0,wk(p+vec2(0.,e))-h0)/e;
  float fw=max(length(dFdx(p)),length(dFdy(p))),rough=0.,fr=2.1,am=.062;mat2 ro=mat2(.8,.6,-.6,.8);vec2 q2=p;
  for(int i=0;i<3;i++){q2=ro*q2;float keep=1.-smoothstep(.12,.42,fw*fr*2.2);vec3 n=vnd(q2*fr*vec2(1.,1.8)+vec2(uT*(.34+float(i)*.21),-uT*.13*float(i)));
   vec2 dn=n.yz*vec2(1.,1.8);for(int k=0;k<=i;k++)dn=dn*ro;g+=dn*am*keep;rough+=am*(1.-keep);fr*=2.3;am*=.8;}
  vec3 N=normalize(vec3(-g.x,1.,-g.y)),V=normalize(vW-uCam);float F=(.02+.98*pow(1.-max(dot(-V,N),0.),5.))*.64;
  vec2 su=gl_FragCoord.xy/uR,rc=vec2(su.x,1.-su.y),off=vec2(N.x*.05,N.z*.13)/(1.+d*.03);float sp=.018+rough*.5,jt=hs(gl_FragCoord.xy*.731+3.1);
  vec3 ref=vec3(0.);for(int i=0;i<7;i++){float k=(float(i)+jt)/7.-.5;ref+=texture2D(uRef,rc+off+vec2(k*sp*.22*(jt-.5),k*sp)).rgb;}ref/=7.;
  vec3 Tr=refract(V,normalize(vec3(-g.x*.35,1.,-g.y*.35)),.75);vec3 q=vW+Tr*(-.3/min(Tr.y,-.08));vec4 c0=uPV0*vec4(q,1.);vec2 nu=c0.xy/c0.w*.5+.5;float nm=0.;
  if(c0.w>0.&&nu.x>0.&&nu.x<1.&&nu.y>0.&&nu.y<1.)nm=texture2D(uName,nu).r;
  float silt=vn(p*.06+vec2(uT*.012,0.))*.6+vn(p*.29+3.7)*.4;
  vec3 body=mix(vec3(.118,.108,.066),vec3(.2,.172,.112),silt)+vec3(.06,.052,.028)*smoothstep(0.,.3,dot(-V,uSun));body*=1.+clamp(dot(N.xz,normalize(uSun.xz)),-.4,.4)*1.5;
  body=mix(body,vec3(.93,.88,.74),nm*uNA*.8);
  vec3 col=mix(body,ref,F*(1.-nm*uNA*.75));
  vec3 H=normalize(uSun-V);float fa=clamp(rough/.1,0.,1.);col+=vec3(1.,.7,.42)*pow(max(dot(N,H),0.),mix(420.,70.,fa))*mix(16.,1.1,fa);
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
 sndOn=!sndOn;ac.resume();master.gain.cancelScheduledValues(ac.currentTime);master.gain.value=sndOn?1:0;sndB.textContent='Sound · '+(sndOn?'on':'off')};
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
window.__nk={cam,boat,route:()=>route,slots,WU,get u(){return u},get t(){return (performance.now()-t0)/1000}};
// ashore: past the river the sound button has nothing to switch, and on a phone it sat across the fare prices. It listens to the scroll itself, never to the render loop, so a slow frame cannot leave it showing.
let ashore=false;const shore=()=>{const a=scrollY>drv.offsetHeight-innerHeight+6;if(a!==ashore){ashore=a;document.body.classList.toggle('ashore',a);if(master)master.gain.setTargetAtTime(!a&&sndOn?1:0,ac.currentTime,.3)}};addEventListener('scroll',shore,{passive:true});shore();const SPQ=QS.has('sp')?+QS.get('sp'):null;
function emit(x,z,t,w){slots[slotI].set(x,z,t,w);slotI=(slotI+1)%12}
function frame(now){requestAnimationFrame(frame);const dt=Math.max(0,Math.min(.05,(now-last)/1000));last=now;const t=Math.max(0,(now-t0)/1000);
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
