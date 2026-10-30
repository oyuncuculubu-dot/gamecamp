(()=>{
const GL=[['rose','Gül',1,'255,70,90'],['heart','Ürək',5,'83,252,24'],['box','Sürpriz',10,'120,230,60'],['pad','Qızıl pult',50,'255,200,60'],['gem','Almaz',100,'90,190,255'],['rocket','Uçan Qala',500,'140,255,90'],['crown','Tac',1000,'255,196,40'],['lion','Şir',5000,'255,170,30']];
const ICN=n=>`icons3d/gift_${n}.png?v=${window.GIFT_VER||1}`,coin=s=>`<img src="${ICN('coin')}" width="${s}" height="${s}" alt="">`;
const nf=n=>n.toLocaleString('az-AZ').replace(/,/g,' ');
const BK=()=>GC.ukey('coins');const getBal=()=>GC.user()?GC.LS.get(BK(),1000):0;let bal=getBal(),sel=4,combo=0,ct=null;
const chat=document.querySelector('.chat'),player=document.getElementById('player');
// hide old static gifts
['gh','gifts'].forEach(i=>{const e=document.getElementById(i);e&&e.remove()});
msgs.querySelectorAll('.m.gift').forEach(e=>e.remove());
// gift button in chat
const gb=document.createElement('button');gb.type='button';gb.className='gbtn';gb.setAttribute('aria-label','Hədiyyələr');gb.innerHTML=`<img src="${ICN('box')}" alt="">`;
cin.prepend(gb);
// panel
const sc=document.createElement('div');sc.className='gscrim';document.body.append(sc);
const gp=document.createElement('div');gp.className='gp';gp.setAttribute('role','dialog');gp.setAttribute('aria-label','Hədiyyələr');
gp.innerHTML=`<div class="gph"><h4>Hədiyyə göndər</h4><button class="x" aria-label="Bağla">${ic('chev',18)}</button></div>
<div class="gtabs"><span class="on" data-t="all" role="button" tabindex="0">Hədiyyələr</span><span data-t="big" role="button" tabindex="0">Xüsusi</span><span data-t="cheap" role="button" tabindex="0">Sənin</span></div>
<div class="gg">${GL.map((g,i)=>`<button class="gi${i==sel?' sel':''}" data-i="${i}"><img src="${ICN(g[0])}" alt="">${i==6?'<span class="tag">YENİ</span>':''}<b>${g[1]}</b><small>${coin(13)}${nf(g[2])}</small></button>`).join('')}</div>
<div class="gf2"><div class="bal">${coin(22)}<div><span id="gbal">${nf(bal)}</span><small>Balans</small></div></div><button class="topup" type="button">Artır</button><button class="send" id="gsend" type="button">Göndər</button></div><div class="gdemo">Demo valyuta: GC sikkələri real pul deyil. Başlanğıc balans 1 000 GC, "Artır" pulsuz 500 demo GC əlavə edir.</div>`;
chat.append(gp);
const open=v=>{gp.classList.toggle('open',v);sc.classList.toggle('on',v)};
gb.onclick=()=>open(!gp.classList.contains('open'));gp.querySelector('.x').onclick=()=>open(false);sc.onclick=()=>open(false);
gp.querySelectorAll('.gi').forEach(b=>b.onclick=()=>{sel=+b.dataset.i;combo=0;gp.querySelectorAll('.gi').forEach(x=>x.classList.toggle('sel',x==b));resetSend()});
const send=gp.querySelector('#gsend');
const showBal=()=>{bal=getBal();gbal.textContent=GC.user()?nf(bal):'—'};
document.addEventListener('gc-auth',showBal);
gp.querySelectorAll('.gtabs span').forEach(t=>t.onclick=t.onkeydown=e=>{if(e.key&&e.key!='Enter'&&e.key!=' ')return;gp.querySelectorAll('.gtabs span').forEach(x=>x.classList.toggle('on',x==t));
 gp.querySelectorAll('.gi').forEach(b=>{const v=GL[b.dataset.i][2];b.style.display=t.dataset.t=='big'?(v>=500?'':'none'):t.dataset.t=='cheap'?(v<=getBal()?'':'none'):''})});
gp.querySelector('.topup').onclick=()=>GC.need(()=>{bal=getBal()+500;GC.LS.set(BK(),bal);showBal();GC.toast('+500 demo GC əlavə edildi (real ödəniş yoxdur)')},'Balansı artırmaq üçün daxil ol.');
const resetSend=()=>{send.className='send';send.innerHTML='Göndər'};
send.onclick=()=>{if(!GC.user())return GC.openAuth('login',showBal,'Hədiyyə göndərmək üçün daxil ol.');const g=GL[sel];bal=getBal();if(bal<g[2])return GC.toast('Balans kifayət etmir. "Artır" ilə demo GC əlavə et.');bal-=g[2];GC.LS.set(BK(),bal);gbal.textContent=nf(bal);combo++;
 send.className='send combo';send.innerHTML=`Kombo <span class="cx">x${combo}</span><i class="ring"></i>`;
 send.querySelector('.ring').animate([{transform:'scaleX(1)'},{transform:'scaleX(0)'}],{duration:3000});
 clearTimeout(ct);ct=setTimeout(()=>{combo=0;resetSend()},3000);
 fire(GC.user().name,sel,combo)};showBal();
// fx layer: per-gift cinematic scenes (rAF-driven transforms + canvas particles)
const RM=matchMedia('(prefers-reduced-motion: reduce)');
const fx=document.createElement('div');fx.className='fx';fx.innerHTML='<canvas></canvas><div class="tint"></div><div class="stg"></div><div class="gxb"></div><div class="gxcnt"></div>';player.append(fx);
const lane=document.createElement('div');lane.className='lane';player.append(lane);
const cv=fx.querySelector('canvas'),cx=cv.getContext('2d'),stg=fx.querySelector('.stg'),gxb=fx.querySelector('.gxb'),cnt=fx.querySelector('.gxcnt'),tint=fx.querySelector('.tint');
let W=0,H=0,P=[],SC=[],raf=0,last=0;
const fit=()=>{const r=player.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0)};fit();addEventListener('resize',fit);
const mob=()=>W<700,CAP=()=>RM.matches?40:mob()?220:520;
const R=(a,b)=>a+Math.random()*(b-a),cl=v=>v<0?0:v>1?1:v,seg=(t,a,b)=>cl((t-a)/(b-a));
const eOut=x=>1-Math.pow(1-x,3),eIO=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,eIn=x=>x*x*x;
const eBack=x=>{const c=2.2;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
const eEl=x=>x<=0?0:x>=1?1:Math.pow(2,-9*x)*Math.sin((x*10-.75)*2.094)+1;
// particles
function emit(o){if(P.length>=CAP())return;P.push(Object.assign({vx:0,vy:0,g:0,dr:.99,l:1,d:.012,r:3,c:'255,255,255',k:'dot',a:R(0,6),va:R(-.15,.15),gr:0,ph:R(0,6)},o));kick()}
function star(x,y,r,a){cx.beginPath();for(let i=0;i<8;i++){const q=i*Math.PI/4+a,rr=i%2?r*.28:r;cx.lineTo(x+Math.cos(q)*rr,y+Math.sin(q)*rr)}cx.fill()}
function heartP(x,y,r){cx.beginPath();cx.moveTo(x,y+r*.9);cx.bezierCurveTo(x-r*1.6,y-r*.1,x-r*.7,y-r*1.3,x,y-r*.45);cx.bezierCurveTo(x+r*.7,y-r*1.3,x+r*1.6,y-r*.1,x,y+r*.9);cx.fill()}
function drawP(dt){for(const p of P){p.vy+=p.g*dt;p.vx*=Math.pow(p.dr,dt);p.vy*=Math.pow(p.dr,dt);p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=p.d*dt;p.a+=p.va*dt;p.r+=p.gr*dt;p.ph+=.08*dt;
 const al=cl(p.l<.3?p.l/.3:1)*(p.al||1);if(al<=0)continue;cx.globalCompositeOperation=p.k=='smoke'||p.k=='conf'||p.k=='petal'?'source-over':'lighter';
 const c=p.hue!=null?`hsla(${p.hue},100%,70%,${al})`:`rgba(${p.c},${al})`;cx.fillStyle=c;cx.strokeStyle=c;
 switch(p.k){
 case 'dot':{const g=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*3);g.addColorStop(0,c);g.addColorStop(1,`rgba(${p.c||'255,255,255'},0)`);cx.fillStyle=p.hue!=null?c:g;cx.beginPath();cx.arc(p.x,p.y,p.hue!=null?p.r:p.r*3,0,7);cx.fill();break}
 case 'star':star(p.x,p.y,p.r*(.7+.3*Math.sin(p.ph*3)),p.a);break;
 case 'heart':heartP(p.x+Math.sin(p.ph)*6,p.y,p.r);break;
 case 'petal':cx.save();cx.translate(p.x+Math.sin(p.ph)*10,p.y);cx.rotate(p.a);cx.scale(Math.cos(p.ph*2),1);const pg=cx.createLinearGradient(0,-p.r,0,p.r);pg.addColorStop(0,`rgba(255,90,110,${al})`);pg.addColorStop(1,`rgba(170,10,40,${al})`);cx.fillStyle=pg;cx.beginPath();cx.ellipse(0,0,p.r*.6,p.r,0,0,7);cx.fill();cx.restore();break;
 case 'conf':cx.save();cx.translate(p.x,p.y);cx.rotate(p.a);cx.scale(1,Math.cos(p.ph*3));cx.fillRect(-p.r,-p.r*.45,p.r*2,p.r*.9);cx.restore();break;
 case 'pix':cx.fillRect(Math.round(p.x/3)*3,Math.round(p.y/3)*3,p.r,p.r);break;
 case 'line':cx.lineWidth=p.r;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(p.x-p.vx*6,p.y-p.vy*6);cx.stroke();break;
 case 'smoke':{const g=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);g.addColorStop(0,`rgba(${p.c},${al*.22})`);g.addColorStop(1,`rgba(${p.c},0)`);cx.fillStyle=g;cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);cx.fill();break}
 case 'ring':cx.lineWidth=Math.max(1,p.w*p.l);cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);cx.stroke();break}}
 P=P.filter(p=>p.l>0&&p.y<H+80&&p.y>-200)}
function burstAt(x,y,n,o){for(let i=0;i<n;i++){const a=R(0,6.283),s=R(o.s0||1,o.s1||6);emit(Object.assign({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s+(o.up||0)},typeof o.f=='function'?o.f():o.p))}}
// sprites
function spr(n,size,cls){const e=document.createElement('div');e.className='gsp '+(cls||'');e.style.width=e.style.height=size+'px';e.style.setProperty('--src',`url(${ICN(n)})`);e.innerHTML=`<img src="${ICN(n)}" alt="">`;stg.append(e);return e}
function layer(cls){const e=document.createElement('div');e.className=cls;stg.append(e);return e}
const put=(e,x,y,s,sx,sy,rot,ex)=>{e.style.transform=`translate3d(${x-s/2}px,${y-s/2}px,0) ${ex||''} rotate(${rot||0}deg) scale(${sx},${sy})`};
function kick(){if(!raf){last=performance.now();raf=requestAnimationFrame(loop)}}
function loop(now){const dt=Math.min((now-last)/16.67,3);last=now;cx.clearRect(0,0,W,H);let tn=0;
 for(const s of SC){const t=(now-s.t0)/1000;if(t>s.d){s.done=1;s.els.forEach(e=>e.remove());continue}s.u(t,dt,s);if(s.tint!=null)tn=Math.max(tn,s.tint)}
 SC=SC.filter(s=>!s.done);tint.style.opacity=tn;drawP(dt);raf=SC.length||P.length?requestAnimationFrame(loop):0;if(!raf)cx.clearRect(0,0,W,H)}
function shake(ms,amp){if(RM.matches)return;const k=[];for(let i=0;i<=10;i++){const f=1-i/10;k.push({transform:`translate(${R(-amp,amp)*f}px,${R(-amp,amp)*f}px)`})}player.animate(k,{duration:ms,easing:'linear'})}
const fade=(t,d,o)=>cl((d-t)/(o||.35));
// ---- scenes ----
const SCN={
rose(s){const z=s.z,e=s.add(spr('rose',z)),x0=s.x,y0=s.y;let b=0;
 return t=>{const k=eBack(seg(t,0,.55)),f=eIO(seg(t,.8,1.9)),y=y0-f*H*.32;
  put(e,x0+Math.sin(t*6)*8*f,y,z,k,k,(1-k)*-400+Math.sin(t*7)*7*f,`perspective(600px) rotateY(${(1-k)*180}deg)`);e.style.opacity=fade(t,1.9);
  if(t>.42&&!b){b=1;burstAt(x0,y0-z*.2,RM.matches?6:26,{s0:1.5,s1:5,up:-2,f:()=>({k:'petal',r:R(5,10),g:.06,dr:.97,d:R(.008,.014),va:R(-.1,.1)})});burstAt(x0,y0-z*.2,14,{s0:1,s1:4,p:{c:'255,120,140',r:2,d:.03}})}
  if(t>.6&&t<1.6&&Math.random()<.25)emit({k:'petal',x:x0+R(-z/3,z/3),y:y-z*.2,vy:R(-1,.5),vx:R(-1,1),g:.04,r:R(4,7),d:.012})}},
heart(s){const z=s.z,e=s.add(spr('heart',z)),x0=s.x,y0=s.y;let lb=-1;
 return t=>{const k=eBack(seg(t,0,.35)),ph=(t*1.5)%1,bt=Math.exp(-Math.pow((ph-.12)/.05,2))*.24+Math.exp(-Math.pow((ph-.32)/.06,2))*.14,f=eIO(seg(t,1.4,2.3));
  const sc=k*(1+bt);put(e,x0,y0-f*H*.3,z,sc*(1+bt*.3),sc*(1-bt*.15),Math.sin(t*5)*5);e.style.opacity=fade(t,2.3);e.style.filter=`drop-shadow(0 0 ${8+bt*80}px rgba(255,80,160,.9))`;
  s.tint=(.1+bt*1.8)*fade(t,2.3,.5);const n=Math.floor(t*1.5);
  if(ph>.1&&n!=lb&&t<2){lb=n;for(let i=0;i<(RM.matches?2:9);i++)emit({k:'heart',x:x0+R(-z*.4,z*.4),y:y0-z*.1,vx:R(-.8,.8),vy:R(-3.5,-1.5),g:-.01,r:R(4,10),c:Math.random()<.6?'255,80,160':'83,252,24',d:R(.01,.018)})}}},
box(s){const z=s.z,x0=s.x,y0=s.y,bd=s.add(spr('box',z,'clipB')),ld=s.add(spr('box',z,'clipL')),bm=s.add(layer('beams'));let b=0;
 return t=>{const dk=eOut(seg(t,0,.3)),land=seg(t,.3,.5),sq=Math.sin(land*Math.PI)*.22,sh=t>.45&&t<.95?Math.sin(t*70)*(t-.45)*22:0,f=eIO(seg(t,1.5,2.4)),y=y0-(1-dk)*H*.25-f*H*.28,o=fade(t,2.4);
  put(bd,x0,y,z,1+sq,1-sq,sh);bd.style.opacity=o;
  const lt=Math.max(0,t-.95),lx=lt*z*1.2,ly=lt*-z*3.2+lt*lt*z*5;put(ld,x0+lx,y+(t<.95?0:ly),z,1+sq,1-sq,sh+lt*160);ld.style.opacity=t<.95?o:cl(1-lt*1.3);
  const bk=eOut(seg(t,.95,1.3));bm.style.transform=`translate3d(${x0}px,${y-z*.15}px,0) translate(-50%,-100%) scale(${bk},${bk*1.1})`;bm.style.opacity=bk*o*.9;
  if(t>.95&&!b){b=1;burstAt(x0,y-z*.2,RM.matches?10:70,{s0:3,s1:9,up:-5,f:()=>({k:'conf',r:R(3,6),g:.18,dr:.975,d:R(.006,.012),c:['83,252,24','255,215,90','255,80,120','90,190,255','255,255,255'][Math.random()*5|0]})})}}},
pad(s){const z=s.z,x0=s.x,y0=s.y,gl=s.add(layer('glo')),e=s.add(spr('pad',z));
 return t=>{const m=seg(t,0,.42),k=eBack(m),x=-z+(x0+z)*k,v=m<1?(1-m):0,land=seg(t,.42,.62),sq=Math.sin(land*Math.PI)*.18,f=eIO(seg(t,1.4,2.2)),y=y0-f*H*.3,o=fade(t,2.2),pu=t>.45?.5+.5*Math.sin(t*14):0;
  put(e,x,y,z,(1+v*.5)*(1-sq),1+sq-v*.15,-12*v+Math.sin(t*9)*6*f,`skewX(${-25*v}deg)`);e.style.filter=v>.05?`blur(${v*7}px)`:`drop-shadow(0 0 ${6+pu*20}px rgba(255,200,60,.9)) brightness(${1+pu*.25})`;e.style.opacity=o;
  gl.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${.6+pu*.5})`;gl.style.opacity=o*pu*.9;
  if(v>.05)for(let i=0;i<3;i++)emit({k:'line',x:x-z*.3,y:y+R(-z*.3,z*.3),vx:R(-4,-2),vy:0,r:2,c:'255,215,90',d:.06});
  if(t>.5&&t<1.8&&Math.random()<.55)for(let i=0;i<3;i++){const a=R(0,6.28),sp=R(1,4);emit({k:'pix',x:x+R(-z*.35,z*.35),y:y+R(-z*.15,z*.15),vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1,g:.12,r:R(3,6)|0,c:['83,252,24','255,215,90','90,190,255','255,80,120'][Math.random()*4|0],d:.025})}}},
gem(s){const z=s.z,x0=s.x,y0=s.y,ry=s.add(layer('rays prism')),e=s.add(spr('gem',z,'shn'));let b=0;
 return t=>{const k=eBack(seg(t,0,.8)),rot=(1-eOut(seg(t,0,1.1)))*720+Math.sin(t*1.6)*25,o=fade(t,4,.45),out=1+eIn(seg(t,3.6,4))*.4;
  put(e,x0,y0+Math.sin(t*2.2)*8,z,k*out,k*out,Math.sin(t*1.3)*3,`perspective(700px) rotateY(${rot}deg) rotateX(${Math.sin(t*1.7)*8}deg)`);e.style.opacity=o;e.style.setProperty('--sh',((t*55)%160-30)+'%');e.style.filter=`drop-shadow(0 0 30px rgba(90,190,255,.8)) hue-rotate(${Math.sin(t*2)*20}deg)`;
  ry.style.transform=`translate3d(${x0}px,${y0}px,0) translate(-50%,-50%) rotate(${t*40}deg) scale(${eOut(seg(t,.2,.9))})`;ry.style.opacity=o*.85;
  if(t>.75&&!b){b=1;burstAt(x0,y0,RM.matches?10:60,{s0:2,s1:9,f:()=>({k:'star',r:R(4,9),hue:R(0,360),dr:.95,d:R(.012,.02)})})}
  if(t>.8&&t<3.6&&Math.random()<.7){const a=R(0,6.28),rr=R(.2,.6)*z;emit({k:'star',x:x0+Math.cos(a)*rr,y:y0+Math.sin(a)*rr,r:R(3,8),hue:R(0,360),va:.2,d:R(.02,.035)})}}},
rocket(s){const z=s.z*.8,e=s.add(spr('rocket',z));let b=0,px=0,py=0;
 return t=>{const sx=W*.18,sy=H*.88,ex=W*.62,ey=H*.18;let x,y,rot=0,sc=1;
  if(t<.5){x=sx+Math.sin(t*90)*3*seg(t,.15,.5);y=sy+(1-eBack(seg(t,0,.3)))*z;sc=1-Math.sin(seg(t,.3,.5)*Math.PI)*.12}
  else{const m=eIn(seg(t,.5,1.6));x=sx+(ex-sx)*m;y=sy+(ey-sy)*m+Math.sin(m*Math.PI)*-H*.05;sc=1-m*.35}
  const vx=x-px,vy=y-py;px=x;py=y;const st=t>.5&&t<1.6?Math.min(Math.hypot(vx,vy)/30,.35):0;
  put(e,x,y,z,sc*(1-st*.3),sc*(1+st),rot,`rotate(${0}deg)`);e.style.opacity=t<1.6?1:0;
  const tx=x-z*.3*sc,ty=y+z*.3*sc;
  if(t<1.6){const n=t<.5?(t>.15?2:0):4;for(let i=0;i<n;i++){emit({k:'dot',x:tx+R(-4,4),y:ty+R(-4,4),vx:R(-3,-1)+(t<.5?R(-2,2):0),vy:R(1,4),r:R(3,7)*sc,c:Math.random()<.5?'255,190,60':'255,90,30',d:.06});emit({k:'smoke',x:tx,y:ty,vx:R(-1.5,.5),vy:R(.2,1.5),r:R(5,10),gr:.6,c:"190,190,200",dr:.96,d:.02})}}
  if(t>1.6&&!b){b=1;const cs=['83,252,24','255,215,90','255,80,160'];[[ex,ey,0],[W*.45,H*.28,.25],[W*.75,H*.32,.45]].forEach(([fx_,fy,dl],j)=>setTimeout(()=>{burstAt(fx_,fy,RM.matches?12:mob()?55:90,{s0:2,s1:8,f:()=>({k:Math.random()<.3?'star':'dot',r:R(1.5,3.5),g:.06,dr:.965,d:R(.01,.018),c:Math.random()<.2?'255,255,255':cs[j]})});emit({k:'ring',x:fx_,y:fy,r:6,gr:7,w:4,c:cs[j],d:.05})},dl*1000));shake(300,5)}}},
crown(s){const z=s.z,x0=s.x,y0=s.y,ry=s.add(layer('rays gold')),e=s.add(spr('crown',z,'shn'));let b=0;
 return t=>{const m=seg(t,0,.9),dy=(1-eOut(m))*-(y0+z),bt=seg(t,.9,1.7),bo=t>.9?Math.sin(bt*Math.PI*3)*Math.exp(-bt*4)*z*.12:0,sq=t>.9?Math.sin(bt*Math.PI*3)*Math.exp(-bt*4)*.2:0,o=fade(t,4,.45),out=1+eIn(seg(t,3.6,4))*.4;
  put(e,x0,y0+dy-bo,z,(1+sq)*out,(1-sq)*out,Math.sin(t*1.5)*3,`perspective(700px) rotateY(${Math.sin(t*1.2)*14}deg)`);e.style.opacity=o;e.style.setProperty('--sh',((t*50)%160-30)+'%');
  ry.style.transform=`translate3d(${x0}px,${y0+dy*.3}px,0) translate(-50%,-50%) rotate(${t*25}deg) scale(${eOut(seg(t,.1,1))})`;ry.style.opacity=o;
  if(t<.95&&Math.random()<.8)emit({k:'star',x:x0+R(-z*.4,z*.4),y:y0+dy-z*.3,vy:R(-1,0),r:R(2,5),c:'255,215,90',d:.03});
  if(t>.9&&!b){b=1;burstAt(x0,y0+z*.2,RM.matches?8:50,{s0:2,s1:7,up:-2,f:()=>({k:'dot',r:R(1.5,3),g:.08,c:'255,210,80',d:R(.012,.02)})})}
  if(t>1&&t<3.7&&Math.random()<.6)emit({k:Math.random()<.5?'star':'dot',x:R(x0-W*.3,x0+W*.3),y:R(-10,H*.3),vy:R(.6,1.6),vx:R(-.3,.3),r:R(1.5,4),c:'255,215,90',d:R(.006,.01)})}},
lion(s){const z=s.z*1.1,x0=s.x,y0=s.y,ry=s.add(layer('rays gold')),e=s.add(spr('lion',z,'shn'));let r1=0,r2=0;
 const roar=(x,y)=>{shake(550,mob()?7:12);for(let i=0;i<3;i++)setTimeout(()=>emit({k:'ring',x,y,r:z*.3,gr:mob()?9:14,w:10,c:'255,200,80',d:.03}),i*120);
  burstAt(x,y,RM.matches?10:mob()?60:110,{s0:3,s1:12,f:()=>({k:Math.random()<.5?'dot':'line',r:R(1.5,3.5),dr:.95,g:.03,c:Math.random()<.5?'255,190,60':'255,140,30',d:R(.012,.022)})})};
 return t=>{const m=seg(t,0,.6),x=x0+(1-eOut(m))*W*.65,arc=-Math.sin(m*Math.PI)*H*.28,st=m<1?Math.sin(m*Math.PI)*.3:0,l=seg(t,.6,1.2),sq=t>.6?Math.sin(l*Math.PI*2.5)*Math.exp(-l*3)*.28:0,
  pu=(t>.85&&t<1.4?Math.sin(seg(t,.85,1.4)*Math.PI)*.12:0)+(t>2.1&&t<2.6?Math.sin(seg(t,2.1,2.6)*Math.PI)*.12:0),o=fade(t,4.5,.45),out=1+eIn(seg(t,4.1,4.5))*.4;
  put(e,x,y0+arc+Math.sin(t*2)*5*(t>1.2),z,(1+st+sq+pu)*out,(1-st*.6-sq+pu)*out,m<1?-18*Math.sin(m*Math.PI):Math.sin(t*1.4)*2,`perspective(700px) rotateY(${(1-eOut(m))*-35}deg)`);e.style.opacity=o;e.style.setProperty('--sh',((t*50)%160-30)+'%');
  ry.style.transform=`translate3d(${x0}px,${y0}px,0) translate(-50%,-50%) rotate(${-t*30}deg) scale(${eOut(seg(t,.6,1.1))*1.2})`;ry.style.opacity=o;
  if(m<1&&Math.random()<.9)emit({k:'dot',x:x+z*.3,y:y0+arc,vx:R(1,3),vy:R(-1,1),r:R(2,4),c:'255,190,60',d:.05});
  if(t>.85&&!r1){r1=1;roar(x0,y0)}if(t>2.1&&!r2){r2=1;roar(x0,y0)}
  if(t>1&&t<4&&Math.random()<.7){const a=R(0,6.28);emit({k:'dot',x:x0+Math.cos(a)*z*.45,y:y0+Math.sin(a)*z*.45,vx:Math.cos(a)*R(.5,2),vy:Math.sin(a)*R(.5,2)-.6,r:R(1.5,3),c:Math.random()<.5?'255,200,80':'255,150,40',d:.02})}}}
};
const DUR={rose:1.9,heart:2.3,box:2.4,pad:2.2,gem:4,rocket:5,crown:4,lion:5};
function scene(g,big){fit();const n=g[0],m=Math.min(W,H),s={t0:performance.now(),d:DUR[n],els:[],add(e){this.els.push(e);return e},
 z:big?m*(mob()?.5:.46):m*(mob()?.3:.26),x:big?W/2:W*(mob()?.22:.16),y:big?H*.44:H*(mob()?.62:.66)};
 if(!big){const sm=SC.filter(q=>!q.big);if(sm.length>=4){const o=sm[0];o.done=1;o.els.forEach(e=>e.remove())}s.x+=R(-8,8)}
 s.big=big;s.u=SCN[n](s);if(RM.matches){const u=s.u;s.u=(t,dt,q)=>{u(Math.max(t,1.1),dt,q)};}
 SC.push(s);kick();return s}
// ---- intro videos for top gifts: "stacked alpha" H.264 mp4 (color top half, alpha matte bottom half)
// composited into a <canvas> via WebGL (2D-canvas fallback) -> true transparency on every browser, no blend modes / VP9 alpha ----
const VF={rose:'rose',heart:'heart',box:'box',pad:'pad',gem:'diamond',rocket:'rocket',crown:'crown',lion:'lion'};
const GV=window.GIFT_VER||'5';
const gv=document.createElement('div');gv.className='gvid';player.insertBefore(gv,fx);const vig=document.createElement('div');vig.className='gvig';player.insertBefore(vig,gv);const VC={},VBAD={};
const gCv=document.createElement('canvas');gCv.className='gcv';gCv.width=540;gCv.height=960;gv.append(gCv);
let gGl=null,gC2=null,gTx=null,cvMode='';
try{gGl=gCv.getContext('webgl',{premultipliedAlpha:true,alpha:true,antialias:false})||gCv.getContext('experimental-webgl',{premultipliedAlpha:true,alpha:true})}catch(e){gGl=null}
if(gGl){const gSh=(t,src)=>{const o=gGl.createShader(t);gGl.shaderSource(o,src);gGl.compileShader(o);return o};
 const gPr=gGl.createProgram();
 gGl.attachShader(gPr,gSh(gGl.VERTEX_SHADER,'attribute vec2 p;varying vec2 u;void main(){u=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}'));
 gGl.attachShader(gPr,gSh(gGl.FRAGMENT_SHADER,'precision mediump float;varying vec2 u;uniform sampler2D t;void main(){vec3 c=texture2D(t,vec2(u.x,u.y*.5)).rgb;float a=texture2D(t,vec2(u.x,.5+u.y*.5)).g;a=clamp((a-.02)/.96,0.,1.);gl_FragColor=vec4(c*a,a);}'));
 gGl.linkProgram(gPr);if(!gGl.getProgramParameter(gPr,gGl.LINK_STATUS))gGl=null;else{gGl.useProgram(gPr);
 const gBf=gGl.createBuffer();gGl.bindBuffer(gGl.ARRAY_BUFFER,gBf);gGl.bufferData(gGl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gGl.STATIC_DRAW);
 const l=gGl.getAttribLocation(gPr,'p');gGl.enableVertexAttribArray(l);gGl.vertexAttribPointer(l,2,gGl.FLOAT,false,0,0);
 gTx=gGl.createTexture();gGl.bindTexture(gGl.TEXTURE_2D,gTx);[gGl.TEXTURE_WRAP_S,gGl.TEXTURE_WRAP_T].forEach(k=>gGl.texParameteri(gGl.TEXTURE_2D,k,gGl.CLAMP_TO_EDGE));
 gGl.texParameteri(gGl.TEXTURE_2D,gGl.TEXTURE_MIN_FILTER,gGl.LINEAR);gGl.texParameteri(gGl.TEXTURE_2D,gGl.TEXTURE_MAG_FILTER,gGl.LINEAR);gGl.pixelStorei(gGl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
 gGl.clearColor(0,0,0,0);cvMode='webgl'}}
let gOc,gOx,gId;if(!gGl){gC2=gCv.getContext('2d');gOc=document.createElement('canvas');gOc.width=540;gOc.height=1920;gOx=gOc.getContext('2d',{willReadFrequently:true});cvMode='2d'}
function gDraw(v){const w=v.videoWidth,h=v.videoHeight>>1;if(!w||!h)return;
 if(gCv.width!==w||gCv.height!==h){gCv.width=w;gCv.height=h}
 if(gGl){gGl.viewport(0,0,w,h);gGl.clear(gGl.COLOR_BUFFER_BIT);try{gGl.texImage2D(gGl.TEXTURE_2D,0,gGl.RGB,gGl.RGB,gGl.UNSIGNED_BYTE,v)}catch(e){return}gGl.drawArrays(gGl.TRIANGLE_STRIP,0,4);return}
 if(gOc.width!==w||gOc.height!==h*2){gOc.width=w;gOc.height=h*2;gId=null}
 gOx.drawImage(v,0,0);const c=gOx.getImageData(0,0,w,h),m=gOx.getImageData(0,h,w,h).data,d=c.data;
 for(let i=0;i<d.length;i+=4){let a=(m[i+1]-5)*1.06;d[i+3]=a<0?0:a>255?255:a}gC2.putImageData(c,0,0)}
let gRaf=0;function gLoop(){gRaf=0;const v=curV;if(!v)return;gDraw(v);const go=()=>{if(curV===v)gLoop()};gRaf=v.requestVideoFrameCallback?(v.requestVideoFrameCallback(go),1):requestAnimationFrame(go)}
function vel(n){const f=VF[n];if(!f||VBAD[n]||RM.matches)return null;if(VC[n])return VC[n];
 const v=document.createElement('video');v.muted=true;v.defaultMuted=true;v.playsInline=true;v.setAttribute('playsinline','');v.setAttribute('muted','');v.setAttribute('webkit-playsinline','');v.preload='metadata';v.crossOrigin='anonymous';
 v.className='gsrc';v.src=`gifts/${f}_sa.mp4?v=${GV}`;v.onerror=()=>{VBAD[n]=1};return VC[n]=v}
const preV=n=>{const v=vel(n);if(v&&v!==curV&&v.preload!='auto'){v.preload='auto';v.load()}};
setTimeout(()=>Object.keys(VF).forEach(vel),2500);
gp.querySelectorAll('.gi').forEach(b=>b.addEventListener('click',()=>{const g=GL[b.dataset.i];if(VF[g[0]])preV(g[0])}));setTimeout(()=>['rose','heart','box','pad'].forEach(preV),3000);
let curV=null;
// lion intro roar (CC0, sfxmint lion-roar-01 + rumble), synced to the stacked-alpha video; opt-out: localStorage gc_mute='1'
const SFX={lion:'gifts/lion_roar.mp3'},AU={};const sndOff=()=>{try{return localStorage.getItem('gc_mute')==='1'}catch(e){return false}};
function sfx(n){const f=SFX[n];if(!f)return null;if(!AU[n]){const a=new Audio(`${f}?v=${GV}`);a.preload='auto';a.volume=.8;AU[n]=a}return AU[n]}
function sfxPlay(n,t){const a=sfx(n);if(!a||sndOff())return;try{a.currentTime=t||0;const p=a.play();p&&p.catch(()=>{})}catch(e){}}
function sfxStop(){Object.values(AU).forEach(a=>{try{a.pause()}catch(e){}})}
setTimeout(()=>Object.keys(SFX).forEach(sfx),2500);
function stopV(){sfxStop();gRaf=0;vig.classList.remove('on');gCv.classList.remove('on');if(curV){curV.pause();curV.remove();curV=null}}
// returns duration (s) if video playback started, else null (caller falls back to code scene)
function playV(g,onFail){const v=vel(g[0]);if(!v||!cvMode)return null;stopV();if(v.parentNode!==gv)gv.append(v);
 curV=v;v.currentTime=0;let ok=0;const fail=()=>{if(ok||curV!==v)return;VBAD[g[0]]=1;stopV();onFail()};
 v.onplaying=()=>{if(curV!==v)return;ok=1;sfxPlay(g[0],v.currentTime);gDraw(v);gCv.classList.add('on');vig.classList.add('on');if(!gRaf)gLoop()};v.onended=()=>{if(curV===v)stopV()};v.onerror=fail;
 const p=v.play();p&&p.catch(fail);setTimeout(()=>{if(!ok&&v.readyState<2)fail()},1800);return 5}
let bigT=null,lastBig=null,curBig=null;
const BQ=[];const busy=()=>!!lastBig;function nextQ(){const q=BQ.shift();if(q)showBig(...q)}
function showBig(u,g,k){if(busy()&&!(lastBig.u==u&&lastBig.g==g)){const j=BQ.findIndex(q=>q[0]==u&&q[1]==g);if(j>=0)BQ[j][2]=k;else if(BQ.length<6)BQ.push([u,g,k]);return}gxb.style.setProperty('--gc',g[3]);fx.style.setProperty('--gc',g[3]);
 const same=lastBig&&lastBig.u==u&&lastBig.g==g&&curBig&&!curBig.done;
 if(!same){SC.filter(q=>q.big).forEach(q=>{q.done=1;q.els.forEach(e=>e.remove())});stopV();
  const vd=playV(g,()=>{curBig=scene(g,1)});if(vd){fit();curBig={t0:performance.now(),x:W/2,y:H*.44,vid:1,get done(){return !curV}}}else curBig=scene(g,1);
  gxb.innerHTML=`<div class="bnr"><span class="av">${u[0]}</span><div><b>${u}</b><small>göndərdi <em>${g[1]}</em> · ${coin(13)} ${nf(g[2])}</small></div><img class="bgi" src="${ICN(g[0])}" alt=""><i class="bx">x${k}</i></div>`;
  gxb.classList.remove('on');void gxb.offsetWidth;gxb.classList.add('on')}
 else{if(curBig.vid&&curV){curV.currentTime=Math.min(curV.currentTime,1.5);if(AU[g[0]]&&!AU[g[0]].paused)AU[g[0]].currentTime=curV.currentTime}else curBig.t0=Math.max(curBig.t0,performance.now()-1500*1);gxb.querySelectorAll('.bnr').forEach(b=>b.getAnimations().forEach(a=>a.currentTime=Math.min(a.currentTime,800)));
  const bx=gxb.querySelector('.bx');if(bx){bx.textContent='x'+k;bx.classList.remove('bump');void bx.offsetWidth;bx.classList.add('bump')}burstAt(curBig.x,curBig.y,30,{s0:2,s1:8,p:{k:'star',r:5,c:g[3],d:.02}})}
 lastBig={u,g};
 if(k>1&&!(curBig&&curBig.vid)){cnt.innerHTML=`<small>x</small>${k}`;cnt.classList.remove('pop');void cnt.offsetWidth;cnt.classList.add('pop')}else cnt.classList.remove('pop');
 clearTimeout(bigT);bigT=setTimeout(()=>{gxb.classList.remove('on');cnt.classList.remove('pop');lastBig=null;stopV();setTimeout(nextQ,250)},(curBig&&curBig.vid?5:DUR[g[0]])*1000+200)}
const LN={};
function laneAdd(u,g,k){const key=u+g[0];let e=LN[key];
 if(e){const i=e.el.querySelector('i');i.textContent='x'+k;i.classList.remove('bump');void i.offsetWidth;i.classList.add('bump');clearTimeout(e.t)}
 else{const el=document.createElement('div');el.className='ln';el.innerHTML=`<span class="av">${u[0]}</span><span><b>${u}</b>${g[1]} göndərdi</span><img src="${ICN(g[0])}" alt=""><i>x${k}</i>`;lane.prepend(el);while(lane.children.length>3)lane.lastChild.remove();e=LN[key]={el}}
 e.t=setTimeout(()=>{e.el.classList.add('out');setTimeout(()=>e.el.remove(),400);delete LN[key]},3500)}
const CM={};
function chatAdd(u,g,k){const key=u+g[0];if(CM[key]&&CM[key].isConnected&&k>1){CM[key].querySelector('.x').textContent='x'+k;return}
 const d=document.createElement('div');d.className='m gft';d.innerHTML=`<img src="${ICN(g[0])}" alt=""><span class="t"><b>${u}</b>${g[1]} göndərdi</span><span class="x">x${k}</span>`;msgs.append(d);msgs.scrollTop=1e5;CM[key]=d}
function fire(u,i,k){const g=GL[i];laneAdd(u,g,k);chatAdd(u,g,k);if(g[2]<=10)return;if(g[2]>=100||(VF[g[0]]&&vel(g[0])))showBig(u,g,k);else scene(g,0)}
window.GiftDemo={fire,open,GL,scene,video:()=>curV&&{src:curV.currentSrc,mode:cvMode,on:gCv.classList.contains('on'),t:curV.currentTime}};
// auto demo
const U=['Kamal','Aysu','RəşadPro','Nigar','Toğrul','Leyla','Orxan'];
const seq=[[1,0,1],[1,0,2],[3,1,1],[1,0,3],[0,6,1],[0,6,2],[0,6,3],[2,2,1],[4,4,1],[5,7,1],[3,1,2],[6,5,1]];
let si=0;const demo=new URLSearchParams(location.search).get('demo')!=='0';
if(demo){const step=()=>{const s=seq[si++%seq.length];fire(U[s[0]],s[1],s[2]);setTimeout(step,s[1]>=4&&s[2]==1?1400:900)};setTimeout(step,600)}
if(new URLSearchParams(location.search).get('panel')==='1')setTimeout(()=>open(true),300);
})();
