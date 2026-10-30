(()=>{
const GL=[['rose','Gül',1,'255,70,90'],['heart','Ürək',5,'83,252,24'],['box','Sürpriz',10,'120,230,60'],['pad','Qızıl pult',50,'255,200,60'],['gem','Almaz',100,'90,190,255'],['rocket','Raket',500,'140,255,90'],['crown','Tac',1000,'255,196,40'],['lion','Şir',5000,'255,170,30']];
const ICN=n=>`icons3d/gift_${n}.png`,coin=s=>`<img src="${ICN('coin')}" width="${s}" height="${s}" alt="">`;
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
// fx layer
const fx=document.createElement('div');fx.className='fx';fx.innerHTML='<canvas></canvas><div class="gxbig"></div><div class="gxcnt"></div>';player.append(fx);
const lane=document.createElement('div');lane.className='lane';player.append(lane);
const cv=fx.querySelector('canvas'),cx=cv.getContext('2d'),big=fx.querySelector('.gxbig'),cnt=fx.querySelector('.gxcnt');
let P=[],raf=0;
const fit=()=>{const r=player.getBoundingClientRect(),d=devicePixelRatio||1;cv.width=r.width*d;cv.height=r.height*d;cx.setTransform(d,0,0,d,0,0)};fit();addEventListener('resize',fit);
function burst(c,n,big){const r=player.getBoundingClientRect(),X=r.width/2,Y=r.height*.46;
 for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=(big?3:2)+Math.random()*(big?9:5);
  P.push({x:X,y:Y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-2,l:1,d:.006+Math.random()*.012,r:1.5+Math.random()*3.5,c:Math.random()<.35?'255,255,255':(Math.random()<.5?c:'255,215,90'),t:Math.random()<.3?1:0,rot:Math.random()*6})}
 if(!raf)loop()}
function loop(){const r=player.getBoundingClientRect();cx.clearRect(0,0,r.width,r.height);cx.globalCompositeOperation='lighter';
 P=P.filter(p=>p.l>0);for(const p of P){p.x+=p.vx;p.y+=p.vy;p.vx*=.985;p.vy=p.vy*.985+.07;p.l-=p.d;p.rot+=.1;
  const al=Math.max(p.l,0);
  if(p.t){cx.save();cx.translate(p.x,p.y);cx.rotate(p.rot);cx.fillStyle=`rgba(${p.c},${al})`;const s=p.r*2.2;cx.beginPath();for(let k=0;k<4;k++){cx.rotate(Math.PI/2);cx.moveTo(0,0);cx.lineTo(s*.25,s*.25);cx.lineTo(0,s*1.6);cx.lineTo(-s*.25,s*.25)}cx.fill();cx.restore()}
  else{const g=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*3);g.addColorStop(0,`rgba(${p.c},${al})`);g.addColorStop(1,`rgba(${p.c},0)`);cx.fillStyle=g;cx.beginPath();cx.arc(p.x,p.y,p.r*3,0,7);cx.fill()}}
 raf=P.length?requestAnimationFrame(loop):0;if(!raf)cx.clearRect(0,0,r.width,r.height)}
let bigT=null,lastBig=null;
function showBig(u,g,k){big.style.setProperty('--gc',g[3]);fx.style.setProperty('--gc',g[3]);
 const same=lastBig&&lastBig.u==u&&lastBig.g==g&&big.classList.contains('on');
 if(!same){big.innerHTML=`<div class="rays"></div><div class="glow"></div><div class="gimg" style="--src:url(${ICN(g[0])})"><img src="${ICN(g[0])}" alt=""><i class="shine"></i></div><div class="bnr"><span class="av">${u[0]}</span><div><b>${u}</b><small><em>${g[1]}</em> göndərdi · ${coin(13)} ${nf(g[2])}</small></div></div>`;
  big.classList.remove('on');void big.offsetWidth;big.classList.add('on')}
 else{big.getAnimations().forEach(a=>{a.currentTime=Math.min(a.currentTime,700)});big.querySelectorAll('.bnr').forEach(b=>b.getAnimations().forEach(a=>a.currentTime=Math.min(a.currentTime,800)))}
 lastBig={u,g};
 if(k>1){cnt.innerHTML=`<small>x</small>${k}`;cnt.classList.remove('pop');void cnt.offsetWidth;cnt.classList.add('pop')}else cnt.classList.remove('pop');
 clearTimeout(bigT);bigT=setTimeout(()=>{big.classList.remove('on');cnt.classList.remove('pop');lastBig=null},4200);
 burst(g[3],g[2]>=1000?180:110,1);setTimeout(()=>burst(g[3],60,0),500)}
const LN={};
function laneAdd(u,g,k){const key=u+g[0];let e=LN[key];
 if(e){const i=e.el.querySelector('i');i.textContent='x'+k;i.classList.remove('bump');void i.offsetWidth;i.classList.add('bump');clearTimeout(e.t)}
 else{const el=document.createElement('div');el.className='ln';el.innerHTML=`<span class="av">${u[0]}</span><span><b>${u}</b>${g[1]} göndərdi</span><img src="${ICN(g[0])}" alt=""><i>x${k}</i>`;lane.prepend(el);while(lane.children.length>3)lane.lastChild.remove();e=LN[key]={el}}
 e.t=setTimeout(()=>{e.el.classList.add('out');setTimeout(()=>e.el.remove(),400);delete LN[key]},3500)}
const CM={};
function chatAdd(u,g,k){const key=u+g[0];if(CM[key]&&CM[key].isConnected&&k>1){CM[key].querySelector('.x').textContent='x'+k;return}
 const d=document.createElement('div');d.className='m gft';d.innerHTML=`<img src="${ICN(g[0])}" alt=""><span class="t"><b>${u}</b>${g[1]} göndərdi</span><span class="x">x${k}</span>`;msgs.append(d);msgs.scrollTop=1e5;CM[key]=d}
function fire(u,i,k){const g=GL[i];laneAdd(u,g,k);chatAdd(u,g,k);if(g[2]>=100)showBig(u,g,k);else burst(g[3],18,0)}
window.GiftDemo={fire,open,GL};
// auto demo
const U=['Kamal','Aysu','RəşadPro','Nigar','Toğrul','Leyla','Orxan'];
const seq=[[1,0,1],[1,0,2],[3,1,1],[1,0,3],[0,6,1],[0,6,2],[0,6,3],[2,2,1],[4,4,1],[5,7,1],[3,1,2],[6,5,1]];
let si=0;const demo=new URLSearchParams(location.search).get('demo')!=='0';
if(demo){const step=()=>{const s=seq[si++%seq.length];fire(U[s[0]],s[1],s[2]);setTimeout(step,s[1]>=4&&s[2]==1?1400:900)};setTimeout(step,600)}
if(new URLSearchParams(location.search).get('panel')==='1')setTimeout(()=>open(true),300);
})();
