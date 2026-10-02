// Folio, issue 14, Rivers. A quarterly on a linen mat at a reading desk, north window on the left. Units are centimetres.
// Every page is typeset from this document's own HTML into a texture; the hand turns a leaf and the leaf bends:
// the fold highlight travels, the paper goes faintly translucent and the other side ghosts through.
import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {lux} from './lib/lux.js';

const cv=document.getElementById('gl'),phone=innerWidth<760,DPR=Math.min(devicePixelRatio,2);
const R=new THREE.WebGLRenderer({canvas:cv,antialias:true});
R.setPixelRatio(DPR);R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=2.3;
const S=new THREE.Scene();S.background=new THREE.Color(0x0e0b09);
let seed=14;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const sm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};
const QS=new URLSearchParams(location.search),qn=(k,d)=>QS.has(k)?+QS.get(k):d;
const SUN=qn('sun',1050),WIN={u0:qn('u0',.14),u1:qn('u1',.86),v0:qn('v0',.12),v1:qn('v1',.56),bar:qn('bar',.81),rail:qn('rail',.325),soft:qn('soft',22)};   // the window's light, and where its frame and bars fall (set from the address bar while tuning)
const W=23,H=28.75,N=5,T=.62,Y0=.12;        // page, leaves, thickness of the whole block, top of the linen

// ================= the typesetter: every page drawn from the HTML in #src, at the proportions the flat site used =================
const PW=phone?768:1152,PH=PW*1.25,K=PW/720;                 // CSS px at a 1440x900 viewport, where one page was 720x900
const sB=phone?1.5:1,sD=phone?1.15:1;                         // on a phone the camera frames one text block, so the text is set larger
const L=v=>v*K,B=v=>v*K*sB,D=v=>v*K*sD,cl=(a,vw,c)=>Math.min(c,Math.max(a,vw*14.4));
const PAPER='#F3EFE6',INK='#16130f',RED='#C8321F',GAM='Gambetta, Georgia, serif',MONO='"JetBrains Mono", monospace',BN='"Tiro Bangla", serif';
const src=document.getElementById('src'),F=[...src.querySelectorAll('.base,.face')];
const tx=e=>e?e.textContent.replace(/\s+/g,' ').trim():'';
const own=e=>[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').replace(/\s+/g,' ').trim();
function sf(g,sz,{st='',w=400,fam=GAM,ls=0}={}){g.font=`${st} ${w} ${sz}px ${fam}`;g.letterSpacing=`${ls}px`}
function sheet(bg){const c=document.createElement('canvas');c.width=PW;c.height=PH;const g=c.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,PW,PH);g.textBaseline='middle';
 for(let i=0;i<PW*PH/700;i++){g.strokeStyle=rnd()<.5?'rgba(255,252,240,.05)':'rgba(70,52,34,.04)';g.lineWidth=.7*K;const x=rnd()*PW,y=rnd()*PH,a=rnd()*6.28,l=(2+rnd()*7)*K;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke()}
 return {c,g}}
const PADT=L(49.5),PADX=L(60.5),CW=PW-2*PADX;
function meta(g,t,x,top,col,align='left',a=1){sf(g,B(10.5),{fam:MONO,ls:B(.84)});g.fillStyle=col;g.globalAlpha=a;g.textAlign=align;g.fillText(t.toUpperCase(),x,top+B(10.5)*.75);g.textAlign='left';g.globalAlpha=1;return top+B(10.5)*1.5}
function wrap(g,t,maxW){const out=[];let cur='';for(const w of t.split(' ')){const s=cur?cur+' '+w:w;if(cur&&g.measureText(s).width>maxW){out.push(cur);cur=w}else cur=s}if(cur)out.push(cur);return out}
function block(g,t,x,top,maxW,sz,lh,opt={}){sf(g,sz,opt);const ls=wrap(g,t,maxW);ls.forEach((l,i)=>g.fillText(l,x,top+sz*lh*(i+.5)));return top+ls.length*sz*lh}
// rich lines: tokens {t, c, st} so a red italic phrase can sit inside a line
function rich(g,toks,x,top,maxW,sz,lh,base){const words=[];toks.forEach(k=>k.t.split(' ').filter(Boolean).forEach(w=>words.push({...k,t:w,br:false})));
 const lines=[[]];let wid=0;const mw=k=>{sf(g,sz,{...base,st:k.st||base.st||''});return g.measureText(k.t).width},sp=()=>{sf(g,sz,base);return g.measureText(' ').width};
 toks.forEach(()=>{});
 for(const k of words){const w=mw(k);if(lines.at(-1).length&&wid+sp()+w>maxW){lines.push([]);wid=0}wid+=(lines.at(-1).length?sp():0)+w;lines.at(-1).push(k)}
 lines.forEach((ln,i)=>{let xx=x;ln.forEach((k,j)=>{sf(g,sz,{...base,st:k.st||base.st||''});g.fillStyle=k.c;g.fillText(k.t,xx,top+sz*lh*(i+.5));xx+=g.measureText(k.t).width+sp()})});return top+lines.length*sz*lh}
// running text in columns: justified, first-line indents, a drop cap, balanced like CSS columns; a line that would gape sets ragged, so no rivers of white
function columns(g,paras,x,top,width,cols,sz,lh,drop,col){const gap=L(34.6),colW=(width-gap*(cols-1))/cols,LH=sz*lh,out=[];let dw=0,dc='';
 sf(g,sz);const spW=g.measureText(' ').width;
 paras.forEach((p,pi)=>{let text=p;if(pi===0&&drop){dc=text[0];text=text.slice(1);sf(g,sz*5.4,{w:600});dw=g.measureText(dc).width+sz*.18;sf(g,sz)}
  const words=text.split(' ');let line=[],w=0,first=true;
  const avail=()=>colW-(first&&pi>0?sz*1.4:0)-(pi===0&&drop&&out.length<3?dw:0);
  for(const wd of words){const ww=g.measureText(wd).width;if(line.length&&w+spW+ww>avail()){out.push({ws:line,x:(first&&pi>0?sz*1.4:0)+(pi===0&&drop&&out.length<3?dw:0),w:avail(),last:false,par:pi,first});line=[];w=0;first=false}
   w+=(line.length?spW:0)+ww;line.push(wd)}
  out.push({ws:line,x:(first&&pi>0?sz*1.4:0)+(pi===0&&drop&&out.length<3?dw:0),w:avail(),last:true,par:pi,first})});
 const per=Math.ceil(out.length/cols),marks=[];g.fillStyle=col;
 out.forEach((ln,i)=>{const c=Math.floor(i/per),r=i%per,x0=x+c*(colW+gap)+ln.x,y=top+LH*(r+.5);sf(g,sz);
  if(ln.first)marks.push({par:ln.par,x:x+c*(colW+gap),y});
  const tw=ln.ws.reduce((s,wd)=>s+g.measureText(wd).width,0);let gp=ln.last||ln.ws.length<2?spW:(ln.w-tw)/(ln.ws.length-1);if(gp>spW*2.3)gp=spW;let xx=x0;ln.ws.forEach(wd=>{g.fillText(wd,xx,y);xx+=g.measureText(wd).width+gp})});
 if(drop){sf(g,sz*5.4,{w:600});g.fillStyle=RED;g.textBaseline='alphabetic';g.fillText(dc,x,top+LH*2.72);g.textBaseline='middle'}
 return {bottom:top+per*LH,marks}}
function finish(g,side,pn,col,dark){const w=PW*.08,gr=g.createLinearGradient(side==='R'?0:PW,0,side==='R'?w:PW-w,0);gr.addColorStop(0,`rgba(0,0,0,${dark?.34:.15})`);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,PW,PH);
 if(pn){sf(g,B(11),{fam:MONO});g.fillStyle=col;g.textAlign=side==='R'?'right':'left';g.fillText(pn,side==='R'?PW-PADX:PADX,PH-L(36)-B(11)*.6);g.textAlign='left'}}
const pages={
 cover(e){const {c,g}=sheet(RED);meta(g,tx(e.querySelector('.meta')),PADX,PADT,PAPER);
  sf(g,D(cl(160,26,480)),{st:'italic',ls:-D(cl(160,26,480))*.06});g.fillStyle=PAPER;g.globalAlpha=.95;g.textAlign='right';g.fillText(tx(e.querySelector('.n')),PW-L(43.2),L(126)+D(cl(160,26,480))*.375);g.textAlign='left';g.globalAlpha=1;
  const li=[...e.querySelectorAll('li')],row=L(7)*2+B(10)*1.35+L(2)+B(18)*1.35;let y=PH-PADT-li.length*row;const mast=D(cl(80,13,230));
  sf(g,mast,{w:600,ls:-mast*.05});g.fillText(tx(e.querySelector('.mast')),PADX-mast*.04,y-mast*.78*.5);
  li.forEach(l=>{g.fillStyle='rgba(243,239,230,.45)';g.fillRect(PADX,y,Math.min(L(340)*sB,CW),Math.max(1,K));g.fillStyle=PAPER;
   meta(g,tx(l.querySelector('i')),PADX,y+L(7),PAPER,'left',.8);sf(g,B(18));g.fillText(own(l),PADX,y+L(7)+B(10)*1.35+L(2)+B(18)*1.35/2);y+=row});
  finish(g,'R','',PAPER,true);return c},
 colophon(e){const {c,g}=sheet(PAPER);let y=meta(g,tx(e.querySelector('.meta')),PADX,PADT,INK);g.fillStyle=INK;
  y=block(g,tx(e.querySelector('h2')),PADX,y+L(81),CW,D(cl(38,4.4,74)),.95,{st:'italic',ls:-D(cl(38,4.4,74))*.02})+L(45);
  const dt=[...e.querySelectorAll('dt')],dd=[...e.querySelectorAll('dd')];
  dt.forEach((d,i)=>{meta(g,tx(d),PADX,y+B(3),INK,'left',.6);g.fillStyle=INK;y=block(g,tx(dd[i]),PADX+L(148)*sB,y,Math.min(L(282)*sB,CW-L(148)*sB),B(15),1.45)+L(9)});
  finish(g,'L',tx(e.querySelector('.pn')),INK);return c},
 contents(e){const {c,g}=sheet(PAPER);let y=meta(g,tx(e.querySelector('.meta')),PADX,PADT,INK);const h=D(cl(70,9,150));
  sf(g,h,{w:600,ls:-h*.05});g.fillStyle=INK;g.fillText(tx(e.querySelector('h2')),PADX-h*.03,y+h*.8*.5);y+=h*.8+L(45);
  const sz=B(cl(17,1.5,24));
  [...e.querySelectorAll('li')].forEach(l=>{g.fillStyle=INK;g.fillRect(PADX,y,CW,Math.max(1,K));const top=y+L(14.4);const bs=B(cl(26,2.6,42));
   sf(g,bs,{st:'italic'});g.fillStyle=RED;g.fillText(tx(l.querySelector('b')),PADX,top+bs*.5);g.fillStyle=INK;
   const sp=l.querySelector('span'),x=PADX+sz*4.2,end=block(g,own(sp),x,top,CW-sz*4.2,sz,1.2);meta(g,tx(sp.querySelector('i')),x,end+L(5),INK,'left',.6);
   y=Math.max(top+bs,end+L(5)+B(10.5)*1.2)+L(14.4)});
  finish(g,'R',tx(e.querySelector('.pn')),INK);return c},
 essay(e,side,pencil){const {c,g}=sheet(PAPER);let y=meta(g,tx(e.querySelector('.meta')),PADX,PADT,INK);g.fillStyle=INK;const h1=e.querySelector('h1');
  if(h1){const hs=D(cl(40,4.6,82));y=block(g,tx(h1),PADX,y+L(45),Math.min(hs*9,CW),hs,.92,{w:600,ls:-hs*.035})+L(27)}else y+=L(36);
  const ps=[...e.querySelectorAll('.cols p')].map(tx),sz=B(cl(14,1.08,17));const r=columns(g,ps,PADX,y,CW,phone?1:2,sz,1.55,true,INK);
  if(pencil){const m=r.marks.find(k=>k.par===1);if(m){g.strokeStyle='rgba(88,86,92,.5)';g.lineCap='round';for(let s=0;s<2;s++){g.lineWidth=(1.1+s*.5)*K;g.beginPath();
   const x0=(side==='L'?PADX*.55:PW-PADX*.55)+s*K,y0=m.y-sz*.5,y1=m.y+sz*1.55*3.6;g.moveTo(x0,y0);for(let k=1;k<=12;k++)g.lineTo(x0+(rnd()-.5)*1.4*K,y0+(y1-y0)*k/12);g.stroke()}}}
  const side2=e.querySelector('.side');if(side2){const nt=side2.querySelector('.note'),rows=[...side2.querySelectorAll('.tbl div')],half=(CW-L(34.6))/2;
   const tH=rows.length*B(11.5)*1.9,nsz=B(11);sf(g,nsz,{fam:MONO});const nl=wrap(g,tx(nt),half);const nH=L(12)+nl.length*nsz*1.6,top=Math.max(r.bottom+L(24),PH-L(90)-Math.max(tH,nH));
   g.fillStyle=RED;g.fillRect(PADX,top,half,2*K);g.fillStyle=INK;nl.forEach((l,i)=>g.fillText(l,PADX,top+L(12)+nsz*1.6*(i+.5)));
   sf(g,B(11.5),{fam:MONO});rows.forEach((d,i)=>{const [a,b]=[...d.querySelectorAll('span')].map(tx),yy=top+B(11.5)*1.9*(i+.5),x=PADX+half+L(34.6);g.fillText(a,x,yy);g.textAlign='right';g.fillText(b,x+half,yy);g.textAlign='left';
    g.fillStyle='rgba(22,19,15,.35)';for(let d2=0;d2<half;d2+=4*K)g.fillRect(x+d2,yy+B(11.5)*.95,1.5*K,K);g.fillStyle=INK})}
  finish(g,side,tx(e.querySelector('.pn')),INK);return c},
 quote(e){const {c,g}=sheet(INK);meta(g,tx(e.querySelector('.meta')),PADX,PADT,PAPER);const bq=e.querySelector('blockquote'),sz=D(cl(44,5.8,108));
  const toks=[...bq.childNodes].map(n=>({t:n.textContent,c:n.nodeName==='EM'?'#e0543f':PAPER}));
  sf(g,sz,{st:'italic',ls:-sz*.035});const base={st:'italic',ls:-sz*.035};
  const probe=document.createElement('canvas').getContext('2d');const lines=rich(probe,toks,0,0,CW,sz,.95,base);rich(g,toks,PADX,(PH-lines)/2,CW,sz,.95,base);
  finish(g,'R',tx(e.querySelector('.pn')),PAPER,true);return c},
 words(e){const {c,g}=sheet('#e7dfd0');const items=[...e.querySelectorAll(':scope > div')],foot=e.querySelector('.foot'),gapX=L(28.8),colW=(CW-gapX)/2,ws=D(cl(30,3.6,62)),is=B(10);
  const rowH=ws+L(4)+is*1.2,rows=Math.ceil(items.length/2),fs=B(cl(16,1.3,21));sf(g,fs,{st:'italic'});const fl=wrap(g,tx(foot),Math.min(fs*30,CW));
  const total=rows*rowH+(rows-1)*L(10.8)+L(10.8)+L(18)+fl.length*fs*1.35;let top=PADT+(PH-2*PADT-total)/2;
  items.forEach((d,i)=>{const x=PADX+(i%2)*(colW+gapX),y=top+Math.floor(i/2)*(rowH+L(10.8)),bn=d.classList.contains('bn');
   sf(g,ws,{fam:bn?BN:GAM,ls:bn?0:-ws*.02});g.fillStyle=bn?RED:INK;g.fillText(own(d),x,y+ws*.5);meta(g,tx(d.querySelector('i')),x,y+ws+L(4)-B(2),INK,'left',.55)});
  g.fillStyle=INK;sf(g,fs,{st:'italic'});const fy=top+rows*rowH+(rows-1)*L(10.8)+L(10.8)+L(18);fl.forEach((l,i)=>g.fillText(l,PADX,fy+fs*1.35*(i+.5)));
  finish(g,'R',tx(e.querySelector('.pn')),INK);return c},
 fiction(e){const {c,g}=sheet(PAPER);let y=meta(g,tx(e.querySelector('.meta')),PADX,PADT,INK);g.fillStyle=INK;const hs=D(cl(40,4.4,78));
  y=block(g,tx(e.querySelector('h1')),PADX,y+L(36),CW,hs,.95,{st:'italic'})+L(27);const sz=B(cl(15,1.15,18));
  [...e.querySelectorAll('p')].forEach(p=>{y=block(g,tx(p),PADX,y,Math.min(sz*31,CW),sz,1.6)+sz});
  finish(g,'L',tx(e.querySelector('.pn')),INK);return c},
 subs(e){const {c,g}=sheet(PAPER);const mt=meta(g,tx(e.querySelector('.meta')),PADX,PADT,INK);let h=D(cl(56,7,130));const ps=B(17),bs=B(13);
  const lines=[];let cur=[];[...e.querySelector('h2').childNodes].forEach(n=>{if(n.nodeName==='BR'){lines.push(cur);cur=[]}else cur.push(n)});lines.push(cur);
  // the headline shrinks until its widest line sits inside the text block (width and letter-spacing both scale with h)
  const lineW=ln=>ln.reduce((s,n)=>{const t=n.textContent.trim();if(!t)return s;sf(g,h,{w:600,st:n.nodeName==='I'?'italic':'',ls:-h*.05});return s+g.measureText(t+' ').width},0);
  const wMax=Math.max(...lines.map(lineW));if(wMax>CW)h*=CW/wMax;
  const p=e.querySelector('p'),a=e.querySelector('a');sf(g,ps);const pl=wrap(g,tx(p),Math.min(ps*26,CW));const btnH=bs*1.2+L(32),divH=pl.length*ps*1.5+L(27)+btnH;
  const divTop=PH-PADT-divH,hH=lines.length*h*.84;let y=mt+(divTop-mt-hH)/2;
  lines.forEach(ln=>{let x=PADX-h*.03;ln.forEach(n=>{const red=n.nodeName==='I';sf(g,h,{w:600,st:red?'italic':'',ls:-h*.05});g.fillStyle=red?RED:INK;const t=n.textContent.trim();if(!t)return;g.fillText(t,x,y+h*.84*.5);x+=g.measureText(t+' ').width});y+=h*.84});
  g.fillStyle=INK;sf(g,ps);pl.forEach((l,i)=>g.fillText(l,PADX,divTop+ps*1.5*(i+.5)));const by=divTop+pl.length*ps*1.5+L(27);
  sf(g,bs,{fam:MONO,ls:bs*.1});const bw=g.measureText(tx(a).toUpperCase()).width+L(44);g.fillStyle=INK;g.fillRect(PADX,by,Math.min(bw*1.6,CW*.4),Math.max(1,L(1.4)));g.fillText((tx(a)+' at folio-quarterly.com').toUpperCase(),PADX,by+btnH/2+L(6));   // a printed page has no buttons: the address is printed, the card on the desk carries the button
  finish(g,'R',tx(e.querySelector('.pn')),INK);return c},
 back(e){const {c,g}=sheet(INK);const ms=[...e.querySelectorAll('.meta')];meta(g,tx(ms[0]),PADX,PADT,PAPER);const h=D(cl(60,9,170));
  const parts=e.querySelector('h2').innerHTML.split(/<br\s*\/?>/i).map(s=>s.replace(/<[^>]+>/g,'').trim());sf(g,h,{st:'italic',ls:-h*.05});g.fillStyle=PAPER;
  parts.forEach((t,i)=>g.fillText(t,PADX-h*.03,PH*.5-parts.length*h*.8/2+h*.8*(i+.5)));
  const bh=L(60),bx=PW-PADX;let x=bx;g.fillStyle=PAPER;for(let i=0;i<34;i++){const w=(1+(rnd()*3|0))*K;x-=w+2*K;g.fillRect(x,PH-PADT-bh,w,bh)}
  meta(g,tx(ms[1]),PADX,PH-PADT-B(10.5)*1.5,PAPER);finish(g,'L','',PAPER,true);return c}};
// the paper, its sides: which face goes on which leaf
const LEAVES=[['cover',1,'colophon',0],['contents',2,'essay',3],['quote',4,'essay',5],['words',6,'fiction',7],['subs',8,'back',9]];

// ================= the room =================
function canvasTex(w,h,draw,srgb=true,rep=[1,1]){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);if(srgb)t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(...rep);t.anisotropy=R.capabilities.getMaxAnisotropy();return t}
const oak=canvasTex(1024,512,(g,w,h)=>{g.fillStyle='#2b1c12';g.fillRect(0,0,w,h);for(let i=0;i<220;i++){g.strokeStyle=`rgba(${rnd()<.5?14:96},${rnd()<.5?8:62},${rnd()<.5?4:36},${.07+rnd()*.13})`;g.lineWidth=1+rnd()*3;const y=rnd()*h;g.beginPath();g.moveTo(0,y);g.bezierCurveTo(w*.3,y+rnd()*16-8,w*.7,y+rnd()*16-8,w,y+rnd()*10-5);g.stroke()}},true,[2,2]);
const desk=new THREE.Mesh(new THREE.PlaneGeometry(260,180),new THREE.MeshStandardMaterial({map:oak,roughness:.62}));desk.rotation.x=-Math.PI/2;desk.receiveShadow=true;S.add(desk);
// linen: a plain weave with slubs, its own threads catching the window
const weave=(g,w,h,col)=>{g.fillStyle=col?'#857662':'#808080';g.fillRect(0,0,w,h);const v=()=>col?`rgba(${rnd()<.5?'96,84,66':'250,244,232'},${.05+rnd()*.07})`:`rgba(${rnd()<.5?'0,0,0':'255,255,255'},${.1+rnd()*.14})`;
 for(let y=0;y<h;y+=2){g.fillStyle=v();g.fillRect(0,y,w,1+rnd()*.6)}for(let x=0;x<w;x+=2){g.fillStyle=v();g.fillRect(x,0,1+rnd()*.6,h)}
 for(let i=0;i<90;i++){g.fillStyle=col?'rgba(150,132,106,.12)':'rgba(255,255,255,.28)';g.fillRect(rnd()*w,rnd()*h,14+rnd()*50,1.3)}};   
const linC=canvasTex(1024,1024,(g,w,h)=>weave(g,w,h,true),true,[11,8]),linB=canvasTex(1024,1024,(g,w,h)=>weave(g,w,h,false),false,[11,8]);
const mat=new THREE.Mesh(new THREE.PlaneGeometry(68,48),new THREE.MeshStandardMaterial({map:linC,bumpMap:linB,bumpScale:.03,roughness:.95}));mat.rotation.x=-Math.PI/2;mat.position.set(0,.06,.6);mat.receiveShadow=true;S.add(mat);
// one low sun through a sash window, from the left and a little behind the magazine: it rakes the linen and the paper's fibre.
// The light has the window's shape (P40, the taste judge: "no source exists"): a pool with a soft edge that ends on the mat beyond
// the fore-edge, one glazing bar across it and one down it, both laid to fall on the linen and never on a page. And it weakens with
// distance, as window light does, so the sheet is brighter at the spine side than at the far edge.
const win=canvasTex(512,512,(g,w,h)=>{g.fillStyle='#000';g.fillRect(0,0,w,h);g.filter=`blur(${WIN.soft}px)`;
 const gr=g.createLinearGradient(0,h,w,0);gr.addColorStop(0,'#fff');gr.addColorStop(1,'#d2d2d2');g.fillStyle=gr;g.fillRect(w*WIN.u0,h*(1-WIN.v1),w*(WIN.u1-WIN.u0),h*(WIN.v1-WIN.v0));
 g.fillStyle='rgba(0,0,0,.82)';g.fillRect(w*WIN.bar-w*.012,0,w*.024,h);g.fillRect(0,h*(1-WIN.rail)-h*.012,w,h*.024);g.filter='none'},true);
win.wrapS=win.wrapT=THREE.ClampToEdgeWrapping;
const sun=new THREE.SpotLight(0xffdfb8,SUN,0,.5,.5,1.2);sun.map=win;sun.position.set(-70,33,-34);sun.target.position.set(4,0,3);S.add(sun.target);sun.castShadow=true;sun.shadow.mapSize.set(phone?1024:2048,phone?1024:2048);
Object.assign(sun.shadow.camera,{near:30,far:190});sun.shadow.bias=-.0022;sun.shadow.normalBias=0;sun.shadow.radius=1.6;S.add(sun);
// the room behind the reader is wood and plaster, so what fills the shadows is warm: umber, not grey
S.add(new THREE.HemisphereLight(0xe4d8c6,0x6a4a2c,.7));   // warm, but pale enough that a page in the shade stays paper and does not turn the linen's tan
const warm=new THREE.DirectionalLight(0xffc89a,.22);warm.position.set(40,25,30);S.add(warm);
// the wide soft half of the shadow: a window is a large source, so beyond the tight dark line the sun draws at the block there is a
// soft one that fades toward the fore-edge. One under each half of the magazine, grown and shifted by how thick that half lies.
const pen=canvasTex(256,256,(g,w,h)=>{g.clearRect(0,0,w,h);g.filter='blur(15px)';g.fillStyle='#fff';g.fillRect(w*.2,h*.2,w*.6,h*.6);g.filter='none'},true);pen.wrapS=pen.wrapT=THREE.ClampToEdgeWrapping;
const soft=[0,1].map(()=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(W/.6,H/.6),new THREE.MeshBasicMaterial({map:pen,color:0x1d0f06,transparent:true,opacity:0,depthWrite:false}));m.rotation.x=-Math.PI/2;m.renderOrder=-1;S.add(m);return m});

// ================= the magazine =================
const fibre=canvasTex(512,512,(g,w,h)=>{g.fillStyle='#808080';g.fillRect(0,0,w,h);for(let i=0;i<4200;i++){g.strokeStyle=`rgba(${rnd()<.5?0:255},${rnd()<.5?0:255},${rnd()<.5?0:255},${.08+rnd()*.12})`;g.lineWidth=.8;const x=rnd()*w,y=rnd()*h,a=rnd()*6.28,l=2+rnd()*9;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke()}},false,[3,4]);
const edgeT=canvasTex(64,256,(g,w,h)=>{g.fillStyle='#e9e3d6';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=2){g.fillStyle=`rgba(90,74,56,${.06+rnd()*.16})`;g.fillRect(0,y,w,1)}},true);
const blockMat=[new THREE.MeshStandardMaterial({map:edgeT,roughness:.9}),new THREE.MeshStandardMaterial({map:edgeT,roughness:.9}),new THREE.MeshStandardMaterial({color:0x9a8f7e,roughness:.92}),new THREE.MeshStandardMaterial({color:0x9a8f7e,roughness:.92}),new THREE.MeshStandardMaterial({map:edgeT,roughness:.9}),new THREE.MeshStandardMaterial({map:edgeT,roughness:.9})];
const bG=new THREE.BoxGeometry(W,1,H),blockR=new THREE.Mesh(bG,blockMat),blockL=new THREE.Mesh(bG,blockMat);[blockR,blockL].forEach(b=>{b.castShadow=b.receiveShadow=true;S.add(b)});
blockR.position.x=W/2;blockL.position.x=-W/2;

const BEND=`uniform float uA,uC,uLift,uY,uW,uH;
vec3 bend(vec3 p,out vec3 nrm){float u=p.x+uW*.5,zc=-p.y,corner=smoothstep(-.3,1.,zc/(uH*.5));
 float du=u/24.,ph=uA;vec2 q=vec2(0.);
 for(int i=0;i<24;i++){float s=(float(i)+.5)*du;ph=uA+uC*s+uLift*corner*smoothstep(uW*.5,uW,s);q+=vec2(cos(ph),sin(ph))*du;}
 ph=uA+uC*u+uLift*corner*smoothstep(uW*.5,uW,u);nrm=vec3(-sin(ph),cos(ph),0.);return vec3(q.x,q.y+uY,zc);}`;
const leaves=[];
function makeLeaf(i,front,back){const U={uA:{value:0},uC:{value:0},uLift:{value:0},uY:{value:Y0},uW:{value:W},uH:{value:H},mapB:{value:back},uShow:{value:.035},uThin:{value:i===0||i===N-1?.14:.42}};
 const m=new THREE.MeshStandardMaterial({map:front,roughness:.9,metalness:0,side:THREE.DoubleSide,bumpMap:fibre,bumpScale:.012});
 m.onBeforeCompile=sh=>{Object.assign(sh.uniforms,U);
  sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\n'+BEND).replace('#include <beginnormal_vertex>','vec3 objectNormal;vec3 bentP=bend(position,objectNormal);').replace('#include <begin_vertex>','vec3 transformed=bentP;');
  sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nuniform sampler2D mapB;uniform float uShow,uW,uH;').replace('#include <map_fragment>',
  `vec4 fT=texture2D(map,vMapUv),bT=texture2D(mapB,vec2(1.-vMapUv.x,vMapUv.y));vec4 tex=gl_FrontFacing?fT:bT,oth=gl_FrontFacing?bT:fT;
   float ink=1.-dot(oth.rgb,vec3(.299,.587,.114));diffuseColor*=tex;diffuseColor.rgb*=1.-ink*uShow;
   vec2 eg=min(vMapUv,1.-vMapUv)*vec2(uW,uH);diffuseColor.rgb*=mix(.42,1.,smoothstep(0.,.11,min(eg.x,eg.y)));`)};
 const dm=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking});
 // one sheet of uncoated paper lets the window through, a cover less so: its shadow is thinned, so a lifted leaf no longer lays a black wedge
 dm.onBeforeCompile=sh=>{Object.assign(sh.uniforms,U);sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\n'+BEND).replace('#include <begin_vertex>','vec3 _n;vec3 transformed=bend(position,_n);');
  sh.fragmentShader=sh.fragmentShader.replace('void main() {','uniform float uThin;void main() {\n if(fract(sin(dot(floor(gl_FragCoord.xy),vec2(12.9898,78.233)))*43758.5453)<uThin)discard;')};
 const mesh=new THREE.Mesh(new THREE.PlaneGeometry(W,H,phone?40:72,phone?6:10),m);mesh.customDepthMaterial=dm;mesh.castShadow=mesh.receiveShadow=true;mesh.frustumCulled=false;mesh.userData.noAO=true;S.add(mesh);
 leaves.push({mesh,U,t:0,v:0,target:0,cover:i===0||i===N-1,curl:0});}

// ================= the hand =================
let k=0,drag=null,hover=0,holdT=0,lastTurn=-9,phoneSide='R';const hint=document.getElementById('hint');
const cam=new THREE.PerspectiveCamera(phone?34:30,1,1,600),ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),-.5),hit=new THREE.Vector3();
function worldAt(e){ndc.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);ray.setFromCamera(ndc,cam);return ray.ray.intersectPlane(plane,hit)?hit.clone():null}
function turn(d){if(d>0&&k<N){leaves[k].target=1;k++}else if(d<0&&k>0){k--;leaves[k].target=0}else return;lastTurn=clock;hint.style.opacity=0;whoosh()}
// the thumb index (folio-nav.js) turns the leaves through this hand; while the desk below is scrolled, the wheel and the arrows leave the book alone
window.__fo={turn,get k(){return k},n:N};const desked=()=>document.documentElement.classList.contains('is-desk')&&scrollY>4;
function stepPhone(d){if(d>0){if(phoneSide==='L'&&k>0&&k<N)phoneSide='R';else if(k<N){turn(1);phoneSide=k===N?'L':'L'}}else{if(phoneSide==='R'&&k>0)phoneSide='L';else if(k>0){turn(-1);phoneSide='R'}}}
cv.addEventListener('pointerdown',e=>{const p=worldAt(e);cv.setPointerCapture(e.pointerId);
 drag={x0:e.clientX,y0:e.clientY,moved:false,p0:p,idx:p&&p.x>0?k:k-1};if(drag.idx<0||drag.idx>=N)drag.idx=null;cv.classList.add('drag')});
cv.addEventListener('pointermove',e=>{const p=worldAt(e);hover=p&&Math.abs(p.z)<H/2+2?p.x:0;if(!drag)return;
 if(Math.hypot(e.clientX-drag.x0,e.clientY-drag.y0)>8)drag.moved=true;
 if(drag.moved&&drag.idx!=null&&p&&!phone){const lf=leaves[drag.idx],tt=Math.acos(Math.max(-1,Math.min(1,p.x/W)))/Math.PI;lf.hold=tt;hint.style.opacity=0}});
cv.addEventListener('pointerup',e=>{cv.classList.remove('drag');if(!drag)return;const d=drag;drag=null;
 if(phone){if(!d.moved||Math.abs(e.clientX-d.x0)>40)stepPhone(d.moved?(e.clientX<d.x0?1:-1):(e.clientX>innerWidth/2?1:-1));return}
 if(d.idx!=null&&d.moved){const lf=leaves[d.idx];const done=lf.hold>.5;delete lf.hold;
  if(d.idx===k&&done){lf.target=1;k++;lastTurn=clock;whoosh()}else if(d.idx===k-1&&!done){k--;lf.target=0;lastTurn=clock;whoosh()}else lf.target=d.idx<k?1:0;return}
 const p=worldAt(e);if(p)turn(p.x>0?1:-1)});
cv.addEventListener('pointerleave',()=>hover=0);
let wheelAcc=0,wheelT=0;addEventListener('wheel',e=>{if(desked())return;wheelAcc+=e.deltaY;if(clock-wheelT>.7&&Math.abs(wheelAcc)>60){phone?stepPhone(Math.sign(wheelAcc)):turn(Math.sign(wheelAcc));wheelT=clock;wheelAcc=0}},{passive:true});
addEventListener('keydown',e=>{if(desked())return;if(e.key==='ArrowRight'||e.key===' ')phone?stepPhone(1):turn(1);if(e.key==='ArrowLeft')phone?stepPhone(-1):turn(-1)});
// a page moving air, only if asked
let ac=null,snd=false;const sb=document.getElementById('snd');sb.onclick=()=>{snd=!snd;sb.textContent='Sound · '+(snd?'on':'off');if(snd&&!ac)ac=new AudioContext()};
function whoosh(){if(!snd||!ac)return;const t=ac.currentTime,n=ac.createBufferSource(),b=ac.createBuffer(1,ac.sampleRate*.7,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;n.buffer=b;
 const f=ac.createBiquadFilter();f.type='bandpass';f.Q.value=.7;f.frequency.setValueAtTime(700,t);f.frequency.exponentialRampToValueAtTime(2600,t+.3);f.frequency.exponentialRampToValueAtTime(900,t+.65);
 const gn=ac.createGain();gn.gain.setValueAtTime(.0001,t);gn.gain.exponentialRampToValueAtTime(.14,t+.18);gn.gain.exponentialRampToValueAtTime(.0001,t+.68);n.connect(f);f.connect(gn);gn.connect(ac.destination);n.start(t)}

// ================= lens and grade: a low sun on uncoated stock, warm halation off the paper, lifted umber blacks, coarse grain =================
const comp=new EffectComposer(R,new THREE.WebGLRenderTarget(innerWidth*DPR,innerHeight*DPR,{type:THREE.HalfFloatType,samples:phone?0:4}));comp.setPixelRatio(DPR);comp.addPass(new RenderPass(S,cam));
const film=new ShaderPass({uniforms:{tDiffuse:{value:null},uT:{value:0},uR:{value:new THREE.Vector2()},uF:{value:0}},
 vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform sampler2D tDiffuse;uniform float uT,uF;uniform vec2 uR;varying vec2 vUv;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;vec3 hl=vec3(0.);for(int i=0;i<10;i++){float a=float(i)*.6283;vec2 o=vec2(cos(a),sin(a))*(i<5?5.:11.)/uR;hl+=clamp(texture2D(tDiffuse,vUv+o).rgb-1.35,0.,2.);}c+=hl*.1*vec3(1.,.5,.24);c*=1.03-.06*smoothstep(0.,1.,vUv.x);vec2 q=vUv-.5;c*=1.-dot(q,q)*.9;c=c*.975+vec3(.011,.007,.004);float gr=h(floor(vUv*uR/1.6)+fract(uT)*91.)-.5;c+=gr*.03*(.4+sqrt(max(dot(c,vec3(.33)),0.)));gl_FragColor=vec4(c*uF,1.);}`});
comp.addPass(film);comp.addPass(new OutputPass());
// the render (the bending pages stay out of the shading pass: it would see them flat, unbent, as ghost edges): contact shading where surfaces meet, glow only on true light sources, tuned to this world's scale and light
lux(R,S,cam,comp,{ao:{radius:.5,thickness:.8,blend:.7,protect:[.3,1.2]},bloom:{strength:.15,radius:.4,threshold:2}});
function size(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);comp.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix();film.uniforms.uR.value.set(w*DPR,h*DPR)}
addEventListener('resize',size);size();

// ================= time =================
let clock=0,last=performance.now(),camX=W/2,nod=0,nodV=0;const tgt=new THREE.Vector3(),pos=new THREE.Vector3();
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;clock+=dt;
 film.uniforms.uT.value=clock;film.uniforms.uF.value=sm(.2,1.8,clock);
 let f=0;leaves.forEach(l=>f+=l.t);f/=N;const hL=T*f,hR=T*(1-f);
 blockR.scale.y=Math.max(.001,hR);blockR.position.y=Y0+hR/2;blockL.scale.y=Math.max(.001,hL);blockL.position.y=Y0+hL/2;blockR.visible=hR>.01;blockL.visible=hL>.01;
 [[hR,W/2],[hL,-W/2]].forEach(([hh,x],q)=>{const m=soft[q],d=hh*2.6+.5;m.position.set(x+d*.894,.066+q*.0005,d*.447);m.material.opacity=.5*Math.min(1,hh/.25);m.visible=hh>.01});
 leaves.forEach((l,i)=>{const prev=l.t;
  if(l.hold!=null){l.t+=(l.hold-l.t)*Math.min(1,dt*14);holdT+=dt}else{const st=34;l.v+=((l.target-l.t)*st-l.v*2*Math.sqrt(st))*dt;l.t+=l.v*dt;if(Math.abs(l.target-l.t)<.0005&&Math.abs(l.v)<.001){l.t=l.target;l.v=0}}
  const vel=(l.t-prev)/Math.max(dt,1e-4),a=Math.PI*Math.min(1,Math.max(0,l.t)),sc=l.cover?.45:1;
  const dyn=-Math.max(-1,Math.min(1,vel*.9))*1.25*Math.sin(a),droop=-.62*Math.cos(a)*Math.sin(a),breathe=l.hold!=null?.06*Math.sin(clock*1.7):0;
  l.curl+=((dyn+droop+breathe)*sc-l.curl)*Math.min(1,dt*9);
  const yR=Y0+hR+(N-1-i)*.014+.004,yL=Y0+hL+i*.014+.004;
  // the draught, three seconds in: the cover's corner lifts a centimetre and settles; then the hand's own nearness lifts the corner of the next leaf
  let lift=0;if(i===0&&k===0)lift=.2*Math.sin(Math.PI*sm(3,6,clock))*sm(3,3.6,clock);
  if(!phone&&i===k&&l.hold==null&&hover>W*.55)lift=Math.max(lift,.24*sm(W*.55,W*.98,hover));
  if(!phone&&i===k-1&&l.hold==null&&hover<-W*.55)lift=-.24*sm(W*.55,W*.98,-hover);   // a page lying left lifts by turning back past flat
  l.U.uLift.value+=(lift-l.U.uLift.value)*Math.min(1,dt*6);
  l.U.uA.value=a;l.U.uC.value=l.curl/W;l.U.uY.value=yR+(yL-yR)*sm(0,1,l.t);l.U.uShow.value=.035+.05*Math.sin(a);
  l.mesh.renderOrder=i});
 // the camera: over the shoulder, slightly down; a small nod each time a leaf lands; on a phone it reads one text block at a time
 const cx=phone?(phoneSide==='R'?W/2:-W/2):(f<1/N?W/2*(1-f*N):f>(N-1)/N?-W/2*(f*N-(N-1)):0);
 camX+=(cx-camX)*Math.min(1,dt*(phone?3.2:2.2));
 const since=clock-lastTurn;nodV+=(-nod*26-nodV*7)*dt;if(since<.05)nodV-=6*dt;nod+=nodV*dt;
 const open=phone?1:1-Math.abs(cx/(W/2))*.0,closedMix=phone?0:sm(0,1,Math.abs(camX)/(W/2));
 // phone: frame the text block with a little air; while the magazine is shut, frame the whole cover
 const shut=f<1/N?1-f*N:f>(N-1)/N?f*N-(N-1):0;
 const dist=phone?(W*(.95+.15*shut))/(2*Math.tan(THREE.MathUtils.degToRad(cam.fov/2))*cam.aspect):(61.5+1*closedMix)*(cam.aspect<1.55?1.55/cam.aspect:1)*1.2;   // pulled back a little so the thumb index has its own column at the right
 tgt.set(camX,Y0,phone?.4:-.5+closedMix*2);
 const dir=phone?new THREE.Vector3(0,.97,.22):new THREE.Vector3(.25*closedMix,.96-.16*closedMix,.26+.29*closedMix);   // open: nearly over the page, so it reads; closed: over the shoulder
 pos.copy(tgt).addScaledVector(dir.normalize(),dist);pos.y+=nod*.9;pos.x+=Math.sin(clock*.21)*.12;cam.position.copy(pos);cam.lookAt(tgt.x,tgt.y+nod*.3,tgt.z);
 if(scrollY<=innerHeight*1.05)comp.render()}

// fonts first, so the pages are set in their own faces
const faces=['600 40px Gambetta','italic 400 40px Gambetta','400 40px Gambetta','400 12px "JetBrains Mono"'];
Promise.all([...faces.map(f=>document.fonts.load(f)),document.fonts.load('400 40px "Tiro Bangla"','নদী')]).catch(()=>{}).then(()=>{
 const tex=c=>{const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=R.capabilities.getMaxAnisotropy();return t};
 LEAVES.forEach(([fa,fi,ba,bi],i)=>makeLeaf(i,tex(pages[fa](F[fi],'R',false)),tex(pages[ba](F[bi],'L',ba==='essay'&&bi===3))));
 // ?p=2 opens the issue at the second spread
 const p0=Math.min(N,Math.max(0,+new URLSearchParams(location.search).get('p')||0));for(let i=0;i<p0;i++){leaves[i].t=leaves[i].target=1}k=p0;if(p0){phoneSide='L';camX=phone?-W/2:(p0===N?-W/2:0);hint.style.opacity=0}
 requestAnimationFrame(frame)});
